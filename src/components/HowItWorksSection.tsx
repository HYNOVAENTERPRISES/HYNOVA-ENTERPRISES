import React, { useState } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  CheckSquare, 
  Wrench, 
  ArrowRight, 
  ShieldCheck,
  Zap,
  Info,
  Lock,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { AppView } from '../types';
import { StepDetailModal, StepDetailData } from './StepDetailModal';

interface HowItWorksSectionProps {
  onNavigate: (view: AppView) => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ 
  onNavigate,
  onSelectPrompt,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [modalStep, setModalStep] = useState<StepDetailData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Exact 4 steps with rich operational transparency
  const steps: (StepDetailData & { summary: string; details: string; kenyanContext: string })[] = [
    {
      number: '1',
      title: 'Describe Your Need',
      tagline: 'Simple 4-question input tailored for Kenyan homes and businesses',
      icon: MessageSquare,
      summary: 'Input your budget, county location, property type, and specific infrastructure requirement in plain English.',
      details: 'Whether you want to explore solar backup to reduce power disruptions, install CCTV perimeter security, or set up reliable Wi-Fi, share your goals without technical jargon or equipment complexity.',
      kenyanContext: 'Designed to support residential homes, commercial businesses, schools, and community institutions across all 47 counties.',
      detailedProcess: [
        'Select your county (Nairobi, Kiambu, Mombasa, Nakuru, Kisumu, or any of the 47 counties)',
        'Choose your property type: Residential Villa, Apartment, Retail Shop, School, Hospital, or Rural Farm',
        'State your infrastructure goal: Solar Blackout Immunity, 24/7 Smart CCTV Security, Starlink Wi-Fi, or Gate Automation',
        'Input your anticipated budget envelope or select from our verified market ranges',
      ],
      kenyanSafeguards: [
        'Zero personal financial info required to size systems',
        'Location-adjusted solar insolation maps for Kenya (peak sun hours per county)',
        'Local KPLC blackout frequency baselines taken into calculation',
      ],
      turnaroundTime: 'Instant (30 Seconds)',
      deliverables: [
        'Tailored preliminary solution architecture',
        'Real-time component compatibility calculation',
        'Clear starting budget comparison',
      ],
      ctaLabel: 'Start Step 1: Instant Sizing',
      ctaActionView: 'ai-recommendation',
    },
    {
      number: '2',
      title: 'Receive Tailored Recommendation',
      tagline: 'Turnkey Bill of Materials (BOM) with 2026 Kenyan distributor pricing',
      icon: Sparkles,
      summary: 'HYNOVA analyzes your parameters and generates a transparent itemized preliminary Bill of Materials (BOM).',
      details: 'Our sizing engine estimates solar yields, equipment compatibility, inverter sizing, and compares benchmark distributor pricing for a clear preliminary Bill of Materials.',
      kenyanContext: 'Designed to align with recognized EPRA electrical safety and NCA construction installation codes.',
      detailedProcess: [
        'Algorithmic load analysis calculates exact inverter kVA and LiFePO4 battery storage capacity',
        'Automated bill of materials generated with Tier-1 components (Hikvision, Deye, Pylontech, Jinko)',
        'Itemized pricing separating genuine wholesale hardware cost from certified technician installation labor',
        'Interactive 4-tier budget packages (Entry, Standard, Professional, Enterprise) for direct comparison',
      ],
      kenyanSafeguards: [
        'Wholesale pricing cross-referenced with Nairobi authorized distributors',
        'EPRA/NCA standard compliance guarantees on inverter & cable sizing',
        'Zero hidden fees — transparent line-by-line itemization',
      ],
      turnaroundTime: 'Instant (Under 5 Seconds)',
      deliverables: [
        'Preliminary Bill of Materials (BOM) with model numbers',
        'Equipment vs. Labor transparent cost breakdown',
        'Downloadable or WhatsApp-shareable project specification',
      ],
      ctaLabel: 'Generate My Recommendation',
      ctaActionView: 'ai-recommendation',
    },
    {
      number: '3',
      title: 'Confirm Your Package',
      tagline: 'Zero financial risk with Safaricom M-Pesa escrow protection',
      icon: CheckSquare,
      summary: 'Review upfront transparent KES pricing, milestone breakdown, and escrow protection.',
      details: 'Review your quotation with complete transparency. Your funds remain safeguarded in Safaricom M-Pesa escrow until you inspect the hardware and approve the completed on-site commissioning.',
      kenyanContext: 'Clear itemized estimates. Upfront transparency before technician dispatch.',
      detailedProcess: [
        'Review your itemized quotation and approve milestone disbursement terms',
        'Deposit project funds into verified Safaricom M-Pesa Escrow (Paybill / Till account)',
        'Supplier receives verified hardware dispatch order with zero cash risk to the buyer',
        'Technician assigned with verified serial numbers matching your invoice',
      ],
      kenyanSafeguards: [
        'Buyer funds NEVER handed directly to contractors before commissioning',
        'Full dispute mediation by HYNOVA technology compliance engineers',
        'Milestone-locked payments released strictly upon your written or phone authorization',
      ],
      turnaroundTime: 'Same Day Commitment',
      deliverables: [
        'Official HYNOVA Escrow Contract & Milestone Schedule',
        'M-Pesa Escrow Receipt with Safaricom Transaction ID',
        'Assigned Lead Engineer & Certified Technician Profiles',
      ],
      ctaLabel: 'Review Packages & Escrow Protection',
      ctaActionView: 'how-it-works',
    },
    {
      number: '4',
      title: 'Certified Technician Delivers',
      tagline: 'Vetted EPRA/NCA engineers, live commissioning & 1-year warranty',
      icon: Wrench,
      summary: 'A vetted, licensed technician arrives with genuine hardware for certified on-site installation.',
      details: 'Verify equipment serial numbers, inspect physical wiring, and test performance before signing off to authorize the release of escrow funds.',
      kenyanContext: 'Technicians undergo identity verification, skills assessment, and code compliance checks prior to dispatch.',
      detailedProcess: [
        'Vetted, background-checked technician arrives at your site with genuine distributor hardware',
        'On-site structural & electrical safety verification conducted prior to drilling or mounting',
        'Professional installation adhering strictly to EPRA / NCA cabling & earthing codes',
        'Live system test: full load test under simulated power cuts and mobile app telemetry pairing',
        'Customer signs physical & digital commissioning certificate to authorize escrow release',
      ],
      kenyanSafeguards: [
        '100% EPRA / NCA certified lead installation technicians',
        '1-Year workmanship warranty seal backed by HYNOVA platform guarantee',
        'Genuine distributor serial verification preventing counterfeit hardware',
      ],
      turnaroundTime: '24 – 48 Hours Across Kenya',
      deliverables: [
        'Handover Commissioning Certificate with verified serial numbers',
        '1-Year Workmanship Warranty Card',
        'Smartphone App Setup & User Training Session',
      ],
      ctaLabel: 'Book Certified Technician',
      ctaActionView: 'contact',
    },
  ];

