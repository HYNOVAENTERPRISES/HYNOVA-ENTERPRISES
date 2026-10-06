import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';
import { HynovaLogo } from './HynovaLogo';

interface FooterProps {
  onNavigate: (view: AppView) => void;
  onOpenLoginModal: () => void;
  onOpenContactModal?: () => void;
  onOpenPrivacyModal?: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenLoginModal,
  onOpenContactModal,
  onOpenPrivacyModal,
}) => {
  const handleContactClick = () => {
    if (onOpenContactModal) {
      onOpenContactModal();
    } else {
      onNavigate('contact');
    }
  };

  const handlePrivacyClick = (type: 'privacy' | 'terms') => {
    if (onOpenPrivacyModal) {
      onOpenPrivacyModal(type);
    } else {
      onNavigate(type);
    }
  };

  return (
    <footer className="bg-[#FFFFFF] border-t border-[#EEECEC] pt-14 pb-10 text-[#1E1B1C]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-12 border-b border-[#EEECEC]">
          
          {/* Brand Column */}
          <div className="space-y-4 max-w-sm">
            <HynovaLogo variant="horizontal" size="md" />
            <p className="text-xs text-[#5C4D50] leading-relaxed">
              Kenya&apos;s trusted technology advisor and turnkey infrastructure solutions provider. Sizing, certified installation, and M-Pesa escrow protection for homes, businesses, and institutions.
            </p>
            <div className="space-y-1.5 text-xs text-[#5C4D50]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                <a href="tel:+254727547310" className="hover:text-[#C01E25] transition-colors font-bold">
                  +254 727 547 310 / 0727 547 310
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                <a href="mailto:info@hynovaenterprises.com" className="hover:text-[#C01E25] transition-colors">
                  info@hynovaenterprises.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C01E25] shrink-0" />
                <span>Nairobi, Kenya • Active in all 47 Counties</span>
              </div>
            </div>
          </div>

          {/* STRICT FOOTER LINKS: About, Solutions, Privacy Policy, Terms, Contact, Login */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 text-sm font-bold text-[#5C4D50]">
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-[#C01E25] transition-colors cursor-pointer"
            >
              About
            </button>

            <button
              onClick={() => onNavigate('solutions')}
              className="hover:text-[#C01E25] transition-colors cursor-pointer"
            >
              Solutions
            </button>

            <button
              onClick={() => handlePrivacyClick('privacy')}
              className="hover:text-[#C01E25] transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>

            <button
              onClick={() => handlePrivacyClick('terms')}
              className="hover:text-[#C01E25] transition-colors cursor-pointer"
            >
              Terms
            </button>

            <button
              onClick={handleContactClick}
              className="hover:text-[#C01E25] transition-colors cursor-pointer"
            >
              Contact
            </button>

            <button
              onClick={onOpenLoginModal}
              className="hover:text-[#C01E25] text-[#C01E25] transition-colors cursor-pointer"
            >
              Login
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C4D50]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#1E1B1C]">© {new Date().getFullYear()} HYNOVA ENTERPRISES LTD.</span>
            <span>All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#C01E25] font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Safaricom M-Pesa Escrow Protected
            </span>
            <span>•</span>
            <span>EPRA / NCA Standard Compliant</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
