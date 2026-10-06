export type AppView = 
  | 'home' 
  | 'solutions' 
  | 'how-it-works'
  | 'about' 
  | 'contact'
  | 'ai-recommendation' 
  | 'customer-portal' 
  | 'technician-portal' 
  | 'supplier-portal' 
  | 'partner-portal' 
  | 'staff-portal'
  | 'admin-portal'
  | 'privacy'
  | 'terms'
  | 'security-architecture'
  | 'roadmap'
  | 'agent-os';

export type UserRole = 
  | 'customer' 
  | 'technician' 
  | 'supplier' 
  | 'partner' 
  | 'staff' 
  | 'admin' 
  | 'superadmin' 
  | 'ai-service';

export interface RBACPermission {
  can: string[];
  cannot: string[];
  description: string;
  dataIsolationBoundary: string;
}

export interface AIScopePermission {
  role: UserRole;
  scopeTitle: string;
  allowedDatasets: string[];
  prohibitedDatasets: string[];
  executionSandbox: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: UserRole;
  ipAddress: string;
  actionCategory: 
    | 'Authentication' 
    | 'Permission Change' 
    | 'Project Assignment' 
    | 'Escrow Payment' 
    | 'AI Recommendation' 
    | 'Profile Update' 
    | 'Security Event' 
    | 'Admin Action';
  actionDetails: string;
  targetResource: string;
  status: 'SUCCESS' | 'WARNING' | 'DENIED' | 'FLAGGED';
  immutableHash: string;
}

export interface SecuritySession {
  userId: string;
  email: string;
  role: UserRole;
  tenantId: string;
  tokenHash: string;
  ipAddress: string;
  mfaVerified: boolean;
  loginTime: string;
  expiresInSeconds: number;
  encryptionStandard: string;
  kdpaCompliant: boolean;
}

export interface SecurityThreatAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  sourceIp: string;
  description: string;
  mitigation: string;
  timestamp: string;
  resolved: boolean;
}

export interface RoadmapPillar {
  phase: 'Phase 1: Real-World Launch' | 'Phase 2: Scale & Ecosystem' | 'Phase 3: National & Continental Expansion';
  timeline: string;
  focus: string[];
  sectors: string[];
  infrastructureMilestones: string[];
  status: 'Active Deployment' | 'In Development' | 'Future Strategic Vision';
}

export type TechnicianRank = 'Certified Technician' | 'Senior Technician' | 'Specialist Technician' | 'Master Technician';

export interface CountyInfo {
  code: number;
  name: string;
  region: string;
  activeTechs: number;
  activeSuppliers: number;
}

export interface SolutionCategory {
  id: string;
  title: string;
  subtitle: string;
  tagline: string;
  iconName: string;
  overview: string;
  benefits: string[];
  idealCustomers: string[];
  typicalBudgetRange: string;
  popularEquipments: string[];
  certificationsNeeded: string[];
}

