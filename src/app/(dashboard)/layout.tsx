import DashboardClientWrapper from './DashboardClientWrapper';

export const dynamic = 'force-dynamic';

export default function RootDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardClientWrapper>{children}</DashboardClientWrapper>;
}
