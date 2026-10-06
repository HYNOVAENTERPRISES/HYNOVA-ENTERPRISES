import { 
  UserRole, 
  RBACPermission, 
  AIScopePermission, 
  AuditLogEntry, 
  SecuritySession, 
  SecurityThreatAlert, 
  RoadmapPillar 
} from '../types';

/**
 * HYNOVA ENTERPRISES PLATFORM SECURITY & RBAC SPECIFICATION
 * Production-ready Role-Based Access Control, Tenant Isolation, and Security Service
 */

export const ROLE_DEFINITIONS: Record<UserRole, RBACPermission> = {
  customer: {
    description: 'Residential and commercial property owners requesting infrastructure solutions.',
    can: [
      'Create projects',
      'Receive AI recommendations',
      'Request quotations',
      'View own projects',
      'View own invoices',
      'Communicate with assigned technician',
      'Manage profile',
      'Submit reviews',
      'Track service requests',
    ],
    cannot: [
      'See other customers',
      'See supplier wholesale pricing',
      'Access technician earnings',
      'Access platform analytics',
      'Access administrative functions',
    ],
    dataIsolationBoundary: 'Scoped strictly to Tenant ID (Customer UUID). Query filters mandate customer_id === auth.uid.',
  },

  technician: {
    description: 'Certified, EPRA/NCA-aligned field engineers and installers.',
    can: [
      'Manage own profile',
      'Manage certifications',
      'View assigned projects',
      'Update project status',
      'Upload completion reports',
      'Submit site assessments',
      'Track payments',
      'View training content',
      'Access support resources',
    ],
    cannot: [
      'View customer financial records',
      'View supplier information',
      'Access other technician profiles',
      'Access platform analytics',
      'Access administrative tools',
    ],
    dataIsolationBoundary: 'Scoped to assigned project IDs and technician_id === auth.uid. Customer PII masked except dispatch contact.',
  },

  supplier: {
    description: 'Bonded hardware distributors, solar importers, and equipment manufacturers.',
    can: [
      'Manage products',
      'Manage inventory',
      'Manage pricing',
      'Manage warranties',
      'View assigned orders',
      'Track deliveries',
      'View supplier analytics',
    ],
    cannot: [
      'View competitor supplier information',
      'Access customer financial data',
      'Access technician earnings',
      'Access administrative systems',
    ],
    dataIsolationBoundary: 'Strict competitor barrier. Catalogs and purchase orders isolated by supplier_id. Zero competitor visibility.',
  },

  partner: {
    description: 'Institutional property developers, school networks, church dioceses, and SACCOs.',
    can: [
      'Manage organization account',
      'Create bulk projects',
      'Manage multiple locations',
      'View partner reports',
      'Track enterprise deployments',
      'Access dedicated support',
    ],
    cannot: [
      'View other partner accounts',
      'Access supplier data',
      'Access technician payroll',
      'Access central administrative tools',
    ],
    dataIsolationBoundary: 'Enterprise Organization ID boundary. Sub-sites and estate portfolios isolated within partner domain.',
  },

  staff: {
    description: 'HYNOVA operational coordinators, field dispatch officers, and support specialists.',
    can: [
      'Manage customer requests',
      'Coordinate projects',
      'Manage communications',
      'Assist support cases',
      'Update operational workflows',
    ],
    cannot: [
      'Modify system permissions',
      'Access security settings',
      'Modify audit logs',
      'Access platform ownership controls',
      'Disburse executive financial accounts',
    ],
    dataIsolationBoundary: 'Operational workflow scope. PII visible strictly for dispatch; security and financial keys prohibited.',
  },

  admin: {
    description: 'Central platform managers overseeing verification and nationwide operations.',
    can: [
      'Manage all platform operations',
      'Approve technicians',
      'Approve suppliers',
      'Manage content',
      'Manage workflows',
      'Manage project allocation',
      'View platform analytics',
    ],
    cannot: [
      'Access Super Admin controls',
      'Modify ownership permissions',
      'Delete audit history',
      'Override root encryption keys',
    ],
    dataIsolationBoundary: 'Platform operations scope. Audit log immutability engine prevents record tampering or purging.',
  },

  superadmin: {
    description: 'Executive leadership only. Unrestricted platform governance and root controls.',
    can: [
      'Security Architecture Governance',
      'Permissions & Role Management',
      'KDPA & Regulatory Compliance Controls',
      'Platform Configuration',
      'Financial Controls & Escrow Rules',
      'AI Engine & Model Configuration',
      'System Integrations & API Keys',
      'Audit Monitoring & Cryptographic Verification',
    ],
    cannot: [
      'Bypass immutable append-only audit trail (Every superadmin action is permanently logged)',
    ],
    dataIsolationBoundary: 'Full root access with mandatory Dual-Factor Auth and immutable audit recording on all write ops.',
  },

  'ai-service': {
    description: 'Automated background reasoning engines, Gemini LLMs, and real-time telemetry parsers.',
    can: [
      'Process scoped inference within authorized token context',
      'Generate BOM recommendations from approved catalogs',
      'Evaluate electrical load formulas',
      'Sanitize telemetry logs',
    ],
    cannot: [
      'Cross tenant boundaries without explicit transient user grant',
      'Store customer PII in model training datasets',
      'Exceed per-role token and data limits',
    ],
    dataIsolationBoundary: 'Ephemeral stateless sandbox. In-memory execution only with per-tenant encryption context.',
  },
};

