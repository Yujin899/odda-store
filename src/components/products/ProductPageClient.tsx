'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  ChevronRight, 
  AlertCircle, 
  Check, 
  Minus, 
  Plus, 
  Truck, 
  ShieldCheck, 
  ChevronLeft,
  FileSearch,
  ShoppingCart
} from 'lucide-react';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useRecentlyViewedStore } from '@/store/useRecentlyViewedStore';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import { ReviewSection } from '@/components/shared/ReviewSection';
import { RatingSummary } from '@/components/shared/RatingSummary';
import { RatingBreakdown } from '@/components/shared/RatingBreakdown';

export function ProductPageClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const { addItem } = useCartStore();
  const { addViewedItem: addRecentlyViewed } = useRecentlyViewedStore();
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [localProduct, setLocalProduct] = useState(product);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isReviewsLoading, setIsReviewsLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        if (data.numReviews !== undefined) {
          setLocalProduct((prev: any) => ({
            ...prev,
            averageRating: data.averageRating,
            numReviews: data.numReviews
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [product.slug]);

  const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || product.images?.[0];
  const [activeImage, setActiveImage] = useState(primaryImage);
  
  useEffect(() => {
    if (product) {
      addRecentlyViewed({
        id: String(product._id),
        slug: product.slug,
        name: product.name,
        nameAr: product.nameAr,
        price: product.price,
        image: primaryImage,
      });
    }
  }, [product, addRecentlyViewed, primaryImage]);

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    
    addItem({
      id: String(product._id),
      slug: product.slug,
      name: product.name,
      nameAr: product.nameAr,
      price: product.price,
      image: (product.images?.[0]?.url || product.images?.[0] || product.image),
    }, quantity);
    
    openCart();
  };


  const productName = (language === 'ar' && product.nameAr) ? product.nameAr : product.name;
  const productDescription = (language === 'ar' && product.descriptionAr) ? product.descriptionAr : product.description;
  const categoryName = (language === 'ar' && (product.categoryId?.nameAr || product.categoryAr)) ? (product.categoryId?.nameAr || product.categoryAr) : (product.categoryId?.name || product.category);
  const productFeatures = (language === 'ar' && product.featuresAr) ? product.featuresAr : (product.features || []);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hidden">
          <Link href="/" className="hover:text-(--primary) transition-colors">{dict.common.home}</Link>
          <ChevronRight className="size-4 rtl:-scale-x-100" />
          <Link href={`/products?category=${encodeURIComponent(product.categoryId?.name || product.category)}`} className="hover:text-(--primary) transition-colors">{categoryName}</Link>
          <ChevronRight className="size-4 rtl:-scale-x-100" />
          <span className="text-foreground font-medium">{productName}</span>
        </nav>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side: Product Image Wrapper */}
          <div className="lg:col-span-7 space-y-4">
            <div className="sticky top-28 space-y-4">
              <div className="bg-white p-4 border border-slate-200 rounded-(--radius)">
                <div className="w-full aspect-square relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                    src={activeImage} 
                    alt={product.name}
                  />
                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-md z-20 flex items-center justify-center">
                      <span className="bg-foreground text-background text-xs font-black px-8 py-3 rounded-(--radius) uppercase tracking-[0.3em] shadow-2xl">
                        {language === 'ar' ? 'نفذت الكمية' : 'Sold Out'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: any, i: number) => {
                  const imageUrl = typeof img === 'string' ? img : img.url;
                  return (
                    <div 
                      key={i} 
                      onClick={() => setActiveImage(imageUrl)}
                      className={`aspect-square bg-white p-2 border rounded-(--radius) cursor-pointer transition-all ${activeImage === imageUrl ? 'border-(--primary) shadow-md' : 'border-slate-200 opacity-60 hover:opacity-100'}`}
                    >
                      <img src={imageUrl} className="w-full h-full object-cover rounded-sm" alt="view" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Right Side: Product Details */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="mb-4">
              {product.badgeId || product.badge ? (
                <span 
                  className="inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-(--radius) shadow-sm"
                  style={{ 
                    backgroundColor: (product.badgeId?.color || (product.badge?.includes('Hot') ? '#E11D48' : '#0073E6')),
                    color: (product.badgeId?.textColor || '#FFFFFF')
                  }}
                >
                  {language === 'ar' && product.badgeId?.nameAr ? product.badgeId.nameAr : (product.badgeId?.name || product.badge)}
                </span>
              ) : null}
            </div>
            
            <h1 className="text-4xl font-extrabold text-foreground mb-2 uppercase">{productName}</h1>
            

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-(--primary)">{product.price.toLocaleString()} {dict.common.egp}</span>
                {product.originalPrice && (
                  <span className="text-lg text-slate-400 line-through">{product.originalPrice.toLocaleString()} {dict.common.egp}</span>
                )}
              </div>
              <RatingSummary 
                rating={localProduct.averageRating} 
                numReviews={localProduct.numReviews} 
                className="mt-2"
              />
              <RatingBreakdown 
                reviews={reviews}
                totalReviews={localProduct.numReviews}
                className="mt-4 mb-2"
              />
              <div className="mt-2 flex items-center gap-2 font-medium">
                {product.stock <= 0 ? (
                  <span className="text-destructive flex items-center gap-2"><AlertCircle className="size-5" /> {language === 'ar' ? 'نفذت الكمية' : 'Sold Out'}</span>
                ) : null}
                {product.stock > 0 && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                    <Truck className="size-3 mr-1" />
                    {language === 'ar' ? 'توصيل سريع خلال 24 ساعة' : 'Fast Delivery in 24h'}
                  </span>
                )}
              </div>
            </div>


            <p className="text-slate-600 leading-relaxed mb-8">
              {productDescription}
            </p>
            
            <div className="flex items-center mt-2 mb-8 w-full sm:w-auto">
              <div dir="ltr" className="bg-white p-4 border border-slate-200 rounded-(--radius) flex items-center justify-between sm:justify-start w-full sm:w-auto">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-slate-100 transition-colors rounded-(--radius) cursor-pointer outline-none border-none bg-transparent"
                >
                  <Minus className="size-4" />
                </button>
                <span className="px-4 py-3 font-semibold min-w-12 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 hover:bg-slate-100 transition-colors rounded-(--radius) cursor-pointer outline-none border-none bg-transparent"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
            
            <button 
              disabled={product.stock <= 0}
              onClick={handleAddToCart} 
              className={`w-full font-bold py-5 text-lg shadow-lg transition-all transform active:scale-95 mb-8 rounded-(--radius) uppercase tracking-widest outline-none border-none flex items-center justify-center gap-3 ${
                product.stock <= 0 
                  ? 'bg-muted text-muted-foreground cursor-not-allowed shadow-none' 
                  : 'bg-(--primary) hover:bg-(--primary)/90 text-white shadow-(--primary)/20 cursor-pointer'
              }`}
            >
              <ShoppingCart className="size-5" />
              {dict.common.addToCart}
            </button>

            {/* Accordion Section */}
            <Accordion type="single" collapsible className="w-full space-y-0 divide-y divide-slate-200 border-t border-b border-slate-200">
               {productFeatures && productFeatures.length > 0 && (
                <AccordionItem value="specifications" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-4 flex items-center justify-between w-full">
                    <span className="font-semibold text-base uppercase tracking-tight flex-1 text-start">
                      {language === 'ar' ? 'المواصفات الفنية' : 'Technical Specifications'}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="text-sm text-slate-600 space-y-3 pt-2 pb-4">
                      {productFeatures.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <Check className="size-4 text-(--primary) mt-0.5 shrink-0" />
                          <span className="flex-1 leading-relaxed text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
              
              <AccordionItem value="reviews" className="border-none">
                <AccordionTrigger className="hover:no-underline py-4 flex items-center justify-between w-full">
                  <span className="font-semibold text-base uppercase tracking-tight flex-1 text-start">
                    {language === 'ar' ? 'تقييمات العملاء' : 'Customer Reviews'}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <ReviewSection 
                    targetId={String(product._id)}
                    targetSlug={product.slug}
                    targetType="Product"
                    apiEndpoint={`/api/products/${product.slug}/reviews`}
                    reviews={reviews}
                    isLoading={isReviewsLoading}
                    onReviewAdded={fetchReviews}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-(--radius) bg-white border border-slate-200">
                <ShieldCheck className="text-(--primary) size-6" />
                <span className="text-xs font-medium">
                  {language === 'ar' ? 'أدوات طبية معتمدة 100%' : '100% Certified Clinical Grade'}
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-(--radius) bg-white border border-slate-200">
                <FileSearch className="text-(--primary) size-6" />
                <span className="text-xs font-medium">
                  {language === 'ar' ? 'ضمان قياسي مشمول' : 'Standard Warranty Included'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-32">
            <div className="flex items-end justify-between mb-16 border-b border-slate-100 pb-8">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
                  {language === 'ar' ? 'أكمل مجموعتك' : 'Complete Your Kit'}
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-2 px-1">
                  {language === 'ar' ? 'أدوات غالباً ما يتم شراؤها مع هذا المنتج' : 'Instruments often purchased with this tool'}
                </p>
              </div>
              <div className="hidden sm:flex gap-3">
                <button className="related-prev w-12 h-12 border border-slate-200 flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all rounded-full text-foreground bg-transparent outline-none cursor-pointer">
                  <ChevronLeft className="size-5 stroke-[2.5px]" />
                </button>
                <button className="related-next w-12 h-12 border border-slate-200 flex items-center justify-center hover:bg-foreground hover:text-background hover:border-foreground transition-all rounded-full text-foreground bg-transparent outline-none cursor-pointer">
                  <ChevronRight className="size-5 stroke-[2.5px]" />
                </button>
              </div>
            </div>
            
            <Swiper
              modules={[Navigation, FreeMode]}
              navigation={{
                prevEl: '.related-prev',
                nextEl: '.related-next',
              }}
              grabCursor={true}
              freeMode={true}
              slidesPerView={1.2}
              spaceBetween={32}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 4 },
              }}
              className="w-full"
            >
              {relatedProducts.map((p) => {
                const pPrimaryImage = p.images?.find((img: any) => img.isPrimary)?.url || p.images?.[0]?.url || p.image;
                const pCategoryName = (language === 'ar' && (p.categoryId?.nameAr || p.categoryAr)) ? (p.categoryId?.nameAr || p.categoryAr) : (p.categoryId?.name || p.category);
                const pProductName = (language === 'ar' && p.nameAr) ? p.nameAr : p.name;
                return (
                  <SwiperSlide key={p._id}>
                    <div 
                      className="group bg-background border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-(--radius) cursor-pointer flex flex-col h-full" 
                      onClick={() => router.push(`/product/${p.slug}`)}
                    >
                      <div className="aspect-square bg-muted relative overflow-hidden">
                        <img 
                          loading="lazy" 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                          alt={pProductName} 
                          src={pPrimaryImage}
                        />
                      </div>
                      <div className="p-6">
                        <h4 className="font-extrabold text-foreground group-hover:text-(--primary) transition-colors uppercase tracking-tight text-sm mb-1 truncate">{pProductName}</h4>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-4">{pCategoryName}</p>
                        <p className="text-base font-black text-foreground">{p.price.toLocaleString()} {dict.common.egp}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </section>
        )}
      </main>
    </div>
  );
}
