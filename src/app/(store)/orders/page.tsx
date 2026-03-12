import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronRight, AlertCircle } from 'lucide-react';

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?redirect=/orders');
  }

  await connectDB();

  const orders = await Order.find({
    $or: [
      { userId: session.user.id },
      { 'customer.email': session.user.email }
    ]
  }).sort({ createdAt: -1 }).lean();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-(--success)/10 text-(--success)';
      case 'pending': return 'bg-(--warning)/10 text-(--warning)';
      case 'confirmed':
      case 'shipped': return 'bg-(--primary)/10 text-(--primary)';
      case 'cancelled': return 'bg-(--danger)/10 text-(--danger)';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-black uppercase tracking-tight italic mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-card border border-border p-12 rounded-(--radius) text-center space-y-4">
            <Package className="size-12 text-muted-foreground mx-auto stroke-[1.5px]" />
            <h2 className="text-xl font-bold">No orders yet</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              When you place an order, it will appear here. Start browsing our collection and find what you need.
            </p>
            <Link 
              href="/products"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.2em] rounded-(--radius) mt-4 hover:-translate-y-0.5 transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order._id.toString()} className="bg-card border border-border rounded-(--radius) overflow-hidden shadow-sm hover:shadow-md transition-all">
                {/* Order Header */}
                <div className="bg-muted p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Order Number</p>
                      <p className="font-semibold font-mono">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Date</p>
                      <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Total</p>
                      <p className="font-semibold">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center justify-center ${getStatusColor(order.status)} shrink-0`}>
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4 sm:px-6">
                  <div className="space-y-3">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-start text-sm">
                        <div className="font-medium">
                          {item.name}
                          {item.variant && <span className="text-muted-foreground ml-2">({item.variant})</span>}
                        </div>
                        <div className="text-muted-foreground whitespace-nowrap pl-4">
                          Qty: {item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.status === 'pending' && (
                    <div className="mt-6 flex items-start gap-2 text-sm text-(--warning) bg-(--warning)/5 p-3 rounded-md">
                      <AlertCircle className="size-4 shrink-0 mt-0.5" />
                      <p>
                        Your order is pending payment verification. If you haven't uploaded your payment screenshot yet, please do so from the confirmation page.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Link 
                      href={`/order-confirmation?order=${order.orderNumber}`}
                      className="text-sm font-semibold text-(--primary) flex items-center hover:underline"
                    >
                      View Order Details
                      <ChevronRight className="size-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
