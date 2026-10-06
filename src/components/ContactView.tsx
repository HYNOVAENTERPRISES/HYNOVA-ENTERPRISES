import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Sparkles,
  HelpCircle,
  Headphones
} from 'lucide-react';
import { AppView } from '../types';
import { KENYAN_COUNTIES } from '../data/mockData';

interface ContactViewProps {
  onNavigate: (view: AppView) => void;
  onOpenAI?: () => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate, onOpenAI }) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('Nairobi');
  const [requirement, setRequirement] = useState('Hybrid Solar Power Backup');
  const [budgetRange, setBudgetRange] = useState('KES 100,000 – KES 300,000');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const directPhone = '0727 547 310';
  const internationalPhone = '+254 727 547 310';
  const whatsappDigits = '254727547310';
  const officialEmail = 'info@hynovaenterprises.com';

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Jambo HYNOVA! I would like to inquire about ${requirement} in ${county}. My budget is approximately ${budgetRange}.`
    );
    window.open(`https://wa.me/${whatsappDigits}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How fast can a certified technician inspect my site in Kenya?',
      a: 'In major urban centers (Nairobi, Kiambu, Machakos, Mombasa, Nakuru, Eldoret, Kisumu), a verified technician can visit your site within 24 hours. For other counties, site visits are scheduled within 48 hours.',
    },
    {
      q: 'How does M-Pesa Escrow protect my investment?',
      a: 'When you approve an equipment and installation quotation, your payment is placed safely in M-Pesa Escrow. Funds are never released to technicians or equipment suppliers until you sign off on a successful test run.',
    },
    {
      q: 'Can I speak directly with an engineer before placing an order?',
      a: `Yes! Call our direct helpline at ${directPhone} or message our advisory team on WhatsApp. We provide free engineering guidance on system sizing, load calculations, and genuine brand comparisons.`,
    },
    {
      q: 'Do you provide warranties on equipment and installation?',
      a: 'All hardware comes with manufacturer-backed warranties (e.g. 5–10 years for Tier-1 solar inverters and lithium batteries, 2–3 years for Hikvision AI cameras). HYNOVA provides an additional 1-year workmanship warranty on certified installations.',
    },
  ];

  return (
    <div className="py-12 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0C9CB]/40 text-xs font-bold text-[#C01E25] mb-3">
            <Headphones className="w-3.5 h-3.5" />
            <span>NATIONWIDE TECHNICAL ADVISORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#1E1B1C] tracking-tight mb-4">
            Contact HYNOVA
          </h1>
          <p className="text-base sm:text-lg text-[#5C4D50] leading-relaxed">
            Have a project in mind or need expert sizing advice? Our certified technology advisors are ready to assist you across all 47 counties.
          </p>
        </div>

        {/* Primary Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {/* Card 1: Phone */}
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81]/70 transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#F0C9CB] text-[#C01E25] flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Direct Helpline</span>
                <h3 className="text-2xl font-black text-[#1E1B1C] mt-1">{directPhone}</h3>
                <p className="text-xs text-[#5C4D50] mt-1">Available Mon–Sat: 8:00 AM – 7:00 PM EAT</p>
              </div>
            </div>
            <div className="pt-6 border-t border-[#EEECEC] mt-6">
              <a
                href={`tel:${internationalPhone.replace(/\s+/g, '')}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call {directPhone}</span>
              </a>
            </div>
          </div>

          {/* Card 2: WhatsApp */}
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#25D366]/30 hover:border-[#25D366] transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 text-[#128C7E] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 fill-[#25D366]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#128C7E]">Instant WhatsApp</span>
                <h3 className="text-2xl font-black text-[#1E1B1C] mt-1">{directPhone}</h3>
                <p className="text-xs text-[#5C4D50] mt-1">Direct chat with our technical solutions team</p>
              </div>
            </div>
            <div className="pt-6 border-t border-[#EEECEC] mt-6">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Card 3: Email & HQ */}
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#EEECEC] hover:border-[#DB7D81]/70 transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#EEECEC] text-[#1E1B1C] flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Official Email</span>
                <h3 className="text-lg sm:text-xl font-bold text-[#1E1B1C] mt-1 break-all">{officialEmail}</h3>
                <p className="text-xs text-[#5C4D50] mt-1">Nairobi, Kenya • 47 Counties Coverage</p>
              </div>
            </div>
            <div className="pt-6 border-t border-[#EEECEC] mt-6">
              <a
                href={`mailto:${officialEmail}`}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#EEECEC] hover:bg-[#e0dede] text-[#1E1B1C] font-bold text-xs transition-colors cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Section: Callback Request Form + Why Trust HYNOVA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#EEECEC] rounded-3xl p-6 sm:p-10 shadow-xs">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
                Fast Consultation
              </span>
              <h2 className="text-2xl font-black text-[#1E1B1C] mt-2">
                Request a Callback or Consultation
              </h2>
              <p className="text-xs sm:text-sm text-[#5C4D50] mt-1">
                Tell us about your property. A certified technology consultant will reach out via call or WhatsApp.
              </p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-[#F0C9CB]/30 border border-[#C01E25] text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#C01E25] mx-auto" />
                <h3 className="text-xl font-bold text-[#1E1B1C]">Inquiry Received!</h3>
                <p className="text-sm text-[#5C4D50] max-w-md mx-auto">
                  Asante sana, <strong>{fullName}</strong>. A HYNOVA technical coordinator for <strong>{county}</strong> will reach you at <strong>{phone}</strong> within 15–30 minutes.
                </p>
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenAI) {
                        onOpenAI();
                      } else {
                        onNavigate('ai-recommendation');
                      }
                    }}
                    className="px-6 py-2.5 rounded-xl bg-[#C01E25] text-white font-bold text-xs cursor-pointer hover:bg-[#a1181e] transition-colors"
                  >
                    Launch Instant Sizing
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="px-5 py-2.5 rounded-xl bg-[#EEECEC] text-[#1E1B1C] font-bold text-xs cursor-pointer hover:bg-[#e2e0e0] transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1E1B1C] block mb-1.5">
                      Full Name <span className="text-[#C01E25]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Peter Njoroge"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1E1B1C] block mb-1.5">
                      Phone Number (Call / WhatsApp) <span className="text-[#C01E25]">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07XX XXX XXX"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#1E1B1C] block mb-1.5">
                      Your County in Kenya
                    </label>
                    <select
                      value={county}
                      onChange={(e) => setCounty(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20 cursor-pointer"
                    >
                      {KENYAN_COUNTIES.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name} County
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#1E1B1C] block mb-1.5">
                      Solution Interest
                    </label>
                    <select
                      value={requirement}
                      onChange={(e) => setRequirement(e.target.value)}
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20 cursor-pointer"
                    >
                      <option value="Hybrid Solar Power Backup">Hybrid Solar Power Backup</option>
                      <option value="AI CCTV & Perimeter Security">AI CCTV & Perimeter Security</option>
                      <option value="Starlink & High-Speed Wi-Fi">Starlink & High-Speed Wi-Fi</option>
                      <option value="Electric Gates & Intercoms">Electric Gates & Intercoms</option>
                      <option value="Smart Building Automation">Smart Building Automation</option>
                      <option value="Full Compound Technology Package">Full Compound Technology Package</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1E1B1C] block mb-1.5">
                    Estimated Budget Range (Optional)
                  </label>
                  <select
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20 cursor-pointer"
                  >
                    <option value="Under KES 60,000">Under KES 60,000 (Essential Backup / 4-Cam Security)</option>
                    <option value="KES 60,000 – KES 150,000">KES 60,000 – KES 150,000 (Standard Home / Business)</option>
                    <option value="KES 150,000 – KES 350,000">KES 150,000 – KES 350,000 (Hybrid Solar / Comprehensive AI)</option>
                    <option value="KES 350,000 – KES 600,000">KES 350,000 – KES 600,000 (Estate / Commercial)</option>
                    <option value="Above KES 600,000">Above KES 600,000 (Institutional / Industrial)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1E1B1C] block mb-1.5">
                    Specific Requirements or Questions (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. 4-bedroom house in Kitengela requiring power backup for fridge, lights, TV, and 6 CCTV cameras."
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#5C4D50]">
                    <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
                    <span>Zero obligation • Free sizing consultation</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/20 cursor-pointer transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Callback Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Trust Framework & Office Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-[#EEECEC]/40 to-[#F0C9CB]/20 p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#C01E25] text-white flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E1B1C]">The HYNOVA Trust Guarantee</h3>
                  <p className="text-xs text-[#5C4D50]">Why property owners choose HYNOVA</p>
                </div>
              </div>

              <div className="space-y-3 pt-2 text-xs text-[#1E1B1C]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                  <span><strong>100% Escrow Protection:</strong> Funds held securely via M-Pesa until installation is tested and confirmed.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                  <span><strong>EPRA & NCA Certified:</strong> Every installer is certified, background-checked, and National ID verified.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                  <span><strong>Genuine Hardware:</strong> Direct supply from authorized Kenya distributors with full manufacturer warranty.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                  <span><strong>1-Year Workmanship Warranty:</strong> Free post-installation maintenance and compliance checkups.</span>
                </div>
              </div>
            </div>

            {/* AI Recommendation Quick Action */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs text-center space-y-3">
              <Sparkles className="w-8 h-8 text-[#C01E25] mx-auto" />
              <h4 className="text-base font-black text-[#1E1B1C]">Prefer Instant Automated Sizing?</h4>
              <p className="text-xs text-[#5C4D50]">
                Answer 4 quick questions to get an itemized bill of materials and price quotation in 60 seconds.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (onOpenAI) {
                    onOpenAI();
                  } else {
                    onNavigate('ai-recommendation');
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-[#1E1B1C] hover:bg-[#332f30] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Try Recommendation Engine</span>
              </button>
            </div>
          </div>
        </div>

        {/* FAQs Section */}
        <div className="bg-[#EEECEC]/30 rounded-3xl border border-[#EEECEC] p-8 sm:p-12 mb-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B1C] mt-2">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((f, i) => (
              <div key={i} className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#EEECEC] space-y-2">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-[#C01E25] shrink-0 mt-0.5" />
                  <h4 className="text-sm font-bold text-[#1E1B1C]">{f.q}</h4>
                </div>
                <p className="text-xs text-[#5C4D50] leading-relaxed pl-7.5">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
