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

interface ProductBreadcrumbsProps {
  productName: string;
  categoryName: string;
  categoryNameAr?: string;
  categorySlug?: string;
}

export function ProductBreadcrumbs({ 
  productName, 
  categoryName, 
  categoryNameAr,
  categorySlug 
}: ProductBreadcrumbsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);
  const isRtl = language === 'ar';

  return (
    <Breadcrumb className="mb-8 overflow-x-auto whitespace-nowrap scrollbar-hidden">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]">
            {dict.common.home}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbLink 
            href={`/products?category=${categorySlug}`} 
            className="hover:text-primary transition-colors font-bold uppercase tracking-widest text-[10px]"
          >
            {isRtl && categoryNameAr ? categoryNameAr : categoryName}
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        <BreadcrumbSeparator />
        
        <BreadcrumbItem>
          <BreadcrumbPage className="text-foreground font-black uppercase tracking-widest text-[10px] truncate max-w-[200px]">
            {productName}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
