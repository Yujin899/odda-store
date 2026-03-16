import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from './AddToCartButton';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary-utils';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import type { RelatedProduct } from '@/types/store';
import { formatPrice } from '@/lib/utils';

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
  const inStock = (product.stock !== undefined) ? product.stock > 0 : true;
  
  const badge = (product.badgeId && typeof product.badgeId === 'object') ? product.badgeId : (product.badge || null);

  const categoryName = language === 'ar' ? (product.categoryNameAr || product.categoryName || '') : (product.categoryName || '');
    
  const productName = (language === 'ar' && product.nameAr) ? product.nameAr : product.name;

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group bg-background border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-(--radius) cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <Image 
          src={optimizeCloudinaryUrl(primaryImage, { width: 600 })}
          alt={product.name} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <span className="bg-foreground text-background text-[10px] font-black px-4 py-2 rounded-(--radius) uppercase tracking-[0.2em] shadow-2xl">
              {language === 'ar' ? 'نفذت الكمية' : 'Sold Out'}
            </span>
          </div>
        )}
        {badge && (
          <span 
            className="absolute top-4 inset-s-4 text-[10px] font-black px-3 py-1.5 rounded-(--radius) uppercase tracking-widest z-10 shadow-lg"
            style={{ backgroundColor: badge.color || '#0073E6', color: badge.textColor || '#FFFFFF' }}
          >
            {language === 'ar' && badge.nameAr ? badge.nameAr : (badge.name || badge.nameAr)}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h4 className="font-bold text-foreground group-hover:text-(--primary) transition-colors uppercase tracking-tight text-lg mb-1 truncate">{productName}</h4>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-6 font-bold">{categoryName}</p>
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-black text-foreground">{formatPrice(product.price, language as 'en' | 'ar')}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through opacity-50 font-light">{formatPrice(product.originalPrice, language as 'en' | 'ar')}</span>
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
      </div>
    </Link>
  );
}
