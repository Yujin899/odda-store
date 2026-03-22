'use client';

import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';

interface BundleBreadcrumbsProps {
  bundleName: string;
}

export function BundleBreadcrumbs({ bundleName }: BundleBreadcrumbsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <Breadcrumb className="mb-8 overflow-x-auto whitespace-nowrap scrollbar-hidden">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/bundles" className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">
            {dict.common.home}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbLink href="/bundles" className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">
            {dict.common.offersAndBundles}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbPage className="text-foreground font-black uppercase tracking-widest text-[10px] truncate max-w-[200px]">
            {bundleName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
