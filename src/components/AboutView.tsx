import React from 'react';
import { HynovaLogo } from './HynovaLogo';
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Heart, 
  Zap, 
  Users, 
  MapPin, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Building,
  GraduationCap
} from 'lucide-react';
import { AppView } from '../types';

interface AboutViewProps {
  onNavigate: (view: AppView) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  const values = [
    {
      title: 'Affordability',
      description: 'Eliminating excessive contractor markups through direct wholesale supplier transparent pricing and itemized hardware quotes.',
    },
    {
      title: 'Accessibility',
      description: 'Working towards an inclusive future where every Kenyan county has access to reliable, modern technology infrastructure.',
    },
    {
      title: 'Trust & Transparency',
      description: '100% escrow protection guarantees client peace of mind. Technicians get paid only upon customer digital sign-off and testing.',
    },
    {
      title: 'Technical Excellence',
      description: 'Strict adherence to EPRA solar codes, NCA contractor standards, and continuous upskilling through the HYNOVA Academy.',
    },
    {
      title: 'Youth Empowerment',
      description: 'Transforming technical vocational youth into certified, high-income engineering professionals and business owners.',
    },
    {
      title: 'Precision Sizing & Innovation',
      description: 'Harnessing algorithmic precision models to size electrical and security systems in seconds with engineering accuracy.',
    },
  ];

