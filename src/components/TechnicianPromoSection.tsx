import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  UserCheck, 
  CheckCircle2, 
  Sparkles,
  Lock,
  PhoneCall
} from 'lucide-react';
import { AppView } from '../types';

interface TechnicianPromoSectionProps {
  onNavigate: (view: AppView) => void;
  onOpenAI?: () => void;
  onOpenContact?: () => void;
}

export const TechnicianPromoSection: React.FC<TechnicianPromoSectionProps> = ({
  onNavigate,
  onOpenAI,
  onOpenContact,
}) => {
  return (
    <section id="vetted-technicians-trust" className="py-16 bg-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#FFFFFF] via-[#F0C9CB]/15 to-[#EEECEC]/40 rounded-3xl border border-[#DB7D81]/40 p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/50 px-3 py-1 rounded-full inline-block">
                Trust & Verification Guarantee
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] tracking-tight leading-tight">
                Installed by <span className="text-[#C01E25]">Vetted & Certified</span> Kenyan Engineers
              </h2>

              <p className="text-sm sm:text-base text-[#5C4D50] leading-relaxed">
                You never have to wonder who is entering your home or business. Every HYNOVA installation is conducted by rigorously screened, licensed technicians under strict safety oversight.
              </p>

              {/* 3 Core Trust Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                  <div className="w-8 h-8 rounded-xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center mb-2">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#1E1B1C] mb-1">National ID Verified</h4>
                  <p className="text-[11px] text-[#5C4D50] leading-snug">
                    Full background checks and police clearance verified before any site dispatch.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                  <div className="w-8 h-8 rounded-xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center mb-2">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#1E1B1C] mb-1">EPRA & NCA Licensed</h4>
                  <p className="text-[11px] text-[#5C4D50] leading-snug">
                    Solar, electrical, and telecommunications work performed to national regulatory codes.
                  </p>
                </div>

                <div className="bg-[#FFFFFF] p-4 rounded-2xl border border-[#EEECEC]">
                  <div className="w-8 h-8 rounded-xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center mb-2">
                    <Lock className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-extrabold text-[#1E1B1C] mb-1">100% Escrow Protected</h4>
                  <p className="text-[11px] text-[#5C4D50] leading-snug">
                    Funds released only after you test the system and sign off on completion.
                  </p>
                </div>
              </div>

              {/* Action Buttons: strictly Customer Journey */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => {
                    if (onOpenAI) {
                      onOpenAI();
                    } else {
                      onNavigate('ai-recommendation');
                    }
                  }}
                  className="px-6 py-3.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-xs sm:text-sm shadow-md shadow-[#C01E25]/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get AI Solution for My Property</span>
                </button>

                <button
                  onClick={() => {
                    const text = encodeURIComponent("Jambo HYNOVA! I would like to speak with an engineer about an installation for my property.");
                    window.open(`https://wa.me/254727547310?text=${text}`, '_blank', 'noopener,noreferrer');
                  }}
                  className="px-5 py-3.5 rounded-xl bg-[#FFFFFF] hover:bg-[#EEECEC] text-[#1E1B1C] border border-[#EEECEC] font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4 text-[#C01E25]" />
                  <span>Talk to an Advisor</span>
                </button>
              </div>
            </div>

            {/* Right Side: Visual Trust Badge */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 shadow-md space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-[#EEECEC]">
                  <div className="w-12 h-12 rounded-2xl bg-[#C01E25] text-white flex items-center justify-center font-black">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#C01E25] uppercase block">HYNOVA Quality Seal</span>
                    <span className="text-sm sm:text-base font-black text-[#1E1B1C]">1-Year Workmanship Warranty</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-[#5C4D50]">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                    <span>Free follow-up inspection within 30 days of installation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                    <span>Real-time digital commissioning certificate stored in your Customer Portal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                    <span>Direct replacement support for all manufacturer-warranted equipment</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#EEECEC]/50 border border-[#EEECEC] text-center">
                  <span className="text-[11px] font-bold text-[#1E1B1C]">
                    Active across Nairobi, Kiambu, Nakuru, Mombasa, Eldoret & nationwide
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
