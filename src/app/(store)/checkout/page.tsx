'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Added Image import
import { 
  ShoppingBasket, 
  Truck,
  Banknote,
  QrCode,
  Landmark,
  Camera,
  CheckCircle2,
  ShoppingCart,
  User,
  Check,
  WalletCards,
  Loader2
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

type Step = 'gate' | 'summary' | 'shipping' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCartStore();
  const { addToast } = useToastStore();

  const [step, setStep] = useState<Step>('gate');
  const [isGuest, setIsGuest] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'instapay'>('cod');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, status } = useSession();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: 'Cairo',
    email: '',
  });

  const [uploadedProofUrl, setUploadedProofUrl] = useState('');
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  // Fetch settings
  React.useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings);
  }, []);

  const currentInstapayNumber = settings?.instapayNumber || "01126131495";
  const currentShippingFee = settings?.shippingFee || 0;
  const grandTotal = totalAmount + currentShippingFee;

  // Handle Authentication & Skip Gate
  React.useEffect(() => {
    if (status === 'authenticated' && session?.user && step === 'gate') {
      setStep('summary');
      setFormData(prev => ({
        ...prev,
        fullName: session.user.name || '',
        email: session.user.email || '',
      }));
    }
  }, [status, session, step]);

  if (items.length === 0 && step !== 'payment') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <ShoppingBasket className="size-16 text-muted-foreground/20 mb-4 stroke-[1.5px]" />
        <h2 className="text-xl font-bold uppercase tracking-tight text-foreground">Your cart is empty</h2>
        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-2">Add some clinical tools before checking out</p>
        <Link href="/products" className="mt-8 px-10 py-4 bg-foreground text-background font-black rounded-(--radius) uppercase tracking-[0.2em] text-[10px] shadow-2xl hover:-translate-y-1 transition-all">Go To Catalog</Link>
      </div>
    );
  }

  const handleNext = () => {
    if (step === 'gate') setStep('summary');
    else if (step === 'summary') setStep('shipping');
    else if (step === 'shipping') {
      // Validate shipping fields
      if (!formData.fullName || !formData.phone || !formData.address || !formData.email) {
        addToast({
          title: 'Missing Information',
          description: 'Please fill in all shipping details, including your email.',
          type: 'error',
        });
        return;
      }
      setStep('payment');
    }
  };

  const handleBack = () => {
    if (step === 'summary') setStep('gate');
    else if (step === 'shipping') setStep('summary');
    else if (step === 'payment') setStep('shipping');
  };

  const handleScreenshotChange = async (file: File | null) => {
    if (!file) {
      setScreenshot(null);
      setUploadedProofUrl('');
      return;
    }

    setScreenshot(file);
    setIsUploadingScreenshot(true);

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('folder', 'odda/payments');

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      setUploadedProofUrl(data.url);
    } catch (error) {
      addToast({
        title: 'Upload Error',
        description: 'Failed to upload screenshot. Please try again.',
        type: 'error',
      });
      setScreenshot(null);
    } finally {
      setIsUploadingScreenshot(false);
    }
  };

  const handleSubmitOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // 1. Place order (Screenshot already uploaded or COD)
      const orderBody = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          email: formData.email,
        },
        items: items.map(item => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        totalAmount: grandTotal, // Use grand total with shipping fee
        paymentMethod: paymentMethod === 'cod' ? 'COD' : 'InstaPay',
        paymentProof: uploadedProofUrl,
      };

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderBody),
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || 'Failed to place order');
      }

      const orderData = await orderRes.json();

      addToast({
        title: 'Order Placed Successfully! 📧',
        description: 'Please check your email for your receipt and tracking link.',
        type: 'success',
      });

      clearCart();
      router.push(`/order-confirmation?id=${orderData.id}`);
    } catch (error: any) {
      addToast({
        title: 'Checkout Error',
        description: error.message || 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20">
        {/* Header */}
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Secure Checkout</h1>

          {/* Progress Bar */}
          <div className="flex items-center w-full max-w-md relative px-4">
            <div className="absolute top-5 left-0 w-full h-[2px] bg-slate-100 -z-10"></div>
            <div
              className="absolute top-5 left-0 h-[2px] bg-(--primary) transition-all duration-500 -z-10"
              style={{ width: step === 'gate' ? '0%' : step === 'summary' ? '33.33%' : step === 'shipping' ? '66.66%' : '100%' }}
            ></div>

            <div className="flex justify-between w-full">
              {[
                { id: 'gate', icon: User, label: 'Auth' },
                { id: 'summary', icon: ShoppingCart, label: 'Cart' },
                { id: 'shipping', icon: Truck, label: 'Info' },
                { id: 'payment', icon: WalletCards, label: 'Finish' }
              ].map((s, idx) => {
                const isCompleted = idx < ['gate', 'summary', 'shipping', 'payment'].indexOf(step);
                const isActive = step === s.id;
                const Icon = s.icon;

                return (
                  <div key={s.id} className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive ? 'bg-(--primary) border-(--primary) text-white shadow-lg scale-110' :
                      (isCompleted ? 'bg-white border-(--primary) text-(--primary)' : 'bg-white border-slate-200 text-slate-300')
                    }`}>
                      {isCompleted ? <Check className="size-5 stroke-[3px]" /> : <Icon className="size-5 stroke-[2.5px]" />}
                    </div>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{s.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <AnimatePresence mode="wait">
            {step === 'gate' && (
              <motion.div
                key="gate"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-md mx-auto w-full space-y-8 py-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-black uppercase tracking-tight italic">How would you like to checkout?</h2>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest px-8 leading-relaxed">Choose an option below to proceed with your clinical {isGuest ? 'guest ' : ''}order.</p>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => { setIsGuest(true); handleNext(); }}
                    className="w-full h-16 bg-white border-2 border-slate-100 text-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) shadow-sm hover:border-(--primary) hover:bg-slate-50 transition-all cursor-pointer outline-none"
                  >
                    Continue as Guest
                  </button>
                  <div className="relative flex items-center justify-center py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <span className="relative bg-background px-3 text-[9px] font-black uppercase tracking-widest text-slate-300">or</span>
                  </div>
                  <button
                    onClick={() => router.push('/login?redirect=/checkout')}
                    className="w-full h-16 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all active:scale-95 cursor-pointer outline-none border-none"
                  >
                    Sign In to Account
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'summary' && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white border border-slate-100 rounded-(--radius) shadow-xl overflow-hidden">
                  <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em]">Order Summary</h2>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {items.map((item) => (
                      <div key={item.id} className="p-6 flex items-center gap-6">
                        <div className="w-16 h-16 bg-muted rounded-sm overflow-hidden shrink-0 border border-slate-100 relative">
                          <Image src={item.image} fill className="object-cover" alt={item.name} />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-black uppercase tracking-tight">{item.name}</h4>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-xs font-black">{(item.price * item.quantity).toLocaleString()} EGP</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 bg-slate-50/50 space-y-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Subtotal</span>
                      <span>{totalAmount.toLocaleString()} EGP</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>Shipping</span>
                      {currentShippingFee === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        <span>{currentShippingFee.toLocaleString()} EGP</span>
                      )}
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                      <span className="text-xs font-black uppercase tracking-widest">Total</span>
                      <span className="text-xl font-black">{grandTotal.toLocaleString()} EGP</span>
                    </div>
                  </div>
                </div>
                <button onClick={handleNext} className="w-full h-16 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all active:scale-95 cursor-pointer outline-none border-none">Proceed to Shipping</button>
              </motion.div>
            )}

            {step === 'shipping' && (
              <motion.div
                key="shipping"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white border border-slate-100 rounded-(--radius) shadow-xl p-8 space-y-6">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">Full Name</label>
                       <input
                         type="text"
                         value={formData.fullName}
                         onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                         className="w-full h-12 bg-slate-50 border border-slate-100 rounded-(--radius) px-4 text-xs font-bold outline-none focus:border-(--primary) transition-all"
                         placeholder="Dr. Ahmed Ali"
                       />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-(--radius) px-4 text-xs font-bold outline-none focus:border-(--primary) transition-all"
                        placeholder="+20 123 456 7890"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">Delivery Address</label>
                       <input
                         type="text"
                         value={formData.address}
                         onChange={(e) => setFormData({...formData, address: e.target.value})}
                         className="w-full h-12 bg-slate-50 border border-slate-100 rounded-(--radius) px-4 text-xs font-bold outline-none focus:border-(--primary) transition-all"
                         placeholder="Campus, Lab Building, 3rd Floor"
                       />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                       <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">Email Address</label>
                       <input
                         type="email"
                         value={formData.email}
                         onChange={(e) => setFormData({...formData, email: e.target.value})}
                         className="w-full h-12 bg-slate-50 border border-slate-100 rounded-(--radius) px-4 text-xs font-bold outline-none focus:border-(--primary) transition-all"
                         placeholder="ahmed.ali@example.com"
                         required
                       />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground px-1">City</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="w-full h-12 bg-slate-50 border border-slate-100 rounded-(--radius) px-4 text-xs font-bold outline-none focus:border-(--primary) transition-all cursor-pointer appearance-none"
                      >
                        <option>Cairo</option>
                        <option>Giza</option>
                        <option>Alexandria</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={handleBack} className="w-32 h-16 bg-white border border-slate-100 text-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) hover:bg-slate-50 transition-all cursor-pointer outline-none">Back</button>
                  <button onClick={handleNext} className="flex-1 h-16 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all active:scale-95 cursor-pointer outline-none border-none">Next: Payment</button>
                </div>
              </motion.div>
            )}

            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white border border-slate-100 rounded-(--radius) shadow-xl p-8">
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] mb-8">Choose Payment Method</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-6 border-2 rounded-(--radius) cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'cod' ? 'border-(--primary) bg-(--primary)/5' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <Banknote className={`size-6 ${paymentMethod === 'cod' ? 'text-(--primary)' : 'text-slate-300'} stroke-[2px]`} />
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Cash on Delivery</h4>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">Pay at your doorstep</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('instapay')}
                      className={`p-6 border-2 rounded-(--radius) cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'instapay' ? 'border-(--primary) bg-(--primary)/5' : 'border-slate-100 hover:border-slate-200'}`}
                    >
                      <QrCode className={`size-6 ${paymentMethod === 'instapay' ? 'text-(--primary)' : 'text-slate-300'} stroke-[2px]`} />
                      <div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Instapay Transfer</h4>
                        <p className="text-[9px] text-muted-foreground font-bold uppercase mt-1">Secure bank transfer</p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'instapay' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-50 border border-slate-100 rounded-(--radius) p-6 space-y-6"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-slate-100 shadow-sm">
                            <Landmark className="size-6 text-(--primary) stroke-[2px]" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">Send to address</p>
                            <p className="text-2xl font-black text-foreground tracking-tighter">{currentInstapayNumber}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(currentInstapayNumber);
                            addToast({ title: 'Success', description: 'Number copied successfully', type: 'success' });
                          }}
                          className="size-10 rounded-full border border-slate-100 flex items-center justify-center hover:bg-white hover:text-(--primary) hover:border-(--primary) transition-all text-slate-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                      </div>

                      <div className="space-y-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed tracking-wide">Please upload a screenshot of your transfer confirmation to fulfill the order.</p>
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
                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-all z-20 outline-none border-none cursor-pointer flex items-center justify-center"
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Upload Screenshot</span>
                              </label>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-4">
                  <button onClick={handleBack} className="w-32 h-16 bg-white border border-slate-100 text-foreground font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) hover:bg-slate-50 transition-all cursor-pointer outline-none">Back</button>
                  <button 
                    disabled={isSubmitting || isUploadingScreenshot || (paymentMethod === 'instapay' && !uploadedProofUrl)}
                    onClick={handleSubmitOrder} 
                    className={`flex-1 h-16 font-black text-[10px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl transition-all transform active:scale-95 cursor-pointer outline-none border-none flex items-center justify-center gap-3 ${
                      isSubmitting || isUploadingScreenshot || (paymentMethod === 'instapay' && !uploadedProofUrl)
                        ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                        : 'bg-(--primary) text-white hover:bg-foreground hover:-translate-y-1'
                    }`}
                  >
                    {isSubmitting ? (
                      <Loader2 className="animate-spin size-5 stroke-[2.5px]" />
                    ) : (
                      <>
                        <CheckCircle2 className="size-5 stroke-[2.5px]" />
                        Complete Order
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
