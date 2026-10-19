import crypto from 'node:crypto';
import { HynovaDatabase } from './database';

const OTP_SECRET_SALT = process.env.OTP_SECRET_SALT || 'hynova_prod_salt_2026_x87y21';
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds
const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 3;

export interface PhoneValidationResult {
  valid: boolean;
  normalized?: string;
  error?: string;
}

export interface SendOtpResult {
  success: boolean;
  status: 'ACCEPTED' | 'BLOCKED' | 'COOLDOWN' | 'RATE_LIMITED' | 'INVALID_PHONE';
  provider: string;
  providerRequestId?: string;
  message: string;
  cooldownSeconds?: number;
  checklist?: string[];
}

export interface VerifyOtpResult {
  success: boolean;
  status: 'VERIFIED' | 'INVALID_CODE' | 'EXPIRED' | 'EXHAUSTED' | 'NO_ACTIVE_OTP';
  message: string;
  attemptsRemaining?: number;
  sessionToken?: string;
  tenantId?: string;
  userId?: string;
  role?: string;
}

/**
 * Normalize phone numbers to international E.164 format.
 * Supports Kenyan local numbers (07xx, 01xx) and international formats (+xxx).
 */
export function normalizeE164(phone: string): PhoneValidationResult {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number is required.' };
  }

  // Remove spaces, hyphens, parentheses, and dots
  let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');

  // Handle Kenya local formats
  if (cleaned.startsWith('07') && cleaned.length === 10) {
    cleaned = '+254' + cleaned.slice(1);
  } else if (cleaned.startsWith('01') && cleaned.length === 10) {
    cleaned = '+254' + cleaned.slice(1);
  } else if (cleaned.startsWith('254') && (cleaned.length === 12)) {
    cleaned = '+' + cleaned;
  } else if (cleaned.startsWith('+254') && cleaned.length === 13) {
    // Already in Kenya E.164
  } else if (!cleaned.startsWith('+')) {
    // If user typed e.g. international without plus, must be checked
    cleaned = '+' + cleaned;
  }

  // Standard E.164 regex: + followed by 7 to 15 digits
  const e164Regex = /^\+[1-9]\d{6,14}$/;
  if (!e164Regex.test(cleaned)) {
    return {
      valid: false,
      error: `Invalid phone format '${phone}'. Must be a valid Kenyan or international phone number (e.g. +254727547310).`
    };
  }

  return { valid: true, normalized: cleaned };
}

function hashOtp(phone: string, code: string): string {
  return crypto.createHash('sha256').update(`${code}:${phone}:${OTP_SECRET_SALT}`).digest('hex');
}

/**
 * Check provider credentials in environment.
 */
export function getAvailableSmsProvider(): {
  name: 'TWILIO' | 'AFRICAS_TALKING' | 'TEST_RUNNER' | 'NONE';
  configured: boolean;
  details: string;
} {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && (process.env.TWILIO_VERIFY_SERVICE_SID || process.env.TWILIO_PHONE_NUMBER)) {
    return {
      name: 'TWILIO',
      configured: true,
      details: process.env.TWILIO_VERIFY_SERVICE_SID ? 'Twilio Verify API' : 'Twilio Programmable SMS API'
    };
  }

  if (process.env.AT_API_KEY && process.env.AT_USERNAME) {
    return {
      name: 'AFRICAS_TALKING',
      configured: true,
      details: "Africa's Talking SMS API"
    };
  }

  if (process.env.NODE_ENV === 'test' || process.env.HYNOVA_TEST_MODE === 'true') {
    return {
      name: 'TEST_RUNNER',
      configured: true,
      details: 'Isolated Test Provider (Strict Automated Test Runner Only)'
    };
  }

  return {
    name: 'NONE',
    configured: false,
    details: 'No live SMS gateway credentials configured in environment.'
  };
}

/**
 * Initiates delivery of real OTP.
 */
