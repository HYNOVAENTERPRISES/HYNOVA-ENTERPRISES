/**
 * HYNOVA Centralized Pricing & Quotation Engine
 * 
 * CORE PRICING PRINCIPLE:
 * HYNOVA shall never display fictional, misleading, or hardcoded final prices.
 * All pricing is market-based, representing combinations of:
 * - Equipment & Supplier Costs (with delivery, replacement risk, inventory lead times)
 * - Certified Technician Labor & Travel (distance, per-diem, accommodation, tools, safety)
 * - Site conditions & Installation complexity
 * - 1-Year Workmanship Warranty reserve & Quality Assurance
 * - Sustainable business margins (Margin Protection Rules: 20% - 45%)
 * 
 * Commercial Principle:
 * "HYNOVA should aim to be the most trusted affordable option, not the cheapest option.
 * The cheapest provider wins a sale. The most trusted provider builds a platform."
 * 
 * Reference Rates: 2026 Kenyan Market Standards (Giga Team Solutions)
 */

export interface MarketPriceRange {
  category: string;
  title: string;
  startingFromKES?: number;
  typicalMinKES: number;
  typicalMaxKES: number;
  isCustomQuoteOnly?: boolean;
  displayRange: string;
  suitableFor: string[];
  includes: string[];
  disclaimer: string;
}

export type BudgetTierType = 'Starter' | 'Essential' | 'Standard' | 'Professional' | 'Enterprise' | 'Entry' | 'Custom';

export interface BudgetCategoryTier {
  tier: BudgetTierType;
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

/**
 * AI BUDGET SIZING FRAMEWORK (Official HYNOVA Policy)
 * HYNOVA believes technology should be accessible regardless of budget.
 * Minimum supported customer budget: KES 5,000
 */
export interface ApprovedBudgetCategory {
  id: 'starter' | 'essential' | 'standard' | 'professional' | 'enterprise';
  tierName: 'Starter' | 'Essential' | 'Standard' | 'Professional' | 'Enterprise';
  rangeLabel: string;
  minBudgetKES: number;
  maxBudgetKES: number;
  idealFor: string;
  guidelineResponse: string;
}

export const HYNOVA_BUDGET_CATEGORIES: ApprovedBudgetCategory[] = [
  {
    id: 'starter',
    tierName: 'Starter',
    rangeLabel: 'KES 5,000 – 20,000',
    minBudgetKES: 5000,
    maxBudgetKES: 20000,
    idealFor: 'Small improvements, diagnostics, consultations, smart devices, basic networking, entry level security and phased projects.',
    guidelineResponse: "Let's start with what you have and build from there. (Tuanze na kile uli nacho.)",
  },
  {
    id: 'essential',
    tierName: 'Essential',
    rangeLabel: 'KES 20,001 – 50,000',
    minBudgetKES: 20001,
    maxBudgetKES: 50000,
    idealFor: 'Basic home and small business solutions.',
    guidelineResponse: 'We can recommend an entry level security, networking, smart home, or automation solution that fits your current budget while leaving room for future upgrades.',
  },
  {
    id: 'standard',
    tierName: 'Standard',
    rangeLabel: 'KES 50,001 – 150,000',
    minBudgetKES: 50001,
    maxBudgetKES: 150000,
    idealFor: 'Most home, office, and SME technology deployments.',
    guidelineResponse: 'A robust, high-performance deployment with Tier-1 certified equipment, full cable trunking, and certified installation.',
  },
  {
    id: 'professional',
    tierName: 'Professional',
    rangeLabel: 'KES 150,001 – 500,000',
    minBudgetKES: 150001,
    maxBudgetKES: 500000,
    idealFor: 'Larger properties, advanced security, networking, solar, and automation projects.',
    guidelineResponse: 'Enterprise-grade architecture with multi-zone coverage, automated failover, and priority emergency SLA.',
  },
  {
    id: 'enterprise',
    tierName: 'Enterprise',
    rangeLabel: 'KES 500,001+',
    minBudgetKES: 500001,
    maxBudgetKES: 50000000,
    idealFor: 'Schools, institutions, developers, commercial facilities, and large scale infrastructure projects.',
    guidelineResponse: 'We can design a more comprehensive solution with greater coverage, automation, scalability, and advanced features.',
  },
];

export interface AdminPricingConfig {
  minimumGrossMarginPercent: number; // 20% - 35% (alert if below)
  targetGrossMarginPercent: number;  // 30% - 45%
  enterpriseThresholdKES: number;    // Projects above this require custom engineering approval
  vatRatePercent: number;            // 16%
  warrantyReservePercent: number;    // 5% reserve for 1-year on-site SLA
  qaAndSafetyReservePercent: number; // 3% safety, consumables, PPE
  
