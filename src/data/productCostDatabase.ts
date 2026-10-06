/**
 * HYNOVA Central Product Cost Database
 * 
 * Operating Agreement Section 9 Compliance:
 * - All equipment pricing must be editable by administrators.
 * - Never hardcode supplier prices; prices change.
 * - Central real-time store supporting supplier-specific, promotional, bulk, and regional pricing.
 * - Approved Base Pricing:
 *   Hikvision 5 Port Switch: KES 1,000
 *   RJ45 Connector: KES 10
 *   Junction Box: KES 100
 *   Adapter Box: KES 150 (Updated Approved Cost)
 *   Power Supply: KES 1,500
 */

export interface ProductCostItem {
  id: string;
  sku: string;
  name: string;
  category: 'cctv' | 'solar' | 'networking' | 'access' | 'power' | 'accessories' | 'cables';
  supplierBaseCostKES: number;
  recommendedRetailKES: number;
  targetMarginPercent: number;
  supplierName: string;
  unit: string;
  stockStatus: 'In Stock' | 'Lead Time 24h' | 'Special Order';
  updatedAt: string;
  description: string;
}

export const INITIAL_PRODUCT_COST_DATABASE: ProductCostItem[] = [
  // Approved Accessories & Core Infrastructure (Section 9)
  {
    id: 'prod-001',
    sku: 'ACC-SW-5P',
    name: 'Hikvision 5 Port Fast Ethernet Switch',
    category: 'networking',
    supplierBaseCostKES: 1000,
    recommendedRetailKES: 1450,
    targetMarginPercent: 31,
    supplierName: 'Hikvision Kenya Authorized Hub',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: '10/100Mbps desktop unmanaged switch, durable metal chassis.',
  },
  {
    id: 'prod-002',
    sku: 'ACC-RJ45-CON',
    name: 'RJ45 Cat6 Gold-Plated Modular Connector',
    category: 'accessories',
    supplierBaseCostKES: 10,
    recommendedRetailKES: 20,
    targetMarginPercent: 50,
    supplierName: 'Siemon Kenya Channel Partner',
    unit: 'Piece',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Gold-plated 8P8C pass-through modular connector for high-speed Ethernet.',
  },
  {
    id: 'prod-003',
    sku: 'ACC-JUNC-BOX',
    name: 'Weatherproof CCTV Junction Box (100x100mm)',
    category: 'accessories',
    supplierBaseCostKES: 100,
    recommendedRetailKES: 180,
    targetMarginPercent: 44,
    supplierName: 'Metro Hardware & Plastics Hub',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'IP66 waterproof UV-stabilized camera mounting enclosure.',
  },
  {
    id: 'prod-004',
    sku: 'ACC-ADAPT-BOX',
    name: 'Camera Power Adapter Box (Updated Approved Cost)',
    category: 'accessories',
    supplierBaseCostKES: 150,
    recommendedRetailKES: 250,
    targetMarginPercent: 40,
    supplierName: 'Metro Hardware & Plastics Hub',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Molded fire-retardant wall junction adapter for CCTV power supply.',
  },
  {
    id: 'prod-005',
    sku: 'ACC-PWR-SUPPLY',
    name: '12V 5A Centralized Regulated Power Supply',
    category: 'power',
    supplierBaseCostKES: 1500,
    recommendedRetailKES: 2250,
    targetMarginPercent: 33,
    supplierName: 'Anker / MeanWell Kenya Direct',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Surge-protected multi-camera power transformer with fuse protection.',
  },

  // CCTV Surveillance
  {
    id: 'prod-006',
    sku: 'CAM-HIK-CV2',
    name: 'Hikvision 2MP ColorVu Full-Time Color Bullet Camera',
    category: 'cctv',
    supplierBaseCostKES: 2800,
    recommendedRetailKES: 4200,
    targetMarginPercent: 33,
    supplierName: 'Hikvision Kenya Authorized Hub',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'F1.0 super aperture, 24/7 colorful imaging, IP67 weatherproof.',
  },
  {
    id: 'prod-007',
    sku: 'CAM-HIK-ACU4',
    name: 'Hikvision 4MP AcuSense AI Turret Camera',
    category: 'cctv',
    supplierBaseCostKES: 5200,
    recommendedRetailKES: 7800,
    targetMarginPercent: 33,
    supplierName: 'Hikvision Kenya Authorized Hub',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Deep-learning human and vehicle target classification with built-in mic.',
  },
  {
    id: 'prod-008',
    sku: 'NVR-HIK-4CH',
    name: 'Hikvision 4-Channel 4K PoE Network Video Recorder',
    category: 'cctv',
    supplierBaseCostKES: 7500,
    recommendedRetailKES: 11000,
    targetMarginPercent: 32,
    supplierName: 'Hikvision Kenya Authorized Hub',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Plug-and-play PoE ports, H.265+ compression, HDMI 4K output.',
  },
  {
    id: 'prod-009',
    sku: 'NVR-HIK-8CH',
    name: 'Hikvision 8-Channel 4K PoE Network Video Recorder',
    category: 'cctv',
    supplierBaseCostKES: 12500,
    recommendedRetailKES: 18500,
    targetMarginPercent: 32,
    supplierName: 'Hikvision Kenya Authorized Hub',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: '8 independent PoE interfaces, dual SATA ports up to 20TB.',
  },
  {
    id: 'prod-010',
    sku: 'HDD-WD-PURP1',
    name: 'Western Digital 1TB Purple 24/7 Surveillance Hard Drive',
    category: 'cctv',
    supplierBaseCostKES: 5800,
    recommendedRetailKES: 8200,
    targetMarginPercent: 29,
    supplierName: 'Redington Kenya Distributor',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'AllFrame 4K technology, tuned for 24/7 continuous CCTV writing.',
  },
  {
    id: 'prod-011',
    sku: 'CAB-UTP-CAT6',
    name: 'Cat6 Pure Copper UTP Network Cable Roll (305m)',
    category: 'cables',
    supplierBaseCostKES: 7800,
    recommendedRetailKES: 11500,
    targetMarginPercent: 32,
    supplierName: 'D-Link / Siemon Regional Store',
    unit: 'Roll (305m)',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Solid 23 AWG pure copper conductors with HDPE insulation.',
  },

  // Solar & Energy Storage
  {
    id: 'prod-012',
    sku: 'INV-DEYE-5KW',
    name: 'Deye 5kW 48V Pure Sine Wave Hybrid Solar Inverter',
    category: 'solar',
    supplierBaseCostKES: 98000,
    recommendedRetailKES: 135000,
    targetMarginPercent: 27,
    supplierName: 'Total Solar Kenya Wholesale',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Dual MPPT, generator auto-start, Wi-Fi smart app dongle included.',
  },
  {
    id: 'prod-013',
    sku: 'BAT-PYLON-5KWH',
    name: 'Pylontech / Shoto 5.12kWh LiFePO4 Lithium Battery',
    category: 'solar',
    supplierBaseCostKES: 145000,
    recommendedRetailKES: 195000,
    targetMarginPercent: 26,
    supplierName: 'Enersys African Importers',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: '6,000 cycles at 90% DoD, 10-year design life, intelligent CAN-bus BMS.',
  },
  {
    id: 'prod-014',
    sku: 'PV-JINKO-550W',
    name: 'Jinko 550W Tiger Pro Monocrystalline Solar PV Panel',
    category: 'solar',
    supplierBaseCostKES: 10500,
    recommendedRetailKES: 14500,
    targetMarginPercent: 28,
    supplierName: 'Jinko Solar Kenya Partner',
    unit: 'Panel',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Half-cell 9BB technology with 21.5% module efficiency, 25-year linear warranty.',
  },

  // Networking & Wi-Fi
  {
    id: 'prod-015',
    sku: 'NET-WIFI6-AP',
    name: 'TP-Link Omada / UniFi Enterprise Wi-Fi 6 Access Point',
    category: 'networking',
    supplierBaseCostKES: 7500,
    recommendedRetailKES: 11000,
    targetMarginPercent: 32,
    supplierName: 'Redington Kenya Distributor',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'AX1800 Dual-Band Gigabit ceiling mount AP with PoE support.',
  },
  {
    id: 'prod-016',
    sku: 'NET-STARLINK-MT',
    name: 'Starlink Gen-3 Heavy Duty Roof Mount & Surge Kit',
    category: 'networking',
    supplierBaseCostKES: 8500,
    recommendedRetailKES: 13500,
    targetMarginPercent: 37,
    supplierName: 'HYNOVA Engineering Fab Lab',
    unit: 'Kit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Corrosion-resistant steel pole, lightning arrestor, shielded RJ45 surge.',
  },

  // Access Control & Smart Gates
  {
    id: 'prod-017',
    sku: 'ACC-ZK-BIO',
    name: 'ZKTeco K40 Biometric Fingerprint & RFID Access Terminal',
    category: 'access',
    supplierBaseCostKES: 11500,
    recommendedRetailKES: 16500,
    targetMarginPercent: 30,
    supplierName: 'ZKTeco East Africa Office',
    unit: 'Unit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Multi-biometric verification with battery backup and door lock relay.',
  },
  {
    id: 'prod-018',
    sku: 'ACC-GATE-600',
    name: 'Centurion D5-Evo Heavy-Duty Sliding Gate Motor Kit (600kg)',
    category: 'access',
    supplierBaseCostKES: 38000,
    recommendedRetailKES: 52000,
    targetMarginPercent: 27,
    supplierName: 'Centurion Systems Kenya',
    unit: 'Kit',
    stockStatus: 'In Stock',
    updatedAt: '2026-09-26',
    description: 'Battery-backed 12V DC motor, 4m steel rack, 2 Nova remotes included.',
  },
];