export async function sendPhoneOtp(rawPhone: string): Promise<SendOtpResult> {
  const norm = normalizeE164(rawPhone);
  if (!norm.valid || !norm.normalized) {
    return {
      success: false,
      status: 'INVALID_PHONE',
      provider: 'NONE',
      message: norm.error || 'Invalid phone number.'
    };
  }

  const phone = norm.normalized;

  // Check rate limit & cooldown
  const existingOtp = HynovaDatabase.getLatestOtpForPhone(phone);
  const now = Date.now();

  if (existingOtp) {
    if (now < existingOtp.resend_available_at) {
      const remainingSeconds = Math.ceil((existingOtp.resend_available_at - now) / 1000);
      return {
        success: false,
        status: 'COOLDOWN',
        provider: existingOtp.provider,
        cooldownSeconds: remainingSeconds,
        message: `Please wait ${remainingSeconds} seconds before requesting a new verification code.`
      };
    }
  }

  const provider = getAvailableSmsProvider();

  // If no provider is configured, fail honestly with BLOCKED status and setup checklist
  if (!provider.configured || provider.name === 'NONE') {
    return {
      success: false,
      status: 'BLOCKED',
      provider: 'NONE',
      message: 'Live SMS delivery is BLOCKED: No SMS provider credentials configured in environment.',
      checklist: [
        'To enable live SMS delivery via Twilio: set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_VERIFY_SERVICE_SID in server environment.',
        "To enable live SMS delivery via Africa's Talking: set AT_API_KEY and AT_USERNAME in server environment."
      ]
    };
  }

  // Generate cryptographically secure 6-digit OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const codeHash = hashOtp(phone, otpCode);
  const expiresAt = now + OTP_EXPIRY_MS;
  const resendAvailableAt = now + RESEND_COOLDOWN_MS;

  let providerRequestId = `req_${crypto.randomBytes(8).toString('hex')}`;

  // Deliver via configured provider
  if (provider.name === 'TWILIO') {
    try {
      const sid = process.env.TWILIO_ACCOUNT_SID!;
      const token = process.env.TWILIO_AUTH_TOKEN!;
      const verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;

      if (verifySid) {
        // Use Twilio Verify API
        const url = `https://verify.twilio.com/v2/Services/${verifySid}/Verifications`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            To: phone,
            Channel: 'sms'
          })
        });

        const data: any = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Twilio Verify error HTTP ${res.status}`);
        }
        providerRequestId = data.sid;
      } else if (process.env.TWILIO_PHONE_NUMBER) {
        // Use Twilio Programmable SMS API
        const url = `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': 'Basic ' + Buffer.from(`${sid}:${token}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: new URLSearchParams({
            From: process.env.TWILIO_PHONE_NUMBER,
            To: phone,
            Body: `Your HYNOVA security verification code is: ${otpCode}. Valid for 10 minutes.`
          })
        });

        const data: any = await res.json();
        if (!res.ok) {
          throw new Error(data.message || `Twilio SMS error HTTP ${res.status}`);
        }
        providerRequestId = data.sid;
      } else {
        throw new Error('Twilio requires either TWILIO_VERIFY_SERVICE_SID or TWILIO_PHONE_NUMBER to be configured.');
      }
    } catch (err: any) {
      console.error('[SMS Delivery Failure - Twilio]:', err.message);
      return {
        success: false,
        status: 'BLOCKED',
        provider: 'TWILIO',
        message: `Twilio delivery rejected: ${err.message}`
      };
    }
  } else if (provider.name === 'AFRICAS_TALKING') {
    try {
      const username = process.env.AT_USERNAME!;
      const apiKey = process.env.AT_API_KEY!;
      const url = 'https://api.africastalking.com/version1/messaging';

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'apiKey': apiKey,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: new URLSearchParams({
          username,
          to: phone,
          message: `Your HYNOVA security verification code is: ${otpCode}. Valid for 10 minutes.`
        })
      });

      const data: any = await res.json();
      const recipient = data?.SMSMessageData?.Recipients?.[0];
      if (recipient?.status !== 'Success') {
        throw new Error(recipient?.status || 'Africa\'s Talking SMS delivery failed.');
      }
      providerRequestId = recipient.messageId || providerRequestId;
    } catch (err: any) {
      console.error('[SMS Delivery Failure - Africa\'s Talking]:', err.message);
      return {
        success: false,
        status: 'BLOCKED',
        provider: 'AFRICAS_TALKING',
        message: `Africa's Talking delivery rejected: ${err.message}`
      };
    }
  } else if (provider.name === 'TEST_RUNNER') {
    // In automated test mode only, allow controlled test runner execution
    // Expose test code only to the test harness memory store if explicit test flag is set
    (global as any).__LAST_TEST_OTP = { phone, otpCode };
  }

  // Persist OTP record in database with hash (never store raw code)
  HynovaDatabase.createOtpRecord(phone, codeHash, provider.name, providerRequestId, expiresAt, resendAvailableAt);

  return {
    success: true,
    status: 'ACCEPTED',
    provider: provider.name,
    providerRequestId,
    cooldownSeconds: 60,
    message: `Verification code dispatched to ${phone}. Please enter the code sent to your phone.`
  };
}

