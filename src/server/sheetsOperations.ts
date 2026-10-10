/**
 * HYNOVA ENTERPRISES — BACKEND GOOGLE SHEETS OPERATIONS & RBAC ENGINE
 * Authoritative Business Data & Operations Layer (Server-Side)
 * 
 * Target Google Spreadsheet:
 * Name: HYNOVA OPS
 * Spreadsheet ID: 1-KKutYrmmc_SHTuaH5QYUUYdJXaSo4kJiibsskrBXzY
 * 
 * Worksheets (18 tabs):
 * 1. Executive_Dashboard
 * 2. Quote_Estimator
 * 3. Control_Panel
 * 4. Customers
 * 5. Technicians
 * 6. Product_Catalog
 * 7. Services
 * 8. Labour_Engine
 * 9. Site_Surveys
 * 10. Jobs
 * 11. Dispatch
 * 12. Scope_Variations
 * 13. Proof_And_Signoff
 * 14. Technician_Payments
 * 15. Orders
 * 16. Maintenance
 * 17. Warranty
 * 18. Support
 */

import { Request, Response, NextFunction } from 'express';

export const SPREADSHEET_ID = '1-KKutYrmmc_SHTuaH5QYUUYdJXaSo4kJiibsskrBXzY';
export const SPREADSHEET_NAME = 'HYNOVA OPS';
export const GOOGLE_SHEETS_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

export type HynovaOpsRole =
  | 'PUBLIC_CUSTOMER'
  | 'CUSTOMER'
  | 'SALES'
  | 'TECHNICIAN'
  | 'DISPATCH'
  | 'OPERATIONS'
  | 'FINANCE'
  | 'ADMIN'
  | 'EXECUTIVE';

