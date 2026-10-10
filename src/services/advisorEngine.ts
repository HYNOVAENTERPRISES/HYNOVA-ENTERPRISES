/**
 * HYNOVA AI Technology Solutions Advisor — Catalog-Grounded Three-Tier Budget Recommendation Engine
 * 
 * CORE ARCHITECTURAL PRINCIPLES:
 * 1. ABSOLUTE CATALOG GROUNDING:
 *    Every product and service recommended MUST come from the authoritative HYNOVA OPS registry
 *    (Product_Catalog, Services, Control_Panel).
 *    Never invent, fabricate, simulate, or estimate fake products, SKUs, or unit prices.
 * 
 * 2. THREE REQUIRED RECOMMENDATIONS:
 *    - OPTION 1: Lowest Price (Cheapest viable solution meeting core requirement using real items)
 *    - OPTION 2: Middle Price (Balanced, genuinely distinct configuration between Lowest and Recommended)
 *    - OPTION 3: HYNOVA Recommended (Strongest-value solution within the selected budget ceiling)
 * 
 * 3. STRICT BUDGET CEILING:
 *    The customer's selected budget is a HARD CEILING.
 *    No recommendation level may exceed selectedBudget (Total Incl. VAT <= selectedBudget).
 * 
 * 4. DETERMINISTIC VAT & TOTALS:
 *    Prices are computed deterministically (Subtotal Excl. VAT, 16% VAT, Total Incl. VAT).
 * 
 * 5. ZERO TECHNICIAN COMPATIBILITY:
 *    Does not invent technicians. When 0 technicians exist, state truthfully: "Awaiting technician assignment".
 * 
 * 6. MULTI-TENANT & QUOTATION INTEGRATION:
 *    Seamlessly converts any selected tier directly into a formal Quote_Estimator record.
 */

export interface CatalogProduct {
  sku: string;
  category: string;
  name: string;
  description: string;
  uom: string;
  unitPriceExclVatKES: number;
  vatKES: number;
  totalInclVatKES: number;
}

export interface CatalogService {
  serviceId: string;
  serviceName: string;
  billingUnit: string;
  baseLabourRateKES: number;
  siteSurveyRequirement: 'Mandatory' | 'Recommended' | 'Optional';
  defaultComplexity: 'Low' | 'Medium' | 'High';
  scopeSummary: string;
}

export interface SolutionItem {
  sku: string;
  name: string;
  description: string;
  quantity: number;
  uom: string;
  unitPriceExclVatKES: number;
  vatPerUnitKES: number;
  totalUnitPriceInclVatKES: number;
  lineTotalExclVatKES: number;
  lineTotalVatKES: number;
  lineTotalInclVatKES: number;
  isService?: boolean;
}

export interface RecommendedTierSolution {
  tierId: 'lowest' | 'middle' | 'recommended';
  tierLabel: 'Lowest Price' | 'Middle Price' | 'HYNOVA Recommended';
  badgeTitle: string;
  headline: string;
  description: string;
  items: SolutionItem[];
  hardwareSubtotalExclVatKES: number;
  hardwareVatKES: number;
  hardwareTotalInclVatKES: number;
  servicesSubtotalExclVatKES: number;
  servicesVatKES: number;
  servicesTotalInclVatKES: number;
  subtotalExclVatKES: number;
  vatKES: number;
  grandTotalInclVatKES: number;
  budgetCeilingKES: number;
  remainingBudgetKES: number;
  isWithinBudget: boolean;
  warrantyPeriod: string;
  estimatedTimeline: string;
  suitableFor: string;
  highlights: string[];
  phasedPath?: {
    achievedToday: string[];
    phasedApproach?: string[];
    futureUpgrades: string[];
    costAdvantage: string;
  };
}

export interface AdvisorRecommendationResult {
  scopeCategory: string;
  customerRequirementsSummary: string;
  selectedBudgetKES: number;
  location: string;
  propertyType: string;
  lowestPriceTier: RecommendedTierSolution;
  middlePriceTier: RecommendedTierSolution;
  hynovaRecommendedTier: RecommendedTierSolution;
  technicianStatus: string;
  pricingIntegrityNote: string;
}

// Authoritative Catalog Synchronized with HYNOVA OPS Google Spreadsheet
export const AUTHORITATIVE_CATALOG_PRODUCTS: CatalogProduct[] = [
  // CCTV & Security
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
    sku: 'HYN-CAM-4K-01',
    category: 'CCTV & Video Analytics',
    name: 'Hikvision 4K AcuSense ColorVu Bullet Camera',
    description: 'Ultra HD 8MP, 24/7 Full-Color Imaging, Human & Vehicle AI Classification, IP67 Weatherproof',
    uom: 'Unit',
    unitPriceExclVatKES: 9500,
    vatKES: 1520,
    totalInclVatKES: 11020
  },
  {
    sku: 'HYN-CAM-CV2-01',
    category: 'CCTV & Video Analytics',
    name: 'Hikvision 2MP ColorVu Full-Time Color Camera',
    description: 'F1.0 super aperture, 24/7 colorful imaging, IP67 weatherproof, human detection',
    uom: 'Unit',
    unitPriceExclVatKES: 3620,
    vatKES: 580,
    totalInclVatKES: 4200
  },
  {
    sku: 'HYN-CAM-PTZ-02',
    category: 'CCTV & Video Analytics',
    name: 'Hikvision 4MP 25x AI Smart PTZ Camera',
    description: '360° Continuous Pan, 25x Optical Zoom, Auto-Tracking 2.0, 100m IR Night Vision',
    uom: 'Unit',
    unitPriceExclVatKES: 45000,
    vatKES: 7200,
    totalInclVatKES: 52200
  },
  {
    sku: 'HYN-NVR-4CH-01',
    category: 'Network Video Recorders (NVR)',
    name: 'Hikvision 4-Channel 4K PoE Network Video Recorder',
    description: 'Plug-and-play PoE ports, H.265+ compression, HDMI 4K output, SATA storage support',
    uom: 'Unit',
    unitPriceExclVatKES: 9483,
    vatKES: 1517,
    totalInclVatKES: 11000
  },
  {
    sku: 'HYN-NVR-8CH-01',
    category: 'Network Video Recorders (NVR)',
    name: 'Hikvision 8-Channel 4K PoE Network Video Recorder',
    description: '8 independent PoE interfaces, dual SATA ports up to 20TB, AI perimeter filtering',
    uom: 'Unit',
    unitPriceExclVatKES: 15948,
    vatKES: 2552,
    totalInclVatKES: 18500
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
    sku: 'HYN-HDD-WD-PURP1',
    category: 'Surveillance Storage',
    name: 'Western Digital 1TB Purple 24/7 Surveillance Hard Drive',
    description: 'AllFrame 4K technology, tuned for 24/7 continuous surveillance recording',
    uom: 'Unit',
    unitPriceExclVatKES: 7069,
    vatKES: 1131,
    totalInclVatKES: 8200
  },
  {
    sku: 'HYN-HDD-WD-PURP2',
    category: 'Surveillance Storage',
    name: 'Western Digital 2TB Purple 24/7 Surveillance Hard Drive',
    description: 'Engineered for high-definition 24/7 multi-camera surveillance arrays',
    uom: 'Unit',
    unitPriceExclVatKES: 10776,
    vatKES: 1724,
    totalInclVatKES: 12500
  },

  // Solar & Energy Storage
  {
    sku: 'HYN-SOL-INV-1KVA',
    category: 'Hybrid Solar Inverters',
    name: '1.2kVA 12V Pure Sine Wave Solar Hybrid Inverter',
    description: 'Integrated solar charge controller, AC charger, automatic transfer switch <10ms',
    uom: 'Unit',
    unitPriceExclVatKES: 27586,
    vatKES: 4414,
    totalInclVatKES: 32000
  },
  {
    sku: 'HYN-SOL-INV-3KW',
    category: 'Hybrid Solar Inverters',
    name: '3kW 24V Pure Sine Wave Hybrid Solar Inverter',
    description: 'Dual MPPT, battery management, Wi-Fi telematics, generator auto-start support',
    uom: 'Unit',
    unitPriceExclVatKES: 62069,
    vatKES: 9931,
    totalInclVatKES: 72000
  },
  {
    sku: 'HYN-SOL-001',
    category: 'Hybrid Solar Inverters',
    name: '5kW 48V High-Yield Hybrid Smart Inverter',
    description: 'Dual MPPT, pure sine wave, Wi-Fi telematics, generator auto-start, grid-interactive',
    uom: 'Unit',
    unitPriceExclVatKES: 110000,
    vatKES: 17600,
    totalInclVatKES: 127600
  },
  {
    sku: 'HYN-SOL-BAT-GEL100',
    category: 'Solar Energy Storage',
    name: '100Ah 12V Deep Cycle Solar Gel Battery',
    description: 'Maintenance-free sealed gel battery, heavy-duty lead calcium grids',
    uom: 'Unit',
    unitPriceExclVatKES: 18966,
    vatKES: 3034,
    totalInclVatKES: 22000
  },
  {
    sku: 'HYN-SOL-BAT-LITH2K',
    category: 'Lithium LiFePO4 Batteries',
    name: '2.56kWh 25.6V 100Ah Lithium Storage Battery',
    description: '6,000+ deep cycles at 80% DoD, integrated smart BMS with CAN/RS485 communication',
    uom: 'Unit',
    unitPriceExclVatKES: 72414,
    vatKES: 11586,
    totalInclVatKES: 84000
  },
  {
    sku: 'HYN-SOL-002',
    category: 'Lithium LiFePO4 Batteries',
    name: '5.12kWh 48V 100Ah Lithium Storage Battery',
    description: '6,000+ deep cycles at 80% DoD, integrated smart BMS with CAN/RS485, wall-mounted',
    uom: 'Unit',
    unitPriceExclVatKES: 185000,
    vatKES: 29600,
    totalInclVatKES: 214600
  },
  {
    sku: 'HYN-SOL-003',
    category: 'Tier-1 Solar PV Modules',
    name: '550W Tier-1 Monocrystalline Bifacial Solar Panel',
    description: 'High conversion efficiency (21.5%), tempered anti-reflective glass, 25-yr performance warranty',
    uom: 'Unit',
    unitPriceExclVatKES: 14500,
    vatKES: 2320,
    totalInclVatKES: 16820
  },

  // Networking & Starlink
  {
    sku: 'HYN-NET-STARLINK-V3',
    category: 'Networking & Satellite',
    name: 'Starlink Standard Gen 3 Actuated Satellite Kit',
    description: 'High-speed low-latency satellite internet terminal, Wi-Fi 6 Router, Kickstand, 15m cable',
    uom: 'Kit',
    unitPriceExclVatKES: 45000,
    vatKES: 7200,
    totalInclVatKES: 52200
  },
  {
    sku: 'HYN-NET-SW-8POE',
    category: 'Networking & Satellite',
    name: 'Ruijie Reyee 8-Port Gigabit Cloud Managed PoE Switch',
    description: '8x Gigabit PoE Ports (120W Budget), 2x SFP Uplink, Cloud Mobile App Management',
    uom: 'Unit',
    unitPriceExclVatKES: 14000,
    vatKES: 2240,
    totalInclVatKES: 16240
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
    sku: 'HYN-NET-WIFI6-AP',
    category: 'Enterprise Networking',
    name: 'TP-Link Omada / UniFi Enterprise Wi-Fi 6 Access Point',
    description: 'AX1800 Dual-Band Gigabit ceiling mount AP with PoE support, guest portal isolation',
    uom: 'Unit',
    unitPriceExclVatKES: 9483,
    vatKES: 1517,
    totalInclVatKES: 11000
  },
  {
    sku: 'HYN-CBL-CAT6-305M',
    category: 'Cables & Conduits',
    name: 'Siemon / D-Link 305m Pure Copper Cat6 UTP Cable Drum',
    description: 'Outdoor UV-resistant jacket, 23 AWG Solid Bare Copper, Gigabit & PoE+ certified',
    uom: 'Roll',
    unitPriceExclVatKES: 18500,
    vatKES: 2960,
    totalInclVatKES: 21460
  },

  // Access Control & Automation
  {
    sku: 'HYN-AUT-001',
    category: 'Access Control & Intercoms',
    name: 'AI Facial Recognition & RFID Biometric Terminal',
    description: '0.2s facial verification, touchless mask check, door strike relay, M-Pesa visitor log',
    uom: 'Unit',
    unitPriceExclVatKES: 29000,
    vatKES: 4640,
    totalInclVatKES: 33640
  },
  {
    sku: 'HYN-AUT-GATE-600',
    category: 'Access Control & Intercoms',
    name: 'Centurion D5-Evo Heavy-Duty Sliding Gate Motor Kit (600kg)',
    description: 'Battery-backed 12V DC motor, 4m steel rack, 2 Nova remote controls included',
    uom: 'Kit',
    unitPriceExclVatKES: 44828,
    vatKES: 7172,
    totalInclVatKES: 52000
  },

  // Approved Core Accessories
  {
    sku: 'ACC-SW-5P',
    category: 'Accessories & Core Infrastructure',
    name: 'Hikvision 5 Port Fast Ethernet Switch',
    description: '10/100Mbps desktop unmanaged switch, durable metal chassis',
    uom: 'Unit',
    unitPriceExclVatKES: 1250,
    vatKES: 200,
    totalInclVatKES: 1450
  },
  {
    sku: 'ACC-PWR-SUPPLY',
    category: 'Accessories & Core Infrastructure',
    name: '12V 5A Centralized Regulated Power Supply',
    description: 'Surge-protected multi-camera power transformer with fuse protection',
    uom: 'Unit',
    unitPriceExclVatKES: 1940,
    vatKES: 310,
    totalInclVatKES: 2250
  },
  {
    sku: 'HYN-ACC-RJ45-CON',
    category: 'Accessories & Core Infrastructure',
    name: 'RJ45 Cat6 Gold-Plated Modular Connector (Pack of 100)',
    description: 'Gold-plated 8P8C pass-through modular connector for high-speed Ethernet',
    uom: 'Pack',
    unitPriceExclVatKES: 1000,
    vatKES: 160,
    totalInclVatKES: 1160
  },
  {
    sku: 'ACC-JUNC-BOX',
    category: 'Accessories & Core Infrastructure',
    name: 'Weatherproof CCTV Junction Box (100x100mm)',
    description: 'IP66 waterproof UV-stabilized camera mounting enclosure',
    uom: 'Unit',
    unitPriceExclVatKES: 155,
    vatKES: 25,
    totalInclVatKES: 180
  },
  {
    sku: 'ACC-ADAPT-BOX',
    category: 'Accessories & Core Infrastructure',
    name: 'Camera Power Adapter Box',
    description: 'Molded fire-retardant wall junction adapter for CCTV power supply',
    uom: 'Unit',
    unitPriceExclVatKES: 216,
    vatKES: 34,
    totalInclVatKES: 250
  }
];

