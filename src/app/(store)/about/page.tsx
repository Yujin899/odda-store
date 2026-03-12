'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, HeadphonesIcon, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const features = [
    {
      icon: <ShieldCheck className="size-8 text-(--primary) stroke-[1.5px]" />,
      title: "Authentic Clinical Tools",
      description: "100% certified clinical-grade instruments sourced from globally recognized manufacturers."
    },
    {
      icon: <Truck className="size-8 text-(--primary) stroke-[1.5px]" />,
      title: "Campus-Wide Delivery",
      description: "Fast, reliable delivery directly to Cairo's major dental universities and clinics within 24 hours."
    },
    {
      icon: <HeadphonesIcon className="size-8 text-(--primary) stroke-[1.5px]" />,
      title: "Expert Support",
      description: "Dedicated clinical advisors available to help you select the right tools for your specific needs."
    }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <div className="relative w-64 h-16 grayscale brightness-0 opacity-90">
              <Image 
                src="/logo.png" 
                alt="Odda Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Intro Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-3xl space-y-6"
          >
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none italic">
              PREMIUM TOOLS FOR THE MODERN CLINICIAN
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
              Odda is your trusted source for premium dental and surgical instruments in Egypt. 
              We supply clinics, hospitals, and dental students with authentic, clinical-grade tools.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full pt-16"
          >
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-(--primary) mb-12">
              Why Odda?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-100 p-8 rounded-(--radius) text-left space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-white size-16 rounded-(--radius) flex items-center justify-center shadow-md border border-slate-50">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-20 w-full"
          >
            <Link href="/products" className="group block w-full md:w-max mx-auto px-12 py-6 bg-foreground text-background flex items-center justify-center gap-4 font-black text-[12px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
              Browse ODDAs
              <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform stroke-[3px]" />
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
