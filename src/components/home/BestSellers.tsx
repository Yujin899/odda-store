'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { Product, ProductImage } from '@/types/store';

export function BestSellers({ products }: { products: Product[] }) {
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const { addItem } = useCartStore();
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || product.image || '';
    addItem({
      id: String(product._id || product.id),
      slug: product.slug,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: primaryImage,
    });
    openCart();
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-black uppercase tracking-tight text-(--navy)">{dict.home.bestSellers}</h2>
          <div className="hidden sm:flex gap-2">
            <button className="best-sellers-prev w-12 h-12 border border-navy/20 flex items-center justify-center hover:bg-(--navy) hover:text-background transition-colors rounded-sm text-(--navy) bg-transparent outline-none cursor-pointer">
              <ChevronLeft className="size-5 stroke-[2.5px] rtl:-scale-x-100" />
            </button>
            <button className="best-sellers-next w-12 h-12 border border-navy/20 flex items-center justify-center hover:bg-(--navy) hover:text-background transition-colors rounded-sm text-(--navy) bg-transparent outline-none cursor-pointer">
              <ChevronRight className="size-5 stroke-[2.5px] rtl:-scale-x-100" />
            </button>
          </div>
        </div>
        
        <Swiper
          key={language}
          dir={language === 'ar' ? 'rtl' : 'ltr'}
          modules={[Navigation, FreeMode]}
          navigation={{
            prevEl: '.best-sellers-prev',
            nextEl: '.best-sellers-next',
          }}
          grabCursor={true}
          freeMode={true}
          slidesPerView={1.2}
          spaceBetween={24}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            1024: { slidesPerView: 4 },
          }}
          className="w-full"
        >
          {products.map((product) => {
            const primaryImage = product.images?.find((img: ProductImage) => img.isPrimary)?.url || product.images?.[0]?.url || product.image;
            const badge = (product.badgeId && typeof product.badgeId === 'object') ? product.badgeId : (typeof product.badge === 'object' ? product.badge : (product.badge ? { name: String(product.badge), color: String(product.badge).includes('Hot') ? '#E11D48' : '#0073E6', textColor: '#FFFFFF' } : null));
            const productName = (language === 'ar' && product.nameAr) ? product.nameAr : product.name;
            return (
              <SwiperSlide key={product._id || product.id}>
                <div 
                  className="bg-background group overflow-hidden rounded-sm cursor-pointer"
                  onClick={() => router.push(`/product/${product.slug}`)}
                >
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img 
                      className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                      alt={productName} 
                      src={primaryImage} 
                    />
                    {badge && (
                      <div 
                        className="absolute top-3 inset-s-3 text-background text-[10px] font-black px-2.5 py-1 rounded-(--radius) uppercase tracking-widest z-10 shadow-lg flex items-center gap-1"
                        style={{ backgroundColor: badge.color || '#E11D48', color: badge.textColor || '#FFFFFF' }}
                      >
                        {language === 'ar' ? (badge.nameAr || badge.name) : (badge.name || badge.nameAr)}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 uppercase tracking-tight text-foreground truncate">{productName}</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-black text-foreground">{product.price.toLocaleString()} {dict.common.egp}</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through opacity-70">{product.originalPrice.toLocaleString()} {dict.common.egp}</span>
                      )}
                    </div>
                    <button 
                      disabled={product.stock <= 0}
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm outline-none border-none flex items-center justify-center gap-2 ${
                        product.stock <= 0 
                          ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                          : 'bg-(--primary) hover:bg-navy text-white cursor-pointer'
                      }`}
                    >
                      <ShoppingCart className="size-4" />
                      {product.stock <= 0 ? (language === 'ar' ? 'نفذت الكمية' : 'Sold Out') : dict.common.addToCart}
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
