import { DashboardOverviewClient } from '@/components/dashboard/DashboardOverviewClient';
import { connectDB } from '@/lib/mongodb';
import { Order, IOrder } from '@/models/Order';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { Bundle } from '@/models/Bundle';

export const dynamic = 'force-dynamic';

export default async function DashboardOverviewPage() {
  await connectDB();
  
  // Register models for population
  void Product.modelName;
  void Bundle.modelName;

  // 1. Total Orders & Revenue
  const rawOrders = await Order.find().populate('items.productId').lean();
  const orders = rawOrders.map(doc => ({
    ...doc,
    _id: doc._id.toString(),
    createdAt: (doc as any).createdAt?.toISOString() || new Date().toISOString(),
    updatedAt: (doc as any).updatedAt?.toISOString() || new Date().toISOString(),
  })) as any[];
  
  // VALID SALES: Only processing, shipped, or delivered
  const validOrders = orders.filter(order => ['processing', 'shipped', 'delivered'].includes(order.status));
  
  const totalOrders = validOrders.length;
  
  const revenue = validOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

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
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      revenue: dayRevenue
    };
  });

  // 6. Top Products (Bar Chart)
  // We'll calculate product frequencies from ALL non-cancelled orders
  const productCounts = orders.filter(o => o.status !== 'cancelled').reduce<{ [key: string]: number }>((acc, order) => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach((item: any) => {
        // Try to get name from populated productId, falling back to stored name if available
        const product = item.productId;
        const productName = product?.name || item.name || item.productName || 'Unknown Product';
        
        if (productName) {
          acc[productName] = (acc[productName] || 0) + (item.quantity || 0);
        }
      });
    }
    return acc;
  }, {});

  const topProductsData = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, orders: count }));

  return (
    <DashboardOverviewClient 
      revenue={revenue}
      totalOrders={totalOrders}
      totalCustomers={totalCustomers}
      totalProducts={totalProducts}
      orderStatusData={orderStatusData}
      revenueData={revenueData}
      topProductsData={topProductsData}
    />
  );
}
