'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RevenueChart } from '@/components/dashboard/charts/RevenueChart';
import { OrderStatusChart } from '@/components/dashboard/charts/OrderStatusChart';
import { TopProductsChart } from '@/components/dashboard/charts/TopProductsChart';
import { TrendingUp, ShoppingCart, Users, Package } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface DashboardOverviewClientProps {
  revenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  orderStatusData: { status: string; count: number }[];
  revenueData: { date: string; revenue: number }[];
  topProductsData: { name: string; orders: number }[];
}

export function DashboardOverviewClient({
  revenue,
  totalOrders,
  totalCustomers,
  totalProducts,
  orderStatusData,
  revenueData,
  topProductsData
}: DashboardOverviewClientProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <div className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <div>
        <h2 className={`text-2xl font-black uppercase tracking-tighter text-(--navy) ${language === 'ar' ? 'text-end' : ''}`}>{dict.dashboard.overview}</h2>
        <p className={`text-sm font-medium text-muted-foreground uppercase tracking-widest mt-1 ${language === 'ar' ? 'text-end' : ''}`}>
          {dict.dashboard.storeMetrics}
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {dict.dashboard.totalRevenue}
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <TrendingUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">
              {revenue.toLocaleString()} <span className="text-lg text-(--primary)">EGP</span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mt-1">{dict.dashboard.revenueConfirmed}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {dict.dashboard.totalOrders}
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <ShoppingCart className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">{totalOrders}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">{dict.dashboard.ordersAllTime}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {dict.dashboard.customers}
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <Users className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">{totalCustomers}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">{dict.dashboard.customersRegistered}</p>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {dict.dashboard.products}
            </CardTitle>
            <div className="size-8 rounded-full bg-(--primary)/10 flex items-center justify-center text-(--primary)">
              <Package className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-(--navy)">{totalProducts}</div>
            <p className="text-xs font-medium text-muted-foreground mt-1">{dict.dashboard.productsActive}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-w-0">
        <Card className="md:col-span-2 border-border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <CardHeader className="shrink-0">
            <CardTitle className={`text-sm font-bold uppercase tracking-widest text-(--navy) ${language === 'ar' ? 'text-end' : ''}`}>
              {dict.dashboard.revenueLast7Days}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative min-h-0">
            <RevenueChart 
              data={revenueData.map(d => ({
                ...d,
                date: dict.dashboard.chartLabels.weekdays[d.date as keyof typeof dict.dashboard.chartLabels.weekdays] || d.date
              }))} 
              language={language}
              label={dict.dashboard.chartLabels.revenue}
              currency={language === 'ar' ? 'ج.م' : 'EGP'}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1 border-border shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <CardHeader className="shrink-0">
            <CardTitle className={`text-sm font-bold uppercase tracking-widest text-(--navy) ${language === 'ar' ? 'text-end' : ''}`}>
              {dict.dashboard.orderStatus}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative min-h-0">
            <OrderStatusChart 
              data={orderStatusData} 
              labels={dict.dashboard.statuses}
              language={language}
            />
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4">
        <Card className="border-border shadow-sm flex flex-col min-h-[400px]">
          <CardHeader className="shrink-0">
            <CardTitle className={`text-sm font-bold uppercase tracking-widest text-(--navy) ${language === 'ar' ? 'text-end' : ''}`}>
              {dict.dashboard.topProducts}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 relative min-h-0">
            <TopProductsChart 
              data={topProductsData} 
              language={language}
              label={dict.dashboard.chartLabels.orders}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
