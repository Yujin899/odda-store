'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface OrderStatusData {
  status: string;
  count: number;
}

const COLORS: Record<string, string> = {
  'pending_payment': '#facc15',   // Yellow (Verify)
  'pending_verification': '#f87171', // Rose (Verify - Urgent)
  'processing': '#3b82f6',       // Blue (Ship)
  'shipped': '#a855f7',          // Purple (Transit)
  'delivered': '#10b981',        // Emerald (Delivered)
  'cancelled': '#64748b',        // Slate (Cancelled)
};

const FORMAT_STATUS: Record<string, string> = {
  'pending_payment': 'Wait Pay',
  'pending_verification': 'To Verify',
  'processing': 'To Ship',
  'shipped': 'Transit',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
};

export function OrderStatusChart({ 
  data, 
  labels = {},
  language = 'en'
}: { 
  data: OrderStatusData[], 
  labels?: Record<string, string>,
  language?: string
}) {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-sm font-bold uppercase tracking-widest text-muted-foreground">
        {language === 'ar' ? 'لا توجد بيانات' : 'No orders data'}
      </div>
    );
  }

  const getStatusLabel = (status: string) => labels[status] || FORMAT_STATUS[status] || status;

  return (
    <div className="h-full w-full min-w-0 min-h-[300px] relative" dir="ltr">
      <div className="absolute inset-0">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={75}
            outerRadius={100}
            paddingAngle={5}
            dataKey="count"
            nameKey="status"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#E2E8F0'} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'var(--background)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ fontWeight: 800, fontSize: '12px', color: 'var(--foreground)' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: any, name: any) => [value, getStatusLabel(name)]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span style={{ color: 'var(--muted-foreground)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{getStatusLabel(value)}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      </div>
    </div>
  );
}
