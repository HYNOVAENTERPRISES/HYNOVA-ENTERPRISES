import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [requirement, setRequirement] = useState('Solar & Backup Power');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Jambo HYNOVA! I would like to speak with a technology advisor regarding ${requirement} in ${county}.`
    );
    window.open(`https://wa.me/254727547310?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B1C]/60 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[#FFFFFF] border border-[#EEECEC] rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C01E25] to-[#DB7D81] p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/80 mb-1">
              <Phone className="w-3.5 h-3.5" />
              <span>Talk to HYNOVA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              Connect With a Technology Advisor
            </h2>
            <p className="text-xs text-white/90 mt-0.5">
              Available 8:00 AM – 7:00 PM EAT across all 47 counties in Kenya
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close Contact Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Fast Connect Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleWhatsApp}
              className="p-4 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#128C7E] block">Instant Chat</span>
                <span className="text-sm font-extrabold text-[#1E1B1C]">WhatsApp Advisor</span>
              </div>
            </button>

            <a
              href="tel:+254727547310"
              className="p-4 rounded-2xl bg-[#EEECEC]/50 hover:bg-[#EEECEC] border border-[#EEECEC] text-left transition-all flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C01E25] text-white flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#5C4D50] block">Direct Phone</span>
                <span className="text-sm font-extrabold text-[#1E1B1C]">0727 547 310</span>
              </div>
            </a>
          </div>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-[#F0C9CB]/30 border border-[#C01E25] text-center space-y-2 animate-in fade-in">
              <CheckCircle2 className="w-10 h-10 text-[#C01E25] mx-auto" />
              <h3 className="text-lg font-bold text-[#1E1B1C]">Message Received</h3>
              <p className="text-xs text-[#5C4D50] max-w-sm mx-auto">
                A HYNOVA technical consultant in {county} will call you at <strong className="text-[#1E1B1C]">{phone}</strong> within 15 minutes.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5C4D50] block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Samuel Karanja"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5C4D50] block mb-1">Phone Number (M-Pesa)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XX XXX XXX"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#5C4D50] block mb-1">What do you need?</label>
                  <select
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#FFFFFF]"
                  >
                    <option>Solar & Backup Power</option>
                    <option>CCTV & Perimeter Security</option>
                    <option>Fast Internet & Structured Cabling</option>
                    <option>Smart Gates & Biometric Access</option>
                    <option>Commercial Building Infrastructure</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#5C4D50] block mb-1">County Location</label>
                  <input
                    type="text"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                    placeholder="e.g. Nairobi, Kiambu, Nakuru..."
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C4D50] block mb-1">Brief Description (Optional)</label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Need backup power for a 4-bedroom house in Karen to handle regular power outages."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-1.5 text-[11px] text-[#5C4D50]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                  <span>Free consultation • Zero obligation</span>
                </div>

                <button
                  type="submit"
                  className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Call Back</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Info Footer */}
          <div className="pt-4 border-t border-[#EEECEC] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#5C4D50]">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C01E25]" />
              <span>info@hynovaenterprises.com</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#C01E25]" />
              <span>Nairobi, Kenya • Serving All 47 Counties</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
