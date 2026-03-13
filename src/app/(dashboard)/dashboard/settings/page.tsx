import { connectDB } from '@/lib/mongodb';
import { StoreSettings } from '@/models/StoreSettings';
import { SettingsForm } from '@/components/dashboard/SettingsForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Store Settings | Odda Admin',
  description: 'Manage global store configuration',
};

async function getSettings() {
  await connectDB();
  const settings = await StoreSettings.findOne();
  if (!settings) return null;
  return JSON.parse(JSON.stringify(settings));
}

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6">
      <SettingsForm initialData={settings} />
    </div>
  );
}