const STORAGE_KEY = 'hynova_product_cost_database_v1';

export class ProductCostDatabaseService {
  /**
   * Loads product costs from localStorage or defaults to baseline
   */
  static getProducts(): ProductCostItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load product database from localStorage:', e);
    }
    return INITIAL_PRODUCT_COST_DATABASE;
  }

  /**
   * Saves updated product database
   */
  static saveProducts(products: ProductCostItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save product database:', e);
    }
  }

  /**
   * Updates an individual product cost
   */
  static updateProductCost(id: string, updates: Partial<ProductCostItem>): ProductCostItem[] {
    const products = this.getProducts().map((p) => {
      if (p.id === id) {
        const updated = { ...p, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
        // Recalculate margin if base cost or retail changed
        if (updates.supplierBaseCostKES !== undefined || updates.recommendedRetailKES !== undefined) {
          const cost = updates.supplierBaseCostKES ?? p.supplierBaseCostKES;
          const retail = updates.recommendedRetailKES ?? p.recommendedRetailKES;
          updated.targetMarginPercent = retail > 0 ? Math.round(((retail - cost) / retail) * 100) : 0;
        }
        return updated;
      }
      return p;
    });
    this.saveProducts(products);
    return products;
  }

  /**
   * Adds a new product to the central catalog
   */
  static addProduct(product: Omit<ProductCostItem, 'id' | 'updatedAt'>): ProductCostItem[] {
    const newProduct: ProductCostItem = {
      ...product,
      id: `prod-${Date.now().toString(36)}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    const products = [newProduct, ...this.getProducts()];
    this.saveProducts(products);
    return products;
  }

  /**
   * Reset to initial approved database
   */
  static resetToDefault(): ProductCostItem[] {
    localStorage.removeItem(STORAGE_KEY);
    return INITIAL_PRODUCT_COST_DATABASE;
  }
}