  const handleOpenStepModal = (step: StepDetailData, idx: number) => {
    setActiveStep(idx);
    setModalStep(step);
    setIsModalOpen(true);
  };

  return (
    <section className="py-20 bg-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
            Section 3 • Effortless Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] mt-3 mb-4 tracking-tight">
            How HYNOVA Works
          </h2>
          <p className="text-[#5C4D50] text-base sm:text-lg">
            A simple 4-step workflow connecting your budget to certified technology delivery anywhere in Kenya. Click any step to inspect the full operational breakdown.
          </p>
        </div>

        {/* 4 Steps Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.number}
                id={`how-it-works-step-${step.number}`}
                onClick={() => handleOpenStepModal(step, idx)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer text-left relative flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-[#FFFFFF] border-[#C01E25] shadow-lg shadow-[#C01E25]/10 scale-[1.02]'
                    : 'bg-[#FFFFFF] border-[#EEECEC] hover:border-[#DB7D81]/60 hover:bg-[#EEECEC]/20'
                }`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleOpenStepModal(step, idx);
                  }
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-[#C01E25] text-[#FFFFFF]' : 'bg-[#EEECEC] text-[#5C4D50]'
                    }`}>
                      Step {step.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#F0C9CB] text-[#C01E25]' : 'bg-[#EEECEC] text-[#5C4D50]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-[#1E1B1C] mb-2">{step.title}</h3>
                  <p className="text-xs text-[#5C4D50] leading-relaxed mb-4">{step.summary}</p>
                </div>

                {/* Explicitly Clickable CTA Button */}
                <button
                  type="button"
                  id={`learn-details-step-${step.number}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenStepModal(step, idx);
                  }}
                  className="w-full text-xs font-extrabold text-[#C01E25] hover:text-[#FFFFFF] bg-[#F0C9CB]/40 hover:bg-[#C01E25] py-2 px-3 rounded-xl flex items-center justify-between transition-all cursor-pointer shadow-2xs group/btn mt-2"
                  aria-label={`Learn details about Step ${step.number}: ${step.title}`}
                >
                  <span className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Learn details</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Step Expanded Details */}
        <div className="bg-[#EEECEC]/40 rounded-3xl p-6 sm:p-8 border border-[#EEECEC] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#C01E25] uppercase tracking-wider">
                Step {steps[activeStep].number} in Detail
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#DB7D81]" />
              <span className="text-xs font-bold text-[#1E1B1C]">
                {steps[activeStep].title}
              </span>
            </div>
            <p className="text-sm text-[#5C4D50] leading-relaxed">
              {steps[activeStep].details}
            </p>
            <div className="text-xs font-semibold text-[#1E1B1C] flex items-center gap-1.5 pt-1">
              <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
              <span>{steps[activeStep].kenyanContext}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenStepModal(steps[activeStep], activeStep)}
              className="bg-[#FFFFFF] hover:bg-[#EEECEC] text-[#1E1B1C] border border-[#EEECEC] text-xs sm:text-sm font-bold px-4 py-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Info className="w-4 h-4 text-[#C01E25]" />
              <span>Full Step Specs</span>
            </button>

            <button
              onClick={() => onNavigate('ai-recommendation')}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs sm:text-sm font-bold px-6 py-3.5 rounded-xl shadow-md shadow-[#C01E25]/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Try HYNOVA Workflow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Step Detail Modal */}
      <StepDetailModal
        isOpen={isModalOpen}
        stepData={modalStep}
        onClose={() => setIsModalOpen(false)}
        onNavigate={onNavigate}
        onSelectPrompt={onSelectPrompt}
      />
    </section>
  );
};

