import React from 'react';
import { 
  Coins, 
  ShieldCheck, 
  Wrench, 
  BrainCircuit, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { AppView } from '../types';

interface WhyHynovaSectionProps {
  onNavigate: (view: AppView) => void;
}

export const WhyHynovaSection: React.FC<WhyHynovaSectionProps> = ({ onNavigate }) => {
  // 5 Pillars updated per HYNOVA Data Integrity & Trust Framework
  const pillars = [
    {
      id: 'affordable',
      title: 'Affordable',
      subtitle: 'Direct Wholesale Pricing & Transparency',
      icon: Coins,
      description: 'We aim to cut out middlemen markups by routing genuine equipment directly from authorized hardware distributors with transparent, itemized KES quotations.',
      points: [
        'Direct wholesale distributor pricing',
        'Transparent itemized Bill of Materials (BOM)',
        'Zero hidden broker markups',
      ],
    },
    {
      id: 'trusted',
      title: 'Trusted',
      subtitle: '100% Escrow Protection',
      icon: ShieldCheck,
      description: 'Protecting your investment with verified transparency. Project funds are held securely in Safaricom M-Pesa escrow and only disbursed after customer inspection and sign-off.',
      points: [
        'Safaricom M-Pesa protected escrow',
        'Hardware serial number verification',
        'Transparent dispute resolution process',
      ],
    },
    {
      id: 'certified',
      title: 'Certified Technicians',
      subtitle: 'Workforce Development',
      icon: Wrench,
      description: 'We are building a pathway that can create opportunities for thousands of certified technicians across Kenya through standardized safety, code compliance, and credential checks.',
      points: [
        'Skills evaluation & identity verification',
        'Standards alignment with electrical codes',
        'Milestone-based customer handover sign-off',
      ],
    },
    {
      id: 'smart-sizing',
      title: 'Objective Sizing',
      subtitle: 'Data-Driven Engineering Guidance',
      icon: BrainCircuit,
      description: 'We provide objective guidance, estimating solar loads, energy needs, and camera coverage angles in seconds to generate transparent, code-compliant specifications.',
      points: [
        'Instant preliminary BOM estimates',
        'Guidance tailored to your stated budget',
        'No pressure, commitment-free quotes',
      ],
    },
    {
      id: 'nationwide',
      title: 'Infrastructure Vision',
      subtitle: 'County Inclusion Across Kenya',
      icon: MapPin,
      description: 'We envision a future where every county in Kenya has access to trusted technology infrastructure through our ecosystem.',
      points: [
        'Aiming to bridge urban-rural digital gaps',
        'Empowering local county-based technician talent',
        'Decentralized technology access for all 47 counties',
      ],
    },
  ];

  return (
    <section className="py-20 bg-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
            Our Advantage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] mt-3 mb-4 tracking-tight">
            Why Work With Us
          </h2>
          <p className="text-[#5C4D50] text-base sm:text-lg">
            Built on our foundational commitment: Earn trust through transparency. Underpromise, deliver, and grow with integrity.
          </p>
        </div>

        {/* Operating Agreement Section 1: Core Positioning Directive */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1E1B1C] via-[#2D2427] to-[#1E1B1C] text-[#FFFFFF] shadow-xl border border-[#EEECEC]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-48 h-48 bg-[#C01E25]/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF]/10 backdrop-blur-xs text-[11px] font-black uppercase tracking-wider text-[#F0C9CB] mb-3">
              <Sparkles className="w-3 h-3 text-[#DB7D81]" />
              <span>Our Core Positioning</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#FFFFFF] tracking-tight leading-snug mb-3">
              We are not just a CCTV company. We are not just a solar company. We are not just a networking company.
            </h3>

            <p className="text-sm sm:text-base text-[#EEECEC] font-normal leading-relaxed mb-6">
              <strong className="text-[#FFFFFF] font-extrabold">We are HYNOVA ENTERPRISES — Kenya&apos;s AI Powered Technology Fulfillment Network.</strong> Our role is to connect{' '}
              <span className="text-[#F0C9CB] font-bold">Customers</span>,{' '}
              <span className="text-[#F0C9CB] font-bold">AI Recommendations</span>,{' '}
              <span className="text-[#F0C9CB] font-bold">Certified Technicians</span>,{' '}
              <span className="text-[#F0C9CB] font-bold">Suppliers</span>, and{' '}
              <span className="text-[#F0C9CB] font-bold">Infrastructure Solutions</span> into one seamless ecosystem across Kenya&apos;s 47 counties.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="bg-[#FFFFFF]/15 backdrop-blur-md px-4 py-2 rounded-xl border border-[#FFFFFF]/20 text-[#FFFFFF] font-extrabold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>Customers purchase outcomes.</span>
              </div>
              <div className="bg-[#C01E25] px-4 py-2 rounded-xl text-[#FFFFFF] font-extrabold shadow-sm flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                <span>We coordinate delivery.</span>
              </div>
            </div>
          </div>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-12">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                id={`why-hynova-${pillar.id}`}
                className="bg-gradient-to-b from-[#FFFFFF] to-[#EEECEC]/30 p-6 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#F0C9CB]/50 group-hover:bg-[#C01E25] text-[#C01E25] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors mb-4">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-black text-[#1E1B1C] mb-1">
                    {pillar.title}
                  </h3>

                  <div className="text-xs font-bold text-[#C01E25] mb-3">
                    {pillar.subtitle}
                  </div>

                  <p className="text-xs text-[#5C4D50] leading-relaxed mb-4">
                    {pillar.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-[#EEECEC]">
                    {pillar.points.map((pt, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#1E1B1C]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25] shrink-0 mt-0.5" />
                        <span className="leading-tight">{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with HYNOVA Trust Statement */}
        <div className="bg-gradient-to-r from-[#EEECEC] via-[#F0C9CB]/30 to-[#EEECEC] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C01E25] text-[#FFFFFF] flex items-center justify-center shrink-0 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="font-extrabold text-sm sm:text-base text-[#1E1B1C]">
                "Earn trust through transparency. Underpromise, deliver, and grow with integrity."
              </div>
              <div className="text-xs text-[#5C4D50] mt-0.5">
                Every project quotation is an itemized estimate, secured by client-verified M-Pesa escrow.
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai-recommendation')}
            className="shrink-0 bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-6 py-3.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Get Transparent Estimate</span>
          </button>
        </div>
      </div>
    </section>
  );
};
