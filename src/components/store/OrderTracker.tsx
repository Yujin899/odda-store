'use client';

import React from 'react';
import { 
  Check, 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';

type OrderStatus = 'pending_payment' | 'pending_verification' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderTrackerProps {
  status: OrderStatus;
}

const steps = [
  {
    id: 'placed',
    label: 'Order Placed',
    icon: Clock,
    statuses: ['pending_payment', 'pending_verification'],
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: Package,
    statuses: ['processing'],
  },
  {
    id: 'shipped',
    label: 'Shipped',
    icon: Truck,
    statuses: ['shipped'],
  },
  {
    id: 'delivered',
    label: 'Delivered',
    icon: CheckCircle2,
    statuses: ['delivered'],
  }
];

export function OrderTracker({ status }: OrderTrackerProps) {
  if (status === 'cancelled') {
    return (
      <div className="bg-red-50 border border-red-100 rounded-(--radius) p-8 text-center space-y-4 shadow-sm">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <AlertCircle className="size-8" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-sm font-black uppercase tracking-tighter text-red-900 italic">Order Cancelled</h3>
          <p className="text-xs font-bold text-red-700/70 uppercase tracking-widest leading-relaxed">
            This order has been cancelled and will not be processed further.
          </p>
        </div>
      </div>
    );
  }

  const foundIndex = steps.findIndex(step => step.statuses.includes(status));
  const activeIndex = foundIndex === -1 ? 0 : foundIndex;

  return (
    <div className="w-full py-8 px-4">
      <div className="relative flex flex-col sm:flex-row justify-between items-start max-w-3xl mx-auto ps-8 sm:ps-0 sm:pe-0">
        {/* Background Line */}
        <div className="absolute top-0 bottom-0 inset-s-[1.4rem] w-[2px] sm:w-full sm:h-[2px] sm:top-6 sm:inset-s-0 sm:bottom-auto bg-slate-100 -z-10 rounded-full"></div>
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute top-0 inset-s-[1.4rem] w-[2px] sm:w-[2px] sm:h-[2px] sm:top-6 sm:inset-s-0 sm:bottom-auto bg-primary -z-10 rounded-full shadow-[0_0_10px_rgba(0,115,230,0.3)]"
          initial={{ height: "0%", width: "0%" }}
          animate={{ 
            height: typeof window !== 'undefined' && window.innerWidth < 640 ? `${(activeIndex / (steps.length - 1)) * 100}%` : "100%",
            width: typeof window !== 'undefined' && window.innerWidth >= 640 ? `${(activeIndex / (steps.length - 1)) * 100}%` : "100%"
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-row sm:flex-col items-center gap-4 relative group w-full sm:w-auto mb-8 sm:mb-0">
              {/* Step Circle */}
              <motion.div 
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted || isActive ? "var(--primary)" : "#fff",
                  borderColor: isCompleted || isActive ? "var(--primary)" : "#e2e8f0",
                  color: isCompleted || isActive ? "#fff" : "#94a3b8"
                }}
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                  isActive ? "ring-4 ring-primary/10 shadow-lg" : ""
                }`}
              >
                {isCompleted ? (
                  <Check className="size-6 stroke-[3.5px]" />
                ) : isActive && status === 'pending_verification' ? (
                   <Loader2 className="size-6 animate-spin stroke-[2.5px]" />
                ) : (
                  <Icon className={`size-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-[2px]'}`} />
                )}
              </motion.div>

              {/* Label */}
              <div className="text-start sm:text-center space-y-1 mt-0 sm:mt-1 flex-1">
                <p className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                  isCompleted || isActive ? 'text-foreground' : 'text-slate-400'
                }`}>
                  {step.label}
                </p>
                {isActive && (
                  <motion.p 
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[8px] font-bold text-primary uppercase tracking-widest"
                  >
                    Current Status
                  </motion.p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
