import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, HeadphonesIcon, ChevronRight } from 'lucide-react';
import { cookies } from 'next/headers';
import { Metadata } from 'next';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const isAr = locale === 'ar';

  return {
    title: isAr ? 'عُدّة | من نحن | Odda' : 'About Us | Odda',
    description: isAr 
      ? 'تعرف على عُدّة - المتجر المتخصص في توفير أدوات الأسنان لطلاب الأسنان في مصر. جودة، دقة، وسرعة.'
      : 'Learn about Odda - Egypt\'s trusted source for dental and surgical instruments for students and professionals.',
  };
}

export default async function AboutPage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const language = locale as 'en' | 'ar';
  const dict = language === 'en' ? en : ar;
  const isAr = language === 'ar';

  const features = [
    {
      icon: <ShieldCheck className="size-8 text-(--primary) stroke-[1.5px]" />,
      title: dict.aboutPage.clinicalTools,
      description: dict.aboutPage.clinicalDesc
    },
    {
      icon: <Truck className="size-8 text-(--primary) stroke-[1.5px]" />,
      title: dict.aboutPage.campusDelivery,
      description: dict.aboutPage.campusDesc
    },
    {
      icon: <HeadphonesIcon className="size-8 text-(--primary) stroke-[1.5px]" />,
      title: dict.aboutPage.expertSupport,
      description: dict.aboutPage.expertDesc
    }
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-12">
          {/* Logo Section */}
          <div className="flex justify-center">
            <div className="relative w-64 h-16 grayscale brightness-0 opacity-90">
              <Image 
                src="/logo.png" 
                alt={isAr ? 'شعار عُدّة' : 'Odda Logo'} 
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Intro Section */}
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none italic">
              {dict.aboutPage.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
              {dict.aboutPage.desc}
            </p>
          </div>

          {/* Features Grid */}
          <div className="w-full pt-16">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-(--primary) mb-12">
              {dict.aboutPage.whyOdda}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div key={idx} className="bg-slate-50/50 border border-slate-100 p-8 rounded-(--radius) text-start space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="bg-white size-16 rounded-(--radius) flex items-center justify-center shadow-md border border-slate-50">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="pt-20 w-full">
            <Link href="/products" className="group w-full md:w-max mx-auto px-12 py-6 bg-foreground text-background flex items-center justify-center gap-4 font-black text-[12px] uppercase tracking-[0.3em] rounded-(--radius) shadow-2xl hover:-translate-y-1 transition-all active:scale-95">
              {dict.aboutPage.browseOddas}
              <ChevronRight className="size-5 transition-transform stroke-[3px] rtl:rotate-180 rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
