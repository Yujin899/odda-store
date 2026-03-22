import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from './AddToCartButton';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import type { RelatedProduct } from '@/types/store';
import { RatingSummary } from '@/components/shared/RatingSummary';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from "@/components/ui/card";

interface ProductCardProps {
  product: RelatedProduct;
  locale?: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const dict = locale === 'ar' ? ar : en;
  const language = locale || 'en';

  const primaryImage = (product.images && product.images.length > 0) 
    ? (product.images.find((img) => img.isPrimary)?.url || product.images[0].url) 
    : (product.image || '');
  const secondaryImage = (product.images && product.images.length > 1)
    ? (product.images.find((img) => !img.isPrimary)?.url || product.images[1].url)
    : null;
  const inStock = (product.stock !== undefined) ? product.stock > 0 : true;
  
  const badge = (product.badgeId && typeof product.badgeId === 'object') ? product.badgeId : (product.badge || null);

  const categoryName = language === 'ar' ? (product.categoryNameAr || product.categoryName || '') : (product.categoryName || '');
    
  const productName = (language === 'ar' && product.nameAr) ? product.nameAr : product.name;

  return (
    <Link href={`/product/${product.slug}`} className="group/card block h-full">
      <Card className="h-full border-none ring-0 shadow-none transition-transform duration-300 hover:-translate-y-1 flex flex-col overflow-hidden bg-background">
        <div className="aspect-square relative overflow-hidden bg-muted">
          <Image 
            src={primaryImage}
            alt={product.name} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${secondaryImage ? 'group-hover/card:opacity-0' : 'group-hover/card:scale-110'}`} 
          />
          {secondaryImage && (
            <Image 
              src={secondaryImage}
              alt={`${product.name} alternate view`} 
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" 
            />
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
              <Badge className="px-6 py-2 text-[10px] tracking-[0.2em] shadow-2xl bg-red-600 text-white hover:bg-red-700 border-none">
                {language === 'ar' ? 'نفذت الكمية' : 'SOLD OUT'}
              </Badge>
            </div>
          )}
          {badge && (
            <div className="absolute top-4 inset-s-4 z-10">
              <Badge 
                className="text-[9px] sm:text-[10px] px-3 py-1 shadow-lg border-white/10"
                style={{ 
                  backgroundColor: badge.color || 'var(--primary)', 
                  color: badge.textColor || '#FFFFFF' 
                }}
              >
                {language === 'ar' && badge.nameAr ? badge.nameAr : (badge.name || badge.nameAr)}
              </Badge>
            </div>
          )}
        </div>
        <CardContent className="p-3 sm:p-5 flex flex-col flex-1">
          <h4 className="font-bold text-foreground group-hover/card:text-primary transition-colors uppercase tracking-tight text-sm sm:text-lg mb-1 truncate">{productName}</h4>
          <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mb-1 sm:mb-2 font-bold">{categoryName}</p>
          <RatingSummary 
            rating={product.averageRating || 0} 
            numReviews={product.numReviews || 0} 
            variant="compact"
            className="mb-1 sm:mb-3 scale-90 sm:scale-100 origin-left"
          />
          <div className="mt-auto">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <span className="font-black text-sm sm:text-base text-foreground">{product.price.toLocaleString()} {dict.common.egp}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-sm text-muted-foreground line-through opacity-70">{product.originalPrice.toLocaleString()} {dict.common.egp}</span>
              )}
            </div>
            
            <AddToCartButton 
              product={{
                _id: String(product._id),
                slug: product.slug,
                name: product.name,
                nameAr: product.nameAr,
                price: product.price,
                image: primaryImage || '',
                stock: product.stock ?? 0
              }}
              dict={dict}
              variant="card"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
