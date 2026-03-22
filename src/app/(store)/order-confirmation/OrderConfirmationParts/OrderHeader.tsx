'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OrderHeaderProps {
  orderNumber: string;
  createdAt: string;
}

export function OrderHeader({ orderNumber, createdAt }: OrderHeaderProps) {
  const { language } = useLanguageStore();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isAr = language === 'ar';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-100 p-8 rounded-(--radius) shadow-xl relative overflow-hidden text-center space-y-6"
    >
      <div className="absolute top-0 inset-s-0 w-full h-1.5 bg-primary"></div>
      
      <div className="flex justify-center">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shadow-lg border border-emerald-100"
        >
          <CheckCircle2 className="size-10 stroke-[2px]" />
        </motion.div>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-navy">
          {isAr ? 'تم تأكيد طلبك!' : 'ORDER CONFIRMED!'}
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
          {isAr 
            ? 'شكراً لثقتك في عُدّة. لقد أرسلنا تفاصيل طلبك إلى بريدك الإلكتروني.' 
            : "Thank you for choosing Odda. We've sent a confirmation email with your order details."}
        </p>

        <div className="flex flex-col items-center gap-3 pt-4">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              {isAr ? 'رقم الطلب:' : 'ORDER ID:'}
            </span>
            <code className="text-xs font-black text-navy tracking-tight">{orderNumber}</code>
            <Button 
              variant="ghost"
              size="icon"
              onClick={copyToClipboard}
              className="ms-2 size-7 p-1 hover:bg-white hover:shadow-sm rounded-full transition-all text-muted-foreground hover:text-primary active:scale-90"
              title={isAr ? 'نسخ' : 'Copy'}
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.div
                    key="check"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Check className="size-3.5 text-emerald-600" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="copy"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                  >
                    <Copy className="size-3.5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
          
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
            {isAr ? 'بتاريخ' : 'PLACED ON'} {formatDate(createdAt, language as 'en' | 'ar')}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