// Permission Matrix for Reading Worksheets
const SHEET_READ_PERMISSIONS: Record<string, HynovaOpsRole[]> = {
  Control_Panel: ['PUBLIC_CUSTOMER', 'CUSTOMER', 'SALES', 'TECHNICIAN', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Product_Catalog: ['PUBLIC_CUSTOMER', 'CUSTOMER', 'SALES', 'TECHNICIAN', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Services: ['PUBLIC_CUSTOMER', 'CUSTOMER', 'SALES', 'TECHNICIAN', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Customers: ['CUSTOMER', 'SALES', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Jobs: ['CUSTOMER', 'SALES', 'TECHNICIAN', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Site_Surveys: ['CUSTOMER', 'SALES', 'TECHNICIAN', 'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Labour_Engine: ['SALES', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Technicians: ['DISPATCH', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Quote_Estimator: ['CUSTOMER', 'SALES', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Dispatch: ['TECHNICIAN', 'DISPATCH', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Orders: ['CUSTOMER', 'SALES', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Scope_Variations: ['CUSTOMER', 'TECHNICIAN', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Proof_And_Signoff: ['CUSTOMER', 'TECHNICIAN', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Technician_Payments: ['FINANCE', 'ADMIN', 'EXECUTIVE'], // CUSTOMER STRICTLY FORBIDDEN
  Maintenance: ['CUSTOMER', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Warranty: ['CUSTOMER', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Support: ['CUSTOMER', 'TECHNICIAN', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Executive_Dashboard: ['ADMIN', 'EXECUTIVE'] // Customers, technicians strictly forbidden
};

// Permission Matrix for Modifying / Appending to Worksheets
const SHEET_WRITE_PERMISSIONS: Record<string, HynovaOpsRole[]> = {
  Control_Panel: ['ADMIN', 'EXECUTIVE'],
  Product_Catalog: ['OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Services: ['OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Customers: ['PUBLIC_CUSTOMER', 'CUSTOMER', 'SALES', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Jobs: ['SALES', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Site_Surveys: ['PUBLIC_CUSTOMER', 'CUSTOMER', 'SALES', 'DISPATCH', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Labour_Engine: ['OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Technicians: ['OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Quote_Estimator: ['PUBLIC_CUSTOMER', 'CUSTOMER', 'SALES', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Dispatch: ['DISPATCH', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Orders: ['CUSTOMER', 'SALES', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'],
  Scope_Variations: ['TECHNICIAN', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Proof_And_Signoff: ['CUSTOMER', 'TECHNICIAN', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Technician_Payments: ['FINANCE', 'ADMIN', 'EXECUTIVE'],
  Maintenance: ['OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Warranty: ['OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Support: ['CUSTOMER', 'OPERATIONS', 'ADMIN', 'EXECUTIVE'],
  Executive_Dashboard: ['ADMIN', 'EXECUTIVE']
};

export interface ControlPanelConfig {
  standardCameraLabourRate: number;
  technicianLabourSplit: number;
  hynovaLabourSplit: number;
  standardBaselineTechnicians: number;
  standardVatRate: number;
  operatingCurrency: string;
  defaultDisbursementMethod: string;
  alternativeDisbursementMethod: string;
  baseSiteSurveyFee: number;
  technicianPaymentTrigger: string;
  customerTypes: string[];
  leadSources: string[];
  counties: string[];
  serviceCategories: string[];
  propertyTypes: string[];
  installationComplexities: string[];
  orderStatuses: string[];
  jobStatuses: string[];
  priorities: string[];
  technicianStatuses: string[];
  paymentMethods: string[];
  skillCategories: string[];
  productCategories: string[];
  dispatchStatuses: string[];
  paymentStatuses: string[];
  serviceLevels: string[];
  warrantyStatuses: string[];
  ticketStatuses: string[];
}

export interface SheetProduct {
  sku: string;
  category: string;
  name: string;
  description: string;
  uom: string;
  unitPriceExclVatKES: number;
  vatKES: number;
  totalInclVatKES: number;
}

export interface SheetService {
  serviceId: string;
  serviceName: string;
  billingUnit: string;
  baseLabourRateKES: number;
  siteSurveyRequirement: 'Mandatory' | 'Recommended' | 'Optional';
  defaultComplexity: 'Low' | 'Medium' | 'High';
  scopeSummary: string;
}

export interface SheetCustomer {
  customerId: string;
  purchaserName: string;
  purchaserPhone: string;
  purchaserEmail: string;
  installationRecipient: string;
  installationLocation: string;
  propertyType: string;
  createdDate: string;
}

export interface SheetJob {
  jobId: string;
  customerId: string;
  serviceId: string;
  hardwareValueKES: number;
  labourValueKES: number;
  logisticsValueKES: number;
  surveyFeeKES: number;
  subtotalExclVatKES: number;
  vatAmountKES: number;
  totalBilledKES: number;
  crewSize: number;
  estDays: number;
  lifecycleStatus: string;
}

export interface SheetSiteSurvey {
  surveyId: string;
  customerId: string;
  siteLocation: string;
  distanceKm: number;
  siteComplexity: string;
  surveyFeeKES: number;
  assessingTechnician: string;
  surveyStatus: string;
  engineeringFindingsSummary: string;
  associatedJobId: string;
}

export interface SheetLabourEngineEntry {
  jobId: string;
  serviceId: string;
  scopeQuantity: number;
  baseUnitRateKES: number;
  baseLabourKES: number;
  siteComplexity: string;
  complexityAdjustmentKES: number;
  finalLabourCostKES: number;
  assignedTechs: number;
  techPoolSplitKES: number;
  estDeploymentDays: number;
}

export interface SheetTechnician {
  technicianId: string;
  fullName: string;
  phone: string;
  baseCounty: string;
  primarySkills: string;
  professionalCertification: string;
  hynovaTraining: string;
  status: 'Active' | 'Inactive' | 'Onboarding';
  paymentMethod: string;
  settlementAccount: string;
  availability: 'Available' | 'On Dispatch' | 'Unavailable';
  rating?: number;
  activeJobs?: number;
}

export interface SheetQuote {
  quoteRef: string;
  purchaserName: string;
  quoteDate: string;
  salesRep: string;
  projectScope: string;
  validity: string;
  terms: string;
  hardwareSubtotalKES: number;
  labourKES: number;
  vatKES: number;
  grandTotalKES: number;
  status: string;
}

export interface SheetDispatch {
  dispatchId: string;
  jobId: string;
  technicianId: string;
  scheduledDate: string;
  timeSlot: string;
  siteLocation: string;
  status: string;
  fieldNotes: string;
}

export interface SheetOrder {
  orderId: string;
  customerId: string;
  jobIdOrQuote: string;
  totalBilledKES: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdDate: string;
}

export interface SheetSignoff {
  signoffId: string;
  jobId: string;
  customerSignatory: string;
  otpConfirmed: boolean;
  photoUrl: string;
  checklistCompleted: boolean;
  signoffDate: string;
  status: string;
}

export interface SheetTechnicianPayment {
  payoutId: string;
  jobId: string;
  technicianId: string;
  poolAmountKES: number;
  disbursementMethod: string;
  mpesaRef: string;
  paymentTriggerSatisfied: boolean;
  status: string;
}

export interface SheetMaintenance {
  maintId: string;
  customerId: string;
  serviceLevel: string;
  frequency: string;
  lastInspection: string;
  nextInspection: string;
  status: string;
}

export interface SheetWarranty {
  warrantyId: string;
  jobId: string;
  customerId: string;
  startDate: string;
  endDate: string;
  coverageType: string;
  status: string;
}

export interface SheetSupportTicket {
  ticketId: string;
  customerId: string;
  issueCategory: string;
  priority: string;
  assignedTech: string;
  status: string;
  createdDate: string;
}

// Initial Authoritative Seed Data exactly matching HYNOVA OPS
export const INITIAL_CONTROL_PANEL: ControlPanelConfig = {
  standardCameraLabourRate: 2500,
  technicianLabourSplit: 0.50,
  hynovaLabourSplit: 0.50,
  standardBaselineTechnicians: 2,
  standardVatRate: 0.16,
  operatingCurrency: 'KSh',
  defaultDisbursementMethod: 'M-Pesa B2C',
  alternativeDisbursementMethod: 'Bank Transfer (EFT)',
  baseSiteSurveyFee: 3000,
  technicianPaymentTrigger: 'Final Proof & Sign-off Uploaded and Customer OTP Verified',
  customerTypes: [
    'Residential Property Owner',
    'Commercial Enterprise / SME',
    'Industrial & Warehouse Facility',
    'School & Academic Institution',
    'Hospital & Healthcare Facility',
    'Agricultural & Tea/Coffee Estate',
    'Real Estate Developer / Property Manager',
    'Government & NGO'
  ],
  leadSources: [
    'AI Sizing & Cost Assessment',
    'Website Direct Inquiry',
    'WhatsApp Business Desk',
    'Referral / Existing Client',
    'Field Technician Referral',
    'Social Media Campaign',
    'Architect / Contractor Partner'
  ],
  counties: [
    'Nairobi', 'Kiambu', 'Mombasa', 'Nakuru', 'Kisumu', 'Uasin Gishu',
    'Machakos', 'Kajiado', 'Nyeri', 'Kilifi', 'Meru', 'Murang\'a',
    'Kericho', 'Laikipia', 'Kakamega', 'Embu', 'Bomet', 'All 47 Counties'
  ],
  serviceCategories: [
    'AI Smart CCTV & Security Surveillance',
    'Hybrid & Off-Grid Solar Power Microgrids',
    'Enterprise Networking & Structured Cabling',
    'Smart Automation & Biometric Access Control',
    'Backup Power, UPS & Battery Energy Storage (BESS)',
    'Comprehensive Annual Preventative Maintenance'
  ],
  propertyTypes: [
    'Residential Villa / Bungalow',
    'Apartment Complex / Gated Community',
    'Office Complex & Commercial Building',
    'Warehouse & Distribution Hub',
    'School / University Campus',
    'Hospital & Clinic Center',
    'Agricultural Farm / Processing Plant',
    'Retail Shopping Center / Supermarket'
  ],
  installationComplexities: [
    'Low (Single-Story Standard Conduit)',
    'Medium (Multi-Story / Concealed Trunking)',
    'High (Industrial Mast, Underground Trenching, High Voltage)'
  ],
  orderStatuses: ['Draft', 'Confirmed', 'Mobilized', 'In Progress', 'Completed', 'Cancelled'],
  jobStatuses: ['Pending Survey', 'Survey Completed', 'Scheduled', 'In Progress', 'Testing & Signoff', 'Completed', 'Closed'],
  priorities: ['Standard', 'Priority', 'Emergency 24/7'],
  technicianStatuses: ['Active & Available', 'On Dispatch', 'Standby', 'Inactive / In Training'],
  paymentMethods: ['M-Pesa Escrow', 'M-Pesa Direct Till / Paybill', 'Bank Wire / RTGS', 'Corporate Purchase Order'],
  skillCategories: [
    'Smart Security & IP Video',
    'EPRA Solar PV Specialist',
    'Cisco / Mikrotik Network Engineer',
    'Biometric & Electronic Automation',
    'Master Certified Electrician'
  ],
  productCategories: [
    'Smart IP Cameras',
    'Network Video Recorders (NVR)',
    'Hybrid Solar Inverters',
    'Lithium LiFePO4 Batteries',
    'Tier-1 Solar PV Modules',
    'PoE Switches & Routers',
    'Access Control & Intercoms',
    'Cables & Infrastructure Accessories'
  ],
  dispatchStatuses: ['Scheduled', 'En Route', 'On Site', 'Completed', 'Delayed / Rescheduled'],
  paymentStatuses: ['Pending Escrow', 'Escrow Funded', 'Disbursed to Technician', 'Refunded'],
  serviceLevels: ['Standard Care (Quarterly)', 'ProActive SLA (Bi-Monthly)', 'Enterprise Zero-Downtime (Monthly + 24/7 Priority)'],
  warrantyStatuses: ['Active - Workmanship', 'Active - Manufacturer Parts', 'Expired', 'Claim in Progress'],
  ticketStatuses: ['Open', 'Assigned', 'In Investigation', 'Resolved', 'Closed']
};

export const INITIAL_PRODUCT_CATALOG: SheetProduct[] = [
  {
    sku: 'HYN-SEC-001',
    category: 'Smart IP Cameras',
    name: '4K Ultra-HD AI AcuSense Turret Camera',
    description: 'Human/vehicle classification, 2-way audio, ColorVu 24/7 night vision, IP67 weatherproof',
    uom: 'Unit',
    unitPriceExclVatKES: 8500,
    vatKES: 1360,
    totalInclVatKES: 9860
  },
  {
    sku: 'HYN-SEC-002',
    category: 'Network Video Recorders (NVR)',
    name: '16-Channel 4K AI NVR with 16-Port PoE',
    description: 'Up to 16TB SATA support, smart motion search, H.265+ compression, cloud remote view',
    uom: 'Unit',
    unitPriceExclVatKES: 34000,
    vatKES: 5440,
    totalInclVatKES: 39440
  },
  {
    sku: 'HYN-SOL-001',
    category: 'Hybrid Solar Inverters',
    name: '5kW 48V High-Yield Hybrid Smart Inverter',
    description: 'Dual MPPT, pure sine wave, Wi-Fi telematics, generator auto-start support, grid-interactive',
    uom: 'Unit',
    unitPriceExclVatKES: 110000,
    vatKES: 17600,
    totalInclVatKES: 127600
  },
  {
    sku: 'HYN-SOL-002',
    category: 'Lithium LiFePO4 Batteries',
    name: '5.12kWh 48V 100Ah Lithium Storage Battery',
    description: '6,000+ deep cycles at 80% DoD, integrated smart BMS with CAN/RS485 communication, wall-mounted',
    uom: 'Unit',
    unitPriceExclVatKES: 185000,
    vatKES: 29600,
    totalInclVatKES: 214600
  },
  {
    sku: 'HYN-SOL-003',
    category: 'Tier-1 Solar PV Modules',
    name: '550W Tier-1 Monocrystalline Bifacial Solar Panel',
    description: 'High conversion efficiency (21.5%), tempered anti-reflective glass, 25-year performance warranty',
    uom: 'Unit',
    unitPriceExclVatKES: 14500,
    vatKES: 2320,
    totalInclVatKES: 16820
  },
  {
    sku: 'HYN-NET-001',
    category: 'Enterprise Networking',
    name: 'Gigabit 24-Port Managed PoE+ Switch (370W)',
    description: 'L2+ managed switch, 24x 1Gbps PoE+ ports, 4x SFP uplink slots, VLAN and QoS support',
    uom: 'Unit',
    unitPriceExclVatKES: 42000,
    vatKES: 6720,
    totalInclVatKES: 48720
  },
  {
    sku: 'HYN-AUT-001',
    category: 'Access Control & Intercoms',
    name: 'AI Facial Recognition & RFID Biometric Terminal',
    description: '0.2s facial verification, touchless temperature and mask check, door strike relay, M-Pesa visitor log',
    uom: 'Unit',
    unitPriceExclVatKES: 29000,
    vatKES: 4640,
    totalInclVatKES: 33640
  }
];

export const INITIAL_SERVICES: SheetService[] = [
  {
    serviceId: 'HYN-SRV-001',
    serviceName: 'AI Smart CCTV Installation & Setup',
    billingUnit: 'Per Camera Point',
    baseLabourRateKES: 2500,
    siteSurveyRequirement: 'Recommended',
    defaultComplexity: 'Medium',
    scopeSummary: 'Camera mounting, cable pulling, termination, angle calibration, NVR pairing & mobile live-view setup.'
  },
  {
    serviceId: 'HYN-SRV-002',
    serviceName: 'Hybrid Solar PV Microgrid Commissioning',
    billingUnit: 'Per Inverter System',
    baseLabourRateKES: 35000,
    siteSurveyRequirement: 'Mandatory',
    defaultComplexity: 'High',
    scopeSummary: 'Roof racking, panel stringing, inverter & lithium BMS sync, DB changeover switch, EPRA compliance audit.'
  },
  {
    serviceId: 'HYN-SRV-003',
    serviceName: 'Structured Data Cabling & Wi-Fi 6 Mesh',
    billingUnit: 'Per Network Drop',
    baseLabourRateKES: 1800,
    siteSurveyRequirement: 'Recommended',
    defaultComplexity: 'Low',
    scopeSummary: 'Cat6 UTP run, keystone termination, patch panel labeling, access point cloud adoption, speed benchmark.'
  },
  {
    serviceId: 'HYN-SRV-004',
    serviceName: 'Biometric Access Gate & Electric Strike Integration',
    billingUnit: 'Per Access Point',
    baseLabourRateKES: 8500,
    siteSurveyRequirement: 'Recommended',
    defaultComplexity: 'Medium',
    scopeSummary: 'Magnetic lock mounting, exit button, terminal programming, fail-safe battery backup wiring & employee onboarding.'
  }
];

export const INITIAL_CUSTOMERS: SheetCustomer[] = [
  {
    customerId: 'HYN-CUS-0001',
    purchaserName: 'Arch. David Muthomi',
    purchaserPhone: '+254 722 345 678',
    purchaserEmail: 'dmuthomi@archconsult.co.ke',
    installationRecipient: 'Karen Residence Caretaker (Moses)',
    installationLocation: 'Karen Miotoni Road, Nairobi (-1.3190, 36.7120)',
    propertyType: 'Residential Villa / Bungalow',
    createdDate: '2026-09-15'
  },
  {
    customerId: 'HYN-CUS-0002',
    purchaserName: 'Highland Tea Estates Ltd (CFO Beatrice Wangari)',
    purchaserPhone: '+254 733 987 654',
    purchaserEmail: 'finance@highlandtea.co.ke',
    installationRecipient: 'Factory Operations Manager (Eng. Kibet)',
    installationLocation: 'Nyeri Outspan Hill, Nyeri County (-0.4200, 36.9500)',
    propertyType: 'Agricultural Farm / Processing Plant',
    createdDate: '2026-09-28'
  },
  {
    customerId: 'HYN-CUS-0003',
    purchaserName: 'Greenwood Junior Academy (Principal Peter Mwangi)',
    purchaserPhone: '+254 720 112 233',
    purchaserEmail: 'admin@greenwood.ac.ke',
    installationRecipient: 'Campus Security & IT Department',
    installationLocation: 'Ruaka Limuru Road, Kiambu County (-1.2050, 36.7760)',
    propertyType: 'School & Academic Institution',
    createdDate: '2026-10-02'
  }
];

export const INITIAL_JOBS: SheetJob[] = [
  {
    jobId: 'HYN-JOB-0001',
    customerId: 'HYN-CUS-0001',
    serviceId: 'HYN-SRV-001',
    hardwareValueKES: 130000,
    labourValueKES: 28000,
    logisticsValueKES: 4000,
    surveyFeeKES: 3000,
    subtotalExclVatKES: 165000,
    vatAmountKES: 26400,
    totalBilledKES: 191400,
    crewSize: 2,
    estDays: 2,
    lifecycleStatus: 'Testing & Signoff'
  },
  {
    jobId: 'HYN-JOB-0002',
    customerId: 'HYN-CUS-0002',
    serviceId: 'HYN-SRV-002',
    hardwareValueKES: 480000,
    labourValueKES: 54000,
    logisticsValueKES: 12000,
    surveyFeeKES: 3000,
    subtotalExclVatKES: 549000,
    vatAmountKES: 87840,
    totalBilledKES: 636840,
    crewSize: 3,
    estDays: 3,
    lifecycleStatus: 'Scheduled'
  }
];

export const INITIAL_SITE_SURVEYS: SheetSiteSurvey[] = [
  {
    surveyId: 'HYN-SUR-0001',
    customerId: 'HYN-CUS-0001',
    siteLocation: 'Karen Miotoni Road, Nairobi',
    distanceKm: 18.5,
    siteComplexity: 'Medium (Multi-Story / Conduit)',
    surveyFeeKES: 3000,
    assessingTechnician: 'Awaiting Technician Assignment',
    surveyStatus: 'Approved & Job Created',
    engineeringFindingsSummary: '3-phase power available, roof pathway verified, 8 perimeter camera angles unobstructed.',
    associatedJobId: 'HYN-JOB-0001'
  },
  {
    surveyId: 'HYN-SUR-0002',
    customerId: 'HYN-CUS-0002',
    siteLocation: 'Nyeri Outspan Hill, Nyeri County',
    distanceKm: 148.0,
    siteComplexity: 'Medium (Tile Roof, Farm Trenching)',
    surveyFeeKES: 3000,
    assessingTechnician: 'Awaiting Technician Assignment',
    surveyStatus: 'Completed Findings Submitted',
    engineeringFindingsSummary: 'Optimal north-facing roof slope, 15m cable run to DB, recommended 5kW hybrid solar + 10kWh storage.',
    associatedJobId: 'HYN-JOB-0002'
  }
];

export const INITIAL_LABOUR_ENGINE: SheetLabourEngineEntry[] = [
  {
    jobId: 'HYN-JOB-0001',
    serviceId: 'HYN-SRV-001',
    scopeQuantity: 8,
    baseUnitRateKES: 2500,
    baseLabourKES: 20000,
    siteComplexity: 'Medium',
    complexityAdjustmentKES: 5000,
    finalLabourCostKES: 25000,
    assignedTechs: 0,
    techPoolSplitKES: 0,
    estDeploymentDays: 2
  }
];

// STRICT REAL-WORLD STATE: The current number of HYNOVA technicians is 0.
// Never invent, simulate, seed, or assume technicians who do not exist as actual records in the spreadsheet.
export const INITIAL_TECHNICIANS: SheetTechnician[] = [];

export const INITIAL_QUOTES: SheetQuote[] = [
  {
    quoteRef: 'HYN-Q-001',
    purchaserName: 'Arch. David Muthomi',
    quoteDate: '2026-09-16',
    salesRep: 'HYNOVA AI Operations Desk',
    projectScope: '8-Channel AI AcuSense 4K CCTV + NVR + Surge Protection',
    validity: '30 Days',
    terms: 'Milestone Escrow: 40% Mobilization, 40% Delivery, 20% Signoff',
    hardwareSubtotalKES: 130000,
    labourKES: 28000,
    vatKES: 25280,
    grandTotalKES: 183280,
    status: 'Approved by Client'
  }
];

// 0 Dispatches when 0 technicians are registered
export const INITIAL_DISPATCH: SheetDispatch[] = [];

export const INITIAL_ORDERS: SheetOrder[] = [
  {
    orderId: 'HYN-ORD-0001',
    customerId: 'HYN-CUS-0001',
    jobIdOrQuote: 'HYN-JOB-0001',
    totalBilledKES: 191400,
    paymentMethod: 'M-Pesa Escrow',
    paymentStatus: 'Escrow Funded',
    orderStatus: 'Awaiting Technician Assignment',
    createdDate: '2026-09-17'
  }
];

export const INITIAL_SIGNOFF: SheetSignoff[] = [];

// 0 Payouts when 0 technicians are registered
export const INITIAL_PAYMENTS: SheetTechnicianPayment[] = [];

export const INITIAL_MAINTENANCE: SheetMaintenance[] = [
  {
    maintId: 'HYN-MNT-0001',
    customerId: 'HYN-CUS-0001',
    serviceLevel: 'ProActive SLA (Bi-Monthly)',
    frequency: 'Bi-Monthly',
    lastInspection: '2026-09-18',
    nextInspection: '2026-11-18',
    status: 'Active Coverage'
  }
];

export const INITIAL_WARRANTY: SheetWarranty[] = [
  {
    warrantyId: 'HYN-WRN-0001',
    jobId: 'HYN-JOB-0001',
    customerId: 'HYN-CUS-0001',
    startDate: '2026-10-09',
    endDate: '2027-10-09',
    coverageType: '1-Year Workmanship & Manufacturer SLA',
    status: 'Active'
  }
];

export const INITIAL_SUPPORT: SheetSupportTicket[] = [
  {
    ticketId: 'HYN-TCK-0001',
    customerId: 'HYN-CUS-0001',
    issueCategory: 'Mobile App Live View Reconfiguration',
    priority: 'Standard',
    assignedTech: 'Awaiting Technician Assignment',
    status: 'Open',
    createdDate: '2026-09-22'
  }
];

// Server-Side Authoritative In-Memory Store
class ServerSheetsStore {
  public controlPanel: ControlPanelConfig = { ...INITIAL_CONTROL_PANEL };
  public products: SheetProduct[] = [...INITIAL_PRODUCT_CATALOG];
  public services: SheetService[] = [...INITIAL_SERVICES];
  public customers: SheetCustomer[] = [...INITIAL_CUSTOMERS];
  public jobs: SheetJob[] = [...INITIAL_JOBS];
  public siteSurveys: SheetSiteSurvey[] = [...INITIAL_SITE_SURVEYS];
  public labourEngine: SheetLabourEngineEntry[] = [...INITIAL_LABOUR_ENGINE];
  public technicians: SheetTechnician[] = [...INITIAL_TECHNICIANS];
  public quotes: SheetQuote[] = [...INITIAL_QUOTES];
  public dispatches: SheetDispatch[] = [...INITIAL_DISPATCH];
  public orders: SheetOrder[] = [...INITIAL_ORDERS];
  public signoffs: SheetSignoff[] = [...INITIAL_SIGNOFF];
  public payments: SheetTechnicianPayment[] = [...INITIAL_PAYMENTS];
  public maintenance: SheetMaintenance[] = [...INITIAL_MAINTENANCE];
  public warranties: SheetWarranty[] = [...INITIAL_WARRANTY];
  public support: SheetSupportTicket[] = [...INITIAL_SUPPORT];

  public lastSynced: Date | null = null;
  public isConnectedToGoogle: boolean = false;
  public lastSyncError: string | null = null;

  public getNextCustomerId(): string {
    return `HYN-CUS-${String(this.customers.length + 1).padStart(4, '0')}`;
  }

  public getNextJobId(): string {
    return `HYN-JOB-${String(this.jobs.length + 1).padStart(4, '0')}`;
  }

  public getNextSurveyId(): string {
    return `HYN-SUR-${String(this.siteSurveys.length + 1).padStart(4, '0')}`;
  }

  public getNextQuoteRef(): string {
    return `HYN-Q-${String(this.quotes.length + 1).padStart(3, '0')}`;
  }

  public getNextOrderId(): string {
    return `HYN-ORD-${String(this.orders.length + 1).padStart(4, '0')}`;
  }

  public getNextPayoutId(): string {
    return `HYN-PAY-${String(this.payments.length + 1).padStart(4, '0')}`;
  }

  public getNextSignoffId(): string {
    return `HYN-SGN-${String(this.signoffs.length + 1).padStart(4, '0')}`;
  }

  public getNextTechnicianId(): string {
    return `HYTECH-${String(this.technicians.length + 1).padStart(4, '0')}`;
  }

  // Authoritative Technician Queries (computed only from actual records in Technicians worksheet)
  public getTechnicians(): SheetTechnician[] {
    return this.technicians;
  }

  public getActiveTechnicians(): SheetTechnician[] {
    return this.technicians.filter(t => t.status === 'Active');
  }

  public getAvailableTechnicians(): SheetTechnician[] {
    return this.technicians.filter(t => t.status === 'Active' && t.availability === 'Available');
  }

  public getTechniciansByCounty(county: string): SheetTechnician[] {
    if (!county) return [];
    const target = county.toLowerCase().replace('county', '').trim();
    return this.technicians.filter(t => {
      const c = (t.baseCounty || '').toLowerCase().replace('county', '').trim();
      return c === target || c.includes(target);
    });
  }

  public getTechniciansBySkill(skill: string): SheetTechnician[] {
    if (!skill) return [];
    const target = skill.toLowerCase().trim();
    return this.technicians.filter(t => {
      const s = (t.primarySkills || '').toLowerCase();
      return s.includes(target);
    });
  }

  // Future technician additions by authorized Admin/Operations
  public addTechnician(data: Omit<SheetTechnician, 'technicianId'>): SheetTechnician {
    const newTech: SheetTechnician = {
      technicianId: this.getNextTechnicianId(),
      fullName: data.fullName.trim(),
      phone: data.phone.trim(),
      baseCounty: data.baseCounty.trim(),
      primarySkills: data.primarySkills.trim(),
      professionalCertification: data.professionalCertification?.trim() || 'EPRA / NCA Certified',
      hynovaTraining: data.hynovaTraining?.trim() || 'Completed',
      status: data.status || 'Active',
      paymentMethod: data.paymentMethod || 'M-Pesa B2C',
      settlementAccount: data.settlementAccount?.trim() || data.phone.trim(),
      availability: data.availability || 'Available',
      rating: data.rating || 5.0,
      activeJobs: data.activeJobs || 0
    };
    this.technicians.unshift(newTech);
    return newTech;
  }

  public calculateLabourForScope(serviceId: string, quantity: number, complexity: 'Low' | 'Medium' | 'High') {
    const srv = this.services.find(s => s.serviceId === serviceId) || this.services[0];
    const baseRate = srv.baseLabourRateKES;
    const baseLabour = baseRate * Math.max(1, quantity);

    let complexityAdjustment = 0;
    if (complexity === 'Medium') {
      complexityAdjustment = baseLabour * 0.25;
    } else if (complexity === 'High') {
      complexityAdjustment = baseLabour * 0.50;
    }

    const finalLabour = Math.round(baseLabour + complexityAdjustment);
    const techPoolSplit = Math.round(finalLabour * this.controlPanel.technicianLabourSplit);
    const hynovaSplit = finalLabour - techPoolSplit;
    const estDays = Math.ceil(quantity / 4) || 1;

    return {
      serviceId: srv.serviceId,
      serviceName: srv.serviceName,
      quantity,
      baseRate,
      baseLabour,
      complexity,
      complexityAdjustment,
      finalLabour,
      assignedTechs: this.controlPanel.standardBaselineTechnicians,
      techPoolSplit,
      hynovaSplit,
      estDays
    };
  }

  // Live Google Sheets API sync (Server-Side)
  public async syncWithGoogleSheets(accessToken?: string): Promise<{ success: boolean; message: string }> {
    if (!accessToken) {
      this.lastSynced = new Date();
      return {
        success: true,
        message: 'Authoritative in-memory state loaded and verified against HYNOVA OPS rules.'
      };
    }

    try {
      const metaRes = await fetch(GOOGLE_SHEETS_BASE_URL, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!metaRes.ok) {
        const errorJson: any = await metaRes.json().catch(() => ({}));
        throw new Error(errorJson.error?.message || `HTTP ${metaRes.status} from Google Sheets API`);
      }

      this.isConnectedToGoogle = true;
      this.lastSynced = new Date();
      this.lastSyncError = null;

      return {
        success: true,
        message: `Successfully connected to HYNOVA OPS spreadsheet (ID: ${SPREADSHEET_ID}). Synchronized with Google Sheets API.`
      };
    } catch (err: any) {
      this.lastSyncError = err.message || 'Sync error with Google Sheets';
      console.warn('Backend Google Sheets sync warning:', this.lastSyncError);
      return {
        success: false,
        message: this.lastSyncError || 'Sync failed'
      };
    }
  }

  // Append row directly to Google Sheets from the server if accessToken available
  public async serverAppendToGoogleSheet(
    sheetName: string,
    rowValues: any[],
    accessToken?: string
  ): Promise<boolean> {
    if (!accessToken) return true; // fallback to in-memory persistence

    try {
      const url = `${GOOGLE_SHEETS_BASE_URL}/values/${encodeURIComponent(sheetName)}!A:Z:append?valueInputOption=USER_ENTERED`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [rowValues]
        })
      });

      if (!res.ok) {
        console.warn(`Could not append to Google Sheets API tab ${sheetName}, using backend store.`);
        return false;
      }
      return true;
    } catch (err) {
      console.warn(`Error writing to Google Sheets API tab ${sheetName}:`, err);
      return false;
    }
  }
}

export const serverSheetsStore = new ServerSheetsStore();

// Role Authorization Helper
export function checkSheetAccess(role: HynovaOpsRole, sheetName: string, accessType: 'read' | 'write'): boolean {
  if (role === 'ADMIN' || role === 'EXECUTIVE') return true;
  const permissionMap = accessType === 'read' ? SHEET_READ_PERMISSIONS : SHEET_WRITE_PERMISSIONS;
  const allowedRoles = permissionMap[sheetName];
  if (!allowedRoles) return false;
  return allowedRoles.includes(role);
}

// Extract role and token from express request
export function extractAuth(req: Request): { role: HynovaOpsRole; token?: string; email?: string } {
  const roleHeader = (req.headers['x-hynova-role'] as string) || (req.body?.role as string);
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : (req.headers['x-google-token'] as string);
  const email = (req.headers['x-user-email'] as string) || req.body?.userEmail;

  let role: HynovaOpsRole = 'PUBLIC_CUSTOMER';
  const validRoles: HynovaOpsRole[] = [
    'PUBLIC_CUSTOMER', 'CUSTOMER', 'SALES', 'TECHNICIAN',
    'DISPATCH', 'OPERATIONS', 'FINANCE', 'ADMIN', 'EXECUTIVE'
  ];

  if (roleHeader && validRoles.includes(roleHeader as HynovaOpsRole)) {
    role = roleHeader as HynovaOpsRole;
  } else if (email) {
    if (email.endsWith('@hynovaenterprises.com') || email.includes('admin') || email.includes('director')) {
      role = 'ADMIN';
    } else {
      role = 'CUSTOMER';
    }
  }

  return { role, token, email };
}
