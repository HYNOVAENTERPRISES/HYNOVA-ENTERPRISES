import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Wifi, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  Building,
  Info,
  Layers,
  Check,
  KeyRound,
  Sliders,
  Cpu
} from 'lucide-react';
import { AppView } from '../types';

import closeupSolarInverter from '../assets/images/closeup_solar_inverter_1790065338536.jpg';
import closeupCctvCamera from '../assets/images/closeup_cctv_camera_1790065352386.jpg';
import closeupWifiRouter from '../assets/images/closeup_wifi_router_1790065374621.jpg';
import closeupSmartGate from '../assets/images/closeup_smart_gate_1790065406731.jpg';
import closeupSolarCells from '../assets/images/closeup_solar_cells_1790065420537.jpg';

interface PopularPackagesSectionProps {
  onNavigate: (view: AppView) => void;
  onSelectPackageForAI: (pkgName: string) => void;
  onOpenSiteSurvey?: (pkgName: string) => void;
}

export const PopularPackagesSection: React.FC<PopularPackagesSectionProps> = ({
  onNavigate,
  onSelectPackageForAI,
  onOpenSiteSurvey,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  // Operating Agreement Section 10: Approved Customer Packaging Model (Outcomes First)
  const packages = [
    {
      id: 'home-security-essential',
      category: 'security',
      title: 'Home Security Essential',
      badge: 'Bedsitters & Small Homes',
      startingPrice: 'Starting From KES 18,000+',
      outcome: 'Core perimeter detection and real-time smartphone viewing for apartments and small premises.',
      suitableFor: ['Apartments', 'Bedsitters', 'Small Homes', 'Small Shops'],
      image: closeupCctvCamera,
      imageAlt: 'ColorVu night vision CCTV camera lens and infrared sensor',
      icon: ShieldCheck,
      includes: [
        'HD ColorVu Night-Vision Cameras & Storage',
        'Surge-protected Power Supply & Weatherproof Junction Boxes',
        'Certified Technician On-Site Cabling & Setup',
        '1-Year Equipment & Workmanship Warranty',
      ],
      pricingNote: 'Subject to physical site survey. Excludes 16% VAT.',
    },
    {
      id: 'home-security-plus',
      category: 'security',
      title: 'Home Security Plus',
      badge: 'Most Popular Family Choice',
      startingPrice: 'Starting From KES 35,000+',
      outcome: 'Full-compound audio & optical coverage designed for family townhouses and busy retail stores.',
      suitableFor: ['Medium Homes', 'Retail Shops', 'Family Homes'],
      image: closeupCctvCamera,
      imageAlt: 'High-definition AI CCTV surveillance camera',
      icon: ShieldCheck,
      includes: [
        'Multi-channel Full-Color AI Night Surveillance with Audio',
        'Central PoE NVR & WD Purple 24/7 Hard Drive',
        'Concealed PVC Trunking & High-Grade Copper Cabling',
        'Multi-User Smartphone Remote Viewing & Training',
      ],
      pricingNote: 'Subject to physical site survey. Excludes 16% VAT.',
    },
    {
      id: 'home-security-pro',
      category: 'security',
      title: 'Home Security Pro',
      badge: 'Estate & Large Compounds',
      startingPrice: 'Starting From KES 70,000+',
      outcome: 'AcuSense AI edge classification with active strobe deterrence and blackout battery immunity.',
      suitableFor: ['Large Homes', 'Business Premises', 'Compounds'],
      image: closeupCctvCamera,
      imageAlt: 'Enterprise perimeter security optical chassis',
      icon: ShieldCheck,
      includes: [
        'AcuSense Edge AI Human & Vehicle Perimeter Classification',
        'Long-Range Strobe & Siren Active Audio Deterrence',
        'Redundant Battery Power Backup for Blackout Immunity',
        'EPRA & NCA Certified Master Engineer Deployment',
      ],
      pricingNote: 'Subject to physical site survey. Excludes 16% VAT.',
    },
    {
      id: 'sme-security-package',
      category: 'business',
      title: 'SME Security Package',
      badge: 'Retail & Commercial Operations',
      startingPrice: 'Starting From KES 50,000+',
      outcome: 'Multi-zone optical monitoring, cashier point security, and priority commercial SLA coverage.',
      suitableFor: ['Offices', 'Restaurants', 'Salons', 'Clinics', 'Retail Businesses'],
      image: closeupCctvCamera,
      imageAlt: 'Commercial multi-zone surveillance system',
      icon: Building2,
      includes: [
        'Commercial Multi-Zone 4K Ultra-HD Surveillance',
        'Staff Cashier Point Optical Zoom & Audio Recording',
        'Rack-Mounted Central Video Storage & Cloud Mirroring',
        'Priority 24/7 SLA Technical Support Coverage',
      ],
      pricingNote: 'Subject to physical site survey. Excludes 16% VAT.',
    },
    {
      id: 'home-networking',
      category: 'networking',
      title: 'Home Networking',
      badge: 'Fast Gigabit Mesh',
      startingPrice: 'Starting From KES 8,000+',
      outcome: 'Zero-dead-zone whole-home Wi-Fi 6 coverage engineered for thick masonry and multiple storeys.',
      suitableFor: ['Apartments', 'Residences', 'Small Offices'],
      image: closeupWifiRouter,
      imageAlt: 'Gigabit dual-band enterprise Wi-Fi router',
      icon: Wifi,
      includes: [
        'Gigabit Dual-Band Wi-Fi 6 Router / Access Point',
        'Cat6 Pure Copper Structured Cabling & RJ45 Termination',
        'Zero-Dead-Zone Signal Calibration & Optimization',
        '1-Year Equipment & Workmanship Guarantee',
      ],
      pricingNote: 'Subject to physical site survey. Excludes 16% VAT.',
    },
    {
      id: 'business-networking',
      category: 'networking',
      title: 'Business Networking',
      badge: 'Enterprise Multi-WAN',
      startingPrice: 'Starting From KES 25,000+',
      outcome: 'Seamless commercial mesh, guest captive portals, and automated Starlink/fiber failover.',
      suitableFor: ['Offices', 'Restaurants', 'Salons', 'Hospitality', 'Retail'],
      image: closeupWifiRouter,
      imageAlt: 'Enterprise network patch rack and Wi-Fi access point',
      icon: Wifi,
      includes: [
        'Managed Gigabit PoE Switch Architecture & Patch Panel',
        'Enterprise Mesh Wi-Fi 6 APs with Seamless Roaming',
        'Staff vs. Guest VLAN Traffic Isolation & Bandwidth Control',
        'Starlink / Multi-WAN Load Balancing Failover Setup',
      ],
      pricingNote: 'Subject to physical site survey. Excludes 16% VAT.',
    },
    {
      id: 'access-control',
      category: 'access',
      title: 'Access Control',
      badge: 'Smart Gates & Biometrics',
      startingPrice: 'Starting From KES 20,000+',
      outcome: 'Automated sliding/swing motor gates, biometric time attendance, and smartphone remote unlocking.',
      suitableFor: ['Commercial Gates', 'Biometric Office Doors', 'Estate Turnstiles', 'Residential Gates'],
      image: closeupSmartGate,
      imageAlt: 'Biometric fingerprint reader and electronic magnetic door lock',
      icon: KeyRound,
      includes: [
        'Heavy-Duty Magnetic Locks (600lbs) & Biometric Reader',
        'Centurion / BFT Smart Sliding or Swing Gate Motor Integration',
        'Emergency Break-Glass Unit & Power Backup Supply',
        'Smartphone App Remote Unlock & Intercom Audio Pairing',
      ],
      pricingNote: 'Subject to physical site survey. Excludes 16% VAT.',
    },
    {
      id: 'enterprise-security',
      category: 'business',
      title: 'Enterprise Security',
      badge: 'Campuses & Warehouses',
      startingPrice: 'Custom Quote',
      outcome: 'Multi-site automated number plate recognition (ANPR), control rooms, and optical fiber loops.',
      suitableFor: ['Warehouses', 'Campuses', 'Multi-Site Facilities', 'Gated Communities', 'Logistics Yards'],
      image: closeupCctvCamera,
      imageAlt: 'Industrial radar and perimeter video wall sensors',
      icon: Building,
      includes: [
        'ANPR Automatic Number Plate Recognition & Speed Radar',
        'Thermal Perimeter Breach Sensors & Control Room Video Wall',
        'Fiber Optic Ring Distribution & Industrial Surge Suppression',
        'Dedicated Project Engineer & Custom SLA Maintenance Contract',
      ],
      pricingNote: 'Physical campus survey and architectural review required.',
    },
    {
      id: 'smart-infrastructure',
      category: 'smart',
      title: 'Smart Infrastructure',
      badge: 'Turnkey Solar & BMS',
      startingPrice: 'Custom Quote',
      outcome: 'Hybrid solar microgrids, LiFePO4 storage, smart submetering, and automated water tank telemetry.',
      suitableFor: ['Apartment Blocks', 'Modern Smart Homes', 'Property Developers', 'Institutions'],
      image: closeupSolarInverter,
      imageAlt: 'Pure sine wave hybrid solar inverter and lithium storage battery',
      icon: Sun,
      includes: [
        'Hybrid Solar Microgrid & LiFePO4 Lithium Storage Integration',
        'Ultrasonic Water Tank Telemetry & Automated Pump Controllers',
        'Smart Submetering & Tenant Billing Automation',
        'Integrated Building Management Dashboard (BMS)',
      ],
      pricingNote: 'Custom engineering quotation following physical site survey.',
    },
  ];

  const filteredPackages = selectedFilter === 'all' 
    ? packages 
    : packages.filter(p => p.category === selectedFilter);

  return (
    <section className="py-20 bg-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
            Operating Agreement Section 10
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] mt-3 mb-3 tracking-tight">
            Outcome-Based Infrastructure Packages
          </h2>
          <p className="text-[#5C4D50] text-base sm:text-lg">
            Customers purchase outcomes. HYNOVA coordinates delivery. Transparent starting baselines across all 47 counties of Kenya.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {[
            { id: 'all', label: 'All Packages (9 Outcomes)' },
            { id: 'security', label: 'Home Security (3 Tiers)' },
            { id: 'business', label: 'SME & Enterprise' },
            { id: 'networking', label: 'Networking & Wi-Fi' },
            { id: 'access', label: 'Access Control & Gates' },
            { id: 'smart', label: 'Smart Infrastructure & Solar' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-[#C01E25] text-white shadow-sm shadow-[#C01E25]/25'
                  : 'bg-[#EEECEC] text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#F0C9CB]/40'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 9 Approved Outcome Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPackages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <div
                key={pkg.id}
                id={`pkg-card-${pkg.id}`}
                className="bg-[#FFFFFF] rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all hover:shadow-lg flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image Banner */}
                  <div className="relative w-full h-44 overflow-hidden bg-black/5">
                    <img
                      src={pkg.image}
                      alt={pkg.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    <div className="absolute top-3 left-3">
                      <span className="text-[11px] font-extrabold text-white bg-[#C01E25] px-2.5 py-1 rounded-lg shadow-sm">
                        {pkg.badge}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-lg font-black tracking-tight leading-tight">{pkg.title}</h3>
                      <div className="text-xs font-extrabold text-[#F0C9CB] mt-0.5 font-mono">
                        {pkg.startingPrice}
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-[#5C4D50] leading-relaxed">
                      {pkg.outcome}
                    </p>

                    {/* Suitable For */}
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7B7F] block mb-1">
                        Suitable For
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.suitableFor.map((item, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium bg-[#EEECEC] text-[#1E1B1C] px-2 py-0.5 rounded-md"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Scope Items */}
                    <div className="space-y-1.5 pt-2 border-t border-[#EEECEC]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7B7F] block">
                        Included Outcome Scope
                      </span>
                      {pkg.includes.map((inc, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#1E1B1C]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25] shrink-0 mt-0.5" />
                          <span className="leading-tight">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-6 pt-0 space-y-2">
                  <div className="text-[10px] text-[#8F7B7F] font-medium italic mb-2">
                    {pkg.pricingNote}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        onSelectPackageForAI(pkg.title);
                        onNavigate('ai-recommendation');
                      }}
                      className="w-full text-xs font-extrabold text-[#FFFFFF] bg-[#C01E25] hover:bg-[#a1181e] py-2.5 px-3 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-sm shadow-[#C01E25]/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Size Now</span>
                    </button>

                    <button
                      onClick={() => {
                        if (onOpenSiteSurvey) {
                          onOpenSiteSurvey(pkg.title);
                        } else {
                          onSelectPackageForAI(pkg.title);
                          onNavigate('ai-recommendation');
                        }
                      }}
                      className="w-full text-xs font-bold text-[#1E1B1C] bg-[#EEECEC] hover:bg-[#e2e0e0] py-2.5 px-2 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <span>Book Survey</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VAT & Pricing Transparency Notice (Operating Agreement Section 5 & 7) */}
        <div className="bg-[#EEECEC]/40 rounded-3xl p-6 sm:p-8 border border-[#EEECEC] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-xs text-[#5C4D50] max-w-2xl">
            <div className="flex items-center gap-2 font-black text-[#1E1B1C] text-sm">
              <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
              <span>HYNOVA Pricing & Kenyan Tax Compliance Formula</span>
            </div>
            <p>
              Formula: <strong>(Equipment + Technician Labor + Travel + Installation + Workmanship Warranty + Platform Margin) + VAT (16%) = Customer Price</strong>.
            </p>
            <p>
              Every quotation clearly itemizes Subtotal, 16% VAT, and Total Payable. No hidden broker markups or surprise charges.
            </p>
          </div>

          <button
            onClick={() => onNavigate('ai-recommendation')}
            className="shrink-0 bg-[#1E1B1C] hover:bg-[#332f30] text-[#FFFFFF] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#C01E25]" />
            <span>Open Sizing Engine</span>
          </button>
        </div>
      </div>
    </section>
  );
};