export interface AIRecommendationRequest {
  budget: string;
  location: string;
  propertyType: string;
  needs: string[];
  goals: string;
  customerType: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface HardwareBOMItem {
  item: string;
  specs: string;
  quantity: string;
  supplierCategory: string;
}

export type BudgetCategoryTierName = 'Starter' | 'Essential' | 'Standard' | 'Professional' | 'Enterprise' | 'Entry' | 'Custom';

export interface BudgetTierPackage {
  tier: BudgetCategoryTierName;
  title: string;
  rangeKES: string;
  minPriceKES: number;
  maxPriceKES: number;
  hardwareSummary: string[];
  laborSummary: string;
  warrantyPeriod: string;
  suitableFor: string;
  requiresAdminApproval?: boolean;
}

export interface AIRecommendationResult {
  packageName: string;
  executiveSummary: string;
  pricingDisclaimer?: string;
  estimatedProjectRangeKES?: string;
  budgetTiers?: BudgetTierPackage[];
  recommendedTier?: string;
  affordabilityPromise?: string;
  phasedRoadmap?: {
    achievedToday: string[];
    phasedApproach: string[];
    futureUpgrades: string[];
    costEffectiveSummary: string;
  };
  marginIntegrity?: {
    minGrossMargin: number;
    targetGrossMargin: number;
    estimatedGrossMargin: number;
    status: 'OPTIMAL' | 'ACCEPTABLE' | 'NEEDS_ADMIN_APPROVAL';
  };
  estimatedCosts: {
    hardwareKES: number;
    installationKES: number;
    permitsAndCommissioningKES: number;
    totalKES: number;
    monthlyFinancingEstimateKES: number;
    hardwareRangeKES?: string;
    laborRangeKES?: string;
  };
  timeline: string;
  hardwareBillOfMaterials: HardwareBOMItem[];
  requiredTechnician: {
    specialty: string;
    minimumRank: TechnicianRank;
    certificationsRequired: string[];
    assignedCount: number;
  };
  maintenanceOptions: {
    tier: string;
    costPerYearKES: number;
    features: string[];
  }[];
  financingOptions: {
    name: string;
    details: string;
  }[];
  kenyanComplianceNotes: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  avatar: string;
  county: string;
  subCounty: string;
  rank: TechnicianRank;
  rating: number;
  reviewCount: number;
  completedJobs: number;
  verifiedBadges: string[];
  specialties: string[];
  certifications: string[];
  hourlyRateKES: number;
  earningsThisMonthKES: number;
  totalEarningsKES: number;
  acceptanceRate: string;
  onTimeRate: string;
}

export interface AcademyCourse {
  id: string;
  title: string;
  category: string;
  durationHours: number;
  modulesCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  instructor: string;
  description: string;
  skillsGained: string[];
  enrolled: number;
  completed: boolean;
  score?: number;
}

export interface JobListing {
  id: string;
  title: string;
  clientName: string;
  category: string;
  county: string;
  subCounty?: string;
  locationDetails: string;
  budgetKES: number;
  escrowStatus: 'Funded in Escrow' | 'Released' | 'Pending Deposit';
  requiredRank: TechnicianRank;
  durationDays: number;
  description: string;
  scopeItems: string[];
  status: 'Open' | 'In Progress' | 'Under Inspection' | 'Completed';
  datePosted: string;
  materialsProvided: boolean;
  locationRecord?: HynovaLocationRecord;
  coordinates?: { lat: number; lng: number };
  isDifferentInstallationLocation?: boolean;
  recipientContact?: LocationRecipientContact;
  googleMapsUrl?: string;
  distanceKmFromTech?: number;
  estimatedTravelTimeMinutes?: number;
}

export interface SupplierProduct {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand?: string;
  supplierName?: string;
  priceKES?: number;
  retailPriceKES?: number;
  wholesalePriceKES: number;
  stockLevel?: number;
  stockCount?: number;
  minOrderQuantity?: number;
  warehouseLocation?: string;
  warrantyYears: number;
  certification?: string;
  kebsApproved?: boolean;
  inStock?: boolean;
  deliveryCounties?: string[];
  rating?: number;
}

export interface CustomerProject {
  id: string;
  title: string;
  category: string;
  status: 'Design Phase' | 'Dispatched' | 'Installation in Progress' | 'Quality Audit' | 'Operational';
  completionPercentage: number;
  budgetKES: number;
  subtotalKES?: number;
  vatKES?: number;
  totalPayableKES?: number;
  technicianAssigned?: {
    name: string;
    phone: string;
    rank: TechnicianRank;
    rating: number;
  };
  scheduledDate: string;
  address: string;
  county: string;
  siteSurveyStatus?: 'REQUIRED' | 'PAID' | 'COMPLETED' | 'WAIVED';
  locationRecord?: HynovaLocationRecord;
}

export interface SiteSurveyRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  county: string;
  addressOrTown: string;
  propertyType: string;
  systemInterest: string;
  zone: 'Zone A (0–15 KM)' | 'Zone B (15–40 KM)' | 'Zone C (40–100 KM)' | 'Zone D (100+ KM)';
  distanceKm: number;
  surveyFeeKES: number;
  vatAmountKES: number;
  totalFeeKES: number;
  paymentStatus: 'UNPAID' | 'PAID';
  paymentMethod?: 'Safaricom M-Pesa Express' | 'Paybill 400200' | 'Card';
  mpesaReceiptNumber?: string;
  assignedTechnician?: {
    id: string;
    name: string;
    phone: string;
    rank: TechnicianRank;
    distanceKm: number;
    rating: number;
  };
  surveyStatus: 'REQUESTED' | 'SCHEDULED' | 'IN_PROGRESS' | 'SURVEY_COMPLETED' | 'FINAL_QUOTE_ISSUED';
  preferredDate: string;
  preferredTimeSlot: string;
  notes?: string;
  createdAt: string;
  locationRecord?: HynovaLocationRecord;
}