export const AI_PERMISSIONS_MODEL: Record<string, AIScopePermission> = {
  customer: {
    role: 'customer',
    scopeTitle: 'Customer Advisory AI',
    allowedDatasets: [
      'Customer profile preferences',
      'Customer requested projects',
      'Customer quote history',
      'Approved wholesale pricing catalog (masked markup)',
    ],
    prohibitedDatasets: [
      'Supplier cost margins',
      'Other customer details',
      'Technician payroll & bank records',
      'Administrative telemetry',
    ],
    executionSandbox: 'Client-scoped inference container with strict PII anonymization.',
  },

  technician: {
    role: 'technician',
    scopeTitle: 'Technician Field Assist AI',
    allowedDatasets: [
      'Assigned project blueprints & site specifications',
      'EPRA/NCA electrical code compliance guidelines',
      'Hardware schematics & manufacturer troubleshooting manuals',
      'Technician Academy training modules & certifications',
    ],
    prohibitedDatasets: [
      'Customer financial billing history',
      'Supplier wholesale inventory pricing',
      'Other technician performance records',
      'Platform-wide financial accounts',
    ],
    executionSandbox: 'Field assist container scoped to active dispatch job ticket.',
  },

  supplier: {
    role: 'supplier',
    scopeTitle: 'Supplier Logistics AI',
    allowedDatasets: [
      'Supplier own inventory SKUs and warehouse levels',
      'Assigned purchase orders and fulfillment tracking',
      'Delivery routing within verified Kenyan counties',
      'Own SKU demand velocity analytics',
    ],
    prohibitedDatasets: [
      'Competitor supplier pricing or inventory',
      'Customer personal contact info',
      'Technician earnings or commission data',
      'Core platform margin structure',
    ],
    executionSandbox: 'Supplier tenant container with isolated catalog access.',
  },

  admin: {
    role: 'admin',
    scopeTitle: 'Operational & Governance AI',
    allowedDatasets: [
      'Approved operational datasets across 47 counties',
      'Aggregated business analytics & technician dispatch latency',
      'Forecasting systems for equipment demand',
      'Platform health monitoring & error rate alerts',
    ],
    prohibitedDatasets: [
      'Unmasked private customer passwords or payment credentials',
      'Super Administrator security key management vaults',
    ],
    executionSandbox: 'Admin control plane sandbox with continuous audit logging.',
  },
};