/**
 * Verify submitted OTP and issue authenticated session token.
 */
export async function verifyPhoneOtp(rawPhone: string, code: string): Promise<VerifyOtpResult> {
  const norm = normalizeE164(rawPhone);
  if (!norm.valid || !norm.normalized) {
    return {
      success: false,
      status: 'INVALID_CODE',
      message: norm.error || 'Invalid phone number.'
    };
  }

  const phone = norm.normalized;
  const cleanCode = (code || '').trim();

  if (!cleanCode || cleanCode.length < 4 || cleanCode.length > 8) {
    return {
      success: false,
      status: 'INVALID_CODE',
      message: 'Please enter a valid verification code.'
    };
  }

  const otpRecord = HynovaDatabase.getLatestOtpForPhone(phone);
  if (!otpRecord) {
    return {
      success: false,
      status: 'NO_ACTIVE_OTP',
      message: 'No pending verification code found. Please request a new verification code.'
    };
  }

  // Check expiration
  if (Date.now() > otpRecord.expires_at) {
    HynovaDatabase.markOtpStatus(otpRecord.id, 'expired');
    return {
      success: false,
      status: 'EXPIRED',
      message: 'This verification code has expired. Please request a new code.'
    };
  }

  // Check attempt limit
  if (otpRecord.attempts >= MAX_ATTEMPTS) {
    HynovaDatabase.markOtpStatus(otpRecord.id, 'exhausted');
    return {
      success: false,
      status: 'EXHAUSTED',
      message: 'Maximum verification attempts exceeded. Please request a new code.'
    };
  }

  const submittedHash = hashOtp(phone, cleanCode);
  if (submittedHash !== otpRecord.code_hash) {
    const attempts = HynovaDatabase.incrementOtpAttempts(otpRecord.id);
    const remaining = MAX_ATTEMPTS - attempts;
    if (remaining <= 0) {
      HynovaDatabase.markOtpStatus(otpRecord.id, 'exhausted');
      return {
        success: false,
        status: 'EXHAUSTED',
        attemptsRemaining: 0,
        message: 'Incorrect code. Maximum attempts exceeded. Please request a new code.'
      };
    }
    return {
      success: false,
      status: 'INVALID_CODE',
      attemptsRemaining: remaining,
      message: `Incorrect verification code. ${remaining} attempt(s) remaining.`
    };
  }

  // Code is valid! Mark as verified so it cannot be replayed
  HynovaDatabase.markOtpStatus(otpRecord.id, 'verified');

  // Securely get or create customer tenant for this phone number
  const tenant = HynovaDatabase.getOrCreateTenantForPhone(phone);

  // Issue real cryptographic session
  const session = HynovaDatabase.createSession(
    tenant.user_id,
    tenant.tenant_id,
    'CUSTOMER',
    phone,
    tenant.email
  );

  return {
    success: true,
    status: 'VERIFIED',
    message: 'Phone verified successfully.',
    sessionToken: session.sessionToken,
    tenantId: tenant.tenant_id,
    userId: tenant.user_id,
    role: 'CUSTOMER'
  };
}