  // Technician Daily Rates (KENYA 2026 EPRA/NCA compliant)
  technicianDailyRates: {
    level1Certified: number; // KES 2,500
    level2Senior: number;    // KES 3,800
    level3Specialist: number;// KES 5,500
    level4Master: number;    // KES 7,500
  };

  // Logistics & Travel
  travelRatePerKmKES: number;       // KES 45/km
  outOfCountyAccommodationKES: number; // KES 3,500/night (if > 70km from base)
  countyLogisticsMultipliers: Record<string, number>;
}

// Operating Agreement Section 10: Approved Customer Packaging Model (Outcomes First)
export const KENYAN_MARKET_2026_PRICING: Record<string, MarketPriceRange> = {
  homeSecurityEssential: {
    category: 'Home Security',
    title: 'Home Security Essential',
    startingFromKES: 18000,
    typicalMinKES: 18000,
    typicalMaxKES: 32000,
    displayRange: 'Starting from KES 18,000+',
    suitableFor: ['Apartments', 'Bedsitters', 'Small Homes', 'Small Shops'],
    includes: [
      'HD ColorVu Night-Vision Cameras & High-Speed Storage',
      'Surge-protected Power Supply & Weatherproof Junction Boxes',
      'Certified Technician On-Site Installation & Cabling',
      'Live Smartphone App Intrusion Alerts & 1-Year Workmanship Warranty',
    ],
    disclaimer: 'Mandatory site survey required prior to final quotation.',
  },

  homeSecurityPlus: {
    category: 'Home Security',
    title: 'Home Security Plus',
    startingFromKES: 35000,
    typicalMinKES: 35000,
    typicalMaxKES: 65000,
    displayRange: 'Starting from KES 35,000+',
    suitableFor: ['Medium Homes', 'Retail Shops', 'Family Homes'],
    includes: [
      'Multi-channel Full-Color AI Night Surveillance with Audio',
      'Central PoE NVR & WD Purple 24/7 Hard Drive',
      'Concealed PVC Trunking & High-Grade Copper Cabling',
      'Full Smartphone Multi-User Remote View & Handover Training',
    ],
    disclaimer: 'Mandatory site survey required prior to final quotation.',
  },

  homeSecurityPro: {
    category: 'Home Security',
    title: 'Home Security Pro',
    startingFromKES: 70000,
    typicalMinKES: 70000,
    typicalMaxKES: 140000,
    displayRange: 'Starting from KES 70,000+',
    suitableFor: ['Large Homes', 'Business Premises', 'Compounds'],
    includes: [
      'AcuSense Edge AI Human & Vehicle Perimeter Classification',
      'Long-Range Strobe & Siren Active Audio Deterrence',
      'Redundant Battery Power Backup for Blackout Immunity',
      'EPRA & NCA Certified Master Engineer Deployment',
    ],
    disclaimer: 'Mandatory site survey required prior to final quotation.',
  },

  smeSecurity: {
    category: 'Business Security',
    title: 'SME Security Package',
    startingFromKES: 50000,
    typicalMinKES: 50000,
    typicalMaxKES: 220000,
    displayRange: 'Starting from KES 50,000+',
    suitableFor: ['Offices', 'Restaurants', 'Salons', 'Clinics', 'Retail Businesses'],
    includes: [
      'Commercial Multi-Zone 4K Ultra-HD Surveillance',
      'Staff Cashier Point Optical Zoom & Audio Recording',
      'Rack-Mounted Central Video Storage & Cloud Mirroring',
      'Priority 24/7 SLA Technical Support Coverage',
    ],
    disclaimer: 'Mandatory site survey required prior to final quotation.',
  },

  enterpriseSecurity: {
    category: 'Enterprise Security',
    title: 'Enterprise Security',
    isCustomQuoteOnly: true,
    typicalMinKES: 250000,
    typicalMaxKES: 2500000,
    displayRange: 'Custom Quote',
    suitableFor: ['Warehouses', 'Campuses', 'Multi-Site Facilities', 'Gated Communities', 'Logistics Yards'],
    includes: [
      'ANPR Automatic Number Plate Recognition & Speed Radar',
      'Thermal Perimeter Breach Sensors & Control Room Video Wall',
      'Fiber Optic Ring Distribution & Industrial Surge Suppression',
      'Dedicated Project Engineer & Custom SLA Maintenance Contract',
    ],
    disclaimer: 'Detailed physical campus survey and architectural review required.',
  },

  homeNetworking: {
    category: 'Networking',
    title: 'Home Networking',
    startingFromKES: 80000 / 10, // 8000
    typicalMinKES: 8000,
    typicalMaxKES: 22000,
    displayRange: 'Starting from KES 8,000+',
    suitableFor: ['Apartments', 'Residences', 'Small Offices'],
    includes: [
      'Gigabit Dual-Band Wi-Fi 6 Router / Access Point',
      'Cat6 Pure Copper Structured Cabling & RJ45 Termination',
      'Zero-Dead-Zone Signal Calibration & Channel Optimization',
      '1-Year Equipment & Workmanship Guarantee',
    ],
    disclaimer: 'Mandatory site survey required prior to final quotation.',
  },

  businessNetworking: {
    category: 'Networking',
    title: 'Business Networking',
    startingFromKES: 25000,
    typicalMinKES: 25000,
    typicalMaxKES: 180000,
    displayRange: 'Starting from KES 25,000+',
    suitableFor: ['Offices', 'Restaurants', 'Salons', 'Hospitality', 'Retail'],
    includes: [
      'Managed Gigabit PoE Switch Architecture & Patch Panel',
      'Enterprise Mesh Wi-Fi 6 Access Points with Seamless Roaming',
      'Staff vs. Guest VLAN Traffic Isolation & Bandwidth Control',
      'Starlink / Multi-WAN Load Balancing Failover Integration',
    ],
    disclaimer: 'Mandatory site survey required prior to final quotation.',
  },

  accessControl: {
    category: 'Access Control',
    title: 'Access Control',
    startingFromKES: 20000,
    typicalMinKES: 20000,
    typicalMaxKES: 120000,
    displayRange: 'Starting from KES 20,000+',
    suitableFor: ['Commercial Gates', 'Biometric Office Doors', 'Estate Turnstiles', 'Residential Gates'],
    includes: [
      'Heavy-Duty Magnetic Locks (600lbs) & Biometric Fingerprint / RFID Reader',
      'Centurion / BFT Smart Sliding or Swing Gate Motor Integration',
      'Emergency Break-Glass Unit & Power Backup Supply',
      'Smartphone App Remote Unlock & Intercom Audio Pairing',
    ],
    disclaimer: 'Mandatory site survey required prior to final quotation.',
  },

  smartInfrastructure: {
    category: 'Smart Infrastructure',
    title: 'Smart Infrastructure',
    isCustomQuoteOnly: true,
    typicalMinKES: 150000,
    typicalMaxKES: 3500000,
    displayRange: 'Custom Quote',
    suitableFor: ['Apartment Blocks', 'Modern Smart Homes', 'Property Developers', 'Institutions'],
    includes: [
      'Hybrid Solar Microgrid & LiFePO4 Lithium Storage Integration',
      'Ultrasonic Water Tank Telemetry & Automated Pump Controllers',
      'Smart Submetering & Tenant Billing Automation',
      'Integrated Building Management Dashboard (BMS)',
    ],
    disclaimer: 'Custom engineering quotation following physical site survey.',
  },
};

// Operating Agreement Section 3: Site Survey Fee Schedule
export const SITE_SURVEY_POLICY = {
  isMandatory: true,
  rule: 'Any project requiring physical verification must undergo a site survey. No final quotation shall be issued without a survey where required.',
  purpose: [
    'Filters unserious inquiries',
    'Reduces quotation abuse',
    'Protects technician time',
    'Improves quotation accuracy',
    'Improves customer commitment',
  ],
  zones: {
    zoneA: { name: 'Zone A', distance: '0–15 KM', feeKES: 1000, surcharge: 'No travel surcharge' },
    zoneB: { name: 'Zone B', distance: '15–40 KM', feeKES: 2000, surcharge: 'Travel surcharge applies (KES 45/km outside Zone A)' },
    zoneC: { name: 'Zone C', distance: '40–100 KM', feeKES: 3500, surcharge: 'Extended deployment pricing' },
    zoneD: { name: 'Zone D', distance: '100+ KM', feeKES: 5000, isCustom: true, surcharge: 'Custom logistics assessment' },
  },
  terms: 'Site survey fees are NON-REFUNDABLE. Site survey fees may be credited toward project cost at HYNOVA’s discretion. Final decision remains with HYNOVA.',
};

/**
 * Operating Agreement Section 5: Kenyan VAT Compliance (16%)
 * Customer facing quotations must clearly show:
 * - Subtotal (Project Cost)
 * - VAT (16%)
 * - Total Payable
 * Example: Project Cost KES 50,000, VAT KES 8,000, Total KES 58,000
 */
export function calculateVatBreakdown(subtotalKES: number, vatRatePercent: number = 16) {
  const vatAmountKES = Math.round(subtotalKES * (vatRatePercent / 100));
  const totalPayableKES = subtotalKES + vatAmountKES;
  return {
    subtotalKES,
    vatRatePercent,
    vatAmountKES,
    totalPayableKES,
  };
}

// Default Administrator Pricing Configuration
export const DEFAULT_ADMIN_CONFIG: AdminPricingConfig = {
  minimumGrossMarginPercent: 20, // Threshold: Alert if below 20%
  targetGrossMarginPercent: 35,  // Target: 30% - 45%
  enterpriseThresholdKES: 1000000,
  vatRatePercent: 16,
  warrantyReservePercent: 5,
  qaAndSafetyReservePercent: 3,

  technicianDailyRates: {
    level1Certified: 2500,
    level2Senior: 3800,
    level3Specialist: 5500,
    level4Master: 7500,
  },

  travelRatePerKmKES: 45,
  outOfCountyAccommodationKES: 3500,

  countyLogisticsMultipliers: {
    'Nairobi County': 1.0,
    'Kiambu County': 1.05,
    'Machakos County': 1.08,
    'Kajiado County': 1.08,
    'Nakuru County': 1.12,
    'Mombasa County': 1.18,
    'Kisumu County': 1.18,
    'Eldoret / Uasin Gishu': 1.20,
    'Nyeri County': 1.15,
    'Kilifi County': 1.22,
    'defaultOutlyingCounty': 1.25,
  },
};

const STORAGE_KEY = 'hynova_admin_pricing_config_v1';

export class PricingEngineService {
  /**
   * Retrieves active administrator configuration from local storage or returns baseline defaults.
   */
  static getConfig(): AdminPricingConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_ADMIN_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_ADMIN_CONFIG;
  }

