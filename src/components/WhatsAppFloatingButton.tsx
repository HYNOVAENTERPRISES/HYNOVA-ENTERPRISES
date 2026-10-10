import React, { useState } from 'react';
import { MessageCircle, ExternalLink, Sparkles, X, PhoneCall } from 'lucide-react';

interface WhatsAppFloatingButtonProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({
  phoneNumber = '254727547310',
  defaultMessage = 'Jambo HYNOVA! I would like to inquire about a technology solution designed around my budget.',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const encodedMsg = encodeURIComponent(defaultMessage);
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMsg}`;

  const handleOpenWhatsApp = () => {
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Mobile Floating Sticky WhatsApp Button (and desktop quick access) */}
      <aside aria-label="Customer WhatsApp Support" className="fixed bottom-6 left-6 z-40 flex items-center gap-2">
        <button
          id="global-whatsapp-floating-btn"
          onClick={handleOpenWhatsApp}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="group relative flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-[#FFFFFF] px-4 py-3 sm:px-4 sm:py-3 rounded-full shadow-xl shadow-[#25D366]/30 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          aria-label="Talk on WhatsApp"
        >
          {/* Pulsing indicator ring */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFFFFF] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#FFFFFF]"></span>
          </span>

          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="text-xs sm:text-sm font-extrabold tracking-wide whitespace-nowrap">
            WhatsApp Us
          </span>
        </button>

        {/* Desktop Quick Hint Tooltip */}
        {showTooltip && (
          <div className="hidden sm:flex items-center gap-2 bg-[#1E1B1C] text-[#FFFFFF] text-xs px-3 py-1.5 rounded-xl shadow-lg animate-in fade-in-50 slide-in-from-left-2">
            <span>Talk with our team in Kenya</span>
          </div>
        )}
      </aside>
    </>
  );
};
