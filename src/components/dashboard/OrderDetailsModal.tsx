'use client';

import { useState, useEffect, useRef } from 'react';
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
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToastStore, toast } from '@/store/useToastStore';
import { Loader2, Package, MapPin, CreditCard, ExternalLink } from 'lucide-react';
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
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchOrder();
      fetchSettings();
    }
  }, [isOpen, orderId]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
      }
    } catch (error) {
       console.error('Failed to fetch settings:', error);
    }
  };

  const currentInstapayNumber = settings?.instapayNumber || "01126131495";

  useEffect(() => {
    if (isOpen && !loading && focusPayment) {
      setTimeout(() => {
        paymentSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [isOpen, loading, focusPayment]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success('Order status updated');
        setOrder({ ...order, status: newStatus });
        router.refresh();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Package className="size-5 text-[var(--primary)]" />
              Order Details #{order?.orderNumber?.slice(-6)}
            </DialogTitle>
            {order && (
              <Select 
                defaultValue={order.status} 
                onValueChange={updateStatus}
                disabled={updating}
              >
                <SelectTrigger className="w-[180px] h-8 text-xs font-bold uppercase tracking-widest">
                  <SelectValue placeholder="Update Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending_payment">Pending Payment</SelectItem>
                  <SelectItem value="pending_verification">Pending Verification</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <DialogDescription>
            Created on {order && new Date(order.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="size-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : order ? (
          <div className="space-y-6 pt-4">
            {/* Customer & Address */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--navy)]/50">
                  <MapPin className="size-3" />
                  Shipping Address
                </div>
                <div className="text-sm border p-3 rounded-sm bg-slate-50/50">
                  <p className="font-bold">{order.shippingAddress.fullName}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                  <p className="text-muted-foreground">{order.shippingAddress.city}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--navy)]/50">
                  <CreditCard className="size-3" />
                  Payment Information
                </div>
                <div className="text-sm border p-4 rounded-sm bg-slate-50/50 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Method</span>
                    <Badge variant="secondary" className="uppercase text-[10px] bg-slate-200 text-slate-700">{order.paymentMethod}</Badge>
                  </div>
                  
                  {order.paymentMethod === 'instapay' && (
                    <div className="pt-2 border-t border-slate-100">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-1">InstaPay Number</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-black tracking-tight text-(--navy)">{currentInstapayNumber}</span>
                        <Button 
                          variant="ghost" 
                          size="icon-sm"
                          onClick={() => {
                            navigator.clipboard.writeText(currentInstapayNumber);
                            toast.success('Success', 'Number copied successfully');
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">Grand Total</span>
                    <span className="font-black text-lg text-(--primary)">{order.totalAmount.toLocaleString()} EGP</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/50">
                Order Items
              </div>
              <div className="border rounded-sm divide-y">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{item.productId?.name || 'Loading product...'}</span>
                      <span className="text-[10px] text-muted-foreground">Price: ${item.price.toFixed(2)}</span>
                    </div>
                    <div className="text-sm font-bold">
                      x{item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Proof */}
            {order.paymentMethod === 'InstaPay' && order.paymentProof && (
              <div className="space-y-3" ref={paymentSectionRef}>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-widest text-[var(--navy)]/50">
                    Payment Proof
                  </div>
                  <a 
                    href={order.paymentProof} 
                    target="_blank" 
                    rel="noreferrer"
                    className="text-[10px] font-bold uppercase tracking-widest text-[var(--primary)] flex items-center gap-1 hover:underline underline-offset-4"
                  >
                    Open Original
                    <ExternalLink className="size-3" />
                  </a>
                </div>
                <div className="relative aspect-video w-full rounded-sm overflow-hidden border bg-black/5">
                  <Image 
                    src={order.paymentProof} 
                    alt="Payment Proof" 
                    fill 
                    className="object-contain"
                    unoptimized={true}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Order not found
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