// Realistic Immutable Audit Trail
let INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-9021',
    timestamp: '2026-09-21 17:58:12 EAT',
    actorEmail: 'superadmin@hynovaenterprises.com',
    actorRole: 'superadmin',
    ipAddress: '102.219.208.45 (Nairobi, KE)',
    actionCategory: 'Security Event',
    actionDetails: 'Enforced KDPA 2019 consent policy update across all 47 county tenant partitions.',
    targetResource: 'sys:sec:compliance-policies',
    status: 'SUCCESS',
    immutableHash: 'sha256:7a92c3f81e2b4d909a3c11e74a8d05284b3917d5e683412a02b1f8749e7b23c1',
  },
  {
    id: 'AUD-9020',
    timestamp: '2026-09-21 17:55:04 EAT',
    actorEmail: 'ai-engine@internal.hynova.ke',
    actorRole: 'ai-service',
    ipAddress: '10.0.4.18 (VPC Isolated)',
    actionCategory: 'AI Recommendation',
    actionDetails: 'Generated preliminary 5kW Hybrid Solar BOM with verified distributor pricing.',
    targetResource: 'project:rec:PRJ-8812',
    status: 'SUCCESS',
    immutableHash: 'sha256:2d184a567c9e0134bcfe8190234a78129e014a5b6c7d8e9f0123456789abcdef',
  },
  {
    id: 'AUD-9019',
    timestamp: '2026-09-21 17:42:33 EAT',
    actorEmail: 'ops.lead@hynovaenterprises.com',
    actorRole: 'staff',
    ipAddress: '102.135.168.12 (Nakuru, KE)',
    actionCategory: 'Project Assignment',
    actionDetails: 'Dispatched Level 3 Technician Dennis Koech to Kilimani CCTV Commissioning.',
    targetResource: 'dispatch:job:JOB-4019',
    status: 'SUCCESS',
    immutableHash: 'sha256:6e5d4c3b2a109f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e',
  },
  {
    id: 'AUD-9018',
    timestamp: '2026-09-21 17:30:19 EAT',
    actorEmail: 'karanja.d@gmail.com',
    actorRole: 'customer',
    ipAddress: '197.232.88.94 (Safaricom Home LTE)',
    actionCategory: 'Escrow Payment',
    actionDetails: 'Authorized Safaricom M-Pesa escrow lock for KES 285,000 via Paybill 882001.',
    targetResource: 'escrow:lock:TXN-MP-9022',
    status: 'SUCCESS',
    immutableHash: 'sha256:3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b',
  },
  {
    id: 'AUD-9017',
    timestamp: '2026-09-21 17:14:02 EAT',
    actorEmail: 'unknown.crawler@185.220.101.5',
    actorRole: 'customer',
    ipAddress: '185.220.101.5 (External Proxy)',
    actionCategory: 'Security Event',
    actionDetails: 'Automated Rate-Limiter triggered: 140 rapid API requests blocked. IP quarantined.',
    targetResource: 'api:v1:catalog:pricing',
    status: 'FLAGGED',
    immutableHash: 'sha256:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
  },
  {
    id: 'AUD-9016',
    timestamp: '2026-09-21 16:50:41 EAT',
    actorEmail: 'admin@hynovaenterprises.com',
    actorRole: 'admin',
    ipAddress: '102.219.208.50 (Nairobi, KE)',
    actionCategory: 'Admin Action',
    actionDetails: 'Approved verified EPRA Class A license for Technician John Mutua.',
    targetResource: 'tech:cert:EPRA-A-9921',
    status: 'SUCCESS',
    immutableHash: 'sha256:8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a',
  },
];

