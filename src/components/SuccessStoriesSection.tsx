import React from 'react';
import { 
  Users, 
  MapPin, 
  Building2, 
  Sparkles, 
  Briefcase, 
  ShieldCheck, 
  Target,
  Award,
  Lock
} from 'lucide-react';

export const SuccessStoriesSection: React.FC = () => {
  // 6 Strategic Ambitions directly aligned with the HYNOVA Data Integrity Framework
  const strategicAmbitions = [
    {
      pillar: 'Technician Network',
      goal: 'Connect 10,000+ Certified Technicians Across Kenya',
      icon: Users,
      tag: 'Strategic Ambition',
      description: 'Building an accredited national technical network with standardized safety protocols, continuous skills training, and direct customer dispatch.',
    },
    {
      pillar: 'National Footprint',
      goal: 'Support Technology Access In All 47 Counties',
      icon: MapPin,
      tag: 'Strategic Ambition',
      description: 'Bridging the technical divide between metropolitan hubs and remote regions by establishing local certified engineer hubs in every county.',
    },
    {
      pillar: 'Smart Infrastructure',
      goal: 'Help Thousands Of Homes And Businesses Adopt Smart Infrastructure',
      icon: Building2,
      tag: 'Strategic Ambition',
      description: 'Accelerating the transition to high-efficiency solar power, AI-enabled perimeter security, and high-speed networking with accessible financing.',
    },
    {
      pillar: 'AI Advisory',
      goal: 'Reduce Technology Adoption Barriers Through AI Guided Recommendations',
      icon: Sparkles,
      tag: 'Strategic Ambition',
      description: 'Providing instant, transparent, market-grounded hardware sizing so clients make informed decisions without technical jargon.',
    },
    {
      pillar: 'Economic Opportunity',
      goal: "Create Meaningful Opportunities For Kenya's Technical Workforce",
      icon: Briefcase,
      tag: 'Strategic Ambition',
      description: 'Empowering TVET graduates and licensed local electricians with steady commercial project flow, fair compensation, and prompt M-Pesa payouts.',
    },
    {
      pillar: 'Ecosystem Trust',
      goal: "Build Kenya's Most Trusted Technology Infrastructure Marketplace",
      icon: ShieldCheck,
      tag: 'Strategic Ambition',
      description: 'Setting the gold standard for genuine distributor equipment, escrow milestone security, and comprehensive 1-year workmanship warranties.',
    },
  ];

  return (
    <section id="our-ambition-section" className="py-20 bg-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F0C9CB]/40 text-xs font-bold text-[#C01E25] mb-3">
            <Target className="w-3.5 h-3.5 text-[#C01E25]" />
            <span>Clearly Labeled Future Goals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] tracking-tight">
            Our Ambition
          </h2>
          <p className="text-[#5C4D50] text-sm sm:text-base mt-2 max-w-2xl mx-auto leading-relaxed">
            As we scale across Kenya, these strategic milestones define our roadmap. We share them openly as measurable commitments to our customers, technicians, and partners.
          </p>
        </div>

        {/* Commercial Principle Banner (Master Prompt Mandate) */}
        <div className="bg-gradient-to-r from-[#EEECEC]/70 via-[#F0C9CB]/35 to-[#EEECEC]/70 p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 mb-14 text-center max-w-4xl mx-auto shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFFFFF] text-[11px] font-black uppercase tracking-wider text-[#C01E25] border border-[#DB7D81]/30 mb-3">
            <Award className="w-3.5 h-3.5 text-[#C01E25]" />
            <span>HYNOVA Commercial Principle</span>
          </div>
          <p className="text-xl sm:text-2xl font-black text-[#1E1B1C] tracking-tight mb-3 leading-snug">
            "HYNOVA should aim to be the most trusted affordable option, not the cheapest option.<br className="hidden sm:inline" />
            <span className="text-[#C01E25]"> The cheapest provider wins a sale. The most trusted provider builds a platform.</span>"
          </p>
          <p className="text-xs sm:text-sm text-[#5C4D50] max-w-2xl mx-auto">
            We prioritize vetted engineering safety, code compliance with EPRA and NCA, and long-term customer protection over race-to-the-bottom shortcuts.
          </p>
        </div>

        {/* 6 Strategic Ambition Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {strategicAmbitions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFFFFF] p-6 sm:p-7 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all flex flex-col justify-between shadow-xs hover:shadow-md group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-[#EEECEC] group-hover:bg-[#C01E25] text-[#C01E25] group-hover:text-[#FFFFFF] flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-1 rounded-full">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#DB7D81] mb-1.5">
                    {item.pillar}
                  </h3>

                  <p className="text-base font-extrabold text-[#1E1B1C] mb-3 leading-snug">
                    {item.goal}
                  </p>

                  <p className="text-xs text-[#5C4D50] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#EEECEC] flex items-center gap-2 text-[11px] font-semibold text-[#8F7B7F]">
                  <Target className="w-3.5 h-3.5 text-[#C01E25]" />
                  <span>Aspirational Milestone • Clearly Labeled</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Data Integrity Standard Box */}
        <div className="p-6 rounded-3xl bg-[#EEECEC]/40 border border-[#EEECEC] max-w-4xl mx-auto flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-[#FFFFFF] border border-[#EEECEC] flex items-center justify-center text-[#C01E25] shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-xs text-[#5C4D50] leading-relaxed text-center sm:text-left">
            <span className="font-extrabold text-[#1E1B1C] block text-sm mb-1">
              Data Integrity & Anti-Fabrication Standard
            </span>
            Every figure shown on the HYNOVA platform represents either: <strong>Verified Current Data</strong>, <strong>Administrator Approved Pricing</strong>, <strong>Real-Time Supplier Feeds</strong>, <strong>Clearly Labeled Estimates</strong>, or <strong>Clearly Labeled Future Goals</strong>. We never fabricate numbers, artificial savings, fictitious partnerships, or synthetic customer reviews.
          </div>
        </div>

      </div>
    </section>
  );
};
