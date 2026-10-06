import React from 'react';
import { ShieldCheck, Cpu, Zap, Radio, Lock, CheckCircle2, Sparkles } from 'lucide-react';
import { AppView } from '../types';

interface PartnersSectionProps {
  onNavigate: (view: AppView) => void;
  onOpenAI?: () => void;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ onNavigate, onOpenAI }) => {
  // Genuine Equipment Brands & Hardware Standards (reinforces "Can HYNOVA solve my problem?")
  const hardwareBrands = [
    {
      name: 'Hikvision',
      category: 'Smart Surveillance & AI',
      desc: 'ColorVu 24/7 night vision, AcuSense AI human & vehicle detection.',
      icon: Lock,
    },
    {
      name: 'Deye & Growatt',
      category: 'Hybrid Solar Inverters',
      desc: 'Tier-1 smart hybrid inverters with WiFi telemetry and 5-year warranty.',
      icon: Zap,
    },
    {
      name: 'Pylontech & Felicity',
      category: 'Lithium LiFePO4 Storage',
      desc: '6,000+ lifecycle lithium batteries with intelligent Battery Management (BMS).',
      icon: Cpu,
    },
    {
      name: 'Ubiquiti & Starlink',
      category: 'Enterprise Networking',
      desc: 'High-throughput satellite reception and high-density Wi-Fi 6 APs.',
      icon: Radio,
    },
    {
      name: 'Schneider Electric',
      category: 'Surge & Electrical Protection',
      desc: 'International standard DC disconnects, SPDs, and automatic changeovers.',
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-[#FFFFFF] via-[#EEECEC]/25 to-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
            Genuine Hardware & Standards
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] mt-3 mb-3 tracking-tight">
            Vetted Equipment From Global Leaders
          </h2>
          <p className="text-[#5C4D50] text-sm sm:text-base leading-relaxed">
            Every HYNOVA installation uses authentic equipment from authorized Kenyan distributors, covered by full manufacturer warranties and installed to EPRA and NCA codes.
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {hardwareBrands.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.name}
                className="p-5 rounded-2xl bg-[#FFFFFF] border border-[#EEECEC] shadow-xs hover:border-[#DB7D81]/60 transition-all text-center flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F0C9CB]/40 text-[#C01E25] flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-[#1E1B1C]">{b.name}</h3>
                <span className="text-[11px] font-semibold text-[#C01E25] mb-1.5">{b.category}</span>
                <p className="text-[11px] text-[#5C4D50] leading-snug">{b.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Kenya Standards Bar */}
        <div className="p-4 rounded-2xl bg-[#FFFFFF] border border-[#DB7D81]/30 flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-[#5C4D50]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
            <span>EPRA Solar Licensed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
            <span>NCA Certified Electrical</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
            <span>KEBS Standards Compliant</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
            <span>Safaricom M-Pesa Escrow Protection</span>
          </div>
        </div>

      </div>
    </section>
  );
};
