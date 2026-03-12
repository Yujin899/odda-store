import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart';
import { OrderStatusChart } from '@/components/dashboard/charts/OrderStatusChart';
import { TopProductsChart } from '@/components/dashboard/charts/TopProductsChart';
import { connectDB } from '@/lib/mongodb';
import { Order } from '@/models/Order';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  await connectDB();

  // 1. Total Orders & Revenue
  const orders = await Order.find().lean();
  
  // VALID SALES: Only processing, shipped, or delivered
  const validOrders = orders.filter(order => ['processing', 'shipped', 'delivered'].includes(order.status));
  
  const totalOrders = validOrders.length;
  
  const revenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

  // 2. Total Customers
  const totalCustomers = await User.countDocuments({ role: 'customer' });

  // 3. Total Products
  const totalProducts = await Product.countDocuments();

  // 4. Order Status Distribution (Pie Chart)
  const statusCounts = orders.reduce<{ [key: string]: number }>((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});
  
  const orderStatusData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count
  }));

  // 5. Revenue last 7 days (Area Chart)
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const revenueData = last7Days.map(date => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const dayRevenue = orders
      .filter(order => 
        ['processing', 'shipped', 'delivered'].includes(order.status) &&
        new Date(order.createdAt) >= date &&
        new Date(order.createdAt) < nextDay
      )
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayRevenue
    };
  });

  // 6. Top Products (Bar Chart)
  // We'll calculate product frequencies from order items
  const productCounts = validOrders.reduce<{ [key: string]: number }>((acc, order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        if (item.name) {
          acc[item.name] = (acc[item.name] || 0) + item.quantity;
        }
      });
    }
    return acc;
  }, {});

  const topProductsData = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, orders]) => ({ name, orders }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-(--navy)">Overview</h2>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1">
          Store Performance Metrics
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">
              {revenue.toLocaleString()} <span className="text-lg text-(--primary)">EGP</span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">From confirmed orders</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Total Orders
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <ShoppingCart className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">{totalOrders}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">All time orders</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Customers
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">{totalCustomers}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Products
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <Package className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">{totalProducts}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">Active inventory</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="col-span-2 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-(--navy)">
              Revenue (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card className="col-span-1 border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-(--navy)">
              Order Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OrderStatusChart data={orderStatusData} />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4">
        <Card className="border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-widest text-(--navy)">
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TopProductsChart data={topProductsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