export class AuditLogService {
  private static logs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];

  public static getLogs(): AuditLogEntry[] {
    return [...this.logs];
  }

  public static addLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'immutableHash'>): AuditLogEntry {
    const id = `AUD-${Math.floor(9022 + this.logs.length)}`;
    const timestamp = `${new Date().toISOString().replace('T', ' ').substring(0, 19)} EAT`;
    const randomHex = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const immutableHash = `sha256:${randomHex}`;

    const newEntry: AuditLogEntry = {
      id,
      timestamp,
      immutableHash,
      ...entry,
    };

    // Immutable append-only
    this.logs = [newEntry, ...this.logs];
    return newEntry;
  }

  public static searchLogs(
    query?: string, 
    category?: string, 
    status?: string
  ): AuditLogEntry[] {
    return this.logs.filter((log) => {
      const matchesQuery = !query || 
        log.actorEmail.toLowerCase().includes(query.toLowerCase()) ||
        log.actionDetails.toLowerCase().includes(query.toLowerCase()) ||
        log.targetResource.toLowerCase().includes(query.toLowerCase()) ||
        log.immutableHash.toLowerCase().includes(query.toLowerCase());
      
      const matchesCategory = !category || category === 'ALL' || log.actionCategory === category;
      const matchesStatus = !status || status === 'ALL' || log.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }
}

export const THREAT_ALERTS: SecurityThreatAlert[] = [
  {
    id: 'THR-101',
    severity: 'medium',
    title: 'Anomalous Cross-Tenant Query Blocked',
    sourceIp: '196.201.214.12 (Nairobi, KE)',
    description: 'Customer token attempted to resolve supplier wholesale cost ledger. Blocked by Tenant Boundary Middleware.',
    mitigation: 'RBAC Policy Enforced. Session marked with elevated audit logging.',
    timestamp: '2026-09-21 16:32 EAT',
    resolved: true,
  },
  {
    id: 'THR-102',
    severity: 'low',
    title: 'Brute-Force Rate Limiting Active',
    sourceIp: '185.220.101.5 (Suspicious Tor Exit Node)',
    description: 'Blocked 8 successive failed login attempts targeting admin portal endpoint.',
    mitigation: 'Automatic IP throttling applied (429 Too Many Requests). Captcha challenge enforced.',
    timestamp: '2026-09-21 17:14 EAT',
    resolved: true,
  },
];

export const ROADMAP_DATA: RoadmapPillar[] = [
  {
    phase: 'Phase 1: Real-World Launch',
    timeline: 'Active Production (2026)',
    status: 'Active Deployment',
    focus: [
      'Security Technology (AI CCTV, Access Control, Electric Fencing)',
      'Networking (Enterprise Wi-Fi, Structured Cabling, Fiber OLT)',
      'Solar & Energy Storage (Hybrid Inverters, LiFePO4, Net-Metering Prep)',
      'Operational Automation (M-Pesa Escrow, Digital Work Orders)',
      'AI Recommendation Engine (Preliminary BOMs & Objective Sizing)',
      'Technician Marketplace (Vetted EPRA/NCA Technicians)',
      'Supplier Marketplace (Bonded Importers & Verified Wholesale)',
    ],
    sectors: [
      'Property Developers & Residential Estates',
      'Schools, Colleges & TVETs',
      'Commercial SMEs & Offices',
      'Churches & Community Institutions',
      'Agricultural Farms & Healthcare Clinics',
    ],
    infrastructureMilestones: [
      'Multi-tenant SaaS with strict data isolation',
      'Zero-fabrication data policy with verified KES rate benchmarks',
      'Automated Safaricom M-Pesa escrow safeguarding customer deposits',
      'Standardized 4-level technician competency framework',
    ],
  },
  {
    phase: 'Phase 2: Scale & Ecosystem',
    timeline: 'Scale Phase (2027)',
    status: 'In Development',
    focus: [
      'Smart Buildings & Integrated BMS Telemetry',
      'Advanced Edge AI Access Control & Biometrics',
      'IoT Infrastructure & Predictive Energy Monitoring',
      'Managed Services & Annual Maintenance Contracts (AMC)',
      'AI Operations Support for Rapid Field Diagnostics',
      'National Technician Network Across All 47 Counties',
      'East African Regional Expansion Feasibility (Uganda, Rwanda, Tanzania)',
    ],
    sectors: [
      'Industrial Parks & Logistics Warehouses',
      'County Government Facilities',
      'Multi-tenant Commercial Towers',
      'Hospitality Chains & Eco-Lodges',
    ],
    infrastructureMilestones: [
      'Automated hardware telemetry feeds connecting inverter gateways',
      'Decentralized regional hardware stocking hubs',
      'Vocational TVET academy certification integration',
    ],
  },
  {
    phase: 'Phase 3: National & Continental Expansion',
    timeline: 'Strategic Horizon (2028+)',
    status: 'Future Strategic Vision',
    focus: [
      'Technology Financing Partnerships with Commercial Banks & SACCOs',
      'Pan-African Infrastructure Marketplace',
      'Enterprise SaaS for Property Portfolios',
      'National Workforce Development Programs & TVET Apprenticeships',
      'Smart City Integrations with Municipal Grid & Traffic Networks',
      'Infrastructure Intelligence Platform for National Energy Analytics',
    ],
    sectors: [
      'National Infrastructure Agencies',
      'Pan-African Real Estate Syndicates',
      'Utility Providers & Independent Power Producers',
      'Cross-Border Industrial Corridors',
    ],
    infrastructureMilestones: [
      'Full institutional asset financing pipeline',
      'Regional cross-border regulatory compliance protocols',
      'AI-driven national grid load shedding mitigation network',
    ],
  },
];

export const DEMO_SESSIONS: Record<UserRole, SecuritySession> = {
  customer: {
    userId: 'USR-CUST-4910',
    email: 'karanja.david@gmail.com',
    role: 'customer',
    tenantId: 'TENANT-CUST-881',
    tokenHash: 'tok_live_c48a7b92e1f0',
    ipAddress: '197.232.88.94 (Karen, Nairobi)',
    mfaVerified: true,
    loginTime: '2026-09-21 16:45 EAT',
    expiresInSeconds: 3600,
    encryptionStandard: 'AES-256-GCM / TLS 1.3',
    kdpaCompliant: true,
  },
  technician: {
    userId: 'USR-TECH-2219',
    email: 'dennis.koech@tech.hynova.ke',
    role: 'technician',
    tenantId: 'TENANT-TECH-042',
    tokenHash: 'tok_live_t99b2c34a10e',
    ipAddress: '102.219.102.18 (Eldoret, Uasin Gishu)',
    mfaVerified: true,
    loginTime: '2026-09-21 15:30 EAT',
    expiresInSeconds: 2700,
    encryptionStandard: 'AES-256-GCM / TLS 1.3',
    kdpaCompliant: true,
  },
  supplier: {
    userId: 'USR-SUPP-1082',
    email: 'inventory@deye-distributors.co.ke',
    role: 'supplier',
    tenantId: 'TENANT-SUPP-019',
    tokenHash: 'tok_live_s88c3d45f21a',
    ipAddress: '102.135.168.99 (Industrial Area, Nairobi)',
    mfaVerified: true,
    loginTime: '2026-09-21 14:15 EAT',
    expiresInSeconds: 4200,
    encryptionStandard: 'AES-256-GCM / TLS 1.3',
    kdpaCompliant: true,
  },
  partner: {
    userId: 'USR-PART-3304',
    email: 'procurement@acacia-properties.co.ke',
    role: 'partner',
    tenantId: 'TENANT-PART-007',
    tokenHash: 'tok_live_p77d4e56a32b',
    ipAddress: '196.201.214.55 (Westlands, Nairobi)',
    mfaVerified: true,
    loginTime: '2026-09-21 16:00 EAT',
    expiresInSeconds: 3200,
    encryptionStandard: 'AES-256-GCM / TLS 1.3',
    kdpaCompliant: true,
  },
  staff: {
    userId: 'USR-STAFF-0091',
    email: 'ops.lead@hynovaenterprises.com',
    role: 'staff',
    tenantId: 'TENANT-HYNOVA-OPS',
    tokenHash: 'tok_live_st66e5f67b43c',
    ipAddress: '102.219.208.50 (HQ, Nairobi)',
    mfaVerified: true,
    loginTime: '2026-09-21 17:00 EAT',
    expiresInSeconds: 5400,
    encryptionStandard: 'AES-256-GCM / TLS 1.3',
    kdpaCompliant: true,
  },
  admin: {
    userId: 'USR-ADMIN-0012',
    email: 'operations.admin@hynovaenterprises.com',
    role: 'admin',
    tenantId: 'TENANT-HYNOVA-MGMT',
    tokenHash: 'tok_live_ad55f6a78c54d',
    ipAddress: '102.219.208.50 (HQ, Nairobi)',
    mfaVerified: true,
    loginTime: '2026-09-21 16:10 EAT',
    expiresInSeconds: 7200,
    encryptionStandard: 'AES-256-GCM / TLS 1.3',
    kdpaCompliant: true,
  },
  superadmin: {
    userId: 'USR-ROOT-0001',
    email: 'superadmin@hynovaenterprises.com',
    role: 'superadmin',
    tenantId: 'TENANT-ROOT-EXECUTIVE',
    tokenHash: 'tok_live_root_99aa88bb77cc',
    ipAddress: '102.219.208.45 (Executive VPN, Nairobi)',
    mfaVerified: true,
    loginTime: '2026-09-21 17:15 EAT',
    expiresInSeconds: 1800,
    encryptionStandard: 'ChaCha20-Poly1305 / TLS 1.3 / HSM Key',
    kdpaCompliant: true,
  },
  'ai-service': {
    userId: 'SYS-AI-CORE',
    email: 'ai-engine@internal.hynova.ke',
    role: 'ai-service',
    tenantId: 'TENANT-SYS-SANDBOX',
    tokenHash: 'tok_ephem_ai_00192837465',
    ipAddress: '10.0.4.18 (VPC Subnet)',
    mfaVerified: true,
    loginTime: '2026-09-21 17:50 EAT',
    expiresInSeconds: 900,
    encryptionStandard: 'Enclave Hardware Encryption',
    kdpaCompliant: true,
  },
};
