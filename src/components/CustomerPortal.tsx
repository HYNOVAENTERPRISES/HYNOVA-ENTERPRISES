import React, { useState } from 'react';
import { 
  Building, 
  Sparkles, 
  Wrench, 
  CreditCard, 
  Phone, 
  CheckCircle2, 
  MessageSquare, 
  User, 
  LifeBuoy, 
  LayoutDashboard,
  LogOut,
  FolderKanban,
  FileText,
  Clock,
  ShieldCheck,
  Send,
  AlertCircle,
  Plus,
  Receipt,
  Printer,
  MapPin
} from 'lucide-react';
import { AppView, HynovaReceipt } from '../types';
import { OfficialReceiptModal } from './OfficialReceiptModal';

interface CustomerPortalProps {
  onNavigate: (view: AppView) => void;
  onOpenAI: () => void;
  onSignOut?: () => void;
}

type CustomerTab = 
  | 'dashboard' 
  | 'projects' 
  | 'ai-recommendations' 
  | 'invoices' 
  | 'support' 
  | 'messages' 
  | 'profile';

export const CustomerPortal: React.FC<CustomerPortalProps> = ({ 
  onNavigate, 
  onOpenAI,
  onSignOut,
}) => {
  // STRICTLY 7 MENU ITEMS: Dashboard, Projects, AI Recommendations, Invoices, Support, Messages, Profile
  const [activeTab, setActiveTab] = useState<CustomerTab>('dashboard');

  // Support ticket states
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketCreated, setTicketCreated] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<HynovaReceipt | null>(null);

  // Message chat state
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'Dennis Koech (Assigned Lead Technician)',
      role: 'technician',
      time: '10:15 AM',
      text: 'Jambo Mr. Karanja! The 5kW Deye Inverter and Felicity Lithium battery have arrived on site in Karen. We are beginning roof bracket mounting now.',
    },
    {
      sender: 'You',
      role: 'customer',
      time: '10:22 AM',
      text: 'Asante Dennis. Please ensure the DC surge arrestor is installed beside the main DB box.',
    },
    {
      sender: 'Our Project Operations Team',
      role: 'ops',
      time: '10:25 AM',
      text: 'Milestone 4 (Roof Mounting) is in progress. Once Dennis uploads the commissioning test certificate, you will receive a prompt to inspect and authorize escrow release.',
    },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([
      ...messages,
      {
        sender: 'You',
        role: 'customer',
        time: 'Just now',
        text: chatInput.trim(),
      },
    ]);
    setChatInput('');
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketCreated(true);
    setTimeout(() => {
      setTicketCreated(false);
      setSupportSubject('');
      setSupportMessage('');
    }, 2500);
  };

  const activeProjects = [
    {
      id: 'PRJ-2026-041',
      title: '5kW Hybrid Solar & Lithium Storage Backup',
      property: '4-Bedroom Villa, Karen Nairobi',
      stage: 'Hardware Mounted • Inverter Testing Underway',
      progress: 80,
      locationRecordId: 'LOC-HYN-902144',
      coordinates: { lat: -1.3195, lng: 36.7065 },
      fullAddress: 'Miotoni Ridge, Karen, Nairobi County, Kenya',
      confidenceLabel: 'GPS Confirmed (100% Precision)',
      distanceFromHubKm: 14.2,
      travelZone: 'Zone A (0–15 KM)',
      isDifferentInstallationLocation: false,
      technician: null,
      escrowLockedKES: 340000,
      estimatedHandover: 'Tomorrow, 3:00 PM',
      milestones: [
        { name: 'AI Architecture & BOM Sized', done: true },
        { name: 'Escrow Funded via M-Pesa', done: true },
        { name: 'Hardware Delivered to Site', done: true },
        { name: 'Solar Panels & Inverter Mounting', done: true },
        { name: 'Digital Commissioning & Client Sign-Off', done: false },
      ],
    },
    {
      id: 'PRJ-2026-038',
      title: '8-Cam AI ColorVu CCTV & Starlink Enterprise Mesh',
      property: 'Holiday Cottages, Naivasha',
      stage: 'Completed & Certified',
      progress: 100,
      locationRecordId: 'LOC-HYN-619082',
      coordinates: { lat: -0.7172, lng: 36.4310 },
      fullAddress: 'South Lake Road Corridor, Naivasha, Nakuru County, Kenya',
      confidenceLabel: 'Google Maps Address Match (95% Precision)',
      distanceFromHubKm: 32.5,
      travelZone: 'Zone B (15–40 KM)',
      isDifferentInstallationLocation: true,
      recipientContact: {
        recipientName: 'Grace Wanjiku (Cottage Manager)',
        recipientPhone: '0721 990 123',
        siteAccessInstructions: 'Gate 2, second driveway after sanctuary gate',
      },
      technician: {
        name: 'Samuel Mutiso',
        phone: '+254 718 200 411',
        rank: 'NCA Level 2 Certified',
        rating: 4.88,
      },
      escrowLockedKES: 210000,
      estimatedHandover: 'Completed March 18, 2026',
      milestones: [
        { name: 'AI Architecture Sizing', done: true },
        { name: 'Escrow Deposit Funded', done: true },
        { name: 'Delivery from Bonded Warehouse', done: true },
        { name: 'Cabling & Angle Alignment', done: true },
        { name: 'Digital Commissioning & Sign-Off', done: true },
      ],
    },
  ];

  const savedAIRecommendations = [
    {
      id: 'REC-902',
      date: '2026-03-19',
      title: 'Commercial Office 10kW Hybrid Solar & Backup',
      property: 'Westlands Commercial Center, Nairobi',
      budgetKES: 680000,
      status: 'Ready to Order',
    },
    {
      id: 'REC-884',
      date: '2026-03-12',
      title: 'Biometric Access Control & Turnstile Gate Automation',
      property: 'Karen Villa Compound',
      budgetKES: 145000,
      status: 'Quote Locked',
    },
  ];

  const invoices = [
    {
      id: 'INV-8821',
      receiptNumber: 'HYN-REC-2026-0842',
      project: '5kW Hybrid Solar & Lithium Storage Backup',
      subtotalKES: 293103,
      vatKES: 46897,
      amountKES: 340000,
      date: '2026-03-20',
      status: 'Secured in Safaricom Escrow',
      mpesaRef: 'QJD492KSL2',
      paymentType: 'MILESTONE_DEPOSIT' as const,
    },
    {
      id: 'INV-8742',
      receiptNumber: 'HYN-REC-2026-0791',
      project: '8-Cam AI ColorVu CCTV & Starlink Enterprise Mesh',
      subtotalKES: 181034,
      vatKES: 28966,
      amountKES: 210000,
      date: '2026-03-15',
      status: 'Commissioned & Released',
      mpesaRef: 'QIB821PX90',
      paymentType: 'FINAL_COMMISSIONING' as const,
    },
    {
      id: 'INV-8650',
      receiptNumber: 'HYN-REC-2026-0618',
      project: 'Mandatory Physical Site Survey & Engineering Verification (Zone A)',
      subtotalKES: 862,
      vatKES: 138,
      amountKES: 1000,
      date: '2026-03-10',
      status: 'Paid & Discretionary Credit Eligible',
      mpesaRef: 'QHA910MM72',
      paymentType: 'SITE_SURVEY_FEE' as const,
    },
  ];

  // Exactly 7 items per user instructions
  const menuItems: { id: CustomerTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'ai-recommendations', label: 'AI Recommendations', icon: Sparkles },
    { id: 'invoices', label: 'Invoices', icon: CreditCard },
    { id: 'support', label: 'Support', icon: LifeBuoy },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="py-8 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CUSTOMER PORTAL TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                Customer Environment
              </span>
              <span className="text-xs text-[#5C4D50] font-medium">David Karanja • Nairobi, Kenya</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1E1B1C] mt-1">
              My Technology Portfolio
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAI}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Size New Project</span>
            </button>

            <button
              onClick={() => {
                if (onSignOut) {
                  onSignOut();
                } else {
                  onNavigate('home');
                }
              }}
              className="bg-[#EEECEC] hover:bg-[#F0C9CB]/30 text-[#5C4D50] hover:text-[#C01E25] text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Return to Public Website"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* STRICT NAVIGATION: EXACTLY 7 MENU ITEMS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EEECEC] scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`customer-nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer min-h-[42px] ${
                  isActive
                    ? 'bg-[#C01E25] text-[#FFFFFF] shadow-sm shadow-[#C01E25]/20'
                    : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#DB7D81]/40 shadow-xs">
                <span className="text-xs font-bold text-[#5C4D50] uppercase block mb-1">Active Installations</span>
                <span className="text-2xl font-black text-[#1E1B1C]">1 In Progress</span>
                <span className="text-xs text-[#C01E25] font-semibold mt-1 block">5kW Solar Backup (80%)</span>
              </div>
              <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#DB7D81]/40 shadow-xs">
                <span className="text-xs font-bold text-[#5C4D50] uppercase block mb-1">Protected in Escrow</span>
                <span className="text-2xl font-black text-[#C01E25]">KES 340,000</span>
                <span className="text-xs text-[#5C4D50] mt-1 block">Awaiting final commissioning sign-off</span>
              </div>
              <div className="p-5 rounded-3xl bg-[#FFFFFF] border border-[#DB7D81]/40 shadow-xs">
                <span className="text-xs font-bold text-[#5C4D50] uppercase block mb-1">Completed Handled</span>
                <span className="text-2xl font-black text-[#1E1B1C]">1 Handed Over</span>
                <span className="text-xs text-[#5C4D50] mt-1 block">8-Cam CCTV Naivasha (Certified)</span>
              </div>
            </div>

            {/* Current Urgent Milestone Action */}
            <div className="p-6 rounded-3xl bg-[#F0C9CB]/30 border border-[#C01E25] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase text-[#C01E25]">Next Action Required</span>
                <h3 className="text-base sm:text-lg font-black text-[#1E1B1C] mt-0.5">
                  Verify Solar Inverter & Authorize Milestone 5 Sign-Off
                </h3>
                <p className="text-xs text-[#5C4D50] mt-1">
                  Technician Dennis Koech will submit test photos at 3:00 PM tomorrow. Inspect the digital telemetry on your phone to release the final escrow.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('projects')}
                className="bg-[#C01E25] text-white font-bold text-xs px-5 py-3 rounded-xl shrink-0 cursor-pointer shadow-sm hover:bg-[#a1181e]"
              >
                Inspect Milestones
              </button>
            </div>
          </div>
        )}

        {/* 2. PROJECTS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            {activeProjects.map((proj) => (
              <div
                key={proj.id}
                className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 shadow-xs space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EEECEC]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C01E25]">{proj.id}</span>
                      <span className="text-xs font-bold text-[#1E1B1C] bg-[#EEECEC] px-2 py-0.5 rounded">
                        {proj.property}
                      </span>
                      <span className="text-[10px] font-bold text-[#128C7E] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#128C7E]" />
                        <span>Google Maps Pinned Rooftop</span>
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-[#1E1B1C] mt-1">{proj.title}</h2>
                    <p className="text-xs text-[#5C4D50] mt-0.5">{proj.stage}</p>
                  </div>

                  <div className="text-left md:text-right">
                    <span className="text-[10px] uppercase font-bold text-[#5C4D50]">Protected in Escrow</span>
                    <div className="text-xl font-black text-[#C01E25]">
                      KES {proj.escrowLockedKES.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-[#DB7D81] font-semibold">ETA: {proj.estimatedHandover}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#1E1B1C]">Project Completion Progress</span>
                    <span className="font-extrabold text-[#C01E25]">{proj.progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#EEECEC] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#DB7D81] to-[#C01E25] rounded-full transition-all duration-500"
                      style={{ width: `${proj.progress}%` }}
                    />
                  </div>
                </div>

                {/* Milestones Flow */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2">
                  {proj.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-2xl border text-xs ${
                        m.done
                          ? 'bg-[#F0C9CB]/30 border-[#C01E25] text-[#C01E25]'
                          : 'bg-[#EEECEC]/40 border-[#EEECEC] text-[#5C4D50]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${m.done ? 'text-[#C01E25]' : 'text-[#8F7B7F]'}`} />
                        <span>Step {idx + 1}</span>
                      </div>
                      <span className="text-[11px] leading-tight block">{m.name}</span>
                    </div>
                  ))}
                </div>

                {/* Pinned Installation Location Details */}
                <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] space-y-2 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C01E25] shrink-0" />
                      <span className="font-extrabold text-[#1E1B1C]">Pinned Installation Location:</span>
                      <span className="text-[#5C4D50]">{proj.fullAddress}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-mono text-[#5C4D50]">
                        ({proj.coordinates.lat.toFixed(4)}, {proj.coordinates.lng.toFixed(4)})
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${proj.coordinates.lat},${proj.coordinates.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-[#C01E25] hover:underline flex items-center gap-1"
                      >
                        <span>View on Google Maps</span>
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#5C4D50] pt-1 border-t border-[#DDDADA]/60">
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {proj.confidenceLabel}
                    </span>
                    <span>Zone: <strong className="text-[#1E1B1C]">{proj.travelZone}</strong></span>
                    <span>Hub Distance: <strong className="text-[#1E1B1C]">{proj.distanceFromHubKm} km</strong></span>
                    <span className="font-mono text-[10px] text-[#8F7B7F]">Record ID: {proj.locationRecordId}</span>
                  </div>

                  {/* Recipient Notice if for another person */}
                  {proj.isDifferentInstallationLocation && proj.recipientContact && (
                    <div className="mt-2 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                      <div className="font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-amber-700" />
                        <span>Installation for Another Person / Property:</span>
                        <span className="text-[#1E1B1C] font-extrabold">{proj.recipientContact.recipientName}</span>
                        {proj.recipientContact.recipientPhone && (
                          <span className="text-[#5C4D50]">({proj.recipientContact.recipientPhone})</span>
                        )}
                      </div>
                      {proj.recipientContact.siteAccessInstructions && (
                        <p className="text-amber-800">
                          On-site access note: {proj.recipientContact.siteAccessInstructions}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Field Technician Status Card */}
                <div className="p-4 rounded-2xl bg-[#EEECEC]/30 border border-[#EEECEC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8F7B7F]/20 text-[#5C4D50] flex items-center justify-center font-black text-sm">
                      <Wrench className="w-5 h-5 text-[#C01E25]" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#1E1B1C] block">
                        {proj.technician ? (proj.technician as any).name : 'Awaiting technician assignment'}
                      </span>
                      <span className="text-[11px] text-[#5C4D50]">
                        {proj.technician 
                          ? `${(proj.technician as any).rank} • Rating: ⭐ ${(proj.technician as any).rating}` 
                          : 'Your project can proceed to the next stage once payment is verified and an eligible technician from our team is available for assignment.'}
                      </span>
                    </div>
                  </div>
                  {proj.technician ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveTab('messages')}
                        className="px-3 py-1.5 rounded-xl bg-white border border-[#EEECEC] hover:bg-[#EEECEC] text-xs font-bold text-[#1E1B1C] flex items-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Message Technician</span>
                      </button>
                      <a
                        href={`tel:${(proj.technician as any).phone}`}
                        className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call Technician</span>
                      </a>
                    </div>
                  ) : (
                    <span className="text-xs font-semibold text-[#8F7B7F] bg-white px-3 py-1.5 rounded-xl border border-[#EEECEC] shrink-0">
                      Assignment Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. AI RECOMMENDATIONS */}
        {activeTab === 'ai-recommendations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-[#1E1B1C]">Saved AI Solutions</h3>
              <button
                onClick={onOpenAI}
                className="bg-[#C01E25] text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run New Sizing</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAIRecommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EEECEC] shadow-xs space-y-4"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-[#C01E25] font-bold">{rec.id}</span>
                    <span className="text-[#8F7B7F]">{rec.date}</span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#1E1B1C] text-base">{rec.title}</h4>
                    <p className="text-xs text-[#5C4D50] mt-0.5">{rec.property}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-[#EEECEC]">
                    <div>
                      <span className="text-[10px] text-[#5C4D50] uppercase block">Estimated KES</span>
                      <span className="text-lg font-black text-[#1E1B1C]">KES {rec.budgetKES.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={onOpenAI}
                      className="text-xs font-bold text-[#C01E25] hover:underline"
                    >
                      Review & Order →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. INVOICES & TAX RECEIPTS (OPERATING AGREEMENT SECTION 5 & 6) */}
        {activeTab === 'invoices' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-extrabold text-[#1E1B1C]">Tax Invoices & Official Receipts</h3>
                <p className="text-xs text-[#5C4D50]">
                  All quotations and invoices comply with Kenyan tax law (16% VAT). Click any item to view or print the official KRA-compliant receipt.
                </p>
              </div>
            </div>

            <div className="border border-[#EEECEC] rounded-3xl overflow-hidden divide-y divide-[#EEECEC]">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] hover:bg-[#EEECEC]/10 transition-colors">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded">
                        {inv.id}
                      </span>
                      <span className="font-mono text-xs font-extrabold text-[#1E1B1C] bg-[#EEECEC] px-2 py-0.5 rounded">
                        {inv.receiptNumber}
                      </span>
                      <span className="text-xs text-[#5C4D50]">• M-Pesa: {inv.mpesaRef}</span>
                    </div>
                    <h4 className="font-extrabold text-sm sm:text-base text-[#1E1B1C] mt-1">{inv.project}</h4>
                    <div className="flex flex-wrap gap-3 text-xs text-[#5C4D50]">
                      <span>Issued: <strong>{inv.date}</strong></span>
                      <span>Subtotal: <strong>KES {inv.subtotalKES.toLocaleString()}</strong></span>
                      <span>VAT (16%): <strong>KES {inv.vatKES.toLocaleString()}</strong></span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col md:items-end justify-between items-center gap-2">
                    <div className="text-left md:text-right">
                      <div className="text-lg font-black text-[#1E1B1C] font-mono">
                        KES {inv.amountKES.toLocaleString()}
                      </div>
                      <span className="text-[11px] font-bold text-[#128C7E] bg-[#25D366]/15 px-2 py-0.5 rounded-full border border-[#25D366]/30">
                        {inv.status}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedReceipt({
                          receiptNumber: inv.receiptNumber,
                          invoiceNumber: inv.id,
                          customerName: 'David Karanja',
                          customerPhone: '+254 712 345 678',
                          projectReference: 'PRJ-2026-041',
                          itemDescription: inv.project,
                          subtotalKES: inv.subtotalKES,
                          vatAmountKES: inv.vatKES,
                          amountPaidKES: inv.amountKES,
                          date: inv.date,
                          paymentMethod: 'Safaricom M-Pesa',
                          transactionCode: inv.mpesaRef,
                          status: 'PAID',
                          paymentType: inv.paymentType,
                        });
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>View Tax Receipt</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. SUPPORT */}
        {activeTab === 'support' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="p-6 rounded-3xl bg-[#FFFFFF] border border-[#EEECEC] shadow-xs space-y-4">
              <h3 className="text-lg font-extrabold text-[#1E1B1C]">Customer Care & Warranty Support</h3>
              <p className="text-xs text-[#5C4D50]">
                Have a question about your installation, warranty, or technician visit? Open an inquiry with our operations team.
              </p>

              {ticketCreated ? (
                <div className="p-4 rounded-2xl bg-[#F0C9CB]/30 border border-[#C01E25] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#C01E25]" />
                  <span className="text-xs font-bold text-[#1E1B1C]">
                    Ticket logged. Our support coordinator will respond within 20 minutes.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleCreateTicket} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="e.g. Schedule warranty inspection for Karen Inverter"
                      className="w-full text-xs p-2.5 rounded-xl border border-[#EEECEC] bg-[#EEECEC]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Details</label>
                    <textarea
                      rows={3}
                      required
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe what you need assistance with..."
                      className="w-full text-xs p-2.5 rounded-xl border border-[#EEECEC] bg-[#EEECEC]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#C01E25] text-white font-bold text-xs rounded-xl hover:bg-[#a1181e] cursor-pointer"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* 6. MESSAGES */}
        {activeTab === 'messages' && (
          <div className="max-w-3xl mx-auto rounded-3xl border border-[#EEECEC] bg-[#FFFFFF] shadow-xs overflow-hidden flex flex-col h-[520px]">
            <div className="p-4 border-b border-[#EEECEC] bg-[#EEECEC]/30 flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-sm text-[#1E1B1C]">Project Coordination Channel</h4>
                <p className="text-[11px] text-[#5C4D50]">Direct thread with our Technical Operations Desk</p>
              </div>
              <span className="text-[10px] font-bold text-[#C01E25] bg-[#F0C9CB] px-2 py-0.5 rounded">
                Active Job #PRJ-041
              </span>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#EEECEC]/10">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col max-w-[80%] ${
                    m.role === 'customer' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <span className="text-[10px] font-bold text-[#8F7B7F] mb-0.5">{m.sender} • {m.time}</span>
                  <div
                    className={`p-3 rounded-2xl text-xs ${
                      m.role === 'customer'
                        ? 'bg-[#C01E25] text-white rounded-tr-xs'
                        : 'bg-[#FFFFFF] border border-[#EEECEC] text-[#1E1B1C] rounded-tl-xs shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-[#EEECEC] flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type your message to technician or ops..."
                className="flex-1 text-xs p-2.5 rounded-xl border border-[#EEECEC] bg-[#EEECEC]/20"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#C01E25] text-white hover:bg-[#a1181e] cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* 7. PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-xl mx-auto p-6 rounded-3xl bg-[#FFFFFF] border border-[#EEECEC] shadow-xs space-y-4">
            <h3 className="text-lg font-extrabold text-[#1E1B1C]">Customer Account Profile</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC] flex justify-between">
                <span className="font-bold text-[#5C4D50]">Full Name:</span>
                <span className="font-bold text-[#1E1B1C]">David Karanja</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC] flex justify-between">
                <span className="font-bold text-[#5C4D50]">Phone Number:</span>
                <span className="font-bold text-[#1E1B1C]">+254 712 345 678 (Verified M-Pesa)</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC] flex justify-between">
                <span className="font-bold text-[#5C4D50]">Email:</span>
                <span className="font-bold text-[#1E1B1C]">david.karanja@example.com</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC] flex justify-between">
                <span className="font-bold text-[#5C4D50]">Primary Property:</span>
                <span className="font-bold text-[#1E1B1C]">Karen Villa Compound, Nairobi</span>
              </div>
              <div className="p-3 rounded-xl bg-[#EEECEC]/30 border border-[#EEECEC] flex justify-between">
                <span className="font-bold text-[#5C4D50]">Escrow Protection Status:</span>
                <span className="font-bold text-[#C01E25]">Active & Protected</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Official Tax Receipt Modal (Operating Agreement Section 6) */}
      <OfficialReceiptModal
        isOpen={!!selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        receipt={selectedReceipt}
      />
    </div>
  );
};
