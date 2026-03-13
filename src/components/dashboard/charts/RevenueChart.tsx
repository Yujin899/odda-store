'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RevenueData {
  date: string;
  revenue: number;
}

export function RevenueChart({ 
  data, 
  language = 'en',
  label = 'Revenue',
  currency = 'EGP'
}: { 
  data: RevenueData[], 
  language?: string,
  label?: string,
  currency?: string
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {language === 'ar' ? 'لا توجد بيانات' : 'No revenue data'}
      </div>
    );
  }

  return (
    <div className="h-full w-full min-w-0 min-h-[300px] relative" dir="ltr">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 10, fill: 'var(--muted-foreground)', fontWeight: 600 }}
            tickFormatter={(value) => `${value}`}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ color: 'var(--primary)', fontWeight: 800, fontSize: '12px' }}
            labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 600, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}
            formatter={(value: any) => [`${(Number(value) || 0).toLocaleString()} ${currency}`, label]}
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="var(--primary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorRevenue)" 
          />
        </AreaChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
