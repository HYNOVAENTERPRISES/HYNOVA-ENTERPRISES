import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  FileSpreadsheet, 
  ChevronDown, 
  MapPin, 
  ShieldCheck, 
  Layers, 
  Wrench, 
  Truck, 
  Store, 
  Clock, 
  ExternalLink 
} from 'lucide-react';
import { AppView } from '../types';
import { HynovaLogo } from './HynovaLogo';
import { initAuth } from '../services/authService';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  selectedCounty: string;
  onSelectCounty: (county: string) => void;
  onOpenLoginModal: () => void;
  onOpenContactModal?: () => void;
  onOpenSiteSurveyModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  selectedCounty,
  onSelectCounty,
  onOpenLoginModal,
  onOpenContactModal,
  onOpenSiteSurveyModal,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const unsub = initAuth((user) => {
      setGoogleUser(user);
    });
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const directPhone = '0727 547 310';
  const telHref = 'tel:+254727547310';
  const whatsappUrl = 'https://wa.me/254727547310?text=' + encodeURIComponent('Jambo HYNOVA! I would like to consult with a technology advisor.');

  const handleContactClick = () => {
    onNavigate('contact');
    setIsMenuOpen(false);
  };

  // Customer-facing public navigation items
  const navItems: { label: string; view: AppView; action?: () => void; badge?: string }[] = [
    { label: 'Solutions', view: 'solutions' },
    { label: 'Get a Quote', view: 'ai-recommendation' },
    { 
      label: 'Site Survey', 
      view: 'home', 
      action: onOpenSiteSurveyModal ? onOpenSiteSurveyModal : () => onNavigate('ai-recommendation'),
      badge: 'Maps Pinned'
    },
    { label: 'How It Works', view: 'how-it-works' },
    { label: 'About', view: 'about' },
    { label: 'Contact', view: 'contact', action: handleContactClick },
  ];

  const handleNavigateAndClose = (view: AppView) => {
    onNavigate(view);
    setIsMenuOpen(false);
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EEECEC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. BRAND LOGO (Acts as Home) */}
          <div className="flex items-center shrink-0">
            <button
              id="header-hynova-logo"
              onClick={() => handleNavigateAndClose('home')}
              className="flex items-center focus:outline-none cursor-pointer group"
              aria-label="HYNOVA Home"
            >
              <HynovaLogo variant="horizontal" size="md" />
            </button>
          </div>

          {/* 2. DESKTOP RIGHT ACTIONS & SLIDE-DOWN MENU TOGGLE (Uncrowded, spacious layout) */}
          <div className="hidden md:flex items-center space-x-3 shrink-0">
            {/* Direct Helpline / WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1B1C] hover:text-[#128C7E] px-3.5 py-2.5 rounded-xl border border-[#EEECEC] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all cursor-pointer"
              title="Click to chat or call 0727 547 310"
            >
              <Phone className="w-3.5 h-3.5 text-[#C01E25]" />
              <span className="font-extrabold">{directPhone}</span>
            </a>

            {/* Customer Login / Google Workspace Status */}
            {googleUser ? (
              <button
                onClick={() => onNavigate('admin-portal')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 rounded-xl hover:bg-emerald-100 transition-all cursor-pointer"
                title={`Signed in as ${googleUser.email}. Click to view HYNOVA OPS spreadsheet.`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>HYNOVA OPS (Sheets)</span>
              </button>
            ) : (
              <button
                id="header-login-btn"
                onClick={onOpenLoginModal}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1B1C] hover:text-[#C01E25] px-3.5 py-2.5 rounded-xl hover:bg-[#EEECEC]/60 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#C01E25]" />
                <span>Login</span>
              </button>
            )}

            {/* Primary Action CTA */}
            <button
              id="header-primary-ai-btn"
              onClick={() => onNavigate('ai-recommendation')}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl shadow-md shadow-[#C01E25]/25 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Recommendation</span>
            </button>

            {/* Desktop Slide-Down Menu Toggle Button */}
            <button
              id="desktop-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer border ${
                isMenuOpen
                  ? 'bg-[#C01E25] text-white border-[#C01E25] shadow-md shadow-[#C01E25]/20'
                  : 'bg-[#EEECEC]/60 hover:bg-[#EEECEC] text-[#1E1B1C] hover:text-[#C01E25] border-[#EEECEC]'
              }`}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4 text-[#C01E25]" />}
              <span>{isMenuOpen ? 'Close' : 'Menu'}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* 3. MOBILE / TABLET RIGHT CONTROLS */}
          <div className="flex md:hidden items-center space-x-2">
            <a
              href={telHref}
              className="p-2 rounded-xl text-[#C01E25] bg-[#F0C9CB]/30 border border-[#DB7D81]/30 flex items-center justify-center min-w-[40px] min-h-[40px]"
              title="Call 0727 547 310"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              id="mobile-header-ai-cta"
              onClick={() => onNavigate('ai-recommendation')}
              className="hidden sm:flex bg-[#C01E25] text-[#FFFFFF] font-extrabold text-xs px-3 py-2 rounded-xl items-center gap-1 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Sizing</span>
            </button>

            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-xl transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center ${
                isMenuOpen ? 'bg-[#C01E25] text-white' : 'text-[#1E1B1C] hover:bg-[#EEECEC]'
              }`}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* UNIVERSAL SLIDE-DOWN MENU DRAWER (FOR BOTH WEB & MOBILE VIEW) */}
      {isMenuOpen && (
        <div className="border-t border-[#EEECEC] bg-[#FFFFFF] shadow-2xl animate-in slide-in-from-top-4 duration-200">
          
          {/* DESKTOP / WEB MULTI-COLUMN MEGA MENU VIEW (md:block) */}
          <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Top Bar inside Drawer */}
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#EEECEC]">
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  HYNOVA Technology Fulfillment Network
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F0C9CB]/40 text-[#C01E25] border border-[#DB7D81]/40">
                  All 47 Counties Supported
                </span>
                {googleUser && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                    Google Workspace Live: HYNOVA OPS Connected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <a
                  href={telHref}
                  className="text-xs font-extrabold text-[#1E1B1C] hover:text-[#C01E25] flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#C01E25]" />
                  <span>Direct: {directPhone}</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                  <span>WhatsApp Desk</span>
                </a>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2-Column Clean Mega Grid: Main Navigation & Instant Sizing Card */}
            <div className="grid grid-cols-12 gap-8 items-start">
              
              {/* Column 1: Main Navigation (Clean & Uncrowded) */}
              <div className="col-span-7">
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C01E25]" />
                  Main Navigation
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleNavigateAndClose('home')}
                    className={`text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                      currentView === 'home' ? 'bg-[#F0C9CB]/40 text-[#C01E25] border border-[#DB7D81]/40' : 'text-gray-800 hover:bg-gray-50 border border-gray-100'
                    }`}
                  >
                    <span>Home</span>
                  </button>
                  {navItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else {
                          onNavigate(item.view);
                        }
                        setIsMenuOpen(false);
                      }}
                      className={`text-left p-3 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                        currentView === item.view ? 'bg-[#F0C9CB]/40 text-[#C01E25] border border-[#DB7D81]/40' : 'text-gray-800 hover:bg-gray-50 border border-gray-100'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Column 2: Quick Action & Sizing Card */}
              <div className="col-span-5 bg-gradient-to-br from-[#F0C9CB]/30 via-white to-gray-50 rounded-2xl p-5 border border-[#DB7D81]/40 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#C01E25] text-white flex items-center justify-center mb-3 shadow-md shadow-[#C01E25]/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-extrabold text-gray-900">
                    Instant AI Sizing & Cost Assessment
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    Answer 4 quick questions to receive preliminary Bill of Quantities, equipment sizing, and technician deployment estimates.
                  </p>
                </div>

                <div className="space-y-2 mt-4 pt-4 border-t border-[#EEECEC]">
                  <button
                    onClick={() => handleNavigateAndClose('ai-recommendation')}
                    className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <span>Launch AI Sizing</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {onOpenSiteSurveyModal && (
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenSiteSurveyModal();
                      }}
                      className="w-full bg-white hover:bg-gray-50 text-gray-800 font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1.5 border border-gray-200 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#C01E25]" />
                      <span>Pin Location for Site Survey</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* MOBILE VIEW DRAWER (md:hidden) */}
          <div className="md:hidden px-4 pt-3 pb-6 space-y-4">
            
            {/* Quick Helpline Header */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#EEECEC]/40 border border-[#EEECEC]">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C01E25]" />
                <div>
                  <span className="text-[10px] text-[#5C4D50] uppercase font-bold block">Direct Helpline</span>
                  <a href={telHref} className="text-sm font-black text-[#1E1B1C] hover:text-[#C01E25]">
                    {directPhone}
                  </a>
                </div>
              </div>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Quick AI Sizing Card in Mobile Menu */}
            <button
              onClick={() => handleNavigateAndClose('ai-recommendation')}
              className="w-full p-3.5 rounded-2xl bg-[#C01E25] text-white flex items-center justify-between text-left shadow-md shadow-[#C01E25]/20 cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-wider block">Instant Sizing & Cost Assessment</span>
                  <span className="text-[11px] text-white/80 font-medium">Instant Preliminary BOM • 4 Quick Questions</span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {/* Navigation Items */}
            <div className="space-y-1">
              <button
                onClick={() => handleNavigateAndClose('home')}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all min-h-[44px] flex items-center justify-between ${
                  currentView === 'home'
                    ? 'bg-[#F0C9CB]/40 text-[#C01E25]'
                    : 'text-[#1E1B1C] hover:bg-[#EEECEC]/70'
                }`}
              >
                <span>Home</span>
              </button>

              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else {
                        onNavigate(item.view);
                      }
                      setIsMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all min-h-[44px] flex items-center justify-between ${
                      isActive
                        ? 'bg-[#F0C9CB]/40 text-[#C01E25]'
                        : 'text-[#1E1B1C] hover:bg-[#EEECEC]/70'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Customer Login & AI Action */}
            <div className="space-y-2 pt-2 border-t border-[#EEECEC]">
              <button
                onClick={() => {
                  onOpenLoginModal();
                  setIsMenuOpen(false);
                }}
                className="w-full bg-[#EEECEC] text-[#1E1B1C] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-[#EEECEC] min-h-[44px]"
              >
                <User className="w-4 h-4 text-[#C01E25]" />
                <span>Customer Login</span>
              </button>

              <button
                onClick={() => handleNavigateAndClose('ai-recommendation')}
                className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/25 cursor-pointer min-h-[48px]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Get Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

