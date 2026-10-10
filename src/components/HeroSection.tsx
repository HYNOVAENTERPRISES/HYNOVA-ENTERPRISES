import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  MessageCircle, 
  ShieldCheck, 
  CheckCircle2, 
  SlidersHorizontal,
  Wrench,
  ChevronDown
} from 'lucide-react';
import { AppView } from '../types';

interface HeroSectionProps {
  onNavigate: (view: AppView) => void;
  selectedCounty: string;
  onQuickPrompt: (prompt: string) => void;
  onScrollToWidget?: () => void;
  onOpenLoginModal?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  selectedCounty,
  onQuickPrompt,
  onScrollToWidget,
  onOpenLoginModal,
}) => {
  const [quickInput, setQuickInput] = useState('');

  const samplePrompts = [
    'I want to secure my home.',
    'I need WiFi for my apartment.',
    'I am building a house.',
    'I need solar backup.',
    'I want CCTV for my shop.',
    'I want to automate my business.',
    'I am developing apartments.',
    'I need access control.',
  ];

  const handleWhatsAppClick = () => {
    const msg = encodeURIComponent("Jambo HYNOVA! I would like to inquire about a practical technology solution for my budget.");
    window.open(`https://wa.me/254727547310?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handlePrimaryClick = () => {
    if (onScrollToWidget) {
      onScrollToWidget();
    } else {
      onNavigate('ai-recommendation');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickInput.trim()) {
      onQuickPrompt(quickInput.trim());
      handlePrimaryClick();
    } else {
      handlePrimaryClick();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFFFFF] via-[#EEECEC]/30 to-[#FFFFFF] pt-12 pb-16 sm:pt-16 sm:pb-20 border-b border-[#EEECEC]">
      {/* Subtle brand ambient glow */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[720px] h-[320px] bg-gradient-to-tr from-[#F0C9CB]/40 via-[#E8ADB0]/20 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Micro trust badge & warm Kenyan greeting */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEECEC] border border-[#E8ADB0]/50 text-xs font-semibold text-[#C01E25] mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C01E25]" />
            <span className="font-bold">Tuambie Unataka Kufanikisha Nini</span>
            <span className="w-1 h-1 rounded-full bg-[#DB7D81]" />
            <span className="text-[#5C4D50]">{selectedCounty} • All 47 Counties</span>
          </div>

          {/* MASTER HOMEPAGE HEADLINE */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#1E1B1C] leading-[1.15] mb-6">
            Technology Solutions <br />
            <span className="text-[#C01E25]">Built Around You</span>
          </h1>

          {/* MASTER HOMEPAGE SUBHEADLINE */}
          <p className="text-lg sm:text-xl text-[#5C4D50] font-normal leading-relaxed mb-8 max-w-2xl mx-auto">
            Tell us what you need, what you are trying to achieve, and what you are working with. We help you find a practical technology solution tailored to your budget.
          </p>

          {/* SECTION 1 CTAs: PRIMARY & SECONDARY */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8">
            <button
              id="hero-primary-cta"
              onClick={handlePrimaryClick}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-base shadow-lg shadow-[#C01E25]/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>Get Our Recommendation</span>
            </button>

            <button
              id="hero-secondary-whatsapp-cta"
              onClick={handleWhatsAppClick}
              className="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#FFFFFF] hover:bg-[#25D366]/10 text-[#1E1B1C] hover:text-[#128C7E] border border-[#25D366]/40 font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <MessageCircle className="w-5 h-5 fill-[#25D366] text-[#25D366]" />
              <span>Talk to Us on WhatsApp</span>
            </button>
          </div>

          {/* Conversational problem box: "What are you trying to solve?" */}
          <div className="bg-[#FFFFFF] p-5 sm:p-6 rounded-3xl border border-[#DB7D81]/40 shadow-lg shadow-[#C01E25]/5 max-w-2xl mx-auto text-left mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#C01E25]" />
                <span>What are you trying to solve?</span>
              </span>
              <span className="text-[11px] font-bold text-[#5C4D50] bg-[#EEECEC] px-2 py-0.5 rounded-full">
                Starting from KES 5,000+
              </span>
            </div>

            {/* Quick Problem Search Input */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="bg-[#EEECEC]/40 p-1.5 rounded-2xl border border-[#EEECEC] flex flex-col sm:flex-row items-center gap-2 transition-all focus-within:border-[#C01E25] focus-within:bg-[#FFFFFF]">
                <div className="flex items-center gap-2 w-full px-3 py-1.5">
                  <Sparkles className="w-4 h-4 text-[#C01E25] shrink-0" />
                  <input
                    id="hero-quick-problem-input"
                    type="text"
                    value={quickInput}
                    onChange={(e) => setQuickInput(e.target.value)}
                    placeholder="Tell us what you want to achieve, or click an option below..."
                    className="w-full text-xs sm:text-sm text-[#1E1B1C] placeholder-[#8F7B7F] bg-transparent outline-none"
                  />
                </div>
                <button
                  id="hero-quick-submit-btn"
                  type="submit"
                  className="w-full sm:w-auto shrink-0 bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Size Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Prompts list + Prominent "I don't know what I need. Help me." button */}
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      onQuickPrompt(prompt);
                      handlePrimaryClick();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#EEECEC]/70 hover:bg-[#F0C9CB]/50 text-[#1E1B1C] text-xs font-semibold border border-[#EEECEC] transition-colors cursor-pointer text-left"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Extremely prominent option: "I don't know what I need. Help me." */}
              <button
                type="button"
                onClick={() => {
                  onQuickPrompt("I don't know what I need. Help me.");
                  handlePrimaryClick();
                }}
                className="w-full mt-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F0C9CB]/60 via-[#E8ADB0]/30 to-[#F0C9CB]/60 hover:from-[#F0C9CB] hover:to-[#E8ADB0]/60 border border-[#C01E25]/30 text-[#C01E25] text-xs font-extrabold flex items-center justify-between transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C01E25] shrink-0" />
                  <span>🤔 I don&apos;t know what I need. Help me.</span>
                </div>
                <span className="text-[11px] underline group-hover:translate-x-0.5 transition-transform">
                  Guide me step-by-step →
                </span>
              </button>
            </div>
          </div>

          {/* TERTIARY CTA: Customer Login */}
          {onOpenLoginModal && (
            <div className="pt-3 text-center">
              <button
                type="button"
                id="hero-tertiary-login-cta"
                onClick={onOpenLoginModal}
                className="text-xs text-[#5C4D50] hover:text-[#C01E25] font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Already have an active project?</span>
                <span className="font-bold text-[#C01E25] underline">Customer Login →</span>
              </button>
            </div>
          )}

          {/* Micro trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-xs text-[#5C4D50]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
              <span>100% Free Instant Sizing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
              <span>Zero Login Required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
              <span>M-Pesa Escrow Protection</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