  return (
    <div className="py-12 bg-[#FFFFFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-3xl bg-[#FFFFFF] border border-[#EEECEC] shadow-sm hover:shadow-md transition-shadow">
              <HynovaLogo variant="full" showTagline={true} />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0C9CB]/40 text-xs font-bold text-[#C01E25] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HYNOVA ENTERPRISES LTD • KENYA</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E1B1C] tracking-tight mb-4">
            Kenya&apos;s AI Powered <br />
            <span className="text-[#C01E25]">Technology Fulfillment Network</span>
          </h1>
          <p className="text-base sm:text-lg text-[#5C4D50] leading-relaxed max-w-2xl mx-auto">
            We are not just a CCTV, solar, or networking company. We connect customers, AI recommendations, certified technicians, suppliers, and infrastructure solutions into one seamless nationwide ecosystem.
          </p>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="bg-gradient-to-br from-[#FFFFFF] to-[#EEECEC]/50 p-8 sm:p-10 rounded-3xl border border-[#DB7D81]/40 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C01E25] text-[#FFFFFF] flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25]">
              Our Vision
            </span>
            <h2 className="text-2xl font-extrabold text-[#1E1B1C]">
              Democratizing Modern Infrastructure
            </h2>
            <p className="text-sm text-[#5C4D50] leading-relaxed">
              To ensure every Kenyan has access to affordable, accessible, and scalable technology solutions including smart infrastructure, security technology, networking, solar energy, and operational automation.
            </p>
          </div>

          <div className="bg-gradient-to-br from-[#FFFFFF] to-[#F0C9CB]/20 p-8 sm:p-10 rounded-3xl border border-[#DB7D81]/40 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C01E25] text-[#FFFFFF] flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25]">
              Our Mission
            </span>
            <h2 className="text-2xl font-extrabold text-[#1E1B1C]">
              Simplified Sizing & Seamless Delivery
            </h2>
            <p className="text-sm text-[#5C4D50] leading-relaxed">
              To simplify technology adoption by connecting customers with the right products, certified technicians, and trusted suppliers based on their needs and budget.
            </p>
          </div>
        </div>

        {/* Core Business Model Flow */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#EEECEC] p-8 sm:p-12 mb-16 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
              System Architecture
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C] mt-2">
              Our Operating Flywheel
            </h3>
            <p className="text-xs sm:text-sm text-[#5C4D50] mt-1">
              How our closed-loop marketplace ensures reliability and affordability for all Kenyans.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Goals Input', desc: 'Customers describe their goals and budget in plain English or Swahili.' },
              { step: '02', title: 'Smart Sizing', desc: 'We size the optimal hardware BOM and verified specs.' },
              { step: '03', title: 'Direct Supply', desc: 'Tier-1 bonded suppliers provide genuine equipment at wholesale.' },
              { step: '04', title: 'Certified Delivery', desc: 'Vetted, licensed technicians execute site installation & testing.' },
              { step: '05', title: 'Escrow Guarantee', desc: 'We manage ecosystem quality, warranty, and escrow payouts.' },
            ].map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#EEECEC]/30 border border-[#EEECEC] text-left">
                <span className="text-xs font-mono font-black text-[#C01E25]">{f.step}</span>
                <h4 className="text-sm font-bold text-[#1E1B1C] mt-1 mb-1">{f.title}</h4>
                <p className="text-xs text-[#5C4D50] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
              Foundational Principles
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C] mt-2">
              Our Values
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81]/70 transition-all shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-[#F0C9CB]/50 text-[#C01E25] flex items-center justify-center font-bold text-xs mb-3">
                  {idx + 1}
                </div>
                <h4 className="text-base font-bold text-[#1E1B1C] mb-1.5">{v.title}</h4>
                <p className="text-xs text-[#5C4D50] leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* HYNOVA Data Integrity & Trust Framework */}
        <div className="mb-16 bg-[#EEECEC]/30 rounded-3xl border border-[#DB7D81]/40 p-8 sm:p-10">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/50 px-3 py-1 rounded-full">
              Governance & Integrity
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C]">
              HYNOVA Data Integrity & Trust Framework
            </h3>
            <p className="text-sm sm:text-base font-semibold text-[#C01E25]">
              "Earn trust through transparency. Underpromise, deliver, and grow with integrity."
            </p>
            <p className="text-xs sm:text-sm text-[#5C4D50] leading-relaxed">
              We are committed to honesty, transparency, and evidence-based communication. We strictly refrain from generating placeholder statistics, fictional customer counts, or unverified claims.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] space-y-2">
              <ShieldCheck className="w-5 h-5 text-[#C01E25]" />
              <h4 className="text-xs font-bold text-[#1E1B1C]">Verified Data Only</h4>
              <p className="text-[11px] text-[#5C4D50] leading-relaxed">
                Metric figures, installations, and milestones are published only when formally verified and documented.
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] space-y-2">
              <GraduationCap className="w-5 h-5 text-[#C01E25]" />
              <h4 className="text-xs font-bold text-[#1E1B1C]">Workforce Vision</h4>
              <p className="text-[11px] text-[#5C4D50] leading-relaxed">
                Focusing on real skill development, vocational accreditation, and sustainable technician livelihoods.
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] space-y-2">
              <Building className="w-5 h-5 text-[#C01E25]" />
              <h4 className="text-xs font-bold text-[#1E1B1C]">Authentic Partnerships</h4>
              <p className="text-[11px] text-[#5C4D50] leading-relaxed">
                Affiliations and supplier channels are added upon verified agreements and quality audits.
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] space-y-2">
              <Sparkles className="w-5 h-5 text-[#C01E25]" />
              <h4 className="text-xs font-bold text-[#1E1B1C]">Objective System Guidance</h4>
              <p className="text-[11px] text-[#5C4D50] leading-relaxed">
                Clear disclaimers accompany all automated estimates, prior to on-site technical validation.
              </p>
            </div>
          </div>
        </div>

        {/* Direct Contact & Headquarters Card */}
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#EEECEC] p-6 sm:p-10 mb-12 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#5C4D50] block font-bold uppercase">Headquarters</span>
                <span className="text-sm font-extrabold text-[#1E1B1C]">Nairobi, Kenya</span>
                <span className="text-xs text-[#5C4D50] block">Serving all 47 counties</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#5C4D50] block font-bold uppercase">Direct Phone Line</span>
                <a href="tel:+254727547310" className="text-sm font-black text-[#1E1B1C] hover:text-[#C01E25]">
                  0727 547 310
                </a>
                <span className="text-xs text-[#5C4D50] block">Mon–Sat: 8:00 AM – 7:00 PM</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEECEC] text-[#1E1B1C] flex items-center justify-center shrink-0">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs text-[#5C4D50] block font-bold uppercase">General Inquiries</span>
                <a href="mailto:info@hynovaenterprises.com" className="text-sm font-bold text-[#1E1B1C] hover:text-[#C01E25] break-all">
                  info@hynovaenterprises.com
                </a>
                <span className="text-xs text-[#5C4D50] block">Response within 2 hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-gradient-to-r from-[#FFFFFF] via-[#F0C9CB]/30 to-[#EEECEC]/50 rounded-3xl border border-[#DB7D81]/40 p-8 sm:p-12 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C]">
            Ready to Build Your Technology Infrastructure?
          </h3>
          <p className="text-xs sm:text-sm text-[#5C4D50] max-w-xl mx-auto">
            Try our instant recommendation tool today or speak directly with our senior technology advisors at 0727 547 310.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('ai-recommendation')}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#C01E25]/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Solution Advisor</span>
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#FFFFFF] hover:bg-[#EEECEC] text-[#1E1B1C] border border-[#DB7D81]/50 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-colors cursor-pointer"
            >
              <span>Contact Us (0727 547 310)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
