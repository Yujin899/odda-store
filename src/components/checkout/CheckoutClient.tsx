'use client';

import React from 'react';
import { FormProvider } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Session } from 'next-auth';

import { CheckoutSettings } from './CheckoutTypes';
import { useCheckoutFlow } from '@/hooks/useCheckoutFlow';

// Form Parts
import { CheckoutStepper } from './CheckoutParts/CheckoutStepper';
import { EmptyCart } from './CheckoutParts/EmptyCart';
import { CheckoutGate } from './CheckoutParts/CheckoutGate';
import { OrderSummary } from './CheckoutParts/OrderSummary';
import { ShippingForm } from './CheckoutParts/ShippingForm';
import { PaymentStep } from './CheckoutParts/PaymentStep';
import { Button } from '@/components/ui/button';

interface CheckoutClientProps {
  dict: any;
  language: string;
  session: Session | null;
  settings: CheckoutSettings;
}

export function CheckoutClient({ dict, language, session, settings }: CheckoutClientProps) {
  const {
    methods,
    currentStep,
    isRtl,
    handleNext,
    handleBack,
    handleSubmit,
    itemsCount
  } = useCheckoutFlow(session, settings, dict, language);

  if (itemsCount === 0 && currentStep < 3) return <EmptyCart />;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="bg-background min-h-screen text-foreground font-sans">
        <div className="max-w-[1200px] mx-auto px-6 py-12 lg:py-20">
          
          <div className="flex flex-col items-center mb-16">
            <h1 className="text-3xl font-black uppercase tracking-tighter mb-8 bg-linear-to-r from-(--navy) to-(--primary) bg-clip-text text-transparent">
               {dict.checkoutPage.secureCheckout}
            </h1>
            <CheckoutStepper currentStep={currentStep} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {currentStep === 0 && (
                  <motion.div key="gate" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }}>
                     <CheckoutGate session={session} onNext={handleNext} />
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div key="summary" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }} className="space-y-8">
                     <div className="bg-white p-6 sm:p-10 rounded-sm border border-slate-200 shadow-sm">
                        <h2 className={bcn("text-xl font-black uppercase tracking-tight text-foreground mb-6", isRtl ? "text-end" : "text-start")}>
                          {dict.common.orderSummary}
                        </h2>
                        <div className="lg:hidden mb-8">
                           <OrderSummary shippingFee={settings?.shippingFee || 0} />
                        </div>
                        <Button 
                          type="button"
                          onClick={handleNext}
                          className="w-full h-16 bg-(--navy) hover:bg-(--primary) text-white font-black rounded-sm uppercase tracking-[0.3em] text-[10px] shadow-2xl transition-all active:scale-95"
                        >
                          {dict.checkoutPage.proceedShipping}
                        </Button>
                     </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="shipping" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }}>
                     <ShippingForm onNext={handleNext} onBack={handleBack} />
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="payment" initial={{ opacity: 0, x: isRtl ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 20 : -20 }}>
                     <PaymentStep instapayNumber={settings?.instapayNumber || "01126131495"} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:block lg:col-span-4">
              <OrderSummary shippingFee={settings?.shippingFee || 0} />
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