  /**
   * Persists administrator configuration adjustments.
   */
  static saveConfig(config: AdminPricingConfig): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  /**
   * Resets administrator settings to 2026 Kenyan Market Defaults.
   */
  static resetToDefaults(): AdminPricingConfig {
    localStorage.removeItem(STORAGE_KEY);
    return DEFAULT_ADMIN_CONFIG;
  }

  /**
   * Generates 5 disciplined budget categories (Starter, Essential, Standard, Professional, Enterprise)
   * tailored to the customer's budget and category, without inventing fixed prices.
   * 
   * AI BUDGET SIZING FRAMEWORK:
   * - Minimum supported customer budget: KES 5,000.
   * - Never rejects a customer for having a small budget.
   * - For KES 5,000 - 20,000: focuses on practical entry solutions and phased roadmaps.
   */
  static generateBudgetCategories(params: {
    category: string;
    customerBudgetKES: number;
    propertyType: string;
    county: string;
  }): {
    tiers: BudgetCategoryTier[];
    recommendedTier: string;
    disclaimer: string;
    affordabilityPromise: string;
    phasedRoadmap: {
      achievedToday: string[];
      phasedApproach: string[];
      futureUpgrades: string[];
      costEffectiveSummary: string;
    };
  } {
    const { category, propertyType, county } = params;
    // Enforce minimum supported budget of KES 5,000
    const customerBudgetKES = Math.max(5000, Number(params.customerBudgetKES) || 5000);
    const catLower = (category || '').toLowerCase();

    // Starter Tier (KES 5,000 – 20,000)
    const starterTier: BudgetCategoryTier = {
      tier: 'Starter',
      title: 'Starter Solution',
      rangeKES: 'KES 5,000 – 20,000',
      minPriceKES: 5000,
      maxPriceKES: 20000,
      hardwareSummary: [
        'Single-point smart Wi-Fi HD camera, smart sensor kit, or network range extender',
        'Certified mini-UPS backup for Wi-Fi router / security hub during power cuts',
        'Physical on-site diagnostic & engineering pathway consultation',
      ],
      laborSummary: 'Certified Technician site evaluation, testing & basic device setup',
      warrantyPeriod: '1 Year Hardware & Workmanship Guarantee',
      suitableFor: 'Small improvements, diagnostics, consultations, smart devices, basic networking, entry level security and phased projects',
    };

    // Essential Tier (KES 20,001 – 50,000)
    const essentialTier: BudgetCategoryTier = {
      tier: 'Essential',
      title: 'Essential Package',
      rangeKES: 'KES 20,001 – 50,000',
      minPriceKES: 20001,
      maxPriceKES: 50000,
      hardwareSummary: [
        '2–3 Channel ColorVu Night HD Surveillance or 1kVA Inverter Backup Station',
        'Concealed PVC trunking & pure copper surge-protected cabling',
        'Smartphone app multi-user alerts & live cloud status',
      ],
      laborSummary: 'Level-2 Senior Technician installation & commissioning',
      warrantyPeriod: '1 Year On-Site SLA & Workmanship Guarantee',
      suitableFor: 'Basic home and small business solutions (Apartments, retail shops, kiosks)',
    };

    // Standard Tier (KES 50,001 – 150,000)
    const standardTier: BudgetCategoryTier = {
      tier: 'Standard',
      title: 'Standard Package',
      rangeKES: 'KES 50,001 – 150,000',
      minPriceKES: 50001,
      maxPriceKES: 150000,
      hardwareSummary: [
        'Full 4-8 Channel AI AcuSense CCTV or 3kVA–5kVA LiFePO4 Lithium Solar System',
        'Central PoE Gigabit Switching & Gigabit Wi-Fi 6 Mesh distribution',
        'Heavy-duty industrial surge suppression & outdoor UV cabling',
      ],
      laborSummary: 'Level-3 Senior Specialist with EPRA/NCA certification',
      warrantyPeriod: '2 Years Manufacturer + 1 Year On-Site SLA',
      suitableFor: 'Most home, office, and SME technology deployments',
    };

    // Professional Tier (KES 150,001 – 500,000)
    const professionalTier: BudgetCategoryTier = {
      tier: 'Professional',
      title: 'Professional Package',
      rangeKES: 'KES 150,001 – 500,000',
      minPriceKES: 150001,
      maxPriceKES: 500000,
      hardwareSummary: [
        'High-capacity 5kW–10kW Hybrid Solar Microgrid with Lithium Storage & Starlink',
        'Biometric access control, motorized gate integration & strobe deterrence',
        'Dual-redundancy power delivery & IoT submetering telemetry',
      ],
      laborSummary: 'Level-4 Master Engineer + Certified 2-person installation crew',
      warrantyPeriod: '3 Years Hardware + Priority Emergency Response SLA',
      suitableFor: 'Larger properties, advanced security, networking, solar, and automation projects',
    };

    // Enterprise Tier (KES 500,001+)
    const enterpriseTier: BudgetCategoryTier = {
      tier: 'Enterprise',
      title: 'Enterprise Custom Package',
      rangeKES: 'KES 500,001+ (Custom Engineering Quotation)',
      minPriceKES: 500001,
      maxPriceKES: 15000000,
      hardwareSummary: [
        'Multi-building fiber distribution, high-voltage 3-phase microgrids, ANPR radar',
        'Integrated Building Management Dashboard (BMS) & cloud automated failover',
        'Custom server racks, transformer step-down & SCADA telemetry',
      ],
      laborSummary: 'Dedicated Project Engineer, certified safety supervisor & crew',
      warrantyPeriod: 'Full Service SLA with Scheduled Preventative Maintenance',
      suitableFor: 'Schools, institutions, developers, commercial facilities, and large scale infrastructure projects',
      requiresAdminApproval: true,
    };

    const tiers: BudgetCategoryTier[] = [
      starterTier,
      essentialTier,
      standardTier,
      professionalTier,
      enterpriseTier,
    ];

    // Select recommended tier based on official budget bands
    let recommendedTier = 'Standard';
    if (customerBudgetKES <= 20000) {
      recommendedTier = 'Starter';
    } else if (customerBudgetKES <= 50000) {
      recommendedTier = 'Essential';
    } else if (customerBudgetKES <= 150000) {
      recommendedTier = 'Standard';
    } else if (customerBudgetKES <= 500000) {
      recommendedTier = 'Professional';
    } else {
      recommendedTier = 'Enterprise';
    }

    // Affordability Promise and Phased Roadmap response
    let affordabilityPromise = "Let's start with what you have and build from there. (Tuanze na kile uli nacho.)";
    if (customerBudgetKES <= 10000) {
      affordabilityPromise = "Based on your budget, we can recommend several starting options and improvements that move you closer to your goal. As your needs grow, HYNOVA can help you expand your solution in phases.";
    } else if (customerBudgetKES <= 20000) {
      affordabilityPromise = "We can recommend an entry level security, networking, smart home, or automation solution that fits your current budget while leaving room for future upgrades.";
    } else if (customerBudgetKES > 500000) {
      affordabilityPromise = "We can design a more comprehensive solution with greater coverage, automation, scalability, and advanced features.";
    }

    // Contextual Phased Roadmap based on category
    let achievedToday: string[] = [];
    let phasedApproach: string[] = [];
    let futureUpgrades: string[] = [];
    let costEffectiveSummary = '';

    if (customerBudgetKES <= 20000) {
      if (catLower.includes('solar') || catLower.includes('energy') || catLower.includes('power')) {
        achievedToday = [
          'Critical load backup mini-UPS for Wi-Fi router, smartphones, and emergency desk lamp (4–8 hrs blackout immunity)',
          'High-surge protection adapter box and multi-plug safety isolator (protecting expensive TVs/laptops from KPLC spikes)',
          'Physical electrical survey by a certified technician to assess your circuit distribution board for future solar',
        ];
        phasedApproach = [
          'Phase 1 (Today): Protect critical loads and install surge suppression (KES 5k – 15k)',
          'Phase 2: Add 1.5kVA Pure Sine Inverter & deep-cycle battery when budget permits (KES 35k – 55k)',
          'Phase 3: Mount rooftop solar monocrystalline panels for zero-grid daytime running (KES 45k+)',
        ];
        futureUpgrades = [
          'Tier-1 Monocrystalline solar panels',
          'LiFePO4 Lithium battery module for 10-year longevity',
          'Smart automated changeover switch',
        ];
        costEffectiveSummary = 'A compact, zero-noise backup solution keeping your communication & devices online today without overspending.';
      } else if (catLower.includes('wifi') || catLower.includes('network') || catLower.includes('starlink')) {
        achievedToday = [
          'High-gain Dual-Band Gigabit Wi-Fi Access Point eliminating dead zones in your apartment or office',
          'Cat6 pure copper cabling run to your primary work desk / entertainment hub',
          'Network diagnostic and bandwidth channel optimization by certified technician',
        ];
        phasedApproach = [
          'Phase 1 (Today): Optimize Wi-Fi coverage and run primary Cat6 backbone (KES 5k – 15k)',
          'Phase 2: Introduce managed Gigabit PoE switch for multi-room extension (KES 20k – 35k)',
          'Phase 3: Deploy Starlink or multi-WAN automated load balancing (KES 50k+)',
        ];
        futureUpgrades = [
          'Outdoor high-speed mesh point',
          'Starlink enterprise bracket & surge grounding',
          'VLAN isolation for guest vs. internal traffic',
        ];
        costEffectiveSummary = 'Instant high-speed Wi-Fi stability and signal strength across your living or work area.';
      } else {
        // Security / General
        achievedToday = [
          'Smart Wi-Fi 2K ColorVu camera with smartphone human-detection alerts and two-way audio',
          'Weatherproof junction box and surge-protected power adapter installation',
          'Certified technician on-site mounting, phone app pairing, and site security audit',
        ];
        phasedApproach = [
          'Phase 1 (Today): Secure your primary entrance, gate, or cashier point (KES 5k – 18k)',
          'Phase 2: Add central NVR recorder and 2 additional perimeter cameras (KES 25k – 45k)',
          'Phase 3: Integrate biometric smart door lock or siren alarm deterrence (KES 30k+)',
        ];
        futureUpgrades = [
          'Central NVR with 2TB 24/7 surveillance hard drive',
          'Strobe & siren active deterrent floodlights',
          'Electric fence integration & GSM alarm dialing',
        ];
        costEffectiveSummary = 'Immediate 24/7 eyes on your most valuable area with phone alerts, expandable as you grow.';
      }
    } else {
      achievedToday = [
        'Complete turn-key hardware deployment tailored to your property requirements',
        'Certified technician execution with full cable trunking, labeling, and EPRA/NCA code compliance',
        'Customer inspection, handover training, and 1-Year Workmanship Warranty activation',
      ];
      phasedApproach = [
        'Phase 1: Mandatory physical site survey and final verified engineering quote',
        'Phase 2: Milestone-based escrow deployment and hardware commissioning',
        'Phase 3: Annual SLA preventative maintenance and future expansion support',
      ];
      futureUpgrades = [
        'Automated IoT telemetry & building management expansion',
        'Cloud telemetry & remote health diagnostics',
        'Extended multi-year SLA warranty coverage',
      ];
      costEffectiveSummary = 'A complete, turn-key technology fulfillment package engineered for longevity and lowest total cost of ownership.';
    }

    return {
      tiers,
      recommendedTier,
      affordabilityPromise,
      phasedRoadmap: {
        achievedToday,
        phasedApproach,
        futureUpgrades,
        costEffectiveSummary,
      },
      disclaimer: `Estimated indicative range based on Kenyan market rates in ${county}. Final pricing is strictly subject to on-site physical inspection, cable run lengths, and engineering validation. HYNOVA never displays guaranteed final prices before site assessment.`,
    };
  }

