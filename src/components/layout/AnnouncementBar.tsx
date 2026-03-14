'use client';

import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, RefreshCw, PhoneCall } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

const MESSAGES = [
  { text: "Free Shipping on orders above 2600 EGP", icon: Truck },
  { text: "100% Authentic Products", icon: ShieldCheck },
  { text: "Easy Returns & Exchange", icon: RefreshCw },
  { text: "Customer Support: Saturday – Thursday, 10AM – 6PM", icon: PhoneCall }
];

export function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>([]);
  const { language } = useLanguageStore();

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      const arMessages = data.announcementsAr || [];
      const enMessages = data.announcements || [];
      
      if (language === 'ar' && arMessages.length > 0) {
        setMessages(arMessages);
      } else if (enMessages.length > 0) {
        setMessages(enMessages);
      } else {
        setMessages(MESSAGES.map(m => m.text));
      }
    }).catch(() => {
      setMessages(MESSAGES.map(m => m.text));
    });
  }, [language]);

  if (messages.length === 0) return null;

  // Triple the messages for smooth marquee
  const displayMessages = [...messages, ...messages, ...messages];

  return (
    <div className="w-full bg-navy h-10 overflow-hidden flex items-center relative z-50">
      <div className={`${language === 'ar' ? 'animate-marquee-rtl' : 'animate-marquee'} whitespace-nowrap flex items-center`}>
        {displayMessages.map((msg, idx) => (
          <React.Fragment key={idx}>
            <div className="text-white text-[11px] sm:text-xs font-medium px-8 flex items-center gap-2">
              <Truck size={14} className="text-white/80" />
              <span>{msg}</span>
            </div>
            <span className="text-white/20 text-xs">•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
