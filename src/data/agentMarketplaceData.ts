import { 
  HynovaAIAgent, 
  AgentWorkflowPipeline, 
  AgentEventMessage, 
  ExecutiveAlert,
  AgentOutcomeCategory,
  AgentStrategicClassification
} from '../types';

export const INITIAL_HYNOVA_AGENTS: HynovaAIAgent[] = [
  // 1. Sales Agent
  {
    id: 'HYN-AGT-0001',
    name: 'Sales Agent',
    category: 'Sales',
    version: '2.4',
    owner: 'Commercial Growth Directorate',
    description: 'Converts customer technology enquiries into qualified opportunities, manages CRM profiles, lead scoring, and automated Kenyan appointment schedules.',
    mission: 'Convert enquiries into qualified opportunities while upholding the HYNOVA Affordability Promise.',
    primaryOutcome: 'Revenue',
    secondaryOutcomes: ['Customer Experience'],
    strategicClassification: 'Growth',
    status: 'Active',
    capabilities: [
      'Lead qualification & scoring across all 47 counties',
      'Affordability budget assessment (KES 5,000+)',
      'Multi-channel WhatsApp, email & web ingestion',
      'Automated sales opportunity pipeline management',
      'Follow-up cadence & meeting dispatch'
    ],
    responsibilities: [
      'Lead qualification',
      'Customer onboarding',
      'Needs assessment',
      'Product recommendations',
      'Requirement gathering',
      'CRM updates',
      'Lead scoring',
      'Appointment scheduling',
      'Follow-ups',
      'Opportunity management'
    ],
    inputs: [
      'Customer enquiries',
      'Website sizing forms',
      'WhatsApp messages (+254 727 547 310)',
      'Direct customer phone call transcripts',
      'Social media & partner inquiries'
    ],
    outputs: [
      'Qualified lead dossier',
      'Structured customer profile',
      'Project requirement summary',
      'Sales opportunity score (1-100)',
      'Recommended preliminary services'
    ],
    kpis: [
      'Lead conversion rate: 38.4%',
      'Quote request rate: 71.2%',
      'Average customer response time: 1.4 mins',
      'Pipeline value influenced: KES 148.5M',
      'Sales cycle duration: 2.8 days'
    ],
    dependencies: ['Quotation Agent', 'Executive Intelligence Agent'],
    permissions: [
      'Read Customer Data',
      'Create Quotes',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Lead Ingested', 'Contact Requested', 'Quote Expired'],
    knowledgeDomains: ['Kenyan County Demographics', 'Property Typologies', 'Affordability Guidelines', 'Lead Scoring Heuristics'],
    impactScores: {
      revenueImpact: 94,
      operationalImpact: 68,
      customerImpact: 88,
      riskImpact: 35,
      intelligenceImpact: 72,
      overallScore: 82
    },
    economics: {
      revenueGeneratedKES: 42500000,
      revenueInfluencedKES: 112000000,
      costSavingsKES: 4800000,
      labourHoursSaved: 1420,
      customerRetentionValueKES: 8600000,
      riskReductionValueKES: 1200000,
      totalOperatingCostKES: 920000,
      netROIPercent: 1217,
      automationRatePercent: 84
    },
    rating: 4.9,
    tasksCompleted: 4210,
    deploymentDate: '2025-11-15',
    lastUpdated: '2026-09-20'
  },

  // 2. Quotation Agent
  {
    id: 'HYN-AGT-0002',
    name: 'Quotation Agent',
    category: 'Finance',
    version: '3.1',
    owner: 'Commercial Pricing & Estimations',
    description: 'Calculates precise itemized BOQs, Kenyan 16% VAT compliance, transit logistics, and dynamic margin protection formulas.',
    mission: 'Generate accurate, transparent, and profitable quotations that protect customer trust and company gross margins.',
    primaryOutcome: 'Revenue',
    secondaryOutcomes: ['Operations', 'Risk & Compliance'],
    strategicClassification: 'Core',
    status: 'Active',
    capabilities: [
      'Dynamic BOQ generation using central wholesale database',
      '16% Kenyan VAT itemization compliant with KRA guidelines',
      'Margin floor protection (20% - 35% gross margin check)',
      'Automated PDF quote compilation with unique HYN-2026 IDs',
      'Distance and travel fee calculation across all 47 counties'
    ],
    responsibilities: [
      'Product selection',
      'BOQ generation',
      'Pricing calculation',
      'VAT calculation',
      'Logistics estimation',
      'Quote generation',
      'Discount validation',
      'Proposal creation'
    ],
    inputs: [
      'Customer requirements',
      'Inventory database',
      'Installation scoping parameters',
      'Pricing margin rules',
      'Location coordinates'
    ],
    outputs: [
      'Professional binding quotation',
      'Itemized Bill of Quantities (BOQ)',
      'Project pricing breakdown',
      'Formal PDF proposal packet',
      'Unique Quote Reference (HYN-2026-XXX)'
    ],
    kpis: [
      'Quote turnaround time: 3.2 seconds',
      'Quote accuracy rate: 99.4%',
      'Quote approval rate: 64.8%',
      'Margin protection adherence: 100%'
    ],
    dependencies: ['Installation Scoping Agent', 'Inventory Agent', 'Finance Agent'],
    permissions: [
      'Read Customer Data',
      'Read Inventory',
      'Create Quotes',
      'Approve Quotes',
      'View Financial Data',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Scope Defined', 'Inventory Sized', 'Discount Requested'],
    knowledgeDomains: ['EPRA Pricing Standards', 'KRA 16% VAT Rules', 'Wholesale Price Catalogs', 'Margin Protection Matrices'],
    impactScores: {
      revenueImpact: 96,
      operationalImpact: 84,
      customerImpact: 90,
      riskImpact: 78,
      intelligenceImpact: 65,
      overallScore: 89
    },
    economics: {
      revenueGeneratedKES: 68400000,
      revenueInfluencedKES: 145000000,
      costSavingsKES: 7200000,
      labourHoursSaved: 2850,
      customerRetentionValueKES: 11400000,
      riskReductionValueKES: 4500000,
      totalOperatingCostKES: 1150000,
      netROIPercent: 1560,
      automationRatePercent: 96
    },
    rating: 4.95,
    tasksCompleted: 6890,
    deploymentDate: '2025-10-01',
    lastUpdated: '2026-09-22'
  },

  // 3. Installation Scoping Agent
  {
    id: 'HYN-AGT-0003',
    name: 'Installation Scoping Agent',
    category: 'Operations',
    version: '2.8',
    owner: 'Technical Engineering Directorate',
    description: 'Evaluates project complexity, property layout, cable trunking distances, safety risks, and physical site survey requirements.',
    mission: 'Determine accurate project complexity, material requirements, labor duration, and deployment safety before field execution.',
    primaryOutcome: 'Operations',
    secondaryOutcomes: ['Risk & Compliance'],
    strategicClassification: 'Core',
    status: 'Active',
    capabilities: [
      'Automated site survey mandate determination',
      'Electrical load & roof mounting pitch assessment',
      'Cable trunking pathway & attenuation estimation',
      'Crew size & skill level recommendation',
      'Kenyan NCA/EPRA safety risk categorization'
    ],
    responsibilities: [
      'Complexity assessment',
      'Installation planning',
      'Labour estimation',
      'Duration estimation',
      'Risk assessment',
      'Site survey determination',
      'Technician requirement estimation'
    ],
    inputs: [
      'Property information & satellite layout',
      'Building blueprint / photos',
      'Device count and wattages',
      'Installation scope specifications',
      'Site survey technician reports'
    ],
    outputs: [
      'Standardized installation scope',
      'Complexity score (Level 1 to 4)',
      'Estimated labor hours & crew count',
      'Deployment timeline estimate',
      'Technical risk profile & mitigations'
    ],
    kpis: [
      'Scope accuracy: 96.2%',
      'Labor estimation variance: < 8%',
      'Project scope variations reduction: 82%',
      'On-site completion accuracy: 94.7%'
    ],
    dependencies: ['Quotation Agent', 'Technician Matching Agent'],
    permissions: [
      'Read Customer Data',
      'Validate EPRA/NCA Compliance',
      'Create Jobs',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Quote Created', 'Survey Completed', 'Scope Variation Requested'],
    knowledgeDomains: ['NCA Building Regulations', 'EPRA Electrical Codes', 'Cabling Physics', 'Risk Mitigation Protocols'],
    impactScores: {
      revenueImpact: 58,
      operationalImpact: 95,
      customerImpact: 82,
      riskImpact: 91,
      intelligenceImpact: 60,
      overallScore: 84
    },
    economics: {
      revenueGeneratedKES: 14200000,
      revenueInfluencedKES: 88000000,
      costSavingsKES: 12500000,
      labourHoursSaved: 3400,
      customerRetentionValueKES: 6800000,
      riskReductionValueKES: 14800000,
      totalOperatingCostKES: 980000,
      netROIPercent: 1280,
      automationRatePercent: 88
    },
    rating: 4.88,
    tasksCompleted: 5120,
    deploymentDate: '2025-11-01',
    lastUpdated: '2026-09-18'
  },

  // 4. Inventory Agent
  {
    id: 'HYN-AGT-0004',
    name: 'Inventory Agent',
    category: 'Operations',
    version: '2.5',
    owner: 'Supply Chain & Logistics',
    description: 'Monitors genuine bonded inventory, predicts regional hardware stockouts, recommends verified suppliers, and allocates stock.',
    mission: 'Protect inventory availability, eliminate stockouts, and negotiate optimal wholesale procurement across verified Kenyan suppliers.',
    primaryOutcome: 'Operations',
    secondaryOutcomes: ['Revenue', 'Risk & Compliance'],
    strategicClassification: 'Optimization',
    status: 'Active',
    capabilities: [
      'Real-time stock level synchronization with bonded warehouses',
      'Predictive county-level demand forecasting',
      'Automated supplier reorder alerts',
      'Serial number and genuine bond verification',
      'Asset reservation against confirmed escrow deposits'
    ],
    responsibilities: [
      'Stock monitoring',
      'Reorder alerts',
      'Supplier recommendations',
      'Inventory forecasting',
      'Asset allocation',
      'Procurement suggestions'
    ],
    inputs: [
      'Warehouse inventory records',
      'Customer orders in progress',
      'Regional sales forecasts',
      'Supplier catalog pricing & lead times',
      'Equipment fault rate reports'
    ],
    outputs: [
      'Low-stock and stockout alerts',
      'Purchase order recommendations',
      'Regional inventory allocation plans',
      'Real-time BOM availability confirmations'
    ],
    kpis: [
      'Stock accuracy: 99.8%',
      'Stockout prevention rate: 98.1%',
      'Inventory turnover velocity: +42%',
      'Warehouse holding cost reduction: 18.5%'
    ],
    dependencies: ['Quotation Agent', 'Procurement Agent'],
    permissions: [
      'Read Inventory',
      'View Financial Data',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Order Confirmed', 'Hardware Dispatched', 'Stock Level Threshold Breached'],
    knowledgeDomains: ['Bonded Warehouse Logistics', 'Kenyan Customs Clearing', 'Supplier Credit Terms', 'Equipment Aging Curves'],
    impactScores: {
      revenueImpact: 74,
      operationalImpact: 92,
      customerImpact: 76,
      riskImpact: 84,
      intelligenceImpact: 81,
      overallScore: 82
    },
    economics: {
      revenueGeneratedKES: 18500000,
      revenueInfluencedKES: 92000000,
      costSavingsKES: 9400000,
      labourHoursSaved: 2150,
      customerRetentionValueKES: 5200000,
      riskReductionValueKES: 8100000,
      totalOperatingCostKES: 850000,
      netROIPercent: 1110,
      automationRatePercent: 91
    },
    rating: 4.85,
    tasksCompleted: 8430,
    deploymentDate: '2025-10-15',
    lastUpdated: '2026-09-24'
  },

  // 5. Dispatch Agent
  {
    id: 'HYN-AGT-0005',
    name: 'Dispatch Agent',
    category: 'Operations',
    version: '2.9',
    owner: 'Field Dispatch & Logistics Coordination',
    description: 'Coordinates installation work orders, plans travel routes, tracks transit status, and generates legally binding digital dispatch slips.',
    mission: 'Ensure zero uncoordinated field work and maximize on-time deployment across all Kenyan towns and rural counties.',
    primaryOutcome: 'Operations',
    secondaryOutcomes: ['Customer Experience'],
    strategicClassification: 'Core',
    status: 'Active',
    capabilities: [
      'Google Maps distance & travel estimation integration',
      'Digital dispatch dossier generation (HYN-DIS-XXXX)',
      'Multi-job sequencing & traffic-aware scheduling',
      'Real-time technician transit status updates for customers',
      'Emergency roadside and weather contingency routing'
    ],
    responsibilities: [
      'Job scheduling',
      'Dispatch planning',
      'Route planning',
      'Technician assignment coordination',
      'Job sequencing',
      'Timeline management'
    ],
    inputs: [
      'Confirmed customer jobs',
      'Available matched technicians',
      'County GPS coordinates',
      'Client delivery window preferences',
      'Traffic and weather conditions'
    ],
    outputs: [
      'Authorized dispatch records',
      'Technician job schedules',
      'Optimized route itineraries',
      'Customer technician tracking links'
    ],
    kpis: [
      'On-time technician arrival: 96.4%',
      'Dispatch coordination time: < 45 seconds',
      'Technician travel time reduction: 24%',
      'First-day completion rate: 91.8%'
    ],
    dependencies: ['Technician Matching Agent', 'Installation Scoping Agent'],
    permissions: [
      'Read Customer Data',
      'Create Jobs',
      'Dispatch Technicians',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Technician Assigned', 'Payment Confirmed', 'Job Rescheduled'],
    knowledgeDomains: ['Kenyan Road Infrastructure', 'Google Maps Distance Matrix', 'Field Safety Standards', 'Work Order Sequencing'],
    impactScores: {
      revenueImpact: 62,
      operationalImpact: 96,
      customerImpact: 91,
      riskImpact: 74,
      intelligenceImpact: 66,
      overallScore: 84
    },
    economics: {
      revenueGeneratedKES: 12400000,
      revenueInfluencedKES: 78000000,
      costSavingsKES: 11200000,
      labourHoursSaved: 3600,
      customerRetentionValueKES: 9200000,
      riskReductionValueKES: 6400000,
      totalOperatingCostKES: 910000,
      netROIPercent: 1230,
      automationRatePercent: 93
    },
    rating: 4.91,
    tasksCompleted: 6150,
    deploymentDate: '2025-11-20',
    lastUpdated: '2026-09-25'
  },

  // 6. Technician Matching Agent
  {
    id: 'HYN-AGT-0006',
    name: 'Technician Matching Agent',
    category: 'Operations',
    version: '3.0',
    owner: 'HYTECH Network Management',
    description: 'Scores and assigns certified HYTECH installers based on skill tier, EPRA/NCA certifications, proximity, and past customer sign-off ratings.',
    mission: 'Assign the ideal certified specialist to every project while safeguarding workmanship quality and installation safety.',
    primaryOutcome: 'Operations',
    secondaryOutcomes: ['Risk & Compliance', 'Customer Experience'],
    strategicClassification: 'Core',
    status: 'Active',
    capabilities: [
      'Proximity-first algorithmic installer ranking',
      'EPRA Solar & NCA Telecommunications credential verification',
      'Historical customer sign-off rating weighting (⭐ 4.8+ target)',
      'Current installer workload & fatigue prevention limits',
      'Dual-technician crew composition for complex industrial sites'
    ],
    responsibilities: [
      'Skill matching',
      'Availability matching',
      'Location matching',
      'Performance matching',
      'Certification validation',
      'Capacity management'
    ],
    inputs: [
      'HYTECH technician database (2,400+ verified)',
      'Job technical requirements & complexity',
      'Technician calendar availability',
      'Historical quality & dispute records',
      'County operating coverage permits'
    ],
    outputs: [
      'Top-3 recommended technician profiles',
      'Objective matching compatibility score (1-100)',
      'Certification compliance validation badge',
      'Installer workload capacity alerts'
    ],
    kpis: [
      'Matching success rate: 98.6%',
      'First-time installation sign-off: 95.2%',
      'Technician network utilization: 86.4%',
      'Dispute incident rate: < 0.8%'
    ],
    dependencies: ['Installation Scoping Agent', 'Dispatch Agent'],
    permissions: [
      'Validate EPRA/NCA Compliance',
      'Dispatch Technicians',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Job Sized', 'Technician Status Changed', 'Technician Certification Renewed'],
    knowledgeDomains: ['EPRA Licensing Tiers', 'NCA Contractor Standards', 'Regional Skill Distributions', 'Rating Calibration Algorithms'],
    impactScores: {
      revenueImpact: 66,
      operationalImpact: 94,
      customerImpact: 93,
      riskImpact: 94,
      intelligenceImpact: 70,
      overallScore: 88
    },
    economics: {
      revenueGeneratedKES: 16800000,
      revenueInfluencedKES: 84000000,
      costSavingsKES: 10800000,
      labourHoursSaved: 3100,
      customerRetentionValueKES: 10400000,
      riskReductionValueKES: 16200000,
      totalOperatingCostKES: 940000,
      netROIPercent: 1150,
      automationRatePercent: 89
    },
    rating: 4.93,
    tasksCompleted: 5840,
    deploymentDate: '2025-10-25',
    lastUpdated: '2026-09-23'
  },

  // 7. Maintenance Agent
  {
    id: 'HYN-AGT-0007',
    name: 'Maintenance Agent',
    category: 'Maintenance',
    version: '2.6',
    owner: 'Customer Success & Asset Management',
    description: 'Schedules preventive servicing, monitors battery cycle aging and camera telemetry, and automates annual recurring SLA renewals.',
    mission: 'Maximize customer infrastructure lifespan, eliminate unscheduled equipment breakdowns, and expand high-margin recurring SLA revenue.',
    primaryOutcome: 'Revenue',
    secondaryOutcomes: ['Customer Experience', 'Operations'],
    strategicClassification: 'Growth',
    status: 'Active',
    capabilities: [
      'Automated SLA renewal notifications and M-Pesa billing',
      'Preventive servicing visit scheduling (quarterly & bi-annual)',
      'Lithium battery State-of-Health (SoH) telemetry tracking',
      'Camera lens cleaning and firmware patching alerts',
      'Lifecycle hardware upgrade recommendations'
    ],
    responsibilities: [
      'Maintenance recommendations',
      'Renewals',
      'Service scheduling',
      'Preventive maintenance planning',
      'Asset lifecycle monitoring',
      'Upsell opportunities'
    ],
    inputs: [
      'Completed installation records',
      'Asset telemetry and cycle logs',
      'Active maintenance contracts (HYN-MNT-XXXX)',
      'Manufacturer warranty expiry timelines',
      'Previous servicing tickets'
    ],
    outputs: [
      'Preventive service schedules',
      'Contract renewal proposals',
      'Battery & hardware health scores',
      'Upsell & expansion recommendations'
    ],
    kpis: [
      'Annual SLA renewal rate: 84.6%',
      'Recurring SLA contract revenue: KES 34.2M/yr',
      'Unscheduled breakdown reduction: 73%',
      'Asset retention longevity: +3.2 years'
    ],
    dependencies: ['Quotation Agent', 'Dispatch Agent'],
    permissions: [
      'Read Customer Data',
      'Manage Maintenance',
      'Create Quotes',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Job Completed', 'Warranty Expiring', 'Maintenance Due'],
    knowledgeDomains: ['Lithium Battery Degradation', 'Surge Suppressor Lifecycles', 'Hikvision/Deye Firmware', 'Preventive Checklists'],
    impactScores: {
      revenueImpact: 91,
      operationalImpact: 78,
      customerImpact: 89,
      riskImpact: 82,
      intelligenceImpact: 75,
      overallScore: 85
    },
    economics: {
      revenueGeneratedKES: 34200000,
      revenueInfluencedKES: 62000000,
      costSavingsKES: 6100000,
      labourHoursSaved: 1650,
      customerRetentionValueKES: 14200000,
      riskReductionValueKES: 9400000,
      totalOperatingCostKES: 780000,
      netROIPercent: 1420,
      automationRatePercent: 86
    },
    rating: 4.89,
    tasksCompleted: 3920,
    deploymentDate: '2025-12-01',
    lastUpdated: '2026-09-21'
  },

  // 8. Support Agent
  {
    id: 'HYN-AGT-0008',
    name: 'Support Agent',
    category: 'Customer Support',
    version: '2.7',
    owner: 'Customer Care & Technical Helpdesk',
    description: 'Delivers 24/7 instant troubleshooting, triage, warranty claim validation, and WhatsApp escalation to on-call duty engineers.',
    mission: 'Resolve customer technical inquiries and warranty claims swiftly with empathy, clarity, and zero bureaucratic friction.',
    primaryOutcome: 'Customer Experience',
    secondaryOutcomes: ['Operations', 'Risk & Compliance'],
    strategicClassification: 'Defensive',
    status: 'Active',
    capabilities: [
      'Natural language technical diagnostic triage (English & Swahili)',
      'Router reset and NVR mobile app pairing assistance',
      'Instant warranty claim verification (HYN-WAR-XXXX)',
      'Automated dispatch of on-call warranty technician',
      'Customer satisfaction CSAT survey collection'
    ],
    responsibilities: [
      'Ticket triage',
      'Issue classification',
      'Troubleshooting',
      'Escalation management',
      'Customer communication',
      'Knowledge base management'
    ],
    inputs: [
      'Inbound support tickets (HYN-TCK-XXXX)',
      'Live customer chat conversations',
      'Warranty registration records',
      'Technician installation handover notes',
      'Error code logs from inverters/CCTV'
    ],
    outputs: [
      'Instant resolution guidance',
      'Escalated support dispatch orders',
      'Warranty claim validation receipts',
      'Knowledge base update suggestions'
    ],
    kpis: [
      'First-contact resolution rate: 68.4%',
      'Average response time: 28 seconds',
      'Customer satisfaction (CSAT): 98.2%',
      'Dispute escalation to leadership: < 1.1%'
    ],
    dependencies: ['Maintenance Agent', 'Executive Intelligence Agent'],
    permissions: [
      'Read Customer Data',
      'Manage Maintenance',
      'Trigger Autonomous Alerts',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Ticket Created', 'Customer Review Submitted', 'System Alarm Fired'],
    knowledgeDomains: ['Inverter Fault Code Database', 'CCTV Network Protocols', 'Warranty Dispute SOPs', 'Swahili Technical Support'],
    impactScores: {
      revenueImpact: 45,
      operationalImpact: 88,
      customerImpact: 97,
      riskImpact: 83,
      intelligenceImpact: 69,
      overallScore: 81
    },
    economics: {
      revenueGeneratedKES: 6200000,
      revenueInfluencedKES: 45000000,
      costSavingsKES: 8800000,
      labourHoursSaved: 3800,
      customerRetentionValueKES: 16800000,
      riskReductionValueKES: 7500000,
      totalOperatingCostKES: 820000,
      netROIPercent: 980,
      automationRatePercent: 78
    },
    rating: 4.96,
    tasksCompleted: 9420,
    deploymentDate: '2025-11-10',
    lastUpdated: '2026-09-26'
  },

  // 9. Finance Agent
  {
    id: 'HYN-AGT-0009',
    name: 'Finance Agent',
    category: 'Finance',
    version: '3.2',
    owner: 'Finance & Internal Audit Directorate',
    description: 'Safeguards M-Pesa escrow releases, calculates technician earnings, itemizes Kenyan 16% VAT, and forecasts corporate cash flow.',
    mission: 'Protect HYNOVA financial health, guarantee 100% escrow compliance, and automate error-free payouts to verified installers.',
    primaryOutcome: 'Revenue',
    secondaryOutcomes: ['Risk & Compliance', 'Operations'],
    strategicClassification: 'Core',
    status: 'Active',
    capabilities: [
      'M-Pesa Escrow API ledger tracking and milestone releases',
      'Technician payout calculation based on rank & sign-off',
      'KRA-compliant automated electronic invoicing & receipts',
      'Platform gross margin auditing (flagging jobs < 20% margin)',
      'Automated commission distribution for referral partners'
    ],
    responsibilities: [
      'Invoice generation',
      'Payment tracking',
      'Technician payment calculation',
      'Revenue reporting',
      'Expense tracking',
      'Margin monitoring',
      'Cash flow forecasting',
      'Commission calculations'
    ],
    inputs: [
      'Approved customer orders',
      'M-Pesa payment gateway webhooks',
      'Customer digital sign-off confirmations',
      'Technician rate cards and bonus rules',
      'Inventory cost of goods sold (COGS)'
    ],
    outputs: [
      'Official tax invoices & payment receipts',
      'Automated technician payment schedules',
      'Real-time cash flow & escrow balance sheets',
      'Executive margin profitability reports'
    ],
    kpis: [
      'Escrow release accuracy: 100%',
      'Cash collection cycle: 0.4 days (instant escrow)',
      'Gross contribution margin: 28.4%',
      'Payment reconciliation variance: KES 0.00'
    ],
    dependencies: ['Quotation Agent', 'Executive Intelligence Agent'],
    permissions: [
      'View Financial Data',
      'Approve Payments',
      'Manage M-Pesa Escrow',
      'Trigger Autonomous Alerts',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Customer Sign-off Completed', 'Escrow Deposited', 'Margin Variance Detected'],
    knowledgeDomains: ['Kenyan Banking Regulations', 'M-Pesa B2C/C2B APIs', 'KRA eTIMS Tax Compliance', 'Escrow Legal Structures'],
    impactScores: {
      revenueImpact: 98,
      operationalImpact: 87,
      customerImpact: 84,
      riskImpact: 97,
      intelligenceImpact: 88,
      overallScore: 92
    },
    economics: {
      revenueGeneratedKES: 88400000,
      revenueInfluencedKES: 195000000,
      costSavingsKES: 14200000,
      labourHoursSaved: 2900,
      customerRetentionValueKES: 12500000,
      riskReductionValueKES: 24000000,
      totalOperatingCostKES: 1250000,
      netROIPercent: 1840,
      automationRatePercent: 97
    },
    rating: 4.98,
    tasksCompleted: 7120,
    deploymentDate: '2025-10-10',
    lastUpdated: '2026-09-25'
  },

  // 10. Executive Intelligence Agent
  {
    id: 'HYN-AGT-0010',
    name: 'Executive Intelligence Agent',
    category: 'Executive Intelligence',
    version: '3.5',
    owner: 'Office of the Chief Executive & Board',
    description: 'Aggregates platform-wide telemetry, generates board-ready reports, forecasts county infrastructure demand, and flags strategic risks.',
    mission: 'Deliver unvarnished, real-time strategic intelligence, risk alerts, and predictive business recommendations to HYNOVA leadership.',
    primaryOutcome: 'Intelligence',
    secondaryOutcomes: ['Revenue', 'Risk & Compliance'],
    strategicClassification: 'Innovation',
    status: 'Active',
    capabilities: [
      'Cross-ecosystem business outcome synthesis',
      'Automated board & leadership report compilation',
      'Regional infrastructure expansion forecasting',
      'Proactive margin leakage and anomaly detection',
      'Scenario planning and growth modeling'
    ],
    responsibilities: [
      'Trend analysis',
      'Revenue forecasting',
      'Operational insights',
      'Performance monitoring',
      'Growth recommendations',
      'Risk detection',
      'Board reporting',
      'Strategic planning support'
    ],
    inputs: [
      'Aggregated platform database metrics',
      'Finance and revenue streams',
      'Field operations completion velocity',
      'Technician quality & satisfaction metrics',
      'Kenyan macro-economic & energy grid data'
    ],
    outputs: [
      'Executive dashboards & radar metrics',
      'Quarterly Board Intelligence Dossiers',
      'Operational anomaly alerts',
      'Strategic growth & procurement directives'
    ],
    kpis: [
      'Revenue forecast accuracy: 94.8%',
      'Executive insight utilization: 91.2%',
      'Risk anomaly early warning lead time: 14 days',
      'Strategic recommendation ROI: +28%'
    ],
    dependencies: ['Finance Agent', 'Sales Agent', 'Dispatch Agent'],
    permissions: [
      'View Executive Reports',
      'View Financial Data',
      'Trigger Autonomous Alerts',
      'Broadcast Event Bus'
    ],
    eventSubscriptions: ['Monthly Period Closed', 'Escrow Anomaly Detected', 'Executive Review Triggered'],
    knowledgeDomains: ['Kenyan Technology Economy', 'SaaS Business Metrics', 'Infrastructure Risk Modeling', 'Corporate Governance'],
    impactScores: {
      revenueImpact: 88,
      operationalImpact: 82,
      customerImpact: 74,
      riskImpact: 92,
      intelligenceImpact: 99,
      overallScore: 90
    },
    economics: {
      revenueGeneratedKES: 36000000,
      revenueInfluencedKES: 210000000,
      costSavingsKES: 16500000,
      labourHoursSaved: 1800,
      customerRetentionValueKES: 18200000,
      riskReductionValueKES: 32000000,
      totalOperatingCostKES: 1400000,
      netROIPercent: 1690,
      automationRatePercent: 88
    },
    rating: 4.97,
    tasksCompleted: 2450,
    deploymentDate: '2025-10-05',
    lastUpdated: '2026-09-26'
  },

  // 11. Solar Agent (Domain Specialist)
  {
    id: 'HYN-AGT-0011',
    name: 'Solar Agent',
    category: 'Solar',
    version: '2.3',
    owner: 'Renewable Energy Engineering',
    description: 'Specializes in PV irradiance calculations, lithium battery C-ratings, inverter hybrid configurations, and EPRA regulatory filings.',
    mission: 'Design optimum, blackout-proof solar power systems tailored to Kenyan sunlight coordinates and specific electrical loads.',
    primaryOutcome: 'Revenue',
    secondaryOutcomes: ['Operations'],
    strategicClassification: 'Growth',
    status: 'Active',
    capabilities: [
      'County-specific solar peak-sun-hours calculations',
      'Hybrid, Off-Grid & Grid-Tie inverter load simulations',
      'Lithium LiFePO4 battery autonomy sizing',
      'KPLC net-metering & EPRA compliance verification'
    ],
    responsibilities: [
      'Solar sizing',
      'Panel recommendations',
      'Battery calculations',
      'Installation planning',
      'Energy forecasting',
      'Maintenance recommendations',
      'Solar performance analysis'
    ],
    inputs: ['Customer appliance loads', 'Roof area & orientation', 'County coordinates', 'Budget parameters'],
    outputs: ['PV array specification', 'Inverter & battery model numbers', 'Daily kWh generation forecast', 'EPRA filing dossier'],
    kpis: ['Sizing accuracy: 98.7%', 'System uptime post-install: 99.6%', 'Solar quote conversion: 52%'],
    dependencies: ['Quotation Agent', 'Installation Scoping Agent'],
    permissions: ['Read Inventory', 'Create Quotes', 'Validate EPRA/NCA Compliance'],
    eventSubscriptions: ['Solar Scope Requested', 'Survey Completed'],
    knowledgeDomains: ['Kenyan Solar Irradiance Maps', 'Victron/Deye/Growatt Inverter Protocols', 'EPRA PV Class Licensing'],
    impactScores: {
      revenueImpact: 93,
      operationalImpact: 84,
      customerImpact: 87,
      riskImpact: 80,
      intelligenceImpact: 76,
      overallScore: 86
    },
    economics: {
      revenueGeneratedKES: 58000000,
      revenueInfluencedKES: 110000000,
      costSavingsKES: 8400000,
      labourHoursSaved: 2200,
      customerRetentionValueKES: 9500000,
      riskReductionValueKES: 7200000,
      totalOperatingCostKES: 880000,
      netROIPercent: 1340,
      automationRatePercent: 92
    },
    rating: 4.92,
    tasksCompleted: 3820,
    deploymentDate: '2025-11-25',
    lastUpdated: '2026-09-24'
  },

  // 12. Security Agent (Domain Specialist)
  {
    id: 'HYN-AGT-0012',
    name: 'Security Agent',
    category: 'Security',
    version: '2.4',
    owner: 'Physical & Cyber Security Unit',
    description: 'Calculates CCTV focal lengths, perimeter intrusion tripwires, biometric entry access control, and CAK data privacy compliance.',
    mission: 'Architect impenetrable, false-alarm-free perimeter security and surveillance solutions for homes, commercial complexes, and estates.',
    primaryOutcome: 'Revenue',
    secondaryOutcomes: ['Risk & Compliance'],
    strategicClassification: 'Growth',
    status: 'Active',
    capabilities: [
      'AcuSense human & vehicle perimeter detection mapping',
      'Lens focal distance & Field-of-View (FoV) calculations',
      'Biometric access control & smart gate intercom sizing',
      'Video storage HDD capacity calculators (H.265+ codecs)'
    ],
    responsibilities: [
      'Security assessments',
      'CCTV recommendations',
      'Access control planning',
      'Security risk analysis',
      'Incident reporting',
      'Security maintenance'
    ],
    inputs: ['Perimeter fence length', 'Entrance gates count', 'Lighting conditions', 'Storage retention requirements'],
    outputs: ['Camera placement map', 'NVR & storage specifications', 'Night vision illumination plan', 'Access control layout'],
    kpis: ['Perimeter coverage blindspot zeroing: 99.4%', 'False alarm reduction: 88%', 'Security quote conversion: 58%'],
    dependencies: ['Quotation Agent', 'Installation Scoping Agent'],
    permissions: ['Read Inventory', 'Create Quotes', 'Validate EPRA/NCA Compliance'],
    eventSubscriptions: ['Security Scope Requested', 'Alarm Triggered'],
    knowledgeDomains: ['Hikvision/Dahua Ecosystems', 'Optical Lens Physics', 'Kenyan Data Protection Act (ODPC)', 'Electric Fence Standards'],
    impactScores: {
      revenueImpact: 89,
      operationalImpact: 81,
      customerImpact: 90,
      riskImpact: 92,
      intelligenceImpact: 71,
      overallScore: 85
    },
    economics: {
      revenueGeneratedKES: 46500000,
      revenueInfluencedKES: 95000000,
      costSavingsKES: 6800000,
      labourHoursSaved: 1950,
      customerRetentionValueKES: 8800000,
      riskReductionValueKES: 13500000,
      totalOperatingCostKES: 820000,
      netROIPercent: 1250,
      automationRatePercent: 90
    },
    rating: 4.90,
    tasksCompleted: 4620,
    deploymentDate: '2025-11-28',
    lastUpdated: '2026-09-22'
  },

  // 13. Networking Agent (Domain Specialist)
  {
    id: 'HYN-AGT-0013',
    name: 'Networking Agent',
    category: 'Networking',
    version: '2.1',
    owner: 'Telecommunications & ICT Directorate',
    description: 'Designs enterprise Wi-Fi 6 mesh coverage, Starlink satellite satellite mountings, PoE switch layouts, and guest VLAN segregation.',
    mission: 'Deliver uninterrupted, high-bandwidth connectivity and dead-zone-free wireless coverage across complex multi-structure properties.',
    primaryOutcome: 'Operations',
    secondaryOutcomes: ['Revenue'],
    strategicClassification: 'Core',
    status: 'Active',
    capabilities: [
      'Radio frequency (RF) attenuation and Wi-Fi heatmapping',
      'Starlink Gen 3 enterprise bracket & surge grounding design',
      'Gigabit PoE switch wattage budget calculation',
      'VLAN isolation for internal staff vs. public guests'
    ],
    responsibilities: [
      'Network design',
      'Equipment recommendations',
      'Bandwidth calculations',
      'Coverage planning',
      'Network troubleshooting'
    ],
    inputs: ['Property square meters', 'Wall construction material (stone/concrete)', 'Concurrent user count', 'WAN provider (Fiber/Starlink)'],
    outputs: ['Access point heatmaps', 'Switch port BOM', 'Structured Cat6/Fiber backbone run', 'SSID & security plan'],
    kpis: ['Zero dead-zone validation: 98.9%', 'Average network throughput: 850Mbps+', 'Network deployment time: 1.5 days'],
    dependencies: ['Quotation Agent', 'Inventory Agent'],
    permissions: ['Read Inventory', 'Create Quotes', 'Broadcast Event Bus'],
    eventSubscriptions: ['Network Scope Requested', 'Bandwidth Anomaly Detected'],
    knowledgeDomains: ['Ubiquiti UniFi Protocols', 'Starlink Satellite Mechanics', '802.11ax Wi-Fi Standards', 'Fiber Splicing & Testing'],
    impactScores: {
      revenueImpact: 78,
      operationalImpact: 93,
      customerImpact: 92,
      riskImpact: 76,
      intelligenceImpact: 68,
      overallScore: 83
    },
    economics: {
      revenueGeneratedKES: 32000000,
      revenueInfluencedKES: 68000000,
      costSavingsKES: 7500000,
      labourHoursSaved: 2100,
      customerRetentionValueKES: 9100000,
      riskReductionValueKES: 5800000,
      totalOperatingCostKES: 740000,
      netROIPercent: 1190,
      automationRatePercent: 88
    },
    rating: 4.88,
    tasksCompleted: 3190,
    deploymentDate: '2025-12-05',
    lastUpdated: '2026-09-21'
  },

  // 14. Compliance Agent (Risk & Defense)
  {
    id: 'HYN-AGT-0018',
    name: 'Compliance Agent',
    category: 'Compliance',
    version: '2.0',
    owner: 'Legal & Regulatory Affairs',
    description: 'Audits EPRA electrical certifications, NCA contractor quotas, CAK telecom compliance, and KRA eTIMS tax integrity.',
    mission: 'Ensure 100% regulatory immunity and ethical excellence across all installations, contractor licenses, and customer contracts.',
    primaryOutcome: 'Risk & Compliance',
    secondaryOutcomes: ['Operations'],
    strategicClassification: 'Defensive',
    status: 'Active',
    capabilities: [
      'Automated EPRA technician license expiry tracking',
      'NCA contractor project registration validation',
      'Data protection consent tracking (ODPC compliance)',
      'Quarterly safety compliance audit compilation'
    ],
    responsibilities: [
      'Regulatory monitoring',
      'License audits',
      'Contract review',
      'Quality assurance validation',
      'Incident compliance reporting'
    ],
    inputs: ['Technician government license numbers', 'Project specifications', 'Customer sign-off forms', 'Tax documentation'],
    outputs: ['Compliance scorecards', 'Risk mitigation notices', 'Regulator audit dossiers', 'License renewal reminders'],
    kpis: ['Regulatory compliance rate: 100%', 'Audit pass rate: 100%', 'Legal fines prevented: KES 48M+'],
    dependencies: ['Technician Matching Agent', 'Finance Agent'],
    permissions: ['Validate EPRA/NCA Compliance', 'View Financial Data', 'Trigger Autonomous Alerts'],
    eventSubscriptions: ['Technician Registered', 'Contract Executed', 'Compliance Audit Due'],
    knowledgeDomains: ['Energy Act 2019', 'National Construction Authority Act', 'Kenyan Data Protection Act 2019', 'eTIMS Guidelines'],
    impactScores: {
      revenueImpact: 35,
      operationalImpact: 82,
      customerImpact: 78,
      riskImpact: 99,
      intelligenceImpact: 84,
      overallScore: 80
    },
    economics: {
      revenueGeneratedKES: 0,
      revenueInfluencedKES: 140000000,
      costSavingsKES: 18500000,
      labourHoursSaved: 1900,
      customerRetentionValueKES: 8400000,
      riskReductionValueKES: 48000000,
      totalOperatingCostKES: 790000,
      netROIPercent: 1450,
      automationRatePercent: 94
    },
    rating: 4.95,
    tasksCompleted: 4120,
    deploymentDate: '2025-11-18',
    lastUpdated: '2026-09-25'
  }
];

export const INITIAL_WORKFLOW_PIPELINES: AgentWorkflowPipeline[] = [
  {
    id: 'WKF-HYN-001',
    name: 'Turnkey Customer Solution Orchestration',
    description: 'Master operational workflow from initial enquiry to final customer sign-off, escrow release, and recurring SLA enrollment.',
    triggerEvent: 'Customer Sizing Inquiry Submitted',
    category: 'End-to-End Delivery',
    status: 'Active',
    averageExecutionSeconds: 4.2,
    successOutcome: 'Verified Installation with Workmanship Warranty & Active Escrow Release',
    steps: [
      {
        stepNumber: 1,
        agentId: 'HYN-AGT-0001',
        agentName: 'Sales Agent',
        action: 'Qualify & Ingest Lead',
        description: 'Assesses budget (min KES 5,000), location county, and prioritizes core goals with Affordability Promise.',
        inputsRequired: ['Customer contact', 'Target budget', 'Selected scope'],
        expectedOutput: 'Qualified Project Lead with Opportunity Score'
      },
      {
        stepNumber: 2,
        agentId: 'HYN-AGT-0003',
        agentName: 'Installation Scoping Agent',
        action: 'Determine Complexity & Survey Requirement',
        description: 'Analyzes property layout, cable run estimates, and mandates on-site survey if project > Level 2 complexity.',
        inputsRequired: ['Qualified Lead', 'Property Type', 'County Coordinates'],
        expectedOutput: 'Detailed Installation Scope & Labor Estimate'
      },
      {
        stepNumber: 3,
        agentId: 'HYN-AGT-0004',
        agentName: 'Inventory Agent',
        action: 'Verify Genuine Bonded Hardware',
        description: 'Checks stock availability in nearest regional warehouse and locks wholesale BOM pricing.',
        inputsRequired: ['Installation Scope', 'Product specifications'],
        expectedOutput: 'Hardware Availability & Warehouse Allocation Plan'
      },
      {
        stepNumber: 4,
        agentId: 'HYN-AGT-0002',
        agentName: 'Quotation Agent',
        action: 'Generate Binding Quote & KRA VAT (16%)',
        description: 'Calculates itemized BOM, labor, transit, platform margin, and applies 16% Kenyan VAT.',
        inputsRequired: ['Scope', 'Inventory BOM', 'Margin threshold'],
        expectedOutput: 'Professional PDF Quotation (HYN-2026-XXX)'
      },
      {
        stepNumber: 5,
        agentId: 'HYN-AGT-0009',
        agentName: 'Finance Agent',
        action: 'Lock Milestone Funds in M-Pesa Escrow',
        description: 'Secures customer deposit into protected escrow ledger; funds never released until sign-off.',
        inputsRequired: ['Customer Approval', 'M-Pesa STK Push Confirmation'],
        expectedOutput: 'Funded Escrow Receipt (HYN-PAY-XXXX)',
        requiresHumanApproval: false
      },
      {
        stepNumber: 6,
        agentId: 'HYN-AGT-0006',
        agentName: 'Technician Matching Agent',
        action: 'Match Verified HYTECH Crew',
        description: 'Scores local certified installers on proximity, EPRA license, and historical rating ⭐ 4.8+.',
        inputsRequired: ['Job Scope', 'County Location', 'Complexity Level'],
        expectedOutput: 'Assigned Certified Technician Dossier'
      },
      {
        stepNumber: 7,
        agentId: 'HYN-AGT-0005',
        agentName: 'Dispatch Agent',
        action: 'Issue Authorized Digital Dispatch',
        description: 'Generates work order, travel route, safety instructions, and shares live tracking with customer.',
        inputsRequired: ['Assigned Technician', 'Escrow Confirmation'],
        expectedOutput: 'Digital Dispatch Slip (HYN-DIS-XXXX)'
      },
      {
        stepNumber: 8,
        agentId: 'HYN-AGT-0009',
        agentName: 'Finance Agent',
        action: 'Execute Escrow Payout upon Customer Sign-Off',
        description: 'Releases installer earnings and records immutable audit ledger entry after customer signs off work.',
        inputsRequired: ['Proof of Work Photos', 'Customer Digital Signature'],
        expectedOutput: 'Disbursed Technician Payout & Official Receipt',
        requiresHumanApproval: true,
        escalationRole: 'Operations Manager'
      },
      {
        stepNumber: 9,
        agentId: 'HYN-AGT-0007',
        agentName: 'Maintenance Agent',
        action: 'Activate 1-Year Workmanship Warranty & SLA',
        description: 'Enrolls customer into automated warranty registry and schedules bi-annual preventive health audits.',
        inputsRequired: ['Completed Job ID', 'Serial Numbers'],
        expectedOutput: 'Active Warranty Certificate (HYN-WAR-XXXX)'
      },
      {
        stepNumber: 10,
        agentId: 'HYN-AGT-0010',
        agentName: 'Executive Intelligence Agent',
        action: 'Update Regional Performance & Board Telemetry',
        description: 'Incorporates gross margin, installer rating, and county growth trends into executive radar.',
        inputsRequired: ['All Workflow Logs'],
        expectedOutput: 'Updated Corporate Analytics & Risk Metrics'
      }
    ]
  },
  {
    id: 'WKF-HYN-002',
    name: 'Emergency Power Blackout Rapid Deployment',
    description: 'Fast-track priority dispatch for hospitals, commercial businesses, and homes experiencing critical KPLC grid failure.',
    triggerEvent: 'Emergency Grid Power Failure Signal',
    category: 'Rapid Emergency Response',
    status: 'Active',
    averageExecutionSeconds: 2.1,
    successOutcome: 'Same-Day Mini-UPS or Hybrid Inverter Critical Load Restoration',
    steps: [
      {
        stepNumber: 1,
        agentId: 'HYN-AGT-0011',
        agentName: 'Solar Agent',
        action: 'Size Critical Circuit Load Instantly',
        description: 'Separates essential loads (routers, surgery, refrigerators, lighting) from high-draw appliances.',
        inputsRequired: ['Critical appliance wattages', 'Outage duration estimate'],
        expectedOutput: 'Rapid Micro-Backup Specification'
      },
      {
        stepNumber: 2,
        agentId: 'HYN-AGT-0004',
        agentName: 'Inventory Agent',
        action: 'Hold Local Fast-Deploy Inverter Kit',
        description: 'Reserves pre-configured 1.5kVA - 5kVA backup kit in local county fulfillment center.',
        inputsRequired: ['Target County'],
        expectedOutput: 'Reserved Emergency Hardware Kit'
      },
      {
        stepNumber: 3,
        agentId: 'HYN-AGT-0006',
        agentName: 'Technician Matching Agent',
        action: 'Assign On-Call Emergency Specialist',
        description: 'Pings top-ranked installer on active emergency standby within 20km radius.',
        inputsRequired: ['Technician Standby Status', 'GPS location'],
        expectedOutput: 'Confirmed Emergency Technician'
      },
      {
        stepNumber: 4,
        agentId: 'HYN-AGT-0005',
        agentName: 'Dispatch Agent',
        action: 'Trigger Immediate Rapid Dispatch',
        description: 'Provides navigation route and alerts client with estimated arrival in under 45 minutes.',
        inputsRequired: ['Technician Confirmation'],
        expectedOutput: 'Emergency Dispatch Active'
      }
    ]
  },
  {
    id: 'WKF-HYN-003',
    name: 'Automated Preventive Maintenance & SLA Renewal',
    description: 'Proactive lifecycle management detecting battery degradation and renewing annual maintenance contracts.',
    triggerEvent: 'Contract Expiration T-30 Days or Battery Alert',
    category: 'Recurring Revenue & SLA',
    status: 'Active',
    averageExecutionSeconds: 1.8,
    successOutcome: 'SLA Renewed, Inverter Firmware Patched, Battery Tested',
    steps: [
      {
        stepNumber: 1,
        agentId: 'HYN-AGT-0007',
        agentName: 'Maintenance Agent',
        action: 'Evaluate Equipment Health Telemetry',
        description: 'Checks cycle count on lithium batteries and camera optic degradation signals.',
        inputsRequired: ['Hardware Serial Numbers', 'Installation Date'],
        expectedOutput: 'Equipment Condition Scorecard'
      },
      {
        stepNumber: 2,
        agentId: 'HYN-AGT-0002',
        agentName: 'Quotation Agent',
        action: 'Generate Renewal SLA Quote',
        description: 'Applies loyalty pricing and itemizes quarterly inspection visit dates for the coming 12 months.',
        inputsRequired: ['Previous Contract ID', 'Asset Count'],
        expectedOutput: 'Annual SLA Renewal Packet'
      },
      {
        stepNumber: 3,
        agentId: 'HYN-AGT-0008',
        agentName: 'Support Agent',
        action: 'Dispatches WhatsApp Review & One-Click Renewal',
        description: 'Sends convenient renewal link to property manager with M-Pesa prompt.',
        inputsRequired: ['Customer WhatsApp', 'Quotation'],
        expectedOutput: 'Customer Renewal Notification'
      }
    ]
  }
];

export const INITIAL_EVENT_BUS_LOGS: AgentEventMessage[] = [
  {
    id: 'EVT-HYN-9401',
    timestamp: '2 mins ago',
    eventName: 'Quote Created',
    sourceAgentId: 'HYN-AGT-0002',
    sourceAgentName: 'Quotation Agent',
    targetAgentIds: ['HYN-AGT-0001', 'HYN-AGT-0009'],
    payloadSummary: 'Generated Quote HYN-2026-482 for 5kW Solar & AI CCTV in Nakuru (KES 385,000 with 16% VAT itemized).',
    status: 'PROCESSED',
    businessOutcome: 'Revenue'
  },
  {
    id: 'EVT-HYN-9400',
    timestamp: '8 mins ago',
    eventName: 'Payment Received',
    sourceAgentId: 'HYN-AGT-0009',
    sourceAgentName: 'Finance Agent',
    targetAgentIds: ['HYN-AGT-0005', 'HYN-AGT-0006'],
    payloadSummary: 'M-Pesa Escrow deposit confirmed for HYN-ORD-0419 (KES 95,000 held in trust for Wi-Fi Mesh install).',
    status: 'DELIVERED',
    businessOutcome: 'Revenue'
  },
  {
    id: 'EVT-HYN-9399',
    timestamp: '14 mins ago',
    eventName: 'Technician Assigned',
    sourceAgentId: 'HYN-AGT-0006',
    sourceAgentName: 'Technician Matching Agent',
    targetAgentIds: ['HYN-AGT-0005', 'HYN-AGT-0014'],
    payloadSummary: 'Matched Lead Engineer Evans Kiprono (Level 3 EPRA, ⭐ 4.98) to Smart Gate & Intercom Job in Karen.',
    status: 'PROCESSED',
    businessOutcome: 'Operations'
  },
  {
    id: 'EVT-HYN-9398',
    timestamp: '22 mins ago',
    eventName: 'Job Completed',
    sourceAgentId: 'HYN-AGT-0005',
    sourceAgentName: 'Dispatch Agent',
    targetAgentIds: ['HYN-AGT-0009', 'HYN-AGT-0007'],
    payloadSummary: 'Client customer signed off HYN-JOB-0891 in Kilimani with 5-star rating. Escrow release triggered.',
    status: 'PROCESSED',
    businessOutcome: 'Customer Experience'
  },
  {
    id: 'EVT-HYN-9397',
    timestamp: '35 mins ago',
    eventName: 'Maintenance Due',
    sourceAgentId: 'HYN-AGT-0007',
    sourceAgentName: 'Maintenance Agent',
    targetAgentIds: ['HYN-AGT-0008', 'HYN-AGT-0002'],
    payloadSummary: 'Quarterly servicing due for Nairobi Green Hospital 10kW Microgrid (Contract HYN-MNT-0042).',
    status: 'DELIVERED',
    businessOutcome: 'Operations'
  },
  {
    id: 'EVT-HYN-9396',
    timestamp: '52 mins ago',
    eventName: 'Compliance Audit Passed',
    sourceAgentId: 'HYN-AGT-0018',
    sourceAgentName: 'Compliance Agent',
    targetAgentIds: ['HYN-AGT-0010'],
    payloadSummary: 'EPRA solar certification audit verified 100% active licenses across all 240 dispatched technicians.',
    status: 'PROCESSED',
    businessOutcome: 'Risk & Compliance'
  }
];

export const INITIAL_EXECUTIVE_ALERTS: ExecutiveAlert[] = [
  {
    id: 'ALT-HYN-101',
    timestamp: '12 mins ago',
    severity: 'OPPORTUNITY',
    category: 'Revenue',
    title: 'High Agri-Solar Demand Surge in Rift Valley',
    description: 'Solar Agent reports 42% surge in Nakuru & Eldoret solar water pump sizing inquiries. Estimated pipeline KES 28.5M.',
    agentId: 'HYN-AGT-0011',
    agentName: 'Solar Agent',
    recommendedAction: 'Allocate 25 additional 3kW solar pump inverters to Nakuru bonded warehouse.',
    isRead: false
  },
  {
    id: 'ALT-HYN-102',
    timestamp: '38 mins ago',
    severity: 'WARNING',
    category: 'Operations',
    title: 'Technician Capacity Reaching 88% in Mombasa County',
    description: 'Technician Matching Agent reports Level-2 CCTV installers in Coast region at peak load due to holiday season installations.',
    agentId: 'HYN-AGT-0006',
    agentName: 'Technician Matching Agent',
    recommendedAction: 'Trigger automated onboarding for 10 vetted Mombasa applicants awaiting practical assessment.',
    isRead: false
  },
  {
    id: 'ALT-HYN-103',
    timestamp: '1 hour ago',
    severity: 'INFO',
    category: 'Intelligence',
    title: 'Quarterly Gross Margin Maintained at 28.4%',
    description: 'Finance Agent confirms all 184 projects executed this month strictly adhered to the 20%-35% margin floor rule.',
    agentId: 'HYN-AGT-0009',
    agentName: 'Finance Agent',
    recommendedAction: 'No intervention required. Pricing integrity rules operating optimally.',
    isRead: true
  }
];

export const OUTCOME_CATEGORY_METADATA: Record<AgentOutcomeCategory, {
  label: string;
  tagline: string;
  color: string;
  bgLight: string;
  borderColor: string;
  description: string;
  kpis: string[];
}> = {
  'Revenue': {
    label: 'Revenue Agents',
    tagline: 'Generate, protect, and accelerate top-line revenue',
    color: '#C01E25',
    bgLight: 'bg-[#F0C9CB]/35',
    borderColor: 'border-[#C01E25]',
    description: 'Directly influence lead generation, quote conversions, recurring SLA renewals, and gross margins.',
    kpis: ['Revenue Generated', 'Revenue Influenced', 'Quote Conversion Rate', 'Customer Lifetime Value', 'ARR Growth']
  },
  'Operations': {
    label: 'Operations Agents',
    tagline: 'Maximize execution speed, labor efficiency, and scalability',
    color: '#1E1B1C',
    bgLight: 'bg-[#EEECEC]',
    borderColor: 'border-[#DB7D81]/40',
    description: 'Eliminate manual friction in scoping, warehouse allocation, routing, dispatch, and installer matching.',
    kpis: ['Labor Hours Saved', 'Cost Reduction', 'Automation Rate', 'On-Time Arrival', 'Job Completion Velocity']
  },
  'Customer Experience': {
    label: 'Customer Experience Agents',
    tagline: 'Strengthen customer trust, satisfaction, and lifelong retention',
    color: '#128C7E',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-300',
    description: 'Deliver instant support, transparent communications, proactive warranty fulfillment, and high CSAT.',
    kpis: ['Customer Satisfaction (CSAT)', 'Net Promoter Score (NPS)', 'First-Contact Resolution', 'Retention Rate']
  },
  'Risk & Compliance': {
    label: 'Risk & Compliance Agents',
    tagline: 'Shield the company from regulatory, financial, and safety liabilities',
    color: '#B45309',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-300',
    description: 'Enforce EPRA, NCA, and CAK regulations, audit escrow safety, and prevent fraudulent claims.',
    kpis: ['Risk Incidents Prevented', 'Regulatory Compliance Rate', 'Audit Pass Rate', 'Zero Escrow Leakage']
  },
  'Intelligence': {
    label: 'Intelligence Agents',
    tagline: 'Deliver strategic foresight and automated executive decision support',
    color: '#4338CA',
    bgLight: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    description: 'Aggregate platform-wide telemetry into predictive forecasts, regional demand heatmaps, and board dossiers.',
    kpis: ['Forecast Accuracy', 'Insight Utilization', 'Early Risk Lead Time', 'Strategic ROI Contribution']
  }
};
