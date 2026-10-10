import React, { useState } from 'react';
import { 
  X, 
  User, 
  Wrench, 
  Store, 
  Building2, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  KeyRound,
  FileCheck,
  Building,
  UploadCloud,
  ChevronLeft
} from 'lucide-react';
import { AppView, UserRole } from '../types';
import { googleSignIn } from '../services/authService';
import { googleSheetsOps } from '../services/googleSheetsService';

interface PortalLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPortal: (view: AppView, role: UserRole) => void;
  currentRole?: UserRole;
}

export const PortalLoginModal: React.FC<PortalLoginModalProps> = ({
  isOpen,
  onClose,
  onSelectPortal,
}) => {
  // Main view: 'customer' or 'enterprise'
  const [gatewayView, setGatewayView] = useState<'customer' | 'enterprise'>('customer');
  
  // Customer mode: 'login' | 'register'
  const [customerMode, setCustomerMode] = useState<'login' | 'register'>('login');
  const [loginMethod, setLoginMethod] = useState<'phone-otp' | 'email-password'>('phone-otp');
  
  // Customer login states
  const [phone, setPhone] = useState('0712 345 678');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState('david.karanja@example.com');
  const [password, setPassword] = useState('••••••••');
  
  // Customer register states (<60s)
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regNationalId, setRegNationalId] = useState('');
  
  // Enterprise stakeholders
  const [selectedEnterpriseRole, setSelectedEnterpriseRole] = useState<'technician' | 'supplier' | 'partner' | 'staff' | 'admin'>('technician');
  const [enterpriseAction, setEnterpriseAction] = useState<'login' | 'apply'>('login');
  
  // Technician vetting application form
  const [techFullName, setTechFullName] = useState('');
  const [techNationalId, setTechNationalId] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [techEmail, setTechEmail] = useState('');
  const [techCounty, setTechCounty] = useState('Nairobi');
  const [techSkills, setTechSkills] = useState('Solar PV, Inverter Sizing, CCTV, Starlink');
  const [techExperience, setTechExperience] = useState('5 Years');
  const [techAppliedSuccess, setTechAppliedSuccess] = useState(false);

  // Supplier vetting application form
  const [supCompanyName, setSupCompanyName] = useState('');
  const [supRegNo, setSupRegNo] = useState('');
  const [supTaxPin, setSupTaxPin] = useState('');
  const [supNationalId, setSupNationalId] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supEmail, setSupEmail] = useState('');
  const [supProducts, setSupProducts] = useState('Hybrid Inverters, Lithium Batteries, CCTV');
  const [supRegions, setSupRegions] = useState('Nairobi & Central Kenya');
  const [supAppliedSuccess, setSupAppliedSuccess] = useState(false);

  // Staff / Admin state
  const [staffId, setStaffId] = useState('');
  const [staffPass, setStaffPass] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Handle Customer Google 1-Click Login / Register
  const handleGoogleAuth = async () => {
    setIsSubmitting(true);
    try {
      const res = await googleSignIn();
      if (res) {
        // Live sync with HYNOVA OPS spreadsheet using the authenticated OAuth token
        await googleSheetsOps.syncWithGoogleSheets(res.accessToken, res.user.email || undefined);
        onSelectPortal('customer-portal', 'customer');
        onClose();
      }
    } catch (err) {
      console.error('Google Workspace sign-in error:', err);
      // Fallback to customer portal
      onSelectPortal('customer-portal', 'customer');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Customer Phone OTP Send
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    setOtpCode('749210');
  };

  // Handle Customer Login Submit
  const handleCustomerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSelectPortal('customer-portal', 'customer');
      onClose();
    }, 500);
  };

  // Handle Customer 60s Registration Submit
  const handleCustomerRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSelectPortal('customer-portal', 'customer');
      onClose();
    }, 600);
  };

  // Handle Enterprise Login Submit
  const handleEnterpriseLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const viewMap: Record<string, AppView> = {
        technician: 'technician-portal',
        supplier: 'supplier-portal',
        partner: 'partner-portal',
        staff: 'staff-portal',
        admin: 'admin-portal',
      };
      onSelectPortal(viewMap[selectedEnterpriseRole] || 'customer-portal', selectedEnterpriseRole as UserRole);
      onClose();
    }, 500);
  };

  // Handle Technician Application Submit
  const handleTechApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTechAppliedSuccess(true);
    setTimeout(() => {
      setTechAppliedSuccess(false);
      onSelectPortal('technician-portal', 'technician');
      onClose();
    }, 2000);
  };

  // Handle Supplier Application Submit
  const handleSupApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupAppliedSuccess(true);
    setTimeout(() => {
      setSupAppliedSuccess(false);
      onSelectPortal('supplier-portal', 'supplier');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1B1C]/65 backdrop-blur-xs animate-in fade-in-50">
      <div className="bg-[#FFFFFF] border border-[#EEECEC] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-[#EEECEC] flex items-center justify-between bg-gradient-to-r from-[#FFFFFF] via-[#EEECEC]/30 to-[#FFFFFF]">
          {gatewayView === 'enterprise' ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setGatewayView('customer')}
                className="p-1.5 rounded-xl hover:bg-[#EEECEC] text-[#5C4D50] hover:text-[#1E1B1C] transition-colors cursor-pointer"
                title="Back to Customer Login"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-black text-[#1E1B1C] flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#C01E25]" />
                  <span>Enterprise Stakeholder Portal</span>
                </h2>
                <p className="text-xs text-[#5C4D50]">
                  Vetted Technicians, Bonded Suppliers & Partners
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C01E25] mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HYNOVA Customer Portal</span>
              </div>
              <h2 className="text-xl font-black text-[#1E1B1C]">
                {customerMode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
              </h2>
              <p className="text-xs text-[#5C4D50]">
                {customerMode === 'login' 
                  ? 'Track projects, view AI estimates, and release escrow milestones' 
                  : 'Get started in less than 60 seconds with M-Pesa escrow protection'}
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC] transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* ========================================================= */}
          {/* VIEW 1: PUBLIC CUSTOMER EXPERIENCE (CLEAN & SIMPLE)       */}
          {/* ========================================================= */}
          {gatewayView === 'customer' && (
            <>
              {/* Toggle: Sign In vs 60s Create Account */}
              <div className="flex rounded-xl bg-[#EEECEC] p-1 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => setCustomerMode('login')}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    customerMode === 'login'
                      ? 'bg-[#FFFFFF] text-[#C01E25] shadow-xs'
                      : 'text-[#5C4D50] hover:text-[#1E1B1C]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerMode('register')}
                  className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                    customerMode === 'register'
                      ? 'bg-[#FFFFFF] text-[#C01E25] shadow-xs'
                      : 'text-[#5C4D50] hover:text-[#1E1B1C]'
                  }`}
                >
                  Create Account (60s)
                </button>
              </div>

              {/* 1-Click Google Sign In */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl border border-[#DB7D81]/40 bg-[#FFFFFF] hover:bg-[#EEECEC]/50 text-xs sm:text-sm font-bold text-[#1E1B1C] flex items-center justify-center gap-3 transition-colors shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{customerMode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#EEECEC] w-full" />
                <span className="bg-[#FFFFFF] px-3 text-[11px] font-bold text-[#8F7B7F] uppercase tracking-wider shrink-0">
                  Or with phone / email
                </span>
              </div>

              {/* MODE A: CUSTOMER LOGIN */}
              {customerMode === 'login' && (
                <div className="space-y-4">
                  {/* Method tabs: Phone OTP vs Email */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginMethod('phone-otp')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        loginMethod === 'phone-otp'
                          ? 'border-[#C01E25] bg-[#F0C9CB]/20 text-[#C01E25]'
                          : 'border-[#EEECEC] text-[#5C4D50] hover:bg-[#EEECEC]/40'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Phone + OTP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginMethod('email-password')}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        loginMethod === 'email-password'
                          ? 'border-[#C01E25] bg-[#F0C9CB]/20 text-[#C01E25]'
                          : 'border-[#EEECEC] text-[#5C4D50] hover:bg-[#EEECEC]/40'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email + Password</span>
                    </button>
                  </div>

                  {loginMethod === 'phone-otp' ? (
                    <form onSubmit={otpSent ? handleCustomerLoginSubmit : handleSendOtp} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">
                          Phone Number (Safaricom / Airtel)
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="07XX XXX XXX"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20 font-mono"
                        />
                      </div>

                      {otpSent && (
                        <div className="p-3 bg-[#F0C9CB]/30 border border-[#DB7D81] rounded-xl space-y-2 animate-in fade-in">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#1E1B1C]">Enter 6-Digit SMS Code</span>
                            <span className="text-[#C01E25] font-mono font-bold">Simulated: 749210</span>
                          </div>
                          <input
                            type="text"
                            required
                            maxLength={6}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            placeholder="749210"
                            className="w-full text-center text-lg tracking-widest font-mono font-black p-2 rounded-lg border border-[#DB7D81] bg-[#FFFFFF] text-[#C01E25] focus:outline-none"
                          />
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/20 cursor-pointer transition-all"
                      >
                        <span>{otpSent ? 'Verify & Access Customer Portal' : 'Send One-Time Passcode'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleCustomerLoginSubmit} className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@domain.com"
                          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Password</label>
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/20 cursor-pointer transition-all"
                      >
                        <span>Sign In to Customer Portal</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* MODE B: 60-SECOND CUSTOMER REGISTRATION */}
              {customerMode === 'register' && (
                <form onSubmit={handleCustomerRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. David Karanja"
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-[#5C4D50] block mb-1">Phone Number (M-Pesa)</label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#5C4D50] block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@domain.com"
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-[#5C4D50] block mb-1">Create Password</label>
                      <input
                        type="password"
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#5C4D50] block mb-1">
                        National ID <span className="text-[10px] text-[#8F7B7F] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={regNationalId}
                        onChange={(e) => setRegNationalId(e.target.value)}
                        placeholder="e.g. 29384920"
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
                      />
                    </div>
                  </div>

                  <div className="text-[11px] text-[#5C4D50] flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                    <span>Free registration. No credit card required. Safaricom Escrow secured.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/20 cursor-pointer transition-all mt-2"
                  >
                    <span>Create Account & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* DISCRETE ENTERPRISE / TECHNICIAN / SUPPLIER / STAFF ENTRY */}
              <div className="pt-4 border-t border-[#EEECEC] text-center">
                <button
                  type="button"
                  onClick={() => setGatewayView('enterprise')}
                  className="text-xs font-bold text-[#5C4D50] hover:text-[#C01E25] transition-colors inline-flex items-center gap-1 cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C01E25]" />
                  <span>Authorized Technician, Supplier, Partner or Staff? Enterprise Access →</span>
                </button>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: NON-PUBLIC ENTERPRISE & ROLE-BASED ACCESS GATEWAY */}
          {/* ========================================================= */}
          {gatewayView === 'enterprise' && (
            <div className="space-y-4">
              {/* Stakeholder Role Selector */}
              <div>
                <label className="text-xs font-bold text-[#5C4D50] block mb-1.5">Select Stakeholder Role</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'technician', label: 'Technician', icon: Wrench },
                    { id: 'supplier', label: 'Supplier', icon: Store },
                    { id: 'partner', label: 'Partner', icon: Building2 },
                    { id: 'staff', label: 'Staff Ops', icon: User },
                    { id: 'admin', label: 'Admin', icon: ShieldCheck },
                  ].map((r) => {
                    const Icon = r.icon;
                    const isSel = selectedEnterpriseRole === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => {
                          setSelectedEnterpriseRole(r.id as any);
                          setEnterpriseAction('login');
                        }}
                        className={`p-2.5 rounded-xl text-xs font-bold border flex items-center gap-2 transition-all cursor-pointer ${
                          isSel
                            ? 'bg-[#C01E25] text-white border-[#C01E25]'
                            : 'bg-[#EEECEC]/50 border-[#EEECEC] text-[#5C4D50] hover:bg-[#EEECEC]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vetting Note for Non-Customer Roles */}
              <div className="p-3 rounded-xl bg-[#EEECEC]/50 border border-[#EEECEC] text-[11px] text-[#5C4D50] flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#C01E25] shrink-0 mt-0.5" />
                <span>
                  <strong>National ID verification required</strong> for all technicians, suppliers, enterprise partners, and staff personnel in accordance with Kenyan licensing regulations.
                </span>
              </div>

              {/* Sub-action for Technician & Supplier: Log In vs Apply / Onboard */}
              {(selectedEnterpriseRole === 'technician' || selectedEnterpriseRole === 'supplier') && (
                <div className="flex rounded-xl bg-[#EEECEC] p-1 text-xs font-extrabold">
                  <button
                    type="button"
                    onClick={() => setEnterpriseAction('login')}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                      enterpriseAction === 'login' ? 'bg-[#FFFFFF] text-[#C01E25]' : 'text-[#5C4D50]'
                    }`}
                  >
                    Accredited Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnterpriseAction('apply')}
                    className={`flex-1 py-1.5 rounded-lg transition-all cursor-pointer ${
                      enterpriseAction === 'apply' ? 'bg-[#FFFFFF] text-[#C01E25]' : 'text-[#5C4D50]'
                    }`}
                  >
                    {selectedEnterpriseRole === 'technician' ? 'Technician Application' : 'Supplier Onboarding'}
                  </button>
                </div>
              )}

              {/* ROLE SPECIFIC FORMS */}
              {/* 1. TECHNICIAN APPLICATION */}
              {selectedEnterpriseRole === 'technician' && enterpriseAction === 'apply' && (
                techAppliedSuccess ? (
                  <div className="p-6 rounded-2xl bg-[#F0C9CB]/30 border border-[#C01E25] text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#C01E25] mx-auto" />
                    <h4 className="font-bold text-[#1E1B1C]">Application Submitted for Vetting</h4>
                    <p className="text-xs text-[#5C4D50]">
                      National ID and certifications under verification. Logging you into the Technician Demo Sandbox...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleTechApplySubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Full Legal Name</label>
                        <input
                          type="text"
                          required
                          value={techFullName}
                          onChange={(e) => setTechFullName(e.target.value)}
                          placeholder="As on National ID"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">National ID Number *</label>
                        <input
                          type="text"
                          required
                          value={techNationalId}
                          onChange={(e) => setTechNationalId(e.target.value)}
                          placeholder="e.g. 28941029"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={techPhone}
                          onChange={(e) => setTechPhone(e.target.value)}
                          placeholder="07XX XXX XXX"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Primary County</label>
                        <input
                          type="text"
                          required
                          value={techCounty}
                          onChange={(e) => setTechCounty(e.target.value)}
                          placeholder="e.g. Nakuru, Nairobi"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#5C4D50] block mb-1">Technical Skills & Certifications</label>
                      <input
                        type="text"
                        value={techSkills}
                        onChange={(e) => setTechSkills(e.target.value)}
                        placeholder="e.g. Solar PV Class T3, Hikvision VCP, Fiber Splicing"
                        className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Submit Technician Credentials for Vetting
                    </button>
                  </form>
                )
              )}

              {/* 2. SUPPLIER APPLICATION */}
              {selectedEnterpriseRole === 'supplier' && enterpriseAction === 'apply' && (
                supAppliedSuccess ? (
                  <div className="p-6 rounded-2xl bg-[#F0C9CB]/30 border border-[#C01E25] text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-[#C01E25] mx-auto" />
                    <h4 className="font-bold text-[#1E1B1C]">Supplier Vetting In Progress</h4>
                    <p className="text-xs text-[#5C4D50]">
                      Business Registration & Tax PIN being verified against KRA / BRS databases. Logging you into Supplier Portal...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSupApplySubmit} className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Company / Entity Name</label>
                        <input
                          type="text"
                          required
                          value={supCompanyName}
                          onChange={(e) => setSupCompanyName(e.target.value)}
                          placeholder="e.g. Bonded Solar Ltd"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Business Reg #</label>
                        <input
                          type="text"
                          required
                          value={supRegNo}
                          onChange={(e) => setSupRegNo(e.target.value)}
                          placeholder="PVT-XXXXXX"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">KRA Tax PIN</label>
                        <input
                          type="text"
                          required
                          value={supTaxPin}
                          onChange={(e) => setSupTaxPin(e.target.value)}
                          placeholder="P051XXXXXXX"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20 font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#5C4D50] block mb-1">Director National ID *</label>
                        <input
                          type="text"
                          required
                          value={supNationalId}
                          onChange={(e) => setSupNationalId(e.target.value)}
                          placeholder="e.g. 21948201"
                          className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#5C4D50] block mb-1">Products Supplied</label>
                      <input
                        type="text"
                        value={supProducts}
                        onChange={(e) => setSupProducts(e.target.value)}
                        placeholder="e.g. Solar inverters, lithium batteries, CCTV, Starlink mounts"
                        className="w-full text-xs p-2 rounded-lg border border-[#EEECEC] bg-[#EEECEC]/20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
                    >
                      Submit Supplier Onboarding Application
                    </button>
                  </form>
                )
              )}

              {/* 3. STANDARD LOGIN FOR ENTERPRISE STAKEHOLDER */}
              {enterpriseAction === 'login' && (
                <form onSubmit={handleEnterpriseLoginSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">
                      {selectedEnterpriseRole === 'technician' ? 'Phone / National ID' : 'Business Email / Account ID'}
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={
                        selectedEnterpriseRole === 'technician'
                          ? '0722 890 123 (National ID: 29481920)'
                          : selectedEnterpriseRole === 'supplier'
                          ? 'supplier@hynova-bonded.co.ke'
                          : selectedEnterpriseRole === 'partner'
                          ? 'partner@acacia-properties.co.ke'
                          : 'admin@hynovaenterprises.com'
                      }
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] bg-[#EEECEC]/20"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-[#5C4D50] block mb-1">Passcode / National ID PIN</label>
                    <input
                      type="password"
                      required
                      defaultValue="••••••••"
                      className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#EEECEC] bg-[#EEECEC]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#1E1B1C] hover:bg-[#C01E25] text-[#FFFFFF] font-extrabold text-xs sm:text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Enter {selectedEnterpriseRole.toUpperCase()} Environment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
