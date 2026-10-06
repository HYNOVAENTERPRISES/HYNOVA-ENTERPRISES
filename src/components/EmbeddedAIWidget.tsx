import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Coins, 
  CheckCircle2, 
  MessageCircle, 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  RotateCcw,
  Zap,
  Building,
  Home,
  GraduationCap,
  Landmark,
  Building2,
  Phone,
  User,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Navigation,
  Receipt
} from 'lucide-react';
import { KENYAN_COUNTIES } from '../data/mockData';
import { AppView, HynovaLocationRecord } from '../types';
import { GoogleMapsEngineService } from '../services/googleMapsEngine';
import { calculateVatBreakdown } from '../data/pricingEngine';
import { SiteSurveyModal } from './SiteSurveyModal';
import { GoogleMapsLocationPicker } from './GoogleMapsLocationPicker';

interface EmbeddedAIWidgetProps {
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
  onNavigate: (view: AppView) => void;
  initialPrompt?: string;
  onOpenLoginModal?: () => void;
  onOpenContactModal?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
}

export type PropertyCategory = 'Home' | 'Business' | 'School' | 'Institution' | 'Property';

export const EmbeddedAIWidget: React.FC<EmbeddedAIWidgetProps> = ({
  selectedCounty,
  onSelectCounty,
  onNavigate,
  initialPrompt,
  onOpenLoginModal,
  onOpenContactModal,
  isExpanded,
  onToggleExpand,
}) => {
  // Mobile collapse state
  const [internalExpanded, setInternalExpanded] = useState<boolean>(false);
  const isMobileExpanded = isExpanded !== undefined ? isExpanded : internalExpanded;

  const toggleMobileExpanded = (val: boolean) => {
    setInternalExpanded(val);
    if (onToggleExpand) {
      onToggleExpand(val);
    }
  };

  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // 4 Core Questions:
  // Q1: What do you need?
  const [needCategory, setNeedCategory] = useState<string>('Solar Power & Blackout Backup');
  const [specificDetails, setSpecificDetails] = useState<string>(initialPrompt || '');

  // Auto-expand if initialPrompt is provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      setSpecificDetails(initialPrompt);
      toggleMobileExpanded(true);
    }
  }, [initialPrompt]);

  // Q2: Where are you located? (Google Maps Precise Location Pinning)
  const [location, setLocation] = useState<string>(selectedCounty || 'Nairobi County');
  const [locationRecord, setLocationRecord] = useState<HynovaLocationRecord | null>(null);

  // Q3: What is your budget range?
  const [budgetRange, setBudgetRange] = useState<string>('Standard: KES 50,001 – 150,000');
  const [budgetKES, setBudgetKES] = useState<number>(100000);

  // Q4: Property Type: Home, Business, School, Institution, Property?
  const [propertyType, setPropertyType] = useState<PropertyCategory>('Home');

  // Generation & Lead state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);

  // Lead capture state after generation
  const [leadName, setLeadName] = useState<string>('');
  const [leadPhone, setLeadPhone] = useState<string>('');
  const [leadSubmitted, setLeadSubmitted] = useState<boolean>(false);

  // 1. Need options
  const needOptions = [
    { label: 'Solar Power & Blackout Backup', icon: Zap },
    { label: 'CCTV & Perimeter Security', icon: ShieldCheck },
    { label: 'Starlink & Enterprise Wi-Fi', icon: Sparkles },
    { label: 'Electric Gate & Biometrics', icon: Wrench },
    { label: 'Smart Building & Automation', icon: Building2 },
  ];

  // 3. Official HYNOVA Budget Categories
  const budgetOptions = [
    { label: 'Starter: KES 5,000 – 20,000', approx: 15000, desc: 'Diagnostics, entry devices & phased setup' },
    { label: 'Essential: KES 20,001 – 50,000', approx: 35000, desc: 'Basic home & small business solutions' },
    { label: 'Standard: KES 50,001 – 150,000', approx: 100000, desc: 'Most home, office & SME deployments' },
    { label: 'Professional: KES 150,001 – 500,000', approx: 280000, desc: 'Larger properties, solar & automation' },
    { label: 'Enterprise: KES 500,001+', approx: 750000, desc: 'Schools, institutions & infrastructure' },
  ];

  // 4. Property type options: Home, Business, School, Institution, Property
  const propertyOptions: { type: PropertyCategory; label: string; icon: any }[] = [
    { type: 'Home', label: 'Home', icon: Home },
    { type: 'Business', label: 'Business', icon: Building },
    { type: 'School', label: 'School', icon: GraduationCap },
    { type: 'Institution', label: 'Institution', icon: Landmark },
    { type: 'Property', label: 'Property', icon: Building2 },
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    toggleMobileExpanded(true);

    setTimeout(() => {
      // Dynamic tailored recommendation based on the 4 answers
      let title = '';
      let hardwareItems: { name: string; brand: string; qty: number; cost: number }[] = [];
      let installationCost = Math.round(budgetKES * 0.14);
      let timeline = '1 - 2 Business Days';
      let summary = '';
      let affordabilityPromise = "Let's start with what you have and build from there.";
      let phasedRoadmap: any = null;

      if (budgetKES <= 20000) {
        installationCost = Math.round(budgetKES * 0.22);
        timeline = 'Same Day / 1 Business Day';
        if (budgetKES <= 10000) {
          affordabilityPromise = "Based on your budget, we can recommend several starting options and improvements that move you closer to your goal. As your needs grow, HYNOVA can help you expand your solution in phases.";
        } else {
          affordabilityPromise = "We can recommend an entry level security, networking, smart home, or automation solution that fits your current budget while leaving room for future upgrades.";
        }

        if (needCategory.includes('Solar')) {
          title = `${propertyType} Starter Critical Load Backup & Surge Protection`;
          summary = `Let's start with what you have and build from there. Practical entry-level power solution protecting your router, phones, and emergency lights during KPLC cuts in ${location}.`;
          hardwareItems = [
            { name: 'Smart Router Mini-UPS Backup (4–8 hrs battery runtime)', brand: 'Gizzu / Marsriva', qty: 1, cost: 6500 },
            { name: 'Heavy-Duty AC Surge & Voltage Spike Isolator Box', brand: 'Schneider Electric / Sollatek', qty: 1, cost: 4200 },
            { name: 'Certified Electrical DB Diagnostic & Safety Audit', brand: 'HYNOVA Verified', qty: 1, cost: 2500 },
          ];
        } else if (needCategory.includes('CCTV') || needCategory.includes('Security')) {
          title = `${propertyType} Starter 2K Smart Wi-Fi Perimeter Monitoring`;
          summary = `Let's start with what you have and build from there. Instant 24/7 eyes on your entrance with smartphone alerts and certified technician setup in ${location}.`;
          hardwareItems = [
            { name: '2K ColorVu Smart Wi-Fi Camera (Human Detection & Two-Way Audio)', brand: 'Hikvision / Ezviz', qty: 1, cost: 7500 },
            { name: 'Weatherproof Junction Enclosure & Surge Protected Power Adapter', brand: 'Schneider Electric', qty: 1, cost: 2800 },
            { name: 'On-Site Mounting, Mobile Pairing & Security Coverage Audit', brand: 'HYNOVA Verified', qty: 1, cost: 3200 },
          ];
        } else {
          title = `${propertyType} Starter High-Gain Wi-Fi Extension & Backbone Run`;
          summary = `Let's start with what you have and build from there. Eliminates dead spots in your primary work area with pure copper Cat6 cabling and expert Wi-Fi tuning in ${location}.`;
          hardwareItems = [
            { name: 'Dual-Band Gigabit Wi-Fi Access Point / Extender', brand: 'TP-Link / Ruijie', qty: 1, cost: 6800 },
            { name: 'Pure Copper Cat6 Trunked Cable Run (30m)', brand: 'D-Link / Siemon', qty: 1, cost: 3800 },
            { name: 'Spectrum Diagnostic & Channel Optimization', brand: 'HYNOVA Verified', qty: 1, cost: 2500 },
          ];
        }

        phasedRoadmap = {
          achievedToday: [
            'Practical entry-level hardware setup protecting your core priority asset',
            'Certified technician on-site inspection and safety diagnostic',
            'Smartphone monitoring app setup and 1-Year Workmanship Warranty activation',
          ],
          phasedApproach: [
            'Phase 1 (Today): Entry-level solution protecting core priority (KES 5k – 20k)',
            'Phase 2: Scale up to multi-device surveillance or 1.5kVA inverter (KES 25k – 45k)',
            'Phase 3: Deploy rooftop solar panels or smart gate automation (KES 50k+)',
          ],
          futureUpgrades: [
            'Central recording / storage expansion',
            'LiFePO4 Lithium battery module',
            'Multi-zone automated perimeter alarms',
          ],
          costEffectiveSummary: 'The most cost-effective path forward for your current situation — zero stranded capital as every item connects into future expansions.',
        };
      } else if (needCategory.includes('Solar')) {
        if (budgetKES <= 90000) {
          title = `${propertyType} Essential 1.5kVA Solar Inverter & Gel Backup`;
          summary = `Designed for ${propertyType.toLowerCase()} loads in ${location}: continuous lighting, Wi-Fi router, laptops, TV, and phone charging during KPLC blackouts.`;
          hardwareItems = [
            { name: '1.5kVA Pure Sine Wave Inverter/Charger', brand: 'Must Solar / Growatt', qty: 1, cost: 38000 },
            { name: '150Ah 12V Deep-Cycle Solar Battery', brand: 'Chloride Exide', qty: 1, cost: 28000 },
            { name: 'DC Surge Protection & Changeover Switch', brand: 'Schneider Electric', qty: 1, cost: 6500 },
          ];
        } else if (budgetKES <= 250000) {
          title = `${propertyType} 3.5kVA Hybrid Solar System with Lithium Storage`;
          summary = `Optimized for ${propertyType.toLowerCase()}s in ${location}. Powers fridges, multiple computers, CCTV, water booster pump, and entertainment continuously.`;
          hardwareItems = [
            { name: '3.5kVA 24V Smart Hybrid Inverter (WiFi)', brand: 'Deye / Growatt', qty: 1, cost: 72000 },
            { name: '2.5kWh 24V LiFePO4 Lithium Battery (6000 cycles)', brand: 'Felicity Solar', qty: 1, cost: 84000 },
            { name: '550W Tier-1 Monocrystalline Solar Panels', brand: 'Jinko Solar', qty: 4, cost: 44000 },
            { name: 'Dual Protection AC/DC Breaker Distribution Box', brand: 'ABB / Chint', qty: 1, cost: 12000 },
          ];
        } else {
          title = `${propertyType} High-Capacity 5kW - 8kW Hybrid Solar & 5kWh Lithium`;
          summary = `Heavy-duty uninterrupted power for ${propertyType.toLowerCase()} infrastructure in ${location}, zero diesel generator noise.`;
          hardwareItems = [
            { name: '5.0kVA 48V Pure Hybrid Dual-MPPT Inverter', brand: 'Deye / Victron', qty: 1, cost: 135000 },
            { name: '5.12kWh 48V Wall-Mount Lithium LiFePO4 Battery', brand: 'Deye / Shoto', qty: 1, cost: 165000 },
            { name: '585W N-Type High Efficiency Solar Panels', brand: 'Jinko Solar', qty: 8, cost: 96000 },
            { name: 'Smart Energy Meter & Cloud Remote Telemetry', brand: 'Eastron / Deye', qty: 1, cost: 14000 },
          ];
        }
      } else if (needCategory.includes('CCTV') || needCategory.includes('Security')) {
        title = `${propertyType} 8-Camera Smart Perimeter ColorVu Surveillance System`;
        summary = `Ultra-clear 24/7 color night vision with human & vehicle perimeter detection, siren trigger, and smartphone remote viewing in ${location}.`;
        hardwareItems = [
          { name: '8-Channel 4K AcuSense Network Video Recorder', brand: 'Hikvision', qty: 1, cost: 24000 },
          { name: '5MP 24/7 ColorVu Audio Fixed Turret IP Cameras', brand: 'Hikvision', qty: 6, cost: 42000 },
          { name: '4TB Surveillance-Grade Purple Hard Drive', brand: 'Western Digital', qty: 1, cost: 18500 },
          { name: 'Outdoor Cat6 UV-Shielded Solid Copper Cable (305m)', brand: 'D-Link / Siemon', qty: 1, cost: 16000 },
        ];
      } else {
        title = `${propertyType} High-Speed Starlink & Enterprise Wi-Fi 6 Mesh`;
        summary = `Zero dead zones for ${propertyType.toLowerCase()} operations in ${location}. Seamless handoff and guest portal isolation.`;
        hardwareItems = [
          { name: 'Starlink Gen 3 Standard Actuated Kit & Roof Mount', brand: 'Starlink', qty: 1, cost: 45000 },
          { name: 'UniFi 6 Pro Dual-Band Gigabit Ceiling APs', brand: 'Ubiquiti', qty: 3, cost: 63000 },
          { name: '8-Port Gigabit PoE+ Managed Switch', brand: 'Ubiquiti / TP-Link', qty: 1, cost: 19000 },
          { name: 'Cloud Gateway Max Router & Firewall', brand: 'Ubiquiti', qty: 1, cost: 28000 },
        ];
      }

      const totalHardware = hardwareItems.reduce((acc, it) => acc + it.cost, 0);
      const totalKES = totalHardware + installationCost;

      setRecommendation({
        title,
        summary,
        totalKES,
        hardwareTotalKES: totalHardware,
        installationKES: installationCost,
        timeline,
        hardwareItems,
        location,
        propertyType,
        needCategory,
        affordabilityPromise,
        phasedRoadmap,
      });

      setIsGenerating(false);
    }, 650);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSubmitted(true);
  };

  const handleWhatsAppConsult = () => {
    const text = encodeURIComponent(
      `Jambo HYNOVA! I received a sizing recommendation for my ${propertyType} in ${location}: "${recommendation?.title}" with an estimated budget of KES ${recommendation?.totalKES.toLocaleString()}. I would like to speak with a technical advisor.`
    );
    window.open(`https://wa.me/254727547310?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="ai-recommendation-section" className="py-16 bg-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0C9CB]/40 text-xs font-bold text-[#C01E25] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#C01E25]" />
            <span>Instant Solution Advisor</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#1E1B1C] tracking-tight">
            Get Your Tailored Recommendation
          </h2>
          <p className="text-xs sm:text-base text-[#5C4D50] mt-2">
            Answer 4 quick questions. Receive an itemized turnkey recommendation with transparent Kenya pricing.
          </p>
        </div>

        {/* MOBILE COLLAPSED CARD (Visible on mobile when collapsed & no recommendation) */}
        {!recommendation && !isMobileExpanded && (
          <div className="sm:hidden bg-[#FFFFFF] border-2 border-[#DB7D81]/40 rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in-50">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F0C9CB]/50 text-[#C01E25] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full">
                      Instant Sizing
                    </span>
                    <span className="text-[10px] font-bold text-[#5C4D50]">
                      4 Questions • 30s
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#1E1B1C] mt-0.5">
                    Instant Sizing & Cost Calculator
                  </h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#5C4D50] leading-relaxed">
              Get an itemized equipment bill of materials, certified technician labor, and 2026 Kenyan market project ranges.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-[#1E1B1C]">
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#EEECEC]/60">
                <Zap className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                <span className="truncate">Solar & Backup</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#EEECEC]/60">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                <span className="truncate">CCTV & Security</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#EEECEC]/60">
                <Sparkles className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                <span className="truncate">Starlink Wi-Fi</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-[#EEECEC]/60">
                <Wrench className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                <span className="truncate">Gate Automation</span>
              </div>
            </div>

            <button
              type="button"
              id="expand-mobile-ai-sizing-btn"
              onClick={() => toggleMobileExpanded(true)}
              className="w-full min-h-[46px] py-3 px-4 rounded-2xl bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-black flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Open Sizing Tool (4 Questions)</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* The 4-Question Container */}
        {!recommendation ? (
          <div className={isMobileExpanded ? 'block' : 'hidden sm:block'}>
            <form onSubmit={handleGenerate} className="bg-[#FFFFFF] border border-[#DB7D81]/40 rounded-3xl shadow-xl shadow-[#C01E25]/5 p-6 sm:p-10 space-y-8 animate-in fade-in-50">
              
              {/* Mobile Collapse Header */}
              <div className="sm:hidden flex items-center justify-between pb-3 border-b border-[#EEECEC]">
                <div className="flex items-center gap-1.5 text-xs font-black text-[#1E1B1C]">
                  <Sparkles className="w-3.5 h-3.5 text-[#C01E25]" />
                  <span>Quick Sizing Questionnaire</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleMobileExpanded(false)}
                  className="text-[11px] font-bold text-[#5C4D50] hover:text-[#C01E25] flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EEECEC] hover:bg-[#F0C9CB]/40 transition-colors cursor-pointer"
                >
                  <span>Collapse</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
            
            {/* QUESTION 1: What do you need? */}
            <div className="space-y-3">
              <label className="text-sm sm:text-base font-extrabold text-[#1E1B1C] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C01E25] text-white text-xs flex items-center justify-center font-bold">1</span>
                <span>What do you need?</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {needOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = needCategory === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setNeedCategory(opt.label)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer min-h-[52px] ${
                        isSelected
                          ? 'border-[#C01E25] bg-[#F0C9CB]/30 text-[#C01E25] font-bold shadow-xs'
                          : 'border-[#EEECEC] text-[#5C4D50] hover:bg-[#EEECEC]/40 hover:text-[#1E1B1C]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#C01E25]' : 'text-[#8F7B7F]'}`} />
                      <span className="text-xs sm:text-sm">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Optional brief details */}
              <input
                type="text"
                value={specificDetails}
                onChange={(e) => setSpecificDetails(e.target.value)}
                placeholder="Optional details (e.g. 4-bedroom house, 6 cameras, water pump...)"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20 text-[#1E1B1C]"
              />
            </div>

            {/* QUESTION 2: Where are you located? (Google Maps Precise Location Pinning) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-sm sm:text-base font-extrabold text-[#1E1B1C] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C01E25] text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Where is your installation located?</span>
                </label>
                {locationRecord && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 self-start sm:self-auto">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{locationRecord.confidenceLabel}</span>
                  </span>
                )}
              </div>

              <GoogleMapsLocationPicker
                initialCounty={location}
                requiredSpecialty={needCategory}
                showRecipientToggle={true}
                title="Pin Installation Location on Google Map"
                subtitle="Step 1: Select your county & sub-county. Step 2: Drop your exact rooftop or gate pin."
                onLocationChange={(loc) => {
                  setLocationRecord(loc);
                  setLocation(loc.county.replace(/County/i, '').trim());
                  onSelectCounty(loc.county);
                }}
                onLocationConfirmed={(loc) => {
                  setLocationRecord(loc);
                  setLocation(loc.county.replace(/County/i, '').trim());
                  onSelectCounty(loc.county);
                }}
              />
            </div>

            {/* QUESTION 3: What is your budget range? */}
            <div className="space-y-3">
              <label className="text-sm sm:text-base font-extrabold text-[#1E1B1C] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C01E25] text-white text-xs flex items-center justify-center font-bold">3</span>
                <span>What is your budget range?</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {budgetOptions.map((b) => {
                  const isSel = budgetRange === b.label;
                  return (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => {
                        setBudgetRange(b.label);
                        setBudgetKES(b.approx);
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[40px] ${
                        isSel
                          ? 'border-[#C01E25] bg-[#C01E25] text-white shadow-xs'
                          : 'border-[#EEECEC] text-[#5C4D50] hover:bg-[#EEECEC]/60'
                      }`}
                    >
                      {b.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUESTION 4: Home, Business, School, Institution, Property? */}
            <div className="space-y-3">
              <label className="text-sm sm:text-base font-extrabold text-[#1E1B1C] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C01E25] text-white text-xs flex items-center justify-center font-bold">4</span>
                <span>Home, Business, School, Institution, Property?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {propertyOptions.map((p) => {
                  const Icon = p.icon;
                  const isSel = propertyType === p.type;
                  return (
                    <button
                      key={p.type}
                      type="button"
                      onClick={() => setPropertyType(p.type)}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[64px] ${
                        isSel
                          ? 'border-[#C01E25] bg-[#F0C9CB]/30 text-[#C01E25] font-black'
                          : 'border-[#EEECEC] text-[#5C4D50] hover:bg-[#EEECEC]/40'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-bold">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-4 rounded-2xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-black text-base shadow-lg shadow-[#C01E25]/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer min-h-[52px]"
              >
                <Sparkles className="w-5 h-5" />
                <span>{isGenerating ? 'Analyzing Requirements...' : 'Generate Recommended Solution'}</span>
              </button>
              <div className="flex items-center justify-center gap-4 text-xs text-[#5C4D50] mt-3">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25]" />
                  Instant Hardware Sizing
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                  M-Pesa Escrow Protection
                </span>
              </div>
            </div>

            {/* Mobile Bottom Collapse Option */}
            <div className="sm:hidden pt-2 text-center border-t border-[#EEECEC]">
              <button
                type="button"
                onClick={() => {
                  toggleMobileExpanded(false);
                  document.getElementById('ai-recommendation-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-xs font-bold text-[#8F7B7F] hover:text-[#C01E25] inline-flex items-center gap-1 py-2 px-3 rounded-lg hover:bg-[#EEECEC] transition-colors cursor-pointer"
              >
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Collapse Sizing Tool</span>
              </button>
            </div>
          </form>
        </div>
        ) : (
          /* GENERATED RECOMMENDATION RESULT VIEW */
          <div className="bg-[#FFFFFF] border border-[#C01E25] rounded-3xl shadow-2xl shadow-[#C01E25]/10 p-6 sm:p-10 space-y-8 animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#EEECEC]">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                    Recommended Solution
                  </span>
                  <span className="text-xs text-[#5C4D50] font-semibold">{recommendation.location}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#1E1B1C]">
                  {recommendation.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#5C4D50] mt-1.5 max-w-xl">
                  {recommendation.summary}
                </p>
              </div>

              <button
                onClick={() => setRecommendation(null)}
                className="self-start text-xs font-bold text-[#5C4D50] hover:text-[#C01E25] flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#EEECEC] hover:bg-[#EEECEC] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Adjust Answers</span>
              </button>
            </div>

            {/* Pricing Breakdown & Estimated Project Range */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                <span className="text-[11px] font-bold text-[#5C4D50] uppercase block mb-1">Equipment Range</span>
                <span className="text-base sm:text-lg font-black text-[#1E1B1C]">
                  KES {Math.round(recommendation.hardwareTotalKES * 0.92).toLocaleString()} – {Math.round(recommendation.hardwareTotalKES * 1.08).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#8F7B7F] block">Genuine Bonded Inventory</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                <span className="text-[11px] font-bold text-[#5C4D50] uppercase block mb-1">Certified Labor & Travel</span>
                <span className="text-base sm:text-lg font-black text-[#1E1B1C]">
                  KES {Math.round(recommendation.installationKES * 0.9).toLocaleString()} – {Math.round(recommendation.installationKES * 1.18).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#8F7B7F] block">EPRA / NCA Vetted Engineer</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F0C9CB]/30 border border-[#C01E25]">
                <span className="text-[11px] font-bold text-[#C01E25] uppercase block mb-1">Typical Project Range</span>
                <span className="text-base sm:text-lg font-black text-[#C01E25]">
                  KES {Math.round(recommendation.totalKES * 0.9).toLocaleString()} – {Math.round(recommendation.totalKES * 1.12).toLocaleString()}
                </span>
                <span className="text-[10px] text-[#C01E25] font-semibold block">Protected in M-Pesa Escrow</span>
              </div>
            </div>

            {/* HYNOVA Affordability Promise & Phased Roadmap */}
            {recommendation.affordabilityPromise && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F0C9CB]/35 via-white to-[#EEECEC]/50 border-2 border-[#DB7D81]/50 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-[#DB7D81]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#C01E25]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                      HYNOVA Affordability Promise
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#C01E25] bg-white px-2 py-0.5 rounded-full border border-[#DB7D81]/40">
                    Accessible Tech
                  </span>
                </div>

                <div className="bg-white/80 p-3 rounded-xl border border-[#DB7D81]/30 text-xs sm:text-sm font-bold text-[#C01E25] leading-relaxed">
                  "{recommendation.affordabilityPromise}"
                </div>

                {recommendation.phasedRoadmap && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#128C7E] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>1. Realistically Achieved Today</span>
                      </span>
                      <ul className="space-y-1 text-[11px] text-[#5C4D50]">
                        {recommendation.phasedRoadmap.achievedToday.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-[#128C7E] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#C01E25] flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" />
                        <span>2. Phased Path & Upgrades</span>
                      </span>
                      <ul className="space-y-1 text-[11px] text-[#5C4D50]">
                        {recommendation.phasedRoadmap.phasedApproach.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-[#C01E25] font-bold">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-[#8F7B7F] italic">
                  * Technology should not be reserved for large budgets. HYNOVA helps you start where you are, while creating a clear path toward where you want to go.
                </div>
              </div>
            )}

            {/* Site Inspection Notice */}
            <div className="p-3.5 rounded-2xl bg-[#EEECEC]/50 border border-[#DB7D81]/40 text-xs text-[#5C4D50] leading-relaxed">
              <strong className="text-[#1E1B1C]">Pricing Transparency Note: </strong>
              All figures represent market-based estimated project ranges. HYNOVA never displays guaranteed final prices before physical on-site inspection, roof orientation audit, and cable run verification.
            </div>

            {/* Operating Agreement Section 5: Kenyan VAT Compliance (16%) */}
            {(() => {
              const vatCalc = calculateVatBreakdown(recommendation.totalKES, 16);
              const logistics = GoogleMapsEngineService.calculateDeploymentLogistics(recommendation.location, '', recommendation.title);
              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EEECEC]/40 via-white to-[#F0C9CB]/20 border border-[#DB7D81]/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Receipt className="w-4 h-4 text-[#C01E25]" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                          16% Kenyan VAT Itemized Breakdown
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-[#128C7E] bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        KRA Compliant
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC]">
                        <span className="text-[10px] text-[#8F7B7F] block font-bold uppercase">Subtotal</span>
                        <span className="text-sm font-black text-[#1E1B1C] font-mono">
                          KES {vatCalc.subtotalKES.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC]">
                        <span className="text-[10px] text-[#8F7B7F] block font-bold uppercase">VAT (16%)</span>
                        <span className="text-sm font-black text-[#C01E25] font-mono">
                          KES {vatCalc.vatAmountKES.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-[#C01E25]/10 p-3 rounded-xl border border-[#C01E25]/30">
                        <span className="text-[10px] text-[#C01E25] block font-bold uppercase">Total Payable</span>
                        <span className="text-sm font-black text-[#C01E25] font-mono">
                          KES {vatCalc.totalPayableKES.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Google Maps Operational Engine & Travel Zone (Section 4 & 3) */}
                  <div className="p-4 rounded-2xl bg-[#FFFFFF] border-2 border-[#DB7D81]/40 shadow-xs space-y-3">
                    <div className="flex items-center justify-between border-b border-[#EEECEC] pb-2">
                      <div className="flex items-center gap-1.5">
                        <Navigation className="w-4 h-4 text-[#C01E25]" />
                        <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                          Google Maps Travel Logistics
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                        {logistics.zone}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Matched Technician</span>
                        <span className="font-extrabold text-[#1E1B1C] block">{logistics.matchedTechnician.name}</span>
                        <span className="text-[10px] text-[#5C4D50]">{logistics.matchedTechnician.rank}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Transit Distance</span>
                        <span className="font-extrabold text-[#1E1B1C] block">{logistics.technicianDistanceKm} KM to {recommendation.location}</span>
                        <span className="text-[10px] text-[#5C4D50]">~{logistics.technicianTravelMinutes} mins drive</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Mandatory Survey Fee</span>
                        <span className="font-black text-[#C01E25] block">KES {logistics.siteSurveyFeeKES.toLocaleString()}</span>
                        <span className="text-[10px] text-[#8F7B7F]">Non-refundable (credit eligible)</span>
                      </div>
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEECEC]/40 p-3 rounded-xl border border-[#EEECEC]">
                      <span className="text-xs text-[#1E1B1C]">
                        <strong>Step 4:</strong> Mandatory site survey required before final quotation.
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsSurveyModalOpen(true)}
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer shrink-0"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        <span>Book Site Survey (KES {logistics.siteSurveyFeeKES.toLocaleString()})</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Bill of Materials (BOM) */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C]">
                Preliminary Hardware Bill of Materials
              </h4>
              <div className="border border-[#EEECEC] rounded-2xl overflow-hidden divide-y divide-[#EEECEC]">
                {recommendation.hardwareItems.map((item: any, i: number) => (
                  <div key={i} className="p-3.5 flex items-center justify-between text-xs bg-[#FFFFFF]">
                    <div>
                      <span className="font-extrabold text-[#1E1B1C] block">{item.name}</span>
                      <span className="text-[#8F7B7F]">Brand: {item.brand} • Qty: {item.qty}</span>
                    </div>
                    <span className="font-mono font-bold text-[#1E1B1C]">
                      KES {item.cost.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LEAD CAPTURE & ACTIONS */}
            <div className="p-6 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-extrabold text-[#1E1B1C]">
                    Next Step: Confirm or Talk to an Advisor
                  </h4>
                  <p className="text-xs text-[#5C4D50]">
                    Speak with a senior technology specialist or save this solution to your project dashboard.
                  </p>
                </div>
              </div>

              {leadSubmitted ? (
                <div className="p-4 rounded-xl bg-[#F0C9CB]/30 border border-[#C01E25] flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-6 h-6 text-[#C01E25] shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-[#1E1B1C] block">Consultation Request Recorded</span>
                    <span className="text-[#5C4D50]">
                      Our engineer in {recommendation.location} will call {leadPhone} shortly with site inspection details.
                    </span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Your Full Name"
                    className="p-2.5 rounded-xl border border-[#EEECEC] text-xs bg-[#FFFFFF]"
                  />
                  <input
                    type="tel"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    placeholder="Phone Number (M-Pesa)"
                    className="p-2.5 rounded-xl border border-[#EEECEC] text-xs bg-[#FFFFFF]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1E1B1C] hover:bg-[#C01E25] text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    Request Free Call Back
                  </button>
                </form>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  onClick={handleWhatsAppConsult}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  <span>Talk to Advisor on WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    if (onOpenLoginModal) onOpenLoginModal();
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/20 transition-colors cursor-pointer min-h-[48px]"
                >
                  <User className="w-4 h-4" />
                  <span>Create Account & Track Project</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Mandatory Site Survey Booking Modal (Operating Agreement Section 3) */}
      <SiteSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        initialCounty={selectedCounty}
        initialInterest={recommendation?.title || needCategory}
      />
    </section>
  );
};
