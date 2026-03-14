import React from 'react';
import { motion } from 'framer-motion';
import { User, LogIn, UserPlus } from 'lucide-react';

interface CheckoutGateProps {
  dict: any;
  setIsGuest: (val: boolean) => void;
  handleNext: () => void;
  onSignIn: () => void;
}

export const CheckoutGate: React.FC<CheckoutGateProps> = ({
  dict,
  setIsGuest,
  handleNext,
  onSignIn,
}) => {
  return (
    <motion.div
      key="gate"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-md mx-auto w-full space-y-8 py-8"
    >
      <div className="text-center space-y-4">
        <h2 className="text-xl font-black uppercase tracking-tight italic">{dict.checkoutPage.howToCheckout}</h2>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest px-8 leading-relaxed">{dict.checkoutPage.chooseOption}</p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => { setIsGuest(true); handleNext(); }}
          className="w-full h-16 bg-white border-2 border-slate-100 text-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) shadow-sm hover:border-(--primary) hover:bg-slate-50 transition-all cursor-pointer outline-none flex items-center justify-center gap-3"
        >
          <UserPlus className="size-4 stroke-[2.5px]" />
          {dict.checkoutPage.guestCheckout}
        </button>
        <div className="relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <span className="relative bg-background px-3 text-[9px] font-black uppercase tracking-widest text-slate-300">{dict.checkoutPage.or}</span>
        </div>
        <button
          onClick={onSignIn}
          className="w-full h-16 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all active:scale-95 cursor-pointer outline-none border-none flex items-center justify-center gap-3"
        >
          <LogIn className="size-4 stroke-[2.5px]" />
          {dict.checkoutPage.signIn}
        </button>
      </div>
    </motion.div>
  );
};
