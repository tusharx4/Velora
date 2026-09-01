import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Cloud } from 'lucide-react';
import { StoreSettings } from '../types';
import { getWhatsAppUrl } from '../utils/helpers';
import { saveInquiryToFirestore } from '../services/firebase';

interface ContactPageProps {
  settings: StoreSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;

    try {
      setIsSubmitting(true);
      // 1. Save data directly to Firebase Firestore
      await saveInquiryToFirestore({
        name: name.trim(),
        phone: phone.trim(),
        subject: subject.trim() || 'General Inquiry',
        message: message.trim(),
      });

      setSavedSuccess(true);

      // 2. Open WhatsApp optionally
      const text = [
        `*VELORA Customer Concierge Message*`,
        ``,
        `*Name:* ${name || 'Guest'}`,
        `*Phone:* ${phone || 'N/A'}`,
        `*Subject:* ${subject || 'General Inquiry'}`,
        `*Message:* ${message}`,
      ].join('\n');

      window.open(getWhatsAppUrl(settings.whatsappNumber, text), '_blank', 'noopener,noreferrer');
      
      setName('');
      setPhone('');
      setSubject('');
      setMessage('');
      setTimeout(() => setSavedSuccess(false), 6000);
    } catch (err) {
      console.error('Error saving inquiry to Firebase:', err);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="space-y-8 py-6 animate-in fade-in duration-300">
      {/* Top Banner Map */}
      <section className="relative rounded-3xl overflow-hidden h-[260px] sm:h-[320px] shadow-xl border border-white/80">
        <iframe
          title="VELORA Map"
          src="https://www.openstreetmap.org/export/embed.html?bbox=90.365%2C23.735%2C90.392%2C23.755&layer=mapnik&marker=23.7461%2C90.3760"
          className="w-full h-full border-0 absolute inset-0 filter grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8 z-10">
          <div className="glass-panel-strong rounded-2xl p-4 sm:p-6 inline-block max-w-md border border-white/80">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
              Dhanmondi, Dhaka
            </span>
            <h1 className="text-xl sm:text-2xl font-medium text-gray-950">
              Visit Our Flagship Store
            </h1>
            <p className="text-xs text-gray-600 mt-1">
              House 12, Road 7, Dhanmondi, Dhaka 1205
            </p>
          </div>
        </div>
      </section>

      {/* Grid: Contact Form & Store Details */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct WhatsApp Contact Form */}
        <div className="glass-panel-strong rounded-3xl p-6 sm:p-8 border border-white/80 shadow-md">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-700">
                Live Concierge
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Cloud className="w-3 h-3 text-emerald-600" />
                <span>Firebase Synced</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-medium text-gray-950 mt-0.5">
              Send Us a Message
            </h2>
            <p className="text-xs text-gray-500 font-bn mt-1">
              আপনার প্রশ্ন সরাসরি Firebase ডেটাবেসে এবং আমাদের হোয়াটসঅ্যাপে সেভ হবে।
            </p>
          </div>

          {savedSuccess && (
            <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Message saved to Firebase Firestore! Our fashion concierge will reply shortly.</span>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arafat Hossain"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 01712345678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Inquiry Topic
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Size guide, Wedding Panjabi, Custom Order, Exchange"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Message / Details
              </label>
              <textarea
                rows={3}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we assist you today?"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-xs outline-none focus:ring-2 focus:ring-amber-500/30"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-5 rounded-full wa-gradient-btn text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md animate-wa-pulse cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="font-bn">WhatsApp-এ মেসেজ পাঠান</span>
            </button>
          </form>
        </div>

        {/* Store Information Cards */}
        <div className="space-y-4">
          <div className="glass-panel rounded-3xl p-5 border border-white/80 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/60 flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Flagship Boutique Address
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {settings.addressEn}
              </p>
              <p className="text-xs font-bn text-gray-500 mt-0.5">
                {settings.addressBn}
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5 border border-white/80 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Direct Phone & WhatsApp Hotline
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {settings.phone}
              </p>
              <p className="text-xs text-emerald-700 font-medium mt-0.5">
                WhatsApp Active 9:00 AM – 11:00 PM Daily
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5 border border-white/80 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200/60 flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Operating Hours
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                Saturday – Thursday: 10:00 AM – 10:00 PM
              </p>
              <p className="text-xs text-gray-600">
                Friday: 2:30 PM – 10:00 PM
              </p>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-5 border border-white/80 shadow-sm flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200/60 flex-shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
                Concierge Email
              </h3>
              <p className="text-xs text-gray-600 mt-1">
                {settings.email}
              </p>
              <p className="text-xs text-gray-400">
                For corporate gifting and partnerships
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
