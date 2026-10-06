import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  ShieldCheck, 
  MessageCircle,
  Phone,
  ArrowRight
} from 'lucide-react';

export const AIEcosystemChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Jambo! I am your HYNOVA Technology Advisor. Ask me anything about sizing solar systems, CCTV security, Wi-Fi mesh, or equipment pricing anywhere in Kenya.',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim() || isLoading) return;

    const userText = inputMsg.trim();
    setInputMsg('');
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai-agent-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: 'customer',
          query: userText,
          context: { county: 'Nairobi', propertyType: 'Residential & Commercial' },
        }),
      });

      const data = await res.json();
      const reply = data.answer || data.text;
      if (data.success && reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
      } else {
        // Helpful fallback
        setMessages((prev) => [
          ...prev,
          {
            sender: 'ai',
            text: 'HYNOVA provides turnkey solutions tailored to your property and budget. Our packages feature genuine bonded equipment from authorized distributors and vetted installation with M-Pesa escrow protection. Would you like a direct consultation with an engineer?',
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'We are active across all 47 counties in Kenya. To get an exact quotation with equipment and installation costs, try our 4-question Instant Sizing tool or speak with us on WhatsApp.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Jambo HYNOVA! I was chatting with your technology advisor and would like to speak with a specialist.");
    window.open(`https://wa.me/254727547310?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* TRIGGER BUTTON */}
      {!isOpen && (
        <button
          id="ai-advisor-fab"
          onClick={() => setIsOpen(true)}
          className="bg-[#C01E25] hover:bg-[#a1181e] text-[#FFFFFF] font-extrabold px-4.5 py-3 rounded-full shadow-2xl shadow-[#C01E25]/30 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95 cursor-pointer min-h-[48px]"
          aria-label="Ask HYNOVA Advisor"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-xs sm:text-sm font-bold">Ask Tech Advisor</span>
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="bg-[#FFFFFF] border border-[#EEECEC] rounded-3xl shadow-2xl w-[92vw] sm:w-[380px] h-[500px] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#C01E25] to-[#DB7D81] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight">HYNOVA Technology Advisor</h3>
                <p className="text-[11px] text-white/90">Answers in seconds • Kenya Nationwide</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Advisor"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-[#EEECEC]/40 border-b border-[#EEECEC] flex gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
            {[
              'Solar backup under 150k',
              'CCTV for 4-bedroom house',
              'Starlink setup in Kenya',
              'How escrow works',
            ].map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInputMsg(p)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white border border-[#EEECEC] text-[#5C4D50] hover:text-[#C01E25] hover:border-[#C01E25] transition-colors cursor-pointer shrink-0"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Message List */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFFFFF]">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col max-w-[85%] ${
                  m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl text-xs sm:text-[13px] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#C01E25] text-white rounded-tr-xs'
                      : 'bg-[#EEECEC]/50 border border-[#EEECEC] text-[#1E1B1C] rounded-tl-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="mr-auto p-3 rounded-2xl bg-[#EEECEC]/50 text-xs text-[#5C4D50] animate-pulse">
                Advisor is calculating solution...
              </div>
            )}
          </div>

          {/* Direct WhatsApp Callout */}
          <div className="px-4 py-2 bg-[#25D366]/10 border-t border-[#25D366]/20 flex items-center justify-between">
            <span className="text-[11px] text-[#128C7E] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Need a human expert?
            </span>
            <button
              onClick={handleWhatsApp}
              className="text-[11px] font-extrabold text-[#128C7E] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Talk on WhatsApp</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-[#EEECEC] flex gap-2 bg-[#FFFFFF]">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask anything about solar, CCTV, internet..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-[#EEECEC] focus:border-[#C01E25] focus:outline-none bg-[#EEECEC]/20"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMsg.trim()}
              className="p-2.5 rounded-xl bg-[#C01E25] hover:bg-[#a1181e] disabled:opacity-50 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