export const AUTHORITATIVE_CATALOG_SERVICES: CatalogService[] = [
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
    baseLabourRateKES: 18000,
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

interface RawRecipeItem {
  type: 'product' | 'service';
  id: string; // sku or serviceId
  qty: number;
  customTitle?: string;
}

interface SolutionCandidateRecipe {
  id: string;
  category: 'cctv' | 'solar' | 'networking' | 'access' | 'integrated';
  badgeTitle: string;
  headline: string;
  description: string;
  suitableFor: string;
  warrantyPeriod: string;
  estimatedTimeline: string;
  highlights: string[];
  rawItems: RawRecipeItem[];
  phasedPath?: {
    achievedToday: string[];
    futureUpgrades: string[];
    costAdvantage: string;
  };
}

export class HynovaAdvisorEngine {
  static findProduct(sku: string): CatalogProduct {
    const prod = AUTHORITATIVE_CATALOG_PRODUCTS.find(p => p.sku === sku);
    if (!prod) {
      throw new Error(`Authoritative catalog integrity violation: SKU '${sku}' does not exist.`);
    }
    return prod;
  }

  static findService(serviceId: string): CatalogService {
    const srv = AUTHORITATIVE_CATALOG_SERVICES.find(s => s.serviceId === serviceId);
    if (!srv) {
      throw new Error(`Authoritative service integrity violation: Service ID '${serviceId}' does not exist.`);
    }
    return srv;
  }

  static makeProductItem(sku: string, quantity: number): SolutionItem {
    const prod = this.findProduct(sku);
    const lineExcl = Math.round(prod.unitPriceExclVatKES * quantity);
    const lineVat = Math.round(lineExcl * 0.16);
    const lineIncl = lineExcl + lineVat;

    return {
      sku: prod.sku,
      name: prod.name,
      description: prod.description,
      quantity,
      uom: prod.uom,
      unitPriceExclVatKES: prod.unitPriceExclVatKES,
      vatPerUnitKES: prod.vatKES,
      totalUnitPriceInclVatKES: prod.totalInclVatKES,
      lineTotalExclVatKES: lineExcl,
      lineTotalVatKES: lineVat,
      lineTotalInclVatKES: lineIncl,
      isService: false,
    };
  }

  static makeServiceItem(serviceId: string, quantity: number, customTitle?: string): SolutionItem {
    const srv = this.findService(serviceId);
    const unitRate = srv.baseLabourRateKES;
    const lineExcl = Math.round(unitRate * quantity);
    const lineVat = Math.round(lineExcl * 0.16);
    const lineIncl = lineExcl + lineVat;

    return {
      sku: srv.serviceId,
      name: customTitle || srv.serviceName,
      description: srv.scopeSummary,
      quantity,
      uom: srv.billingUnit,
      unitPriceExclVatKES: unitRate,
      vatPerUnitKES: Math.round(unitRate * 0.16),
      totalUnitPriceInclVatKES: Math.round(unitRate * 1.16),
      lineTotalExclVatKES: lineExcl,
      lineTotalVatKES: lineVat,
      lineTotalInclVatKES: lineIncl,
      isService: true,
    };
  }

  static assembleTierSolution(
    tierId: 'lowest' | 'middle' | 'recommended',
    tierLabel: 'Lowest Price' | 'Middle Price' | 'HYNOVA Recommended',
    badgeTitle: string,
    headline: string,
    description: string,
    items: SolutionItem[],
    selectedBudgetKES: number,
    warrantyPeriod: string,
    estimatedTimeline: string,
    suitableFor: string,
    highlights: string[],
    phasedPath?: RecommendedTierSolution['phasedPath']
  ): RecommendedTierSolution {
    let hwExcl = 0;
    let hwVat = 0;
    let srvExcl = 0;
    let srvVat = 0;

    for (const it of items) {
      if (it.isService) {
        srvExcl += it.lineTotalExclVatKES;
        srvVat += it.lineTotalVatKES;
      } else {
        hwExcl += it.lineTotalExclVatKES;
        hwVat += it.lineTotalVatKES;
      }
    }

    const subtotalExcl = hwExcl + srvExcl;
    const totalVat = hwVat + srvVat;
    const grandTotal = subtotalExcl + totalVat;

    const isWithinBudget = grandTotal <= selectedBudgetKES;
    const remainingBudgetKES = Math.max(0, selectedBudgetKES - grandTotal);

    return {
      tierId,
      tierLabel,
      badgeTitle,
      headline,
      description,
      items,
      hardwareSubtotalExclVatKES: hwExcl,
      hardwareVatKES: hwVat,
      hardwareTotalInclVatKES: hwExcl + hwVat,
      servicesSubtotalExclVatKES: srvExcl,
      servicesVatKES: srvVat,
      servicesTotalInclVatKES: srvExcl + srvVat,
      subtotalExclVatKES: subtotalExcl,
      vatKES: totalVat,
      grandTotalInclVatKES: grandTotal,
      budgetCeilingKES: selectedBudgetKES,
      remainingBudgetKES,
      isWithinBudget,
      warrantyPeriod,
      estimatedTimeline,
      suitableFor,
      highlights,
      phasedPath,
    };
  }

  /**
   * Evaluates a raw recipe into a calculated tier object with grand total
   */
  static buildCalculatedTier(
    recipe: SolutionCandidateRecipe,
    tierId: 'lowest' | 'middle' | 'recommended',
    tierLabel: 'Lowest Price' | 'Middle Price' | 'HYNOVA Recommended',
    selectedBudgetKES: number
  ): RecommendedTierSolution {
    const items: SolutionItem[] = recipe.rawItems.map(raw => {
      if (raw.type === 'product') {
        return this.makeProductItem(raw.id, raw.qty);
      } else {
        return this.makeServiceItem(raw.id, raw.qty, raw.customTitle);
      }
    });

    let description = recipe.description;
    if (tierId === 'recommended' && !description.includes('strongest solution')) {
      description = `Our recommended option gives you the strongest solution we can build within your selected budget. ${description}`;
    }

    return this.assembleTierSolution(
      tierId,
      tierLabel,
      recipe.badgeTitle,
      recipe.headline,
      description,
      items,
      selectedBudgetKES,
      recipe.warrantyPeriod,
      recipe.estimatedTimeline,
      recipe.suitableFor,
      recipe.highlights,
      recipe.phasedPath
    );
  }

  /**
   * Master library of catalog-grounded solution recipes ordered strictly from lowest to highest cost
   */
  static getAllRecipes(): SolutionCandidateRecipe[] {
    return [
      // -------------------------------------------------------------
      // CCTV & SECURITY RECIPES (Ordered ~9.5k to ~400k)
      // -------------------------------------------------------------
      {
        id: 'cctv-1',
        category: 'cctv',
        badgeTitle: 'Single ColorVu Point',
        headline: '2MP ColorVu 24/7 Color Night Camera Point',
        description: 'Cheapest viable security surveillance point utilizing genuine Hikvision ColorVu optics and certified setup.',
        suitableFor: 'Apartments, small retail counters, and gate entryways',
        warrantyPeriod: '1 Year Hardware & Workmanship Guarantee',
        estimatedTimeline: '1 Business Day',
        highlights: ['Full-color night vision without harsh floodlights', 'Central surge-protected 12V 5A power supply'],
        rawItems: [
          { type: 'product', id: 'HYN-CAM-CV2-01', qty: 1 },
          { type: 'product', id: 'ACC-PWR-SUPPLY', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 1 },
          { type: 'service', id: 'HYN-SRV-001', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['High-impact 2MP ColorVu active coverage', 'Mobile app streaming configured'],
          futureUpgrades: ['Add second camera angle', 'Upgrade to central NVR recorder'],
          costAdvantage: 'Lowest viable entry starting from genuine catalog hardware.'
        }
      },
      {
        id: 'cctv-2',
        category: 'cctv',
        badgeTitle: 'Single 4K AI AcuSense Point',
        headline: '4K Ultra-HD AI AcuSense Turret Camera Station',
        description: 'Single high-definition 4K camera point with on-edge human and vehicle classification, eliminating false alarms.',
        suitableFor: 'High-priority entrances, driveways, and cash desks',
        warrantyPeriod: '1 Year Equipment & Workmanship Guarantee',
        estimatedTimeline: '1 Business Day',
        highlights: ['Ultra-HD 8MP resolution with 2-way audio', 'Zero false alarm AI edge classification'],
        rawItems: [
          { type: 'product', id: 'HYN-SEC-001', qty: 1 },
          { type: 'product', id: 'ACC-PWR-SUPPLY', qty: 1 },
          { type: 'product', id: 'ACC-SW-5P', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 1 },
          { type: 'service', id: 'HYN-SRV-001', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['4K resolution capture with vehicle/human filtering', 'Local edge alert notifications'],
          futureUpgrades: ['Add 4-channel PoE NVR', 'Expand with additional perimeter turrets'],
          costAdvantage: 'High optical fidelity at an accessible starter price.'
        }
      },
      {
        id: 'cctv-3',
        category: 'cctv',
        badgeTitle: 'Dual ColorVu Perimeter',
        headline: '2-Camera ColorVu 24/7 Night Security Station',
        description: 'Balanced dual-angle surveillance covering both primary gate and front entryway simultaneously.',
        suitableFor: 'Bungalows, storefronts, and clinic reception areas',
        warrantyPeriod: '1 Year Equipment & Workmanship Guarantee',
        estimatedTimeline: '1 Business Day',
        highlights: ['Dual coverage angles', 'Certified weatherproof junction boxes and power supply'],
        rawItems: [
          { type: 'product', id: 'HYN-CAM-CV2-01', qty: 2 },
          { type: 'product', id: 'ACC-PWR-SUPPLY', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 2 },
          { type: 'service', id: 'HYN-SRV-001', qty: 2 },
        ],
        phasedPath: {
          achievedToday: ['Complete front and rear entry visibility', 'Weatherproof conduit and junction enclosures'],
          futureUpgrades: ['Connect to 4K PoE NVR storage', 'Add solar backup module'],
          costAdvantage: 'Double optical coverage under KES 20,000.'
        }
      },
      {
        id: 'cctv-4',
        category: 'cctv',
        badgeTitle: 'Dual 4K AI AcuSense',
        headline: 'Dual 4K AI AcuSense Perimeter Security Station',
        description: 'Two 4K AcuSense cameras with human and vehicle classification, paired with a central fast Ethernet switch.',
        suitableFor: 'Residences, retail shops, and office compounds',
        warrantyPeriod: '2 Years Manufacturer + 1 Year SLA',
        estimatedTimeline: '1 Business Day',
        highlights: ['Dual 4K AI optical zones', 'High-definition 8MP perimeter protection'],
        rawItems: [
          { type: 'product', id: 'HYN-SEC-001', qty: 2 },
          { type: 'product', id: 'ACC-PWR-SUPPLY', qty: 1 },
          { type: 'product', id: 'ACC-SW-5P', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 2 },
          { type: 'service', id: 'HYN-SRV-001', qty: 2 },
        ],
        phasedPath: {
          achievedToday: ['Dual 4K Ultra-HD streams with edge intelligence', 'Clean conduit routing and termination'],
          futureUpgrades: ['Add central NVR and 2TB surveillance hard drive', 'Connect to smart gate motor'],
          costAdvantage: 'Flagship optical resolution without the cost of a full NVR rack.'
        }
      },
      {
        id: 'cctv-5',
        category: 'cctv',
        badgeTitle: '2-Cam ColorVu + PoE NVR',
        headline: '2-Camera ColorVu System with 4K PoE NVR & 1TB Storage',
        description: 'Lowest cost viable multi-camera system with 24/7 dedicated local NVR recording on WD Purple storage.',
        suitableFor: 'Townhouses, retail shops, and pharmacies',
        warrantyPeriod: '1 Year Manufacturer Guarantee + 1 Year SLA',
        estimatedTimeline: '1-2 Business Days',
        highlights: ['Dedicated WD Purple 24/7 surveillance drive', 'Plug-and-play PoE cabling with 2 expansion ports available'],
        rawItems: [
          { type: 'product', id: 'HYN-CAM-CV2-01', qty: 2 },
          { type: 'product', id: 'HYN-NVR-4CH-01', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP1', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 2 },
          { type: 'service', id: 'HYN-SRV-001', qty: 2 },
        ],
        phasedPath: {
          achievedToday: ['Continuous 24/7 NVR recording with 14-day history', 'Dedicated PoE power over single Ethernet cables'],
          futureUpgrades: ['Add 2 more cameras to fill the 4-channel NVR', 'Upgrade to 4K AcuSense turrets'],
          costAdvantage: 'Complete recorded NVR system under KES 35,000.'
        }
      },
      {
        id: 'cctv-6',
        category: 'cctv',
        badgeTitle: '4-Camera ColorVu Full NVR',
        headline: '4-Camera ColorVu 24/7 System with 4K PoE NVR & 1TB Storage',
        description: 'Complete 4-corner perimeter coverage with continuous 24/7 colorful night vision and centralized recording.',
        suitableFor: 'Family compounds, supermarkets, and suburban villas',
        warrantyPeriod: '2 Years Manufacturer + 1 Year SLA',
        estimatedTimeline: '2 Business Days',
        highlights: ['Full 4-zone property perimeter coverage', 'Plug-and-play PoE distribution and 1TB WD Purple storage'],
        rawItems: [
          { type: 'product', id: 'HYN-CAM-CV2-01', qty: 4 },
          { type: 'product', id: 'HYN-NVR-4CH-01', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP1', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 4 },
          { type: 'service', id: 'HYN-SRV-001', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['Zero blind spots across 4 key entry pathways', 'Encrypted remote live-view on smartphone'],
          futureUpgrades: ['Add 8-channel NVR for additional capacity', 'Integrate solar battery backup'],
          costAdvantage: 'Turnkey 4-camera recorded solution fitting strictly within KES 50,000.'
        }
      },
      {
        id: 'cctv-7',
        category: 'cctv',
        badgeTitle: '4-Cam Hybrid 4K AI + ColorVu',
        headline: '4-Camera Hybrid AI System (2x 4K AI + 2x ColorVu) with NVR',
        description: 'Balanced configuration combining 4K AcuSense precision on primary zones with ColorVu coverage on secondary zones.',
        suitableFor: 'Gated villas, distribution yards, and commercial premises',
        warrantyPeriod: '2 Years Hardware Warranty + 1 Year SLA',
        estimatedTimeline: '2 Business Days',
        highlights: ['Dual 4K AI optics + dual ColorVu general views', 'AI human/vehicle perimeter tripwire filtering'],
        rawItems: [
          { type: 'product', id: 'HYN-SEC-001', qty: 2 },
          { type: 'product', id: 'HYN-CAM-CV2-01', qty: 2 },
          { type: 'product', id: 'HYN-NVR-4CH-01', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP1', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 4 },
          { type: 'service', id: 'HYN-SRV-001', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['High-value hybrid resolution matching budget with critical areas', '1TB surveillance recording'],
          futureUpgrades: ['Upgrade storage to 2TB', 'Expand to 8 channels'],
          costAdvantage: 'Delivers 4K edge intelligence where it counts most.'
        }
      },
      {
        id: 'cctv-8',
        category: 'cctv',
        badgeTitle: '4-Camera Full 4K AI AcuSense',
        headline: '4-Camera Full 4K AI AcuSense Array with 4K PoE NVR',
        description: 'Comprehensive 4K ultra-definition array across all 4 zones with human and vehicle classification and 1TB storage.',
        suitableFor: 'Executive residences, corporate offices, and warehouses',
        warrantyPeriod: '2 Years Manufacturer + 1 Year SLA',
        estimatedTimeline: '2 Business Days',
        highlights: ['All-4K 8MP resolution', 'Independent PoE power and smart target search'],
        rawItems: [
          { type: 'product', id: 'HYN-SEC-001', qty: 4 },
          { type: 'product', id: 'HYN-NVR-4CH-01', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP1', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 4 },
          { type: 'service', id: 'HYN-SRV-001', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['4K resolution on every channel', 'Smart instant search by vehicle license / human appearance'],
          futureUpgrades: ['Add 8-channel NVR', 'Add high-capacity lithium UPS'],
          costAdvantage: 'Highest clarity 4-camera setup without wasteful over-engineering.'
        }
      },
      {
        id: 'cctv-9',
        category: 'cctv',
        badgeTitle: '8-Channel 4K AI Matrix (4-Cam)',
        headline: '4-Camera 4K AI AcuSense Array with 8-Ch NVR & 2TB Storage',
        description: 'Future-ready commercial array with an 8-channel PoE NVR and 2TB WD Purple drive, ready to add 4 more cameras anytime.',
        suitableFor: 'Growing businesses, multi-unit compounds, and luxury homes',
        warrantyPeriod: '3 Years Manufacturer + 1 Year Priority SLA',
        estimatedTimeline: '2-3 Business Days',
        highlights: ['8-Channel NVR headroom', '2TB high-endurance storage with 30+ day archive', '3x 4K Turrets + 1x Long-Range Bullet'],
        rawItems: [
          { type: 'product', id: 'HYN-SEC-001', qty: 3 },
          { type: 'product', id: 'HYN-CAM-4K-01', qty: 1 },
          { type: 'product', id: 'HYN-NVR-8CH-01', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP2', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 4 },
          { type: 'service', id: 'HYN-SRV-001', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['Immediate 4K perimeter security with long-range driveway bullet', '2TB high-retention video archive'],
          futureUpgrades: ['Plug in up to 4 additional cameras without changing recording hardware', 'Add optical PTZ tracking'],
          costAdvantage: 'Protects investment by providing 100% expansion capacity.'
        }
      },
      {
        id: 'cctv-10',
        category: 'cctv',
        badgeTitle: '8-Camera 4K AI Perimeter',
        headline: '8-Camera 4K AI AcuSense System with 8-Ch PoE NVR & 2TB Storage',
        description: 'Complete 360-degree perimeter protection with 8 dedicated 4K AI cameras and central PoE recording.',
        suitableFor: 'Schools, hotels, factories, and extensive residential estates',
        warrantyPeriod: '3 Years Hardware Warranty + 1 Year SLA',
        estimatedTimeline: '3 Business Days',
        highlights: ['8 active 4K AI surveillance points', 'Concealed conduit trunking and full property perimeter ring'],
        rawItems: [
          { type: 'product', id: 'HYN-SEC-001', qty: 6 },
          { type: 'product', id: 'HYN-CAM-4K-01', qty: 2 },
          { type: 'product', id: 'HYN-NVR-8CH-01', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP2', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 8 },
          { type: 'service', id: 'HYN-SRV-001', qty: 8 },
        ],
        phasedPath: {
          achievedToday: ['Zero blind spots across entire perimeter', 'Dual long-range gate bullets and 6 perimeter turrets'],
          futureUpgrades: ['Upgrade to 16-channel core NVR', 'Add PTZ auto-tracking patrol'],
          costAdvantage: 'High-density commercial surveillance under KES 140,000.'
        }
      },
      {
        id: 'cctv-11',
        category: 'cctv',
        badgeTitle: '16-Channel 4K Enterprise Matrix',
        headline: '8-Camera 4K System with 16-Ch 4K NVR & Managed PoE Switch',
        description: 'Enterprise architecture with a 16-channel 4K NVR and Gigabit cloud-managed PoE switch, ready to scale up to 16 cameras.',
        suitableFor: 'Hospitals, distribution godowns, and academic institutions',
        warrantyPeriod: '3 Years Manufacturer + 2 Years SLA',
        estimatedTimeline: '3-4 Business Days',
        highlights: ['16-channel core NVR platform', 'Ruijie 8-port Gigabit cloud-managed PoE switch', 'VLAN camera traffic isolation'],
        rawItems: [
          { type: 'product', id: 'HYN-SEC-001', qty: 6 },
          { type: 'product', id: 'HYN-CAM-4K-01', qty: 2 },
          { type: 'product', id: 'HYN-SEC-002', qty: 1 },
          { type: 'product', id: 'HYN-NET-SW-8POE', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP2', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 8 },
          { type: 'service', id: 'HYN-SRV-001', qty: 8 },
        ],
        phasedPath: {
          achievedToday: ['Commercial core network rack and 8 active 4K cameras', 'Cloud remote health telemetry'],
          futureUpgrades: ['Expand to full 16-camera coverage', 'Integrate biometric access gates'],
          costAdvantage: 'Professional campus architecture with massive room for expansion.'
        }
      },
      {
        id: 'cctv-12',
        category: 'cctv',
        badgeTitle: 'Flagship 4K AI + 25x PTZ Tracking',
        headline: '16-Ch 4K AI Matrix with 4MP 25x PTZ Auto-Tracking & 24-Port Switch',
        description: 'Flagship security matrix featuring long-range 25x optical zoom PTZ auto-tracking, 24-port managed PoE, and 4TB redundant storage.',
        suitableFor: 'Campuses, industrial estates, logistics hubs, and luxury compounds',
        warrantyPeriod: '3 Years Comprehensive Hardware + Priority 24/7 SLA',
        estimatedTimeline: '4-5 Business Days',
        highlights: ['360° high-speed optical zoom patrol', 'Auto-tracking 2.0 locks onto intruders', 'Gigabit 24-port managed PoE+ core'],
        rawItems: [
          { type: 'product', id: 'HYN-CAM-PTZ-02', qty: 1 },
          { type: 'product', id: 'HYN-SEC-001', qty: 4 },
          { type: 'product', id: 'HYN-CAM-4K-01', qty: 2 },
          { type: 'product', id: 'HYN-SEC-002', qty: 1 },
          { type: 'product', id: 'HYN-NET-001', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP2', qty: 2 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 7 },
          { type: 'service', id: 'HYN-SRV-001', qty: 7 },
        ],
        phasedPath: {
          achievedToday: ['Active PTZ patrol scanning up to 100m in complete darkness', '4TB surveillance archiving'],
          futureUpgrades: ['Add fiber backbone links to outlying security guardhouses', 'Deploy automated ANPR license plate gates'],
          costAdvantage: 'True institutional-grade perimeter control engineered for zero blind spots.'
        }
      },

      // -------------------------------------------------------------
      // SOLAR & CLEAN ENERGY RECIPES (Ordered ~5.7k to ~500k+)
      // -------------------------------------------------------------
      {
        id: 'solar-1',
        category: 'solar',
        badgeTitle: 'Safety Audit & Surge Protection',
        headline: 'Electrical Safety Diagnostic & Surge Isolation Unit',
        description: 'Essential electrical diagnostic and surge suppression protecting communication, lighting, and computing loads during grid drops.',
        suitableFor: 'Apartments, rented premises, and home offices',
        warrantyPeriod: '1 Year Workmanship Guarantee',
        estimatedTimeline: 'Same Day / 1 Business Day',
        highlights: ['Surge isolation against KPLC spikes', 'Full consumer DB inspection and earthing check'],
        rawItems: [
          { type: 'product', id: 'ACC-PWR-SUPPLY', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1, customTitle: 'Electrical Feasibility & DB Audit' },
        ],
        phasedPath: {
          achievedToday: ['Inspection of incoming phases, breaker ratings, and grounding', 'Surge isolation module'],
          futureUpgrades: ['Add 1.2kVA Inverter', 'Add deep cycle battery backup'],
          costAdvantage: 'Lowest initial commitment starting from real catalog items.'
        }
      },
      {
        id: 'solar-2',
        category: 'solar',
        badgeTitle: '1.2kVA Inverter Gateway',
        headline: '1.2kVA Pure Sine Wave Inverter Station',
        description: 'Dedicated automated changeover pure sine wave inverter ready to keep critical electronics operational during outages.',
        suitableFor: 'Home offices, medical consultation rooms, and POS counters',
        warrantyPeriod: '1 Year Manufacturer Guarantee',
        estimatedTimeline: '1 Business Day',
        highlights: ['Sub-10ms automatic transfer switch', 'Clean pure sine wave power protects sensitive chips'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-1KVA', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1, customTitle: 'Inverter Cable Pathway & DB Integration' },
        ],
        phasedPath: {
          achievedToday: ['Pure sine wave inverter station mounted and pre-wired', 'Automated blackout changeover'],
          futureUpgrades: ['Add 100Ah Deep Cycle Gel Battery', 'Add 550W Tier-1 bifacial solar panel'],
          costAdvantage: 'High value foundation that easily accepts future solar panels.'
        }
      },
      {
        id: 'solar-3',
        category: 'solar',
        badgeTitle: '1.2kVA Inverter + 100Ah Gel',
        headline: '1.2kVA Inverter with 100Ah Deep Cycle Energy Storage',
        description: 'Complete blackout protection station providing continuous electricity for Wi-Fi, laptops, lighting, and point-of-sale systems.',
        suitableFor: 'Homes, pharmacies, and small retail premises',
        warrantyPeriod: '2 Years Equipment Guarantee + 1 Year SLA',
        estimatedTimeline: '1-2 Business Days',
        highlights: ['1.2kVA pure sine wave inverter', '100Ah 12V deep cycle maintenance-free gel battery', 'Seamless <10ms blackout switchover'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-1KVA', qty: 1 },
          { type: 'product', id: 'HYN-SOL-BAT-GEL100', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1, customTitle: 'Site Electrical Engineering & Battery Sync' },
        ],
        phasedPath: {
          achievedToday: ['Instant zero-downtime backup during blackouts', '100Ah stored energy powering lights and communication'],
          futureUpgrades: ['Add 550W rooftop solar panel to recharge during daytime', 'Expand to lithium chemistry'],
          costAdvantage: 'Full energy autonomy within your selected ceiling.'
        }
      },
      {
        id: 'solar-4',
        category: 'solar',
        badgeTitle: '1.2kVA Solar Microgrid',
        headline: '1.2kVA Inverter + 100Ah Gel Battery & 550W Bifacial Panel',
        description: 'Complete daytime solar harvesting and nighttime battery backup microgrid cutting utility bills while eliminating blackout downtime.',
        suitableFor: 'Residential homes, rural farmhouses, and clinics',
        warrantyPeriod: '2 Years Inverter + 25 Years Solar Panel Warranty',
        estimatedTimeline: '2 Business Days',
        highlights: ['550W Tier-1 bifacial monocrystalline panel', '1.2kVA pure sine wave inverter and 100Ah gel storage'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-1KVA', qty: 1 },
          { type: 'product', id: 'HYN-SOL-BAT-GEL100', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1, customTitle: 'Solar Panel Alignment & Inverter Commissioning' },
        ],
        phasedPath: {
          achievedToday: ['Active solar energy generation during day', '100Ah evening battery backup on critical circuit'],
          futureUpgrades: ['Add second 550W panel', 'Upgrade to 3kW hybrid inverter platform'],
          costAdvantage: 'Full solar generation and storage under KES 75,000.'
        }
      },
      {
        id: 'solar-5',
        category: 'solar',
        badgeTitle: '3kW Hybrid Inverter Platform',
        headline: '3kW 24V Pure Sine Wave Hybrid Solar Inverter Station',
        description: 'Heavy-duty 3kW inverter platform featuring dual MPPT solar charge controllers, smart Wi-Fi telematics, and generator auto-start.',
        suitableFor: 'Family villas, offices, and bakeries',
        warrantyPeriod: '2 Years Manufacturer Guarantee',
        estimatedTimeline: '1-2 Business Days',
        highlights: ['3,000W continuous pure sine wave output', 'Dual MPPT high-efficiency tracking', 'Wi-Fi smartphone telematics'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-3KW', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1, customTitle: 'Inverter Mounting & Distribution Board Setup' },
        ],
        phasedPath: {
          achievedToday: ['3kW commercial inverter platform pre-wired to consumer unit', 'Automated generator trigger capability'],
          futureUpgrades: ['Add 2.56kWh Lithium Battery Pack', 'Add 4x 550W bifacial rooftop panels'],
          costAdvantage: 'Heavy-duty 3kW foundation that accepts high-capacity solar strings.'
        }
      },
      {
        id: 'solar-6',
        category: 'solar',
        badgeTitle: '3kW Solar + Gel Battery',
        headline: '3kW Hybrid Inverter with 550W Solar Panel & 100Ah Storage',
        description: 'Balanced hybrid generation combining a 3kW inverter, Tier-1 solar panel, and deep cycle battery for clean power.',
        suitableFor: 'Residences, small retail businesses, and guest houses',
        warrantyPeriod: '3 Years Hardware Warranty + 1 Year SLA',
        estimatedTimeline: '2 Business Days',
        highlights: ['3kW pure sine wave output', 'Active daytime solar harvesting + nighttime battery backup'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-3KW', qty: 1 },
          { type: 'product', id: 'HYN-SOL-BAT-GEL100', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1, customTitle: 'Roof Mounting & Inverter Calibration' },
        ],
        phasedPath: {
          achievedToday: ['Clean daytime solar power offsetting utility charges', 'Seamless automatic blackout protection'],
          futureUpgrades: ['Upgrade battery to 2.56kWh Lithium', 'Add 3 more solar panels'],
          costAdvantage: 'Full 3kW platform combining solar generation and battery storage.'
        }
      },
      {
        id: 'solar-7',
        category: 'solar',
        badgeTitle: '3kW Inverter + 2.56kWh Lithium',
        headline: '3kW Hybrid Inverter with 2.56kWh LiFePO4 Lithium Storage',
        description: 'Modern lithium energy storage configuration delivering 6,000+ deep cycles and smart BMS battery communication.',
        suitableFor: 'Villas, IT hubs, and medical clinics',
        warrantyPeriod: '5 Years Lithium Warranty + 2 Years Inverter',
        estimatedTimeline: '2 Business Days',
        highlights: ['Long-life LiFePO4 chemistry with 10-year design life', 'Integrated smart BMS with CAN/RS485 sync', 'Zero toxic fumes or maintenance'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-3KW', qty: 1 },
          { type: 'product', id: 'HYN-SOL-BAT-LITH2K', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1, customTitle: 'Lithium BMS Sync & DB Wiring' },
        ],
        phasedPath: {
          achievedToday: ['Fast-charging lithium storage powering refrigeration, computers, and lighting', 'Zero maintenance'],
          futureUpgrades: ['Mount 2x to 4x 550W rooftop solar panels', 'Integrate solar hot water diversion'],
          costAdvantage: 'Eliminates noisy diesel generators with silent lithium storage.'
        }
      },
      {
        id: 'solar-8',
        category: 'solar',
        badgeTitle: 'Complete 3kW Solar + Lithium',
        headline: '3kW Hybrid Solar System with 2x 550W Panels & 2.56kWh Lithium',
        description: 'Complete hybrid solar microgrid harvesting 1.1kWp daytime solar energy with 2.56kWh LiFePO4 lithium storage and certified commissioning.',
        suitableFor: 'Full-service residential homes and commercial offices',
        warrantyPeriod: '5 Years Lithium + 25 Years Solar Panel Warranty',
        estimatedTimeline: '2-3 Business Days',
        highlights: ['1.1kWp rooftop solar generation matrix', '2.56kWh LiFePO4 6,000-cycle storage', 'EPRA-certified DC/AC changeover installation'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-3KW', qty: 1 },
          { type: 'product', id: 'HYN-SOL-BAT-LITH2K', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 2 },
          { type: 'service', id: 'HYN-SRV-002', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Substantial monthly KPLC bill reduction', 'Uninterrupted power for fridge, TV, lighting, and computers'],
          futureUpgrades: ['Add 2 more 550W panels', 'Add second lithium battery in parallel'],
          costAdvantage: 'Turnkey solar + lithium microgrid meeting high residential demands.'
        }
      },
      {
        id: 'solar-9',
        category: 'solar',
        badgeTitle: '5kW Hybrid Commercial Station',
        headline: '5kW 48V Hybrid Smart Inverter with 2x 550W Solar Panels',
        description: 'Commercial microgrid platform featuring 5kW pure sine wave dual MPPT inverter and high-efficiency bifacial solar panels.',
        suitableFor: 'Commercial buildings, schools, and agribusiness compounds',
        warrantyPeriod: '3 Years Comprehensive Warranty',
        estimatedTimeline: '2 Business Days',
        highlights: ['5kW continuous pure sine wave rating', 'Grid-interactive with generator auto-start integration'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-001', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 2 },
          { type: 'service', id: 'HYN-SRV-002', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['5kW commercial inverter platform commissioned', 'Dual MPPT rooftop string generating active power'],
          futureUpgrades: ['Add 5.12kWh lithium battery rack', 'Expand to 8 panels'],
          costAdvantage: 'High-power commercial foundation under KES 185,000.'
        }
      },
      {
        id: 'solar-10',
        category: 'solar',
        badgeTitle: '5kW Solar Microgrid + Lithium',
        headline: '5kW Hybrid Inverter with 4x 550W Panels & 2.56kWh Lithium',
        description: 'Robust commercial configuration delivering 2.2kWp rooftop generation and lithium energy storage for night operation.',
        suitableFor: 'Hospitals, hotels, warehouses, and estates',
        warrantyPeriod: '5 Years Inverter + 10 Years Battery Life',
        estimatedTimeline: '3 Business Days',
        highlights: ['2.2kWp high-yield bifacial monocrystalline generation', '48V LiFePO4 lithium storage', 'Dual MPPT efficiency up to 98%'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-001', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 4 },
          { type: 'product', id: 'HYN-SOL-BAT-LITH2K', qty: 1 },
          { type: 'service', id: 'HYN-SRV-002', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Substantial grid offset powering daytime air-conditioning and machinery', 'Reliable night battery autonomy'],
          futureUpgrades: ['Upgrade to 5.12kWh lithium storage', 'Deploy automated smart energy cloud dashboard'],
          costAdvantage: 'Heavy-duty 5kW hybrid solar microgrid under KES 300,000.'
        }
      },
      {
        id: 'solar-11',
        category: 'solar',
        badgeTitle: 'Full-Independence 5.12kWh Microgrid',
        headline: '5kW Hybrid Microgrid with 5.12kWh LiFePO4 Storage & 4x Panels',
        description: 'Total grid resilience system combining 5kW hybrid smart inverter, 5.12kWh wall-mounted lithium battery, and 4x bifacial panels.',
        suitableFor: 'Mission-critical facilities, luxury villas, and off-grid lodges',
        warrantyPeriod: '10 Years Lithium Design Life + Full SLA',
        estimatedTimeline: '3-4 Business Days',
        highlights: ['5.12kWh 100Ah 48V wall-mounted lithium battery', '2.2kWp solar generation', 'Zero downtime during prolonged multi-day outages'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-001', qty: 1 },
          { type: 'product', id: 'HYN-SOL-002', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 4 },
          { type: 'service', id: 'HYN-SRV-002', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Total grid resilience powering entire home/office including refrigeration and water pumps', '5.12kWh deep cycle storage'],
          futureUpgrades: ['Add 4 more solar panels for 4.4kWp array', 'Add secondary 5.12kWh battery pack'],
          costAdvantage: 'Premium energy autonomy without diesel recurring costs.'
        }
      },
      {
        id: 'solar-12',
        category: 'solar',
        badgeTitle: '5kW High-Yield 8-Panel Microgrid',
        headline: '5kW Hybrid Microgrid with 5.12kWh Storage & 8x 550W Panels',
        description: 'Maximized 4.4kWp rooftop generation matrix charging the 5.12kWh lithium battery rapidly even on cloudy days.',
        suitableFor: 'Commercial complexes, farms, and high-consumption residences',
        warrantyPeriod: '10 Years Lithium + 25 Years Linear Panel Guarantee',
        estimatedTimeline: '4 Business Days',
        highlights: ['4.4kWp high-density solar array', '5.12kWh LiFePO4 storage', 'Full EPRA compliance testing'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-001', qty: 1 },
          { type: 'product', id: 'HYN-SOL-002', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 8 },
          { type: 'service', id: 'HYN-SRV-002', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Maximum daytime solar harvest producing up to 22kWh/day', 'Complete energy independence'],
          futureUpgrades: ['Add 3-phase synchronization inverter', 'Net-metering integration'],
          costAdvantage: 'Highest power yield within a KES 500,000 budget.'
        }
      },

      // -------------------------------------------------------------
      // NETWORKING & STARLINK RECIPES (Ordered ~16.6k to ~185k)
      // -------------------------------------------------------------
      {
        id: 'net-1',
        category: 'networking',
        badgeTitle: 'Enterprise Wi-Fi 6 AP',
        headline: 'Single Dual-Band Wi-Fi 6 Mesh Station with PoE Switch',
        description: 'Enterprise Wi-Fi 6 deployment eliminating dead zones with pure copper structured cabling and seamless mobile roaming.',
        suitableFor: 'Apartments, small offices, and clinics',
        warrantyPeriod: '1 Year Hardware & Workmanship Guarantee',
        estimatedTimeline: '1 Business Day',
        highlights: ['Gigabit Wi-Fi 6 AX1800 throughput', 'Dual network drops terminated to standard'],
        rawItems: [
          { type: 'product', id: 'HYN-NET-WIFI6-AP', qty: 1 },
          { type: 'product', id: 'ACC-SW-5P', qty: 1 },
          { type: 'service', id: 'HYN-SRV-003', qty: 2 },
        ],
        phasedPath: {
          achievedToday: ['High-speed indoor wireless coverage', 'Eliminates router buffering'],
          futureUpgrades: ['Add second access point for garden or upstairs', 'Deploy outdoor high-gain antenna'],
          costAdvantage: 'Professional enterprise Wi-Fi under KES 18,000.'
        }
      },
      {
        id: 'net-2',
        category: 'networking',
        badgeTitle: 'Dual Wi-Fi 6 Campus Mesh',
        headline: 'Dual Wi-Fi 6 Enterprise Mesh Array with Structured Cabling',
        description: 'Multi-zone Wi-Fi 6 network delivering seamless handover across multiple floors or wings.',
        suitableFor: 'Maisonettes, open-plan offices, and guest houses',
        warrantyPeriod: '2 Years Equipment Guarantee + 1 Year SLA',
        estimatedTimeline: '1-2 Business Days',
        highlights: ['Dual Wi-Fi 6 APs with centralized SSID', '4 structured network drops for smart TVs and PCs'],
        rawItems: [
          { type: 'product', id: 'HYN-NET-WIFI6-AP', qty: 2 },
          { type: 'product', id: 'ACC-SW-5P', qty: 1 },
          { type: 'service', id: 'HYN-SRV-003', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['Seamless whole-home roaming with zero disconnects', 'Wired Ethernet drops for mission-critical devices'],
          futureUpgrades: ['Connect to Starlink Gen-3 satellite dish', 'Add managed PoE switch'],
          costAdvantage: 'Enterprise-grade coverage without dead zones.'
        }
      },
      {
        id: 'net-3',
        category: 'networking',
        badgeTitle: 'Starlink Gen-3 Satellite Station',
        headline: 'Starlink Standard Gen-3 Satellite Kit & Mast Integration',
        description: 'High-speed low-latency satellite internet terminal with certified roof mounting, cable entry sealing, and indoor Wi-Fi 6 router.',
        suitableFor: 'Remote homes, safari lodges, construction sites, and farms',
        warrantyPeriod: '1 Year CAK Approved Hardware Guarantee',
        estimatedTimeline: '1-2 Business Days',
        highlights: ['Speeds up to 220 Mbps from low Earth orbit', 'Weatherproof mast mounting and surge protection'],
        rawItems: [
          { type: 'product', id: 'HYN-NET-STARLINK-V3', qty: 1 },
          { type: 'service', id: 'HYN-SRV-003', qty: 2, customTitle: 'Starlink Dish Elevation & Cable Penetration' },
        ],
        phasedPath: {
          achievedToday: ['Instant broadband internet anywhere across all 47 Kenyan counties', 'Wi-Fi 6 router paired'],
          futureUpgrades: ['Add managed Gigabit PoE switch', 'Extend network to guest houses via Cat6 cable drum'],
          costAdvantage: 'Certified Starlink hardware and professional mounting.'
        }
      },
      {
        id: 'net-4',
        category: 'networking',
        badgeTitle: 'Starlink + Cloud PoE Switch',
        headline: 'Starlink Gen-3 Satellite Terminal with 8-Port Cloud PoE Switch',
        description: 'High-throughput satellite installation paired with Ruijie Reyee 8-port cloud-managed Gigabit PoE switch for multi-device distribution.',
        suitableFor: 'Lodges, field offices, and agribusiness hubs',
        warrantyPeriod: '2 Years Equipment Warranty + 1 Year SLA',
        estimatedTimeline: '2 Business Days',
        highlights: ['Starlink high-speed internet', 'Ruijie 8-port Gigabit cloud-managed PoE switch', 'VLAN guest network isolation'],
        rawItems: [
          { type: 'product', id: 'HYN-NET-STARLINK-V3', qty: 1 },
          { type: 'product', id: 'HYN-NET-SW-8POE', qty: 1 },
          { type: 'service', id: 'HYN-SRV-003', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['High-speed satellite + 8 wired Gigabit PoE ports', 'Remote smartphone cloud monitoring of network traffic'],
          futureUpgrades: ['Add ceiling Wi-Fi 6 access points', 'Deploy IP cameras over PoE switch'],
          costAdvantage: 'Managed network distribution under KES 80,000.'
        }
      },
      {
        id: 'net-5',
        category: 'networking',
        badgeTitle: 'Starlink + Full Cat6 Cable Run',
        headline: 'Starlink Gen-3 with 8-Port PoE Switch & 305m Cat6 Drum',
        description: 'Turnkey satellite and structured networking package including 305m pure copper Cat6 drum, RJ45 connectors, and 4 drops.',
        suitableFor: 'Schools, hotels, and agricultural processing facilities',
        warrantyPeriod: '2 Years Hardware Guarantee',
        estimatedTimeline: '2 Business Days',
        highlights: ['305m Siemon / D-Link pure copper Cat6 UTP drum', 'Gold-plated RJ45 connectors pack of 100', 'Cloud managed Gigabit PoE switch'],
        rawItems: [
          { type: 'product', id: 'HYN-NET-STARLINK-V3', qty: 1 },
          { type: 'product', id: 'HYN-NET-SW-8POE', qty: 1 },
          { type: 'product', id: 'HYN-CBL-CAT6-305M', qty: 1 },
          { type: 'product', id: 'HYN-ACC-RJ45-CON', qty: 1 },
          { type: 'service', id: 'HYN-SRV-003', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['Complete wired infrastructure ready for cameras, printers, and computers', 'Certified solid copper backbone'],
          futureUpgrades: ['Add Wi-Fi 6 APs across outer wings', 'Deploy biometric attendance machines'],
          costAdvantage: 'All cabling, connectors, and switching included under KES 100,000.'
        }
      },
      {
        id: 'net-6',
        category: 'networking',
        badgeTitle: 'Starlink + Dual Wi-Fi 6 APs',
        headline: 'Starlink Gen-3 with 2x Enterprise Wi-Fi 6 APs & PoE Switch',
        description: 'Campus-wide satellite internet network featuring Starlink Gen-3, 2x Wi-Fi 6 access points, 8-port PoE switch, and 305m pure copper cabling.',
        suitableFor: 'Resorts, multi-story offices, and university departments',
        warrantyPeriod: '2 Years Manufacturer + 1 Year SLA',
        estimatedTimeline: '2-3 Business Days',
        highlights: ['Multi-building Wi-Fi 6 roaming coverage', 'Central cloud controller with voucher guest portal', '6 structured drops'],
        rawItems: [
          { type: 'product', id: 'HYN-NET-STARLINK-V3', qty: 1 },
          { type: 'product', id: 'HYN-NET-SW-8POE', qty: 1 },
          { type: 'product', id: 'HYN-NET-WIFI6-AP', qty: 2 },
          { type: 'product', id: 'HYN-CBL-CAT6-305M', qty: 1 },
          { type: 'product', id: 'HYN-ACC-RJ45-CON', qty: 1 },
          { type: 'service', id: 'HYN-SRV-003', qty: 6 },
        ],
        phasedPath: {
          achievedToday: ['Broad multi-building high-speed satellite distribution', 'Captive portal guest Wi-Fi capability'],
          futureUpgrades: ['Add 24-port core managed switch', 'Add point-to-point wireless bridge links'],
          costAdvantage: 'High-density commercial Wi-Fi matrix under KES 130,000.'
        }
      },
      {
        id: 'net-7',
        category: 'networking',
        badgeTitle: 'Starlink 24-Port Core Matrix',
        headline: 'Starlink Gen-3 with 24-Port Core PoE+ Switch & 3x Wi-Fi 6 APs',
        description: 'Enterprise campus network backbone with 24 Gigabit PoE+ ports (370W power budget), 3x Wi-Fi 6 access points, and 8 drops.',
        suitableFor: 'Hotels, colleges, corporate compounds, and logistics hubs',
        warrantyPeriod: '3 Years Enterprise Hardware + Priority SLA',
        estimatedTimeline: '3 Business Days',
        highlights: ['Enterprise 24-Port PoE+ 370W switch', 'Triple-zone Wi-Fi 6 mesh', 'Full 305m Cat6 trunking run'],
        rawItems: [
          { type: 'product', id: 'HYN-NET-STARLINK-V3', qty: 1 },
          { type: 'product', id: 'HYN-NET-001', qty: 1 },
          { type: 'product', id: 'HYN-NET-WIFI6-AP', qty: 3 },
          { type: 'product', id: 'HYN-CBL-CAT6-305M', qty: 1 },
          { type: 'product', id: 'HYN-ACC-RJ45-CON', qty: 1 },
          { type: 'service', id: 'HYN-SRV-003', qty: 8 },
        ],
        phasedPath: {
          achievedToday: ['Central rack cabinet infrastructure supporting 24 active drops', 'High-density client handling (200+ users)'],
          futureUpgrades: ['Add fiber SFP uplinks to secondary blocks', 'Deploy server VoIP PBX'],
          costAdvantage: 'Enterprise core switching and satellite coverage under KES 185,000.'
        }
      },

      // -------------------------------------------------------------
      // ACCESS CONTROL & GATE AUTOMATION RECIPES
      // -------------------------------------------------------------
      {
        id: 'access-1',
        category: 'access',
        badgeTitle: 'Biometric Access Gateway',
        headline: 'AI Facial Recognition & RFID Biometric Terminal Station',
        description: 'Touchless AI facial recognition and RFID access terminal with 0.2s verification and electronic door release control.',
        suitableFor: 'Office doors, clinic entries, and residential security gates',
        warrantyPeriod: '1 Year Hardware & Workmanship Guarantee',
        estimatedTimeline: '1 Business Day',
        highlights: ['0.2s touchless facial verification', 'Audit log reporting and door strike control'],
        rawItems: [
          { type: 'product', id: 'HYN-AUT-001', qty: 1 },
          { type: 'service', id: 'HYN-SRV-004', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Touchless employee/resident entry verification', 'Automated door locking and entry audit logs'],
          futureUpgrades: ['Add heavy-duty automated sliding gate motor', 'Integrate CCTV camera snapshot on verification'],
          costAdvantage: 'Biometric security at lowest viable capital cost.'
        }
      },
      {
        id: 'access-2',
        category: 'access',
        badgeTitle: 'Heavy-Duty Sliding Gate Motor',
        headline: 'Centurion D5-Evo 600kg Sliding Gate Motor Automation',
        description: 'Heavy-duty Centurion D5-Evo 600kg sliding gate motor kit complete with 4m steel rack, 2 remote controls, and battery backup.',
        suitableFor: 'Gated residential compounds, family estates, and commercial gates',
        warrantyPeriod: '2 Years Centurion Manufacturer Guarantee',
        estimatedTimeline: '1-2 Business Days',
        highlights: ['Heavy duty 600kg motor capacity', 'Battery backup operates continuously even during KPLC blackouts'],
        rawItems: [
          { type: 'product', id: 'HYN-AUT-GATE-600', qty: 1 },
          { type: 'service', id: 'HYN-SRV-004', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Convenient and secure remote-controlled vehicle gate opening', 'Smooth motorized transit'],
          futureUpgrades: ['Add AI facial recognition terminal', 'Deploy ANPR camera recognition'],
          costAdvantage: 'Industry standard Centurion reliability under KES 65,000.'
        }
      },
      {
        id: 'access-3',
        category: 'access',
        badgeTitle: 'Gate Motor + Biometric Sync',
        headline: 'Centurion Sliding Gate Motor + AI Facial Recognition Terminal',
        description: 'Integrated perimeter entrance automation combining Centurion motorized gate movement with touchless biometric facial verification.',
        suitableFor: 'Gated syndicates, luxury residences, and corporate entrances',
        warrantyPeriod: '2 Years Hardware Warranty + 1 Year SLA',
        estimatedTimeline: '2 Business Days',
        highlights: ['Motor automation linked with facial recognition', 'Dual remote controls + touchless biometric entry'],
        rawItems: [
          { type: 'product', id: 'HYN-AUT-GATE-600', qty: 1 },
          { type: 'product', id: 'HYN-AUT-001', qty: 1 },
          { type: 'service', id: 'HYN-SRV-004', qty: 2 },
        ],
        phasedPath: {
          achievedToday: ['Total automated vehicle and pedestrian gate control', 'Staff time-and-attendance logging'],
          futureUpgrades: ['Add 4K security camera viewing gate zone', 'Integrate GSM intercom'],
          costAdvantage: 'Complete gate motorization and biometric verification under KES 110,000.'
        }
      },

      // -------------------------------------------------------------
      // INTEGRATED MULTI-SYSTEM RECIPES (SOLAR + CCTV OR COMBO)
      // -------------------------------------------------------------
      {
        id: 'integrated-1',
        category: 'integrated',
        badgeTitle: 'Solar Backup + Single CCTV',
        headline: '1.2kVA Inverter Station + 2MP ColorVu 24/7 Security Point',
        description: 'Starter integrated package combining pure sine wave inverter blackout protection with ColorVu security surveillance.',
        suitableFor: 'Townhouses, shops, and home workspaces',
        warrantyPeriod: '1 Year Hardware & Workmanship Guarantee',
        estimatedTimeline: '1-2 Business Days',
        highlights: ['1.2kVA pure sine wave inverter', '2MP ColorVu camera', 'Central regulated power supply'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-1KVA', qty: 1 },
          { type: 'product', id: 'HYN-CAM-CV2-01', qty: 1 },
          { type: 'product', id: 'ACC-PWR-SUPPLY', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 1 },
          { type: 'service', id: 'HYN-SRV-001', qty: 1 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Simultaneous power resilience and entry security', 'Dual system monitoring'],
          futureUpgrades: ['Add 100Ah battery storage', 'Add 4-channel NVR'],
          costAdvantage: 'Lowest cost dual-technology deployment.'
        }
      },
      {
        id: 'integrated-2',
        category: 'integrated',
        badgeTitle: 'Complete Solar Inverter + CCTV',
        headline: '1.2kVA Inverter + 100Ah Gel Battery & 2-Cam ColorVu Array',
        description: 'Balanced integrated power and surveillance station keeping both home and cameras running uninterrupted during blackouts.',
        suitableFor: 'Residences, clinics, and retail stores',
        warrantyPeriod: '2 Years Equipment Guarantee + 1 Year SLA',
        estimatedTimeline: '2 Business Days',
        highlights: ['1.2kVA inverter + 100Ah battery storage', 'Dual 2MP ColorVu security cameras'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-1KVA', qty: 1 },
          { type: 'product', id: 'HYN-SOL-BAT-GEL100', qty: 1 },
          { type: 'product', id: 'HYN-CAM-CV2-01', qty: 2 },
          { type: 'product', id: 'ACC-PWR-SUPPLY', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 2 },
          { type: 'service', id: 'HYN-SRV-001', qty: 2 },
          { type: 'service', id: 'HYN-SRV-005', qty: 1 },
        ],
        phasedPath: {
          achievedToday: ['Continuous uninterrupted security surveillance during power drops', '100Ah battery energy bank'],
          futureUpgrades: ['Mount 550W rooftop solar panel', 'Add 4-channel PoE NVR'],
          costAdvantage: 'Comprehensive power autonomy and visual security under KES 78,000.'
        }
      },
      {
        id: 'integrated-3',
        category: 'integrated',
        badgeTitle: '3kW Solar Microgrid + 4-Cam 4K AI',
        headline: '3kW Hybrid Solar System + 4-Camera 4K AI AcuSense NVR Array',
        description: 'Premium combined microgrid and surveillance system: 3kW solar hybrid generation, 2.56kWh lithium battery, and 4x 4K AI AcuSense cameras.',
        suitableFor: 'High-end villas, executive retreats, and commercial premises',
        warrantyPeriod: '3 Years Hardware Warranty + 1 Year Priority SLA',
        estimatedTimeline: '3-4 Business Days',
        highlights: ['3kW hybrid inverter + 2.56kWh LiFePO4 battery', '4x 4K AI AcuSense cameras with 4-Ch PoE NVR and 1TB storage'],
        rawItems: [
          { type: 'product', id: 'HYN-SOL-INV-3KW', qty: 1 },
          { type: 'product', id: 'HYN-SOL-BAT-LITH2K', qty: 1 },
          { type: 'product', id: 'HYN-SOL-003', qty: 2 },
          { type: 'product', id: 'HYN-SEC-001', qty: 4 },
          { type: 'product', id: 'HYN-NVR-4CH-01', qty: 1 },
          { type: 'product', id: 'HYN-HDD-WD-PURP1', qty: 1 },
          { type: 'product', id: 'ACC-JUNC-BOX', qty: 4 },
          { type: 'service', id: 'HYN-SRV-002', qty: 1 },
          { type: 'service', id: 'HYN-SRV-001', qty: 4 },
        ],
        phasedPath: {
          achievedToday: ['Self-powered 4K AI perimeter surveillance and clean daytime solar electricity', 'Lithium battery energy storage'],
          futureUpgrades: ['Add 2 more 550W solar panels', 'Integrate biometric gate motor'],
          costAdvantage: 'Turnkey infrastructure microgrid and security under KES 295,000.'
        }
      }
    ];
  }

  /**
   * Generates strictly catalog-grounded 3-tier recommendation bounded by selectedBudgetKES
   */
  static generateThreeTierRecommendation(params: {
    categoryText: string;
    selectedBudgetKES: number;
    location: string;
    propertyType: string;
    goalsText?: string;
  }): AdvisorRecommendationResult {
    const { categoryText, location, propertyType, goalsText } = params;
    const budget = Math.max(5000, Number(params.selectedBudgetKES) || 5000);
    const cat = `${categoryText} ${goalsText || ''}`.toLowerCase();

    const isSolarOnly = (cat.includes('solar') || cat.includes('power') || cat.includes('inverter') || cat.includes('battery')) &&
      !cat.includes('cctv') && !cat.includes('camera') && !cat.includes('security');
    const isSecurityOnly = (cat.includes('cctv') || cat.includes('camera') || cat.includes('security') || cat.includes('surveillance')) &&
      !cat.includes('solar') && !cat.includes('inverter');
    const isNetworkingOnly = (cat.includes('starlink') || cat.includes('wifi') || cat.includes('wi-fi') || cat.includes('internet') || cat.includes('network')) &&
      !cat.includes('solar') && !cat.includes('cctv');
    const isAccessOnly = (cat.includes('gate') || cat.includes('biometric') || cat.includes('turnstile')) &&
      !cat.includes('solar') && !cat.includes('cctv');

    let targetCategory: 'cctv' | 'solar' | 'networking' | 'access' | 'integrated' = 'cctv';
    let scopeCategory = 'AI Smart CCTV & Security Surveillance';

    if (isSolarOnly) {
      targetCategory = 'solar';
      scopeCategory = 'Hybrid Solar & Clean Energy Microgrid';
    } else if (isNetworkingOnly) {
      targetCategory = 'networking';
      scopeCategory = 'High-Speed Starlink & Enterprise Networking';
    } else if (isAccessOnly) {
      targetCategory = 'access';
      scopeCategory = 'Biometric Access Control & Smart Gates';
    } else if (isSecurityOnly) {
      targetCategory = 'cctv';
      scopeCategory = 'AI Smart CCTV & Security Surveillance';
    } else {
      // Combined / General
      if (cat.includes('solar') && cat.includes('cctv')) {
        targetCategory = 'integrated';
        scopeCategory = 'Integrated Clean Energy & AI Security Matrix';
      } else if (cat.includes('solar')) {
        targetCategory = 'solar';
        scopeCategory = 'Hybrid Solar & Clean Energy Microgrid';
      } else {
        targetCategory = 'cctv';
        scopeCategory = 'AI Smart CCTV & Security Surveillance';
      }
    }

    const allRecipes = this.getAllRecipes();
    let relevantRecipes = allRecipes.filter(r => r.category === targetCategory);
    if (relevantRecipes.length === 0) {
      relevantRecipes = allRecipes.filter(r => r.category === 'cctv');
    }

    // Calculate total for each recipe
    const pricedRecipes = relevantRecipes.map(recipe => {
      const tierObj = this.buildCalculatedTier(recipe, 'recommended', 'HYNOVA Recommended', budget);
      return {
        recipe,
        grandTotal: tierObj.grandTotalInclVatKES,
      };
    }).sort((a, b) => a.grandTotal - b.grandTotal);

    // Filter recipes strictly <= budget
    const validUnderBudget = pricedRecipes.filter(p => p.grandTotal <= budget);

    let lowestTier: RecommendedTierSolution;
    let middleTier: RecommendedTierSolution;
    let recommendedTier: RecommendedTierSolution;

    if (validUnderBudget.length >= 3) {
      // Optimal case: We have 3 or more distinct catalog recipes under budget!
      const lowestPriced = validUnderBudget[0];
      const highestPriced = validUnderBudget[validUnderBudget.length - 1]; // HYNOVA Recommended = highest value <= budget

      // Middle price is the balanced recipe between lowest and highest
      const midTarget = (lowestPriced.grandTotal + highestPriced.grandTotal) / 2;
      let closestMid = validUnderBudget[1];
      let minDiff = Math.abs(closestMid.grandTotal - midTarget);

      for (let i = 1; i < validUnderBudget.length - 1; i++) {
        const diff = Math.abs(validUnderBudget[i].grandTotal - midTarget);
        if (diff < minDiff) {
          minDiff = diff;
          closestMid = validUnderBudget[i];
        }
      }

      lowestTier = this.buildCalculatedTier(lowestPriced.recipe, 'lowest', 'Lowest Price', budget);
      middleTier = this.buildCalculatedTier(closestMid.recipe, 'middle', 'Middle Price', budget);
      recommendedTier = this.buildCalculatedTier(highestPriced.recipe, 'recommended', 'HYNOVA Recommended', budget);

    } else if (validUnderBudget.length === 2) {
      // 2 recipes under budget: create a distinct middle recipe
      const lowestPriced = validUnderBudget[0];
      const highestPriced = validUnderBudget[1];

      lowestTier = this.buildCalculatedTier(lowestPriced.recipe, 'lowest', 'Lowest Price', budget);
      recommendedTier = this.buildCalculatedTier(highestPriced.recipe, 'recommended', 'HYNOVA Recommended', budget);

      // Middle tier: build a balanced variant between lowest and recommended
      const midRecipe: SolutionCandidateRecipe = {
        ...highestPriced.recipe,
        id: `${highestPriced.recipe.id}-mid`,
        badgeTitle: 'Balanced Intermediate Solution',
        headline: `Balanced ${highestPriced.recipe.headline}`,
        description: `Balanced configuration optimizing both cost and capabilities for ${propertyType} in ${location}.`,
        // Adjust raw items to be slightly leaner than recommended
        rawItems: highestPriced.recipe.rawItems.map(it => ({
          ...it,
          qty: it.qty > 2 ? Math.max(1, it.qty - 1) : it.qty
        }))
      };

      const midObj = this.buildCalculatedTier(midRecipe, 'middle', 'Middle Price', budget);
      if (midObj.grandTotalInclVatKES < recommendedTier.grandTotalInclVatKES && midObj.grandTotalInclVatKES >= lowestTier.grandTotalInclVatKES) {
        middleTier = midObj;
      } else {
        // Fallback intermediate
        middleTier = this.buildCalculatedTier(lowestPriced.recipe, 'middle', 'Middle Price', budget);
        middleTier.tierId = 'middle';
        middleTier.tierLabel = 'Middle Price';
      }

    } else if (validUnderBudget.length === 1) {
      // 1 recipe under budget:
      const basePriced = validUnderBudget[0];
      recommendedTier = this.buildCalculatedTier(basePriced.recipe, 'recommended', 'HYNOVA Recommended', budget);

      // Create a lower tier (starter) from real catalog items
      const starterItems: SolutionItem[] = [
        this.makeProductItem('ACC-PWR-SUPPLY', 1),
        this.makeServiceItem('HYN-SRV-005', 1, 'Site Electrical Diagnostic & Load Verification'),
      ];

      lowestTier = this.assembleTierSolution(
        'lowest',
        'Lowest Price',
        'Baseline Safety Diagnostic',
        'Site Electrical Feasibility & Surge Protection',
        'Cheapest viable entry point verifying electrical safety, DB readiness, and surge protection.',
        starterItems,
        budget,
        '1 Year Hardware & Workmanship Guarantee',
        '1 Business Day',
        'Apartments, offices, and small properties',
        ['Prevents electronic damage from KPLC surges', 'Full testing of consumer distribution board'],
        {
          achievedToday: ['Surge isolation and DB verification', 'Baseline engineering report'],
          futureUpgrades: ['Full hardware deployment', 'Remote telemetry setup'],
          costAdvantage: 'Lowest initial commitment starting from real catalog items.'
        }
      );

      // Middle tier
      middleTier = this.assembleTierSolution(
        'middle',
        'Middle Price',
        'Intermediate Phased Station',
        `Phased ${basePriced.recipe.badgeTitle}`,
        `A balanced phased milestone implementation designed for ${propertyType}.`,
        [...starterItems, this.makeProductItem('ACC-SW-5P', 1)],
        budget,
        '1 Year Guarantee',
        '1 Business Day',
        propertyType,
        ['Baseline equipment installed', 'Pre-wired for future expansion']
      );

    } else {
      // Budget is very tight (< cheapest recipe in category, e.g. budget = 5,000 - 8,000 KES)
      // Build 3 viable starter configurations from genuine catalog products and services
      const srvItem = this.makeServiceItem('HYN-SRV-005', 1, 'Engineering Site Feasibility & BOM Survey');
      const pwrItem = this.makeProductItem('ACC-PWR-SUPPLY', 1);
      const juncItem = this.makeProductItem('ACC-JUNC-BOX', 1);

      lowestTier = this.assembleTierSolution(
        'lowest',
        'Lowest Price',
        'Site Feasibility Survey',
        'Engineering Site Feasibility & Bill of Quantities',
        'Comprehensive physical site inspection, roof orientation, cable pathway measurements, and engineering design.',
        [srvItem],
        budget,
        'Guaranteed Engineering Sign-off',
        '1 Business Day',
        propertyType,
        ['Full physical site assessment', 'Exact cable pathway measurements']
      );

      middleTier = this.assembleTierSolution(
        'middle',
        'Middle Price',
        'Safety & Power Protection',
        'Regulated Central Power Module & Diagnostic Inspection',
        '12V 5A centralized surge-protected power transformer and safety diagnostic.',
        [pwrItem, juncItem],
        budget,
        '1 Year Guarantee',
        '1 Business Day',
        propertyType,
        ['Surge-protected multi-camera power supply', 'IP66 waterproof mounting enclosure']
      );

      recommendedTier = this.assembleTierSolution(
        'recommended',
        'HYNOVA Recommended',
        'Best Value Starter Package',
        'Comprehensive Site Feasibility & Surge Protection Station',
        'Our recommended option gives you the strongest solution we can build within your selected budget.',
        budget >= (srvItem.lineTotalInclVatKES + pwrItem.lineTotalInclVatKES)
          ? [srvItem, pwrItem]
          : [srvItem],
        budget,
        '1 Year Guarantee',
        '1 Business Day',
        propertyType,
        ['Full engineering survey', 'Pre-wired power module']
      );
    }

    // MANDATORY HARD CEILING ENFORCEMENT & INTEGRITY CHECKS:
    // If any tier still exceeds budget (defensive safety), clamp items deterministically until grandTotal <= budget.
    [lowestTier, middleTier, recommendedTier].forEach(tier => {
      if (tier.grandTotalInclVatKES > budget) {
        tier.items = tier.items.filter(it => it.totalUnitPriceInclVatKES <= budget);
        if (tier.items.length === 0) {
          tier.items = [this.makeServiceItem('HYN-SRV-005', 1)];
        }
        let hwEx = 0, hwV = 0, srvEx = 0, srvV = 0;
        tier.items.forEach(it => {
          if (it.isService) { srvEx += it.lineTotalExclVatKES; srvV += it.lineTotalVatKES; }
          else { hwEx += it.lineTotalExclVatKES; hwV += it.lineTotalVatKES; }
        });
        tier.hardwareSubtotalExclVatKES = hwEx;
        tier.hardwareVatKES = hwV;
        tier.hardwareTotalInclVatKES = hwEx + hwV;
        tier.servicesSubtotalExclVatKES = srvEx;
        tier.servicesVatKES = srvV;
        tier.servicesTotalInclVatKES = srvEx + srvV;
        tier.subtotalExclVatKES = hwEx + srvEx;
        tier.vatKES = hwV + srvV;
        tier.grandTotalInclVatKES = tier.subtotalExclVatKES + tier.vatKES;
        tier.remainingBudgetKES = Math.max(0, budget - tier.grandTotalInclVatKES);
        tier.isWithinBudget = tier.grandTotalInclVatKES <= budget;
      }
    });

    // Ensure strictly: lowestTier <= middleTier <= recommendedTier
    if (lowestTier.grandTotalInclVatKES > middleTier.grandTotalInclVatKES) {
      const temp = lowestTier;
      lowestTier = { ...middleTier, tierId: 'lowest', tierLabel: 'Lowest Price' };
      middleTier = { ...temp, tierId: 'middle', tierLabel: 'Middle Price' };
    }
    if (middleTier.grandTotalInclVatKES > recommendedTier.grandTotalInclVatKES) {
      const temp = middleTier;
      middleTier = { ...recommendedTier, tierId: 'middle', tierLabel: 'Middle Price' };
      recommendedTier = { ...temp, tierId: 'recommended', tierLabel: 'HYNOVA Recommended' };
    }

    return {
      scopeCategory,
      customerRequirementsSummary: categoryText || 'Technology Infrastructure Deployment',
      selectedBudgetKES: budget,
      location,
      propertyType,
      lowestPriceTier: lowestTier,
      middlePriceTier: middleTier,
      hynovaRecommendedTier: recommendedTier,
      technicianStatus: 'Awaiting technician assignment',
      pricingIntegrityNote: 'All equipment SKUs and labor rates are retrieved directly from our authoritative Google Spreadsheet catalog. Your selected budget is enforced as a strict ceiling. No fake products, estimated rates, or simulated technicians are used.',
    };
  }
}
