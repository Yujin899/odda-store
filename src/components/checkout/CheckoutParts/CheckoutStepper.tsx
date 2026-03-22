'use client';

import { Check, User, ShoppingCart, Truck, WalletCards } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface CheckoutStepperProps {
  currentStep: number;
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const isRtl = language === 'ar';

  const steps = [
    { id: 'gate', icon: User, label: dict.checkoutPage.auth },
    { id: 'summary', icon: ShoppingCart, label: dict.checkoutPage.cart },
    { id: 'shipping', icon: Truck, label: dict.checkoutPage.info },
    { id: 'payment', icon: WalletCards, label: dict.checkoutPage.finish }
  ];

  return (
    <div className="flex items-center w-full max-w-md relative px-4">
      {/* Background Line */}
      <div className="absolute top-5 inset-x-0 h-[2px] bg-slate-100 -z-10 mx-6"></div>
      
      {/* Active Progress Line (Logical Properties) */}
      <div
        className="absolute top-5 inset-s-6 h-[2px] bg-primary transition-all duration-500 -z-10"
        style={{ 
          width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 3rem)`
        }}
      ></div>

      <div className="flex justify-between w-full">
        {steps.map((s, idx) => {
          const isCompleted = idx < currentStep;
          const isActive = currentStep === idx;
          const Icon = s.icon;

          return (
            <div key={s.id} className="flex flex-col items-center gap-2">
              <div className={bcn(
                "size-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                isActive ? 'bg-primary border-primary text-white shadow-lg scale-110' :
                (isCompleted ? 'bg-white border-primary text-primary' : 'bg-white border-slate-200 text-slate-300')
              )}>
                {isCompleted ? (
                   <Check className="size-5 stroke-[3px]" />
                ) : (
                   <Icon className={bcn("size-5 stroke-[2.5px]", isActive ? "animate-pulse" : "")} />
                )}
              </div>
              <span className={bcn(
                "text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
                isActive ? 'text-foreground' : 'text-muted-foreground'
              )}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
