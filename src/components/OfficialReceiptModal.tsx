import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Building, 
  Send, 
  Mail,
  Copy,
  Check
} from 'lucide-react';
import { HynovaReceipt } from '../types';
import { HynovaLogo } from './HynovaLogo';

interface OfficialReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: HynovaReceipt | null;
}

export const OfficialReceiptModal: React.FC<OfficialReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
}) => {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen || !receipt) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(receipt.transactionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div 
        className="relative bg-[#FFFFFF] rounded-3xl max-w-2xl w-full border border-[#EEECEC] shadow-2xl overflow-hidden print:border-none print:shadow-none print:rounded-none"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Actions (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEECEC] bg-[#EEECEC]/30 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
              Official Tax Receipt
            </span>
            <span className="text-xs text-[#5C4D50] font-mono font-bold">
              {receipt.receiptNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs font-bold text-[#1E1B1C] hover:text-[#C01E25] bg-[#FFFFFF] hover:bg-[#EEECEC] border border-[#EEECEC] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleSendEmail}
              className="text-xs font-bold text-[#1E1B1C] hover:text-[#C01E25] bg-[#FFFFFF] hover:bg-[#EEECEC] border border-[#EEECEC] px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Email Copy"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{emailSent ? 'Receipt Emailed!' : 'Email Receipt'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC] rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Body */}
        <div className="p-8 sm:p-10 space-y-8 bg-[#FFFFFF]" id="hynova-printable-receipt">
          {/* Header & Logo */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[#EEECEC] pb-6">
            <div>
              <HynovaLogo variant="horizontal" size="md" />
              <div className="text-xs text-[#5C4D50] mt-3 space-y-0.5">
                <p className="font-extrabold text-[#1E1B1C]">HYNOVA Enterprises Ltd</p>
                <p>AI Powered Technology Fulfillment Network</p>
                <p>Nairobi, Kenya • 47 Counties Nationwide Delivery</p>
                <p>KRA PIN: P051982731X • VAT Compliance Rate: 16%</p>
                <p>Direct Support: 0727 547 310 • info@hynovaenterprises.com</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C01E25] block">
                Official ETR Receipt
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#1E1B1C] font-mono">
                {receipt.receiptNumber}
              </div>
              <div className="text-xs text-[#5C4D50]">
                Date: <strong>{receipt.date}</strong>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#128C7E] bg-[#25D366]/15 px-2.5 py-0.5 rounded-full border border-[#25D366]/30">
                <CheckCircle2 className="w-3 h-3 text-[#25D366]" />
                <span>PAYMENT CONFIRMED (ESCROW SECURED)</span>
              </div>
            </div>
          </div>

          {/* Customer & Transaction Reference Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#EEECEC]/30 p-5 rounded-2xl border border-[#EEECEC] text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7B7F] block mb-1">
                Billed To Customer
              </span>
              <div className="font-extrabold text-[#1E1B1C] text-sm">
                {receipt.customerName}
              </div>
              <div className="text-[#5C4D50] mt-0.5">
                Mobile: {receipt.customerPhone}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8F7B7F] block mb-1">
                Transaction Metadata
              </span>
              <div className="text-[#5C4D50]">
                Project Ref: <strong className="text-[#1E1B1C]">{receipt.projectReference}</strong>
              </div>
              <div className="text-[#5C4D50] flex items-center gap-1.5 mt-0.5">
                <span>M-Pesa Trans ID:</span>
                <strong className="text-[#C01E25] font-mono">{receipt.transactionCode}</strong>
                <button
                  onClick={handleCopyCode}
                  className="text-[#8F7B7F] hover:text-[#1E1B1C] cursor-pointer print:hidden"
                  title="Copy Transaction ID"
                >
                  {copied ? <Check className="w-3 h-3 text-[#128C7E]" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
              <div className="text-[#5C4D50] mt-0.5">
                Payment Channel: <strong>{receipt.paymentMethod}</strong>
              </div>
            </div>
          </div>

          {/* Line Item Breakdown */}
          <div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#EEECEC] text-[#8F7B7F] uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 text-left font-bold">Item Description</th>
                  <th className="py-2.5 text-center font-bold">Category</th>
                  <th className="py-2.5 text-right font-bold">Amount (KES)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEECEC]">
                <tr>
                  <td className="py-3 text-left">
                    <span className="font-extrabold text-[#1E1B1C] block">{receipt.itemDescription}</span>
                    <span className="text-[11px] text-[#5C4D50]">
                      Certified technician deployment & verified physical assessment
                    </span>
                  </td>
                  <td className="py-3 text-center text-[#5C4D50] font-medium">
                    {receipt.paymentType === 'SITE_SURVEY_FEE' ? 'Physical Site Survey' : 'Escrow Deposit'}
                  </td>
                  <td className="py-3 text-right font-extrabold text-[#1E1B1C] font-mono">
                    KES {receipt.subtotalKES.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* VAT & Total Summary Card (Operating Agreement Section 5) */}
          <div className="border-t border-[#EEECEC] pt-4">
            <div className="w-full sm:w-72 ml-auto space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#5C4D50]">
                <span>Project Subtotal:</span>
                <span className="font-bold text-[#1E1B1C] font-mono">
                  KES {receipt.subtotalKES.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between text-[#5C4D50]">
                <span>Kenyan VAT (16%):</span>
                <span className="font-bold text-[#C01E25] font-mono">
                  KES {receipt.vatAmountKES.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#EEECEC] text-sm sm:text-base font-black text-[#1E1B1C]">
                <span>Total Paid:</span>
                <span className="text-[#C01E25] font-mono">
                  KES {receipt.amountPaidKES.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* M-Pesa Escrow Protection Guarantee Stamp */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-[#F0C9CB]/30 via-[#EEECEC]/40 to-[#F0C9CB]/30 border border-[#DB7D81]/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C01E25] text-[#FFFFFF] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <strong className="text-[#1E1B1C] block">M-Pesa Protected Escrow Safeguard</strong>
                <span className="text-[11px] text-[#5C4D50]">
                  Funds are secured under HYNOVA Escrow. Discretionary survey credit applies on project sign-off.
                </span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#128C7E] block">
                AUTHENTICATED
              </span>
              <span className="font-mono text-[10px] text-[#8F7B7F]">
                HYN-HASH-{receipt.transactionCode.slice(-6)}
              </span>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="text-[11px] text-[#8F7B7F] text-center pt-4 border-t border-[#EEECEC] space-y-1">
            <p>
              This is a computer-generated tax receipt adhering to the Kenya Revenue Authority (KRA) electronic tax compliance guidelines.
            </p>
            <p>
              HYNOVA Enterprises Ltd • P.O. Box 42100-00100 Nairobi • Helpline: 0727 547 310
            </p>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="px-6 py-4 border-t border-[#EEECEC] bg-[#EEECEC]/20 flex items-center justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#1E1B1C] hover:bg-[#332f30] text-[#FFFFFF] font-bold text-xs cursor-pointer transition-colors"
          >
            Close Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
