'use client';

import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

interface DeliveryTimelineProps {
  status: string;
}

const steps = [
  { id: 'processing', labelEn: 'Processing', labelAr: 'قيد التجهيز', icon: Package },
  { id: 'shipped', labelEn: 'Shipped', labelAr: 'تم الشحن', icon: Truck },
  { id: 'delivered', labelEn: 'Delivered', labelAr: 'تم التوصيل', icon: CheckCircle2 },
];

export function DeliveryTimeline({ status }: DeliveryTimelineProps) {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  const getActiveIndex = () => {
    if (status === 'shipped') return 1;
    if (status === 'delivered') return 2;
    return 0; // default processing
  };

  const activeIndex = getActiveIndex();

  return (
    <div className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
          <Clock className="size-4 text-primary" />
          {isAr ? 'الجدول الزمني للطلب' : 'ORDER TIMELINE'}
        </h2>
      </div>
      
      <div className="p-8">
        <div className="relative flex flex-col sm:flex-row justify-between items-start ps-8 sm:ps-0 group">
          {/* Vertical line for mobile, horizontal for desktop */}
          <div className="absolute top-0 bottom-0 inset-s-[1.2rem] w-[2px] sm:w-full sm:h-[1.5px] sm:top-5 sm:inset-s-0 sm:bottom-auto bg-slate-100 z-0"></div>
          
          {steps.map((step, index) => {
            const isCompleted = index < activeIndex;
            const isActive = index === activeIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-row sm:flex-col items-center gap-4 relative z-10 mb-8 sm:mb-0 last:mb-0 w-full sm:w-auto">
                <motion.div 
                  initial={false}
                  animate={{
                    backgroundColor: isCompleted || isActive ? 'var(--primary)' : '#fff',
                    borderColor: isCompleted || isActive ? 'var(--primary)' : '#e2e8f0',
                    color: isCompleted || isActive ? '#fff' : '#94a3b8',
                  }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm"
                >
                  <Icon className="size-5 stroke-[2.5px]" />
                </motion.div>

                <div className="text-start sm:text-center space-y-1">
                  <p className={`text-[9px] font-black uppercase tracking-widest ${
                    isCompleted || isActive ? 'text-navy' : 'text-slate-400'
                  }`}>
                    {isAr ? step.labelAr : step.labelEn}
                  </p>
                  {isActive && (
                    <span className="block text-[7px] font-black text-primary uppercase tracking-tighter">
                      {isAr ? 'الحالة الحالية' : 'CURRENT STEP'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