export interface HynovaReceipt {
  receiptNumber: string;
  invoiceNumber?: string;
  customerName: string;
  customerPhone: string;
  projectReference: string;
  itemDescription: string;
  subtotalKES: number;
  vatAmountKES: number;
  amountPaidKES: number;
  date: string;
  paymentMethod: 'Safaricom M-Pesa' | 'Bank Paybill' | 'Card';
  transactionCode: string;
  status: 'PAID' | 'ESCROW_HELD' | 'DISBURSED';
  paymentType: 'SITE_SURVEY_FEE' | 'MILESTONE_DEPOSIT' | 'FINAL_COMMISSIONING';
  downloadUrl?: string;
}

export interface HynovaInvoice {
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  projectReference: string;
  county: string;
  locationRecord?: HynovaLocationRecord;
  locationRecordId?: string;
  lineItems: {
    description: string;
    category: string;
    quantity: number;
    unitPriceKES: number;
    totalKES: number;
  }[];
  equipmentCostKES: number;
  technicianLaborKES: number;
  travelAndLogisticsKES: number;
  workmanshipWarrantyKES: number;
  platformMarginKES: number;
  subtotalKES: number;
  vatRatePercent: number; // 16%
  vatAmountKES: number;
  totalPayableKES: number;
  escrowStatus: 'Awaiting Escrow Deposit' | 'Funded in M-Pesa Escrow' | 'Milestone 1 Released' | 'Completed';
  dateIssued: string;
  dueDate: string;
}

export interface PartnerRFP {
  id: string;
  organization: string;
  title: string;
  siteCount: number;
  counties: string[];
  estimatedBudgetKES: number;
  status: 'Draft' | 'AI Assessing' | 'Tender Dispatched' | 'Contract Active';
  dateSubmitted: string;
}

// ==========================================
// HYNOVA AI AGENT OPERATING SYSTEM & REVENUE AGENT LAYER
// ==========================================

export type AgentOutcomeCategory = 
  | 'Revenue' 
  | 'Operations' 
  | 'Customer Experience' 
  | 'Risk & Compliance' 
  | 'Intelligence';

export type AgentStrategicClassification = 
  | 'Core' 
  | 'Growth' 
  | 'Optimization' 
  | 'Defensive' 
  | 'Innovation';

export type AgentOperationalStatus = 
  | 'Active' 
  | 'Paused' 
  | 'Testing' 
  | 'Retired' 
  | 'Draft';

export type AgentPermissionType = 
  | 'Read Customer Data'
  | 'Read Inventory'
  | 'Create Quotes'
  | 'Approve Quotes'
  | 'Create Jobs'
  | 'View Financial Data'
  | 'Manage Maintenance'
  | 'View Executive Reports'
  | 'Dispatch Technicians'
  | 'Approve Payments'
  | 'Validate EPRA/NCA Compliance'
  | 'Manage M-Pesa Escrow'
  | 'Trigger Autonomous Alerts'
  | 'Broadcast Event Bus';

export interface AgentImpactScorecard {
  revenueImpact: number;      // 0 - 100
  operationalImpact: number;  // 0 - 100
  customerImpact: number;     // 0 - 100
  riskImpact: number;         // 0 - 100
  intelligenceImpact: number; // 0 - 100
  overallScore: number;       // Weighted composite
}

export interface AgentEconomics {
  revenueGeneratedKES: number;
  revenueInfluencedKES: number;
  costSavingsKES: number;
  labourHoursSaved: number;
  customerRetentionValueKES: number;
  riskReductionValueKES: number;
  totalOperatingCostKES: number;
  netROIPercent: number;
  automationRatePercent: number;
}

export interface HynovaAIAgent {
  id: string; // e.g. HYN-AGT-0001
  name: string;
  category: string; // e.g. Sales, Energy, Security, Operations, Finance
  version: string;
  owner: string;
  description: string;
  mission: string;
  primaryOutcome: AgentOutcomeCategory;
  secondaryOutcomes: AgentOutcomeCategory[];
  strategicClassification: AgentStrategicClassification;
  status: AgentOperationalStatus;
  capabilities: string[];
  responsibilities: string[];
  inputs: string[];
  outputs: string[];
  kpis: string[];
  dependencies: string[]; // Agent IDs or names this agent coordinates with
  permissions: AgentPermissionType[];
  eventSubscriptions: string[]; // Events it listens to on the Communication Bus
  knowledgeDomains: string[];
  impactScores: AgentImpactScorecard;
  economics: AgentEconomics;
  rating: number; // e.g. 4.9
  tasksCompleted: number;
  deploymentDate: string;
  lastUpdated: string;
  isCustomMarketplace?: boolean;
}

