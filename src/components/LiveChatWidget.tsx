import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User as UserIcon,
  Phone,
  ShieldCheck,
  Minimize2,
  Maximize2,
  RefreshCw,
  Clock,
  CheckCheck,
} from 'lucide-react';
import {
  createOrGetChatSession,
  sendChatMessage,
  subscribeToChatMessages,
} from '../services/firebase';
import { ChatMessage, StoreSettings, UserAccount } from '../types';
import { BrandLogo } from './BrandLogo';

interface LiveChatWidgetProps {
  currentUser: UserAccount | null;
  settings: StoreSettings;
  onOpenAuth?: () => void;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({
  currentUser,
  settings,
  onOpenAuth,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatId, setChatId] = useState<string>(() => {
    return localStorage.getItem('velora_chat_id') || '';
  });
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [guestName, setGuestName] = useState(() => currentUser?.name || 'Guest Shopper');
  const [guestPhone, setGuestPhone] = useState(() => currentUser?.phone || '');
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize or restore chat session in Firestore
  useEffect(() => {
    async function initChat() {
      try {
        let existingId = chatId || localStorage.getItem('velora_chat_id') || '';
        const id = await createOrGetChatSession({
          chatId: existingId || undefined,
          userId: currentUser?.id,
          userName: currentUser?.name || guestName,
          userEmail: currentUser?.email,
          userPhone: currentUser?.phone || guestPhone,
        });

        setChatId(id);
        localStorage.setItem('velora_chat_id', id);
      } catch (err) {
        console.error('Error initializing Firestore chat:', err);
      }
    }

    initChat();
  }, [currentUser]);

  // Real-time Firestore subscription to messages
  useEffect(() => {
    if (!chatId) return;

    const unsubscribe = subscribeToChatMessages(chatId, (newMsgs) => {
      setMessages(newMsgs);
      if (!isOpen && newMsgs.length > 0) {
        const lastMsg = newMsgs[newMsgs.length - 1];
        if (lastMsg.sender !== 'user') {
          setHasUnread(true);
        }
      }
    });

    return () => unsubscribe();
  }, [chatId, isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = inputText.trim();
    if (!text || isSending || !chatId) return;

    setInputText('');
    setIsSending(true);

    try {
      // 1. Save user message to Firebase Firestore
      const userMsg = await sendChatMessage(chatId, {
        sender: 'user',
        senderName: currentUser?.name || guestName || 'Customer',
        text,
      });

      // 2. Generate Boutique AI Concierge response
      setIsTyping(true);
      setTimeout(async () => {
        try {
          const lower = text.toLowerCase();
          let botReply = '';

          if (lower.includes('price') || lower.includes('দাম') || lower.includes('cost') || lower.includes('taka')) {
            botReply = `Our authentic handloom jamdani sarees range from ৳8,500 to ৳34,000, tailored royal panjabis from ৳4,500 to ৳12,500, and artisan footwear from ৳3,800. Every item includes complimentary luxury gift-packaging. Would you like a direct catalog link?`;
          } else if (lower.includes('delivery') || lower.includes('shipping') || lower.includes('ডেলিভারি') || lower.includes('charge')) {
            botReply = `We deliver inside Dhaka within 24-48 hours for ৳${settings.shippingFeeInsideDhaka}, and nationwide across Bangladesh within 48-72 hours for ৳${settings.shippingFeeOutsideDhaka}. Free express shipping applies on orders over ৳${settings.freeShippingThreshold.toLocaleString()}!`;
          } else if (lower.includes('size') || lower.includes('সাইজ') || lower.includes('fitting') || lower.includes('custom')) {
            botReply = `We provide comprehensive size charts (38 to 46 for Panjabis, tailored fit sarees, and EU 39-45 footwear). For customized bespoke bridal or wedding fitting, our master artisans can craft made-to-measure pieces within 5-7 working days.`;
          } else if (lower.includes('location') || lower.includes('store') || lower.includes('দোকান') || lower.includes('address') || lower.includes('ঠিকানা')) {
            botReply = `Our flagship store is located at ${settings.addressEn} (${settings.addressBn}). We are open Saturday–Thursday from 10:00 AM to 10:00 PM, and Friday from 2:30 PM to 10:00 PM.`;
          } else if (lower.includes('bkash') || lower.includes('payment') || lower.includes('cod') || lower.includes('ক্যাশ')) {
            botReply = `We accept Cash on Delivery (COD) across all 64 districts in Bangladesh, as well as bKash, Nagad, and direct bank transfers. You can safely inspect your parcel upon doorstep delivery!`;
          } else {
            botReply = `Thank you for your message! Our senior fashion concierge has received your note in our Firebase system and will assist you right away. You can also reach our direct hotline at +${settings.whatsappNumber}. How else may we make your VELORA shopping experience extraordinary?`;
          }

          // 3. Save Assistant Response directly into Firebase Firestore!
          await sendChatMessage(chatId, {
            sender: 'assistant',
            senderName: 'VELORA Concierge',
            text: botReply,
          });
        } catch (botErr) {
          console.error('Error saving bot response to Firebase:', botErr);
        } finally {
          setIsTyping(false);
        }
      }, 900);
    } catch (err) {
      console.error('Failed to send message to Firestore:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setInputText(promptText);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 right-20 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setHasUnread(false);
          }}
          className="group relative flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#12151f] via-[#1c2233] to-[#12151f] text-amber-300 rounded-full shadow-2xl border border-amber-500/30 hover:border-amber-400 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          aria-label="Open Live Concierge Chat"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-amber-400" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#12151f] animate-pulse" />
          </div>

          <div className="hidden sm:flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400/90 leading-tight">
              Live Concierge
            </span>
            <span className="text-xs font-semibold text-white leading-tight">
              Firebase Realtime Chat
            </span>
          </div>

          {hasUnread && (
            <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-bold rounded-full shadow-md animate-bounce">
              New
            </span>
          )}
        </button>
      </div>

      {/* Live Chat Box */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 ease-out shadow-2xl rounded-3xl overflow-hidden border border-amber-500/20 bg-white flex flex-col ${
            isMinimized
              ? 'bottom-20 right-6 w-80 h-16'
              : 'bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[380px] h-[520px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#12151f] via-[#1a1f2e] to-[#12151f] text-white p-3.5 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-200 p-0.5 shrink-0 flex items-center justify-center text-slate-950 font-bold">
                <Bot className="w-5 h-5 text-slate-900" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#12151f]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-amber-300">
                    VELORA Live Concierge
                  </h3>
                  <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono">
                    Firestore Sync
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time connected</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto bg-slate-50/70 space-y-3">
                {/* Guest Identity Chip */}
                <div className="p-2 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-center justify-between text-[11px] text-amber-900">
                  <span className="flex items-center gap-1 font-medium">
                    <UserIcon className="w-3.5 h-3.5 text-amber-700" />
                    <span>Chatting as: <strong>{currentUser?.name || guestName}</strong></span>
                  </span>
                  {!currentUser && (
                    <button
                      onClick={onOpenAuth}
                      className="text-[10px] font-bold text-amber-700 underline hover:text-amber-900 cursor-pointer"
                    >
                      Sign In
                    </button>
                  )}
                </div>

                {messages.length === 0 && (
                  <div className="text-center py-6 space-y-2">
                    <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-semibold text-slate-700">
                      Welcome to VELORA Concierge
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      Every message is securely saved in Firebase Firestore in real-time.
                    </p>
                  </div>
                )}

                {messages.map((msg) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1 mb-0.5 px-1 text-[10px] text-slate-400">
                        <span>{msg.senderName}</span>
                        <span>•</span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div
                        className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs py-1">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                    <span className="text-[11px]">VELORA Concierge is typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                <button
                  onClick={() => handleQuickPrompt('What are your delivery charges and timings?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  🚚 Delivery Rates
                </button>
                <button
                  onClick={() => handleQuickPrompt('Can you suggest wedding Panjabis and Jamdanis?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  ✨ Wedding Sizing
                </button>
                <button
                  onClick={() => handleQuickPrompt('What payment options do you support?')}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-600 rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  💳 bKash / COD
                </button>
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Ask VELORA Concierge..."
                  className="flex-1 px-3.5 py-2.5 bg-slate-100 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isSending}
                  className="p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 rounded-xl shadow-sm transition-all disabled:opacity-40 cursor-pointer"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
