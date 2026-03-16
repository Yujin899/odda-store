import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { getDictionary } from '@/dictionaries';
import { LoginClient } from '@/components/auth/AuthParts/LoginClient';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Login | عُدّة (عدة) Dental Student Store',
  description: 'Login to your account at عُدّة (عدة) - The premier dental student store in Egypt.',
};

export default async function LoginPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = getDictionary(locale as 'en' | 'ar');

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-8 h-8 rounded-full border-2 border-(--primary) border-t-transparent animate-spin"></div>
      </div>
    }>
      <LoginClient dict={dict} language={locale} />
    </Suspense>
  );
}
