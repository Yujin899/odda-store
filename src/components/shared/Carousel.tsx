'use client'
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay, FreeMode } from 'swiper/modules'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'

interface SlidesPerView {
  mobile: number
  tablet: number
  desktop: number
}

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  slidesPerView?: SlidesPerView
  spaceBetween?: number
  showNavigation?: boolean
  navigationClass?: string // unique class for prev/next buttons per instance
  locale?: 'en' | 'ar'
  className?: string
  autoplay?: boolean | { delay: number }
  freeMode?: boolean
  externalNavigation?: boolean
}

export function Carousel<T>({
  items,
  renderItem,
  slidesPerView = { mobile: 1.2, tablet: 2.5, desktop: 4 },
  spaceBetween = 16,
  showNavigation = false,
  navigationClass = 'carousel',
  locale = 'en',
  className,
  autoplay = false,
  freeMode = true,
  externalNavigation = false
}: CarouselProps<T>) {
  const [mounted, setMounted] = useState(false)
  const isRtl = locale === 'ar'

  useEffect(() => {
    // Delay setting mounted to the next tick to avoid "cascading render" lint
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, [])

  if (!mounted) return <div className={cn("w-full aspect-4/1 bg-slate-50 animate-pulse rounded-(--radius)", className)} />;
  if (!items?.length) return null;

  return (
    <div className={cn("w-full overflow-hidden relative group", className)}>
      <div className="relative">
        {showNavigation && !externalNavigation && (
          <>
            <button 
              className={cn(
                `${navigationClass}-prev absolute top-1/2 -translate-y-1/2 inset-s-0 z-20 w-10 h-10 border border-border text-foreground bg-background hover:bg-primary hover:text-primary-foreground transition-all rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 pointer-events-auto`,
                isRtl ? "translate-x-1/2" : "-translate-x-1/2"
              )}
              aria-label="Previous slide"
            >
              <ChevronLeft className="size-5 stroke-[2.5px] rtl:rotate-180" />
            </button>
            <button 
              className={cn(
                `${navigationClass}-next absolute top-1/2 -translate-y-1/2 inset-e-0 z-20 w-10 h-10 border border-border text-foreground bg-background hover:bg-primary hover:text-primary-foreground transition-all rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:opacity-0 pointer-events-auto`,
                isRtl ? "-translate-x-1/2" : "translate-x-1/2"
              )}
              aria-label="Next slide"
            >
              <ChevronRight className="size-5 stroke-[2.5px] rtl:rotate-180" />
            </button>
          </>
        )}

        <Swiper
          key={locale}
          dir={isRtl ? 'rtl' : 'ltr'}
          modules={[Navigation, Autoplay, FreeMode]}
          navigation={showNavigation ? {
            prevEl: `.${navigationClass}-prev`,
            nextEl: `.${navigationClass}-next`,
          } : false}
          spaceBetween={spaceBetween}
          grabCursor={true}
          freeMode={freeMode}
          autoplay={autoplay ? (typeof autoplay === 'object' ? autoplay : { delay: 5000 }) : false}
          breakpoints={{
            0: { slidesPerView: slidesPerView.mobile },
            640: { slidesPerView: slidesPerView.tablet },
            1024: { slidesPerView: slidesPerView.desktop },
          }}
          className="w-full overflow-visible!"
        >
          {items.map((item, index) => (
            <SwiperSlide key={index} className="h-auto">
              {renderItem(item, index)}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  )
}
