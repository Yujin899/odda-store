'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { 
  ChevronRight, 
  AlertCircle, 
  Star, 
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

export function ProductPageClient({ product, relatedProducts }: { product: any, relatedProducts: any[] }) {
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const { addItem } = useCartStore();
  const { addViewedItem: addRecentlyViewed } = useRecentlyViewedStore();
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [localProduct, setLocalProduct] = useState(product);
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

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    
    setIsSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${product.slug}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: reviewRating, comment: reviewComment })
      });
      
      const data = await res.json();
      if (res.ok) {
        setLocalProduct(data.product);
        setReviewComment('');
        setReviewRating(5);
      } else {
        // Show server-side error message
        alert(data.message || (language === 'ar' ? 'فشل إرسال التقييم' : 'Failed to post review'));
      }
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert(language === 'ar' ? 'حدث خطأ في الاتصال' : 'Connection error occurred');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const productName = (language === 'ar' && product.nameAr) ? product.nameAr : product.name;
  const productDescription = (language === 'ar' && product.descriptionAr) ? product.descriptionAr : product.description;
  const categoryName = (language === 'ar' && (product.categoryId?.nameAr || product.categoryAr)) ? (product.categoryId?.nameAr || product.categoryAr) : (product.categoryId?.name || product.category);
  const productFeatures = (language === 'ar' && product.featuresAr) ? product.featuresAr : (product.features || []);

  return (
    <div className="bg-background text-foreground font-sans min-h-screen" dir={language === 'ar' ? 'rtl' : 'ltr'}>
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
            
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="flex text-yellow-400">
                  {[1, 2, 3, 4, 5].map((s) => {
                    const rating = localProduct.averageRating || 0;
                    const isFull = s <= Math.floor(rating);
                    const isHalf = !isFull && s <= Math.ceil(rating) && (rating % 1 >= 0.25 && rating % 1 <= 0.75);
                    const isAlmostFull = !isFull && !isHalf && s <= Math.ceil(rating) && rating % 1 > 0.75;
                    
                    return (
                      <div key={s} className="relative">
                        <Star className="size-[18px] text-slate-200 fill-current stroke-none" />
                        <div 
                          className="absolute inset-0 overflow-hidden text-yellow-400"
                          style={{ 
                            width: isFull || isAlmostFull ? '100%' : isHalf ? '50%' : '0%' 
                          }}
                        >
                          <Star className="size-[18px] fill-current stroke-none" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <span className="text-sm font-bold text-foreground">
                  {localProduct.averageRating?.toFixed(1) || '0.0'}
                </span>
                <span className="text-sm font-medium text-slate-500">
                  ({localProduct.numReviews || 0} {language === 'ar' ? 'تقييم' : 'reviews'})
                </span>
              </div>

              {/* Rating Breakdown */}
              {localProduct.numReviews > 0 && (
                <div className="space-y-1.5 max-w-xs">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = localProduct.reviews?.filter((r: { rating: number }) => Math.round(r.rating) === star).length || 0;
                    const percentage = (count / localProduct.numReviews) * 100;
                    return (
                      <div key={star} className="flex items-center gap-3 group">
                        <div className="flex items-center gap-1 min-w-8">
                          <span className="text-[10px] font-bold text-slate-500">{star}</span>
                          <Star className="size-2.5 fill-yellow-400 stroke-none" />
                        </div>
                        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-yellow-400 transition-all duration-500" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 min-w-8 text-end">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-(--primary)">{product.price.toLocaleString()} {dict.common.egp}</span>
                {product.originalPrice && (
                  <span className="text-lg text-slate-400 line-through">{product.originalPrice.toLocaleString()} {dict.common.egp}</span>
                )}
              </div>
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
                  <div className="pt-2 pb-6 space-y-6">
                    {/* Review Form */}
                    {session ? (
                      <form onSubmit={handleSubmitReview} className="p-4 bg-slate-50 rounded-(--radius) border border-slate-100 space-y-4">
                        <h4 className={`text-sm font-bold uppercase tracking-widest text-slate-500 text-start ${language === 'ar' ? 'font-cairo' : ''}`}>
                          {language === 'ar' ? 'قولنا رأيك في المنتج' : 'Write a Review'}
                        </h4>
                        <div className="flex items-center gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setReviewRating(s)}
                              className="focus:outline-none transition-transform active:scale-90 bg-transparent border-none cursor-pointer p-0"
                            >
                              <Star 
                                className={`size-5 ${s <= reviewRating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} 
                              />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder={language === 'ar' ? 'اكتب رأيك هنا بكل صراحة...' : 'Share your thoughts about this product...'}
                          className={`w-full p-3 text-sm border border-slate-200 rounded-(--radius) bg-white focus:outline-none focus:border-(--primary) min-h-[80px] text-start ${language === 'ar' ? 'font-cairo' : ''}`}
                          required
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingReview}
                          className="w-full bg-(--primary) text-white py-2 rounded-(--radius) font-bold text-xs uppercase tracking-widest hover:bg-(--primary)/90 disabled:opacity-50 border-none cursor-pointer"
                        >
                          {isSubmittingReview ? (language === 'ar' ? 'جاري الإرسال...' : 'Submitting...') : (language === 'ar' ? 'إرسال التقييم' : 'Post Review')}
                        </button>
                      </form>
                    ) : (
                      <div className="p-4 bg-slate-50 rounded-(--radius) border border-slate-100 text-center">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-2 font-cairo">
                          {language === 'ar' ? 'لازم تسجل دخول عشان تسيب تقييم' : 'Sign in to write a review'}
                        </p>
                        <Link 
                          href="/login" 
                          className="text-(--primary) text-xs font-black uppercase tracking-widest hover:underline font-cairo"
                        >
                          {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                        </Link>
                      </div>
                    )}

                    {/* Review List */}
                    <div className="space-y-4">
                      {localProduct.reviews && localProduct.reviews.length > 0 ? (
                        [...localProduct.reviews]
                          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .map((rev: any, i: number) => (
                            <div key={`${rev._id}-${i}`} className="pb-4 border-b border-slate-100 last:border-0 animate-in fade-in slide-in-from-top-2 duration-500">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-sm tracking-tight">{rev.userName}</span>
                                <span className="text-[10px] text-slate-400 font-bold tracking-widest">
                                  {new Date(rev.createdAt).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                                </span>
                              </div>
                              <div className="flex items-center gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star 
                                    key={s} 
                                    className={`size-3 ${s <= rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-slate-600 leading-relaxed italic text-start">&quot;{rev.comment}&quot;</p>
                            </div>
                          ))
                      ) : (
                        <p className={`text-xs text-slate-400 text-center uppercase font-bold tracking-widest py-8 ${language === 'ar' ? 'font-cairo' : ''}`}>
                          {language === 'ar' ? 'محدش لسة ساب تقييم' : 'No reviews yet'}
                        </p>
                      )}
                    </div>
                  </div>
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
