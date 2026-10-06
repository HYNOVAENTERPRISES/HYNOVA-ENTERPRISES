import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  TrendingUp, 
  Briefcase, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  Send 
} from 'lucide-react';
import { AppView } from '../types';

interface PartnerPortalProps {
  onNavigate: (view: AppView) => void;
}

export const PartnerPortal: React.FC<PartnerPortalProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'tenders' | 'submissions' | 'commissions'>('tenders');
  const [showRfpModal, setShowRfpModal] = useState(false);
  const [rfpSuccess, setRfpSuccess] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const tenders = [
    {
      id: 'TND-2026-004',
      title: 'Machakos County Smart Street Lighting & Solar Microgrid',
      client: 'County Government of Machakos',
      budgetKES: 'KES 24,000,000',
      deadline: 'April 14, 2026',
      scope: '320 Solar LED poles with IoT remote dimming & telematics across Machakos town bypass.',
      status: 'Open for Consortium Bids',
    },
    {
      id: 'TND-2026-002',
      title: '40-Site Starlink + Biometric Attendance for TVET Campuses',
      client: 'Vocational Training Consortium Kenya',
      budgetKES: 'KES 18,500,000',
      deadline: 'April 22, 2026',
      scope: 'Turnkey deployment of satellite connectivity, structured CAT6 cabling, and cloud biometric access.',
      status: 'Shortlisting Bids',
    },
    {
      id: 'TND-2026-001',
      title: 'Commercial Plaza 100kW Rooftop Solar Grid-Tie with Zero Export',
      client: 'Avenue Real Estate Syndicate, Kilimani',
      budgetKES: 'KES 11,200,000',
      deadline: 'April 02, 2026',
      scope: 'Engineering design, EPRA grid application, Tier-1 inverters, and full building integration.',
      status: 'Final Clarifications',
    },
  ];

  return (
    <div className="py-10 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                Enterprise & Commercial Tenders
              </span>
              <span className="text-xs text-[#5C4D50]">Institutional Partner Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C] mt-1">
              Partner & Consortium Portal
            </h1>
          </div>

          <button
            onClick={() => setShowRfpModal(true)}
            className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Institutional RFP</span>
          </button>
        </div>

        {statusMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F0C9CB]/40 border border-[#C01E25] text-[#C01E25] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
            <span>{statusMsg}</span>
            <button onClick={() => setStatusMsg(null)} className="text-xs text-[#C01E25] font-bold">✕</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EEECEC] scrollbar-none">
          {[
            { id: 'tenders', label: 'Commercial Tenders & RFPs', icon: Briefcase },
            { id: 'submissions', label: 'Consortium Project Submissions', icon: FileText },
            { id: 'commissions', label: 'Subcontracting & Referral Revenue', icon: Coins },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#C01E25] text-[#FFFFFF] shadow-sm shadow-[#C01E25]/20'
                    : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: TENDERS */}
        {activeTab === 'tenders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1B1C]">Active Institutional Infrastructure Tenders</h2>
              <p className="text-xs text-[#5C4D50]">
                Pre-qualified Kenyan engineering contractors and developer partners can bid directly or form consortia through HYNOVA.
              </p>
            </div>

            <div className="space-y-4">
              {tenders.map((t) => (
                <div
                  key={t.id}
                  className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81]/70 transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C01E25]">{t.id}</span>
                      <span className="text-xs text-[#5C4D50]">Client: <strong>{t.client}</strong></span>
                      <span className="text-[10px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded">
                        {t.status}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1E1B1C]">{t.title}</h3>
                    <p className="text-xs text-[#5C4D50] leading-relaxed">{t.scope}</p>

                    <div className="text-xs text-[#DB7D81] font-semibold">
                      Closing Submission Deadline: {t.deadline}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#EEECEC]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] uppercase font-bold text-[#5C4D50]">Tender Estimated Value</span>
                      <div className="text-xl font-black text-[#C01E25]">{t.budgetKES}</div>
                    </div>

                    <button
                      onClick={() => showNotification(`Tender Dossier & Expression of Interest packet dispatched for ${t.id}.`)}
                      className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                    >
                      Download Bid Dossier
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SUBMISSIONS */}
        {activeTab === 'submissions' && (
          <div className="bg-[#FFFFFF] p-8 rounded-3xl border border-[#EEECEC] text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F0C9CB]/50 text-[#C01E25] flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1E1B1C]">Active Consortium Proposals</h3>
            <p className="text-xs text-[#5C4D50] max-w-md mx-auto">
              Track multi-party bids where HYNOVA coordinates hardware wholesale, engineering compliance, and technician pooling.
            </p>
            <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] max-w-lg mx-auto text-xs text-left">
              <div className="font-bold text-[#1E1B1C]">Proposal: Naivasha Eco-Lodges Microgrid (KES 14.2M)</div>
              <div className="text-[#5C4D50] mt-1">Lead Partner: Rift Valley Engineering Consortium • Status: Under Client Review</div>
            </div>
          </div>
        )}

        {/* TAB 3: COMMISSIONS */}
        {activeTab === 'commissions' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Partner Commissions Paid</span>
                <div className="text-3xl font-black text-[#C01E25] mt-1">KES 3,420,000</div>
                <div className="text-xs text-[#5C4D50] mt-1">Directly to corporate escrow account</div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Active Client Referrals</span>
                <div className="text-3xl font-black text-[#1E1B1C] mt-1">19 Projects</div>
                <div className="text-xs text-[#5C4D50] mt-1">Under construction across Kenya</div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Commission Rate</span>
                <div className="text-3xl font-black text-[#C01E25] mt-1">4.5% – 7.5%</div>
                <div className="text-xs text-[#5C4D50] mt-1">On total turnkey project hardware value</div>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Submit Institutional RFP */}
        {showRfpModal && (
          <div className="fixed inset-0 bg-[#1E1B1C]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/50 max-w-lg w-full shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#EEECEC]">
                <h3 className="text-base font-bold text-[#1E1B1C]">Submit Enterprise / Institutional RFP</h3>
                <button
                  onClick={() => setShowRfpModal(false)}
                  className="text-xs font-bold text-[#5C4D50] hover:text-[#1E1B1C] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {rfpSuccess ? (
                <div className="p-4 rounded-xl bg-[#F0C9CB]/50 text-xs font-bold text-[#C01E25] text-center">
                  RFP Logged! HYNOVA Enterprise Engineering team will reach out within 2 hours.
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setRfpSuccess(true);
                    setTimeout(() => {
                      setShowRfpModal(false);
                      setRfpSuccess(false);
                    }, 2000);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="font-bold text-[#5C4D50] block mb-1">Organization / Institution Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kenya Association of Manufacturers / Gated Community"
                      className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#5C4D50] block mb-1">Target Budget Range (KES)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. KES 5,000,000 - KES 15,000,000"
                      className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#5C4D50] block mb-1">Project Scope & Sites</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Specify number of sites, county locations, power requirements..."
                      className="w-full bg-[#EEECEC]/50 border border-[#EEECEC] rounded-xl p-2.5 text-[#1E1B1C] outline-none focus:border-[#C01E25]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-bold py-3 rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Enterprise RFP for AI Sizing
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
