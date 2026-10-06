import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sun, 
  Wifi, 
  BrainCircuit, 
  Building2, 
  Cpu, 
  Lock, 
  ArrowRight, 
  Check, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AppView, SolutionCategory } from '../types';
import { SOLUTION_CATEGORIES } from '../data/mockData';

import closeupSolarInverter from '../assets/images/closeup_solar_inverter_1790065338536.jpg';
import closeupCctvCamera from '../assets/images/closeup_cctv_camera_1790065352386.jpg';
import closeupWifiRouter from '../assets/images/closeup_wifi_router_1790065374621.jpg';
import closeupSmartGate from '../assets/images/closeup_smart_gate_1790065406731.jpg';
import closeupSolarCells from '../assets/images/closeup_solar_cells_1790065420537.jpg';

interface SolutionsSectionProps {
  onNavigate: (view: AppView) => void;
  onSelectSolution: (solutionId: string) => void;
}

export const SolutionsSection: React.FC<SolutionsSectionProps> = ({
  onNavigate,
  onSelectSolution,
}) => {
  const [selectedCatId, setSelectedCatId] = useState<string>('solar-energy');

  const getCategoryImage = (catId: string) => {
    switch (catId) {
      case 'solar-energy':
        return { src: closeupSolarInverter, label: 'Hybrid Solar Inverter & LiFePO4 Display', alt: 'Close-up high-efficiency hybrid solar inverter' };
      case 'security-cctv':
        return { src: closeupCctvCamera, label: 'Starlight 4K AI Optical Camera Lens', alt: 'Close-up optical glass lens and IR LEDs' };
      case 'networking-telecom':
        return { src: closeupWifiRouter, label: 'Enterprise Wi-Fi 6 Mesh Hardware', alt: 'Close-up enterprise router and network ports' };
      case 'smart-buildings':
        return { src: closeupSmartGate, label: 'Biometric Access & Smart Gate Control', alt: 'Close-up biometric fingerprint scanner' };
      case 'backup-power':
        return { src: closeupSolarCells, label: 'High-Purity Monocrystalline PV Cells', alt: 'Close-up solar PV cells and busbars' };
      default:
        return { src: closeupSolarInverter, label: 'Genuine Verified Hardware Stack', alt: 'Certified engineering hardware' };
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

  const currentCategory = SOLUTION_CATEGORIES.find(c => c.id === selectedCatId) || SOLUTION_CATEGORIES[0];
  const CurrentIcon = getIcon(currentCategory.iconName);

  return (
    <section className="py-20 bg-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
              7 Technology Pillars
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] mt-3 mb-2 tracking-tight">
              Integrated Infrastructure Solutions
            </h2>
            <p className="text-[#5C4D50] text-base sm:text-lg max-w-2xl">
              Scalable technology architectures designed to work in synergy, from solar microgrids to autonomous AI surveillance.
            </p>
          </div>

          <button
            onClick={() => onNavigate('solutions')}
            className="self-start md:self-auto text-xs font-bold text-[#C01E25] hover:text-[#9e161c] flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#DB7D81]/50 hover:bg-[#F0C9CB]/30 transition-all cursor-pointer"
          >
            <span>View All Specifications</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Category Tabs Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {SOLUTION_CATEGORIES.map((cat) => {
            const Icon = getIcon(cat.iconName);
            const isSelected = cat.id === selectedCatId;
            return (
              <button
                key={cat.id}
                id={`sol-tab-${cat.id}`}
                onClick={() => setSelectedCatId(cat.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#C01E25] text-[#FFFFFF] shadow-sm shadow-[#C01E25]/20'
                    : 'bg-[#EEECEC] text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#F0C9CB]/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Deep Dive Card for Selected Pillar */}
        <div className="bg-[#FFFFFF] border border-[#DB7D81]/40 rounded-3xl p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Overview & Benefits */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center">
                  <CurrentIcon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-[#1E1B1C] tracking-tight">
                    {currentCategory.title}
                  </h3>
                  <p className="text-xs font-bold text-[#C01E25] tracking-wide">
                    {currentCategory.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#5C4D50] leading-relaxed">
                {currentCategory.overview}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-3">
                  Key System Benefits
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {currentCategory.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#1E1B1C]">
                      <div className="w-4 h-4 rounded-full bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E1B1C] mb-2">
                  Ideal Kenyan Customers
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentCategory.idealCustomers.map((cust, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-medium bg-[#EEECEC] text-[#5C4D50] px-3 py-1 rounded-lg border border-[#EEECEC]"
                    >
                      {cust}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Budget Range, Popular Hardware & Action */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#EEECEC]/40 to-[#F0C9CB]/20 p-6 sm:p-7 rounded-2xl border border-[#EEECEC] space-y-5">
              {/* Close-Up Product Preview */}
              {(() => {
                const imgData = getCategoryImage(currentCategory.id);
                return (
                  <div className="relative w-full h-40 sm:h-44 rounded-xl overflow-hidden bg-black/5 border border-[#EEECEC] group">
                    <img
                      src={imgData.src}
                      alt={imgData.alt}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                      <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md truncate max-w-[70%]">
                        {imgData.label}
                      </span>
                      <span className="bg-[#C01E25] px-2 py-0.5 rounded-md text-[10px]">
                        Macro View
                      </span>
                    </div>
                  </div>
                );
              })()}

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#DB7D81]">
                  Typical Budget Range
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-[#C01E25] mt-0.5">
                  {currentCategory.typicalBudgetRange}
                </div>
                <p className="text-[11px] text-[#5C4D50] mt-0.5">
                  Fully customizable through our AI advisor based on your exact square footage or power load.
                </p>
              </div>

              <div className="border-t border-[#EEECEC] pt-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C4D50] block mb-2">
                  Hardware & Component Stack
                </span>
                <div className="space-y-1.5">
                  {currentCategory.popularEquipments.map((eq, i) => (
                    <div key={i} className="text-xs bg-[#FFFFFF] px-3 py-2 rounded-xl border border-[#EEECEC] font-medium text-[#1E1B1C] flex items-center justify-between">
                      <span>{eq}</span>
                      <span className="text-[10px] text-[#DB7D81] font-semibold">Tier-1 Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  id={`request-assessment-${currentCategory.id}`}
                  onClick={() => {
                    onSelectSolution(currentCategory.id);
                    onNavigate('ai-recommendation');
                  }}
                  className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-bold text-sm py-3.5 rounded-xl shadow-sm shadow-[#C01E25]/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Request Sizing Assessment for {currentCategory.title}</span>
                </button>

                <button
                  onClick={() => onNavigate('solutions')}
                  className="w-full bg-[#FFFFFF] hover:bg-[#EEECEC] text-[#1E1B1C] font-semibold text-xs py-2.5 rounded-xl border border-[#EEECEC] transition-colors cursor-pointer"
                >
                  Explore Detailed Architecture
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
