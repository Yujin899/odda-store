import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getDictionary } from '@/dictionaries';
import { RegisterClient } from '@/components/auth/AuthParts/RegisterClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Register | عُدّة (عدة) Dental Student Store',
  description: 'Create an account at عُدّة (عدة) - Join the largest dental student community in Egypt.',
};

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(locale as 'en' | 'ar');

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-8 h-8 rounded-full border-2 border-(--primary) border-t-transparent animate-spin"></div>
      </div>
    }>
      <RegisterClient dict={dict} language={locale} />
    </Suspense>
  );
}
