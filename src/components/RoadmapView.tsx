import React from 'react';
import { 
  Milestone, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  Sun, 
  Network, 
  Wrench, 
  Store, 
  Coins, 
  Globe2, 
  Cpu,
  Layers,
  GraduationCap
} from 'lucide-react';
import { AppView } from '../types';
import { ROADMAP_DATA } from '../services/securityService';

interface RoadmapViewProps {
  onNavigate: (view: AppView) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#FFFFFF] min-h-screen py-10 border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full flex items-center gap-1.5">
              <Milestone className="w-3.5 h-3.5" />
              Strategic Architecture Roadmap
            </span>
            <span className="text-[11px] font-bold text-[#5C4D50] bg-[#EEECEC] px-3 py-1 rounded-full">
              Kenya & Continental Scaling
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#1E1B1C] tracking-tight">
            Realistic Phased Growth Plan
          </h1>
          <p className="text-base text-[#5C4D50] mt-2 leading-relaxed">
            We are architected for disciplined execution. We prioritize operational excellence in core infrastructure domains before expanding into secondary smart verticals.
          </p>
        </div>

        {/* HYNOVA Trust & Evidence Statement */}
        <div className="bg-gradient-to-r from-[#EEECEC]/70 via-[#F0C9CB]/30 to-[#EEECEC]/70 p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="w-6 h-6 text-[#C01E25]" />
            <h2 className="text-lg sm:text-xl font-black text-[#1E1B1C]">
              Our Trust Principle: Zero Fabrication
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#5C4D50] leading-relaxed">
            We hold ourselves to absolute integrity. We never fabricate customers, revenue numbers, completed projects, supplier partnerships, government relationships, or impact statistics. Verified deliverables are displayed as facts; future ambitions are transparently labeled as strategic goals.
          </p>
        </div>

        {/* 3 Phases Detailed Grid */}
        <div className="space-y-8">
          {ROADMAP_DATA.map((pillar, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-3xl border transition-all ${
                pillar.status === 'Active Deployment'
                  ? 'bg-[#FFFFFF] border-[#C01E25] shadow-md ring-1 ring-[#C01E25]/10'
                  : pillar.status === 'In Development'
                  ? 'bg-[#FFFFFF] border-[#DB7D81]/60 shadow-xs'
                  : 'bg-[#EEECEC]/30 border-[#EEECEC]'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#EEECEC] gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/50 px-3 py-1 rounded-full">
                      {pillar.timeline}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        pillar.status === 'Active Deployment'
                          ? 'bg-emerald-100 text-emerald-800'
                          : pillar.status === 'In Development'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {pillar.status}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black text-[#1E1B1C] mt-2">
                    {pillar.phase}
                  </h3>
                </div>

                {pillar.status === 'Active Deployment' && (
                  <button
                    onClick={() => onNavigate('solutions')}
                    className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer self-start md:self-auto"
                  >
                    <span>Explore Phase 1 Solutions</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Grid of Focus Areas, Target Sectors, and Infrastructure Milestones */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                
                {/* Core Focus */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#DB7D81] flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#C01E25]" />
                    Technology & Service Focus
                  </h4>
                  <ul className="space-y-2">
                    {pillar.focus.map((item, i) => (
                      <li key={i} className="text-xs text-[#1E1B1C] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25] shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Target Sectors */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#DB7D81] flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-[#C01E25]" />
                    Target Sectors & Audiences
                  </h4>
                  <ul className="space-y-2">
                    {pillar.sectors.map((sec, i) => (
                      <li key={i} className="text-xs text-[#1E1B1C] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C01E25] mt-1.5 shrink-0" />
                        <span className="leading-snug font-medium">{sec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Milestones */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#DB7D81] flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-[#C01E25]" />
                    Architectural Milestones
                  </h4>
                  <ul className="space-y-2">
                    {pillar.infrastructureMilestones.map((ms, i) => (
                      <li key={i} className="text-xs text-[#5C4D50] flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#5C4D50] shrink-0 mt-0.5" />
                        <span className="leading-snug">{ms}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Scalability Blueprint Callout */}
        <div className="bg-[#EEECEC]/50 p-8 rounded-3xl border border-[#EEECEC] text-center space-y-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#C01E25] bg-[#FFFFFF] px-3 py-1 rounded-full border border-[#DB7D81]/30 inline-block">
            Target Scale Blueprint
          </span>
          <h3 className="text-2xl font-extrabold text-[#1E1B1C]">
            Engineered to Support 100k+ Customers & 50k+ Technicians
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4D50] max-w-3xl mx-auto leading-relaxed">
            Our multi-tenant cloud architecture is provisioned with horizontal container auto-scaling, regional read replicas, and partitioned Redis caches to comfortably support 100,000 customers, 50,000 verified technicians, 10,000 suppliers, and millions of instant AI recommendations across all 47 Kenyan counties and future Pan-African corridors.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigate('security-architecture')}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-6 py-3 rounded-xl transition-colors cursor-pointer"
            >
              View Security & RBAC Architecture
            </button>
            <button
              onClick={() => onNavigate('partner-portal')}
              className="bg-white hover:bg-[#EEECEC] text-[#1E1B1C] text-xs font-bold px-6 py-3 rounded-xl border border-[#DB7D81]/40 transition-colors cursor-pointer"
            >
              Institutional & Enterprise Partnerships
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
