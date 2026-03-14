'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface BundleBreadcrumbsProps {
  bundleName: string;
}

export function BundleBreadcrumbs({ bundleName }: BundleBreadcrumbsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hidden">
      <Link href="/" className="hover:text-(--primary) transition-colors">
        {dict.common.home}
      </Link>
      
      <ChevronRight className="size-4 rtl:-scale-x-100 text-slate-300" />
      
      <Link href="/" className="hover:text-(--primary) transition-colors">
        {language === 'ar' ? 'العروض' : 'Bundles'}
      </Link>
      
      <ChevronRight className="size-4 rtl:-scale-x-100 text-slate-300" />
      
      <span className="text-foreground font-medium truncate max-w-[200px]">
        {bundleName}
      </span>
    </nav>
  );
}
