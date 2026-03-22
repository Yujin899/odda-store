'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToastStore } from '@/store/useToastStore';
import { 
  ChevronRight, 
  Mail, 
  Lock 
} from 'lucide-react';
import { FormInput } from '@/components/ui/FormInput';
import { Button } from '@/components/ui/button';

interface LoginClientProps {
  dict: any;
  language: string;
}

export function LoginClient({ dict, language }: LoginClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToastStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    try {
      const redirectUrl = searchParams.get('redirect');
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        addToast({
          title: dict.toasts.error,
          description: dict.toasts.loginError,
          type: 'error',
        });
      } else {
        addToast({
          title: dict.toasts.success,
          description: dict.toasts.loginSuccess,
          type: 'success',
        });
        router.push(redirectUrl ?? '/');
      }
    } catch {
      addToast({
        title: dict.toasts.error,
        description: dict.toasts.somethingWentWrong,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white border border-slate-100 p-10 rounded-(--radius) shadow-2xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 inset-s-0 w-full h-1 bg-primary"></div>

          <div className="flex flex-col items-center space-y-4">
            <Link href="/">
              <Image src="/logo.png" alt="Odda Logo" width={120} height={42} className="object-contain" />
            </Link>
            <h1 className="text-2xl font-black uppercase tracking-tight italic">{language === 'ar' ? 'تسجيل الدخول' : 'Login to Account'}</h1>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="w-full h-14 bg-white border border-slate-200 flex items-center justify-center gap-3 font-bold text-xs uppercase tracking-widest rounded-sm shadow-sm hover:bg-slate-50 transition-all border-none"
            >
              <svg className="size-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {language === 'ar' ? 'متابعة بـ Google' : 'Continue with Google'}
            </Button>

            <div className="relative flex items-center justify-center py-2">
              <div className="absolute inset-0 flex items-center px-4 md:px-6">
                <div className="w-full border-t border-slate-100"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] font-black uppercase tracking-widest text-slate-300">{language === 'ar' ? 'أو' : 'or'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label={language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
              icon={Mail}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="name@example.com"
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between ps-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{language === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                <Button 
                  type="button" 
                  variant="link" 
                  className="h-auto p-0 text-[10px] font-black uppercase tracking-widest text-primary hover:no-underline"
                >
                  {language === 'ar' ? 'نسيت؟' : 'Forgot?'}
                </Button>
              </div>
              <FormInput
                icon={Lock}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-foreground text-background flex items-center justify-center gap-3 font-black text-[10px] uppercase tracking-[0.3em] rounded-sm shadow-xl hover:-translate-y-0.5 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed border-none"
            >
              {isLoading 
                ? (language === 'ar' ? 'جاري الدخول...' : 'Logging in...') 
                : (language === 'ar' ? 'تسجيل الدخول' : 'Login to Account')}
              {!isLoading && <ChevronRight className={`size-4 stroke-[3px] ${language === 'ar' ? 'rotate-180' : ''}`} />}
            </Button>
          </form>

          <div className="pt-4 text-center">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              {language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?"} {' '}
              <Link href="/register" className="text-primary font-black">{dict.common.register}</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
