import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { IBundle } from '@/models/Bundle';
import { RatingSummary } from '@/components/shared/RatingSummary';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface BundleCardProps {
  bundle: IBundle;
  locale: string;
  dict: {
    common: Record<string, string>;
    home: Record<string, string>;
    [key: string]: unknown;
  };
}

export function BundleCard({ bundle, locale, dict }: BundleCardProps) {
  const name = (locale === 'ar' && bundle.nameAr) ? bundle.nameAr : bundle.name;
  const items = (locale === 'ar' && bundle.bundleItemsAr && bundle.bundleItemsAr.length > 0) 
    ? bundle.bundleItemsAr 
    : bundle.bundleItems;

  return (
    <Card 
      className="group relative border-none ring-0 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 bg-white"
    >
      {/* Image Section with bottom vignette */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <Image 
          src={bundle.images[0] || 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?q=80&w=2070&auto=format&fit=crop'}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
        />
        
        {/* Bottom Vignette for depth */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent opacity-60 pointer-events-none" />
      </div>

      {/* Content Section */}
      <CardContent className="p-8 grow flex flex-col relative bg-gradient-to-b from-white to-slate-50/30">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        
        <div className="mb-6">
          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 tracking-tight leading-snug group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
          <RatingSummary 
            rating={bundle.averageRating} 
            numReviews={bundle.numReviews} 
            variant="compact"
            className="mb-2"
          />
          <div className="w-12 h-1 bg-primary rounded-full transform origin-left transition-transform duration-500 scale-x-0 group-hover:scale-x-100" />
        </div>

        {/* Bundle Items List */}
        <div className="space-y-4 mb-10 grow">
          {items?.slice(0, 4).map((item: string, idx: number) => (
            <div key={idx} className={`flex items-start gap-3.5 ${locale === 'ar' ? 'flex-row-reverse text-end' : 'text-start'}`}>
              <div className="mt-1 flex items-center justify-center bg-white shadow-sm border border-slate-100 p-1 rounded-full group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                <CheckCircle2 className="size-2.5 text-primary group-hover:text-white transition-colors" />
              </div>
              <span className="text-xs text-slate-500 font-semibold leading-relaxed tracking-wide group-hover:text-slate-700 transition-colors">{item}</span>
            </div>
          ))}
        </div>

        {/* Price & Footer */}
        <div className={`pt-8 border-t border-slate-200/60 flex items-center justify-between ${locale === 'ar' ? 'flex-row-reverse' : ''}`}>
          <div className="flex flex-col gap-0.5">
            {bundle.originalPrice && (
              <span className="text-xs text-slate-300 line-through font-bold tracking-tighter">
                {bundle.originalPrice} {dict.common.egp}
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-foreground group-hover:text-primary transition-colors duration-300">
                {bundle.price}
              </span>
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{dict.common.egp}</span>
            </div>
          </div>

          <Button 
            asChild
            className="group/btn relative h-12 px-6 transition-all duration-500"
          >
            <Link href={`/bundle/${bundle.slug}`}>
              <span className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">{locale === 'ar' ? 'عرض التفاصيل' : 'Details'}</span>
                <ArrowRight className={`size-4 transition-transform group-hover/btn:translate-x-1.5 ${locale === 'ar' ? 'rotate-180 group-hover/btn:-translate-x-1.5' : ''}`} />
              </span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
