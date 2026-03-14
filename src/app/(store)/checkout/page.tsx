import { auth } from '@/auth';
import { connectDB } from '@/lib/mongodb';
import { StoreSettings } from '@/models/StoreSettings';
import { cookies } from 'next/headers';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';

export const dynamic = 'force-dynamic';

async function getSettings() {
  await connectDB();
  const settings = await StoreSettings.findOne().lean();
  return JSON.parse(JSON.stringify(settings));
}

export default async function CheckoutPage() {
  const session = await auth();
  const settings = await getSettings();
  const cookieStore = await cookies();
  const language = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = language === 'en' ? en : ar;

  return (
    <CheckoutClient 
      dict={dict} 
      language={language} 
      session={session} 
      settings={settings} 
    />
  );
}
