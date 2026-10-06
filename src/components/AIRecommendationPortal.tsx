import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Coins, 
  Building, 
  CheckSquare, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  Download, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  Sliders,
  Phone,
  MessageCircle,
  User,
  AlertCircle,
  Award,
  Layers,
  Info,
  ChevronDown,
  ChevronUp,
  Navigation,
  Receipt
} from 'lucide-react';
import { AIRecommendationRequest, AIRecommendationResult, AppView, BudgetTierPackage, HynovaLocationRecord } from '../types';
import { KENYAN_COUNTIES } from '../data/mockData';
import { PricingEngineService, calculateVatBreakdown } from '../data/pricingEngine';
import { GoogleMapsEngineService } from '../services/googleMapsEngine';
import { SiteSurveyModal } from './SiteSurveyModal';
import { GoogleMapsLocationPicker } from './GoogleMapsLocationPicker';

interface AIRecommendationPortalProps {
  onNavigate: (view: AppView) => void;
  initialPrompt?: string;
  selectedCounty: string;
  onLeadCaptured?: (lead: any) => void;
}

export const AIRecommendationPortal: React.FC<AIRecommendationPortalProps> = ({
  onNavigate,
  initialPrompt = '',
  selectedCounty,
  onLeadCaptured,
}) => {
  const [budgetKES, setBudgetKES] = useState<number>(250000);
  const [county, setCounty] = useState<string>(selectedCounty || 'Nairobi County');
  const [propertyType, setPropertyType] = useState<string>('Residential Villa / Compound');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'Hybrid Solar Power Backup',
    'AI CCTV & Perimeter Security',
  ]);
  const [goals, setGoals] = useState<string>(
    initialPrompt || 'Eliminate KPLC blackout interruptions and provide 24/7 AI perimeter monitoring with instant phone alerts.'
  );
  const [customerType, setCustomerType] = useState<string>('Property Owner');

  // Contact capture for CRM
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [leadSuccessMsg, setLeadSuccessMsg] = useState(false);

  // AI Loading & Result state
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendationResult | null>(null);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [activeTier, setActiveTier] = useState<string>('Standard');
  const [isMobileParamsCollapsed, setIsMobileParamsCollapsed] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // Google Maps Location Record State
  const [locationRecord, setLocationRecord] = useState<HynovaLocationRecord | null>(null);
  const [showMapPicker, setShowMapPicker] = useState<boolean>(false);

  // Dynamic Google Maps Logistics Calculation (Operating Agreement Section 4)
  const logistics = GoogleMapsEngineService.calculateDeploymentLogistics(
    county,
    locationRecord?.fullAddress || '',
    selectedNeeds[0] || 'Solar',
    locationRecord ? { lat: locationRecord.lat, lng: locationRecord.lng } : undefined
  );

  const needOptions = [
    { id: 'solar', label: 'Hybrid Solar Power Backup', icon: Zap, desc: 'Zero downtime during blackouts' },
    { id: 'security', label: 'AI CCTV & Perimeter Security', icon: ShieldCheck, desc: 'Human & vehicle detection' },
    { id: 'networking', label: 'Starlink & Enterprise Wi-Fi 6', icon: Sparkles, desc: 'Seamless high-speed mesh' },
    { id: 'access', label: 'Biometric Access & Smart Gates', icon: Wrench, desc: 'Automated entry & intercom' },
    { id: 'bms', label: 'Smart Building Automation & BMS', icon: Building, desc: 'Sub-metering & climate/lighting' },
    { id: 'iot', label: 'Operational IoT & Water Telemetry', icon: Sliders, desc: 'Automated pumps & sensor alerts' },
  ];

  const propertyOptions = [
    'Residential Villa / Compound',
    'Apartment Syndicate / Multi-Unit',
    'Commercial Office & Co-Working',
    'Retail Shop / Supermarket / Godown',
    'School / University Campus',
    'Hospital / Healthcare Clinic',
    'Church / Auditorium',
    'Farm / Greenhouse / Agribusiness',
  ];

  const budgetPresets = [
    { label: 'Starter', amount: 15000, desc: 'KES 5k – 20k' },
    { label: 'Essential', amount: 35000, desc: 'KES 20k – 50k' },
    { label: 'Standard', amount: 100000, desc: 'KES 50k – 150k' },
    { label: 'Professional', amount: 280000, desc: 'KES 150k – 500k' },
    { label: 'Enterprise', amount: 750000, desc: 'KES 500k+' },
  ];

  const toggleNeed = (label: string) => {
    if (selectedNeeds.includes(label)) {
      setSelectedNeeds(selectedNeeds.filter((n) => n !== label));
    } else {
      setSelectedNeeds([...selectedNeeds, label]);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setLeadSuccessMsg(false);

    try {
      const payload: AIRecommendationRequest = {
        budget: budgetKES.toString(),
        location: county,
        propertyType,
        needs: selectedNeeds,
        goals,
        customerType,
        name: clientName || undefined,
        phone: clientPhone || undefined,
      };

      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.data) {
        let rec = data.data as AIRecommendationResult;

        // Ensure budget category tiers and affordability roadmap exist via central PricingEngineService
        const generatedTiers = PricingEngineService.generateBudgetCategories({
          category: selectedNeeds.join(' '),
          customerBudgetKES: budgetKES,
          propertyType,
          county,
        });

        if (!rec.budgetTiers || rec.budgetTiers.length === 0) {
          rec.budgetTiers = generatedTiers.tiers as BudgetTierPackage[];
          rec.recommendedTier = generatedTiers.recommendedTier;
          rec.pricingDisclaimer = generatedTiers.disclaimer;
        }

        if (!rec.affordabilityPromise) {
          rec.affordabilityPromise = generatedTiers.affordabilityPromise;
        }
        if (!rec.phasedRoadmap) {
          rec.phasedRoadmap = generatedTiers.phasedRoadmap;
        }

        setRecommendation(rec);
        setActiveTier(rec.recommendedTier || 'Standard');
        setIsMobileParamsCollapsed(true);
      }
    } catch (err) {
      console.error('Error generating AI recommendation:', err);
    } finally {
      setIsGenerating(false);
      setHasGeneratedOnce(true);
      if (onLeadCaptured) {
        onLeadCaptured({
          name: clientName || 'Anonymous Kenyan Client',
          phone: clientPhone || '+254 7XX XXX XXX',
          county,
          budgetKES,
          propertyType,
          goals,
          packageName: recommendation?.packageName || 'Custom Package',
          timestamp: new Date().toISOString(),
        });
      }
    }
  };

  const handleSaveToCRM = (e: React.FormEvent) => {
    e.preventDefault();
    setLeadSuccessMsg(true);
    if (onLeadCaptured) {
      onLeadCaptured({
        name: clientName || 'Client Inquiry',
        phone: clientPhone,
        county,
        budgetKES,
        propertyType,
        goals,
        packageName: recommendation?.packageName,
        timestamp: new Date().toISOString(),
      });
    }
  };

  // Derive current active tier details
  const selectedTier = recommendation?.budgetTiers?.find((t) => t.tier === activeTier) || recommendation?.budgetTiers?.[1];

  return (
    <div className="py-12 bg-gradient-to-b from-[#FFFFFF] via-[#EEECEC]/20 to-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0C9CB]/40 text-xs font-bold text-[#C01E25] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HYNOVA AI Infrastructure Architecture Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] tracking-tight mb-3">
            AI Technology Solutions Advisor
          </h1>
          <p className="text-sm sm:text-base text-[#5C4D50]">
            Enter your target budget, location, and property goals. Our AI calculates your itemized hardware bill of materials, installation timeline, and certified technician match.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls */}
          <div className="lg:col-span-5 bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#DB7D81]/40 shadow-sm space-y-6">
            <h2 className="text-base font-bold text-[#1E1B1C] flex items-center justify-between border-b border-[#EEECEC] pb-3">
              <span>Project Parameters</span>
              {recommendation ? (
                <button
                  type="button"
                  onClick={() => setIsMobileParamsCollapsed(!isMobileParamsCollapsed)}
                  className="lg:hidden text-xs font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{isMobileParamsCollapsed ? 'Edit Parameters' : 'Collapse'}</span>
                  {isMobileParamsCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              ) : (
                <span className="text-xs font-normal text-[#DB7D81]">Step 1 of 2</span>
              )}
            </h2>

            {/* Mobile Summary when collapsed */}
            {recommendation && isMobileParamsCollapsed && (
              <div className="lg:hidden p-3.5 rounded-2xl bg-[#EEECEC]/50 border border-[#EEECEC] text-xs text-[#5C4D50] flex items-center justify-between animate-in fade-in-50">
                <div>
                  <span className="font-extrabold text-[#1E1B1C] block">KES {budgetKES.toLocaleString()} • {propertyType}</span>
                  <span className="text-[11px] text-[#8F7B7F]">{county}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileParamsCollapsed(false)}
                  className="font-extrabold text-xs text-[#C01E25] bg-[#FFFFFF] px-3 py-1.5 rounded-xl border border-[#DB7D81]/40 shadow-2xs hover:bg-[#F0C9CB]/30 transition-colors"
                >
                  Adjust
                </button>
              </div>
            )}

            <div className={recommendation && isMobileParamsCollapsed ? 'hidden lg:block space-y-6' : 'space-y-6'}>

            {/* 1. Budget Slider & Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#C01E25]" />
                  <span>Target Budget (KES)</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#5C4D50]">KES</span>
                  <input
                    type="number"
                    min="5000"
                    max="25000000"
                    step="1000"
                    value={budgetKES}
                    onChange={(e) => setBudgetKES(Math.max(5000, Number(e.target.value) || 5000))}
                    className="w-28 text-right font-extrabold text-[#C01E25] bg-white border border-[#DB7D81]/40 rounded-lg px-2 py-0.5 text-sm outline-none focus:ring-1 focus:ring-[#C01E25]"
                  />
                </div>
              </div>

              <input
                id="budget-range-slider"
                type="range"
                min="5000"
                max="1500000"
                step="2500"
                value={budgetKES}
                onChange={(e) => setBudgetKES(Number(e.target.value))}
                className="w-full accent-[#C01E25] cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10px] text-[#8F7B7F] font-semibold mt-1">
                <span>Min: KES 5,000</span>
                <span>Standard: KES 100,000</span>
                <span>Enterprise: KES 1M+</span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {budgetPresets.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setBudgetKES(p.amount)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      budgetKES === p.amount
                        ? 'bg-[#C01E25] text-[#FFFFFF] border-[#C01E25]'
                        : 'bg-[#EEECEC] text-[#5C4D50] border-[#EEECEC] hover:bg-[#F0C9CB]/40'
                    }`}
                  >
                    {p.label} ({(p.amount / 1000).toFixed(0)}k)
                  </button>
                ))}
              </div>

              {budgetKES <= 20000 && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-[#F0C9CB]/35 border border-[#DB7D81]/40 text-[11px] text-[#1E1B1C] flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                  <div>
                    <span className="font-extrabold text-[#C01E25]">"Let's start with what you have and build from there."</span>
                    <span className="text-[#5C4D50] block">HYNOVA supports phased implementations starting from KES 5,000.</span>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Precise Installation Location (Google Maps) & Property Type */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] flex items-center gap-1.5 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C01E25]" />
                    <span>Installation Location & Precision Pinning</span>
                  </label>
                  <p className="text-xs text-[#5C4D50]">
                    Select your service area and pin your exact rooftop on Google Maps for precise travel, site survey, and logistics calculations.
                  </p>
                </div>

                <div className="w-full sm:w-64 shrink-0">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] block mb-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-[#C01E25]" />
                    <span>Property Type</span>
                  </label>
                  <select
                    id="advisor-property-select"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full text-xs font-semibold bg-[#EEECEC]/60 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                  >
                    {propertyOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Direct Embedded Interactive Google Map */}
              <div className="pt-1">
                <GoogleMapsLocationPicker
                  initialCounty={county}
                  requiredSpecialty={selectedNeeds[0] || 'Solar'}
                  showRecipientToggle={true}
                  title="Pin Exact Installation Location"
                  subtitle="Step 1: Select regional county & sub-county. Step 2: Search or drop your exact rooftop pin on Google Maps."
                  onLocationChange={(loc) => {
                    setLocationRecord(loc);
                    setCounty(loc.county);
                  }}
                  onLocationConfirmed={(loc) => {
                    setLocationRecord(loc);
                    setCounty(loc.county);
                  }}
                />
              </div>
            </div>

            {/* 3. Technology Needs (Checkboxes) */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] block mb-2">
                Select Technology Scope
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {needOptions.map((item) => {
                  const Icon = item.icon;
                  const isChecked = selectedNeeds.includes(item.label);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleNeed(item.label)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2 ${
                        isChecked
                          ? 'bg-[#F0C9CB]/40 border-[#C01E25] text-[#C01E25]'
                          : 'bg-[#FFFFFF] border-[#EEECEC] text-[#5C4D50] hover:bg-[#EEECEC]/40'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                        isChecked ? 'bg-[#C01E25] border-[#C01E25] text-[#FFFFFF]' : 'border-[#DB7D81]'
                      }`}>
                        {isChecked && <CheckSquare className="w-3 h-3" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1B1C] leading-tight">{item.label}</div>
                        <div className="text-[10px] text-[#8F7B7F]">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Strategic Goals & Context */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#5C4D50] block mb-1.5">
                Specific Goals & Constraints
              </label>
              <textarea
                id="advisor-goals-input"
                rows={3}
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Describe specific loads (e.g. 2 fridges, 8 computers, lights), perimeter length, or any challenges..."
                className="w-full text-xs bg-[#EEECEC]/40 border border-[#EEECEC] rounded-xl p-3 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
              />
            </div>

            {/* Generate Action Button */}
            <button
              id="advisor-generate-btn"
              type="button"
              onClick={() => handleGenerate()}
              disabled={isGenerating}
              className="w-full bg-[#C01E25] hover:bg-[#a1181e] disabled:opacity-60 text-[#FFFFFF] font-bold text-sm py-4 rounded-xl shadow-md shadow-[#C01E25]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>AI Architecture Engine Sizing Solution...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Recommended Package</span>
                </>
              )}
            </button>
            </div>
          </div>

          {/* Right Column: Live Recommendation Engine Output */}
          <div className="lg:col-span-7">
            {!hasGeneratedOnce && !isGenerating && (
              <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-3xl border border-[#EEECEC] text-center shadow-xs">
                <div className="w-16 h-16 rounded-3xl bg-[#F0C9CB]/40 text-[#C01E25] flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#1E1B1C] mb-2">Ready to Size Your Infrastructure</h3>
                <p className="text-xs sm:text-sm text-[#5C4D50] max-w-md mx-auto mb-6">
                  Select your target budget and scope on the left, then click <strong>"Generate Recommended Package"</strong>. Our AI models calculate preliminary solar yields, hardware combinations, and benchmark estimates based on electrical safety formulas.
                </p>
                <button
                  onClick={() => handleGenerate()}
                  className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Generate Initial Sample Architecture
                </button>
              </div>
            )}

            {isGenerating && (
              <div className="bg-[#FFFFFF] p-12 rounded-3xl border border-[#EEECEC] text-center shadow-xs space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F0C9CB]/50 text-[#C01E25] flex items-center justify-center mx-auto animate-pulse">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-[#1E1B1C]">HYNOVA AI is Analyzing Your Parameters</h3>
                <div className="space-y-1 text-xs text-[#5C4D50] max-w-sm mx-auto">
                  <p>• Calculating inverter load & lithium battery autonomy</p>
                  <p>• Checking certified technicians available in {county}</p>
                  <p>• Sizing wholesale bill of materials for KES {budgetKES.toLocaleString()}</p>
                </div>
              </div>
            )}

            {recommendation && !isGenerating && (
              <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 shadow-sm space-y-6 animate-in fade-in-50">
                {/* Package Header with Estimated Project Range */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EEECEC]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                        AI Sizing Assessment
                      </span>
                      <span className="text-[11px] font-bold text-[#5C4D50] bg-[#EEECEC] px-2 py-0.5 rounded-full">
                        {county}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-[#1E1B1C]">
                      {recommendation.packageName}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right bg-[#EEECEC]/50 p-3 sm:p-4 rounded-2xl border border-[#EEECEC] shrink-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D50] block">
                      Estimated Project Range
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-[#C01E25]">
                      {selectedTier?.rangeKES || recommendation.estimatedProjectRangeKES || `KES ${recommendation.estimatedCosts.totalKES.toLocaleString()}`}
                    </div>
                    <span className="text-[10px] text-[#8F7B7F] block">
                      Subject to On-Site Inspection
                    </span>
                  </div>
                </div>

                {/* 4 Budget Category Tiers (Entry, Standard, Professional, Enterprise) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Compare Budget Categories</span>
                    </h4>
                    <span className="text-[11px] font-semibold text-[#DB7D81]">
                      Recommended: {recommendation.recommendedTier || 'Standard'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(recommendation.budgetTiers || []).map((t) => {
                      const isSelected = activeTier === t.tier;
                      return (
                        <button
                          key={t.tier}
                          type="button"
                          onClick={() => setActiveTier(t.tier)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'border-[#C01E25] bg-[#F0C9CB]/25 shadow-xs ring-1 ring-[#C01E25]'
                              : 'border-[#EEECEC] bg-[#FFFFFF] hover:bg-[#EEECEC]/50'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C01E25]">
                                {t.tier}
                              </span>
                              {t.tier === recommendation.recommendedTier && (
                                <span className="text-[9px] bg-[#C01E25] text-white px-1.5 py-0.2 rounded font-bold">
                                  Match
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-[#1E1B1C] leading-snug">
                              {t.title}
                            </div>
                          </div>
                          <div className="text-[11px] font-black text-[#C01E25] mt-2">
                            {t.rangeKES}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Tier Scope Detail Card */}
                  {selectedTier && (
                    <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] text-xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-semibold text-[#1E1B1C]">
                        <span>Scope: {selectedTier.suitableFor}</span>
                        <span className="text-[#C01E25] font-bold">{selectedTier.warrantyPeriod}</span>
                      </div>
                      <div className="text-[11px] text-[#5C4D50]">
                        <strong>Certified Labor:</strong> {selectedTier.laborSummary}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {selectedTier.hardwareSummary.map((hw, i) => (
                          <span key={i} className="text-[10px] bg-white border border-[#EEECEC] px-2 py-0.5 rounded text-[#1E1B1C]">
                            {hw}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* HYNOVA AFFORDABILITY PROMISE & PHASED ROADMAP CARD */}
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-[#F0C9CB]/30 via-white to-[#EEECEC]/40 border-2 border-[#DB7D81]/50 space-y-3.5 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DB7D81]/30 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C01E25]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                        HYNOVA Affordability Promise
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#C01E25] bg-white px-2.5 py-0.5 rounded-full border border-[#DB7D81]/40 self-start sm:self-auto">
                      Start Where You Are
                    </span>
                  </div>

                  <div className="bg-white/80 p-3.5 rounded-xl border border-[#DB7D81]/30 text-xs sm:text-sm font-bold text-[#C01E25] leading-relaxed">
                    "{recommendation.affordabilityPromise || "Let's start with what you have and build from there."}"
                  </div>

                  {recommendation.phasedRoadmap && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                      {/* 1. Realistically Achieved Today */}
                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#128C7E] flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>1. Realistically Achieved Today</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-[#5C4D50]">
                          {recommendation.phasedRoadmap.achievedToday.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#128C7E] font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 2. Phased Approach */}
                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#C01E25] flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5" />
                          <span>2. Phased Implementation Path</span>
                        </span>
                        <ul className="space-y-1 text-[11px] text-[#5C4D50]">
                          {recommendation.phasedRoadmap.phasedApproach.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-[#C01E25] font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 3. Future Upgrades */}
                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#5C4D50] flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-[#C01E25]" />
                          <span>3. Upgrades Added Later</span>
                        </span>
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {recommendation.phasedRoadmap.futureUpgrades.map((item, idx) => (
                            <span key={idx} className="text-[10px] bg-[#EEECEC] text-[#1E1B1C] px-2 py-0.5 rounded font-semibold">
                              + {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 4. Cost-Effective Summary */}
                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-[#C01E25]" />
                          <span>4. Most Cost-Effective Path</span>
                        </span>
                        <p className="text-[11px] text-[#5C4D50] leading-snug">
                          {recommendation.phasedRoadmap.costEffectiveSummary}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="text-[11px] text-[#8F7B7F] italic leading-tight">
                    * Technology should not be reserved for large budgets. HYNOVA helps you start where you are, while creating a clear path toward where you want to go.
                  </div>
                </div>

                {/* Commercial Principle & Margin Protection Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] flex items-center gap-3">
                    <Award className="w-5 h-5 text-[#C01E25] shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-[#1E1B1C] block">HYNOVA Commercial Principle</span>
                      <span className="text-[#5C4D50] text-[11px]">
                        Most trusted affordable option — never sacrificing certified engineering safety.
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#C01E25] shrink-0" />
                    <div className="text-xs">
                      <span className="font-bold text-[#1E1B1C] block">Margin & Quality Protection</span>
                      <span className="text-[#5C4D50] text-[11px]">
                        Sustainable 20%–35% gross margin protects 1-year on-site workmanship warranty.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Core Pricing Principle Disclosure */}
                <div className="p-3.5 bg-[#EEECEC]/60 rounded-2xl border border-[#DB7D81]/40 text-xs text-[#5C4D50] leading-relaxed flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#1E1B1C]">Pricing Integrity Rule: </span>
                    {recommendation.pricingDisclaimer || 'HYNOVA never displays guaranteed final prices before site assessment. All figures represent market-based estimated project ranges. Final quotes are confirmed following on-site cable run and engineering validation.'}
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-[#EEECEC]/30 p-4 rounded-2xl border border-[#EEECEC] text-xs sm:text-sm text-[#1E1B1C] leading-relaxed">
                  {recommendation.executiveSummary}
                </div>

                {/* Cost Breakdown Grid */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-2 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-[#C01E25]" />
                    <span>Cost Transparency Range</span>
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                    <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#EEECEC]">
                      <div className="text-[10px] text-[#5C4D50]">Equipment BOM Range</div>
                      <div className="text-xs font-bold text-[#1E1B1C]">
                        {recommendation.estimatedCosts.hardwareRangeKES || `KES ${Math.round(recommendation.estimatedCosts.hardwareKES * 0.9).toLocaleString()} – ${Math.round(recommendation.estimatedCosts.hardwareKES * 1.1).toLocaleString()}`}
                      </div>
                    </div>
                    <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#EEECEC]">
                      <div className="text-[10px] text-[#5C4D50]">Installation & Travel Range</div>
                      <div className="text-xs font-bold text-[#1E1B1C]">
                        {recommendation.estimatedCosts.laborRangeKES || `KES ${Math.round(recommendation.estimatedCosts.installationKES * 0.9).toLocaleString()} – ${Math.round(recommendation.estimatedCosts.installationKES * 1.15).toLocaleString()}`}
                      </div>
                    </div>
                    <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#EEECEC]">
                      <div className="text-[10px] text-[#5C4D50]">Testing & Compliance</div>
                      <div className="text-xs font-bold text-[#1E1B1C]">
                        KES {recommendation.estimatedCosts.permitsAndCommissioningKES.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#EEECEC]">
                      <div className="text-[10px] text-[#5C4D50]">Payment Protection</div>
                      <div className="text-xs font-bold text-[#1E1B1C]">
                        100% M-Pesa Escrow
                      </div>
                    </div>
                  </div>
                </div>

                {/* OPERATING AGREEMENT SECTION 5: KENYAN VAT COMPLIANCE (16%) */}
                {(() => {
                  const vatData = calculateVatBreakdown(recommendation.estimatedCosts.totalKES, 16);
                  return (
                    <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#EEECEC]/40 via-white to-[#F0C9CB]/20 border border-[#DB7D81]/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-[#C01E25]" />
                          <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                            Kenyan Tax Compliance (16% VAT Itemized)
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-[#128C7E] bg-[#25D366]/15 px-2.5 py-0.5 rounded-full border border-[#25D366]/30">
                          KRA Compliant
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-[#EEECEC]">
                          <span className="text-[10px] text-[#8F7B7F] block font-bold uppercase">Project Cost Subtotal</span>
                          <span className="text-sm sm:text-base font-black text-[#1E1B1C] font-mono">
                            KES {vatData.subtotalKES.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#5C4D50] block mt-0.5">Hardware + Labor + Warranty</span>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-[#EEECEC]">
                          <span className="text-[10px] text-[#8F7B7F] block font-bold uppercase">VAT Rate (16%)</span>
                          <span className="text-sm sm:text-base font-black text-[#C01E25] font-mono">
                            KES {vatData.vatAmountKES.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#5C4D50] block mt-0.5">Standard Kenyan VAT</span>
                        </div>

                        <div className="bg-[#C01E25]/10 p-3 rounded-xl border border-[#C01E25]/30">
                          <span className="text-[10px] text-[#C01E25] block font-bold uppercase">Total Payable</span>
                          <span className="text-sm sm:text-base font-black text-[#C01E25] font-mono">
                            KES {vatData.totalPayableKES.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[#5C4D50] block mt-0.5">Zero Hidden Charges</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-[#5C4D50] leading-tight">
                        <strong>Pricing Formula:</strong> Equipment Cost + Technician Labor Cost + Travel Cost + Installation Cost + Workmanship Warranty + Platform Margin + VAT (16%) = Customer Price.
                      </div>
                    </div>
                  );
                })()}

                {/* OPERATING AGREEMENT SECTION 4: GOOGLE MAPS OPERATIONAL ENGINE & TRAVEL ZONE */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#FFFFFF] border-2 border-[#DB7D81]/40 shadow-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EEECEC] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-[#C01E25]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                        Google Maps Location & Logistics Engine
                      </span>
                    </div>
                    <span className="text-xs font-extrabold text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-0.5 rounded-full self-start sm:self-auto">
                      {logistics.zone}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Nearest Certified Technician</span>
                      <div className="font-extrabold text-[#1E1B1C] mt-0.5">{logistics.matchedTechnician.name}</div>
                      <div className="text-[11px] text-[#5C4D50]">{logistics.matchedTechnician.rank} • ⭐ {logistics.matchedTechnician.rating}</div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Transit & Travel Distance</span>
                      <div className="font-extrabold text-[#1E1B1C] mt-0.5">{logistics.technicianDistanceKm} KM to {county}</div>
                      <div className="text-[11px] text-[#5C4D50]">~{logistics.technicianTravelMinutes} mins driving time</div>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#8F7B7F] block uppercase font-bold">Mandatory Site Survey Fee</span>
                      <div className="font-extrabold text-[#C01E25] text-sm mt-0.5">KES {logistics.siteSurveyFeeKES.toLocaleString()}</div>
                      <div className="text-[10px] text-[#8F7B7F]">*Non-refundable (credit eligible)</div>
                    </div>
                  </div>

                  {/* Mandatory Survey Call-To-Action Box */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEECEC]/40 p-3 rounded-xl border border-[#EEECEC]">
                    <div className="text-xs text-[#1E1B1C]">
                      <strong>Step 4 Mandatory Rule:</strong> Physical verification survey required before final binding quotation.
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsSurveyModalOpen(true)}
                      className="shrink-0 bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Book Survey (KES {logistics.siteSurveyFeeKES.toLocaleString()})</span>
                    </button>
                  </div>
                </div>

                {/* Hardware Bill of Materials (BOM) */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Hardware Bill of Materials (BOM)</span>
                    </h4>
                    <span className="text-[11px] text-[#DB7D81] font-semibold">
                      {recommendation.hardwareBillOfMaterials.length} Items Sized
                    </span>
                  </div>

                  <div className="space-y-2">
                    {recommendation.hardwareBillOfMaterials.map((bom, idx) => (
                      <div
                        key={idx}
                        className="bg-[#FFFFFF] p-3 rounded-xl border border-[#EEECEC] flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-[#1E1B1C]">{bom.item}</div>
                          <div className="text-[11px] text-[#5C4D50]">{bom.specs}</div>
                        </div>
                        <div className="text-right shrink-0 ml-3">
                          <span className="font-extrabold text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded text-[11px]">
                            {bom.quantity}
                          </span>
                          <div className="text-[10px] text-[#8F7B7F] mt-0.5">{bom.supplierCategory}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Certified Technician Profile */}
                <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#C01E25]" />
                    <span>Dispatched Technician Requirement</span>
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-sm text-[#C01E25]">
                        {recommendation.requiredTechnician.minimumRank}
                      </div>
                      <div className="text-[#5C4D50]">
                        Specialty: {recommendation.requiredTechnician.specialty} • Crew Size: {recommendation.requiredTechnician.assignedCount} Technicians
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recommendation.requiredTechnician.certificationsRequired.map((cert, i) => (
                        <span key={i} className="text-[10px] font-semibold bg-[#EEECEC] text-[#1E1B1C] px-2 py-0.5 rounded">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Timeline & Compliance */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#EEECEC]/30 p-3 rounded-xl border border-[#EEECEC]">
                    <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C] mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Installation Timeline</span>
                    </div>
                    <p className="text-[#5C4D50]">{recommendation.timeline} to full testing & sign-off.</p>
                  </div>

                  <div className="bg-[#EEECEC]/30 p-3 rounded-xl border border-[#EEECEC]">
                    <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C] mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Kenyan Standards Compliance</span>
                    </div>
                    <p className="text-[#5C4D50]">{recommendation.kenyanComplianceNotes}</p>
                  </div>
                </div>

                {/* Lead Captured & Booking Form */}
                <div className="pt-2 border-t border-[#EEECEC]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-2">
                    Lock Quotation & Connect with Certified Technician
                  </h4>

                  {leadSuccessMsg ? (
                    <div className="p-4 rounded-xl bg-[#F0C9CB]/40 border border-[#C01E25] text-xs text-[#1E1B1C] flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#C01E25] shrink-0" />
                      <div>
                        <strong>Quotation Locked & Captured into HYNOVA CRM!</strong>
                        <p className="text-[11px] text-[#5C4D50]">
                          A dedicated HYNOVA technical coordinator is dispatching quote #{Math.floor(100000 + Math.random() * 900000)} to verified installers in {county}.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveToCRM} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name (e.g. Samuel Mutiso)"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        required
                        className="text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                      />
                      <input
                        type="tel"
                        placeholder="M-Pesa Phone (e.g. 0722 000 000)"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        required
                        className="text-xs bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                      />
                      <button
                        type="submit"
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Lock Quote & Dispatch</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Secondary Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EEECEC]">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/254727547310?text=${encodeURIComponent(`Jambo HYNOVA! I received an AI Recommendation for ${recommendation.packageName} in ${county} (KES ${recommendation.estimatedCosts.totalKES.toLocaleString()}). I would like to consult an engineer.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-xs transition-colors cursor-pointer border border-[#25D366]/30"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                      <span>WhatsApp Engineer (0727 547 310)</span>
                    </a>

                    <a
                      href="tel:+254727547310"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#EEECEC] hover:bg-[#e0dede] text-[#1E1B1C] font-bold text-xs transition-colors cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Call 0727 547 310</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate('customer-portal')}
                      className="text-xs font-bold text-[#C01E25] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>View in Customer Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => window.print()}
                      className="text-xs text-[#5C4D50] hover:text-[#1E1B1C] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Print KES Quotation</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mandatory Site Survey Modal (Operating Agreement Section 3) */}
      <SiteSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        initialCounty={county}
        initialInterest={recommendation?.packageName || 'Technology Infrastructure Solution'}
      />
    </div>
  );
};
