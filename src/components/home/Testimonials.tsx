'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { useLanguageStore } from '@/store/useLanguageStore';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export function Testimonials() {
  const { language } = useLanguageStore();
  const dict = language === 'en' ? en : ar;

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 border-t border-navy/10">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--navy)]">{dict.home.whatStudentsSay}</h2>
        <div className="hidden sm:flex gap-2">
          <button className="testimonials-prev w-10 h-10 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-background transition-colors rounded-(--radius) text-navy bg-transparent outline-none cursor-pointer">
            <ChevronLeft className="size-4 stroke-[2.5px] rtl:-scale-x-100" />
          </button>
          <button className="testimonials-next w-10 h-10 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-background transition-colors rounded-(--radius) text-navy bg-transparent outline-none cursor-pointer">
            <ChevronRight className="size-4 stroke-[2.5px] rtl:-scale-x-100" />
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation, FreeMode]}
        navigation={{
          prevEl: '.testimonials-prev',
          nextEl: '.testimonials-next',
        }}
        grabCursor={true}
        freeMode={true}
        slidesPerView={1.1}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          1024: { slidesPerView: 3, spaceBetween: 28 },
        }}
        className="w-full"
      >
        <SwiperSlide>
          <div className="border border-navy/10 p-7 rounded-[var(--radius)] bg-background hover:shadow-md transition-shadow h-full">
            <div className="flex text-[var(--primary)] mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} className="size-4 fill-current stroke-[1.5px]" />)}
            </div>
            <p className="italic mb-6 text-[var(--navy)]/70 font-light text-sm leading-relaxed">
              {language === 'ar' ? '"جودة الطقم الجراحي لا يمكن تمييزها عن الأطقم الاحترافية. التوصيل للجامعة كان سلساً وفي الوقت المحدد تماماً."' : '"The quality of the surgical set is indistinguishable from professional kits. Delivery to campus was smooth and right on time."'}
            </p>
            <p className="font-bold uppercase text-[10px] tracking-widest text-[var(--navy)]">
              {language === 'ar' ? '— أحمد س.، جامعة القاهرة' : '— Ahmed S., Cairo University'}
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="border border-navy/10 p-7 rounded-[var(--radius)] bg-background hover:shadow-md transition-shadow h-full">
            <div className="flex text-[var(--primary)] mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} className="size-4 fill-current stroke-[1.5px]" />)}
            </div>
            <p className="italic mb-6 text-[var(--navy)]/70 font-light text-sm leading-relaxed">
              {language === 'ar' ? '"أودا وفرت عليّ الكثير من الجهد. الحصول على جميع أدوات الحشو في حزمة واحدة أنقذني أثناء الامتحانات."' : '"Odda saved me a lot of hassle. Getting all my restorative tools in one bundle was a lifesaver during exams."'}
            </p>
            <p className="font-bold uppercase text-[10px] tracking-widest text-[var(--navy)]">
              {language === 'ar' ? '— سارة ك.، عين شمس' : '— Sarah K., Ain Shams'}
            </p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="border border-navy/10 p-7 rounded-[var(--radius)] bg-background hover:shadow-md transition-shadow h-full">
            <div className="flex text-[var(--primary)] mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} className="size-4 fill-current stroke-[1.5px]" />)}
            </div>
            <p className="italic mb-6 text-[var(--navy)]/70 font-light text-sm leading-relaxed">
              {language === 'ar' ? '"الأسعار تنافسية جداً مقارنة بهذا المستوى من الجودة. وضوح المرآة مذهل مقارنة بالبدائل الرخيصة."' : '"Pricing is very competitive for this level of quality. The mirror visibility is amazing compared to cheap alternatives."'}
            </p>
            <p className="font-bold uppercase text-[10px] tracking-widest text-[var(--navy)]">
              {language === 'ar' ? '— عمر م.، جامعة الإسكندرية' : '— Omar M., Alexandria Uni'}
            </p>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
