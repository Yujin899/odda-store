'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DashboardLayout from './layout_client';

export default function DashboardClientWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-(--primary) border-t-transparent animate-spin" />
    </div>;
  }

  if (!session || session.user?.role !== 'admin') {
    redirect('/');
  }

  return <DashboardLayout session={session}>{children}</DashboardLayout>;
}
