import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  Wrench, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall,
  Clock,
  Coins,
  Lock,
  Info,
  Navigation,
  FileText,
  Receipt,
  Headphones,
  CheckSquare
} from 'lucide-react';
import { AppView } from '../types';
import { SITE_SURVEY_POLICY } from '../data/pricingEngine';
import { SiteSurveyModal } from './SiteSurveyModal';

interface HowItWorksViewProps {
  onNavigate: (view: AppView) => void;
  onOpenAI?: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const HowItWorksView: React.FC<HowItWorksViewProps> = ({ 
  onNavigate, 
  onOpenAI, 
  onSelectPrompt 
}) => {
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);

  // Operating Agreement Section 2: Complete 12-Step Customer Journey
  const journeySteps = [
    {
      step: 1,
      title: 'Customer Visits Website',
      phase: 'Discovery',
      desc: 'Customer explores outcome-based packages across security, networking, solar, and smart automation across all 47 counties of Kenya.',
      icon: MessageSquare,
      badge: 'Zero Friction',
    },
    {
      step: 2,
      title: 'Customer Uses HYNOVA AI Advisor',
      phase: 'AI Sizing',
      desc: 'Customer inputs budget, location, and property goals. The AI checks verified pricing data, component compatibility, and margin protection rules.',
      icon: Sparkles,
      badge: '60 Seconds',
    },
    {
      step: 3,
      title: 'Customer Receives Estimated Solution Options',
      phase: 'Options',
      desc: 'Customer receives transparent preliminary Bill of Materials (BOM) itemizing hardware, technician labor, and 1-year warranty reserve.',
      icon: Coins,
      badge: 'Instant Estimate',
    },
    {
      step: 4,
      title: 'Customer Requests Site Survey',
      phase: 'Physical Verification',
      desc: 'Mandatory Rule: Any project requiring physical verification must undergo a site survey. No final quotation shall be issued without a survey.',
      icon: Navigation,
      badge: 'Mandatory Policy',
    },
    {
      step: 5,
      title: 'Customer Pays Site Survey Fee',
      phase: 'Escrow Fee',
      desc: 'Zone A (0–15 KM): KES 1,000 | Zone B (15–40 KM): KES 2,000 | Zone C (40–100 KM): KES 3,500 | Zone D (100+ KM): Custom. Non-refundable; discretionary credit applies.',
      icon: Lock,
      badge: 'M-Pesa Escrow',
    },
    {
      step: 6,
      title: 'Certified Technician Performs Survey',
      phase: 'Site Inspection',
      desc: 'Nearest certified technician matched via Google Maps engine visits the site to verify roof angles, cable run lengths, wall penetrations, and power quality.',
      icon: Wrench,
      badge: 'EPRA / NCA Certified',
    },
    {
      step: 7,
      title: 'Final Quotation Generated',
      phase: 'Engineering BOM',
      desc: 'System generates binding itemized quotation with exact verified hardware SKUs, wholesale distributor pricing, and logistics travel cost.',
      icon: FileText,
      badge: 'Verified Pricing',
    },
    {
      step: 8,
      title: 'Customer Approves Quotation',
      phase: 'Client Approval',
      desc: 'Customer reviews line-by-line itemization and authorizes project commencement with zero hidden fees or broker markups.',
      icon: CheckSquare,
      badge: 'Transparent BOM',
    },
    {
      step: 9,
      title: 'Invoice Issued (16% VAT Compliant)',
      phase: 'Tax Invoicing',
      desc: 'Official tax invoice issued clearly showing Subtotal (Project Cost), 16% VAT, and Total Payable in full compliance with Kenyan tax law.',
      icon: Receipt,
      badge: '16% VAT Compliant',
    },
    {
      step: 10,
      title: 'Project Deployed',
      phase: 'Turnkey Delivery',
      desc: 'Authorized suppliers dispatch genuine serial-verified equipment to site; certified technicians complete mounting, cabling, and live commissioning.',
      icon: ShieldCheck,
      badge: 'Turnkey Execution',
    },
    {
      step: 11,
      title: 'Receipt Issued',
      phase: 'ETR Receipt',
      desc: 'Official electronic receipt automatically generated with receipt number, customer name, project ref, and VAT amount; downloadable as PDF and stored in portal.',
      icon: Receipt,
      badge: 'Automated Receipt',
    },
    {
      step: 12,
      title: 'Customer Support Activated',
      phase: 'Post-Delivery',
      desc: '1-Year workmanship warranty seal, free scheduled quarterly inspections, and 24/7 dedicated engineering helpline activated (0727 547 310).',
      icon: Headphones,
      badge: '1-Year Warranty SLA',
    },
  ];

  return (
    <div className="py-12 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0C9CB]/40 text-xs font-bold text-[#C01E25] mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>OPERATING AGREEMENT VERSION 1.0</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E1B1C] tracking-tight mb-4">
            The 12-Step Customer Journey
          </h1>
          <p className="text-base sm:text-lg text-[#5C4D50] leading-relaxed">
            Customers purchase outcomes. HYNOVA coordinates delivery. From preliminary AI sizing to mandatory site surveys and certified commissioning.
          </p>
        </div>

        {/* Site Survey Policy Highlight Box (Section 3) */}
        <div className="mb-16 bg-gradient-to-br from-[#FFFFFF] via-[#F0C9CB]/25 to-[#EEECEC]/50 rounded-3xl border border-[#DB7D81]/40 p-6 sm:p-10 shadow-xs">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DB7D81]/30 pb-4">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] block">
                  Operating Agreement Section 3
                </span>
                <h2 className="text-2xl font-black text-[#1E1B1C] mt-0.5">
                  Mandatory Site Survey Policy
                </h2>
              </div>

