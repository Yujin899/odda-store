'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  Facebook, 
  Instagram, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Truck
} from 'lucide-react';
import React, { useState, useEffect } from 'react';

export function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch categories and settings
    Promise.all([
      fetch('/api/categories').then(res => res.json()),
      fetch('/api/settings').then(res => res.json())
    ]).then(([catData, settingsData]) => {
      setCategories(catData.categories || []);
      setSettings(settingsData);
    }).catch(err => console.error('Footer fetch error:', err));
  }, []);

  const fbLink = settings?.socialLinks?.facebook || "#";
  const igLink = settings?.socialLinks?.instagram || "#";
  const waNumber = settings?.whatsappNumber || "";
  const email = settings?.contactEmail || "contact@oddastore.com";
  const description = settings?.storeDescription || "Precision Clinical Instruments for the next generation of dental professionals. Engineering accuracy for modern healthcare.";

  return (
    <footer className="w-full bg-navy pt-20 pb-10 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-8">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative h-10 w-32 filter brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity">
                <Image 
                  src="/logo.png" 
                  alt="Odda Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed font-light max-w-sm">
              {description}
            </p>
            <div className="flex items-center gap-4">
              <Link href={fbLink} className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-(--primary) hover:border-(--primary) transition-all duration-300">
                <Facebook size={16} />
              </Link>
              <Link href={igLink} className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-(--primary) hover:border-(--primary) transition-all duration-300">
                <Instagram size={16} />
              </Link>
              {waNumber && (
                <Link href={`https://wa.me/${waNumber.replace(/\+/g, '').replace(/ /g, '')}`} target="_blank" className="size-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-(--primary) hover:border-(--primary) transition-all duration-300">
                  <MessageCircle size={16} />
                </Link>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--primary)">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Products', 'About', 'Order Tracking'].map((link) => (
                <li key={link}>
                  <Link 
                    href={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`} 
                    className="group text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-(--primary)" />
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Top Categories */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-(--primary)">Categories</h4>
            <ul className="space-y-4">
              {categories.length > 0 ? categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link 
                    href={`/products?categoryId=${cat._id}`} 
                    className="group text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2"
                  >
                    <ArrowRight className="size-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-(--primary)" />
                    {cat.name}
                  </Link>
                </li>
              )) : (
                <li className="text-sm text-white/20 italic">Loading categories...</li>
              )}
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-[10px] text-white/20 uppercase font-bold tracking-[0.2em]">
              © 2026 Odda Store. Precision Clinical Assets.
            </p>
            <div className="flex items-center gap-4 opacity-30">
              <span className="text-[9px] uppercase font-bold tracking-[0.3em]">Built for excellence</span>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 rounded-sm border border-white/10 group hover:border-(--primary)/50 transition-colors">
              <ShieldCheck size={14} className="text-(--primary)" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">Fully Secured</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/5 rounded-sm border border-white/10 group hover:border-(--primary)/50 transition-colors">
              <CreditCard size={14} className="text-(--primary)" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">InstaPay Ready</span>
            </div>
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-(--primary)/10 border border-(--primary)/20 rounded-sm">
              <Truck size={14} className="text-(--primary)" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white">Campus Express</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
