import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'hynova_production.db');
export const db = new DatabaseSync(DB_PATH);

// Initialize Tables and Indexes
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS tenants (
    tenant_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    name TEXT,
    email TEXT,
    status TEXT DEFAULT 'active',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'CUSTOMER',
    phone TEXT,
    email TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    session_id TEXT PRIMARY KEY,
    token_hash TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    tenant_id TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    expires_at INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS quotes (
    quote_ref TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    purchaser_name TEXT NOT NULL,
    project_scope TEXT NOT NULL,
    hardware_subtotal_kes INTEGER NOT NULL,
    labour_kes INTEGER NOT NULL,
    vat_kes INTEGER NOT NULL,
    grand_total_kes INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active Quote',
    created_at TEXT NOT NULL,
    raw_json TEXT
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    enquiry_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    county TEXT,
    scope TEXT,
    status TEXT DEFAULT 'Pending Assessment',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    quote_ref TEXT NOT NULL,
    amount_kes INTEGER NOT NULL,
    payment_status TEXT DEFAULT 'Escrow Pending',
    escrow_status TEXT DEFAULT 'Unfunded',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS jobs (
    job_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    order_id TEXT,
    technician_id TEXT,
    site_location TEXT,
    status TEXT DEFAULT 'Queued for Dispatch',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS addresses (
    address_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    label TEXT NOT NULL,
    county TEXT NOT NULL,
    estate_or_landmark TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS support_tickets (
    ticket_id TEXT PRIMARY KEY,
    tenant_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS otp_verifications (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_request_id TEXT,
    attempts INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending',
    expires_at INTEGER NOT NULL,
    resend_available_at INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_tenants_phone ON tenants(phone);
  CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
  CREATE INDEX IF NOT EXISTS idx_quotes_tenant_id ON quotes(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_enquiries_tenant_id ON enquiries(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_orders_tenant_id ON orders(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_jobs_tenant_id ON jobs(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_addresses_tenant_id ON addresses(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_support_tickets_tenant_id ON support_tickets(tenant_id);
  CREATE INDEX IF NOT EXISTS idx_otp_phone ON otp_verifications(phone);
`);

export interface TenantRecord {
  tenant_id: string;
  user_id: string;
  phone: string;
  name: string | null;
  email: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface SessionRecord {
  session_id: string;
  token_hash: string;
  user_id: string;
  tenant_id: string;
  role: string;
  phone: string | null;
  email: string | null;
  expires_at: number;
  created_at: string;
}

export interface QuoteRecord {
  quote_ref: string;
  tenant_id: string;
  user_id: string;
  purchaser_name: string;
  project_scope: string;
  hardware_subtotal_kes: number;
  labour_kes: number;
  vat_kes: number;
  grand_total_kes: number;
  status: string;
  created_at: string;
  raw_json?: string;
}

export class HynovaDatabase {
  public static readonly db = db;

  // --- TENANT & ACCOUNT MANAGEMENT ---
  public static getOrCreateTenantForPhone(phone: string, name?: string, email?: string): TenantRecord {
    const existing = db.prepare('SELECT * FROM tenants WHERE phone = ?').get(phone) as unknown as TenantRecord | undefined;
    if (existing) {
      if (name || email) {
        db.prepare(`
          UPDATE tenants 
          SET name = COALESCE(?, name), email = COALESCE(?, email), updated_at = ? 
          WHERE tenant_id = ?
        `).run(name || null, email || null, new Date().toISOString(), existing.tenant_id);
      }
      return db.prepare('SELECT * FROM tenants WHERE tenant_id = ?').get(existing.tenant_id) as unknown as TenantRecord;
    }

    const tenantId = `ten_${crypto.randomBytes(12).toString('hex')}`;
    const userId = `usr_${crypto.randomBytes(12).toString('hex')}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO tenants (tenant_id, user_id, phone, name, email, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'active', ?, ?)
    `).run(tenantId, userId, phone, name || null, email || null, now, now);

    db.prepare(`
      INSERT INTO users (user_id, tenant_id, role, phone, email, created_at)
      VALUES (?, ?, 'CUSTOMER', ?, ?, ?)
    `).run(userId, tenantId, phone, email || null, now);

    return db.prepare('SELECT * FROM tenants WHERE tenant_id = ?').get(tenantId) as unknown as TenantRecord;
  }

  public static getTenantById(tenantId: string): TenantRecord | undefined {
    return db.prepare('SELECT * FROM tenants WHERE tenant_id = ?').get(tenantId) as unknown as TenantRecord | undefined;
  }

  // --- CRYPTOGRAPHIC SESSION MANAGEMENT ---
  public static createSession(
    userId: string,
    tenantId: string,
    role: string,
    phone?: string | null,
    email?: string | null,
    durationMs: number = 7 * 24 * 60 * 60 * 1000 // 7 days default
  ): { sessionToken: string; expiresAt: number; sessionId: string } {
    const sessionId = `ses_${crypto.randomBytes(16).toString('hex')}`;
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const expiresAt = Date.now() + durationMs;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO sessions (session_id, token_hash, user_id, tenant_id, role, phone, email, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(sessionId, tokenHash, userId, tenantId, role, phone || null, email || null, expiresAt, now);

    return { sessionToken, expiresAt, sessionId };
  }

  public static getSessionByToken(sessionToken: string): SessionRecord | null {
    if (!sessionToken || typeof sessionToken !== 'string') return null;
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const session = db.prepare('SELECT * FROM sessions WHERE token_hash = ?').get(tokenHash) as unknown as SessionRecord | undefined;
    if (!session) return null;

    if (Date.now() > session.expires_at) {
      db.prepare('DELETE FROM sessions WHERE session_id = ?').run(session.session_id);
      return null;
    }
    return session;
  }

  public static deleteSessionByToken(sessionToken: string): boolean {
    if (!sessionToken) return false;
    const tokenHash = crypto.createHash('sha256').update(sessionToken).digest('hex');
    const res = db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash);
    return (res as any)?.changes > 0;
  }

  // --- TENANT-ISOLATED QUOTES ---
  public static saveQuote(
    tenantId: string,
    userId: string,
    quote: {
      quoteRef: string;
      purchaserName: string;
      projectScope: string;
      hardwareSubtotalKES: number;
      labourKES: number;
      vatKES: number;
      grandTotalKES: number;
      status?: string;
      rawJson?: any;
    }
  ): QuoteRecord {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT OR REPLACE INTO quotes (
        quote_ref, tenant_id, user_id, purchaser_name, project_scope,
        hardware_subtotal_kes, labour_kes, vat_kes, grand_total_kes, status, created_at, raw_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      quote.quoteRef,
      tenantId,
      userId,
      quote.purchaserName,
      quote.projectScope,
      quote.hardwareSubtotalKES,
      quote.labourKES,
      quote.vatKES,
      quote.grandTotalKES,
      quote.status || 'Active Quote',
      now,
      quote.rawJson ? JSON.stringify(quote.rawJson) : null
    );

    return db.prepare('SELECT * FROM quotes WHERE quote_ref = ?').get(quote.quoteRef) as unknown as QuoteRecord;
  }

  public static getQuotesByTenant(tenantId: string): QuoteRecord[] {
    return db.prepare('SELECT * FROM quotes WHERE tenant_id = ? ORDER BY created_at DESC').all(tenantId) as unknown as QuoteRecord[];
  }

  public static getQuoteByTenantAndRef(tenantId: string, quoteRef: string): QuoteRecord | null {
    const quote = db.prepare('SELECT * FROM quotes WHERE tenant_id = ? AND quote_ref = ?').get(tenantId, quoteRef);
    return (quote as unknown as QuoteRecord) || null;
  }

  public static updateQuoteStatus(tenantId: string, quoteRef: string, newStatus: string): boolean {
    const res = db.prepare('UPDATE quotes SET status = ? WHERE tenant_id = ? AND quote_ref = ?').run(newStatus, tenantId, quoteRef);
    return (res as any)?.changes > 0;
  }

  // --- TENANT-ISOLATED ADDRESSES ---
  public static saveAddress(tenantId: string, userId: string, label: string, county: string, estateOrLandmark: string): any {
    const addressId = `addr_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO addresses (address_id, tenant_id, user_id, label, county, estate_or_landmark, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(addressId, tenantId, userId, label, county, estateOrLandmark, now);

    return db.prepare('SELECT * FROM addresses WHERE address_id = ?').get(addressId);
  }

  public static getAddressesByTenant(tenantId: string): any[] {
    return db.prepare('SELECT * FROM addresses WHERE tenant_id = ? ORDER BY created_at DESC').all(tenantId) as any[];
  }

  // --- TENANT-ISOLATED SUPPORT TICKETS ---
  public static saveSupportTicket(tenantId: string, userId: string, subject: string, message: string): any {
    const ticketId = `tkt_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO support_tickets (ticket_id, tenant_id, user_id, subject, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, 'Open', ?)
    `).run(ticketId, tenantId, userId, subject, message, now);

    return db.prepare('SELECT * FROM support_tickets WHERE ticket_id = ?').get(ticketId);
  }

  public static getSupportTicketsByTenant(tenantId: string): any[] {
    return db.prepare('SELECT * FROM support_tickets WHERE tenant_id = ? ORDER BY created_at DESC').all(tenantId) as any[];
  }

  // --- TENANT-ISOLATED ORDERS & JOBS ---
  public static saveOrder(tenantId: string, userId: string, quoteRef: string, amountKes: number): any {
    const orderId = `ord_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO orders (order_id, tenant_id, user_id, quote_ref, amount_kes, payment_status, escrow_status, created_at)
      VALUES (?, ?, ?, ?, ?, 'Escrow Funded', '40% Mobilization Held in Escrow', ?)
    `).run(orderId, tenantId, userId, quoteRef, amountKes, now);

    return db.prepare('SELECT * FROM orders WHERE order_id = ?').get(orderId);
  }

  public static getOrdersByTenant(tenantId: string): any[] {
    return db.prepare('SELECT * FROM orders WHERE tenant_id = ? ORDER BY created_at DESC').all(tenantId) as any[];
  }

  public static getJobsByTenant(tenantId: string): any[] {
    return db.prepare('SELECT * FROM jobs WHERE tenant_id = ? ORDER BY created_at DESC').all(tenantId) as any[];
  }

  // --- PHONE OTP VERIFICATIONS ---
  public static createOtpRecord(
    phone: string,
    codeHash: string,
    provider: string,
    providerRequestId: string,
    expiresAt: number,
    resendAvailableAt: number
  ): string {
    const id = `otp_${crypto.randomBytes(12).toString('hex')}`;
    const now = new Date().toISOString();

    // Invalidate prior pending codes for this phone
    db.prepare(`UPDATE otp_verifications SET status = 'superseded' WHERE phone = ? AND status = 'pending'`).run(phone);

    db.prepare(`
      INSERT INTO otp_verifications (id, phone, code_hash, provider, provider_request_id, attempts, status, expires_at, resend_available_at, created_at)
      VALUES (?, ?, ?, ?, ?, 0, 'pending', ?, ?, ?)
    `).run(id, phone, codeHash, provider, providerRequestId, expiresAt, resendAvailableAt, now);

    return id;
  }

  public static getLatestOtpForPhone(phone: string): any {
    return db.prepare(`
      SELECT * FROM otp_verifications 
      WHERE phone = ? AND status = 'pending'
      ORDER BY expires_at DESC LIMIT 1
    `).get(phone);
  }

  public static incrementOtpAttempts(id: string): number {
    db.prepare('UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = ?').run(id);
    const row = db.prepare('SELECT attempts FROM otp_verifications WHERE id = ?').get(id) as any;
    return row?.attempts || 0;
  }

  public static markOtpStatus(id: string, status: 'verified' | 'expired' | 'exhausted'): void {
    db.prepare('UPDATE otp_verifications SET status = ? WHERE id = ?').run(status, id);
  }

  // --- DURABILITY & BACKUP CONTROLS ---
  public static checkpointWal(): void {
    db.exec('PRAGMA wal_checkpoint(TRUNCATE);');
  }

  public static createBackup(destinationPath?: string): { success: boolean; path: string; size: number } {
    const backupDir = destinationPath ? path.dirname(destinationPath) : path.join(DATA_DIR, 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const targetFile = destinationPath || path.join(backupDir, `hynova_backup_${Date.now()}.db`);
    if (fs.existsSync(targetFile)) {
      fs.unlinkSync(targetFile);
    }
    db.exec(`VACUUM INTO '${targetFile.replace(/'/g, "''")}';`);
    const stats = fs.statSync(targetFile);
    return {
      success: true,
      path: targetFile,
      size: stats.size
    };
  }
}
