'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, ChevronRight, AlertCircle, ShoppingBag } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';

interface IOrderItem {
  name: string;
  nameAr?: string;
  variant?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface IOrder {
  _id: string;
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  items: IOrderItem[];
}

interface OrdersListProps {
  orders: IOrder[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;
  const isRtl = language === 'ar';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-(--success)/10 text-(--success)';
      case 'pending_payment':
      case 'pending_verification': return 'bg-(--warning)/10 text-(--warning)';
      case 'processing':
      case 'shipped': return 'bg-(--primary)/10 text-(--primary)';
      case 'cancelled': return 'bg-(--danger)/10 text-(--danger)';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getLocalizedStatus = (status: string) => {
    return dict.dashboard.statuses[status as keyof typeof dict.dashboard.statuses] || status;
  };

  if (orders.length === 0) {
    return (
      <div className="bg-card border border-border p-12 rounded-(--radius) text-center space-y-4">
        <Package className="size-12 text-muted-foreground mx-auto stroke-[1.5px]" />
        <h2 className="text-xl font-bold">{dict.orders.noOrders}</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          {dict.orders.noOrdersDesc}
        </p>
        <Link 
          href="/products"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) mt-4 hover:-translate-y-0.5 transition-all"
        >
          {dict.orders.browseProducts}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id.toString()} className="bg-card border border-border rounded-(--radius) overflow-hidden shadow-sm hover:shadow-md transition-all">
          {/* Order Header */}
          <div className="bg-muted p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
            <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
              <div>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">{dict.orders.orderNumber}</p>
                <p className="font-semibold font-mono">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">{dict.orders.date}</p>
                <p className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">{dict.orders.total}</p>
                <p className="font-semibold">{order.totalAmount.toLocaleString()} {dict.common.egp}</p>
              </div>
            </div>
            
            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center justify-center ${getStatusColor(order.status)} shrink-0`}>
              {getLocalizedStatus(order.status)}
            </div>
          </div>

          {/* Order Items */}
          <div className="p-4 sm:px-6">
            <div className="space-y-4">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 text-sm">
                  <div className="size-16 relative rounded overflow-hidden border border-border shrink-0 bg-slate-50">
                    {item.image ? (
                      <Image 
                        src={item.image} 
                        alt={isRtl && item.nameAr ? item.nameAr : item.name} 
                        fill 
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ShoppingBag className="size-6 stroke-[1.5px]" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate uppercase text-xs tracking-tight">
                      {isRtl && item.nameAr ? item.nameAr : item.name}
                    </h4>
                    {item.variant && <p className="text-[10px] text-muted-foreground font-medium uppercase mt-0.5">{item.variant}</p>}
                    <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">
                      {dict.orders.qtyShort}: {item.quantity}
                    </p>
                  </div>
                  <div className="text-end shrink-0">
                    <p className="text-xs font-black">{(item.price * item.quantity).toLocaleString()} {dict.common.egp}</p>
                  </div>
                </div>
              ))}
            </div>

            {(order.status === 'pending_payment' || order.status === 'pending') && (
              <div className="mt-6 flex items-start gap-3 text-xs text-(--warning) bg-(--warning)/5 p-4 rounded-(--radius) border border-(--warning)/20">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed font-medium">
                  {dict.orders.pendingPaymentNote}
                </p>
              </div>
            )}

            <div className={`mt-6 flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
              <Link 
                href={`/order-tracking?order=${order.orderNumber}`}
                className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-(--primary) hover:underline group"
              >
                {dict.orders.viewDetails}
                <ChevronRight className={`size-3 transition-transform ${isRtl ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
