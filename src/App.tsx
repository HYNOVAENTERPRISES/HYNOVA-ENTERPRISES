import React, { useState, useEffect } from 'react';
import { AppView, UserRole } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EmbeddedAIWidget } from './components/EmbeddedAIWidget';
import { HowItWorksSection } from './components/HowItWorksSection';
import { PopularPackagesSection } from './components/PopularPackagesSection';
import { WhyHynovaSection } from './components/WhyHynovaSection';
import { TechnicianPromoSection } from './components/TechnicianPromoSection';
import { PartnersSection } from './components/PartnersSection';
import { SuccessStoriesSection } from './components/SuccessStoriesSection';
import { FinalConversionSection } from './components/FinalConversionSection';
import { Footer } from './components/Footer';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { PortalLoginModal } from './components/PortalLoginModal';
import { ContactModal } from './components/ContactModal';
import { PrivacyTermsModal } from './components/PrivacyTermsModal';
import { SiteSurveyModal } from './components/SiteSurveyModal';

// Dedicated Views & Portals
import { AIRecommendationPortal } from './components/AIRecommendationPortal';
import { SolutionsView } from './components/SolutionsView';
import { HowItWorksView } from './components/HowItWorksView';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { CustomerPortal } from './components/CustomerPortal';
import { TechnicianPortal } from './components/TechnicianPortal';
import { SupplierPortal } from './components/SupplierPortal';
import { PartnerPortal } from './components/PartnerPortal';
import { AdminPortal } from './components/AdminPortal';
import { AIEcosystemChat } from './components/AIEcosystemChat';
import { AIAgentOSView } from './components/AIAgentOSView';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('customer');
  const [selectedCounty, setSelectedCounty] = useState<string>('Nairobi County');
  const [quickPrompt, setQuickPrompt] = useState<string>('');
  const [aiWidgetExpanded, setAiWidgetExpanded] = useState<boolean>(false);
  const [crmLeads, setCrmLeads] = useState<any[]>([]);

  // Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState<boolean>(false);
  const [isSiteSurveyModalOpen, setIsSiteSurveyModalOpen] = useState<boolean>(false);
  const [privacyTermsType, setPrivacyTermsType] = useState<'privacy' | 'terms' | null>(null);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  const handleNavigate = (view: AppView) => {
    if (view === 'privacy') {
      setPrivacyTermsType('privacy');
      return;
    }
    if (view === 'terms') {
      setPrivacyTermsType('terms');
      return;
    }
    setCurrentView(view);
  };

  const handleQuickPrompt = (prompt: string) => {
    setQuickPrompt(prompt);
    setAiWidgetExpanded(true);
  };

  const handleScrollToWidget = () => {
    setAiWidgetExpanded(true);
    const el = document.getElementById('ai-recommendation-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      setCurrentView('home');
      setTimeout(() => {
        setAiWidgetExpanded(true);
        document.getElementById('ai-recommendation-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleLeadCaptured = (lead: any) => {
    setCrmLeads((prev) => [lead, ...prev]);
  };

  const handleSelectPortalFromLogin = (view: AppView, role: UserRole) => {
    setActiveRole(role);
    setCurrentView(view);
  };

  const handleSignOut = () => {
    setActiveRole('customer');
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1E1B1C] font-sans antialiased selection:bg-[#F0C9CB] selection:text-[#C01E25]">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        selectedCounty={selectedCounty}
        onSelectCounty={setSelectedCounty}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenSiteSurveyModal={() => setIsSiteSurveyModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-grow">
        {currentView === 'home' && (
          <>
            {/* SECTION 1: HERO */}
            <HeroSection
              onNavigate={handleNavigate}
              selectedCounty={selectedCounty}
              onQuickPrompt={handleQuickPrompt}
              onScrollToWidget={handleScrollToWidget}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />

            {/* SECTION 2: AI RECOMMENDATION WIDGET (4 simple questions, no login required) */}
            <EmbeddedAIWidget
              selectedCounty={selectedCounty}
              onSelectCounty={setSelectedCounty}
              onNavigate={handleNavigate}
              initialPrompt={quickPrompt}
              isExpanded={aiWidgetExpanded}
              onToggleExpand={setAiWidgetExpanded}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onOpenContactModal={() => setIsContactModalOpen(true)}
            />

            {/* SECTION 3: How HYNOVA Works (4 Steps) */}
            <HowItWorksSection 
              onNavigate={handleNavigate} 
              onSelectPrompt={(prompt) => {
                setQuickPrompt(prompt);
                setAiWidgetExpanded(true);
                handleScrollToWidget();
              }}
            />

            {/* SECTION 4: Popular Packages */}
            <PopularPackagesSection
              onNavigate={handleNavigate}
              onSelectPackageForAI={(pkgName) => {
                setQuickPrompt(pkgName);
                setAiWidgetExpanded(true);
                handleScrollToWidget();
              }}
            />

            {/* SECTION 5: Why HYNOVA */}
            <WhyHynovaSection onNavigate={handleNavigate} />

            {/* SECTION 6: Vetted & Certified Technicians Trust Guarantee */}
            <TechnicianPromoSection
              onNavigate={handleNavigate}
              onOpenAI={() => handleNavigate('ai-recommendation')}
              onOpenContact={() => setIsContactModalOpen(true)}
            />

            {/* SECTION 7: Trusted Equipment Brands & Kenyan Standards */}
            <PartnersSection
              onNavigate={handleNavigate}
              onOpenAI={() => handleNavigate('ai-recommendation')}
            />

            {/* SECTION 8: Success Stories & Client Reviews */}
            <SuccessStoriesSection />

            {/* SECTION 9: Final Conversion (Primary: AI, Secondary: WhatsApp, Tertiary: Customer Login) */}
            <FinalConversionSection
              onNavigate={handleNavigate}
              onScrollToWidget={handleScrollToWidget}
            />
          </>
        )}

        {/* DEDICATED PUBLIC VIEWS */}
        {currentView === 'ai-recommendation' && (
          <AIRecommendationPortal
            onNavigate={handleNavigate}
            initialPrompt={quickPrompt}
            selectedCounty={selectedCounty}
            onLeadCaptured={handleLeadCaptured}
          />
        )}

        {currentView === 'solutions' && (
          <SolutionsView
            onNavigate={handleNavigate}
            onSelectSolutionForAI={(solTitle) => {
              setQuickPrompt(`AI Assessment for ${solTitle} in ${selectedCounty}`);
            }}
          />
        )}

        {currentView === 'how-it-works' && (
          <HowItWorksView
            onNavigate={handleNavigate}
            onOpenAI={() => handleNavigate('ai-recommendation')}
            onSelectPrompt={(prompt) => {
              setQuickPrompt(prompt);
              handleNavigate('ai-recommendation');
            }}
          />
        )}

        {currentView === 'about' && (
          <AboutView onNavigate={handleNavigate} />
        )}

        {currentView === 'contact' && (
          <ContactView 
            onNavigate={handleNavigate} 
            onOpenAI={() => handleNavigate('ai-recommendation')}
          />
        )}

        {/* ROLE PORTALS (Accessible only after login) */}
        {currentView === 'customer-portal' && (
          <CustomerPortal
            onNavigate={handleNavigate}
            onOpenAI={() => handleNavigate('ai-recommendation')}
            onSignOut={handleSignOut}
          />
        )}

        {currentView === 'technician-portal' && (
          <TechnicianPortal />
        )}

        {currentView === 'supplier-portal' && (
          <SupplierPortal />
        )}

        {currentView === 'partner-portal' && (
          <PartnerPortal onNavigate={handleNavigate} />
        )}

        {currentView === 'admin-portal' && (
          <AdminPortal onNavigate={handleNavigate} />
        )}

        {currentView === 'agent-os' && (
          <AIAgentOSView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Global WhatsApp Floating Button */}
      <WhatsAppFloatingButton />

      {/* Persistent AI Technology Advisor */}
      <AIEcosystemChat />

      {/* Global Footer (Strictly essential customer links, no exposed operational backends) */}
      <Footer
        onNavigate={handleNavigate}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        onOpenPrivacyModal={(type) => setPrivacyTermsType(type)}
      />

      {/* Single Customer Login & Enterprise Gateway Modal */}
      <PortalLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSelectPortal={handleSelectPortalFromLogin}
        currentRole={activeRole}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Privacy Policy & Terms of Service Modal */}
      <PrivacyTermsModal
        isOpen={privacyTermsType !== null}
        onClose={() => setPrivacyTermsType(null)}
        type={privacyTermsType || 'privacy'}
      />

      {/* Direct Site Survey Booking Modal with Google Maps Pinning */}
      <SiteSurveyModal
        isOpen={isSiteSurveyModalOpen}
        onClose={() => setIsSiteSurveyModalOpen(false)}
        initialCounty={selectedCounty}
        initialInterest="Physical Verification & BOM Survey"
      />
    </div>
  );
}
