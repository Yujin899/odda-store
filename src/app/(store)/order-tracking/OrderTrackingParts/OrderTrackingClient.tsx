'use client';

import React, { useState } from 'react';
import { OrderTracker } from '@/components/store/OrderTracker';
import { Search, Package, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface OrderTrackingClientProps {
  initialOrder: any;
  initialOrderId: string;
  dict: any;
  language: 'en' | 'ar';
}

export function OrderTrackingClient({ initialOrder, initialOrderId, dict, language }: OrderTrackingClientProps) {
  const [order, setOrder] = useState<any>(initialOrder);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputVal, setInputVal] = useState(initialOrderId);
  const [orderId, setOrderId] = useState(initialOrderId);

  const performTrack = async (id: string) => {
    if (!id) return;
    setOrderId(id);
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`/api/orders/track/${id}`);
      if (!res.ok) throw new Error('Order not found');
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Failed to track order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performTrack(inputVal.trim());
  };

  return (
    <div className="bg-background min-h-screen text-foreground">
      <div className="max-w-4xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-6 mb-16">
          <div className="size-16 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary) shadow-inner border border-(--primary)/20">
            <Package size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black uppercase tracking-tighter">{dict.trackingPage.title}</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em]">{dict.trackingPage.subtitle}</p>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-8">
            <div className="relative flex-1 group">
              <Search className="absolute inset-s-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-(--primary) transition-colors" />
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={dict.trackingPage.placeholder}
                className="w-full h-16 bg-white border-2 border-slate-100 rounded-(--radius) ps-12 pe-4 text-sm font-bold shadow-2xl focus:border-(--primary) transition-all outline-none"
              />
            </div>
            <Button 
              type="submit"
              disabled={loading}
              className="h-16 px-10 bg-foreground text-background font-black uppercase tracking-widest text-[10px] rounded-sm hover:bg-(--primary) hover:text-white transition-all disabled:opacity-50 shadow-2xl shrink-0 border-none"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : dict.trackingPage.trackBtn}
            </Button>
          </form>
        </div>

        {error && (
          <div className="text-center py-10 text-red-600 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <AlertCircle className="size-4" />
            {error}
          </div>
        )}

        {order ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-100 rounded-(--radius) shadow-2xl overflow-hidden p-8"
          >
            <OrderTracker status={order.status} />
            <div className="mt-8 pt-8 border-t border-slate-50 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{dict.trackingPage.orderId}</p>
                <p className="text-[10px] font-bold font-mono truncate">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{dict.trackingPage.customer}</p>
                <p className="text-[10px] font-bold">{order.shippingAddress.fullName}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{dict.trackingPage.total}</p>
                <p className="text-[10px] font-bold">{order.totalAmount.toLocaleString()} {dict.common.egp}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">{dict.trackingPage.method}</p>
                <p className="text-[10px] font-bold uppercase">{order.paymentMethod}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-8 pt-8 border-t border-slate-50">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">{dict.trackingPage.orderItems} ({order.items?.length || 0})</p>
              <div className="space-y-4">
                {order.items?.map((item: any, idx: number) => {
                  const primaryImage = item.productId?.images?.find((img: any) => img.isPrimary)?.url || item.productId?.images?.[0]?.url || item.productId?.image;
                  return (
                    <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 bg-slate-50/50 rounded-sm border border-slate-100 group">
                      <div className="size-20 sm:size-20 bg-white rounded-sm overflow-hidden shrink-0 border border-slate-100 relative shadow-sm mx-auto sm:mx-0">
                        {primaryImage ? (
                          <img 
                            src={primaryImage} 
                            alt={item.productId?.name || 'Product'} 
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                             <Package size={24} strokeWidth={1.5} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 text-center sm:text-start">
                        <h4 className="text-xs font-black uppercase tracking-tight truncate text-foreground">{(language === 'ar' && item.productId?.nameAr) ? item.productId.nameAr : (item.productId?.name || 'Deleted Product')}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1 flex items-center justify-center sm:justify-start gap-2">
                          {dict.trackingPage.qty}: {item.quantity}
                          <span className="text-slate-200">|</span>
                          {item.price.toLocaleString()} {dict.common.egp} {dict.trackingPage.ea}
                        </p>
                      </div>
                      <div className="text-center sm:text-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                        <p className="text-sm font-black text-(--navy)">
                          {(item.price * item.quantity).toLocaleString()} 
                          <span className="text-[8px] uppercase tracking-widest text-muted-foreground ms-1">{dict.common.egp}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : orderId && !loading && !error ? (
          <div className="text-center py-20 text-muted-foreground text-xs uppercase tracking-widest italic">
            {dict.trackingPage.noOrderData}
          </div>
        ) : !orderId && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-20">
            <MapPin size={64} className="stroke-[1px]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">{dict.trackingPage.enterId}</p>
          </div>
        )}
      </div>
    </div>
  );
}
