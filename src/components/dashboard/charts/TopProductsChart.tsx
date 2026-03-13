'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface TopProductData {
  name: string;
  orders: number;
}

export function TopProductsChart({ 
  data,
  language = 'en',
  label = 'Orders'
}: { 
  data: TopProductData[],
  language?: string,
  label?: string
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {language === 'ar' ? 'لا توجد بيانات' : 'No products data'}
      </div>
    );
  }

  // Truncate names for better display
  const formattedData = data.map(item => ({
    ...item,
    displayName: item.name.length > 15 ? `${item.name.substring(0, 15)}...` : item.name
  }));

  return (
    <div className="h-full w-full min-w-0 min-h-[300px] relative" dir="ltr">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            type="number" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: 600 }}
          />
          <YAxis 
            type="category" 
            dataKey="displayName" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 9, fill: 'var(--foreground)', fontWeight: 700 }}
            width={120}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}
            cursor={{ fill: 'var(--muted)' }}
            itemStyle={{ color: 'var(--primary)', fontWeight: 800, fontSize: '12px' }}
            labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
            formatter={(value: any) => [Number(value) || 0, label]}
          />
          <Bar dataKey="orders" radius={[0, 4, 4, 0]} barSize={24}>
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill="var(--primary)" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
