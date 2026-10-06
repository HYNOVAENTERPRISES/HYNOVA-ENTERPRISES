import React from 'react';
import { 
  Home, 
  Store, 
  GraduationCap, 
  Church, 
  Building, 
  Hospital, 
  Landmark, 
  ArrowRight, 
  CheckCircle2 
} from 'lucide-react';
import { AppView } from '../types';
import { CUSTOMER_SEGMENTS } from '../data/mockData';

interface CustomerSegmentsSectionProps {
  onNavigate: (view: AppView) => void;
  onSelectSegment: (segmentTitle: string) => void;
}

export const CustomerSegmentsSection: React.FC<CustomerSegmentsSectionProps> = ({
  onNavigate,
  onSelectSegment,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'homeowners': return Home;
      case 'businesses': return Store;
      case 'schools': return GraduationCap;
      case 'churches': return Church;
      case 'developers': return Building;
      case 'institutions': return Hospital;
      case 'government': return Landmark;
      default: return Building;
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#FFFFFF] via-[#EEECEC]/30 to-[#FFFFFF] border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
            Target Segments
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1E1B1C] mt-3 mb-4 tracking-tight">
            Infrastructure Tailored For Every Customer
          </h2>
          <p className="text-[#5C4D50] text-base sm:text-lg">
            From single-family homes to 50-site county deployments, HYNOVA scales to your exact operational and budget parameters.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CUSTOMER_SEGMENTS.map((seg) => {
            const Icon = getIcon(seg.id);
            return (
              <div
                key={seg.id}
                id={`customer-segment-${seg.id}`}
                className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EEECEC] text-[#C01E25] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-1 rounded-full">
                      {seg.highlight}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#1E1B1C] mb-2">{seg.title}</h3>
                  <p className="text-xs text-[#5C4D50] leading-relaxed mb-4">{seg.description}</p>

                  <div className="mb-6">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7B7F] block mb-1.5">
                      Recommended Tech
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {seg.popularPillars.map((p, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium bg-[#EEECEC]/70 text-[#1E1B1C] px-2.5 py-0.5 rounded-md"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectSegment(seg.title);
                    onNavigate('ai-recommendation');
                  }}
                  className="w-full text-xs font-bold text-[#C01E25] hover:text-[#FFFFFF] bg-[#F0C9CB]/30 hover:bg-[#C01E25] py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Build Solution for {seg.title}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
