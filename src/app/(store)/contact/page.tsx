'use client';

import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(setSettings)
      .catch(err => console.error('Failed to fetch settings:', err));
  }, []);

  const email = settings?.contactEmail || "contact@oddastore.com";
  const whatsapp = settings?.whatsappNumber || "201126131495";
  const address = "Medical Center, Cairo, Egypt";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Message sent successfully! We will get back to you soon.');
    }, 1500);
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Contact Info */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">Get In<br /><span className="text-(--primary)">Touch</span></h1>
              <p className="text-muted-foreground font-medium max-w-md">Our team of clinical specialists is ready to assist you with any inquiries regarding our premium surgical and dental instruments.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="size-14 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-all duration-300 shadow-sm">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Email Inquiry</h4>
                  <p className="text-lg font-bold">{email}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="size-14 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-all duration-300 shadow-sm">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">WhatsApp Technical</h4>
                  <p className="text-lg font-bold">+{whatsapp}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="size-14 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-all duration-300 shadow-sm">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Clinical Headquarters</h4>
                  <p className="text-lg font-bold">{address}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="size-14 rounded-sm bg-slate-50 border border-slate-100 flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-all duration-300 shadow-sm">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Support Hours</h4>
                  <p className="text-lg font-bold">Mon - Fri: 9am - 6pm</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-(--radius) p-8 lg:p-12 shadow-2xl relative"
          >
            <div className="absolute -top-4 -right-4 size-24 bg-(--primary)/5 rounded-full -z-10 blur-2xl"></div>
            <div className="absolute -bottom-8 -left-8 size-40 bg-(--primary)/5 rounded-full -z-10 blur-3xl"></div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Your Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Dr. John Doe"
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-sm px-4 text-sm font-bold shadow-inner focus:border-(--primary) transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="john@example.com"
                    className="w-full h-12 bg-slate-50 border border-slate-100 rounded-sm px-4 text-sm font-bold shadow-inner focus:border-(--primary) transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Subject</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Inquiry about specific instrument"
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-sm px-4 text-sm font-bold shadow-inner focus:border-(--primary) transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Message</label>
                <textarea 
                  required 
                  rows={5}
                  placeholder="How can we help you?"
                  className="w-full bg-slate-50 border border-slate-100 rounded-sm p-4 text-sm font-bold shadow-inner focus:border-(--primary) transition-all outline-none resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 bg-foreground text-background font-black uppercase tracking-[0.3em] text-[10px] rounded-sm shadow-xl hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 cursor-pointer border-none"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin size-4" />
                ) : (
                  <>
                    <Send size={14} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
