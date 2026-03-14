'use client';

import { motion } from 'framer-motion';
import { MessageCircle, MessageSquare, ExternalLink, ArrowRight } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';

export function CommunityCTA() {
  const { language } = useLanguageStore();
  const isAr = language === 'ar';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-(--navy) rounded-(--radius) shadow-2xl overflow-hidden relative group"
    >
      <div className="absolute top-0 inset-s-0 bottom-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_70%)]"></div>
      
      <div className="p-8 relative z-10 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-8 h-px bg-(--primary)"></span>
            <span className="text-[8px] font-black text-(--primary) uppercase tracking-[0.4em]">
              {isAr ? 'مجتمع طلاب الأسنان' : 'DENTAL STUDENT COMMUNITY'}
            </span>
          </div>
          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
            {isAr ? 'انضم لأسرة عُدّة (عدة)' : 'JOIN THE ODDA FAMILY'}
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
            {isAr 
              ? 'احصل على نصائح ما قبل العيادة، تحديثات الشحن، وعروض حصرية لزملائك الطلاب.' 
              : 'Get preclinical tips, shipping updates, and exclusive student-only offers.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <a 
            href="https://whatsapp.com" 
            target="_blank" 
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all group/btn"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 text-emerald-500 rounded-xl flex items-center justify-center">
                <MessageCircle className="size-5" />
              </div>
              <div className="text-start">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">WhatsApp</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase">{isAr ? 'مجتمع الدعم' : 'Support Group'}</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-emerald-500 transition-transform group-hover/btn:translate-s-1 rtl:-scale-x-100" />
          </a>

          <a 
            href="https://discord.com" 
            target="_blank" 
            className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-indigo-500/20 hover:border-indigo-500/50 transition-all group/btn"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/20 text-indigo-500 rounded-xl flex items-center justify-center">
                <MessageSquare className="size-5" />
              </div>
              <div className="text-start">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">Discord</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase">{isAr ? 'نصائح دراسية' : 'Study Tips'}</p>
              </div>
            </div>
            <ArrowRight className="size-4 text-indigo-500 transition-transform group-hover/btn:translate-s-1 rtl:-scale-x-100" />
          </a>
        </div>
      </div>
    </motion.div>
  );
}
