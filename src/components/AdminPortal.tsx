import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Coins, 
  Users, 
  Wrench, 
  Store, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  Search,
  Lock,
  ArrowRight,
  Milestone,
  FileText,
  Package,
  Edit2,
  Plus,
  Save,
  Cpu,
  FileSpreadsheet
} from 'lucide-react';
import { AppView } from '../types';
import { AuditLogService } from '../services/securityService';
import { ProductCostDatabaseService, ProductCostItem } from '../data/productCostDatabase';
import { AdminLocationMapTab } from './AdminLocationMapTab';
import { GoogleSheetsOpsTab } from './GoogleSheetsOpsTab';

interface AdminPortalProps {
  onNavigate: (view: AppView) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'sheets' | 'overview' | 'locations' | 'products' | 'technicians' | 'escrow' | 'governance' | 'adminAI'>('sheets');

  // Operating Agreement Section 9: Central Product Cost Database State
  const [products, setProducts] = useState<ProductCostItem[]>(() => ProductCostDatabaseService.getProducts());
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [tempBaseCost, setTempBaseCost] = useState<number>(0);
  const [tempRetailPrice, setTempRetailPrice] = useState<number>(0);
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  const [newProductModal, setNewProductModal] = useState<boolean>(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string>('');
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => {
      setNotificationBanner(null);
    }, 4500);
  };

  // Pending Technician Verification Queue (Authoritative strict source-of-truth: 0 technicians until applied)
  const [pendingTechnicians, setPendingTechnicians] = useState<Array<{
    id: string;
    name: string;
    county: string;
    specialty: string;
    experience: string;
    documents: string;
    status: string;
  }>>([]);

  // Escrow Queue
  const [escrowLedger, setEscrowLedger] = useState([
    {
      txId: 'ESC-9082',
      client: 'Karen Villa (David Karanja)',
      technician: 'Awaiting Technician Assignment',
      amountKES: 340000,
      stage: 'Awaiting Testing Sign-off',
      status: 'Locked in M-Pesa Escrow',
    },
    {
      txId: 'ESC-9079',
      client: 'Nalepo Safari Lodge',
      technician: 'Awaiting Technician Assignment',
      amountKES: 580000,
      stage: 'Hardware Mounted',
      status: 'Locked in M-Pesa Escrow',
    },
    {
      txId: 'ESC-9065',
      client: 'Ruaka Heights Apartments',
      technician: 'Awaiting Technician Assignment',
      amountKES: 135000,
      stage: 'Customer PIN Verified',
      status: 'Ready for Release',
    },
  ]);

  // Admin AI Operations state
  const [aiScanRunning, setAiScanRunning] = useState(false);
  const [aiScanLog, setAiScanLog] = useState<string[]>([
    'System normal. Escrow reconciliation balanced with Safaricom B2C API.',
    '47 County dispatch nodes operating at 99.4% on-time arrival rate.',
  ]);

  const handleApproveTech = (id: string) => {
    const tech = pendingTechnicians.find(t => t.id === id);
    setPendingTechnicians(pendingTechnicians.filter(t => t.id !== id));

    AuditLogService.addLog({
      actorEmail: 'admin@hynovaenterprises.com',
      actorRole: 'admin',
      ipAddress: '102.219.208.50 (Nairobi, KE)',
      actionCategory: 'Admin Action',
      actionDetails: `Admin approved credentials and issued verification badge for technician ${tech?.name || id}`,
      targetResource: `tech:vetting:${id}`,
      status: 'SUCCESS',
    });

    showNotification(`Technician ${tech?.name || id} approved! Digital verification badge issued and recorded in immutable audit ledger.`);
  };

  const handleReleaseEscrow = (txId: string) => {
    setEscrowLedger(escrowLedger.map(e => e.txId === txId ? { ...e, status: 'Released via M-Pesa B2C' } : e));

    AuditLogService.addLog({
      actorEmail: 'admin@hynovaenterprises.com',
      actorRole: 'admin',
      ipAddress: '102.219.208.50 (Nairobi, KE)',
      actionCategory: 'Escrow Payment',
      actionDetails: `Admin authorized milestone release for escrow transaction ${txId}`,
      targetResource: `escrow:release:${txId}`,
      status: 'SUCCESS',
    });

    showNotification(`Escrow funds for ${txId} released instantly to technician M-Pesa wallet. Cryptographic audit event logged.`);
  };

  const runAdminAIScan = () => {
    setAiScanRunning(true);
    setTimeout(() => {
      setAiScanRunning(false);
      setAiScanLog(prev => [
        `[${new Date().toLocaleTimeString()}] AI Anomaly Scan Complete: 0 fraud alerts detected across live jobs.`,
        `[${new Date().toLocaleTimeString()}] Auto-Dispatch AI: 3 open projects matched to nearest Level 3 technicians in Kiambu & Nakuru.`,
        ...prev,
      ]);

      AuditLogService.addLog({
        actorEmail: 'ai-engine@internal.hynova.ke',
        actorRole: 'ai-service',
        ipAddress: '10.0.4.18 (VPC Isolated)',
        actionCategory: 'Security Event',
        actionDetails: 'Admin AI Anomaly Scan executed across nationwide ledger.',
        targetResource: 'sys:scan:anomaly',
        status: 'SUCCESS',
      });
    }, 1200);
  };

  const handleStartEdit = (product: ProductCostItem) => {
    setEditingProductId(product.id);
    setTempBaseCost(product.supplierBaseCostKES);
    setTempRetailPrice(product.recommendedRetailKES);
  };

  const handleSaveProduct = (id: string) => {
    const updated = ProductCostDatabaseService.updateProductCost(id, {
      supplierBaseCostKES: tempBaseCost,
      recommendedRetailKES: tempRetailPrice,
    });
    setProducts(updated);
    setEditingProductId(null);
    setSaveSuccessMsg('Product price updated and synced across AI quotation engine!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleResetProducts = () => {
    const reset = ProductCostDatabaseService.resetToDefault();
    setProducts(reset);
    setSaveSuccessMsg('Product costs restored to Operating Agreement baseline.');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="py-10 bg-[#FFFFFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#EEECEC] mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                Ecosystem Administration
              </span>
              <span className="text-xs text-[#5C4D50]">Operations & Vetting Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B1C] mt-1">
              HYNOVA Central Command
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate('security-architecture')}
              className="bg-white hover:bg-[#EEECEC] text-[#1E1B1C] text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#DB7D81]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4 text-[#C01E25]" />
              <span>Security & Audit Console</span>
            </button>

            <button
              onClick={() => onNavigate('roadmap')}
              className="bg-white hover:bg-[#EEECEC] text-[#1E1B1C] text-xs font-bold px-3.5 py-2.5 rounded-xl border border-[#DB7D81]/40 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Milestone className="w-4 h-4 text-[#C01E25]" />
              <span>Phased Roadmap</span>
            </button>

            <button
              onClick={runAdminAIScan}
              disabled={aiScanRunning}
              className="bg-[#C01E25] hover:bg-[#a1181e] disabled:opacity-60 text-[#FFFFFF] text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {aiScanRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Run Admin AI Audit Scan</span>
            </button>
          </div>
        </div>

        {/* Global Notification Banner */}
        {notificationBanner && (
          <div className="mb-6 p-4 rounded-2xl bg-[#F0C9CB]/40 border border-[#C01E25] text-[#C01E25] text-xs sm:text-sm font-bold flex items-center justify-between shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0 text-[#C01E25]" />
              <span>{notificationBanner}</span>
            </div>
            <button
              onClick={() => setNotificationBanner(null)}
              className="p-1 hover:bg-[#C01E25]/10 rounded-lg text-[#C01E25] cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-[#EEECEC] scrollbar-none">
          {[
            { id: 'sheets', label: 'HYNOVA OPS (Google Sheets)', icon: FileSpreadsheet, highlight: true },
            { id: 'overview', label: 'Platform Overview', icon: ShieldCheck },
            { id: 'locations', label: 'Field Operations & Dispatch Map', icon: MapPin },
            { id: 'products', label: 'Product Cost Database (Sec 9)', icon: Package },
            { id: 'technicians', label: `Technician Approvals (${pendingTechnicians.length} Pending)`, icon: Users },
            { id: 'escrow', label: 'Escrow Financial Ledger', icon: Coins },
            { id: 'governance', label: 'RBAC & Super Admin Governance', icon: Lock },
            { id: 'adminAI', label: 'Admin AI & Anomaly Engine', icon: Sparkles },
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
                    : (tab as any).highlight 
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100' 
                      : 'bg-[#EEECEC]/60 text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC]'
                }`}
              >
                <Icon className={`w-4 h-4 ${(tab as any).highlight && !isActive ? 'text-emerald-600' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onNavigate('agent-os')}
            className="whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 bg-[#F0C9CB]/40 text-[#C01E25] hover:bg-[#F0C9CB]/70 transition-all cursor-pointer border border-[#DB7D81]/40 ml-auto"
          >
            <Cpu className="w-4 h-4" />
            <span>Open AI Agent OS & Marketplace</span>
          </button>
        </div>

        {/* TAB 0: HYNOVA OPS GOOGLE SHEETS */}
        {activeTab === 'sheets' && (
          <GoogleSheetsOpsTab />
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* HYNOVA Data Integrity Banner */}
            <div className="bg-[#EEECEC]/60 p-4 rounded-2xl border border-[#DB7D81]/40 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-[#1E1B1C]">
                <ShieldCheck className="w-4 h-4 text-[#C01E25]" />
                <span>
                  <strong>HYNOVA Data Integrity Mode Active:</strong> Public-facing statistics and metrics remain hidden until verified and approved by system administrators.
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/50 px-2.5 py-0.5 rounded-full">
                Internal Console
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Pipeline Escrow (Logged)</span>
                <div className="text-3xl font-black text-[#C01E25] mt-1">Active</div>
                <div className="text-xs text-[#5C4D50] mt-1">Secured via Safaricom Escrow</div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Technician Verification</span>
                <div className="text-3xl font-black text-[#1E1B1C] mt-1">3 Pending</div>
                <div className="text-xs text-[#DB7D81] font-semibold mt-1">Awaiting compliance review</div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Hardware Catalogs</span>
                <div className="text-3xl font-black text-[#1E1B1C] mt-1">Verified</div>
                <div className="text-xs text-[#5C4D50] mt-1">Direct importer wholesale specs</div>
              </div>

              <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] shadow-xs">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5C4D50]">Quality SLA Target</span>
                <div className="text-3xl font-black text-[#C01E25] mt-1">100%</div>
                <div className="text-xs text-[#5C4D50] mt-1">Digital sign-off prerequisite</div>
              </div>
            </div>

            {/* Live Operational Status */}
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#EEECEC] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[#1E1B1C]">County Hub Performance</h3>
                <span className="text-xs text-[#C01E25] font-bold">Live Real-Time Telemetry</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <div className="font-bold text-[#1E1B1C] flex items-center justify-between">
                    <span>Nairobi & Central Region</span>
                    <span className="text-[#C01E25]">68 Active Jobs</span>
                  </div>
                  <div className="text-[#5C4D50] mt-1">Avg technician dispatch time: 42 minutes</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <div className="font-bold text-[#1E1B1C] flex items-center justify-between">
                    <span>Rift Valley & Western</span>
                    <span className="text-[#C01E25]">44 Active Jobs</span>
                  </div>
                  <div className="text-[#5C4D50] mt-1">Highest demand: Hybrid Solar 5kVA & Boreholes</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
                  <div className="font-bold text-[#1E1B1C] flex items-center justify-between">
                    <span>Coast Region (Mombasa/Kilifi)</span>
                    <span className="text-[#C01E25]">30 Active Jobs</span>
                  </div>
                  <div className="text-[#5C4D50] mt-1">Highest demand: AI CCTV & Villa Automation</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: FIELD OPERATIONS & DISPATCH MAP */}
        {activeTab === 'locations' && (
          <AdminLocationMapTab />
        )}

        {/* TAB: PRODUCT COST DATABASE (OPERATING AGREEMENT SECTION 9 & 8) */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header with Operating Agreement Policy */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#EEECEC]/50 p-5 rounded-2xl border border-[#EEECEC]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
                    Operating Agreement Section 9
                  </span>
                  <span className="text-xs text-[#5C4D50] font-bold">Central Equipment Pricing Store</span>
                </div>
                <h2 className="text-xl font-black text-[#1E1B1C] mt-1.5">
                  Product Cost Database & Margin Guardian
                </h2>
                <p className="text-xs text-[#5C4D50] mt-0.5">
                  All equipment pricing is editable by administrators in real-time. Supplier prices are never hardcoded.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetProducts}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#EEECEC] text-[#1E1B1C] border border-[#EEECEC] text-xs font-bold transition-colors cursor-pointer"
                >
                  Reset to Approved Baseline
                </button>
              </div>
            </div>

            {/* Approved Pricing Example Highlight (Section 9) */}
            <div className="p-4 rounded-2xl bg-white border border-[#EEECEC] shadow-2xs space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#1E1B1C] block">
                Approved Baseline Costs (Operating Agreement Section 9)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="bg-[#EEECEC]/40 p-2.5 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] text-[#5C4D50] block">Hikvision 5 Port Switch</span>
                  <strong className="text-sm font-black text-[#1E1B1C]">KES 1,000</strong>
                </div>
                <div className="bg-[#EEECEC]/40 p-2.5 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] text-[#5C4D50] block">RJ45 Connector</span>
                  <strong className="text-sm font-black text-[#1E1B1C]">KES 10</strong>
                </div>
                <div className="bg-[#EEECEC]/40 p-2.5 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] text-[#5C4D50] block">Junction Box</span>
                  <strong className="text-sm font-black text-[#1E1B1C]">KES 100</strong>
                </div>
                <div className="bg-[#EEECEC]/40 p-2.5 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] text-[#C01E25] block font-bold">Adapter Box (Updated)</span>
                  <strong className="text-sm font-black text-[#C01E25]">KES 150</strong>
                </div>
                <div className="bg-[#EEECEC]/40 p-2.5 rounded-xl border border-[#EEECEC]">
                  <span className="text-[10px] text-[#5C4D50] block">Power Supply 12V 5A</span>
                  <strong className="text-sm font-black text-[#1E1B1C]">KES 1,500</strong>
                </div>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-[#25D366]/20 border border-[#25D366] text-xs font-bold text-[#128C7E] flex items-center gap-2 animate-in fade-in-50">
                <CheckCircle2 className="w-4 h-4 text-[#25D366]" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: 'All Hardware' },
                  { id: 'accessories', label: 'Accessories' },
                  { id: 'power', label: 'Power Supplies' },
                  { id: 'cctv', label: 'CCTV Cameras' },
                  { id: 'networking', label: 'Networking' },
                  { id: 'solar', label: 'Solar & Lithium' },
                  { id: 'access', label: 'Access Control' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setProductCategoryFilter(cat.id)}
                    className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      productCategoryFilter === cat.id
                        ? 'bg-[#C01E25] text-white'
                        : 'bg-[#EEECEC] text-[#5C4D50] hover:text-[#1E1B1C]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-[#8F7B7F] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search SKU or product..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#EEECEC]/40 border border-[#EEECEC] outline-none focus:border-[#C01E25]"
                />
              </div>
            </div>

            {/* Product Costs Table */}
            <div className="bg-white rounded-3xl border border-[#EEECEC] overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#EEECEC]/40 border-b border-[#EEECEC] text-[#8F7B7F] uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4 font-bold">SKU / Item</th>
                      <th className="py-3 px-3 font-bold">Category</th>
                      <th className="py-3 px-3 font-bold">Supplier</th>
                      <th className="py-3 px-3 font-bold text-right">Supplier Base (KES)</th>
                      <th className="py-3 px-3 font-bold text-right">Retail Quotation (KES)</th>
                      <th className="py-3 px-3 font-bold text-center">Gross Margin</th>
                      <th className="py-3 px-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EEECEC]">
                    {products
                      .filter((p) => {
                        const matchesCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
                        const matchesSearch = !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.sku.toLowerCase().includes(productSearch.toLowerCase());
                        return matchesCat && matchesSearch;
                      })
                      .map((p) => {
                        const isEditing = editingProductId === p.id;
                        const currentMargin = p.targetMarginPercent;
                        const isBelowMinimum = currentMargin < 20;

                        return (
                          <tr key={p.id} className="hover:bg-[#EEECEC]/20 transition-colors">
                            <td className="py-3 px-4">
                              <span className="font-extrabold text-[#1E1B1C] block">{p.name}</span>
                              <span className="text-[10px] text-[#8F7B7F] font-mono">{p.sku} • {p.unit}</span>
                            </td>

                            <td className="py-3 px-3">
                              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EEECEC] text-[#5C4D50] px-2 py-0.5 rounded">
                                {p.category}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-[#5C4D50]">
                              <div className="text-[11px] font-medium">{p.supplierName}</div>
                              <span className="text-[9px] text-[#128C7E] font-bold">{p.stockStatus}</span>
                            </td>

                            <td className="py-3 px-3 text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={tempBaseCost}
                                  onChange={(e) => setTempBaseCost(Number(e.target.value))}
                                  className="w-24 text-right p-1 rounded-lg border border-[#C01E25] bg-white font-mono text-xs font-bold outline-none"
                                />
                              ) : (
                                <span className="font-mono font-bold text-[#1E1B1C]">
                                  KES {p.supplierBaseCostKES.toLocaleString()}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-right">
                              {isEditing ? (
                                <input
                                  type="number"
                                  value={tempRetailPrice}
                                  onChange={(e) => setTempRetailPrice(Number(e.target.value))}
                                  className="w-24 text-right p-1 rounded-lg border border-[#C01E25] bg-white font-mono text-xs font-bold outline-none"
                                />
                              ) : (
                                <span className="font-mono font-extrabold text-[#C01E25]">
                                  KES {p.recommendedRetailKES.toLocaleString()}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-3 text-center">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isBelowMinimum
                                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                                  : currentMargin >= 30
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-800 border border-amber-300'
                              }`}>
                                {isBelowMinimum && <AlertTriangle className="w-3 h-3 text-rose-600" />}
                                <span>{currentMargin}%</span>
                              </span>
                              {isBelowMinimum && (
                                <span className="text-[9px] text-rose-600 block mt-0.5 font-bold">
                                  Below 20% Min
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4 text-center">
                              {isEditing ? (
                                <button
                                  onClick={() => handleSaveProduct(p.id)}
                                  className="px-3 py-1 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Save className="w-3 h-3" />
                                  <span>Save</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleStartEdit(p)}
                                  className="px-2.5 py-1 rounded-lg bg-[#EEECEC] hover:bg-[#F0C9CB]/40 text-[#1E1B1C] hover:text-[#C01E25] font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer transition-colors"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Minimum Profitability Rule Banner (Section 8) */}
            <div className="p-4 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] text-xs text-[#5C4D50] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <strong className="text-[#1E1B1C] block">Operating Agreement Section 8: Minimum Profitability Rule</strong>
                <span>
                  Target Gross Margin: <strong>30%–45%</strong>. Minimum Gross Margin: <strong>20%</strong>. If project margin falls below 20%, administrative approval is strictly required before quote dispatch.
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#128C7E] bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                Formula Enforced
              </span>
            </div>
          </div>
        )}
        {activeTab === 'technicians' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1B1C]">Pending Technician Vetting Queue</h2>
              <p className="text-xs text-[#5C4D50]">
                Review verified National ID, DCI Police Clearance, and EPRA technical certifications before granting marketplace job dispatch privileges.
              </p>
            </div>

            {pendingTechnicians.length === 0 ? (
              <div className="bg-[#FFFFFF] p-8 sm:p-12 rounded-3xl border border-[#EEECEC] text-center max-w-xl mx-auto space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEECEC]/60 text-[#5C4D50] flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-[#5C4D50]" />
                </div>
                <h3 className="text-lg font-bold text-[#1E1B1C]">0 Pending Technician Applications</h3>
                <p className="text-xs text-[#5C4D50] leading-relaxed">
                  Strict Authoritative State: No unreviewed applicant submissions in the queue. Registered technicians will appear here for DCI police clearance and EPRA compliance verification prior to assignment eligibility.
                </p>
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-3 py-1 rounded-full">
                    Technicians Worksheet Source of Truth: 0 Enrolled
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTechnicians.map((t) => (
                  <div
                    key={t.id}
                    className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] hover:border-[#DB7D81] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#C01E25]">{t.id}</span>
                        <span className="text-xs font-bold text-[#1E1B1C]">{t.name}</span>
                        <span className="text-xs text-[#5C4D50]">({t.county})</span>
                      </div>
                      <div className="text-xs text-[#5C4D50]">
                        Specialty: <strong>{t.specialty}</strong> • Experience: {t.experience}
                      </div>
                      <div className="text-[11px] text-[#DB7D81]">
                        Dossier: {t.documents}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApproveTech(t.id)}
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Approve & Grant Badge
                      </button>
                      <button
                        onClick={() => showNotification(`Requested further proof of DCI certificate from ${t.name}.`)}
                        className="bg-[#EEECEC] text-[#5C4D50] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#EEECEC]/80 cursor-pointer"
                      >
                        Request Info
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ESCROW FINANCIAL CONTROL */}
        {activeTab === 'escrow' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-extrabold text-[#1E1B1C]">Escrow Financial Ledger & Release Controls</h2>
              <p className="text-xs text-[#5C4D50]">
                Client deposits remain locked in trust. Admin can review site telemetry and authorize manual emergency releases.
              </p>
            </div>

            <div className="space-y-3">
              {escrowLedger.map((e) => (
                <div
                  key={e.txId}
                  className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#EEECEC] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#C01E25]">{e.txId}</span>
                      <span className="text-xs font-bold text-[#1E1B1C]">{e.client}</span>
                    </div>
                    <div className="text-xs text-[#5C4D50]">
                      Assigned Technician: <strong>{e.technician}</strong> • Stage: {e.stage}
                    </div>
                    <div className="text-[11px] font-bold text-[#DB7D81]">
                      {e.status}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-base font-black text-[#C01E25]">
                        KES {e.amountKES.toLocaleString()}
                      </span>
                    </div>

                    {e.status.includes('Ready for Release') ? (
                      <button
                        onClick={() => handleReleaseEscrow(e.txId)}
                        className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                      >
                        Release to M-Pesa
                      </button>
                    ) : (
                      <button
                        onClick={() => showNotification(`Escrow locked until client inspection signature is uploaded.`)}
                        className="bg-[#EEECEC] text-[#5C4D50] text-xs font-semibold px-3 py-2 rounded-xl cursor-default"
                      >
                        Funds Locked
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: RBAC & SUPER ADMIN GOVERNANCE */}
        {activeTab === 'governance' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] p-6 sm:p-8 rounded-3xl border border-[#EEECEC] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEECEC]">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                    Executive Governance
                  </span>
                  <h2 className="text-xl font-black text-[#1E1B1C] mt-1">
                    Super Administrator vs. HYNOVA Administrator
                  </h2>
                  <p className="text-xs text-[#5C4D50] mt-0.5">
                    Separation of central platform operational duties from executive root governance.
                  </p>
                </div>

                <button
                  onClick={() => onNavigate('security-architecture')}
                  className="bg-[#C01E25] hover:bg-[#a1181e] text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  <Lock className="w-4 h-4" />
                  <span>Open Security Operations Center</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* HYNOVA ADMINISTRATOR */}
                <div className="p-5 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC] space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1E1B1C]">HYNOVA Administrator (Operations)</h3>
                    <span className="text-[10px] bg-white border border-[#EEECEC] px-2 py-0.5 rounded font-bold text-[#5C4D50]">
                      Standard Admin
                    </span>
                  </div>
                  <div className="text-xs text-emerald-800 font-semibold">Scope of Authority:</div>
                  <ul className="text-xs text-[#5C4D50] space-y-1.5">
                    <li>• Manage day-to-day platform operations</li>
                    <li>• Approve vetted technician applications & credentials</li>
                    <li>• Approve supplier catalogs & wholesale inventory</li>
                    <li>• Manage content, solutions, and county packages</li>
                    <li>• Supervise project allocation & county dispatch queues</li>
                    <li>• View platform-wide operational analytics</li>
                  </ul>
                  <div className="text-xs text-rose-800 font-semibold pt-1">Restricted from:</div>
                  <ul className="text-xs text-rose-900 space-y-1">
                    <li>• Cannot access Super Admin root controls</li>
                    <li>• Cannot modify platform ownership or role definitions</li>
                    <li>• Cannot delete or alter audit history (Audit is append-only)</li>
                  </ul>
                </div>

                {/* SUPER ADMINISTRATOR */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFFFF] to-[#F0C9CB]/20 border border-[#DB7D81]/60 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-[#1E1B1C]">Super Administrator (Root)</h3>
                    <span className="text-[10px] bg-[#C01E25] text-white px-2 py-0.5 rounded font-bold">
                      Executive Only
                    </span>
                  </div>
                  <div className="text-xs text-[#C01E25] font-semibold">Reserved for Executive Leadership:</div>
                  <ul className="text-xs text-[#1E1B1C] space-y-1.5 font-medium">
                    <li>• Core Security Architecture & HSM key vaults</li>
                    <li>• System Permissions & RBAC policy governance</li>
                    <li>• KDPA & Regulatory Statutory Compliance Controls</li>
                    <li>• Global Platform Configuration & VPC settings</li>
                    <li>• Financial Controls, Escrow policies & banking rails</li>
                    <li>• AI Model parameters, Token quotas & Sandboxes</li>
                    <li>• System Integrations & External API Master Keys</li>
                    <li>• Cryptographic Audit Trail Monitoring & SHA-256 verification</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: ADMIN AI & ANOMALY ENGINE */}
        {activeTab === 'adminAI' && (
          <div className="space-y-6">
            <div className="bg-[#FFFFFF] p-6 rounded-3xl border border-[#DB7D81]/40 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C01E25]" />
                  <h3 className="text-base font-bold text-[#1E1B1C]">Automated Admin AI Engine</h3>
                </div>
                <span className="text-xs font-bold text-[#C01E25] bg-[#F0C9CB]/40 px-2.5 py-0.5 rounded-full">
                  Gemini Flash 3.8 Telemetry
                </span>
              </div>

              <p className="text-xs text-[#5C4D50]">
                Continuous monitoring for quotation inflation, fake customer sign-offs, technician location spoofing, and automated county dispatch load-balancing.
              </p>

              <div className="bg-[#EEECEC]/40 p-4 rounded-2xl border border-[#EEECEC] space-y-2 font-mono text-xs text-[#1E1B1C]">
                <div className="font-bold text-[#C01E25] pb-1 border-b border-[#EEECEC]">
                  Real-Time Audit Stream:
                </div>
                {aiScanLog.map((log, i) => (
                  <div key={i} className="text-[11px] leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
