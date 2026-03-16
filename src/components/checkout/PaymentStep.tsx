import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Banknote, QrCode, Landmark, Camera, Loader2, CheckCircle2 } from 'lucide-react';
import { useToastStore } from '@/store/useToastStore';

interface PaymentStepProps {
  dict: any;
  paymentMethod: 'cod' | 'instapay';
  setPaymentMethod: (method: 'cod' | 'instapay') => void;
  instapayNumber: string;
  uploadedProofUrl: string;
  setUploadedProofUrl: (url: string) => void;
  isSubmitting: boolean;
  handleSubmitOrder: () => void;
  handleBack: () => void;
}

import { uploadImage } from '@/lib/upload';

export const PaymentStep: React.FC<PaymentStepProps> = ({
  dict,
  paymentMethod,
  setPaymentMethod,
  instapayNumber,
  uploadedProofUrl,
  setUploadedProofUrl,
  isSubmitting,
  handleSubmitOrder,
  handleBack,
}) => {
  const { addToast } = useToastStore();
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);

  const handleScreenshotChange = async (file: File | null) => {
    if (!file) {
      setScreenshot(null);
      setUploadedProofUrl('');
      return;
    }

    setScreenshot(file);
    setIsUploadingScreenshot(true);

    try {
      const data = await uploadImage(file, 'odda/payments');
      setUploadedProofUrl(data.url);
    } catch (error) {
      addToast({
        title: dict.toasts.uploadFailed,
        description: dict.toasts.errorUploading,
        type: 'error',
      });
      setScreenshot(null);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  return (
    <motion.div
      key="payment"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="bg-white border border-slate-100 rounded-(--radius) shadow-xl p-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8">{dict.checkoutPage.choosePayment}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div
            onClick={() => setPaymentMethod('cod')}
            className={`p-6 border-2 rounded-(--radius) cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'cod' ? 'border-(--primary) bg-(--primary)/5' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <Banknote className={`size-6 ${paymentMethod === 'cod' ? 'text-(--primary)' : 'text-slate-300'} stroke-[2px]`} />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest">{dict.checkoutPage.cod}</h4>
              <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">{dict.checkoutPage.codDesc}</p>
            </div>
          </div>
          <div
            onClick={() => setPaymentMethod('instapay')}
            className={`p-6 border-2 rounded-(--radius) cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'instapay' ? 'border-(--primary) bg-(--primary)/5' : 'border-slate-100 hover:border-slate-200'}`}
          >
            <QrCode className={`size-6 ${paymentMethod === 'instapay' ? 'text-(--primary)' : 'text-slate-300'} stroke-[2px]`} />
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest">{dict.checkoutPage.instapay}</h4>
              <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">{dict.checkoutPage.instapayDesc}</p>
            </div>
          </div>
        </div>

        {paymentMethod === 'instapay' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-50 border border-slate-100 rounded-(--radius) p-6 space-y-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm shrink-0">
                  <Landmark className="size-6 text-(--primary) stroke-[2px]" />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{dict.checkoutPage.sendTo}</p>
                  <p className="text-xl sm:text-2xl font-black text-foreground tracking-tighter break-all">{instapayNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(instapayNumber);
                  addToast({ title: dict.toasts.success, description: dict.toasts.numberCopied, type: 'success' });
                }}
                className="size-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-white hover:text-(--primary) hover:border-(--primary) transition-all text-slate-400 self-end sm:self-auto shrink-0 bg-transparent cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-wide">{dict.checkoutPage.uploadNote}</p>
              <div className="relative">
                {screenshot ? (
                  <div className="relative w-full h-48 rounded-(--radius) overflow-hidden border border-slate-200">
                    {isUploadingScreenshot ? (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                        <Loader2 className="animate-spin size-8 text-(--primary) stroke-[2.5px] mb-2" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Uploading...</span>
                      </div>
                    ) : null}
                    <Image 
                      src={URL.createObjectURL(screenshot)} 
                      fill 
                      className="object-cover" 
                      alt="Payment Screenshot" 
                      unoptimized
                    />
                    <button 
                      onClick={() => handleScreenshotChange(null)}
                      className="absolute top-2 end-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-all z-20 outline-none border-none cursor-pointer flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleScreenshotChange(e.target.files?.[0] || null)}
                      className="hidden"
                      id="screenshot-upload"
                    />
                    <label
                      htmlFor="screenshot-upload"
                      className="w-full h-32 border-2 border-dashed border-slate-200 rounded-(--radius) flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white hover:border-(--primary) transition-all"
                    >
                      <Camera className="size-6 text-muted-foreground stroke-[2px]" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{dict.checkoutPage.uploadScreenshot}</span>
                    </label>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex gap-4">
        <button onClick={handleBack} className="w-32 h-16 bg-white border border-slate-100 text-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) hover:bg-slate-50 transition-all cursor-pointer outline-none">{dict.checkoutPage.back}</button>
        <button 
          disabled={isSubmitting || isUploadingScreenshot || (paymentMethod === 'instapay' && !uploadedProofUrl)}
          onClick={handleSubmitOrder} 
          className={`flex-1 min-h-16 py-4 px-6 font-black text-xs md:text-sm uppercase tracking-[0.2em] rounded-(--radius) shadow-2xl transition-all transform active:scale-95 cursor-pointer outline-none border-none flex items-center justify-center gap-3 text-center leading-tight whitespace-normal ${
            isSubmitting || isUploadingScreenshot || (paymentMethod === 'instapay' && !uploadedProofUrl)
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-(--primary) text-white hover:bg-foreground hover:-translate-y-1'
          }`}
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin size-5 stroke-[2.5px]" />
          ) : (
            <>
              <CheckCircle2 className="size-5 stroke-[2.5px] shrink-0" />
              <span>{dict.checkoutPage.completeOrder}</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
