import assert from 'node:assert';
import { HynovaDatabase } from '../src/server/database';
import { normalizeE164, sendPhoneOtp, verifyPhoneOtp } from '../src/server/phoneVerification';

async function runSecurityTestSuite() {
  console.log('===============================================================');
  console.log('HYNOVA ENTERPRISES — MULTI-TENANT & PHONE SECURITY AUDIT SUITE');
  console.log('===============================================================');

  process.env.HYNOVA_TEST_MODE = 'true';

  // -------------------------------------------------------------------------
  // TEST SECTION 1: E.164 PHONE NORMALIZATION
  // -------------------------------------------------------------------------
  console.log('\n--- 1. E.164 PHONE NORMALIZATION & VALIDATION ---');
  
  const kenya07 = normalizeE164('0727 547 310');
  assert.strictEqual(kenya07.valid, true);
  assert.strictEqual(kenya07.normalized, '+254727547310');
  console.log('[PASS] Kenyan 07xx Format Normalized:', kenya07.normalized);

  const kenya01 = normalizeE164('0110 123 456');
  assert.strictEqual(kenya01.valid, true);
  assert.strictEqual(kenya01.normalized, '+254110123456');
  console.log('[PASS] Kenyan 01xx Format Normalized:', kenya01.normalized);

  const international = normalizeE164('+1 415 555 2671');
  assert.strictEqual(international.valid, true);
  assert.strictEqual(international.normalized, '+14155552671');
  console.log('[PASS] International E.164 Validated:', international.normalized);

  const invalidJunk = normalizeE164('not-a-number');
  assert.strictEqual(invalidJunk.valid, false);
  console.log('[PASS] Invalid Phone Format Correctly Rejected');

  const invalidShort = normalizeE164('+254');
  assert.strictEqual(invalidShort.valid, false);
  console.log('[PASS] Truncated Phone Number Correctly Rejected');

  // -------------------------------------------------------------------------
  // TEST SECTION 2: LIVE PHONE OTP LIFECYCLE, RATE LIMITS & REPLAY GUARDS
  // -------------------------------------------------------------------------
  console.log('\n--- 2. PHONE OTP LIFECYCLE, SECRECY & REPLAY ATTACK DEFENSE ---');
  const testPhone = '+254799000111';

  // 1. Dispatch OTP
  const sendRes = await sendPhoneOtp(testPhone);
  assert.strictEqual(sendRes.success, true);
  assert.strictEqual(sendRes.status, 'ACCEPTED');
  assert.strictEqual((sendRes as any).otpCode, undefined, 'CRITICAL: Plain text OTP is NEVER returned in response');
  console.log('[PASS] OTP Request Accepted without Leaking Plaintext Code');

  // Verify DB does not store plaintext code
  const otpRow = HynovaDatabase.getLatestOtpForPhone(testPhone);
  assert.ok(otpRow, 'OTP record exists in database');
  assert.ok(otpRow.code_hash && otpRow.code_hash.length === 64, 'Stored as 64-character SHA-256 hash');
  console.log('[PASS] Database Stores Only SHA-256 Hash of Verification Code');

  // 2. Cooldown Enforcement: Requesting again immediately must fail with 429 COOLDOWN
  const immediateResend = await sendPhoneOtp(testPhone);
  assert.strictEqual(immediateResend.success, false);
  assert.strictEqual(immediateResend.status, 'COOLDOWN');
  assert.ok(immediateResend.cooldownSeconds && immediateResend.cooldownSeconds > 0);
  console.log('[PASS] Resend Cooldown Enforced (Blocked for ' + immediateResend.cooldownSeconds + 's)');

  // 3. Rejection of Hardcoded / Simulated Code
  const fakeCodeRes = await verifyPhoneOtp(testPhone, '749210');
  assert.strictEqual(fakeCodeRes.success, false);
  assert.strictEqual(fakeCodeRes.status, 'INVALID_CODE');
  console.log('[PASS] Legacy / Simulated Code (749210) Rejected');

  // 4. Test Verification with the actual generated code
  const generatedCode = (global as any).__LAST_TEST_OTP?.otpCode;
  assert.ok(generatedCode, 'Captured test OTP from test harness memory');

  const verifyRes = await verifyPhoneOtp(testPhone, generatedCode);
  assert.strictEqual(verifyRes.success, true);
  assert.strictEqual(verifyRes.status, 'VERIFIED');
  assert.ok(verifyRes.sessionToken, 'Cryptographic session token issued');
  assert.ok(verifyRes.tenantId, 'Tenant ID allocated');
  assert.ok(verifyRes.userId, 'User ID allocated');
  console.log('[PASS] Valid OTP Successfully Verified. Session Issued:', {
    tenantId: verifyRes.tenantId,
    userId: verifyRes.userId
  });

  // 5. Replay Attack Defense: Using the same code again MUST fail
  const replayRes = await verifyPhoneOtp(testPhone, generatedCode);
  assert.strictEqual(replayRes.success, false);
  console.log('[PASS] Replay Attack Blocked: Code Cannot Be Re-used');

  // 6. Max Attempts Defense
  const brutePhone = '+254799000222';
  // Force resend timestamp in DB
  await sendPhoneOtp(brutePhone);
  const bad1 = await verifyPhoneOtp(brutePhone, '000001');
  assert.strictEqual(bad1.attemptsRemaining, 2);
  const bad2 = await verifyPhoneOtp(brutePhone, '000002');
  assert.strictEqual(bad2.attemptsRemaining, 1);
  const bad3 = await verifyPhoneOtp(brutePhone, '000003');
  assert.strictEqual(bad3.status, 'EXHAUSTED');
  console.log('[PASS] Brute-force Throttling: Code Exhausted After 3 Failed Attempts');

  // -------------------------------------------------------------------------
  // TEST SECTION 3: MULTI-TENANT ISOLATION & IDOR ATTACK RESISTANCE
  // -------------------------------------------------------------------------
  console.log('\n--- 3. MULTI-TENANT ISOLATION & ZERO-TRUST AUTHORIZATION ---');

  // Create Customer A
  const tenantA = HynovaDatabase.getOrCreateTenantForPhone('+254700000001', 'Alice Mutua', 'alice@example.com');
  const sessionA = HynovaDatabase.createSession(tenantA.user_id, tenantA.tenant_id, 'CUSTOMER', '+254700000001');

  // Create Customer B
  const tenantB = HynovaDatabase.getOrCreateTenantForPhone('+254700000002', 'Bob Kamau', 'bob@example.com');
  const sessionB = HynovaDatabase.createSession(tenantB.user_id, tenantB.tenant_id, 'CUSTOMER', '+254700000002');

  assert.notStrictEqual(tenantA.tenant_id, tenantB.tenant_id, 'Distinct Tenants Allocated');
  console.log('[PASS] Tenant A (' + tenantA.tenant_id + ') != Tenant B (' + tenantB.tenant_id + ')');

  // Customer A creates a Quote
  const quoteRefA = 'HYN-QTE-ALICE-101';
  HynovaDatabase.saveQuote(tenantA.tenant_id, tenantA.user_id, {
    quoteRef: quoteRefA,
    purchaserName: 'Alice Mutua',
    projectScope: 'AI CCTV 8-Camera Perimeter System',
    hardwareSubtotalKES: 85000,
    labourKES: 18000,
    vatKES: 16480,
    grandTotalKES: 119480,
    status: 'Active Quote'
  });

  // Customer B creates a Quote
  const quoteRefB = 'HYN-QTE-BOB-202';
  HynovaDatabase.saveQuote(tenantB.tenant_id, tenantB.user_id, {
    quoteRef: quoteRefB,
    purchaserName: 'Bob Kamau',
    projectScope: '5kW Hybrid Solar System',
    hardwareSubtotalKES: 280000,
    labourKES: 45000,
    vatKES: 52000,
    grandTotalKES: 377000,
    status: 'Active Quote'
  });

  // 1. Customer A can read their own quote
  const aliceOwnQuote = HynovaDatabase.getQuoteByTenantAndRef(tenantA.tenant_id, quoteRefA);
  assert.ok(aliceOwnQuote, 'Alice can read her own quote');
  assert.strictEqual(aliceOwnQuote.quote_ref, quoteRefA);
  console.log('[PASS] Customer A Reads Own Quote');

  // 2. IDOR Attack: Customer B attempts to read Customer A quote using exact ID
  const bobAccessToAliceQuote = HynovaDatabase.getQuoteByTenantAndRef(tenantB.tenant_id, quoteRefA);
  assert.strictEqual(bobAccessToAliceQuote, null, 'IDOR Denied: Bob cannot read Alice quote');
  console.log('[PASS] IDOR Read Attack Blocked: Customer B Cannot Read Customer A Quote');

  // 3. IDOR Mutation Attack: Customer B attempts to update Alice quote status
  const bobUpdateAliceQuote = HynovaDatabase.updateQuoteStatus(tenantB.tenant_id, quoteRefA, 'Cancelled by Bob');
  assert.strictEqual(bobUpdateAliceQuote, false, 'IDOR Mutation Denied: Bob cannot modify Alice quote');
  // Verify Alice quote remains unchanged
  const aliceQuoteAfterAttack = HynovaDatabase.getQuoteByTenantAndRef(tenantA.tenant_id, quoteRefA);
  assert.strictEqual(aliceQuoteAfterAttack?.status, 'Active Quote');
  console.log('[PASS] IDOR Mutation Attack Blocked: Customer B Cannot Modify Customer A Quote');

  // 4. Customer A list query returns only Customer A quotes
  const aliceQuotesList = HynovaDatabase.getQuotesByTenant(tenantA.tenant_id);
  assert.ok(aliceQuotesList.every(q => q.tenant_id === tenantA.tenant_id));
  assert.ok(!aliceQuotesList.some(q => q.quote_ref === quoteRefB));
  console.log('[PASS] Customer A Query Strictly Isolated (Zero Leakage of Customer B Quotes)');

  // 5. Tenant Address & Support Ticket Isolation
  const addrA = HynovaDatabase.saveAddress(tenantA.tenant_id, tenantA.user_id, 'Alice Residence', 'Kiambu', 'Runda Palm Grove');
  const bobAddresses = HynovaDatabase.getAddressesByTenant(tenantB.tenant_id);
  assert.ok(!bobAddresses.some(a => a.address_id === addrA.address_id), 'Bob cannot see Alice address');
  console.log('[PASS] Customer Saved Addresses Strictly Isolated by Tenant ID');

  const ticketA = HynovaDatabase.saveSupportTicket(tenantA.tenant_id, tenantA.user_id, 'Inverter Alarm', 'Battery SOC warning on Deye 5kW');
  const bobTickets = HynovaDatabase.getSupportTicketsByTenant(tenantB.tenant_id);
  assert.ok(!bobTickets.some(t => t.ticket_id === ticketA.ticket_id), 'Bob cannot see Alice support ticket');
  console.log('[PASS] Customer Support Tickets Strictly Isolated by Tenant ID');

  // 6. Safe Account Recovery / Same-Phone Re-authentication
  const reAuthTenant = HynovaDatabase.getOrCreateTenantForPhone('+254700000001');
  assert.strictEqual(reAuthTenant.tenant_id, tenantA.tenant_id, 'Same phone number signs into existing tenant');
  assert.strictEqual(reAuthTenant.user_id, tenantA.user_id, 'User ID is stable and preserved across logins');
  console.log('[PASS] Same Phone Number Safely Reconnects to Existing Tenant Without Duplication');

  
  // -------------------------------------------------------------------------
  // TEST SECTION 4: HTTP API ATTACK SUITE (DIRECT NETWORK ADVERSARIAL TESTS)
  // -------------------------------------------------------------------------
  console.log('\n--- 4. HTTP API DIRECT NETWORK ATTACK SUITE ---');

  const http = await import('node:http');
  const { default: expressApp } = await import('../server');

  // Launch test server on dynamic port
  const server = http.createServer(expressApp);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as any).port;
  const baseUrl = 'http://localhost:' + port;

  async function apiCall(method: string, path: string, headers: Record<string, string> = {}, body?: any) {
    const res = await fetch(baseUrl + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...headers },
      body: body ? JSON.stringify(body) : undefined
    });
    const json = await res.json().catch(() => ({}));
    return { status: res.status, data: json };
  }

  // 1. Anonymous visitor cannot access customer quotes
  const anonQuotes = await apiCall('GET', '/api/customer/quotes');
  assert.strictEqual(anonQuotes.status, 401, 'Anonymous quotes access must return 401');
  console.log('[PASS] Anonymous Visitor Direct Access to /api/customer/quotes Returns 401');

  // 2. Anonymous visitor cannot access technician roster
  const anonTechs = await apiCall('GET', '/api/technicians');
  assert.strictEqual(anonTechs.status, 403, 'Anonymous technician list must return 403');
  console.log('[PASS] Anonymous Visitor Direct Access to /api/technicians Returns 403');

  // 3. Forged Role Header (Privilege Escalation Attack)
  const spoofedRole = await apiCall('GET', '/api/technicians', {
    'x-hynova-role': 'ADMIN'
  });
  assert.strictEqual(spoofedRole.status, 403, 'Forged role header without verified token must be rejected with 403');
  console.log('[PASS] Header Role Spoofing (x-hynova-role: ADMIN) Blocked with 403');

  // 4. Forged Email Header (Email Spoofing Attack)
  const spoofedEmail = await apiCall('GET', '/api/technicians', {
    'x-user-email': 'admin@hynovaenterprises.com'
  });
  assert.strictEqual(spoofedEmail.status, 403, 'Forged email header without verified token must be rejected with 403');
  console.log('[PASS] Email Spoofing Attack Blocked with 403');

  // 5. Cross-Tenant IDOR via Direct API Call
  // Customer A Quote creation
  const createQuoteRes = await apiCall('POST', '/api/sheets/quote/create', {
    Authorization: 'Bearer ' + sessionA.sessionToken
  }, {
    purchaserName: 'Alice Mutua',
    projectScope: 'AI CCTV Commercial Package',
    hardwareSubtotalKES: 50000,
    labourKES: 10000
  });
  assert.strictEqual(createQuoteRes.status, 200);
  const createdRef = createQuoteRes.data.quote.quoteRef;
  assert.ok(createdRef);

  // Customer B attempts direct API fetch of Customer A's quote
  const bobFetchAlice = await apiCall('GET', '/api/customer/quotes/' + createdRef, {
    Authorization: 'Bearer ' + sessionB.sessionToken
  });
  assert.strictEqual(bobFetchAlice.status, 403, 'Bob must receive 403 when fetching Alice quote');
  console.log('[PASS] Direct API Cross-Tenant IDOR Fetch Blocked with 403 Forbidden');

  // Customer B attempts direct API modification of Customer A's quote
  const bobPatchAlice = await apiCall('PATCH', '/api/customer/quotes/' + createdRef + '/status', {
    Authorization: 'Bearer ' + sessionB.sessionToken
  }, {
    status: 'Compromised by Attacker'
  });
  assert.strictEqual(bobPatchAlice.status, 403, 'Bob must receive 403 when modifying Alice quote');
  console.log('[PASS] Direct API Cross-Tenant IDOR Status Tampering Blocked with 403 Forbidden');

  // Customer A can fetch their own quote
  const aliceFetchOwn = await apiCall('GET', '/api/customer/quotes/' + createdRef, {
    Authorization: 'Bearer ' + sessionA.sessionToken
  });
  assert.strictEqual(aliceFetchOwn.status, 200, 'Alice can fetch her own quote');
  assert.strictEqual(aliceFetchOwn.data.quote.quote_ref, createdRef);
  console.log('[PASS] Direct API Customer A Fetch of Own Quote Returns 200');

  server.close();

  console.log('\n===============================================================');
  console.log('ALL ADVERSARIAL MULTI-TENANT & PHONE SECURITY TESTS PASSED!');
  console.log('===============================================================');
}

runSecurityTestSuite().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
