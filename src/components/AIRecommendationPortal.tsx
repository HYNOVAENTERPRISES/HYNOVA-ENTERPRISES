import React, { useState } from 'react';
import { 
  Sparkles, 
  MapPin, 
  Coins, 
  Building, 
  Clock, 
  Wrench, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  Send, 
  CheckCircle2, 
  RefreshCw,
  Zap,
  Phone,
  MessageCircle,
  Layers,
  Info,
  ChevronDown,
  ChevronUp,
  Receipt,
  Check,
  PackageCheck,
  Calendar,
  FileText,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { 
  AIRecommendationRequest, 
  AIRecommendationResult, 
  AppView, 
  HynovaLocationRecord,
  RecommendedTierSolutionRecord
} from '../types';
import { KENYAN_COUNTIES } from '../data/mockData';
import { GoogleMapsEngineService } from '../services/googleMapsEngine';
import { SiteSurveyModal } from './SiteSurveyModal';
import { GoogleMapsLocationPicker } from './GoogleMapsLocationPicker';
import { googleSheetsOps } from '../services/googleSheetsService';
import { getAccessToken } from '../services/authService';

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
  const [budgetKES, setBudgetKES] = useState<number>(100000);
  const [county, setCounty] = useState<string>(selectedCounty || 'Nairobi County');
  const [propertyType, setPropertyType] = useState<string>('Residential Villa / Compound');
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([
    'AI CCTV & Perimeter Security',
  ]);
  const [goals, setGoals] = useState<string>(
    initialPrompt || 'I want cameras for my property and remote mobile monitoring.'
  );
  const [customerType, setCustomerType] = useState<string>('Property Owner');

  // Contact capture for CRM & Quotation Locking
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [leadSuccessMsg, setLeadSuccessMsg] = useState(false);
  const [createdQuoteRef, setCreatedQuoteRef] = useState<string | null>(null);

  // AI Loading & Result state
  const [isGenerating, setIsGenerating] = useState(false);
  const [recommendation, setRecommendation] = useState<AIRecommendationResult | null>(null);
  const [selectedTierId, setSelectedTierId] = useState<'lowest' | 'middle' | 'recommended'>('recommended');
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [isMobileParamsCollapsed, setIsMobileParamsCollapsed] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // Google Maps Location Record State
  const [locationRecord, setLocationRecord] = useState<HynovaLocationRecord | null>(null);

  // Dynamic Google Maps Logistics Calculation
  const logistics = GoogleMapsEngineService.calculateDeploymentLogistics(
    county,
    locationRecord?.fullAddress || '',
    selectedNeeds[0] || 'Solar',
    locationRecord ? { lat: locationRecord.lat, lng: locationRecord.lng } : undefined
  );

  const needOptions = [
    { id: 'security', label: 'AI CCTV & Perimeter Security', icon: ShieldCheck, desc: 'Human & vehicle AI classification, 24/7 ColorVu' },
    { id: 'solar', label: 'Hybrid Solar Power Backup', icon: Zap, desc: 'Zero downtime pure-sine inverter & lithium storage' },
    { id: 'networking', label: 'Starlink & Enterprise Wi-Fi 6', icon: Sparkles, desc: 'Seamless high-speed mesh & PoE cabling' },
    { id: 'access', label: 'Biometric Access & Smart Gates', icon: Wrench, desc: 'Automated facial recognition & electric strike' },
  ];

  const propertyOptions = [
    'Residential Villa / Compound',
    'Apartment Syndicate / Multi-Unit',
    'Commercial Office & Co-Working',
    'Retail Shop / Supermarket / Godown',
    'School / University Campus',
    'Hospital / Healthcare Clinic',
    'Hotel / Safari Lodge',
    'Farm / Greenhouse / Agribusiness',
  ];

  const budgetPresets = [
    { label: 'Starter', amount: 20000, desc: 'Entry-level' },
    { label: 'Essential', amount: 50000, desc: 'Core coverage' },
    { label: 'Standard', amount: 100000, desc: 'Balanced setup' },
    { label: 'Professional', amount: 250000, desc: 'High capability' },
    { label: 'Commercial', amount: 500000, desc: 'Enterprise microgrid' },
  ];

  const quickPromptTemplates = [
    'I need CCTV for my home.',
    'I want cameras for a three-bedroom house and remote mobile viewing.',
    'I need security for my shop.',
    'I want an electric fence and CCTV.',
    'I need solar power for my home.',
  ];

  const toggleNeed = (label: string) => {
    if (selectedNeeds.includes(label)) {
      if (selectedNeeds.length > 1) {
        setSelectedNeeds(selectedNeeds.filter((n) => n !== label));
      }
    } else {
      setSelectedNeeds([...selectedNeeds, label]);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setLeadSuccessMsg(false);
    setCreatedQuoteRef(null);

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
        const rec = data.data as AIRecommendationResult;
        setRecommendation(rec);
        setSelectedTierId('recommended');
        setIsMobileParamsCollapsed(true);
      }
    } catch (err) {
      console.error('Error generating AI recommendation:', err);
    } finally {
      setIsGenerating(false);
      setHasGeneratedOnce(true);
      if (onLeadCaptured) {
        onLeadCaptured({
          name: clientName || 'Kenyan Client',
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

  // Derive active tier solution
  const activeSolution: RecommendedTierSolutionRecord | undefined = 
    selectedTierId === 'lowest' 
      ? recommendation?.lowestPriceTier 
      : selectedTierId === 'middle' 
      ? recommendation?.middlePriceTier 
      : recommendation?.hynovaRecommendedTier;

  const handleSaveToCRM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSolution || !recommendation) return;

    setLeadSuccessMsg(true);

    try {
      // 1. Add customer to HYNOVA OPS sheet store
      googleSheetsOps.addCustomer({
        purchaserName: clientName || 'Prospective Client',
        purchaserPhone: clientPhone || '+254 7XX XXX XXX',
        purchaserEmail: '',
        installationRecipient: `${clientName || 'Client'} (Self)`,
        installationLocation: county || 'Nairobi County',
        propertyType: propertyType,
      });

      // 2. Add quote to Quote_Estimator sheet store with exact active solution BOM figures
      const addedQuote = googleSheetsOps.addQuote({
        purchaserName: clientName || 'Prospective Client',
        projectScope: `${recommendation.packageName} [${activeSolution.tierLabel}]: ${activeSolution.headline}`,
        hardwareSubtotalKES: activeSolution.hardwareSubtotalExclVatKES,
        labourKES: activeSolution.servicesSubtotalExclVatKES,
        terms: '40% Mobilization Escrow, 40% Delivery, 20% Signoff',
      });

      setCreatedQuoteRef(addedQuote.quoteRef);

      // 3. Append to Google Sheets if user has OAuth token
      getAccessToken().then(token => {
        if (token) {
          googleSheetsOps.appendRowToGoogleSheet(
            'Quote_Estimator',
            [
              addedQuote.quoteRef,
              addedQuote.purchaserName,
              addedQuote.quoteDate,
              addedQuote.salesRep,
              addedQuote.projectScope,
              addedQuote.validity,
              addedQuote.terms,
              addedQuote.hardwareSubtotalKES,
              addedQuote.labourKES,
              addedQuote.vatKES,
              addedQuote.grandTotalKES,
              addedQuote.status
            ],
            token
          ).catch(err => console.warn('Background quote append note:', err));
        }
      });
    } catch (err) {
      console.warn('Local quote sync note:', err);
    }

    if (onLeadCaptured) {
      onLeadCaptured({
        name: clientName || 'Client Inquiry',
        phone: clientPhone,
        county,
        budgetKES,
        propertyType,
        goals,
        packageName: `${recommendation.packageName} (${activeSolution.tierLabel})`,
        timestamp: new Date().toISOString(),
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBFB] py-8 sm:py-12 text-[#1E1B1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-Page Hero Header & Status Badges */}
        <header className="mb-8 sm:mb-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0C9CB]/40 border border-[#DB7D81]/40 text-xs font-extrabold text-[#C01E25] mb-3">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Authoritative HYNOVA OPS Engine • 18 Google Sheets Worksheets</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1B1C] tracking-tight">
            AI Technology Solutions Advisor
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5C4D50] max-w-2xl mx-auto leading-relaxed">
            Enter your requirements in plain language. Our engine builds exactly three viable, catalog-grounded options bounded strictly by your budget ceiling with deterministic 16% VAT.
          </p>

          {/* Quick Integrity Badges */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold text-[#5C4D50]">
            <span className="px-2.5 py-1 rounded-full bg-white border border-[#EEECEC] shadow-2xs flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Real Equipment SKUs</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white border border-[#EEECEC] shadow-2xs flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#C01E25]" />
              <span>Hard Budget Ceiling</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white border border-[#EEECEC] shadow-2xs flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-blue-600" />
              <span>16% VAT Itemized</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white border border-[#EEECEC] shadow-2xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Truthful Zero-Technician State</span>
            </span>
          </div>
        </header>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Interactive Parameter Console (Sticky on Desktop) */}
          <aside className="lg:col-span-5 bg-white p-5 sm:p-7 rounded-3xl border border-[#EEECEC] shadow-sm space-y-6 lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-[#EEECEC] pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C01E25]" />
                <h2 className="text-sm sm:text-base font-extrabold text-[#1E1B1C]">Project Parameters</h2>
              </div>
              {recommendation ? (
                <button
                  type="button"
                  onClick={() => setIsMobileParamsCollapsed(!isMobileParamsCollapsed)}
                  className="lg:hidden text-xs font-extrabold text-[#C01E25] bg-[#F0C9CB]/40 hover:bg-[#F0C9CB]/60 px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>{isMobileParamsCollapsed ? 'Adjust Parameters' : 'Minimize'}</span>
                  {isMobileParamsCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                </button>
              ) : (
                <span className="text-[11px] font-bold text-[#8F7B7F] bg-[#EEECEC]/60 px-2 py-0.5 rounded-full">
                  Step 1: Configure
                </span>
              )}
            </div>

            {/* Mobile Summary Pill when collapsed */}
            {recommendation && isMobileParamsCollapsed && (
              <div className="lg:hidden p-3.5 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] text-xs flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-[#1E1B1C]">Ceiling: KES {budgetKES.toLocaleString()}</span>
                  <span className="text-[11px] text-[#5C4D50] block mt-0.5">{propertyType} • {county}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileParamsCollapsed(false)}
                  className="font-extrabold text-xs text-[#C01E25] bg-white px-3 py-1.5 rounded-xl border border-[#DB7D81]/40 shadow-2xs hover:bg-[#F0C9CB]/20 transition-colors"
                >
                  Adjust
                </button>
              </div>
            )}

            <div className={recommendation && isMobileParamsCollapsed ? 'hidden lg:block space-y-5' : 'space-y-5'}>
              
              {/* 1. Target Budget (Strict Hard Ceiling) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="budget-input" className="text-xs font-extrabold uppercase tracking-wider text-[#5C4D50] flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-[#C01E25]" />
                    <span>Customer Budget Ceiling</span>
                  </label>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-extrabold text-[#5C4D50]">KES</span>
                    <input
                      id="budget-input"
                      type="number"
                      min="5000"
                      max="25000000"
                      step="1000"
                      value={budgetKES}
                      onChange={(e) => setBudgetKES(Math.max(5000, Number(e.target.value) || 5000))}
                      className="w-28 text-right font-black text-[#C01E25] bg-white border border-[#DB7D81]/50 rounded-lg px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-[#C01E25]/30 font-mono"
                    />
                  </div>
                </div>

                <input
                  id="budget-range-slider"
                  type="range"
                  min="5000"
                  max="500000"
                  step="2500"
                  value={budgetKES}
                  onChange={(e) => setBudgetKES(Number(e.target.value))}
                  className="w-full accent-[#C01E25] cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-[#8F7B7F] font-semibold font-mono">
                  <span>KES 5,000 (Min)</span>
                  <span>KES 250,000</span>
                  <span>KES 500,000+</span>
                </div>

                {/* Quick Presets */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {budgetPresets.map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setBudgetKES(p.amount)}
                      className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-extrabold border transition-colors cursor-pointer ${
                        budgetKES === p.amount
                          ? 'bg-[#C01E25] text-white border-[#C01E25]'
                          : 'bg-[#EEECEC]/50 text-[#5C4D50] border-[#EEECEC] hover:bg-[#F0C9CB]/30'
                      }`}
                    >
                      {p.label}
                      <span className="block text-[9px] opacity-80 font-mono">{(p.amount / 1000).toFixed(0)}k</span>
                    </button>
                  ))}
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Ceiling Guarantee:</strong> No generated tier will exceed KES {budgetKES.toLocaleString()}. Totals include 16% VAT.
                  </span>
                </div>
              </div>

              {/* 2. Natural Language Brief */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C4D50] block">
                  Describe Your Requirement
                </label>
                <textarea
                  rows={3}
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  placeholder="e.g. I need CCTV for my home and remote mobile phone viewing..."
                  className="w-full text-xs bg-[#EEECEC]/40 border border-[#EEECEC] rounded-xl p-3 text-[#1E1B1C] outline-none focus:border-[#C01E25] focus:bg-white transition-all resize-none"
                />
                
                {/* Inspiration chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  <span className="text-[10px] font-bold text-[#8F7B7F] self-center">Try:</span>
                  {quickPromptTemplates.map((tmpl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setGoals(tmpl)}
                      className="text-[10px] bg-[#EEECEC]/60 hover:bg-[#F0C9CB]/40 text-[#1E1B1C] px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                    >
                      "{tmpl}"
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Category Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C4D50] block">
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
                        className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                          isChecked
                            ? 'border-[#C01E25] bg-[#F0C9CB]/25 shadow-2xs ring-1 ring-[#C01E25]'
                            : 'border-[#EEECEC] bg-white hover:bg-[#EEECEC]/40'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                            isChecked ? 'bg-[#C01E25] text-white' : 'bg-[#EEECEC] text-[#5C4D50]'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-[#1E1B1C] leading-snug">{item.label}</div>
                          <div className="text-[10px] text-[#5C4D50] line-clamp-1 mt-0.5">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Location & Property Type */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C4D50] block mb-1">
                      County (Location)
                    </label>
                    <select
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full text-xs font-bold bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2 text-[#1E1B1C] outline-none focus:border-[#C01E25] cursor-pointer"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c.name} value={`${c.name} County`}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold uppercase tracking-wider text-[#5C4D50] block mb-1">
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full text-xs font-bold bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl px-3 py-2 text-[#1E1B1C] outline-none focus:border-[#C01E25] cursor-pointer"
                    >
                      {propertyOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Google Maps Rooftop Pinning */}
                <div className="pt-1">
                  <GoogleMapsLocationPicker
                    initialCounty={county}
                    requiredSpecialty={selectedNeeds[0] || 'Solar'}
                    showRecipientToggle={false}
                    title="Installation location"
                    subtitle="Tell us where you need the installation, or share your location with us on WhatsApp so we can understand your project requirements."
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

              {/* Action Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-white font-black text-sm py-3.5 px-6 rounded-2xl shadow-md shadow-[#C01E25]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Querying Authoritative Catalog...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Three-Tier Catalog Recommendation</span>
                  </>
                )}
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN: Results Workspace */}
          <main className="lg:col-span-7 space-y-6">
            
            {/* STATE 1: Empty State (Before Generation) */}
            {!recommendation && !isGenerating && (
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EEECEC] shadow-sm text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-[#F0C9CB]/40 text-[#C01E25] flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#1E1B1C]">Ready to Calculate Your Solution</h3>
                <p className="text-sm text-[#5C4D50] max-w-md mx-auto leading-relaxed">
                  Configure your target budget ceiling, location, and requirement, then click generate. You will receive exactly three catalog-grounded options:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-2">
                  <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                    <div className="text-[10px] font-black uppercase text-gray-700">Option 1</div>
                    <div className="text-xs font-bold text-[#1E1B1C] mt-0.5">Lowest Price</div>
                    <p className="text-[11px] text-[#5C4D50] mt-1">Cheapest viable starter setup satisfying the core requirement.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                    <div className="text-[10px] font-black uppercase text-blue-700">Option 2</div>
                    <div className="text-xs font-bold text-[#1E1B1C] mt-0.5">Middle Price</div>
                    <p className="text-[11px] text-[#5C4D50] mt-1">Balanced configuration between price, capability, and reliability.</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F0C9CB]/30 border border-[#C01E25]/30">
                    <div className="text-[10px] font-black uppercase text-[#C01E25]">Option 3</div>
                    <div className="text-xs font-bold text-[#1E1B1C] mt-0.5">HYNOVA Recommended</div>
                    <p className="text-[11px] text-[#5C4D50] mt-1">Our recommended option gives you the strongest suitable solution within your selected budget.</p>
                  </div>
                </div>
              </div>
            )}

            {/* STATE 2: Loading State (Generating) */}
            {isGenerating && (
              <div className="bg-white p-12 rounded-3xl border border-[#EEECEC] shadow-sm text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-2xl bg-[#F0C9CB]/50 text-[#C01E25] flex items-center justify-center mx-auto">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-[#1E1B1C]">Building Catalog-Grounded Solutions</h3>
                <div className="space-y-1.5 text-xs text-[#5C4D50] max-w-sm mx-auto">
                  <p>• Retrieving authoritative SKUs from Product_Catalog</p>
                  <p>• Computing deterministic prices and 16% VAT</p>
                  <p>• Enforcing strict budget ceiling of KES {budgetKES.toLocaleString()}</p>
                </div>
              </div>
            )}

            {/* STATE 3: Generated Results View */}
            {recommendation && !isGenerating && activeSolution && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEECEC] shadow-sm space-y-6">
                
                {/* Package Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#EEECEC]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                        Authoritative Solution
                      </span>
                      <span className="text-[11px] font-bold text-[#5C4D50] bg-[#EEECEC] px-2.5 py-0.5 rounded-full">
                        {county}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-[#1E1B1C]">
                      {recommendation.packageName}
                    </h3>
                  </div>

                  <div className="text-left sm:text-right bg-[#EEECEC]/40 p-3 sm:p-4 rounded-2xl border border-[#EEECEC] shrink-0">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D50] block">
                      Active Tier Total (Incl. VAT)
                    </span>
                    <div className="text-2xl font-black text-[#C01E25] font-mono">
                      KES {activeSolution.grandTotalInclVatKES.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-extrabold text-emerald-700 block font-mono">
                      Under Budget Ceiling by KES {activeSolution.remainingBudgetKES.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* THREE REQUIRED RECOMMENDATIONS SELECTOR CARDS */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#C01E25]" />
                      <span>Select Solution Level (Click to Switch)</span>
                    </h4>
                    <span className="text-[11px] font-bold text-[#128C7E] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 self-start sm:self-auto font-mono">
                      Budget Ceiling: KES {budgetKES.toLocaleString()} Max
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    
                    {/* OPTION 1: LOWEST PRICE */}
                    {recommendation.lowestPriceTier && (
                      <button
                        type="button"
                        onClick={() => setSelectedTierId('lowest')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                          selectedTierId === 'lowest'
                            ? 'border-[#C01E25] bg-[#F0C9CB]/25 shadow-sm ring-2 ring-[#C01E25]'
                            : 'border-[#EEECEC] bg-white hover:bg-[#EEECEC]/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                              Lowest Price
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">Option 1</span>
                          </div>
                          <div className="font-extrabold text-xs text-[#1E1B1C] leading-snug">
                            {recommendation.lowestPriceTier.badgeTitle}
                          </div>
                          <p className="text-[11px] text-[#5C4D50] line-clamp-2 mt-1">
                            {recommendation.lowestPriceTier.headline}
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#EEECEC]">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Incl. 16% VAT</span>
                          <div className="text-lg font-black text-[#1E1B1C] font-mono">
                            KES {recommendation.lowestPriceTier.grandTotalInclVatKES.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700 mt-0.5 font-mono">
                            Under Ceiling: KES {recommendation.lowestPriceTier.remainingBudgetKES.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    )}

                    {/* OPTION 2: MIDDLE PRICE */}
                    {recommendation.middlePriceTier && (
                      <button
                        type="button"
                        onClick={() => setSelectedTierId('middle')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                          selectedTierId === 'middle'
                            ? 'border-[#C01E25] bg-[#F0C9CB]/25 shadow-sm ring-2 ring-[#C01E25]'
                            : 'border-[#EEECEC] bg-white hover:bg-[#EEECEC]/40'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                              Middle Price
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">Option 2</span>
                          </div>
                          <div className="font-extrabold text-xs text-[#1E1B1C] leading-snug">
                            {recommendation.middlePriceTier.badgeTitle}
                          </div>
                          <p className="text-[11px] text-[#5C4D50] line-clamp-2 mt-1">
                            {recommendation.middlePriceTier.headline}
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#EEECEC]">
                          <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Incl. 16% VAT</span>
                          <div className="text-lg font-black text-[#1E1B1C] font-mono">
                            KES {recommendation.middlePriceTier.grandTotalInclVatKES.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700 mt-0.5 font-mono">
                            Under Ceiling: KES {recommendation.middlePriceTier.remainingBudgetKES.toLocaleString()}
                          </div>
                        </div>
                      </button>
                    )}

                    {/* OPTION 3: HYNOVA RECOMMENDED */}
                    {recommendation.hynovaRecommendedTier && (
                      <button
                        type="button"
                        onClick={() => setSelectedTierId('recommended')}
                        className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative ${
                          selectedTierId === 'recommended'
                            ? 'border-[#C01E25] bg-gradient-to-br from-[#F0C9CB]/30 via-white to-white shadow-md ring-2 ring-[#C01E25]'
                            : 'border-[#DB7D81]/50 bg-gradient-to-br from-[#F0C9CB]/10 via-white to-white hover:border-[#C01E25]'
                        }`}
                      >
                        <div className="absolute -top-2.5 right-3 bg-[#C01E25] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>HYNOVA Pick</span>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-[#C01E25] text-white px-2 py-0.5 rounded">
                              HYNOVA Recommended
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">Option 3</span>
                          </div>
                          <div className="font-extrabold text-xs text-[#1E1B1C] leading-snug">
                            {recommendation.hynovaRecommendedTier.badgeTitle}
                          </div>
                          <p className="text-[11px] text-[#5C4D50] line-clamp-2 mt-1">
                            {recommendation.hynovaRecommendedTier.headline}
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[#EEECEC]">
                          <span className="text-[10px] uppercase font-bold text-[#C01E25] block">Total Incl. 16% VAT</span>
                          <div className="text-xl font-black text-[#C01E25] font-mono">
                            KES {recommendation.hynovaRecommendedTier.grandTotalInclVatKES.toLocaleString()}
                          </div>
                          <div className="text-[10px] font-bold text-emerald-700 mt-0.5 font-mono">
                            Highest Value within Ceiling
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                </div>

                {/* ACTIVE TIER BANNER & HARD CEILING GUARANTEE */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                        Active Selection: {activeSolution.tierLabel} ({activeSolution.badgeTitle})
                      </span>
                    </div>
                    <span className="text-[11px] font-black text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-300">
                      100% Within Budget Ceiling
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 text-center">
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-gray-500 block">Customer Budget</span>
                      <strong className="text-gray-900 font-mono">KES {budgetKES.toLocaleString()}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-gray-500 block">Solution Cost</span>
                      <strong className="text-[#C01E25] font-mono">KES {activeSolution.grandTotalInclVatKES.toLocaleString()}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-gray-500 block">Remaining Buffer</span>
                      <strong className="text-emerald-700 font-mono">KES {activeSolution.remainingBudgetKES.toLocaleString()}</strong>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-emerald-100">
                      <span className="text-[10px] text-gray-500 block">Pricing Source</span>
                      <strong className="text-gray-900">HYNOVA Catalog</strong>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#5C4D50] leading-snug pt-1">
                    {activeSolution.description}
                  </p>
                </div>

                {/* ITEMIZED BILL OF MATERIALS (BOM) FROM REAL CATALOG */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-[#C01E25]" />
                      <span>Itemized Bill of Materials (Authoritative Catalog SKUs)</span>
                    </h4>
                    <span className="text-[11px] font-bold text-[#8F7B7F]">
                      {activeSolution.items.length} Line Items
                    </span>
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden sm:block border border-[#EEECEC] rounded-2xl overflow-hidden divide-y divide-[#EEECEC]">
                    <div className="bg-[#EEECEC]/50 px-3.5 py-2 text-[10px] font-bold text-[#5C4D50] uppercase grid grid-cols-12 gap-2">
                      <span className="col-span-5">Item / Model & Specifications</span>
                      <span className="col-span-2 text-center">Qty & UOM</span>
                      <span className="col-span-3 text-right">Unit Excl. VAT</span>
                      <span className="col-span-2 text-right">Total Incl. VAT</span>
                    </div>

                    {activeSolution.items.map((item, idx) => (
                      <div key={idx} className="p-3 text-xs grid grid-cols-12 gap-2 items-center bg-white hover:bg-gray-50/80 transition-colors">
                        <div className="col-span-5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-[#C01E25] bg-[#F0C9CB]/30 px-1.5 py-0.5 rounded shrink-0">
                              {item.sku}
                            </span>
                            <span className="font-extrabold text-[#1E1B1C] leading-tight">
                              {item.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-[#5C4D50] mt-0.5 line-clamp-1">{item.description}</p>
                        </div>

                        <div className="col-span-2 text-center">
                          <span className="font-extrabold text-xs text-[#1E1B1C] bg-[#EEECEC] px-2 py-0.5 rounded font-mono">
                            {item.quantity} {item.uom}
                          </span>
                        </div>

                        <div className="col-span-3 text-right font-mono text-[11px] text-[#5C4D50]">
                          KES {item.unitPriceExclVatKES.toLocaleString()}
                        </div>

                        <div className="col-span-2 text-right font-mono font-black text-xs text-[#1E1B1C]">
                          KES {item.lineTotalInclVatKES.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mobile Cards View */}
                  <div className="sm:hidden space-y-2">
                    {activeSolution.items.map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl border border-[#EEECEC] bg-white space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#C01E25] bg-[#F0C9CB]/30 px-1.5 py-0.5 rounded">
                            {item.sku}
                          </span>
                          <span className="font-mono font-black text-xs text-[#1E1B1C]">
                            KES {item.lineTotalInclVatKES.toLocaleString()}
                          </span>
                        </div>
                        <div className="font-extrabold text-[#1E1B1C] leading-tight">{item.name}</div>
                        <p className="text-[10px] text-[#5C4D50] line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between pt-1 border-t border-[#EEECEC] text-[10px] text-[#5C4D50]">
                          <span>Qty: <strong>{item.quantity} {item.uom}</strong></span>
                          <span>Unit Excl. VAT: <strong>KES {item.unitPriceExclVatKES.toLocaleString()}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FINANCIAL TOTALS & 16% VAT BREAKDOWN */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#EEECEC]/30 border border-[#EEECEC] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#DDDADA] pb-2">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-[#C01E25]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                        Transparent Price & Tax Summary (16% VAT Itemized)
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#128C7E] bg-emerald-100 px-2 py-0.5 rounded">
                      KRA Compliant
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div className="bg-white p-3 rounded-xl border border-[#EEECEC]">
                      <span className="text-[10px] text-gray-500 block">Equipment Subtotal</span>
                      <strong className="text-sm font-black text-[#1E1B1C] font-mono">
                        KES {activeSolution.hardwareTotalInclVatKES.toLocaleString()}
                      </strong>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#EEECEC]">
                      <span className="text-[10px] text-gray-500 block">Certified Labor & Setup</span>
                      <strong className="text-sm font-black text-[#1E1B1C] font-mono">
                        KES {activeSolution.servicesTotalInclVatKES.toLocaleString()}
                      </strong>
                    </div>

                    <div className="bg-white p-3 rounded-xl border border-[#EEECEC]">
                      <span className="text-[10px] text-gray-500 block">Itemized 16% VAT</span>
                      <strong className="text-sm font-black text-[#C01E25] font-mono">
                        KES {activeSolution.vatKES.toLocaleString()}
                      </strong>
                    </div>

                    <div className="bg-[#C01E25]/10 p-3 rounded-xl border border-[#C01E25]/30">
                      <span className="text-[10px] text-[#C01E25] block font-bold">Total Payable</span>
                      <strong className="text-base font-black text-[#C01E25] font-mono">
                        KES {activeSolution.grandTotalInclVatKES.toLocaleString()}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* PHASED IMPLEMENTATION ROADMAP */}
                {activeSolution.phasedPath && (
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#F0C9CB]/20 via-white to-[#EEECEC]/30 border border-[#EEECEC] space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#EEECEC] pb-2">
                      <Sparkles className="w-4 h-4 text-[#C01E25]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                        Phased Implementation Roadmap
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1">
                        <span className="text-[10px] font-black uppercase text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>1. Realistically Achieved Today</span>
                        </span>
                        <ul className="text-[11px] text-[#5C4D50] space-y-1">
                          {activeSolution.phasedPath.achievedToday.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-emerald-700 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1">
                        <span className="text-[10px] font-black uppercase text-blue-700 flex items-center gap-1">
                          <Layers className="w-3 h-3" />
                          <span>2. Future Upgrades</span>
                        </span>
                        <ul className="text-[11px] text-[#5C4D50] space-y-1">
                          {activeSolution.phasedPath.futureUpgrades.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-blue-700 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-[#EEECEC] space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#C01E25] flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          <span>3. Cost-Effective Summary</span>
                        </span>
                        <p className="text-[11px] text-[#5C4D50] leading-snug">
                          {activeSolution.phasedPath.costAdvantage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TRUTHFUL ZERO-TECHNICIAN DISCLOSURE & OPERATIONAL STATUS */}
                <div className="p-4 rounded-2xl bg-[#EEECEC]/30 border border-[#EEECEC] space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-[#C01E25]" />
                      <span className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                        Technician Assignment Status: {recommendation.technicianStatus}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 bg-white px-2.5 py-0.5 rounded-full border border-gray-300">
                      Payment Verification Gated
                    </span>
                  </div>
                  <p className="text-xs text-[#5C4D50] leading-relaxed">
                    Your project can proceed to the next stage once payment is verified and an eligible technician from our team is available for assignment. We maintain strict operational integrity: zero fake technician identities or simulated availability are ever displayed.
                  </p>
                </div>

                {/* TIMELINE & WARRANTY */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3.5 rounded-2xl border border-[#EEECEC]">
                    <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C] mb-1">
                      <Clock className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Estimated Timeline</span>
                    </div>
                    <p className="text-[#5C4D50]">{activeSolution.estimatedTimeline} to completion and digital signoff.</p>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-[#EEECEC]">
                    <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C] mb-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Workmanship & Equipment Warranty</span>
                    </div>
                    <p className="text-[#5C4D50]">{activeSolution.warrantyPeriod}. Full 1-year on-site SLA.</p>
                  </div>
                </div>

                {/* LOCK QUOTATION & TRANSFER TO WORKFLOW */}
                <div className="pt-2 border-t border-[#EEECEC] space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#1E1B1C]">
                    Lock Quotation & Transfer Exact Specification into Workflow
                  </h4>

                  {leadSuccessMsg ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <strong>Quotation #{createdQuoteRef || 'HYN-Q-EST'} Locked & Recorded in our Operations Registry!</strong>
                          <p className="text-[11px] text-emerald-800">
                            The exact bill of materials for {activeSolution.tierLabel} (KES {activeSolution.grandTotalInclVatKES.toLocaleString()}) has been transferred to your customer file.
                          </p>
                        </div>
                      </div>
                      <div className="pt-1 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onNavigate('customer-portal')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <span>Open in Customer Portal</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
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
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Lock Quote ({activeSolution.tierLabel})</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Secondary Actions: WhatsApp, Print, Customer Portal */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#EEECEC]">
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/254727547310?text=${encodeURIComponent(
                        `Jambo HYNOVA! I received an AI Recommendation for ${recommendation.packageName} [${activeSolution.tierLabel}] in ${county} (KES ${activeSolution.grandTotalInclVatKES.toLocaleString()}). I would like to proceed with physical engineering survey.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-xs transition-colors cursor-pointer border border-[#25D366]/30"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                      <span>WhatsApp Coordinator (0727 547 310)</span>
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
                      <span>Customer Portal</span>
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
          </main>
        </div>
      </div>

      {/* Mandatory Site Survey Modal */}
      <SiteSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
        initialCounty={county}
        initialInterest={recommendation?.packageName || 'Technology Infrastructure Solution'}
      />
    </div>
  );
};