  /**
   * Margin Protection Rule:
   * Validates gross margin against admin thresholds.
   * If margin < minimumGrossMarginPercent (default 20%), returns alert state.
   */
  static validateMargin(totalQuoteKES: number, totalCostKES: number): {
    grossMarginPercent: number;
    isProtected: boolean;
    requiresApproval: boolean;
    statusLabel: string;
    alertMessage?: string;
  } {
    const config = this.getConfig();
    if (totalQuoteKES <= 0) {
      return {
        grossMarginPercent: 0,
        isProtected: false,
        requiresApproval: true,
        statusLabel: 'INVALID',
        alertMessage: 'Quote must be greater than zero.',
      };
    }

    const marginKES = totalQuoteKES - totalCostKES;
    const grossMarginPercent = Math.round((marginKES / totalQuoteKES) * 100);

    const isBelowMin = grossMarginPercent < config.minimumGrossMarginPercent;
    const isEnterprise = totalQuoteKES >= config.enterpriseThresholdKES;

    if (isBelowMin) {
      return {
        grossMarginPercent,
        isProtected: false,
        requiresApproval: true,
        statusLabel: 'MARGIN_WARNING',
        alertMessage: `Gross margin (${grossMarginPercent}%) is below the required minimum threshold of ${config.minimumGrossMarginPercent}%. Requires Administrator Approval before quote dispatch.`,
      };
    }

    if (isEnterprise) {
      return {
        grossMarginPercent,
        isProtected: true,
        requiresApproval: true,
        statusLabel: 'ENTERPRISE_APPROVAL_REQUIRED',
        alertMessage: `Project value (KES ${totalQuoteKES.toLocaleString()}) exceeds the Enterprise threshold (KES ${config.enterpriseThresholdKES.toLocaleString()}). Custom administrator sign-off required.`,
      };
    }

    return {
      grossMarginPercent,
      isProtected: true,
      requiresApproval: false,
      statusLabel: 'OPTIMAL',
    };
  }
}
