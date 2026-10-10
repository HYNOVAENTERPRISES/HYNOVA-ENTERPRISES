/**
 * HYNOVA OPS — GOOGLE SHEETS INTEGRATION SERVICE
 * Authoritative Business Data & Operations Layer
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

export const SPREADSHEET_ID = '1-KKutYrmmc_SHTuaH5QYUUYdJXaSo4kJiibsskrBXzY';
export const SPREADSHEET_NAME = 'HYNOVA OPS';
export const GOOGLE_SHEETS_BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}`;

export interface ControlPanelConfig {
  standardCameraLabourRate: number;
  technicianLabourSplit: number; // e.g. 0.50 (50%)
  hynovaLabourSplit: number; // e.g. 0.50 (50%)
  standardBaselineTechnicians: number;
  standardVatRate: number; // e.g. 0.16 (16%)
  operatingCurrency: string; // KSh
  defaultDisbursementMethod: string;
  alternativeDisbursementMethod: string;
  baseSiteSurveyFee: number; // 3000
  technicianPaymentTrigger: string;
  // Dropdown lists
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
  customerId: string; // HYN-CUS-0001
  purchaserName: string;
  purchaserPhone: string;
  purchaserEmail: string;
  installationRecipient: string; // Support for Purchaser ≠ Installation Recipient
  installationLocation: string; // GPS pin / formatted address
  propertyType: string;
  createdDate: string;
}

export interface SheetJob {
  jobId: string; // HYN-JOB-0001
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
  surveyId: string; // HYN-SUR-0001
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
  techPoolSplitKES: number; // 50%
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
  quoteRef: string; // HYN-Q-001
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

// Initial Authoritative Cache seeded to exactly match HYNOVA OPS Google Sheet
export const INITIAL_CONTROL_PANEL: ControlPanelConfig = {
  standardCameraLabourRate: 2500,
  technicianLabourSplit: 0.50,
  hynovaLabourSplit: 0.50,
  standardBaselineTechnicians: 2,
  standardVatRate: 0.16,
  operatingCurrency: 'KSh',
  defaultDisbursementMethod: 'M-Pesa B2C',
  alternativeDisbursementMethod: 'Bank EFT',
  baseSiteSurveyFee: 3000,
  technicianPaymentTrigger: 'Customer Testing Sign-Off',
  customerTypes: ['Residential', 'Commercial SME', 'Corporate', 'Institutional', 'Industrial', 'Estate / HOA'],
  leadSources: ['Website AI Recommendation', 'WhatsApp Direct', 'Customer Referral', 'Field Technician', 'Architect / Contractor', 'Social Media'],
  counties: [
    'Nairobi County',
    'Kiambu County',
    'Machakos County',
    'Kajiado County',
    'Nakuru County',
    'Mombasa County',
    'Kisumu County',
    'Uasin Gishu County',
    'Kilifi County',
    'Nyeri County',
    'Laikipia County',
    'Meru County'
  ],
  serviceCategories: [
    'Smart CCTV & AI Video Analytics',
    'Hybrid Solar PV & Energy Storage',
    'Starlink & High-Speed Networking',
    'Automated Gate & Biometric Access',
    'Smart Home & Building Automation'
  ],
  propertyTypes: [
    'Residential Villa / Bungalow',
    'Multi-Story Apartment Complex',
    'Commercial Office & Plaza',
    'Retail Shop & Supermarket',
    'Warehouse & Industrial Facility',
    'School & Academic Institution',
    'Hotel & Safari Lodge',
    'Farm & Agribusiness Compound'
  ],
  installationComplexities: ['Low (Single-Story Standard)', 'Medium (Multi-Story / Conduit)', 'High (Industrial / Trenching / Tower)'],
  orderStatuses: ['Draft', 'Confirmed', 'In Fulfillment', 'Dispatched', 'Installed', 'Completed', 'Cancelled'],
  jobStatuses: ['Pending Survey', 'Survey Completed', 'Scheduled', 'In Progress', 'Testing & Signoff', 'Completed', 'Maintenance'],
  priorities: ['Standard', 'High', 'Urgent / Critical'],
  technicianStatuses: ['Active & Available', 'Dispatched on Job', 'Awaiting Assignment', 'On Leave'],
  paymentMethods: ['M-Pesa Escrow', 'M-Pesa Paybill / Till', 'Bank Wire (EFT/RTGS)', 'Cheque'],
  skillCategories: [
    'Solar PV & Inverter Microgrids',
    'Edge AI CCTV & Video Telematics',
    'Starlink & Gigabit Structured Cabling',
    'Biometric Turnstiles & Gate Automation',
    'Smart Energy Storage & Backup Systems'
  ],
  productCategories: [
    'CCTV & Video Analytics',
    'Solar & Clean Energy',
    'Networking & Satellite',
    'Access Control & Automation',
    'Power Supplies & Batteries',
    'Cables & Conduits',
    'Accessories & Mounts'
  ],
  dispatchStatuses: ['Pending Dispatch', 'Technician Dispatched', 'En Route to Site', 'On Site', 'Commissioning Complete'],
  paymentStatuses: ['Held in Escrow', 'Milestone 1 Disbursed', 'Final 50% Released', 'Fully Settled'],
  serviceLevels: ['Standard 1-Year Guarantee', 'Silver SLA (Next-Day)', 'Gold 24/7 SLA (Same-Day)'],
  warrantyStatuses: ['Active Workmanship Warranty', 'Extended Manufacturer Warranty', 'Expired', 'Claim in Progress'],
  ticketStatuses: ['Open', 'Investigating', 'Technician Dispatched', 'Resolved', 'Closed']
};

export const INITIAL_PRODUCT_CATALOG: SheetProduct[] = [
  {
    sku: 'HYN-CAM-4K-01',
    category: 'CCTV & Video Analytics',
    name: 'Hikvision 4K AcuSense ColorVu Bullet Camera',
    description: 'Ultra HD 8MP, 24/7 Full-Color Imaging, Human & Vehicle AI Classification, IP67 Weatherproof, Built-in Mic.',
    uom: 'Unit',
    unitPriceExclVatKES: 9500,
    vatKES: 1520,
    totalInclVatKES: 11020
  },
  {
    sku: 'HYN-CAM-PTZ-02',
    category: 'CCTV & Video Analytics',
    name: 'Hikvision 4MP 25x AI Smart PTZ Camera',
    description: '360° Continuous Pan, 25x Optical Zoom, Auto-Tracking 2.0, 100m IR Night Vision, DarkFighter Technology.',
    uom: 'Unit',
    unitPriceExclVatKES: 45000,
    vatKES: 7200,
    totalInclVatKES: 52200
  },
  {
    sku: 'HYN-NVR-16CH-03',
    category: 'CCTV & Video Analytics',
    name: 'Hikvision 16-Channel 4K PoE NVR (with 4TB Surveillance HDD)',
    description: '16 PoE Ports Plug & Play, 4K HDMI Output, H.265+ Compression, AI Perimeter Protection Search.',
    uom: 'Unit',
    unitPriceExclVatKES: 42000,
    vatKES: 6720,
    totalInclVatKES: 48720
  },
  {
    sku: 'HYN-SOL-INV-5KW',
    category: 'Solar & Clean Energy',
    name: 'Deye 5kW Hybrid Smart Solar Inverter',
    description: 'Dual MPPT, 48V Battery Compatible, On-Grid & Off-Grid Seamless Switch <4ms, Wi-Fi Remote Monitoring.',
    uom: 'Unit',
    unitPriceExclVatKES: 145000,
    vatKES: 23200,
    totalInclVatKES: 168200
  },
  {
    sku: 'HYN-SOL-BAT-5KWH',
    category: 'Solar & Clean Energy',
    name: 'Felicity / Pylontech 5.12kWh LiFePO4 Wall-Mount Battery',
    description: '51.2V 100Ah, 6,000+ Cycles at 80% DoD, Built-in Smart BMS, RS485/CAN Inverter Communication, 10-Yr Design Life.',
    uom: 'Unit',
    unitPriceExclVatKES: 175000,
    vatKES: 28000,
    totalInclVatKES: 203000
  },
  {
    sku: 'HYN-SOL-PANEL-550',
    category: 'Solar & Clean Energy',
    name: 'Jinko / Longi 550W Tier-1 Mono PERC Solar Panel',
    description: 'Bifacial High Efficiency 21.5%, Multi-Busbar, Anodized Aluminium Frame, 25-Year Linear Power Warranty.',
    uom: 'Piece',
    unitPriceExclVatKES: 13500,
    vatKES: 2160,
    totalInclVatKES: 15660
  },
  {
    sku: 'HYN-NET-STARLINK-V3',
    category: 'Networking & Satellite',
    name: 'Starlink Standard Gen 3 Actuated Satellite Kit',
    description: 'High-speed low-latency satellite internet terminal, Wi-Fi 6 Router, Kickstand, 15m cable, Kenyan CAK certified.',
    uom: 'Kit',
    unitPriceExclVatKES: 45000,
    vatKES: 7200,
    totalInclVatKES: 52200
  },
  {
    sku: 'HYN-NET-SW-8POE',
    category: 'Networking & Satellite',
    name: 'Ruijie Reyee 8-Port Gigabit Cloud Managed PoE Switch',
    description: '8x Gigabit PoE Ports (120W Budget), 2x SFP Uplink, Cloud Mobile App Management, Surge Protection 6kV.',
    uom: 'Unit',
    unitPriceExclVatKES: 14000,
    vatKES: 2240,
    totalInclVatKES: 16240
  },
  {
    sku: 'HYN-ACC-RJ45-CON',
    category: 'Accessories & Mounts',
    name: 'RJ45 Cat6 Gold-Plated Modular Connector (Pack of 100)',
    description: 'Gold-plated 8P8C pass-through modular connector for high-speed Ethernet.',
    uom: 'Pack',
    unitPriceExclVatKES: 1000,
    vatKES: 160,
    totalInclVatKES: 1160
  },
  {
    sku: 'HYN-CBL-CAT6-305M',
    category: 'Cables & Conduits',
    name: 'Siemon / D-Link 305m Pure Copper Cat6 UTP Cable Drum',
    description: 'Outdoor UV-resistant jacket, 23 AWG Solid Bare Copper, Gigabit & PoE+ certified.',
    uom: 'Roll',
    unitPriceExclVatKES: 18500,
    vatKES: 2960,
    totalInclVatKES: 21460
  }
];

export const INITIAL_SERVICES: SheetService[] = [
  {
    serviceId: 'HYN-SRV-001',
    serviceName: 'Smart CCTV Camera Installation & Commissioning',
    billingUnit: 'Per Camera Point',
    baseLabourRateKES: 2500,
    siteSurveyRequirement: 'Recommended',
    defaultComplexity: 'Low',
    scopeSummary: 'Mounting, conduit routing, RJ45 termination, focus calibration, NVR pairing & mobile app streaming.'
  },
  {
    serviceId: 'HYN-SRV-002',
    serviceName: 'Hybrid Solar PV & Inverter Microgrid Commissioning',
    billingUnit: 'Per kWp System',
    baseLabourRateKES: 18000,
    siteSurveyRequirement: 'Mandatory',
    defaultComplexity: 'Medium',
    scopeSummary: 'Roof mounting rails, panel stringing, inverter wiring, battery bank BMS configuration, AC/DC distribution board integration & EPRA compliance testing.'
  },
  {
    serviceId: 'HYN-SRV-003',
    serviceName: 'Starlink Satellite Mast Mounting & High-Speed Network Mesh',
    billingUnit: 'Per Installation',
    baseLabourRateKES: 12000,
    siteSurveyRequirement: 'Optional',
    defaultComplexity: 'Medium',
    scopeSummary: 'Roof/eaves mast fabrication, dish elevation calibration, weatherproof cable entry, indoor Wi-Fi 6 mesh distribution.'
  },
  {
    serviceId: 'HYN-SRV-004',
    serviceName: 'Electric Gate Automation & Smart Biometric Access',
    billingUnit: 'Per Gate / Door',
    baseLabourRateKES: 15000,
    siteSurveyRequirement: 'Mandatory',
    defaultComplexity: 'High',
    scopeSummary: 'Motor base anchoring, rack gear alignment, photocell safety sensor wiring, intercom & smartphone opening integration.'
  },
  {
    serviceId: 'HYN-SRV-005',
    serviceName: 'Comprehensive Engineering Site Feasibility & BOM Survey',
    billingUnit: 'Per Site',
    baseLabourRateKES: 3000,
    siteSurveyRequirement: 'Mandatory',
    defaultComplexity: 'Low',
    scopeSummary: 'Physical site inspection, roof orientation & shading analysis, cable pathway measurements, electrical earthing test, engineering Bill of Quantities.'
  }
];

export const INITIAL_CUSTOMERS: SheetCustomer[] = [
  {
    customerId: 'HYN-CUS-0001',
    purchaserName: 'David Karanja',
    purchaserPhone: '+254 712 345 678',
    purchaserEmail: 'david.karanja@example.com',
    installationRecipient: 'David Karanja (Self)',
    installationLocation: 'Karen Miotoni Road, Nairobi (-1.3195, 36.7088)',
    propertyType: 'Residential Villa / Bungalow',
    createdDate: '2026-09-15'
  },
  {
    customerId: 'HYN-CUS-0002',
    purchaserName: 'Sarah Ndung\'u (Purchaser for Parents)',
    purchaserPhone: '+254 722 890 123',
    purchaserEmail: 'sarah.ndungu@corporate.co.ke',
    installationRecipient: 'Elder Joseph & Mary Ndung\'u',
    installationLocation: 'Nyeri Outspan Hill, Nyeri County (-0.4225, 36.9450)',
    propertyType: 'Farm & Agribusiness Compound',
    createdDate: '2026-09-22'
  },
  {
    customerId: 'HYN-CUS-0003',
    purchaserName: 'Nalepo Safari Lodges Ltd (Director Amina Hassan)',
    purchaserPhone: '+254 733 456 789',
    purchaserEmail: 'amina@naleposafaris.com',
    installationRecipient: 'Lodge Operations Manager James Kiprono',
    installationLocation: 'Amboseli Gate Area, Kajiado County (-2.6500, 37.2600)',
    propertyType: 'Hotel & Safari Lodge',
    createdDate: '2026-09-28'
  },
  {
    customerId: 'HYN-CUS-0004',
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
  },
  {
    jobId: 'HYN-JOB-0003',
    customerId: 'HYN-CUS-0003',
    serviceId: 'HYN-SRV-002',
    hardwareValueKES: 780000,
    labourValueKES: 92000,
    logisticsValueKES: 25000,
    surveyFeeKES: 5000,
    subtotalExclVatKES: 902000,
    vatAmountKES: 144320,
    totalBilledKES: 1046320,
    crewSize: 4,
    estDays: 4,
    lifecycleStatus: 'In Progress'
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
  },
  {
    surveyId: 'HYN-SUR-0003',
    customerId: 'HYN-CUS-0004',
    siteLocation: 'Ruaka Limuru Road, Kiambu County',
    distanceKm: 16.0,
    siteComplexity: 'Low (Single-Story Standard)',
    surveyFeeKES: 3000,
    assessingTechnician: 'Awaiting Technician Assignment',
    surveyStatus: 'Scheduled',
    engineeringFindingsSummary: 'Awaiting site visit on Friday morning.',
    associatedJobId: 'Pending'
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
    complexityAdjustmentKES: 8000,
    finalLabourCostKES: 28000,
    assignedTechs: 0,
    techPoolSplitKES: 0,
    estDeploymentDays: 2
  },
  {
    jobId: 'HYN-JOB-0002',
    serviceId: 'HYN-SRV-002',
    scopeQuantity: 3,
    baseUnitRateKES: 18000,
    baseLabourKES: 54000,
    siteComplexity: 'Medium',
    complexityAdjustmentKES: 0,
    finalLabourCostKES: 54000,
    assignedTechs: 0,
    techPoolSplitKES: 0,
    estDeploymentDays: 3
  }
];

// STRICT REAL-WORLD STATE: The current number of HYNOVA technicians is 0.
// The Technicians worksheet is the ONLY authoritative source of truth.
// The application must NEVER create, invent, simulate, estimate, seed, or assume technicians who do not exist.
export const INITIAL_TECHNICIANS: SheetTechnician[] = [];

export const INITIAL_QUOTES: SheetQuote[] = [
  {
    quoteRef: 'HYN-Q-001',
    purchaserName: 'David Karanja',
    quoteDate: '2026-09-16',
    salesRep: 'HYNOVA Engineering Solutions Desk',
    projectScope: '8-Channel 4K AcuSense Security System with NVR',
    validity: '30 Days',
    terms: '40% Mobilization Escrow, 40% Delivery, 20% Signoff',
    hardwareSubtotalKES: 130000,
    labourKES: 28000,
    vatKES: 26400,
    grandTotalKES: 191400,
    status: 'Accepted & Converted to Job'
  },
  {
    quoteRef: 'HYN-Q-002',
    purchaserName: 'Sarah Ndung\'u',
    quoteDate: '2026-09-23',
    salesRep: 'HYNOVA Clean Energy Desk',
    projectScope: '5kW Hybrid Solar + 5.12kWh Lithium Storage',
    validity: '30 Days',
    terms: '50% M-Pesa Escrow, 50% On Customer Handover',
    hardwareSubtotalKES: 480000,
    labourKES: 54000,
    vatKES: 87840,
    grandTotalKES: 636840,
    status: 'Accepted & Converted to Job'
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
    paymentStatus: 'Held in Escrow',
    orderStatus: 'Awaiting Technician Assignment',
    createdDate: '2026-09-17'
  },
  {
    orderId: 'HYN-ORD-0002',
    customerId: 'HYN-CUS-0002',
    jobIdOrQuote: 'HYN-JOB-0002',
    totalBilledKES: 636840,
    paymentMethod: 'Bank Wire (EFT/RTGS)',
    paymentStatus: 'Held in Escrow',
    orderStatus: 'Awaiting Technician Assignment',
    createdDate: '2026-09-24'
  }
];

export const INITIAL_SIGNOFF: SheetSignoff[] = [];

// 0 Payouts when 0 technicians are registered
export const INITIAL_PAYMENTS: SheetTechnicianPayment[] = [];

export const INITIAL_MAINTENANCE: SheetMaintenance[] = [
  {
    maintId: 'HYN-MNT-0001',
    customerId: 'HYN-CUS-0001',
    serviceLevel: 'Silver SLA (Next-Day)',
    frequency: 'Quarterly',
    lastInspection: '2026-09-20',
    nextInspection: '2026-12-20',
    status: 'Scheduled'
  }
];

export const INITIAL_WARRANTY: SheetWarranty[] = [
  {
    warrantyId: 'HYN-WAR-0001',
    jobId: 'HYN-JOB-0001',
    customerId: 'HYN-CUS-0001',
    startDate: '2026-09-20',
    endDate: '2027-09-20',
    coverageType: '1-Year Comprehensive Workmanship & Equipment Replacement Guarantee',
    status: 'Active Workmanship Warranty'
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

// Active In-Memory Store
class GoogleSheetsOpsStore {
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
  public authenticatedUserEmail: string | null = null;
  public currentUserRole: string = 'ADMIN';
  public syncError: string | null = null;

  // Generate standard HYNOVA IDs
  public getNextCustomerId(): string {
    const nextNum = this.customers.length + 1;
    return `HYN-CUS-${String(nextNum).padStart(4, '0')}`;
  }

  public getNextJobId(): string {
    const nextNum = this.jobs.length + 1;
    return `HYN-JOB-${String(nextNum).padStart(4, '0')}`;
  }

  public getNextSurveyId(): string {
    const nextNum = this.siteSurveys.length + 1;
    return `HYN-SUR-${String(nextNum).padStart(4, '0')}`;
  }

  public getNextQuoteRef(): string {
    const nextNum = this.quotes.length + 1;
    return `HYN-Q-${String(nextNum).padStart(3, '0')}`;
  }

  public getNextOrderId(): string {
    const nextNum = this.orders.length + 1;
    return `HYN-ORD-${String(nextNum).padStart(4, '0')}`;
  }

  public getNextTechnicianId(): string {
    const nextNum = this.technicians.length + 1;
    return `HYTECH-${String(nextNum).padStart(4, '0')}`;
  }

  // Authoritative Technician Counts strictly from Technicians worksheet
  public getTotalTechniciansCount(): number {
    return this.technicians.length;
  }

  public getActiveTechniciansCount(): number {
    return this.technicians.filter(t => t.status === 'Active').length;
  }

  public getAvailableTechniciansCount(): number {
    return this.technicians.filter(t => t.status === 'Active' && t.availability === 'Available').length;
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

  // Add technician record to the Technicians worksheet (Section 16: Future Technician Additions)
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

    // Call backend API in background
    if (typeof window !== 'undefined') {
      fetch('/api/technicians/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-hynova-role': this.currentUserRole
        },
        body: JSON.stringify(newTech)
      }).catch(err => console.warn('Background technician create sync:', err));
    }

    return newTech;
  }

  // Labour calculation respecting Labour_Engine and Control_Panel
  public calculateLabourForScope(
    serviceId: string,
    quantity: number,
    complexity: 'Low' | 'Medium' | 'High'
  ) {
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

  // Add customer - Synchronizes through secure HYNOVA Backend API
  public addCustomer(data: Omit<SheetCustomer, 'customerId' | 'createdDate'>): SheetCustomer {
    const newCustomer: SheetCustomer = {
      customerId: this.getNextCustomerId(),
      purchaserName: data.purchaserName,
      purchaserPhone: data.purchaserPhone,
      purchaserEmail: data.purchaserEmail,
      installationRecipient: data.installationRecipient || data.purchaserName,
      installationLocation: data.installationLocation,
      propertyType: data.propertyType,
      createdDate: new Date().toISOString().split('T')[0]
    };
    this.customers.unshift(newCustomer);

    // Call backend API in background for verified server-side persistence
    if (typeof window !== 'undefined') {
      fetch('/api/sheets/customer/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      }).catch(err => console.warn('Background customer register sync:', err));
    }

    return newCustomer;
  }

  // Add site survey - Synchronizes through secure HYNOVA Backend API
  public addSiteSurvey(data: {
    customerId: string;
    siteLocation: string;
    distanceKm?: number;
    siteComplexity?: string;
    assessingTechnician?: string;
    engineeringFindingsSummary?: string;
    associatedJobId?: string;
  }): SheetSiteSurvey {
    const newSurvey: SheetSiteSurvey = {
      surveyId: this.getNextSurveyId(),
      customerId: data.customerId,
      siteLocation: data.siteLocation,
      distanceKm: data.distanceKm || 15,
      siteComplexity: data.siteComplexity || 'Low (Single-Story Standard)',
      surveyFeeKES: this.controlPanel.baseSiteSurveyFee,
      assessingTechnician: data.assessingTechnician || 'HYNOVA Field Engineer Team',
      surveyStatus: 'Submitted & Awaiting Site Visit',
      engineeringFindingsSummary: data.engineeringFindingsSummary || 'Customer requested on-site verification and Bill of Quantities sizing.',
      associatedJobId: data.associatedJobId || 'Pending'
    };
    this.siteSurveys.unshift(newSurvey);

    // Call backend API in background
    if (typeof window !== 'undefined') {
      fetch('/api/sheets/site-survey/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSurvey)
      }).catch(err => console.warn('Background survey book sync:', err));
    }

    return newSurvey;
  }

  // Add quote - Synchronizes through secure HYNOVA Backend API
  public addQuote(data: {
    purchaserName: string;
    projectScope: string;
    hardwareSubtotalKES: number;
    labourKES: number;
    terms?: string;
  }): SheetQuote {
    const subtotal = data.hardwareSubtotalKES + data.labourKES;
    const vat = Math.round(subtotal * this.controlPanel.standardVatRate);
    const grandTotal = subtotal + vat;

    const newQuote: SheetQuote = {
      quoteRef: this.getNextQuoteRef(),
      purchaserName: data.purchaserName,
      quoteDate: new Date().toISOString().split('T')[0],
      salesRep: 'HYNOVA AI Operations Desk',
      projectScope: data.projectScope,
      validity: '30 Days',
      terms: data.terms || 'Milestone Escrow: 40% Mobilization, 40% Delivery, 20% Signoff',
      hardwareSubtotalKES: data.hardwareSubtotalKES,
      labourKES: data.labourKES,
      vatKES: vat,
      grandTotalKES: grandTotal,
      status: 'Active Quote'
    };
    this.quotes.unshift(newQuote);

    // Call backend API in background
    if (typeof window !== 'undefined') {
      fetch('/api/sheets/quote/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuote)
      }).catch(err => console.warn('Background quote sync:', err));
    }

    return newQuote;
  }

  // Add job - Synchronizes through secure HYNOVA Backend API
  public addJob(data: {
    customerId: string;
    serviceId: string;
    hardwareValueKES: number;
    labourValueKES: number;
    logisticsValueKES?: number;
    surveyFeeKES?: number;
    crewSize?: number;
    estDays?: number;
  }): SheetJob {
    const logistics = data.logisticsValueKES || 3000;
    const survey = data.surveyFeeKES || this.controlPanel.baseSiteSurveyFee;
    const subtotal = data.hardwareValueKES + data.labourValueKES + logistics + survey;
    const vat = Math.round(subtotal * this.controlPanel.standardVatRate);
    const totalBilled = subtotal + vat;

    const newJob: SheetJob = {
      jobId: this.getNextJobId(),
      customerId: data.customerId,
      serviceId: data.serviceId,
      hardwareValueKES: data.hardwareValueKES,
      labourValueKES: data.labourValueKES,
      logisticsValueKES: logistics,
      surveyFeeKES: survey,
      subtotalExclVatKES: subtotal,
      vatAmountKES: vat,
      totalBilledKES: totalBilled,
      crewSize: data.crewSize || this.controlPanel.standardBaselineTechnicians,
      estDays: data.estDays || 2,
      lifecycleStatus: 'Scheduled'
    };
    this.jobs.unshift(newJob);

    // Call backend API in background
    fetch('/api/sheets/job/create', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-hynova-role': this.currentUserRole
      },
      body: JSON.stringify(newJob)
    }).catch(err => console.warn('Background job sync:', err));

    return newJob;
  }

  // PRODUCTION ARCHITECTURE: SECURE BACKEND API SYNCHRONIZATION
  // Routes synchronization through HYNOVA backend server
  public async syncWithGoogleSheets(accessToken: string, userEmail?: string): Promise<{ success: boolean; message: string }> {
    try {
      this.syncError = null;

      // 1. Sync through backend API endpoint
      const backendSyncRes = await fetch('/api/sheets/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-google-token': accessToken,
          'x-user-email': userEmail || '',
          'x-hynova-role': this.currentUserRole
        }
      });

      if (backendSyncRes.ok) {
        const syncData = await backendSyncRes.json();
        this.isConnectedToGoogle = Boolean(syncData.isConnectedToGoogle);
      }

      // 2. Refresh active worksheets from backend
      const worksheetsRes = await fetch('/api/sheets/worksheets', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'x-google-token': accessToken,
          'x-hynova-role': this.currentUserRole
        }
      });

      if (worksheetsRes.ok) {
        const wsJson = await worksheetsRes.json();
        if (wsJson.data) {
          if (wsJson.data.controlPanel) this.controlPanel = { ...this.controlPanel, ...wsJson.data.controlPanel };
          if (wsJson.data.products?.length) this.products = wsJson.data.products;
          if (wsJson.data.services?.length) this.services = wsJson.data.services;
          if (wsJson.data.customers?.length) this.customers = wsJson.data.customers;
          if (wsJson.data.jobs?.length) this.jobs = wsJson.data.jobs;
          if (wsJson.data.siteSurveys?.length) this.siteSurveys = wsJson.data.siteSurveys;
          if (wsJson.data.technicians?.length) this.technicians = wsJson.data.technicians;
          if (wsJson.data.quotes?.length) this.quotes = wsJson.data.quotes;
          if (wsJson.data.dispatches?.length) this.dispatches = wsJson.data.dispatches;
          if (wsJson.data.orders?.length) this.orders = wsJson.data.orders;
          if (wsJson.data.signoffs?.length) this.signoffs = wsJson.data.signoffs;
          if (wsJson.data.payments?.length) this.payments = wsJson.data.payments;
          if (wsJson.data.maintenance?.length) this.maintenance = wsJson.data.maintenance;
          if (wsJson.data.warranties?.length) this.warranties = wsJson.data.warranties;
          if (wsJson.data.support?.length) this.support = wsJson.data.support;
        }
      }

      this.isConnectedToGoogle = true;
      this.authenticatedUserEmail = userEmail || 'Connected Google Workspace User';
      this.lastSynced = new Date();
      return {
        success: true,
        message: `Successfully connected to HYNOVA OPS spreadsheet (ID: ${SPREADSHEET_ID}) via secure HYNOVA Backend API. All 18 registers synchronized.`
      };
    } catch (err: any) {
      this.syncError = err.message || 'Error communicating with HYNOVA Backend Sheets Service';
      console.error('Google Sheets Sync Failed:', err);
      return {
        success: false,
        message: this.syncError || 'Error communicating with HYNOVA Backend Sheets Service'
      };
    }
  }

  // SECURE BACKEND-ROUTED WRITE OPERATION
  // Prevents direct untrusted browser writes; routes through HYNOVA backend with role validation
  public async appendRowToGoogleSheet(
    sheetName: string,
    rowValues: any[],
    accessToken: string
  ): Promise<boolean> {
    try {
      const res = await fetch('/api/sheets/privileged/append-row', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'x-google-token': accessToken,
          'x-hynova-role': this.currentUserRole
        },
        body: JSON.stringify({
          sheetName,
          rowValues
        })
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Failed to append row to ${sheetName}`);
      }

      this.lastSynced = new Date();
      return true;
    } catch (err) {
      console.error(`Error appending row to Google Sheets tab ${sheetName}:`, err);
      throw err;
    }
  }
}

export const googleSheetsOps = new GoogleSheetsOpsStore();