export interface AgentEventMessage {
  id: string; // EVT-HYN-XXXX
  timestamp: string;
  eventName: string; // e.g. 'Quote Created', 'Payment Received'
  sourceAgentId: string;
  sourceAgentName: string;
  targetAgentIds: string[];
  payloadSummary: string;
  status: 'DELIVERED' | 'PROCESSED' | 'QUEUED' | 'ESCALATED';
  businessOutcome: AgentOutcomeCategory;
}

export interface AgentWorkflowStep {
  stepNumber: number;
  agentId: string;
  agentName: string;
  action: string;
  description: string;
  inputsRequired: string[];
  expectedOutput: string;
  condition?: string;
  requiresHumanApproval?: boolean;
  escalationRole?: string;
}

export interface AgentWorkflowPipeline {
  id: string; // WKF-HYN-001
  name: string;
  description: string;
  triggerEvent: string;
  category: string;
  status: 'Active' | 'Paused' | 'Draft';
  steps: AgentWorkflowStep[];
  successOutcome: string;
  averageExecutionSeconds: number;
}

export interface ExecutiveAlert {
  id: string;
  timestamp: string;
  severity: 'CRITICAL' | 'WARNING' | 'OPPORTUNITY' | 'INFO';
  category: AgentOutcomeCategory;
  title: string;
  description: string;
  agentId: string;
  agentName: string;
  recommendedAction: string;
  isRead: boolean;
}

// ==========================================
// HYNOVA GOOGLE MAPS LOCATION RECORD & OPERATIONAL TELEMETRY
// ==========================================

export type LocationPermissionStatus = 'GRANTED' | 'DENIED' | 'MANUAL';
export type LocationSource = 'GPS_CURRENT_LOCATION' | 'MANUAL_MAP_PIN' | 'SEARCH_AUTOCOMPLETE' | 'COUNTY_DEFAULT';

export interface LocationRecipientContact {
  recipientName: string;
  recipientPhone: string;
  recipientRelationship?: string;
  siteAccessInstructions?: string;
}

export interface HynovaLocationRecord {
  id: string; // e.g. LOC-HYN-XXXXX
  customerId?: string;
  quoteId?: string;
  orderId?: string;
  siteSurveyId?: string;
  jobId?: string;
  dispatchId?: string;
  maintenancePlanId?: string;
  warrantyRecordId?: string;

  // Geographic coordinates
  lat: number;
  lng: number;
  googlePlaceId?: string;
  fullAddress: string;
  county: string;
  subCounty?: string;
  townOrArea?: string;
  postalAddress?: string;
  timestamp: string;

  // Privacy & Permission Tracking
  permissionStatus: LocationPermissionStatus;
  source: LocationSource;

  // Location Confidence Score
  confidenceScore: number; // 100 for GPS, 95 for address match, 85 for landmark, 40 for county only
  confidenceLabel: string;
  surveyRecommendation: 'WAIVED_ELIGIBLE' | 'OPTIONAL' | 'RECOMMENDED' | 'MANDATORY';
  surveyReason: string;

  // Installation Recipient Handling
  isDifferentInstallationLocation: boolean;
  recipientContact?: LocationRecipientContact;

  // Distance & Travel Operations
  distanceFromZoneKm: number;
  nearestZoneName: string;
  distanceFromTechnicianKm: number;
  nearestTechnicianId: string;
  nearestTechnicianName: string;
  nearestTechnicianRank: TechnicianRank;
  estimatedTravelKm: number;
  estimatedTravelTimeMinutes: number;
  serviceZoneTier: 'Zone A (0–15 KM)' | 'Zone B (15–40 KM)' | 'Zone C (40–100 KM)' | 'Zone D (100+ KM)';
  travelChargesKES: number;
  siteSurveyFeeKES: number;
  logisticsMultiplier: number;
  maintenanceVisitCostKES: number;

  // Customer Verification
  confirmedByCustomer: boolean;
  confirmedAt?: string;
}


