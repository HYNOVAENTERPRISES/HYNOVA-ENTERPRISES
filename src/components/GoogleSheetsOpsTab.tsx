import React, { useState, useEffect } from 'react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Search, 
  Sliders, 
  Users, 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Calculator, 
  Wrench, 
  ShieldCheck, 
  ClipboardList, 
  Truck, 
  Clock, 
  Check, 
  X, 
  Sparkles,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';
import { 
  googleSheetsOps, 
  SPREADSHEET_ID, 
  SPREADSHEET_NAME,
  SheetCustomer,
  SheetJob,
  SheetSiteSurvey,
  SheetProduct,
  SheetService,
  SheetTechnician,
  SheetQuote
} from '../services/googleSheetsService';
import { initAuth, googleSignIn, getAccessToken, logout } from '../services/authService';
import { GoogleSignInButton } from './GoogleSignInButton';
import { GoogleWorkspaceConfirmModal } from './GoogleWorkspaceConfirmModal';
import { User } from 'firebase/auth';

export const GoogleSheetsOpsTab: React.FC = () => {
  // Authentication & Google Workspace Connection State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Active Worksheet View (18 tabs)
  const [activeSheetTab, setActiveSheetTab] = useState<
    | 'control_panel'
    | 'product_catalog'
    | 'services'
    | 'customers'
    | 'jobs'
    | 'labour_engine'
    | 'site_surveys'
    | 'technicians'
    | 'quote_estimator'
    | 'dispatch'
    | 'orders'
    | 'proof_signoff'
    | 'technician_payments'
    | 'maintenance'
    | 'warranty'
    | 'support'
    | 'executive_dashboard'
  >('control_panel');

  // Search filter
  const [searchFilter, setSearchFilter] = useState('');

  // Mutation Modal States (Workspace User Confirmation Required)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
  const [confirmModalData, setConfirmModalData] = useState<{
    title: string;
    description: string;
    targetSheetName: string;
    rowPreview: { label: string; value: string }[];
  }>({
    title: '',
    description: '',
    targetSheetName: '',
    rowPreview: [],
  });
  const [isExecutingMutation, setIsExecutingMutation] = useState(false);

  // Form states for adding customer
  const [newCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [newCustPurchaserName, setNewCustPurchaserName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustRecipient, setNewCustRecipient] = useState('');
  const [isRecipientDifferent, setIsRecipientDifferent] = useState(false);
  const [newCustLocation, setNewCustLocation] = useState('');
  const [newCustPropertyType, setNewCustPropertyType] = useState('Residential Villa / Bungalow');

  // Form states for adding job
  const [newJobModalOpen, setNewJobModalOpen] = useState(false);
  const [newJobCustId, setNewJobCustId] = useState(googleSheetsOps.customers[0]?.customerId || '');
  const [newJobSrvId, setNewJobSrvId] = useState(googleSheetsOps.services[0]?.serviceId || '');
  const [newJobHwValue, setNewJobHwValue] = useState(85000);
  const [newJobLabourValue, setNewJobLabourValue] = useState(20000);

  // Form states for labour calculation simulator
  const [simServiceId, setSimServiceId] = useState(googleSheetsOps.services[0]?.serviceId || 'HYN-SRV-001');
  const [simQty, setSimQty] = useState(4);
  const [simComplexity, setSimComplexity] = useState<'Low' | 'Medium' | 'High'>('Low');

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        if (token) {
          handleAutoSync(token, user.email || undefined);
        }
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleAutoSync = async (token: string, email?: string) => {
    setIsSyncing(true);
    const res = await googleSheetsOps.syncWithGoogleSheets(token, email);
    setIsSyncing(false);
    if (res.success) {
      setSyncNotice('Synchronized live with HYNOVA OPS spreadsheet!');
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const handleGoogleConnect = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        await handleAutoSync(res.accessToken, res.user.email || undefined);
      }
    } catch (err: any) {
      console.error('Google Workspace Auth error:', err);
      setSyncNotice(`Google Workspace connection failed: ${err.message || 'Check permissions'}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleManualSync = async () => {
    if (!accessToken) {
      handleGoogleConnect();
      return;
    }
    setIsSyncing(true);
    const res = await googleSheetsOps.syncWithGoogleSheets(accessToken, currentUser?.email || undefined);
    setIsSyncing(false);
    setSyncNotice(res.message);
    setTimeout(() => setSyncNotice(null), 6000);
  };

  // Submit Add Customer with mandatory Google Workspace confirmation modal
  const handleInitiateAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustPurchaserName || !newCustPhone) return;

    const recipient = isRecipientDifferent && newCustRecipient ? newCustRecipient : `${newCustPurchaserName} (Self)`;
    const newId = googleSheetsOps.getNextCustomerId();

    setConfirmModalData({
      title: `Append Customer ${newId} to Customers Worksheet?`,
      description: `This operation will append a new row to the authoritative 'Customers' worksheet in HYNOVA OPS spreadsheet (ID: ${SPREADSHEET_ID}). Support for Purchaser ≠ Installation Recipient is active.`,
      targetSheetName: 'Customers',
      rowPreview: [
        { label: 'Customer ID', value: newId },
        { label: 'Purchaser Name', value: newCustPurchaserName },
        { label: 'Purchaser Phone', value: newCustPhone },
        { label: 'Purchaser Email', value: newCustEmail || 'N/A' },
        { label: 'Installation Recipient', value: recipient },
        { label: 'Installation Location', value: newCustLocation || 'Nairobi, Kenya' },
        { label: 'Property Type', value: newCustPropertyType },
        { label: 'Created Date', value: new Date().toISOString().split('T')[0] },
      ],
    });

    setPendingAction(() => async () => {
      // 1. Update in-memory business layer
      const created = googleSheetsOps.addCustomer({
        purchaserName: newCustPurchaserName,
        purchaserPhone: newCustPhone,
        purchaserEmail: newCustEmail,
        installationRecipient: recipient,
        installationLocation: newCustLocation || 'Nairobi, Kenya',
        propertyType: newCustPropertyType,
      });

      // 2. If Google OAuth token is present, append directly to Google Sheet
      if (accessToken) {
        await googleSheetsOps.appendRowToGoogleSheet(
          'Customers',
          [
            created.customerId,
            created.purchaserName,
            created.purchaserPhone,
            created.purchaserEmail,
            created.installationRecipient,
            created.installationLocation,
            created.propertyType,
            created.createdDate,
          ],
          accessToken
        );
      }

      setNewCustomerModalOpen(false);
      setNewCustPurchaserName('');
      setNewCustPhone('');
      setNewCustEmail('');
      setNewCustRecipient('');
      setIsRecipientDifferent(false);
      setNewCustLocation('');
      setSyncNotice(`Customer ${created.customerId} successfully added to Customers worksheet!`);
      setTimeout(() => setSyncNotice(null), 5000);
    });

    setConfirmModalOpen(true);
  };

  // Submit Add Job with mandatory Google Workspace confirmation modal
  const handleInitiateAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    const newJobId = googleSheetsOps.getNextJobId();

    setConfirmModalData({
      title: `Register Field Installation ${newJobId} in Jobs Worksheet?`,
      description: `This operation registers an authoritative project record in 'Jobs' worksheet in HYNOVA OPS spreadsheet. Economic variables (Hardware, Labour, Survey fee, 16% VAT) will be calculated and appended.`,
      targetSheetName: 'Jobs',
      rowPreview: [
        { label: 'Job ID', value: newJobId },
        { label: 'Customer ID', value: newJobCustId },
        { label: 'Service ID', value: newJobSrvId },
        { label: 'Hardware Value', value: `KES ${newJobHwValue.toLocaleString()}` },
        { label: 'Labour Value', value: `KES ${newJobLabourValue.toLocaleString()}` },
        { label: 'Base Survey Fee', value: `KES ${googleSheetsOps.controlPanel.baseSiteSurveyFee.toLocaleString()}` },
        { label: 'Lifecycle Status', value: 'Scheduled' },
      ],
    });

    setPendingAction(() => async () => {
      const createdJob = googleSheetsOps.addJob({
        customerId: newJobCustId,
        serviceId: newJobSrvId,
        hardwareValueKES: newJobHwValue,
        labourValueKES: newJobLabourValue,
      });

      if (accessToken) {
        await googleSheetsOps.appendRowToGoogleSheet(
          'Jobs',
          [
            createdJob.jobId,
            createdJob.customerId,
            createdJob.serviceId,
            createdJob.hardwareValueKES,
            createdJob.labourValueKES,
            createdJob.logisticsValueKES,
            createdJob.surveyFeeKES,
            createdJob.subtotalExclVatKES,
            createdJob.vatAmountKES,
            createdJob.totalBilledKES,
            createdJob.crewSize,
            createdJob.estDays,
            createdJob.lifecycleStatus,
          ],
          accessToken
        );
      }

      setNewJobModalOpen(false);
      setSyncNotice(`Job ${createdJob.jobId} created and synced with Jobs worksheet!`);
      setTimeout(() => setSyncNotice(null), 5000);
    });

    setConfirmModalOpen(true);
  };

  const handleExecuteConfirmedMutation = async () => {
    if (!pendingAction) return;
    setIsExecutingMutation(true);
    try {
      await pendingAction();
    } catch (err: any) {
      console.error('Mutation failed:', err);
      setSyncNotice(`Operation error: ${err.message || 'Failed to update Google Sheet'}`);
    } finally {
      setIsExecutingMutation(false);
      setConfirmModalOpen(false);
      setPendingAction(null);
    }
  };

  // Labour simulation result
  const simResult = googleSheetsOps.calculateLabourForScope(simServiceId, simQty, simComplexity);

  return (
    <div className="space-y-6">
      {/* 1. SPREADSHEET HEADER & LIVE WORKSPACE INTEGRATION CARD */}
      <div className="bg-gradient-to-br from-emerald-900 via-gray-900 to-gray-950 text-white rounded-2xl p-6 shadow-xl border border-emerald-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                Authoritative Operations Layer
              </span>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/10 text-gray-300">
                18 Interconnected Worksheets
              </span>
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              {SPREADSHEET_NAME}
              <span className="text-xs font-mono font-normal text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/10">
                ID: {SPREADSHEET_ID}
              </span>
            </h2>

            <p className="text-sm text-gray-300 mt-1 max-w-2xl">
              Connected directly to Google Spreadsheet. Contains pricing engine, hardware catalog,
              labour economics (50% technician pool), field jobs, dispatch, and registers.
            </p>
          </div>

          {/* Connection & Auth Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-2 border border-white/15"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              Open in Google Sheets
            </a>

            {currentUser ? (
              <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3.5 py-2 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-left">
                  <p className="text-[10px] text-emerald-300 font-bold uppercase">Connected Account</p>
                  <p className="text-xs text-white font-medium truncate max-w-[150px]">{currentUser.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="ml-2 text-[10px] text-gray-400 hover:text-white underline"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <GoogleSignInButton
                onClick={handleGoogleConnect}
                isLoading={isSigningIn}
                text="Sign in to Sync Sheets"
                className="bg-white text-gray-800"
              />
            )}

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync Live Data'}
            </button>
          </div>
        </div>

        {/* Sync status notice */}
        {syncNotice && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{syncNotice}</span>
            </div>
            <button onClick={() => setSyncNotice(null)} className="text-gray-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* 2. WORKSHEETS NAVIGATION BAR (18 Worksheets) */}
      <div className="bg-white rounded-2xl p-2 border border-gray-200 shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'control_panel', label: '1. Control_Panel', icon: Sliders, badge: 'Master Config' },
            { id: 'product_catalog', label: '2. Product_Catalog', icon: Layers, badge: `${googleSheetsOps.products.length} SKUs` },
            { id: 'services', label: '3. Services', icon: Wrench, badge: `${googleSheetsOps.services.length} Catalog` },
            { id: 'customers', label: '4. Customers', icon: Users, badge: `${googleSheetsOps.customers.length} Registered` },
            { id: 'jobs', label: '5. Jobs', icon: Briefcase, badge: `${googleSheetsOps.jobs.length} Active` },
            { id: 'labour_engine', label: '6. Labour_Engine', icon: Calculator, badge: '50% Pool Split' },
            { id: 'site_surveys', label: '7. Site_Surveys', icon: MapPin, badge: `${googleSheetsOps.siteSurveys.length} Surveys` },
            { id: 'technicians', label: '8. Technicians', icon: ShieldCheck, badge: `${googleSheetsOps.technicians.length} Vetted` },
            { id: 'quote_estimator', label: '9. Quote_Estimator', icon: FileText, badge: `${googleSheetsOps.quotes.length} Quotes` },
            { id: 'dispatch', label: '10. Dispatch', icon: Truck, badge: `${googleSheetsOps.dispatches.length} Trips` },
            { id: 'orders', label: '11. Orders', icon: DollarSign, badge: `${googleSheetsOps.orders.length} Orders` },
            { id: 'proof_signoff', label: '12. Proof_And_Signoff', icon: CheckCircle2, badge: 'Testing Sign-Off' },
            { id: 'technician_payments', label: '13. Technician_Payments', icon: DollarSign, badge: 'M-Pesa B2C' },
            { id: 'maintenance', label: '14. Maintenance', icon: Clock, badge: 'SLAs' },
            { id: 'warranty', label: '15. Warranty', icon: ShieldCheck, badge: '1-Yr Workmanship' },
            { id: 'support', label: '16. Support', icon: HelpCircle, badge: 'Tickets' },
            { id: 'executive_dashboard', label: '17. Executive_Dashboard', icon: Sparkles, badge: 'KPIs' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSheetTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSheetTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#C01E25] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. WORKSHEET CONTENT CONTAINER */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm min-h-[500px]">
        {/* TAB 1: CONTROL_PANEL */}
        {activeSheetTab === 'control_panel' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-emerald-600" />
                  Control_Panel — Master Configuration & Controlled Reference Data
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  All system variables, pricing rules, labour splits, and dropdown lists are loaded dynamically from this sheet.
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                Operating Currency: {googleSheetsOps.controlPanel.operatingCurrency}
              </span>
            </div>

            {/* Config Parameters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-[11px] font-bold text-gray-500 uppercase">Standard Camera Labour Rate</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  KES {googleSheetsOps.controlPanel.standardCameraLabourRate.toLocaleString()}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">Per camera point baseline</p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-700 uppercase">Labour Pool Economic Split</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">
                  {Math.round(googleSheetsOps.controlPanel.technicianLabourSplit * 100)}% Tech / {Math.round(googleSheetsOps.controlPanel.hynovaLabourSplit * 100)}% HYNOVA
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">Dedicated Field Technician Pool</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <p className="text-[11px] font-bold text-blue-700 uppercase">Base Site Survey Fee</p>
                <p className="text-2xl font-black text-blue-900 mt-1">
                  KES {googleSheetsOps.controlPanel.baseSiteSurveyFee.toLocaleString()}
                </p>
                <p className="text-[11px] text-blue-700 mt-0.5">Physical engineering site assessment</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <p className="text-[11px] font-bold text-amber-700 uppercase">Standard VAT Rate & Trigger</p>
                <p className="text-2xl font-black text-amber-900 mt-1">
                  {Math.round(googleSheetsOps.controlPanel.standardVatRate * 100)}% VAT
                </p>
                <p className="text-[11px] text-amber-700 mt-0.5">Trigger: {googleSheetsOps.controlPanel.technicianPaymentTrigger}</p>
              </div>
            </div>

            {/* Controlled Dropdown Lists */}
            <div className="pt-4">
              <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider text-xs text-gray-500">
                Authoritative Master Dropdowns Populating Application
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                  <p className="text-xs font-bold text-gray-900 mb-2">Customer Types</p>
                  <div className="flex flex-wrap gap-1.5">
                    {googleSheetsOps.controlPanel.customerTypes.map((c, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                  <p className="text-xs font-bold text-gray-900 mb-2">Kenyan Counties Covered</p>
                  <div className="flex flex-wrap gap-1.5">
                    {googleSheetsOps.controlPanel.counties.map((c, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-xl p-3 bg-white">
                  <p className="text-xs font-bold text-gray-900 mb-2">Service Categories</p>
                  <div className="flex flex-wrap gap-1.5">
                    {googleSheetsOps.controlPanel.serviceCategories.map((c, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 bg-red-50 text-red-800 rounded">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCT_CATALOG */}
        {activeSheetTab === 'product_catalog' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-emerald-600" />
                  Product_Catalog — Authoritative Hardware & Equipment Registry
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Unique SKU, pricing excl. VAT, 16% VAT calculation, and total inclusive prices directly synced from the spreadsheet.
                </p>
              </div>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search SKU or model..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border border-gray-200 rounded-lg text-xs w-60 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">SKU / Item Code</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Product Name / Model</th>
                    <th className="p-3">UOM</th>
                    <th className="p-3 text-right">Unit Excl. VAT (KSh)</th>
                    <th className="p-3 text-right">VAT (16%) (KSh)</th>
                    <th className="p-3 text-right">Total Incl. VAT (KSh)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {googleSheetsOps.products
                    .filter((p) =>
                      p.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                      p.sku.toLowerCase().includes(searchFilter.toLowerCase())
                    )
                    .map((item) => (
                      <tr key={item.sku} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-gray-900">{item.sku}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-gray-100 text-gray-700 font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-[11px] text-gray-500 truncate max-w-xs">{item.description}</p>
                        </td>
                        <td className="p-3 text-gray-600">{item.uom}</td>
                        <td className="p-3 text-right font-mono font-medium text-gray-800">
                          {item.unitPriceExclVatKES.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono text-gray-500">
                          {item.vatKES.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-emerald-700">
                          {item.totalInclVatKES.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SERVICES */}
        {activeSheetTab === 'services' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-emerald-600" />
                  Services — Service & Certified Labour Catalog
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Authoritative base rates, site survey requirements, default complexity, and deliverables.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleSheetsOps.services.map((srv) => (
                <div key={srv.serviceId} className="p-4 rounded-xl border border-gray-200 bg-white hover:border-emerald-300 transition-all shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {srv.serviceId}
                      </span>
                      <h4 className="text-sm font-bold text-gray-900 mt-2">{srv.serviceName}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900 font-mono">
                        KES {srv.baseLabourRateKES.toLocaleString()}
                      </p>
                      <p className="text-[11px] text-gray-500">{srv.billingUnit}</p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">{srv.scopeSummary}</p>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">
                      Survey: <strong className={srv.siteSurveyRequirement === 'Mandatory' ? 'text-amber-700' : 'text-gray-700'}>{srv.siteSurveyRequirement}</strong>
                    </span>
                    <span className="text-gray-500">
                      Default Complexity: <strong>{srv.defaultComplexity}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeSheetTab === 'customers' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-600" />
                  Customers — Customer & Installation Registry
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enforces <strong>HYN-CUS-0000</strong> ID pattern and supports <strong>Purchaser ≠ Installation Recipient</strong>.
                </p>
              </div>

              <button
                onClick={() => setNewCustomerModalOpen(true)}
                className="px-3.5 py-2 bg-[#C01E25] hover:bg-[#A0181E] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm self-start"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Customer to Sheet
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Purchaser Details</th>
                    <th className="p-3">Installation Recipient</th>
                    <th className="p-3">Installation Location / GPS</th>
                    <th className="p-3">Property Type</th>
                    <th className="p-3">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {googleSheetsOps.customers.map((c) => {
                    const isDifferent = !c.installationRecipient.includes('Self') && c.installationRecipient !== c.purchaserName;
                    return (
                      <tr key={c.customerId} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-gray-900">{c.customerId}</td>
                        <td className="p-3">
                          <p className="font-semibold text-gray-900">{c.purchaserName}</p>
                          <p className="text-[11px] text-gray-500">{c.purchaserPhone}</p>
                          <p className="text-[11px] text-gray-400">{c.purchaserEmail}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-800">{c.installationRecipient}</span>
                            {isDifferent && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 font-bold border border-purple-200">
                                Recipient ≠ Purchaser
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600 max-w-xs">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" />
                            <span className="truncate">{c.installationLocation}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-700">{c.propertyType}</td>
                        <td className="p-3 text-gray-500 font-mono text-[11px]">{c.createdDate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: JOBS */}
        {activeSheetTab === 'jobs' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-600" />
                  Jobs — Master Field Project Register
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Connects Customer → Service → Hardware → Labour → Logistics → Survey → Total Billed with <strong>HYN-JOB-0000</strong> format.
                </p>
              </div>

              <button
                onClick={() => setNewJobModalOpen(true)}
                className="px-3.5 py-2 bg-[#C01E25] hover:bg-[#A0181E] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm self-start"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Job in Sheet
              </button>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Job ID</th>
                    <th className="p-3">Customer & Service</th>
                    <th className="p-3 text-right">Hardware (KSh)</th>
                    <th className="p-3 text-right">Labour (KSh)</th>
                    <th className="p-3 text-right">Survey (KSh)</th>
                    <th className="p-3 text-right">Total Billed (KSh)</th>
                    <th className="p-3">Crew / Days</th>
                    <th className="p-3">Lifecycle Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {googleSheetsOps.jobs.map((job) => (
                    <tr key={job.jobId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-gray-900">{job.jobId}</td>
                      <td className="p-3">
                        <p className="font-semibold text-gray-900">{job.customerId}</p>
                        <p className="text-[11px] text-gray-500">{job.serviceId}</p>
                      </td>
                      <td className="p-3 text-right font-mono text-gray-800">
                        {job.hardwareValueKES.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-gray-800">
                        {job.labourValueKES.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono text-gray-600">
                        {job.surveyFeeKES.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        KES {job.totalBilledKES.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] text-gray-600">
                          {job.crewSize} Techs • {job.estDays}d
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          {job.lifecycleStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: LABOUR_ENGINE */}
        {activeSheetTab === 'labour_engine' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                Labour_Engine — Authoritative Labour Calculation Engine
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Calculates Base Labour, Complexity Adjustments, and enforces the <strong>50% Technician Pool Split</strong>.
                Installation Cost ≠ Technician Cost.
              </p>
            </div>

            {/* Interactive Labour Simulator */}
            <div className="bg-emerald-50/60 rounded-xl p-5 border border-emerald-200">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Live Labour Engine Simulator (Tested Against Control_Panel & Services)
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Select Service</label>
                  <select
                    value={simServiceId}
                    onChange={(e) => setSimServiceId(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
                  >
                    {googleSheetsOps.services.map((s) => (
                      <option key={s.serviceId} value={s.serviceId}>
                        {s.serviceName} (Base: KES {s.baseLabourRateKES.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Scope Quantity (Points / kWp)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={simQty}
                    onChange={(e) => setSimQty(Number(e.target.value) || 1)}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Site Complexity</label>
                  <select
                    value={simComplexity}
                    onChange={(e) => setSimComplexity(e.target.value as any)}
                    className="w-full text-xs p-2 bg-white border border-gray-300 rounded-lg focus:outline-none"
                  >
                    <option value="Low">Low (Standard Single-Story)</option>
                    <option value="Medium">Medium (+25% Conduit Adjustment)</option>
                    <option value="High">High (+50% Industrial / Trenching)</option>
                  </select>
                </div>
              </div>

              {/* Simulation Result */}
              <div className="mt-4 pt-4 border-t border-emerald-200 grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Base Labour</p>
                  <p className="text-base font-bold text-gray-900 font-mono">KES {simResult.baseLabour.toLocaleString()}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Complexity Adjustment</p>
                  <p className="text-base font-bold text-amber-700 font-mono">+KES {simResult.complexityAdjustment.toLocaleString()}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-emerald-100">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Final Customer Labour</p>
                  <p className="text-base font-bold text-gray-900 font-mono">KES {simResult.finalLabour.toLocaleString()}</p>
                </div>
                <div className="bg-emerald-900 text-white p-3 rounded-lg">
                  <p className="text-[10px] text-emerald-300 font-bold uppercase">Tech Pool Split (50%)</p>
                  <p className="text-base font-bold text-white font-mono">KES {simResult.techPoolSplit.toLocaleString()}</p>
                  <p className="text-[10px] text-emerald-200">HYNOVA Retained: KES {simResult.hynovaSplit.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Existing Labour Entries */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Job ID</th>
                    <th className="p-3">Service ID</th>
                    <th className="p-3 text-right">Scope Qty</th>
                    <th className="p-3 text-right">Base Rate (KSh)</th>
                    <th className="p-3 text-right">Final Labour (KSh)</th>
                    <th className="p-3 text-right font-bold text-emerald-800">Tech Pool Split (50%)</th>
                    <th className="p-3 text-center">Techs</th>
                    <th className="p-3 text-center">Est Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {googleSheetsOps.labourEngine.map((entry) => (
                    <tr key={entry.jobId} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-gray-900">{entry.jobId}</td>
                      <td className="p-3 font-mono text-gray-600">{entry.serviceId}</td>
                      <td className="p-3 text-right font-mono">{entry.scopeQuantity}</td>
                      <td className="p-3 text-right font-mono">{entry.baseUnitRateKES.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-gray-900">
                        {entry.finalLabourCostKES.toLocaleString()}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-emerald-700 bg-emerald-50/30">
                        KES {entry.techPoolSplitKES.toLocaleString()}
                      </td>
                      <td className="p-3 text-center">{entry.assignedTechs}</td>
                      <td className="p-3 text-center">{entry.estDeploymentDays}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 7: SITE_SURVEYS */}
        {activeSheetTab === 'site_surveys' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-emerald-600" />
                  Site_Surveys — Technical Feasibility & Site Assessment
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Enforces <strong>HYN-SUR-0000</strong> survey identifiers, records distance (km), findings, and links to Job ID.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {googleSheetsOps.siteSurveys.map((sur) => (
                <div key={sur.surveyId} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded">
                      {sur.surveyId}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 font-mono">
                      KES {sur.surveyFeeKES.toLocaleString()} Fee
                    </span>
                  </div>

                  <p className="font-bold text-gray-900 text-xs mt-1">{sur.siteLocation}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Customer: <span className="font-mono">{sur.customerId}</span> • Distance: {sur.distanceKm} km
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-gray-50 text-[11px] text-gray-700 border border-gray-100">
                    <p className="font-semibold text-gray-900 mb-0.5">Engineering Findings:</p>
                    <p>{sur.engineeringFindingsSummary}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Tech: {sur.assessingTechnician}</span>
                    <span className="font-bold text-blue-700">{sur.surveyStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: TECHNICIANS */}
        {activeSheetTab === 'technicians' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Technicians — Vetted Field Engineering Roster
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Technician registry, certifications, active assignments, and rankings.
              </p>
            </div>

            {googleSheetsOps.technicians.length === 0 ? (
              <div className="p-8 rounded-2xl border border-gray-200 bg-gray-50/50 text-center max-w-lg mx-auto space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gray-100 text-gray-500 flex items-center justify-center mx-auto font-mono text-sm font-bold">
                  0
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Strict Authoritative State: 0 Technicians</h4>
                <p className="text-xs text-gray-500 leading-relaxed">
                  The Technicians worksheet currently contains 0 records. In accordance with strict source-of-truth governance, 0 technicians are active, available, or assignable across all 47 counties.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <span>Dispatch & Assignment: Pending Worksheet Entry</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {googleSheetsOps.technicians.map((tech) => (
                  <div key={tech.technicianId} className="p-4 rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
                        {tech.technicianId}
                      </span>
                      <span className="text-[11px] font-bold text-amber-600">★ {tech.rating || 5.0}</span>
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{tech.fullName}</h4>
                    <p className="text-xs text-gray-500">{tech.phone}</p>
                    <p className="text-xs text-emerald-700 font-medium mt-1">{tech.baseCounty}</p>
                    <p className="text-xs text-gray-600 mt-2 font-medium">{tech.primarySkills}</p>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">{tech.professionalCertification || tech.status}</span>
                      <span className="font-bold text-emerald-600">{tech.availability}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 9: QUOTE_ESTIMATOR */}
        {activeSheetTab === 'quote_estimator' && (
          <div className="space-y-4">
            <div className="pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Quote_Estimator — Interactive Quotation Register
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Enforces <strong>HYN-Q-001</strong> quote references, hardware BoQs, and terms.
              </p>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider text-[10px] font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Quote Ref</th>
                    <th className="p-3">Client</th>
                    <th className="p-3">Project Scope</th>
                    <th className="p-3 text-right">Hardware (KSh)</th>
                    <th className="p-3 text-right">Labour (KSh)</th>
                    <th className="p-3 text-right">VAT (16%)</th>
                    <th className="p-3 text-right">Grand Total (KSh)</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {googleSheetsOps.quotes.map((q) => (
                    <tr key={q.quoteRef} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 font-mono font-bold text-gray-900">{q.quoteRef}</td>
                      <td className="p-3 font-semibold text-gray-900">{q.purchaserName}</td>
                      <td className="p-3 text-gray-600 max-w-xs truncate">{q.projectScope}</td>
                      <td className="p-3 text-right font-mono">{q.hardwareSubtotalKES.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono">{q.labourKES.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono text-gray-500">{q.vatKES.toLocaleString()}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">
                        KES {q.grandTotalKES.toLocaleString()}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-800 font-bold">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* OTHER WORKSHEETS: DISPATCH, ORDERS, PROOF, PAYMENTS, MAINTENANCE, WARRANTY, SUPPORT, EXECUTIVE DASHBOARD */}
        {activeSheetTab === 'dispatch' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Dispatch — Technician Field Deployment & Navigation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleSheetsOps.dispatches.map((d) => (
                <div key={d.dispatchId} className="p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-xs">{d.dispatchId}</span>
                    <span className="font-semibold text-emerald-700 text-xs">{d.status}</span>
                  </div>
                  <p className="font-bold text-gray-900">{d.siteLocation}</p>
                  <p className="text-xs text-gray-500">
                    Job: {d.jobId} • Tech: {d.technicianId} • Date: {d.scheduledDate} ({d.timeSlot})
                  </p>
                  <p className="text-xs text-gray-700 mt-2 bg-gray-50 p-2 rounded">{d.fieldNotes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSheetTab === 'orders' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Orders — Commercial Ledger & Payment Methods
            </h3>
            <div className="overflow-x-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500 font-bold border-b border-gray-200">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Customer ID</th>
                    <th className="p-3">Associated Job/Quote</th>
                    <th className="p-3 text-right">Total Billed</th>
                    <th className="p-3">Payment Method</th>
                    <th className="p-3">Payment Status</th>
                    <th className="p-3">Order Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {googleSheetsOps.orders.map((o) => (
                    <tr key={o.orderId}>
                      <td className="p-3 font-mono font-bold">{o.orderId}</td>
                      <td className="p-3 font-mono">{o.customerId}</td>
                      <td className="p-3 font-mono">{o.jobIdOrQuote}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">KES {o.totalBilledKES.toLocaleString()}</td>
                      <td className="p-3">{o.paymentMethod}</td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-bold">{o.paymentStatus}</span></td>
                      <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">{o.orderStatus}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSheetTab === 'proof_signoff' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Proof_And_Signoff — Customer Handover & Verification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleSheetsOps.signoffs.map((s) => (
                <div key={s.signoffId} className="p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">{s.signoffId}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">{s.status}</span>
                  </div>
                  <p className="font-bold text-gray-900 mt-2">Signatory: {s.customerSignatory}</p>
                  <p className="text-xs text-gray-500">Job: {s.jobId} • Date: {s.signoffDate}</p>
                  <p className="text-xs text-emerald-700 font-semibold mt-1">
                    ✓ OTP Confirmed & 100% Commissioning Checklist Complete
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSheetTab === 'technician_payments' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Technician_Payments — Field Labour Disbursement Ledger
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleSheetsOps.payments.map((p) => (
                <div key={p.payoutId} className="p-4 rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs">{p.payoutId}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold">{p.status}</span>
                  </div>
                  <p className="text-lg font-black font-mono text-emerald-800 mt-1">
                    KES {p.poolAmountKES.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Job: {p.jobId} • Tech ID: {p.technicianId} • Ref: {p.mpesaRef} ({p.disbursementMethod})
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSheetTab === 'maintenance' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Maintenance — SLA & Preventative Inspection Schedule
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleSheetsOps.maintenance.map((m) => (
                <div key={m.maintId} className="p-4 rounded-xl border border-gray-200 bg-white">
                  <span className="font-mono font-bold text-xs">{m.maintId}</span>
                  <p className="font-bold text-gray-900 mt-1">{m.serviceLevel}</p>
                  <p className="text-xs text-gray-500">
                    Customer: {m.customerId} • Frequency: {m.frequency} • Next Due: {m.nextInspection}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSheetTab === 'warranty' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Warranty — 1-Year Workmanship & Manufacturer Guarantee
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleSheetsOps.warranties.map((w) => (
                <div key={w.warrantyId} className="p-4 rounded-xl border border-gray-200 bg-white">
                  <span className="font-mono font-bold text-xs">{w.warrantyId}</span>
                  <p className="font-bold text-gray-900 mt-1">{w.coverageType}</p>
                  <p className="text-xs text-gray-500">
                    Job: {w.jobId} • Valid: {w.startDate} to {w.endDate} • {w.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSheetTab === 'support' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              Support — Post-Installation Customer Service Tickets
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {googleSheetsOps.support.map((t) => (
                <div key={t.ticketId} className="p-4 rounded-xl border border-gray-200 bg-white">
                  <span className="font-mono font-bold text-xs">{t.ticketId}</span>
                  <p className="font-bold text-gray-900 mt-1">{t.issueCategory}</p>
                  <p className="text-xs text-gray-500">
                    Customer: {t.customerId} • Assigned: {t.assignedTech} • Priority: {t.priority} • Status: {t.status}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSheetTab === 'executive_dashboard' && (
          <div className="space-y-6">
            <div className="pb-2 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                Executive_Dashboard — Real-Time Operations & GMV Analytics
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Aggregated business intelligence computed directly from the operational worksheets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                <p className="text-xs text-gray-500 font-semibold uppercase">Total Pipeline GMV</p>
                <p className="text-2xl font-black text-gray-900 mt-1">
                  KES {googleSheetsOps.jobs.reduce((acc, j) => acc + j.totalBilledKES, 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <p className="text-xs text-emerald-700 font-semibold uppercase">Total Technician Pool Disbursed</p>
                <p className="text-2xl font-black text-emerald-900 mt-1">
                  KES {googleSheetsOps.labourEngine.reduce((acc, l) => acc + l.techPoolSplitKES, 0).toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold uppercase">Completed & In-Flight Jobs</p>
                <p className="text-2xl font-black text-blue-900 mt-1">{googleSheetsOps.jobs.length}</p>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <p className="text-xs text-purple-700 font-semibold uppercase">Client Satisfaction Rating</p>
                <p className="text-2xl font-black text-purple-900 mt-1">4.96 / 5.0</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. MODAL: ADD CUSTOMER FORM */}
      {newCustomerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Add Customer to HYNOVA OPS Sheet
              </h3>
              <button
                onClick={() => setNewCustomerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateAddCustomer} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Purchaser Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Karanja"
                    value={newCustPurchaserName}
                    onChange={(e) => setNewCustPurchaserName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Purchaser Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +254 712 345 678"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Purchaser Email</label>
                <input
                  type="email"
                  placeholder="e.g. david@example.com"
                  value={newCustEmail}
                  onChange={(e) => setNewCustEmail(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Purchaser != Installation Recipient support */}
              <div className="bg-purple-50/70 p-3 rounded-xl border border-purple-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="diffRecipient"
                    checked={isRecipientDifferent}
                    onChange={(e) => setIsRecipientDifferent(e.target.checked)}
                    className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <label htmlFor="diffRecipient" className="text-xs font-bold text-purple-900 cursor-pointer">
                    Purchaser is buying for someone else (Purchaser ≠ Recipient)
                  </label>
                </div>
                {isRecipientDifferent && (
                  <div className="mt-2.5">
                    <label className="block text-[11px] font-semibold text-purple-800 mb-1">
                      Installation Recipient Name & Contact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Elder Joseph Ndung'u (+254 722 000 111)"
                      value={newCustRecipient}
                      onChange={(e) => setNewCustRecipient(e.target.value)}
                      className="w-full text-xs p-2 border border-purple-300 bg-white rounded-lg focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Installation Location / Area</label>
                <input
                  type="text"
                  placeholder="e.g. Karen Miotoni Road, Nairobi (-1.3195, 36.7088)"
                  value={newCustLocation}
                  onChange={(e) => setNewCustLocation(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Property Type</label>
                <select
                  value={newCustPropertyType}
                  onChange={(e) => setNewCustPropertyType(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none bg-white"
                >
                  {googleSheetsOps.controlPanel.propertyTypes.map((pt, i) => (
                    <option key={i} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewCustomerModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#C01E25] hover:bg-[#A0181E] rounded-lg shadow-sm"
                >
                  Continue to Confirmation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD JOB FORM */}
      {newJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                Register Installation in Jobs Worksheet
              </h3>
              <button
                onClick={() => setNewJobModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInitiateAddJob} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Customer</label>
                <select
                  value={newJobCustId}
                  onChange={(e) => setNewJobCustId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none bg-white"
                >
                  {googleSheetsOps.customers.map((c) => (
                    <option key={c.customerId} value={c.customerId}>
                      {c.customerId} — {c.purchaserName} ({c.installationRecipient})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Service</label>
                <select
                  value={newJobSrvId}
                  onChange={(e) => setNewJobSrvId(e.target.value)}
                  className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none bg-white"
                >
                  {googleSheetsOps.services.map((s) => (
                    <option key={s.serviceId} value={s.serviceId}>
                      {s.serviceId} — {s.serviceName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Hardware Value (KSh)</label>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={newJobHwValue}
                    onChange={(e) => setNewJobHwValue(Number(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Labour Value (KSh)</label>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={newJobLabourValue}
                    onChange={(e) => setNewJobLabourValue(Number(e.target.value) || 0)}
                    className="w-full text-xs p-2.5 border border-gray-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-xs space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Base Survey Fee:</span>
                  <span className="font-mono font-medium">KES {googleSheetsOps.controlPanel.baseSiteSurveyFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logistics Baseline:</span>
                  <span className="font-mono font-medium">KES 3,000</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (16%):</span>
                  <span className="font-mono font-medium">
                    KES {Math.round((newJobHwValue + newJobLabourValue + 6000) * 0.16).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-200 font-bold text-emerald-800 text-sm">
                  <span>Total Billed:</span>
                  <span className="font-mono">
                    KES {Math.round((newJobHwValue + newJobLabourValue + 6000) * 1.16).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setNewJobModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#C01E25] hover:bg-[#A0181E] rounded-lg shadow-sm"
                >
                  Continue to Confirmation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MANDATORY GOOGLE WORKSPACE MUTATION CONFIRMATION MODAL */}
      <GoogleWorkspaceConfirmModal
        isOpen={confirmModalOpen}
        title={confirmModalData.title}
        description={confirmModalData.description}
        targetSheetName={confirmModalData.targetSheetName}
        spreadsheetId={SPREADSHEET_ID}
        rowPreview={confirmModalData.rowPreview}
        onConfirm={handleExecuteConfirmedMutation}
        onCancel={() => {
          setConfirmModalOpen(false);
          setPendingAction(null);
        }}
        isConfirming={isExecutingMutation}
      />
    </div>
  );
};
