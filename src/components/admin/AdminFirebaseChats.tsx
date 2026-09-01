import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Clock,
  User,
  Phone,
  Mail,
  Send,
  Sparkles,
  Bot,
  CheckCircle2,
  RefreshCw,
  Search,
  Cloud,
  ShieldCheck,
  Inbox,
  Radio,
} from 'lucide-react';
import {
  subscribeToAllChatSessions,
  subscribeToChatMessages,
  sendChatMessage,
  subscribeToInquiries,
} from '../../services/firebase';
import { ChatMessage, ChatSession, CustomerInquiry } from '../../types';

export const AdminFirebaseChats: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'chats' | 'inquiries'>('chats');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [search, setSearch] = useState('');

  // Inquiries State
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>([]);

  // 1. Subscribe to all chat sessions in Firestore
  useEffect(() => {
    const unsub = subscribeToAllChatSessions((allSessions) => {
      setSessions(allSessions);
      if (!selectedSessionId && allSessions.length > 0) {
        setSelectedSessionId(allSessions[0].id);
      }
    });
    return () => unsub();
  }, [selectedSessionId]);

  // 2. Subscribe to messages of selected session
  useEffect(() => {
    if (!selectedSessionId) return;

    const unsub = subscribeToChatMessages(selectedSessionId, (msgs) => {
      setMessages(msgs);
    });
    return () => unsub();
  }, [selectedSessionId]);

  // 3. Subscribe to all contact inquiries in Firestore
  useEffect(() => {
    const unsub = subscribeToInquiries((allInqs) => {
      setInquiries(allInqs);
    });
    return () => unsub();
  }, []);

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSessionId || !adminReplyText.trim() || isSendingReply) return;

    try {
      setIsSendingReply(true);
      await sendChatMessage(selectedSessionId, {
        sender: 'admin',
        senderName: 'VELORA Support Team',
        text: adminReplyText.trim(),
      });
      setAdminReplyText('');
    } catch (err) {
      console.error('Error sending admin reply:', err);
    } finally {
      setIsSendingReply(false);
    }
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  const filteredSessions = sessions.filter((s) => {
    const term = search.toLowerCase();
    return (
      s.userName?.toLowerCase().includes(term) ||
      s.userPhone?.includes(term) ||
      s.lastMessage?.toLowerCase().includes(term)
    );
  });

  const filteredInquiries = inquiries.filter((inq) => {
    const term = search.toLowerCase();
    return (
      inq.name.toLowerCase().includes(term) ||
      inq.phone.includes(term) ||
      inq.subject.toLowerCase().includes(term) ||
      inq.message.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <Cloud className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Firebase Firestore Live Database
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Real-Time Customer Chats & Inquiries
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Every user inquiry and live chat message is synced directly to Firestore collection in real-time.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveSubTab('chats')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'chats'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Live Chat Sessions ({sessions.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('inquiries')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'inquiries'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-blue-600" />
            <span>Contact Inquiries ({inquiries.length})</span>
          </button>
        </div>
      </div>

      {/* CHATS TAB */}
      {activeSubTab === 'chats' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sessions List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
            <div className="p-3.5 border-b border-slate-200 bg-slate-50/70">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search chats by name or phone..."
                  className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {filteredSessions.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No chat sessions recorded in Firestore yet.
                </div>
              ) : (
                filteredSessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSessionId(s.id)}
                    className={`w-full text-left p-3.5 transition-colors flex items-start gap-3 cursor-pointer ${
                      selectedSessionId === s.id
                        ? 'bg-amber-50/80 border-l-4 border-amber-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-slate-900 text-amber-300 text-xs font-bold flex items-center justify-center shrink-0">
                      {s.userName ? s.userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {s.userName || 'Anonymous Shopper'}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(s.updatedAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {s.userPhone && (
                        <p className="text-[11px] text-slate-500">{s.userPhone}</p>
                      )}
                      <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                        {s.lastMessage || 'No messages yet'}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Active Chat Pane */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
            {selectedSession ? (
              <>
                {/* Active Chat Header */}
                <div className="p-3.5 px-5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 text-xs font-bold flex items-center justify-center">
                      {selectedSession.userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">
                        {selectedSession.userName || 'Guest Shopper'}
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        {selectedSession.userPhone && <span>📱 {selectedSession.userPhone}</span>}
                        {selectedSession.userEmail && <span>✉️ {selectedSession.userEmail}</span>}
                        <span className="text-emerald-600 font-bold">• Connected to Firestore</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-4 overflow-y-auto bg-slate-50/40 space-y-3">
                  {messages.map((m) => {
                    const isAdmin = m.sender === 'admin';
                    const isAssistant = m.sender === 'assistant';
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center gap-1 mb-0.5 px-1 text-[10px] text-slate-400">
                          <span>{m.senderName}</span>
                          <span>•</span>
                          <span>
                            {new Date(m.timestamp).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <div
                          className={`max-w-[75%] p-3 rounded-2xl text-xs shadow-2xs leading-relaxed ${
                            isAdmin
                              ? 'bg-slate-900 text-white rounded-br-xs'
                              : isAssistant
                              ? 'bg-amber-50 text-amber-950 border border-amber-200/80 rounded-bl-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Admin Reply Box */}
                <form
                  onSubmit={handleSendAdminReply}
                  className="p-3 border-t border-slate-200 bg-white flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="Type official reply to customer..."
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 focus:bg-white"
                  />
                  <button
                    type="submit"
                    disabled={!adminReplyText.trim() || isSendingReply}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Reply</span>
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                <MessageSquare className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
                <p className="text-xs font-semibold">Select a chat session on the left</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INQUIRIES TAB */}
      {activeSubTab === 'inquiries' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Submitted Contact Messages in Firestore ({filteredInquiries.length})
            </h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inquiries..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3.5 px-4">Customer</th>
                  <th className="p-3.5 px-4">Contact Info</th>
                  <th className="p-3.5 px-4">Topic / Subject</th>
                  <th className="p-3.5 px-4">Message</th>
                  <th className="p-3.5 px-4">Received Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">
                      No inquiries found in Firestore.
                    </td>
                  </tr>
                ) : (
                  filteredInquiries.map((inq) => (
                    <tr key={inq.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3.5 px-4 font-bold text-slate-900">
                        {inq.name}
                      </td>
                      <td className="p-3.5 px-4 text-slate-600">
                        <div className="font-mono">{inq.phone}</div>
                        {inq.email && <div className="text-[11px] text-slate-400">{inq.email}</div>}
                      </td>
                      <td className="p-3.5 px-4 font-medium text-amber-900">
                        {inq.subject}
                      </td>
                      <td className="p-3.5 px-4 text-slate-700 max-w-md">
                        <p className="line-clamp-2">{inq.message}</p>
                      </td>
                      <td className="p-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(inq.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
