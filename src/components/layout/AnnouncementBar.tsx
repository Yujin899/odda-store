'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, PhoneCall } from 'lucide-react';

const MESSAGES = [
  { text: "Free Shipping on orders above 2600 EGP", icon: Truck },
  { text: "100% Authentic Products", icon: ShieldCheck },
  { text: "Easy Returns & Exchange", icon: RefreshCw },
  { text: "Customer Support: Saturday – Thursday, 10AM – 6PM", icon: PhoneCall }
];

export function AnnouncementBar() {
  // Triple the messages to ensure there's always content filling the screen during the transition
  const displayMessages = [...MESSAGES, ...MESSAGES, ...MESSAGES];

  return (
    <div className="w-full bg-navy h-10 overflow-hidden flex items-center relative z-50">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {displayMessages.map((msg, idx) => (
          <React.Fragment key={idx}>
            <div className="text-white text-[11px] sm:text-xs font-medium px-8 flex items-center gap-2">
              <msg.icon size={14} className="text-white/80" />
              <span>{msg.text}</span>
            </div>
            <span className="text-white/20 text-xs">•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
