import React from 'react';
import { Sparkles, MessageCircle, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppView } from '../types';

interface FinalConversionSectionProps {
  onNavigate: (view: AppView) => void;
  onScrollToWidget?: () => void;
}

export const FinalConversionSection: React.FC<FinalConversionSectionProps> = ({
  onNavigate,
  onScrollToWidget,
}) => {
  const handleWhatsAppClick = () => {
    const msg = encodeURIComponent("Jambo HYNOVA! I'm ready to find the right technology solution for my budget.");
    window.open(`https://wa.me/254727547310?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handlePrimaryClick = () => {
    if (onScrollToWidget) {
      onScrollToWidget();
    } else {
      onNavigate('ai-recommendation');
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-[#FFFFFF] via-[#F0C9CB]/25 to-[#EEECEC]/60 border-b border-[#EEECEC] relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-[#F0C9CB]/50 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#FFFFFF] px-3.5 py-1.5 rounded-full border border-[#EEECEC] shadow-xs inline-block mb-6">
          Section 9 • Start Your Project Today
        </span>

        {/* SECTION 9 HEADLINE */}
        <h2 className="text-3xl sm:text-5xl font-black text-[#1E1B1C] tracking-tight mb-6 leading-tight">
          Ready to Find the Right <span className="text-[#C01E25]">Technology Solution?</span>
        </h2>

        {/* SUBTITLE */}
        <p className="text-base sm:text-lg text-[#5C4D50] leading-relaxed max-w-2xl mx-auto mb-10">
          Get an instant, itemized quotation matched to your exact budget in 60 seconds with zero commitment. Or connect directly with a technical engineer on WhatsApp.
        </p>

        {/* PRIMARY & SECONDARY CONVERSION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          {/* PRIMARY BUTTON: Get Recommendation */}
          <button
            id="final-conversion-primary-cta"
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-black text-base shadow-lg shadow-[#C01E25]/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Sparkles className="w-5 h-5" />
            <span>Get Recommendation</span>
          </button>

          {/* SECONDARY BUTTON: WhatsApp Us */}
          <button
            id="final-conversion-whatsapp-cta"
            onClick={handleWhatsAppClick}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-[#FFFFFF] font-black text-base shadow-lg shadow-[#25D366]/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>WhatsApp Us</span>
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-xs text-[#5C4D50] font-semibold">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
            <span>Free Instant Sizing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
            <span>100% Escrow Protection</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
            <span>Vetted Technicians & Standardized Codes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
