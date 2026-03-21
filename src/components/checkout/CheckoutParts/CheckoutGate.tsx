'use client';

import { User, ShoppingBag, ArrowRight } from 'lucide-react';
import { Dictionary } from '@/types/store';
import { useLanguageStore } from '@/store/useLanguageStore';
import Link from 'next/link';
import { Session } from 'next-auth';
import { Button } from '@/components/ui/button';

interface CheckoutGateProps {
  dict: Dictionary;
  session: Session | null;
  onNext: () => void;
}

export function CheckoutGate({ dict, session, onNext }: CheckoutGateProps) {
  const { language } = useLanguageStore();
  const isRtl = language === 'ar';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {session ? (
        <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm text-center max-w-lg mx-auto">
          <div className="size-16 bg-(--primary)/10 text-(--primary) rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="size-8 stroke-[1.5px]" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-foreground mb-2">
            {isRtl ? `مرحباً بك مجدداً، ${session.user?.name}` : `Welcome back, ${session.user?.name}`}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8">
            {dict?.checkoutPage?.authDesc || 'You are signed in and ready to proceed.'}
          </p>
          <Button 
            onClick={onNext}
            variant="secondary"
            className="w-full h-14 font-black rounded-sm uppercase tracking-[0.2em] text-[10px] shadow-xl transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              {dict.checkoutPage.proceedShipping}
              <ArrowRight className={bcn("size-4", isRtl ? "rotate-180" : "")} />
            </span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Guest Checkout Option */}
          <div className="bg-white p-8 rounded-sm border border-slate-200 shadow-sm flex flex-col items-center text-center group hover:border-(--primary)/30 transition-colors">
            <div className="size-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-(--primary)/10 group-hover:text-(--primary) transition-colors">
              <ShoppingBag className="size-6 stroke-[1.5px]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-2">
              {dict.checkoutPage.guestCheckout || 'Guest Checkout'}
            </h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-8 leading-relaxed">
              {dict.checkoutPage.guestDesc || 'Proceed without an account. You can create one later.'}
            </p>
            <Button 
              variant="outline"
              onClick={onNext}
              className="mt-auto w-full h-12 rounded-sm border-slate-200 font-black uppercase tracking-[0.15em] text-[9px] hover:bg-slate-50"
            >
              {dict.checkoutPage.continueAsGuest || 'Continue as Guest'}
            </Button>
          </div>

          {/* Sign In Option */}
          <div className="bg-(--navy) p-8 rounded-sm border border-(--navy) shadow-xl flex flex-col items-center text-center">
            <div className="size-12 bg-white/10 text-white rounded-full flex items-center justify-center mb-6">
              <User className="size-6 stroke-[1.5px]" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-2">
              {dict.checkoutPage.signIn || 'Sign In'}
            </h3>
            <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-8 leading-relaxed">
              {dict.checkoutPage.signInDesc || 'Sign in for faster checkout and to track your orders easily.'}
            </p>
            <Button
              asChild
              className="mt-auto w-full h-12 bg-white text-(--navy) flex items-center justify-center font-black rounded-sm uppercase tracking-[0.15em] text-[10px] hover:bg-(--primary) hover:text-white transition-all shadow-lg"
            >
              <Link href={`/login?callbackUrl=/checkout`}>
                {dict.checkoutPage.loginNow || 'Log In Now'}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
