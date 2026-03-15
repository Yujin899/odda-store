import Link from 'next/link';
import Image from 'next/image';
import { AddToCartButton } from './AddToCartButton';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    nameAr?: string;
    slug: string;
    price: number;
    originalPrice?: number;
    images?: { url: string; isPrimary: boolean }[];
    image?: string;
    categoryId?: { name: string; nameAr?: string };
    category?: string;
    categoryAr?: string;
    badgeId?: { name: string; nameAr?: string; color: string; textColor: string };
    badge?: string;
    stock?: number;
  };
  locale?: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const dict = locale === 'ar' ? ar : en;
  const language = locale || 'en';

  const primaryImage = product.images?.find((img) => img.isPrimary)?.url || product.images?.[0]?.url || product.image || '';
  const inStock = (product.stock !== undefined) ? product.stock > 0 : true;
  
  const badge = product.badgeId || (typeof product.badge === 'object' ? product.badge : (product.badge ? { 
    name: product.badge, 
    color: String(product.badge).includes('Hot') ? '#E11D48' : '#0073E6', 
    textColor: '#FFFFFF' 
  } : null));

  const getCategoryDisplay = () => {
    const cat = product.categoryId || product.category;
    if (!cat) return '';
    if (typeof cat === 'string') return language === 'ar' ? (product.categoryAr || cat) : cat;
    return language === 'ar' ? (cat.nameAr || cat.name) : cat.name;
  };

  const categoryName = getCategoryDisplay();
    
  const productName = (language === 'ar' && product.nameAr) ? product.nameAr : product.name;

  return (
    <Link 
      href={`/product/${product.slug}`}
      className="group bg-background border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-(--radius) cursor-pointer flex flex-col h-full"
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <Image 
          src={primaryImage}
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
            className="absolute top-4 start-4 text-[10px] font-black px-3 py-1.5 rounded-(--radius) uppercase tracking-widest z-10 shadow-lg"
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
            <span className="text-xl font-black text-foreground">{product.price.toLocaleString()} {dict.common.egp}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through opacity-50 font-light">{product.originalPrice.toLocaleString()} {dict.common.egp}</span>
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
