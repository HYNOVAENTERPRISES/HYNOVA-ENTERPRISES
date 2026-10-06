import React from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface PrivacyTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const PrivacyTermsModal: React.FC<PrivacyTermsModalProps> = ({
  isOpen,
  onClose,
  type,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B1C]/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[#FFFFFF] border border-[#EEECEC] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#EEECEC] flex items-center justify-between bg-[#EEECEC]/30">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center">
              {type === 'privacy' ? <Lock className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-[#1E1B1C]">
                {type === 'privacy' ? 'Privacy Policy & Data Protection' : 'Terms of Service & Escrow Rules'}
              </h2>
              <p className="text-xs text-[#5C4D50]">
                HYNOVA Enterprises Ltd • Republic of Kenya
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto text-xs sm:text-sm text-[#5C4D50] leading-relaxed">
          {type === 'privacy' ? (
            <>
              <div className="p-4 rounded-2xl bg-[#EEECEC]/50 border border-[#EEECEC] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1E1B1C]">
                  <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
                  <span>Kenya Data Protection Act (KDPA 2019) Compliance</span>
                </div>
                <p className="text-xs">
                  HYNOVA is registered as a Data Controller and Processor with the Office of the Data Protection Commissioner (ODPC), Kenya.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-[#1E1B1C] text-sm mb-1.5">1. Information We Collect</h3>
                <p>
                  We only collect data necessary to provide accurate technology recommendations, quotes, and installation services: customer contact details (name, phone number, email), installation site location, and property specifications.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-[#1E1B1C] text-sm mb-1.5">2. Use of Information</h3>
                <p>
                  Your information is utilized solely to calculate hardware sizing, facilitate delivery, dispatch certified local field technicians, and secure M-Pesa escrow milestones. We never sell your personal data to third parties.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-[#1E1B1C] text-sm mb-1.5">3. Data Security</h3>
                <p>
                  All data in transit and at rest is secured with enterprise-grade encryption. Access by field engineers is restricted strictly to active, dispatched work orders.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 rounded-2xl bg-[#EEECEC]/50 border border-[#EEECEC] space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#1E1B1C]">
                  <CheckCircle2 className="w-4 h-4 text-[#C01E25]" />
                  <span>M-Pesa Escrow Protection Agreement</span>
                </div>
                <p className="text-xs">
                  Your payments remain securely held until you inspect genuine hardware and sign off on completed installation.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-[#1E1B1C] text-sm mb-1.5">1. Equipment Sizing & Quotations</h3>
                <p>
                  Quotations generated via the HYNOVA AI Recommendation engine are benchmark preliminary estimates based on current distributor wholesale pricing. Final site inspection by a certified engineer confirms structural and cabling specifics before funds are committed.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-[#1E1B1C] text-sm mb-1.5">2. Milestone Sign-Off & Escrow Release</h3>
                <p>
                  Funds deposited for a project are protected in Safaricom Trust Escrow. Disbursements to technicians and equipment distributors occur only upon customer milestone approval.
                </p>
              </div>

              <div>
                <h3 className="font-extrabold text-[#1E1B1C] text-sm mb-1.5">3. Hardware Warranty</h3>
                <p>
                  All solar inverters, lithium batteries, CCTV cameras, and networking equipment are sourced from authorized Kenyan distributors with manufacturer warranties ranging from 1 to 10 years.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#EEECEC] flex justify-end bg-[#EEECEC]/20">
          <button
            onClick={onClose}
            className="bg-[#C01E25] hover:bg-[#a1181e] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
          >
            Understood & Close
          </button>
        </div>
      </div>
    </div>
  );
};
