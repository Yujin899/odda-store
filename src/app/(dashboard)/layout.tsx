import DashboardClientWrapper from './DashboardClientWrapper';

export const dynamic = 'force-dynamic';

export default async function RootDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardClientWrapper>{children}</DashboardClientWrapper>
  );
}
