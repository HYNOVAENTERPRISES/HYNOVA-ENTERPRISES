import React from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  MessageSquare, 
  CheckSquare, 
  Wrench, 
  Lock, 
  PhoneCall,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import { AppView } from '../types';

export interface StepDetailData {
  number: string;
  title: string;
  tagline: string;
  icon: any;
  summary: string;
  detailedProcess: string[];
  kenyanSafeguards: string[];
  turnaroundTime: string;
  deliverables: string[];
  ctaLabel: string;
  ctaActionView?: AppView;
  ctaQuickPrompt?: string;
}

interface StepDetailModalProps {
  isOpen: boolean;
  stepData: StepDetailData | null;
  onClose: () => void;
  onNavigate: (view: AppView) => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const StepDetailModal: React.FC<StepDetailModalProps> = ({
  isOpen,
  stepData,
  onClose,
  onNavigate,
  onSelectPrompt,
}) => {
  if (!isOpen || !stepData) return null;

  const Icon = stepData.icon;

  const handleAction = () => {
    if (stepData.ctaQuickPrompt && onSelectPrompt) {
      onSelectPrompt(stepData.ctaQuickPrompt);
    }
    if (stepData.ctaActionView) {
      onNavigate(stepData.ctaActionView);
    } else {
      onNavigate('ai-recommendation');
    }
    onClose();
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Jambo HYNOVA! I was reading about Step ${stepData.number} (${stepData.title}) on the website and would like technical guidance.`
    );
    window.open(`https://wa.me/254727547310?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B1C]/70 backdrop-blur-xs animate-in fade-in-50">
      <div 
        className="bg-[#FFFFFF] border border-[#EEECEC] rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95"
        role="dialog"
        aria-modal="true"
        aria-labelledby="step-detail-title"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C01E25] to-[#DB7D81] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full text-white">
              Step {stepData.number} of 4 • HYNOVA Process
            </span>
            <span className="text-xs text-white/80 flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              {stepData.turnaroundTime}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h2 id="step-detail-title" className="text-xl sm:text-2xl font-black text-white">
                {stepData.title}
              </h2>
              <p className="text-xs sm:text-sm text-white/90">
                {stepData.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Summary */}
          <div className="bg-[#EEECEC]/40 border border-[#EEECEC] rounded-2xl p-4">
            <p className="text-xs sm:text-sm text-[#5C4D50] leading-relaxed">
              {stepData.summary}
            </p>
          </div>

          {/* Operational Workflow */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#C01E25]" />
              <span>What Happens Behind The Scenes</span>
            </h3>
            <div className="space-y-2">
              {stepData.detailedProcess.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#FFFFFF] border border-[#EEECEC] text-xs text-[#1E1B1C]">
                  <span className="w-5 h-5 rounded-full bg-[#F0C9CB]/60 text-[#C01E25] font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Deliverables & Safeguards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25]" />
                <span>Verified Deliverables</span>
              </h4>
              <ul className="space-y-1.5">
                {stepData.deliverables.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#5C4D50] flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C01E25] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1E1B1C] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                <span>Kenyan Market Safeguards</span>
              </h4>
              <ul className="space-y-1.5">
                {stepData.kenyanSafeguards.map((item, idx) => (
                  <li key={idx} className="text-xs text-[#5C4D50] flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 border-t border-[#EEECEC] flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleAction}
              className="flex-1 min-h-[48px] px-6 py-3.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{stepData.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Speak to Engineer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