              <button
                onClick={() => setIsSurveyModalOpen(true)}
                className="bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#C01E25]/25 cursor-pointer transition-colors shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Book Certified Site Survey</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#1E1B1C]">
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-white border border-[#EEECEC] space-y-1.5">
                  <strong className="text-[#C01E25] block font-black">Mandatory Rule</strong>
                  <p className="text-[#5C4D50] leading-relaxed">
                    Any project requiring physical verification must undergo a site survey. No final quotation shall be issued without a survey where required.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[#EEECEC] space-y-1.5">
                  <strong className="text-[#1E1B1C] block font-bold">Policy Purpose</strong>
                  <ul className="space-y-1 text-[#5C4D50]">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Filters unserious inquiries</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Reduces quotation abuse</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Protects technician time & safety</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Improves quotation accuracy & commitment</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Travel Zones Card */}
              <div className="bg-white p-5 rounded-2xl border border-[#EEECEC] space-y-3">
                <strong className="text-[#1E1B1C] block font-bold text-sm">
                  Google Maps Travel Zones & Fee Schedule
                </strong>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC]">
                    <div>
                      <span className="font-extrabold text-[#1E1B1C] block">Zone A (0–15 KM)</span>
                      <span className="text-[11px] text-[#5C4D50]">No travel surcharge • Same-day dispatch</span>
                    </div>
                    <span className="font-black text-[#C01E25] text-sm">KES 1,000</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC]">
                    <div>
                      <span className="font-extrabold text-[#1E1B1C] block">Zone B (15–40 KM)</span>
                      <span className="text-[11px] text-[#5C4D50]">Travel surcharge applies • 24–48h SLA</span>
                    </div>
                    <span className="font-black text-[#C01E25] text-sm">KES 2,000</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC]">
                    <div>
                      <span className="font-extrabold text-[#1E1B1C] block">Zone C (40–100 KM)</span>
                      <span className="text-[11px] text-[#5C4D50]">Extended deployment pricing</span>
                    </div>
                    <span className="font-black text-[#C01E25] text-sm">KES 3,500</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC]">
                    <div>
                      <span className="font-extrabold text-[#1E1B1C] block">Zone D (100+ KM)</span>
                      <span className="text-[11px] text-[#5C4D50]">Custom logistics assessment</span>
                    </div>
                    <span className="font-bold text-[#8F7B7F] text-xs">Custom Fee</span>
                  </div>
                </div>
                <p className="text-[10px] text-[#8F7B7F] italic pt-1">
                  * Site survey fees are non-refundable. Fees may be credited toward project cost at HYNOVA's discretion.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 12-Step Customer Journey Grid */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
              Standard Operating Procedure
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B1C] mt-2">
              The 12 Operational Milestones
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {journeySteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.step}
                  className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all hover:shadow-md flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="w-8 h-8 rounded-xl bg-[#F0C9CB] text-[#C01E25] font-black text-xs flex items-center justify-center">
                        {s.step < 10 ? `0${s.step}` : s.step}
                      </span>
                      <span className="text-[10px] font-bold text-[#C01E25] bg-[#F0C9CB]/35 px-2.5 py-0.5 rounded-full">
                        {s.badge}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#EEECEC] text-[#1E1B1C] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#C01E25]" />
                      </div>
                      <h3 className="text-base font-extrabold text-[#1E1B1C] leading-snug">
                        {s.title}
                      </h3>
                    </div>

                    <p className="text-xs text-[#5C4D50] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#EEECEC] mt-4 flex items-center justify-between text-[11px] text-[#8F7B7F]">
                    <span>Phase: <strong className="text-[#1E1B1C]">{s.phase}</strong></span>
                    {s.step === 4 || s.step === 5 ? (
                      <button
                        onClick={() => setIsSurveyModalOpen(true)}
                        className="text-[#C01E25] font-bold hover:underline cursor-pointer"
                      >
                        Book Survey →
                      </button>
                    ) : s.step === 2 ? (
                      <button
                        onClick={() => onNavigate('ai-recommendation')}
                        className="text-[#C01E25] font-bold hover:underline cursor-pointer"
                      >
                        Launch AI →
                      </button>
                    ) : (
                      <span className="text-xs">Step {s.step} of 12</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#FFFFFF] via-[#F0C9CB]/30 to-[#EEECEC]/50 rounded-3xl border border-[#DB7D81]/40 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C]">
            Ready to Begin Step 1?
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4D50] max-w-xl mx-auto">
            Use the HYNOVA AI Advisor to calculate preliminary solution options, or schedule a certified physical site survey directly.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('ai-recommendation')}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-xl flex items-center gap-2 shadow-md shadow-[#C01E25]/25 cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Step 2: AI Sizing Advisor</span>
            </button>

            <button
              onClick={() => setIsSurveyModalOpen(true)}
              className="bg-white hover:bg-[#EEECEC] text-[#1E1B1C] border border-[#EEECEC] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Navigation className="w-4 h-4 text-[#C01E25]" />
              <span>Step 4: Request Site Survey</span>
            </button>
          </div>
        </div>
      </div>

      {/* Site Survey Modal */}
      <SiteSurveyModal
        isOpen={isSurveyModalOpen}
        onClose={() => setIsSurveyModalOpen(false)}
      />
    </div>
  );
};
