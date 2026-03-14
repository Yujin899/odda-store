'use client';

import { useLanguageStore } from '@/store/useLanguageStore';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageSwitcher() {
  const router = useRouter();
  const { language, setLanguage } = useLanguageStore();

  const handleLanguageChange = (lang: 'en' | 'ar') => {
    setLanguage(lang);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-(--primary) transition-colors"
        >
          <Globe className="size-4" />
          <span>{language === 'en' ? 'EN' : 'AR'}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 rounded-sm overflow-hidden border-slate-200">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('en')}
          className={`text-xs font-bold uppercase tracking-widest cursor-pointer ${language === 'en' ? 'text-(--primary) bg-slate-50' : ''}`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange('ar')}
          className={`text-xs font-bold uppercase tracking-widest cursor-pointer ${language === 'ar' ? 'text-(--primary) bg-slate-50' : ''}`}
        >
          العربية
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
