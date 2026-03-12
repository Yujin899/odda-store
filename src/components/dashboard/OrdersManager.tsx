'use client';

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Eye, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  Package, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { OrderDetailsModal } from './OrderDetailsModal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { toast } from '@/store/useToastStore';

interface OrdersManagerProps {
  orders: any[];
}

export function OrdersManager({ orders: initialOrders }: OrdersManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [focusPayment, setFocusPayment] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOrders = initialOrders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    verify: filteredOrders.filter(o => ['pending_payment', 'pending_verification'].includes(o.status)).length,
    ship: filteredOrders.filter(o => o.status === 'processing').length,
    transit: filteredOrders.filter(o => o.status === 'shipped').length,
    delivered: filteredOrders.filter(o => ['delivered', 'cancelled'].includes(o.status)).length,
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingId(orderId);
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success('Order status updated');
        router.refresh();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_payment':
      case 'pending_verification':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 uppercase text-[9px] font-black tracking-widest px-2 py-0.5">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 uppercase text-[9px] font-black tracking-widest px-2 py-0.5">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 uppercase text-[9px] font-black tracking-widest px-2 py-0.5">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[9px] font-black tracking-widest px-2 py-0.5">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="destructive" className="uppercase text-[9px] font-black tracking-widest px-2 py-0.5">Cancelled</Badge>;
      default:
        return <Badge variant="secondary" className="uppercase text-[9px] font-black tracking-widest px-2 py-0.5">{status}</Badge>;
    }
  };

  const OrdersTable = ({ orders }: { orders: any[] }) => (
    <div className="border rounded-(--radius) bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 border-b">
            <TableHead className="w-[120px] font-black uppercase text-[9px] tracking-[0.2em] text-slate-500 py-4">Order ID</TableHead>
            <TableHead className="font-black uppercase text-[9px] tracking-[0.2em] text-slate-500 py-4">Customer</TableHead>
            <TableHead className="font-black uppercase text-[9px] tracking-[0.2em] text-slate-500 py-4 text-center">Amount</TableHead>
            <TableHead className="font-black uppercase text-[9px] tracking-[0.2em] text-slate-500 py-4">Status</TableHead>
            <TableHead className="text-right font-black uppercase text-[9px] tracking-[0.2em] text-slate-500 py-4 pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <Package className="size-8 stroke-[1.5px]" />
                  <p className="text-[10px] uppercase font-black tracking-widest">No active orders in this queue</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <TableRow key={order._id} className="group hover:bg-slate-50/80 transition-all border-b last:border-0">
                <TableCell className="font-mono text-[11px] font-bold text-slate-400">
                  <span className="text-foreground">#{order.orderNumber.slice(-8)}</span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col py-1">
                    <span className="font-black text-[11px] uppercase tracking-tight text-(--navy)">{order.userId?.name || 'Guest'}</span>
                    <span className="text-[9px] font-bold text-muted-foreground tracking-tighter">{order.userId?.email}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-black text-xs text-(--primary)">{order.totalAmount.toLocaleString()}</span>
                  <span className="text-[8px] font-black uppercase text-slate-400 ml-1">EGP</span>
                </TableCell>
                <TableCell>
                  {getStatusBadge(order.status)}
                </TableCell>
                <TableCell className="text-right py-4 pr-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Quick Action Logic */}
                    {order.status === 'pending_verification' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 hover:text-blue-800 text-[9px] font-black uppercase tracking-widest px-3"
                        onClick={() => {
                          setFocusPayment(true);
                          setSelectedOrder(order);
                        }}
                      >
                        <ShieldCheck className="size-3 mr-1.5" />
                        Verify
                      </Button>
                    )}
                    {order.status === 'pending_payment' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 hover:text-emerald-800 text-[9px] font-black uppercase tracking-widest px-3"
                        disabled={updatingId === order._id}
                        onClick={() => handleUpdateStatus(order._id, 'processing')}
                      >
                        {updatingId === order._id ? <Loader2 className="size-3 animate-spin mr-1.5" /> : <CheckCircle2 className="size-3 mr-1.5" />}
                        Process
                      </Button>
                    )}
                    {order.status === 'processing' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-100 hover:text-purple-800 text-[9px] font-black uppercase tracking-widest px-3"
                        disabled={updatingId === order._id}
                        onClick={() => handleUpdateStatus(order._id, 'shipped')}
                      >
                        {updatingId === order._id ? <Loader2 className="size-3 animate-spin mr-1.5" /> : <Truck className="size-3 mr-1.5" />}
                        Ship Item
                      </Button>
                    )}
                    {order.status === 'shipped' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100 hover:text-emerald-800 text-[9px] font-black uppercase tracking-widest px-3"
                        disabled={updatingId === order._id}
                        onClick={() => handleUpdateStatus(order._id, 'delivered')}
                      >
                        {updatingId === order._id ? <Loader2 className="size-3 animate-spin mr-1.5" /> : <CheckCircle2 className="size-3 mr-1.5" />}
                        Deliver
                      </Button>
                    )}

                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setFocusPayment(false);
                        setSelectedOrder(order);
                      }}
                      className="h-8 text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 px-3"
                    >
                      <Eye className="size-3 mr-1.5" />
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  if (!mounted) return <div className="min-h-[400px] flex items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-(--radius) border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground drop-shadow-sm" />
          <Input 
            placeholder="Search order ID or customer name..." 
            className="pl-9 h-11 text-xs border-slate-200 focus:ring-(--primary)/20 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="hidden md:flex items-center gap-2">
          <Badge variant="outline" className="h-8 px-3 border-emerald-100 bg-emerald-50 text-emerald-700 font-bold uppercase text-[9px] tracking-widest">
            <CheckCircle2 className="size-3 mr-1.5" />
            Active Workflow
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="bg-slate-100/50 p-1 h-14 rounded-md mb-6 w-full md:w-auto overflow-x-auto justify-start border border-slate-200">
          <TabsTrigger value="verify" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full flex items-center gap-3">
            <ShieldCheck className="size-4 text-rose-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Verify</span>
            {stats.verify > 0 && <Badge className="bg-rose-500 hover:bg-rose-600 text-white text-[10px] px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-2 ring-rose-500/10">{stats.verify}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="ship" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full flex items-center gap-3">
            <Package className="size-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Ship</span>
            {stats.ship > 0 && <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-[10px] px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-2 ring-blue-500/10">{stats.ship}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="transit" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full flex items-center gap-3">
            <Truck className="size-4 text-purple-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">In Transit</span>
            {stats.transit > 0 && <Badge className="bg-purple-500 hover:bg-purple-600 text-white text-[10px] px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm ring-2 ring-purple-500/10">{stats.transit}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="delivered" className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 h-full flex items-center gap-3">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Delivered</span>
            {stats.delivered > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 h-5 min-w-5 flex items-center justify-center rounded-full bg-slate-200 text-slate-600">{stats.delivered}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verify">
          <OrdersTable orders={filteredOrders.filter(o => ['pending_payment', 'pending_verification'].includes(o.status))} />
        </TabsContent>
        <TabsContent value="ship">
          <OrdersTable orders={filteredOrders.filter(o => o.status === 'processing')} />
        </TabsContent>
        <TabsContent value="transit">
          <OrdersTable orders={filteredOrders.filter(o => o.status === 'shipped')} />
        </TabsContent>
        <TabsContent value="delivered">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-md p-4 flex items-start gap-3">
              <AlertCircle className="size-4 text-blue-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-900">System Notice</p>
                <p className="text-[9px] font-bold text-blue-700/80 uppercase tracking-tight leading-relaxed">
                  Orders in this tab (along with their payment receipts) are permanently deleted automatically after 30 days to free up database and storage space.
                </p>
              </div>
            </div>
            <OrdersTable orders={filteredOrders.filter(o => ['delivered', 'cancelled'].includes(o.status))} />
          </div>
        </TabsContent>
      </Tabs>

      {selectedOrder && (
        <OrderDetailsModal 
          orderId={selectedOrder._id}
          isOpen={!!selectedOrder}
          onClose={() => {
            setSelectedOrder(null);
            setFocusPayment(false);
          }}
          focusPayment={focusPayment}
        />
      )}
    </div>
  );
}
