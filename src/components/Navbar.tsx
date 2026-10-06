import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  User, 
  Phone,
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { AppView } from '../types';
import { HynovaLogo } from './HynovaLogo';

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
  onOpenLoginModal,
  onOpenContactModal,
  onOpenSiteSurveyModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const directPhone = '0727 547 310';
  const telHref = 'tel:+254727547310';
  const whatsappUrl = 'https://wa.me/254727547310?text=' + encodeURIComponent('Jambo HYNOVA! I would like to consult with a technology advisor.');

  const handleContactClick = () => {
    onNavigate('contact');
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

  return (
    <header className="sticky top-0 z-40 bg-[#FFFFFF]/95 backdrop-blur-md border-b border-[#EEECEC] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* 1. BRAND LOGO (Acts as Home) */}
          <div className="flex items-center shrink-0">
            <button
              id="header-hynova-logo"
              onClick={() => onNavigate('home')}
              className="flex items-center focus:outline-none cursor-pointer group"
              aria-label="HYNOVA Home"
            >
              <HynovaLogo variant="horizontal" size="md" />
            </button>
          </div>

          {/* 2. RELEVANT DESKTOP MENUS (Uncrowded, spacious typography) */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.label}
                  id={`nav-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else {
                      onNavigate(item.view);
                    }
                  }}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#C01E25] bg-[#F0C9CB]/35'
                      : 'text-[#5C4D50] hover:text-[#1E1B1C] hover:bg-[#EEECEC]/70'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. RIGHT SIDE: Direct Phone (0727 547 310) + Login + Primary AI CTA */}
          <div className="hidden lg:flex items-center space-x-3 shrink-0">
            {/* Direct Helpline / WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1B1C] hover:text-[#128C7E] px-3 py-2 rounded-xl border border-[#EEECEC] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all cursor-pointer"
              title="Click to chat or call 0727 547 310"
            >
              <Phone className="w-3.5 h-3.5 text-[#C01E25]" />
              <span className="font-extrabold">{directPhone}</span>
            </a>

            {/* Customer Login */}
            <button
              id="header-login-btn"
              onClick={onOpenLoginModal}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1B1C] hover:text-[#C01E25] px-3 py-2 rounded-xl hover:bg-[#EEECEC]/60 transition-all cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#C01E25]" />
              <span>Login</span>
            </button>

            {/* Primary Action CTA */}
            <button
              id="header-primary-ai-btn"
              onClick={() => onNavigate('ai-recommendation')}
              className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-xs sm:text-sm px-4.5 py-2.5 rounded-xl shadow-md shadow-[#C01E25]/25 flex items-center gap-1.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Recommendation</span>
            </button>
          </div>

          {/* 4. MOBILE / TABLET RIGHT CONTROLS */}
          <div className="flex lg:hidden items-center space-x-2">
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#1E1B1C] hover:bg-[#EEECEC] rounded-xl transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE COLLAPSIBLE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EEECEC] bg-[#FFFFFF] px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-4">
          
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
            onClick={() => {
              onNavigate('ai-recommendation');
              setMobileMenuOpen(false);
            }}
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
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
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
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all min-h-[44px] flex items-center justify-between ${
                    isActive
                      ? 'bg-[#F0C9CB]/40 text-[#C01E25]'
                      : 'text-[#1E1B1C] hover:bg-[#EEECEC]/70'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Customer Login & AI Action */}
          <div className="space-y-2 pt-2 border-t border-[#EEECEC]">
            <button
              onClick={() => {
                onOpenLoginModal();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#EEECEC] text-[#1E1B1C] font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer border border-[#EEECEC] min-h-[44px]"
            >
              <User className="w-4 h-4 text-[#C01E25]" />
              <span>Customer Login</span>
            </button>

            <button
              onClick={() => {
                onNavigate('ai-recommendation');
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-[#C01E25]/25 cursor-pointer min-h-[48px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Recommendation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
