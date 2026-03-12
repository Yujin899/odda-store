import { NotificationsList } from '@/components/dashboard/NotificationsList';

export const metadata = {
  title: 'Notifications | Admin Dashboard',
  description: 'View and manage system notifications and activity.',
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <NotificationsList />
    </div>
  );
}
