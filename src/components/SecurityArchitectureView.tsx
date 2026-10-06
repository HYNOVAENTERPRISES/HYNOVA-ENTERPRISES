import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  Users, 
  BrainCircuit, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Clock, 
  Database, 
  Radio, 
  Server, 
  Terminal, 
  ShieldAlert, 
  Eye, 
  ArrowRight,
  RefreshCw,
  Cpu,
  Layers,
  ChevronRight,
  Fingerprint
} from 'lucide-react';
import { UserRole, AppView, AuditLogEntry } from '../types';
import { 
  ROLE_DEFINITIONS, 
  AI_PERMISSIONS_MODEL, 
  AuditLogService, 
  THREAT_ALERTS, 
  DEMO_SESSIONS 
} from '../services/securityService';

interface SecurityArchitectureViewProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onNavigate: (view: AppView) => void;
}

export const SecurityArchitectureView: React.FC<SecurityArchitectureViewProps> = ({
  currentRole,
  onSwitchRole,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'rbac' | 'ai-permissions' | 'audit-logs' | 'threats' | 'compliance'>('rbac');
  const [selectedRoleDetail, setSelectedRoleDetail] = useState<UserRole>(currentRole);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(AuditLogService.getLogs());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeSession = DEMO_SESSIONS[currentRole] || DEMO_SESSIONS.customer;

  const handleRefreshLogs = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setAuditLogs(AuditLogService.searchLogs(searchQuery, filterCategory, filterStatus));
      setIsRefreshing(false);
    }, 400);
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setAuditLogs(AuditLogService.searchLogs(q, filterCategory, filterStatus));
  };

  const handleCategoryFilter = (cat: string) => {
    setFilterCategory(cat);
    setAuditLogs(AuditLogService.searchLogs(searchQuery, cat, filterStatus));
  };

  const handleStatusFilter = (st: string) => {
    setFilterStatus(st);
    setAuditLogs(AuditLogService.searchLogs(searchQuery, filterCategory, st));
  };

  const rolesList: UserRole[] = [
    'customer',
    'technician',
    'supplier',
    'partner',
    'staff',
    'admin',
    'superadmin',
    'ai-service',
  ];

  return (
    <div className="bg-[#FFFFFF] min-h-screen py-10 border-b border-[#EEECEC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Breadcrumb & Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Enterprise Security & Governance
              </span>
              <span className="text-[11px] font-bold text-[#5C4D50] bg-[#EEECEC] px-2.5 py-0.5 rounded-full">
                KDPA 2019 Compliant
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1E1B1C] tracking-tight">
              Platform Security & Multi-Tenant Architecture
            </h1>
            <p className="text-sm text-[#5C4D50] mt-1">
              Role-Based Access Control (RBAC), cryptographic audit logging, strict tenant data isolation, and scoped AI models.
            </p>
          </div>

          {/* Active Session & Tenant Badge */}
          <div className="bg-[#EEECEC]/50 p-4 rounded-2xl border border-[#EEECEC] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C01E25] text-white flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-[#5C4D50] font-semibold uppercase tracking-wider">
                Current Active Tenant Context
              </div>
              <div className="text-xs font-black text-[#1E1B1C] flex items-center gap-2">
                <span>{activeSession.role.toUpperCase()}</span>
                <span className="text-[10px] bg-[#FFFFFF] border border-[#DB7D81]/40 px-2 py-0.5 rounded text-[#C01E25]">
                  {activeSession.tenantId}
                </span>
              </div>
              <div className="text-[10px] text-[#5C4D50] font-mono mt-0.5">
                {activeSession.encryptionStandard} • Session: {activeSession.expiresInSeconds}s
              </div>
            </div>
          </div>
        </div>

        {/* Security Metric Telemetry Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5C4D50] font-semibold mb-2">
              <span>TENANT ISOLATION</span>
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
            </div>
            <div className="text-2xl font-black text-[#1E1B1C]">100% Enforced</div>
            <div className="text-xs text-[#5C4D50] mt-1">Multi-tenant boundary middleware active across all counties</div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5C4D50] font-semibold mb-2">
              <span>DATA ENCRYPTION</span>
              <Database className="w-4 h-4 text-[#C01E25]" />
            </div>
            <div className="text-2xl font-black text-[#1E1B1C]">AES-256-GCM</div>
            <div className="text-xs text-[#5C4D50] mt-1">TLS 1.3 in transit with Hardware Security Module key vaults</div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5C4D50] font-semibold mb-2">
              <span>IMMUTABLE AUDIT TRAIL</span>
              <FileText className="w-4 h-4 text-[#DB7D81]" />
            </div>
            <div className="text-2xl font-black text-[#1E1B1C]">{auditLogs.length} Verified Logs</div>
            <div className="text-xs text-[#5C4D50] mt-1">Append-only cryptographic SHA-256 chain verification</div>
          </div>

          <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] shadow-xs">
            <div className="flex items-center justify-between text-xs text-[#5C4D50] font-semibold mb-2">
              <span>THREAT MONITORING</span>
              <ShieldAlert className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-600">All Defenses Active</div>
            <div className="text-xs text-[#5C4D50] mt-1">Rate limiting, bot detection, and Tor node quarantining</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#EEECEC] pb-2">
          <button
            onClick={() => setActiveTab('rbac')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'rbac'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Role-Based Access Control (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-permissions')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'ai-permissions'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>AI Permissions & Sandboxing</span>
          </button>

          <button
            onClick={() => setActiveTab('audit-logs')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'audit-logs'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Immutable Audit Logging</span>
          </button>

          <button
            onClick={() => setActiveTab('threats')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'threats'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Security Operations & Threat Defense</span>
          </button>

          <button
            onClick={() => setActiveTab('compliance')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors ${
              activeTab === 'compliance'
                ? 'bg-[#C01E25] text-white shadow-xs'
                : 'bg-[#EEECEC]/70 text-[#1E1B1C] hover:bg-[#EEECEC]'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>KDPA 2019 & Governance</span>
          </button>
        </div>

        {/* TAB 1: ROLE-BASED ACCESS CONTROL (RBAC) */}
        {activeTab === 'rbac' && (
          <div className="space-y-6">
            <div className="bg-[#EEECEC]/40 p-4 rounded-2xl border border-[#EEECEC] text-xs text-[#5C4D50] leading-relaxed flex items-center justify-between">
              <div>
                <strong className="text-[#1E1B1C]">Principle of Least Privilege: </strong>
                Each tenant operates in complete isolation. No user or service has access to records beyond their certified role domain.
              </div>
              <span className="text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-1 rounded-full whitespace-nowrap">
                8 Distinct Tenant Roles
              </span>
            </div>

            {/* Role Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {rolesList.map((role) => (
                <button
                  key={role}
                  onClick={() => setSelectedRoleDetail(role)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                    selectedRoleDetail === role
                      ? 'border-[#C01E25] bg-[#F0C9CB]/30 text-[#C01E25] font-bold'
                      : 'border-[#EEECEC] bg-white text-[#1E1B1C] hover:border-[#DB7D81]'
                  }`}
                >
                  <div className="text-[10px] uppercase font-bold text-[#5C4D50]">Tenant</div>
                  <div className="text-xs font-black capitalize truncate">{role}</div>
                </button>
              ))}
            </div>

            {/* Detailed Role Permissions Card */}
            {selectedRoleDetail && (
              <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#DB7D81]/40 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEECEC] gap-3">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                      RBAC Profile
                    </span>
                    <h2 className="text-2xl font-black text-[#1E1B1C] capitalize mt-1">
                      {selectedRoleDetail} Role Architecture
                    </h2>
                    <p className="text-xs text-[#5C4D50] mt-0.5">
                      {ROLE_DEFINITIONS[selectedRoleDetail].description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSwitchRole(selectedRoleDetail)}
                      className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Simulate Login As {selectedRoleDetail}
                    </button>
                  </div>
                </div>

                {/* Data Isolation Boundary Box */}
                <div className="bg-[#EEECEC]/50 p-4 rounded-2xl border border-[#EEECEC] flex items-start gap-3">
                  <Database className="w-5 h-5 text-[#C01E25] shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-[#1E1B1C]">
                      Enforced Data Isolation Boundary:
                    </div>
                    <div className="text-xs text-[#5C4D50] mt-0.5 font-mono">
                      {ROLE_DEFINITIONS[selectedRoleDetail].dataIsolationBoundary}
                    </div>
                  </div>
                </div>

                {/* Can vs. Cannot Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* CAN */}
                  <div className="bg-emerald-50/50 p-5 rounded-2xl border border-emerald-200/60">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
                        Authorized Actions (CAN)
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {ROLE_DEFINITIONS[selectedRoleDetail].can.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-emerald-900 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CANNOT */}
                  <div className="bg-rose-50/50 p-5 rounded-2xl border border-rose-200/60">
                    <div className="flex items-center gap-2 mb-3">
                      <XCircle className="w-5 h-5 text-rose-600" />
                      <h3 className="text-sm font-bold text-rose-950 uppercase tracking-wider">
                        Strictly Prohibited Actions (CANNOT)
                      </h3>
                    </div>
                    <ul className="space-y-2">
                      {ROLE_DEFINITIONS[selectedRoleDetail].cannot.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-rose-900 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: AI PERMISSIONS MODEL */}
        {activeTab === 'ai-permissions' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-[#EEECEC]/70 via-[#F0C9CB]/30 to-[#EEECEC]/70 p-6 rounded-3xl border border-[#DB7D81]/40">
              <div className="flex items-center gap-3 mb-2">
                <BrainCircuit className="w-6 h-6 text-[#C01E25]" />
                <h2 className="text-xl font-black text-[#1E1B1C]">
                  HYNOVA AI Scoped Permissions & Zero-Leakage Guarantee
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[#5C4D50] leading-relaxed max-w-4xl">
                Artificial Intelligence models within the HYNOVA ecosystem execute inside isolated sandbox containers. AI is strictly prohibited from accessing information beyond user authorization. Model weights and inference contexts are transient and never trained on private customer or competitor data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(AI_PERMISSIONS_MODEL).map(([roleKey, model]) => (
                <div key={roleKey} className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#EEECEC] pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2 py-0.5 rounded-full">
                        {model.role.toUpperCase()} AI
                      </span>
                      <h3 className="text-lg font-bold text-[#1E1B1C] mt-1">{model.scopeTitle}</h3>
                    </div>
                    <Cpu className="w-5 h-5 text-[#C01E25]" />
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Allowed Datasets & Context
                    </div>
                    <div className="space-y-1 bg-emerald-50/40 p-3 rounded-xl border border-emerald-100">
                      {model.allowedDatasets.map((ds, idx) => (
                        <div key={idx} className="text-xs text-emerald-950 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-emerald-600" />
                          <span>{ds}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase text-rose-800 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      Prohibited Datasets (Hard Zero-Access Boundary)
                    </div>
                    <div className="space-y-1 bg-rose-50/40 p-3 rounded-xl border border-rose-100">
                      {model.prohibitedDatasets.map((ds, idx) => (
                        <div key={idx} className="text-xs text-rose-950 flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-rose-600" />
                          <span>{ds}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EEECEC] text-[11px] text-[#5C4D50] font-mono">
                    Sandbox: {model.executionSandbox}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: IMMUTABLE AUDIT LOGGING */}
        {activeTab === 'audit-logs' && (
          <div className="space-y-6">
            <div className="bg-[#EEECEC]/50 p-5 rounded-3xl border border-[#EEECEC] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-black text-[#1E1B1C] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#C01E25]" />
                  Cryptographic Immutable Audit Trail
                </h2>
                <p className="text-xs text-[#5C4D50] mt-0.5">
                  Append-only architecture. System records login attempts, permissions, project allocations, payments, and AI outputs. Records cannot be deleted.
                </p>
              </div>

              <button
                onClick={handleRefreshLogs}
                className="bg-white hover:bg-[#EEECEC] text-[#1E1B1C] text-xs font-bold px-3 py-2 rounded-xl border border-[#EEECEC] flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#C01E25]' : ''}`} />
                <span>Verify & Refresh Hashes</span>
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 text-[#5C4D50] absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by actor email, action, resource, or SHA-256 hash..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-[#EEECEC] rounded-xl text-xs text-[#1E1B1C] focus:outline-none focus:border-[#C01E25]"
                />
              </div>

              <select
                value={filterCategory}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="bg-white border border-[#EEECEC] text-xs font-semibold px-3 py-2.5 rounded-xl text-[#1E1B1C] focus:outline-none focus:border-[#C01E25]"
              >
                <option value="ALL">All Categories</option>
                <option value="Authentication">Authentication</option>
                <option value="Permission Change">Permission Change</option>
                <option value="Project Assignment">Project Assignment</option>
                <option value="Escrow Payment">Escrow Payment</option>
                <option value="AI Recommendation">AI Recommendation</option>
                <option value="Profile Update">Profile Update</option>
                <option value="Security Event">Security Event</option>
                <option value="Admin Action">Admin Action</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="bg-white border border-[#EEECEC] text-xs font-semibold px-3 py-2.5 rounded-xl text-[#1E1B1C] focus:outline-none focus:border-[#C01E25]"
              >
                <option value="ALL">All Statuses</option>
                <option value="SUCCESS">SUCCESS</option>
                <option value="WARNING">WARNING</option>
                <option value="DENIED">DENIED</option>
                <option value="FLAGGED">FLAGGED</option>
              </select>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-2xl border border-[#EEECEC] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EEECEC]/70 text-[#5C4D50] uppercase text-[10px] font-bold border-b border-[#EEECEC]">
                    <tr>
                      <th className="py-3 px-4">Event ID & Time</th>
                      <th className="py-3 px-4">Actor & Role</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Action Details</th>
                      <th className="py-3 px-4">Target Resource</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Cryptographic Hash</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEECEC]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#EEECEC]/30 transition-colors">
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-bold text-[#1E1B1C]">{log.id}</div>
                          <div className="text-[10px] text-[#5C4D50]">{log.timestamp}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-[#1E1B1C]">{log.actorEmail}</div>
                          <div className="text-[10px] text-[#C01E25] font-bold uppercase">{log.actorRole}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap font-medium text-[#1E1B1C]">
                          {log.actionCategory}
                        </td>
                        <td className="py-3 px-4 max-w-xs text-[#5C4D50] leading-snug">
                          {log.actionDetails}
                        </td>
                        <td className="py-3 px-4 font-mono text-[10px] text-[#1E1B1C] whitespace-nowrap">
                          {log.targetResource}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              log.status === 'SUCCESS'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.status === 'FLAGGED'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono text-[9px] text-[#5C4D50] truncate max-w-[130px]" title={log.immutableHash}>
                          {log.immutableHash}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SECURITY OPERATIONS & THREAT DEFENSE */}
        {activeTab === 'threats' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Defense Telemetry */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                  <h3 className="text-base font-extrabold text-[#1E1B1C] mb-4 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-[#C01E25]" />
                    Real-Time Security Event & Threat Feed
                  </h3>

                  <div className="space-y-3">
                    {THREAT_ALERTS.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-2xl border ${
                          alert.severity === 'high'
                            ? 'bg-rose-50 border-rose-200'
                            : alert.severity === 'medium'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-emerald-50 border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-bold text-xs text-[#1E1B1C] flex items-center gap-2">
                            <span>{alert.title}</span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white border">
                              {alert.sourceIp}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold uppercase text-[#5C4D50]">
                            {alert.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-[#5C4D50] mb-2">{alert.description}</p>
                        <div className="text-[11px] font-semibold text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Automated Mitigation: {alert.mitigation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cyber Security Controls Checklist */}
                <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                  <h3 className="text-base font-extrabold text-[#1E1B1C] mb-4">
                    Active Security Controls Inventory
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-[#EEECEC]/40 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Multi-Factor Authentication (MFA) Active</span>
                    </div>
                    <div className="p-3 bg-[#EEECEC]/40 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Argon2id Password Hashing Engine</span>
                    </div>
                    <div className="p-3 bg-[#EEECEC]/40 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Per-Tenant Rate Limiting (60 req/min)</span>
                    </div>
                    <div className="p-3 bg-[#EEECEC]/40 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Cloud Armor DDoS Protection</span>
                    </div>
                    <div className="p-3 bg-[#EEECEC]/40 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Automatic Inactive Session Expiry (30m)</span>
                    </div>
                    <div className="p-3 bg-[#EEECEC]/40 rounded-xl flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Real-Time IP Reputation & Bot Shield</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Security Card */}
              <div className="bg-gradient-to-b from-[#FFFFFF] to-[#EEECEC]/40 p-6 rounded-3xl border border-[#EEECEC] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#C01E25]" />
                  <h4 className="text-sm font-bold text-[#1E1B1C]">Active Session Integrity</h4>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="text-[10px] text-[#5C4D50] uppercase font-bold">Authenticated User</div>
                    <div className="font-bold text-[#1E1B1C]">{activeSession.email}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#5C4D50] uppercase font-bold">Assigned Role & Tenant</div>
                    <div className="font-bold text-[#C01E25] uppercase">{activeSession.role} ({activeSession.tenantId})</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#5C4D50] uppercase font-bold">Bearer Token Hash</div>
                    <div className="font-mono text-[10px] text-[#5C4D50] truncate">{activeSession.tokenHash}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#5C4D50] uppercase font-bold">Source IP Verification</div>
                    <div className="font-semibold text-[#1E1B1C]">{activeSession.ipAddress}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#5C4D50] uppercase font-bold">MFA Verification Status</div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Biometric / SMS TOTP Verified</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EEECEC]">
                  <button
                    onClick={() => {
                      AuditLogService.addLog({
                        actorEmail: activeSession.email,
                        actorRole: activeSession.role,
                        ipAddress: activeSession.ipAddress,
                        actionCategory: 'Security Event',
                        actionDetails: 'Manual session token rotation initiated by user.',
                        targetResource: `auth:token:${activeSession.tenantId}`,
                        status: 'SUCCESS',
                      });
                      handleRefreshLogs();
                    }}
                    className="w-full bg-[#EEECEC] hover:bg-[#F0C9CB]/40 text-[#1E1B1C] text-xs font-bold py-2.5 px-4 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    Rotate Session Token & Re-verify
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COMPLIANCE & GOVERNANCE */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#EEECEC] shadow-xs space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#C01E25] text-white flex items-center justify-center">
                  <Fingerprint className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E1B1C]">
                    Kenya Data Protection Act (KDPA 2019) Compliance
                  </h3>
                  <p className="text-xs text-[#5C4D50]">
                    Strict statutory adherence to lawful processing, purpose limitation, data minimization, and data subject rights.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-[#EEECEC]/50 border border-[#EEECEC] space-y-2">
                  <h4 className="text-xs font-bold text-[#1E1B1C]">Right to Access & Rectification</h4>
                  <p className="text-[11px] text-[#5C4D50] leading-relaxed">
                    All customers and technicians have direct self-service access to view, correct, and download their personal profile and installation data.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEECEC]/50 border border-[#EEECEC] space-y-2">
                  <h4 className="text-xs font-bold text-[#1E1B1C]">Consent & Purpose Limitation</h4>
                  <p className="text-[11px] text-[#5C4D50] leading-relaxed">
                    Customer data is collected exclusively for engineering assessment, escrow settlement, and verified dispatch. Data is never sold or shared.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#EEECEC]/50 border border-[#EEECEC] space-y-2">
                  <h4 className="text-xs font-bold text-[#1E1B1C]">Data Localization & Encryption</h4>
                  <p className="text-[11px] text-[#5C4D50] leading-relaxed">
                    Kenyan citizen data is encrypted at rest using certified cryptographic libraries with regional failover in East Africa.
                  </p>
                </div>
              </div>

              {/* Super Administrator Governance Section */}
              <div className="p-6 bg-gradient-to-r from-[#EEECEC]/60 via-[#F0C9CB]/20 to-[#EEECEC]/60 rounded-2xl border border-[#DB7D81]/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C01E25] bg-white px-2.5 py-0.5 rounded-full border border-[#DB7D81]/30">
                    Executive Governance
                  </span>
                  <span className="text-xs font-bold text-[#1E1B1C]">Executive Leadership Reserved</span>
                </div>
                <h4 className="text-sm font-extrabold text-[#1E1B1C]">
                  Super Administrator Root Controls
                </h4>
                <p className="text-xs text-[#5C4D50] leading-relaxed">
                  Only the Super Administrator has authority over security policies, permission structures, platform configuration, financial escrow rules, and root system integrations. In accordance with zero-trust architecture, every Super Admin action is permanently recorded in the immutable audit trail.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
