import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Wifi, 
  BrainCircuit, 
  Building2, 
  Cpu, 
  Lock, 
  Check, 
  Sparkles, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { AppView } from '../types';
import { SOLUTION_CATEGORIES } from '../data/mockData';

import closeupSolarInverter from '../assets/images/closeup_solar_inverter_1790065338536.jpg';
import closeupCctvCamera from '../assets/images/closeup_cctv_camera_1790065352386.jpg';
import closeupWifiRouter from '../assets/images/closeup_wifi_router_1790065374621.jpg';
import closeupSmartGate from '../assets/images/closeup_smart_gate_1790065406731.jpg';
import closeupSolarCells from '../assets/images/closeup_solar_cells_1790065420537.jpg';

interface SolutionsViewProps {
  onNavigate: (view: AppView) => void;
  onSelectSolutionForAI: (solutionName: string) => void;
}

export const SolutionsView: React.FC<SolutionsViewProps> = ({
  onNavigate,
  onSelectSolutionForAI,
}) => {
  const [selectedSolutionId, setSelectedSolutionId] = useState(SOLUTION_CATEGORIES[0].id);

  const getCategoryImage = (catId: string) => {
    switch (catId) {
      case 'solar-energy':
        return { src: closeupSolarInverter, label: 'Pure Sine Wave Smart Hybrid Inverter & Digital Telemetry', alt: 'Close-up hybrid solar inverter readout and copper terminals' };
      case 'security-cctv':
        return { src: closeupCctvCamera, label: '4K AI Starlight Multi-Focal Optical Surveillance Lens', alt: 'Close-up CCTV camera glass lens and infrared array' };
      case 'networking-telecom':
        return { src: closeupWifiRouter, label: 'Enterprise Wi-Fi 6 Mesh Hardware & Gigabit Ethernet Array', alt: 'Close-up enterprise Wi-Fi router status indicators and ports' };
      case 'smart-buildings':
        return { src: closeupSmartGate, label: 'High-Durability Biometric Scanner & Gate Controller', alt: 'Close-up biometric fingerprint scanner and weatherproof casing' };
      case 'backup-power':
        return { src: closeupSolarCells, label: 'Bifacial Monocrystalline PV Cells with Copper Busbars', alt: 'Close-up solar PV cells and anti-reflective coating' };
      default:
        return { src: closeupSolarInverter, label: 'Certified Tier-1 Hardware Infrastructure', alt: 'Certified engineering equipment stack' };
    }
  };

  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Sun': return Sun;
      case 'Wifi': return Wifi;
      case 'BrainCircuit': return BrainCircuit;
      case 'Building2': return Building2;
      case 'Cpu': return Cpu;
      case 'Lock': return Lock;
      default: return Cpu;
    }
  };

  const current = SOLUTION_CATEGORIES.find(s => s.id === selectedSolutionId) || SOLUTION_CATEGORIES[0];
  const CurrentIcon = getIcon(current.iconName);

  return (
    <div className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0C9CB]/40 text-xs font-bold text-[#C01E25] mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>Our 7 Infrastructure Pillars</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] tracking-tight mb-3">
            Enterprise-Grade Technology Architectures
          </h1>
          <p className="text-sm sm:text-base text-[#5C4D50]">
            Engineered specifically for Kenyan grid stability, climate conditions, and commercial scaling requirements.
          </p>
        </div>

        {/* Pillar Selection Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-10">
          {SOLUTION_CATEGORIES.map((sol) => {
            const Icon = getIcon(sol.iconName);
            const isSel = sol.id === selectedSolutionId;
            return (
              <button
                key={sol.id}
                onClick={() => setSelectedSolutionId(sol.id)}
                className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                  isSel
                    ? 'bg-[#C01E25] text-[#FFFFFF] border-[#C01E25] shadow-xs'
                    : 'bg-[#EEECEC]/40 text-[#5C4D50] border-[#EEECEC] hover:bg-[#F0C9CB]/40 hover:text-[#1E1B1C]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-bold leading-tight">{sol.title}</span>
              </button>
            );
          })}
        </div>

        {/* Detailed Architecture Presentation */}
        <div className="bg-[#FFFFFF] border border-[#DB7D81]/40 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#EEECEC]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center shrink-0">
                <CurrentIcon className="w-7 h-7 stroke-[2.2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#C01E25] uppercase tracking-wider">
                  {current.subtitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C]">
                  {current.title}
                </h2>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="bg-[#EEECEC]/60 px-4 py-2 rounded-xl border border-[#EEECEC]">
                <div className="text-[10px] text-[#5C4D50] font-bold uppercase">Estimated Sizing Range</div>
                <div className="text-base font-extrabold text-[#C01E25]">{current.typicalBudgetRange}</div>
              </div>

              <button
                onClick={() => {
                  onSelectSolutionForAI(current.title);
                  onNavigate('ai-recommendation');
                }}
                className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-5 py-3 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Sizing Assessment</span>
              </button>
            </div>
          </div>

          {/* Macro Close-Up Visual Showcase */}
          {(() => {
            const imgData = getCategoryImage(current.id);
            return (
              <div className="relative w-full h-56 sm:h-72 rounded-2xl overflow-hidden bg-black/5 border border-[#EEECEC] mb-8 group">
                <img
                  src={imgData.src}
                  alt={imgData.alt}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full border border-white/20">
                    High-Definition Hardware Inspection
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-white">
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      {imgData.label}
                    </h4>
                    <p className="text-xs text-white/80">
                      Genuine Tier-1 equipment sourced directly from licensed Kenyan distributors with full serial authentication.
                    </p>
                  </div>
                  <span className="self-start sm:self-auto bg-[#C01E25] text-white text-[11px] font-black px-3 py-1.5 rounded-xl shadow-md shrink-0">
                    100% Genuine Certified
                  </span>
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C]">
                Engineering Architecture Overview
              </h3>
              <p className="text-sm text-[#5C4D50] leading-relaxed">
                {current.overview}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-3">
                  System Advantages & Return on Investment
                </h4>
                <div className="space-y-2">
                  {current.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#1E1B1C]">
                      <div className="w-4 h-4 rounded-full bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EEECEC]/40 to-[#F0C9CB]/20 p-6 rounded-2xl border border-[#EEECEC] space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-2">
                  Target Customer Applications in Kenya
                </h4>
                <div className="flex flex-wrap gap-2">
                  {current.idealCustomers.map((c, i) => (
                    <span key={i} className="text-xs font-medium bg-[#FFFFFF] text-[#1E1B1C] px-3 py-1 rounded-lg border border-[#EEECEC]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-2">
                  Verified Hardware Brands & Components
                </h4>
                <div className="space-y-1.5">
                  {current.popularEquipments.map((eq, i) => (
                    <div key={i} className="text-xs bg-[#FFFFFF] p-2.5 rounded-xl border border-[#EEECEC] flex items-center justify-between">
                      <span className="font-semibold text-[#1E1B1C]">{eq}</span>
                      <span className="text-[10px] text-[#C01E25] font-bold">KEBS / EPRA Certified</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Integrity Guarantee Bar */}
          <div className="p-4 rounded-2xl bg-[#EEECEC]/50 border border-[#DB7D81]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#5C4D50]">
            <div>
              <strong className="text-[#1E1B1C]">Pricing Transparency: </strong>
              Estimated ranges reflect 2026 Kenyan market rates for genuine distributor hardware and certified labor. Guaranteed pricing is finalized following a physical site assessment.
            </div>
            <div className="shrink-0 text-[11px] font-bold text-[#C01E25] bg-[#FFFFFF] px-2.5 py-1 rounded-full border border-[#DB7D81]/30">
              Admin-Approved Market Ranges
            </div>
          </div>

          {/* Bottom Action Card */}
          <div className="mt-8 pt-6 border-t border-[#EEECEC] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-[#5C4D50] block font-bold uppercase">Direct Solution Consultation</span>
              <p className="text-sm font-bold text-[#1E1B1C]">
                Speak directly with an engineer specializing in {current.title}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://wa.me/254727547310?text=${encodeURIComponent(`Jambo HYNOVA! I am interested in ${current.title} for my property. Please advise on system options.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>WhatsApp 0727 547 310</span>
              </a>

              <a
                href="tel:+254727547310"
                className="px-4 py-2.5 rounded-xl bg-[#EEECEC] hover:bg-[#dedede] text-[#1E1B1C] font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Call 0727 547 310</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
