import React, { useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Wrench, 
  Store, 
  Search, 
  Filter, 
  ShieldCheck, 
  Lock, 
  XCircle,
  ArrowRight,
  Send,
  Eye,
  FileCheck
} from 'lucide-react';
import { AppView, TechnicianRank } from '../types';
import { AuditLogService } from '../services/securityService';

interface StaffPortalProps {
  onNavigate?: (view: AppView) => void;
}

export const StaffPortal: React.FC<StaffPortalProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'coordination' | 'support' | 'rbac'>('requests');
  const [searchFilter, setSearchFilter] = useState('');
  const [statusBanner, setStatusBanner] = useState<string | null>(null);

  const showStatus = (msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => setStatusBanner(null), 4000);
  };
  
  // Operational customer requests queue
  const [customerRequests, setCustomerRequests] = useState([
    {
      id: 'REQ-1092',
      customerName: 'Mary Wanjiku',
      location: 'Nakuru County (Section 58)',
      category: 'Hybrid Solar 5kW',
      budget: 'KES 380,000',
      status: 'Awaiting Coordinator Review',
      urgency: 'Medium',
      submittedAt: 'Today, 14:20 EAT',
      notes: 'Customer experiences daily power outages. Roof is corrugated iron, pitch 22 deg.',
    },
    {
      id: 'REQ-1093',
      customerName: 'Kenyatta Academy',
      location: 'Kiambu County (Ruiru)',
      category: '16-Camera AI CCTV & Perimeter',
      budget: 'KES 240,000',
      status: 'Technician Assigned',
      urgency: 'High',
      submittedAt: 'Today, 11:05 EAT',
      notes: 'Boarding school administration block and dorm perimeter coverage required.',
    },
    {
      id: 'REQ-1094',
      customerName: 'Greenwood Apartments',
      location: 'Nairobi County (Kilimani)',
      category: 'Biometric Access & Gate Automation',
      budget: 'KES 195,000',
      status: 'Supplier Order Dispatched',
      urgency: 'Normal',
      submittedAt: 'Yesterday, 16:40 EAT',
      notes: 'Replacement of manual entry arm with automatic sliding motor and RFID keyfobs.',
    },
  ]);

  const [activeSupportTicket, setActiveSupportTicket] = useState<{
    id: string;
    customer: string;
    technician: string;
    subject: string;
    status: string;
    messages: { sender: string; time: string; text: string }[];
  }>({
    id: 'SUP-401',
    customer: 'Mary Wanjiku (Nakuru)',
    technician: 'Dennis Koech (Level 3 Tech)',
    subject: 'Roof mounting clamp compatibility inquiry',
    status: 'In Progress',
    messages: [
      {
        sender: 'Dennis Koech (Technician)',
        time: '15:10 EAT',
        text: 'The roof pitch on section 58 requires L-feet clamps with rubber EPDM washers. Confirming supplier warehouse has 32 units in stock.',
      },
      {
        sender: 'Staff Coordinator (You)',
        time: '15:14 EAT',
        text: 'Checking Nakuru distributor inventory. Bonded warehouse confirmed 40 units available for pickup.',
      },
    ],
  });

  const [replyMessage, setReplyMessage] = useState('');

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const newMsg = {
      sender: 'Staff Coordinator (You)',
      time: 'Just now',
      text: replyMessage,
    };

    setActiveSupportTicket((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
    }));

    AuditLogService.addLog({
      actorEmail: 'ops.lead@hynovaenterprises.com',
      actorRole: 'staff',
      ipAddress: '102.219.208.50',
      actionCategory: 'Profile Update',
      actionDetails: `Staff responded to support ticket ${activeSupportTicket.id}`,
      targetResource: `ticket:${activeSupportTicket.id}`,
      status: 'SUCCESS',
    });

    setReplyMessage('');
  };

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-10 border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                HYNOVA Staff Operations Console
              </span>
              <span className="text-[11px] font-bold text-[#5C4D50] bg-[#EEECEC] px-2.5 py-0.5 rounded-full">
                Tenant: Operations Coordinator
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1E1B1C] tracking-tight">
              Operational Coordination Hub
            </h1>
            <p className="text-sm text-[#5C4D50] mt-1">
              Managing customer requests, technician project dispatch, support coordination, and field workflows.
            </p>
          </div>

          {/* RBAC Boundary Capsule */}
          <div className="bg-[#EEECEC]/50 p-4 rounded-2xl border border-[#EEECEC] text-xs text-[#5C4D50] max-w-sm">
            <div className="flex items-center gap-1.5 font-bold text-[#1E1B1C] mb-1">
              <Lock className="w-4 h-4 text-[#C01E25]" />
              <span>Staff Authorization Scope</span>
            </div>
            <div>
              Staff permissions allow operational coordination. Root permissions, security keys, audit logs, and escrow payouts are restricted to Administrator roles.
            </div>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Pending Customer Inquiries</span>
            <div className="text-2xl font-black text-[#C01E25] mt-1">3 New</div>
            <div className="text-xs text-[#5C4D50] mt-0.5">Average triage SLA: 18 minutes</div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Active Field Dispatches</span>
            <div className="text-2xl font-black text-[#1E1B1C] mt-1">12 Jobs</div>
            <div className="text-xs text-emerald-700 font-semibold mt-0.5">All on track per EPRA codes</div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Open Support Tickets</span>
            <div className="text-2xl font-black text-[#1E1B1C] mt-1">1 Open</div>
            <div className="text-xs text-[#DB7D81] font-semibold mt-0.5">Technical parts confirmation</div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Field Handover Sign-Offs</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">100% Ready</div>
            <div className="text-xs text-[#5C4D50] mt-0.5">Awaiting customer digital signature</div>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusBanner && (
          <div className="p-4 rounded-2xl bg-[#F0C9CB]/40 border border-[#C01E25] text-[#C01E25] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs">
            <span>{statusBanner}</span>
            <button onClick={() => setStatusBanner(null)} className="text-xs text-[#C01E25] font-bold">✕</button>
          </div>
        )}

        {/* Portal Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#EEECEC] pb-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'requests'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Customer Request Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('coordination')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'coordination'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Technician Dispatch Coordination</span>
          </button>

          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'support'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Support Communications Hub</span>
          </button>

          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'rbac'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Staff Role Boundaries</span>
          </button>
        </div>

        {/* TAB 1: REQUESTS QUEUE */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1E1B1C]">Active Customer Engineering Requests</h2>
              <span className="text-xs text-[#5C4D50]">3 items in queue</span>
            </div>

            <div className="space-y-3">
              {customerRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1E1B1C]">{req.id}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full">
                        {req.category}
                      </span>
                      <span className="text-[10px] font-semibold text-[#5C4D50] bg-[#EEECEC] px-2 py-0.5 rounded">
                        {req.location}
                      </span>
                    </div>

                    <div className="text-sm font-black text-[#1E1B1C]">{req.customerName}</div>
                    <p className="text-xs text-[#5C4D50]">{req.notes}</p>
                    <div className="text-[11px] font-semibold text-[#5C4D50]">
                      Budget: <span className="text-[#C01E25] font-bold">{req.budget}</span> • Submitted: {req.submittedAt}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start md:self-auto">
                    <button
                      onClick={() => {
                        AuditLogService.addLog({
                          actorEmail: 'ops.lead@hynovaenterprises.com',
                          actorRole: 'staff',
                          ipAddress: '102.219.208.50',
                          actionCategory: 'Project Assignment',
                          actionDetails: `Staff matched technician to request ${req.id}`,
                          targetResource: `request:${req.id}`,
                          status: 'SUCCESS',
                        });
                        showStatus(`Request ${req.id} routed to regional field coordinator in ${req.location}.`);
                      }}
                      className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Assign Qualified Technician
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: COORDINATION */}
        {activeTab === 'coordination' && (
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] space-y-4">
            <h2 className="text-lg font-bold text-[#1E1B1C]">Field Dispatch & Work Order Monitor</h2>
            <p className="text-xs text-[#5C4D50]">
              Coordinators ensure that assigned technicians possess required EPRA/NCA certifications and that equipment from bonded warehouses arrives prior to installation start.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#1E1B1C]">JOB-4019: Kilimani AI CCTV Deployment</div>
                  <div className="text-[11px] text-[#5C4D50]">Assigned to Dennis Koech (Level 3 Tech) • Hardware Picked Up</div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                  Site Survey Approved
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[#1E1B1C]">JOB-4020: Ruiru School Wi-Fi & Solar</div>
                  <div className="text-[11px] text-[#5C4D50]">Assigned to John Mutua (Level 2 Tech) • Awaiting Inverter Delivery</div>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                  Hardware in Transit
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SUPPORT COMMUNICATIONS */}
        {activeTab === 'support' && (
          <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] space-y-4">
            <div className="border-b border-[#EEECEC] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full">
                Ticket {activeSupportTicket.id}
              </span>
              <h2 className="text-lg font-black text-[#1E1B1C] mt-1">{activeSupportTicket.subject}</h2>
              <div className="text-xs text-[#5C4D50] mt-0.5">
                Customer: {activeSupportTicket.customer} • Tech: {activeSupportTicket.technician}
              </div>
            </div>

            {/* Chat History */}
            <div className="space-y-3 p-4 bg-[#EEECEC]/30 rounded-2xl border border-[#EEECEC] max-h-80 overflow-y-auto">
              {activeSupportTicket.messages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl text-xs max-w-xl ${
                    msg.sender.includes('You')
                      ? 'bg-[#C01E25] text-white ml-auto'
                      : 'bg-white text-[#1E1B1C] border border-[#EEECEC]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-80 mb-1">
                    <span className="font-bold">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Reply Input */}
            <form onSubmit={handleSendReply} className="flex gap-2">
              <input
                type="text"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                placeholder="Type response to coordinate customer and field technician..."
                className="flex-grow bg-[#EEECEC]/40 border border-[#EEECEC] rounded-xl px-4 py-2.5 text-xs text-[#1E1B1C] focus:outline-none focus:border-[#C01E25]"
              />
              <button
                type="submit"
                className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: RBAC BOUNDARIES FOR STAFF */}
        {activeTab === 'rbac' && (
          <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#EEECEC] space-y-6">
            <h2 className="text-xl font-bold text-[#1E1B1C]">
              Staff Role Access Control Specification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 font-bold text-emerald-950 text-sm mb-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>HYNOVA Staff CAN:</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-900">
                  <li>• Manage customer project requests</li>
                  <li>• Coordinate technician field dispatches</li>
                  <li>• Manage communications between customers and technicians</li>
                  <li>• Assist support cases and troubleshoot field inquiries</li>
                  <li>• Update operational workflows and milestone checkpoints</li>
                </ul>
              </div>

              <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200">
                <div className="flex items-center gap-2 font-bold text-rose-950 text-sm mb-3">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>HYNOVA Staff CANNOT:</span>
                </div>
                <ul className="space-y-2 text-xs text-rose-900">
                  <li>• Modify system permissions or role structures</li>
                  <li>• Access security architecture settings or HSM keys</li>
                  <li>• Modify, delete, or tamper with immutable audit logs</li>
                  <li>• Access platform ownership controls</li>
                  <li>• Release escrow payouts without executive admin sign-off</li>
                </ul>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
