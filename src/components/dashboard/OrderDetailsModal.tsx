'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/store/useToastStore';
import { Loader2, Package, MapPin, CreditCard, ExternalLink } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import Image from 'next/image';

interface OrderDetailsModalProps {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  focusPayment?: boolean;
}

export function OrderDetailsModal({ orderId, isOpen, onClose, focusPayment = false }: OrderDetailsModalProps) {
  const paymentSectionRef = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const router = useRouter();

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
       console.error('Failed to fetch settings:', error);
    }
  }, []);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error(dict.toasts.failedToLoadOrder);
    } finally {
      setLoading(false);
    }
  }, [orderId, dict.toasts.failedToLoadOrder]);

  useEffect(() => {
    if (isOpen) {
      fetchOrder();
      fetchSettings();
    }
  }, [isOpen, orderId, fetchOrder, fetchSettings]);

  const currentInstapayNumber = settings?.instapayNumber || "01126131495";

  useEffect(() => {
    if (isOpen && !loading && focusPayment) {
      setTimeout(() => {
        paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [isOpen, loading, focusPayment]);

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(dict.toasts.orderStatusUpdated);
        setOrder({ ...order, status: newStatus });
        router.refresh();
      } else {
        toast.error(dict.toasts.failedToUpdateStatus);
      }
    } catch {
      toast.error(dict.toasts.somethingWentWrong);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-2xl max-h-[85vh] overflow-y-auto pt-10" 
        dir={language === 'ar' ? 'rtl' : 'ltr'}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{dict.dashboard.ordersPage.modal.title} - {orderId}</DialogTitle>
          <DialogDescription>
            Detailed view of order items, customer info, and payment details.
          </DialogDescription>
        </DialogHeader>

        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Package className="size-5 text-(--primary)" />
              {dict.dashboard.ordersPage.modal.title} #{order?.orderNumber?.slice(-6)}
            </DialogTitle>
            {order && (
              <Select 
                defaultValue={order.status} 
                onValueChange={updateStatus}
                disabled={updating}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-8 text-xs font-bold uppercase tracking-widest">
                  <SelectValue placeholder={dict.dashboard.ordersPage.modal.updateStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending_payment">{dict.dashboard.statuses.pending_payment}</SelectItem>
                  <SelectItem value="pending_verification">{dict.dashboard.statuses.pending_verification}</SelectItem>
                  <SelectItem value="processing">{dict.dashboard.statuses.processing}</SelectItem>
                  <SelectItem value="shipped">{dict.dashboard.statuses.shipped}</SelectItem>
                  <SelectItem value="delivered">{dict.dashboard.statuses.delivered}</SelectItem>
                  <SelectItem value="cancelled">{dict.dashboard.statuses.cancelled}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogDescription className={language === 'ar' ? 'text-end' : 'text-start'}>
            {order ? `${dict.dashboard.ordersPage.modal.createdOn} ${new Date(order.createdAt).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}` : dict.dashboard.ordersPage.modal.loading}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-(--primary)" />
          </div>
        ) : order ? (
          <div className="space-y-6 pt-4">
            {/* Customer & Address */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-(--navy)/50 flex items-center gap-1">
                  <MapPin className="size-3" />
                  {dict.dashboard.ordersPage.modal.shippingAddress}
                </div>
                <div className="text-sm border p-3 rounded-sm bg-slate-50/50">
                  <p className="font-bold">{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.city}</p>
                </div>
              </div>

              <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-widest text-(--navy)/50 flex items-center gap-1">
                  <CreditCard className="size-3" />
                  {dict.dashboard.ordersPage.modal.paymentInfo}
                </div>
                <div className="text-sm border p-4 rounded-sm bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{dict.dashboard.ordersPage.modal.method}</span>
                  <Badge variant="secondary" className="uppercase text-[10px] bg-slate-200 text-slate-700">
                    {(dict.dashboard.statuses as any)[order.paymentMethod] || order.paymentMethod}
                  </Badge>
                </div>
                
                {order.paymentMethod === 'InstaPay' && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">{dict.dashboard.ordersPage.modal.instapayNumber}</p>
                    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${language === 'ar' ? 'sm:flex-row-reverse' : ''}`}>
                      <span className="text-lg sm:text-xl font-black tracking-tight text-(--navy) break-all">{currentInstapayNumber}</span>
                      <Button 
                        variant="ghost" 
                        size="icon-sm"
                        className="self-end sm:self-auto"
                        onClick={() => {
                          navigator.clipboard.writeText(currentInstapayNumber);
                          toast.success(dict.toasts.success, dict.toasts.numberCopied);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">{dict.dashboard.ordersPage.modal.grandTotal}</span>
                  <span className="font-black text-lg text-(--primary)">{order.totalAmount.toLocaleString()} {dict.common.egp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/50">
              {dict.dashboard.ordersPage.modal.orderItems}
            </div>
            <div className="border rounded-sm divide-y">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className={`text-sm font-medium ${language === 'ar' ? 'font-cairo' : ''}`}>{item.productId?.nameAr && language === 'ar' ? item.productId.nameAr : (item.productId?.name || 'Loading product...')}</span>
                    <span className="text-[10px] text-muted-foreground">{dict.dashboard.ordersPage.modal.price}: {item.price.toLocaleString()} {dict.common.egp}</span>
                  </div>
                  <div className="text-sm font-bold">
                    x{item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Proof */}
          {order.paymentMethod === 'InstaPay' && order.paymentScreenshot && (
            <div className="space-y-3" ref={paymentSectionRef}>
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/50">
                  {dict.dashboard.ordersPage.modal.paymentProof}
                </div>
                <a 
                  href={order.paymentScreenshot} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-[10px] font-bold uppercase tracking-widest text-(--primary) flex items-center gap-1 hover:underline underline-offset-4"
                >
                  {dict.dashboard.ordersPage.modal.openOriginal}
                  <ExternalLink className="size-3" />
                </a>
              </div>
              <div className="relative aspect-video w-full rounded-sm overflow-hidden border bg-black/5">
                <Image 
                  src={order.paymentScreenshot} 
                  alt={dict.dashboard.ordersPage.modal.paymentProof} 
                  fill 
                  sizes="(max-width: 1200px) 100vw, 800px"
                  className="object-contain"
                  unoptimized={true}
                />
              </div>
            </div>
          )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            {dict.dashboard.ordersPage.modal.notFound}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
