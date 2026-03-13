'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { OrderTracker } from '@/components/store/OrderTracker';
import { Search, Package, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialOrderId = searchParams.get('order') || '';
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputVal, setInputVal] = useState(initialOrderId);
  const [orderId, setOrderId] = useState(initialOrderId);

  useEffect(() => {
    if (initialOrderId) {
      performTrack(initialOrderId);
    }
  }, [initialOrderId]);

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
            <h1 className="text-4xl font-black uppercase tracking-tighter">Order Tracking</h1>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em]">Monitor your shipment in real-time</p>
          </div>

          <form onSubmit={handleSearch} className="w-full max-w-md flex flex-col sm:flex-row gap-3 mt-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-(--primary) transition-colors" />
              <input 
                type="text" 
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter your Order ID (e.g. 69b3...)"
                className="w-full h-16 bg-white border-2 border-slate-100 rounded-(--radius) pl-12 pr-4 text-sm font-bold shadow-2xl focus:border-(--primary) transition-all outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="h-16 px-10 bg-foreground text-background font-black uppercase tracking-widest text-[10px] rounded-(--radius) hover:bg-(--primary) hover:text-white transition-all cursor-pointer disabled:opacity-50 shadow-2xl shrink-0"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : 'Track Order'}
            </button>
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
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Order ID</p>
                <p className="text-[10px] font-bold font-mono truncate">{order._id}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Customer</p>
                <p className="text-[10px] font-bold">{order.shippingAddress.fullName}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Total</p>
                <p className="text-[10px] font-bold">{order.totalAmount.toLocaleString()} EGP</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Method</p>
                <p className="text-[10px] font-bold uppercase">{order.paymentMethod}</p>
              </div>
            </div>
          </motion.div>
        ) : orderId && !loading && !error ? (
          <div className="text-center py-20 text-muted-foreground text-xs uppercase tracking-widest italic">
            No order data found for this ID.
          </div>
        ) : !orderId && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-20">
            <MapPin size={64} className="stroke-[1px]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Enter an ID to start tracking</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
       <div className="min-h-screen flex items-center justify-center bg-background">
         <Loader2 className="size-8 animate-spin text-(--primary)" />
       </div>
    }>
      <TrackingContent />
    </Suspense>
  );
}
