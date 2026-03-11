'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCartUIStore } from '@/store/useCartUIStore';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/free-mode';

const BEST_SELLERS = [
  {
    id: 1,
    name: 'Extraction Forceps Set',
    price: 2450,
    originalPrice: 2900,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFOnaXf-pcf27Zx2_WgCqc2NASUp-MUlfoqAwkMf1aSdYP87jxU8g1x1dAE78RkutFm_mWBkU5sBkmpCjUpfTxatf8CjUHfQ9aaRBq_md1Yus4HWN1RhsDnO1tyFFTKAfNrL-P9Ef_Lu8wwxLb2tJEG_G7nLRMoUgJ8O5IWSiEupSdhj68-WZLYHlziAscr3DIclGyIojz3-M_EIssCl-HXbMLTcgLIxJSzrP2bgiFQimo_OkK3GaCKGTlWKKw7qA002sAG8J2lg',
  },
  {
    id: 2,
    name: 'LED Diagnostic Kit',
    price: 1890,
    originalPrice: 2200,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC320re3pAYJxJ3Eyjk3n29jeYrthqbA1btvSU7mwXbTLf0pmPA9n3QIQLPTAj6Ruo9iAfUp-iudUViUU31ucQZvFMeO01qY5xw_B3qnMHilqoURyaWzGpH1H_s8MjKgBJETKrOnqKItfKzJd3ltgydL505BnYtGJ6GifBovzobM_aRPKfudQ26NEsx_JkoVAUm522rY2nJpdce2ToYtLB_MF9wUDB32zgFKq_NKGfGoKLB8zMQ_7xtY78Nd0UOBGchyjgQ4EDq8w',
  },
  {
    id: 3,
    name: 'Restorative Master Kit',
    price: 3200,
    originalPrice: 3800,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLvvMwPU1Vpp0xrBY8ED6EpdspOhRjyBWQilSKmsKfLMxr6IPJWhx-M0zHFaEtJryiNEUK3pizQaz6luJRv0sP9JxhvY6PXjGLk5qokOF_gHRU-mhjh1nOwvmsKbmp5kB3TJQ1Qsf1naaZEBk38wBCK5FNK4iAgKdRPDcc-u3q7fUNMqZJq5b-AGKrm8hUuJdcMVR9d07avZ3EQDAeNqzI0rtuDgf2fw90-pqXBwElSOB4e3JTB_31bS9Pz1UfNogOlUskttiXTw',
  },
  {
    id: 4,
    name: 'Autoclave Safe Trays',
    price: 750,
    originalPrice: 950,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB1ctybgfplfTm0wOfBLlLkoyg7cC0PNR5rjlRuFV-EvIjpt8RcsXq7GuUv8b3R-qvQ2oZDEkbr3_Db2kNYrSnnrPewNgR8_SX0ZSQFz5VeZ5zzHAhpDqDjiADbYp_OEXYirmgM_u3RjkfCrp6BlgVMU2g7i0XUbweEX7ve4ZfYLZWkLGlu2E4PuFE_vjQ5YFdmynmoDIg_i-ROckKgJYL3dYnApUB2LpC5aR2ZJ8HAtuZHiBdUpnaKVp3dPw_zIrvJUKoYuiSFQ',
  },
];

export default function Home() {
  const router = useRouter();
  const { openCart } = useCartUIStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    openCart();
  };


  return (
    <>
      {/* 2. Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Swiper
          modules={[Autoplay, Navigation]}
          autoplay={{ delay: 5000 }}
          navigation={{
            prevEl: '.hero-prev',
            nextEl: '.hero-next',
          }}
          loop={true}
          className="h-full w-full"
        >
          <SwiperSlide>
            <div className="relative h-full w-full">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ 
                  backgroundImage: "linear-gradient(rgba(10, 25, 47, 0.6), rgba(10, 25, 47, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_raKXzW8-1YANSU88UDpjTPWY3ejoZPSpu5eHR5v-GAsPC6c9sTeACSVO2wAq8ntts5513gbdA_RdXkJ9WpZUnonq6ZegV6KrRfI6G9dGMvIjRlG-TfR1o01rx3BOfUhE_BtSIKEufemcwDTxliqTKv1xVfrkTEPeU7Z-PTiKADrU9igSUTWWkGF-br3mUTnJ6nBwn5lUlDjet7Y6yDHjpY-6MbiSdGSKmu5Q0bA-FBsPAa6iaD-7DamZtEsQLUX1lOmChdprEA')" 
                }}
              ></div>
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-background text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Browse our full collection</h1>
                <p className="text-background/90 text-lg md:text-xl mb-10 max-w-2xl font-light">Precision Dental Tools for the Modern Student. Clinical excellence starts with the right equipment.</p>
                <Link href="/products">
                  <button className="bg-(--primary) hover:bg-(--primary)/90 text-background px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-sm cursor-pointer border-none outline-none">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="relative h-full w-full">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ 
                  backgroundImage: "linear-gradient(rgba(10, 25, 47, 0.6), rgba(10, 25, 47, 0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKVd8MH2HFNM5Jiq53iKbYwSos9ZqxTB3BCnn02hWGsiq2hdnRumXCtQ08Ki7X5iFc-YXTw-nZirWI5GMKKbDHb47vSOSlESml0D8VAOfHOtg-glW3GAKvB3BCL2f7ZMEPzJA3Rc_xgR3sA_hGAS8LgwttyViSz69yVoe5d13bLWpuYSSFkobUAZp-9gTtRnr5XXenJGKVRg_iYFj4Jw-ynbfiEnibVrPulixV7m39BVAx0W17rMLsADC1DgsmF5yeoaq9dA0BMg')" 
                }}
              ></div>
              <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-[var(--background)] text-5xl md:text-7xl font-black mb-6 tracking-tight uppercase">Clinical Grade Excellence</h1>
                <p className="text-[var(--background)]/90 text-lg md:text-xl mb-10 max-w-2xl font-light">Engineered for accuracy. Trusted by the leading dental universities nationwide.</p>
                <Link href="/products">
                  <button className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--background)] px-10 py-4 text-sm font-bold uppercase tracking-widest transition-all rounded-sm cursor-pointer border-none outline-none">
                    View Catalog
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
          
          <button className="hero-prev absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/50 hover:text-white transition-colors outline-none border-none cursor-pointer bg-transparent">
            <span className="material-symbols-outlined text-4xl">chevron_left</span>
          </button>
          <button className="hero-next absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white/50 hover:text-white transition-colors outline-none border-none cursor-pointer bg-transparent">
            <span className="material-symbols-outlined text-4xl">chevron_right</span>
          </button>
        </Swiper>
      </section>

      {/* 3. Trust/Authority Banner */}
      <section className="border-b border-navy/10 py-6 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="material-symbols-outlined text-[var(--navy)]/60 font-normal">verified_user</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Trusted by Dental Students</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="material-symbols-outlined text-[var(--navy)]/60 font-normal">medical_services</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Clinical Grade Quality</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="material-symbols-outlined text-[var(--navy)]/60 font-normal">local_shipping</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Campus Delivery</span>
          </div>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <span className="material-symbols-outlined text-[var(--navy)]/60 font-normal">lock</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--navy)]/70">Secure Payments</span>
          </div>
        </div>
      </section>

      {/* 4. Shop By Category */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-black mb-12 uppercase tracking-tight text-[var(--navy)]">Shop By Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          <Link href="/products" className="group relative aspect-square w-full h-full overflow-hidden cursor-pointer rounded-sm">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsSDBXC3Tmv35vO3vtTcG7KMSGtXrCuv4jktjlKEs05PyNLcx1oBE7iG6RRwhPUrX_yu8QKZQ8uQMt5cVCCWpdhv72H6g8tA63jVUv0CCnaAfZpeVkF9xmgIUxVV7YzFHMVTK4lmHyMFt-FimzRDxombe2vf-3oZqXyNLRToVIbNvzghnIpJ-4mK-7eb6ECQRE0ZY6f8H6tnOkkqc6X0fH99qURqb4_haYSjAzqqPMMIGWHlKF0tzYFs12BEG1U4Ev1ZANyf0-cQ')" }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[var(--background)] text-xl font-bold uppercase tracking-tighter">Student Bundles</span>
            </div>
          </Link>
          <Link href="/products" className="group relative aspect-square w-full h-full overflow-hidden cursor-pointer rounded-sm">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsUsQp7EvDPXWeoYCXyeyOW7HinJ2OvusYAGOGuiPMGBzKh3NjeXGrES8orJtiIkpDJVORpIewsffpFEBbyZ12jzKoqKM9BnM_TIxFI9xILKw0MpV9uxJHBdf1NK1HCGmWyOsQtzT4M2Iwtkovxw6QMr05vR00dnqVzjLxHZ8Z4k-d8o-g8_LygNvmzo_3e_hhXtb0PR5KHsCjFmLgG6aFxe3Vi_yJy6tXAug15uLIXSGAB0DB_E_-jHn_Ijpx0zQTSOTtNtG6UA')" }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[var(--background)] text-xl font-bold uppercase tracking-tighter">Diagnostic Tools</span>
            </div>
          </Link>
          <Link href="/products" className="group relative aspect-square w-full h-full overflow-hidden cursor-pointer rounded-sm">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBo-si71HWa8mn_-Qr6bwZt_LpcQKbTtygvqa7WM7Bkt3iXCVkxyPUPA5Zy63acVTNqLecHH_o1sdH-lDPfqUoofrWGD5OFi3BQV46aka_QmSPv5iH2sBTTJfg3aK2sK8UtF0I3CqPhP-C1RdeMLzjqQIELZwX_pgAXd_T5Nq9oJTakDtEMORFGmKL9TrO2QBrmJfKa1EPiQ4O5NpAad81wwUxtcrE3JCAdKn4_K-pVj_YRQP41MGpjd4BOOipo4XSCIcEAzwoqgA')" }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[var(--background)] text-xl font-bold uppercase tracking-tighter">Surgical Instruments</span>
            </div>
          </Link>
          <Link href="/products" className="group relative aspect-square w-full h-full overflow-hidden cursor-pointer rounded-sm">
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCPxHW6mJ7e67DhfYWSptqJzgR0LblgiHNZgSpn26YzJBs7zgGBA27G2uzM2nEDdT0mKpriSEY565CEvFxAoneGMLLVHWkJe44ZSpAP6OjLkK9wiV4TXBOJW-sC3xq76s5gqr6zqdmsd946TsHJYum1I9GwJiJUUeFSnnCeXfYfrkuGrYHf1sXHw6VLgLWEoj8bA40kn71pT1qf96iMHNsbfqdMWU_FWL2FcFbGI9DpepJdIjr5_4XSR-27cdyGSWJcjENipZUYyQ')" }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[var(--background)] text-xl font-bold uppercase tracking-tighter">Endodontics</span>
            </div>
          </Link>
        </div>
      </section>

      {/* 5. Best Sellers Slider */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--navy)]">Best Sellers</h2>
            <div className="hidden sm:flex gap-2">
              <button className="best-sellers-prev w-12 h-12 border border-navy/20 flex items-center justify-center hover:bg-[var(--navy)] hover:text-[var(--background)] transition-colors rounded-sm text-[var(--navy)] bg-transparent outline-none cursor-pointer">
                <span className="material-symbols-outlined font-normal">chevron_left</span>
              </button>
              <button className="best-sellers-next w-12 h-12 border border-navy/20 flex items-center justify-center hover:bg-[var(--navy)] hover:text-[var(--background)] transition-colors rounded-sm text-[var(--navy)] bg-transparent outline-none cursor-pointer">
                <span className="material-symbols-outlined font-normal">chevron_right</span>
              </button>
            </div>
          </div>
          
          <Swiper
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
            {BEST_SELLERS.map((product) => (
              <SwiperSlide key={product.id}>
                <div 
                  className="bg-[var(--background)] group overflow-hidden rounded-sm cursor-pointer"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  <div className="aspect-square bg-[var(--muted)] relative overflow-hidden">
                    <img 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                      alt={product.name} 
                      src={product.image} 
                    />
                    {/* Hot Now Badge */}
                    <div className="absolute top-3 left-3 bg-[#E11D48] text-background text-[10px] font-black px-2.5 py-1 rounded-(--radius) uppercase tracking-widest z-10 shadow-lg flex items-center gap-1">
                      <span>🔥</span> Hot Now
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-1 uppercase tracking-tight text-[var(--foreground)] truncate">{product.name}</h3>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-black text-[var(--foreground)]">{product.price} EGP</span>
                      <span className="text-sm text-[var(--muted-foreground)] line-through opacity-70">{product.originalPrice} EGP</span>
                    </div>
                    <button 
                      onClick={handleAddToCart}
                      className="w-full bg-(--primary) py-3 text-background text-xs font-bold uppercase tracking-widest hover:bg-navy transition-colors rounded-sm outline-none border-none cursor-pointer"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* 7. Peer Reviews */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-navy/10">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--navy)]">What Students Say</h2>
          <div className="hidden sm:flex gap-2">
            <button className="testimonials-prev w-10 h-10 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-background transition-colors rounded-(--radius) text-navy bg-transparent outline-none cursor-pointer">
              <span className="material-symbols-outlined font-normal">chevron_left</span>
            </button>
            <button className="testimonials-next w-10 h-10 border border-navy/20 flex items-center justify-center hover:bg-navy hover:text-background transition-colors rounded-(--radius) text-navy bg-transparent outline-none cursor-pointer">
              <span className="material-symbols-outlined font-normal">chevron_right</span>
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
                {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined font-normal text-lg!">star</span>)}
              </div>
              <p className="italic mb-6 text-[var(--navy)]/70 font-light text-sm leading-relaxed">&quot;The quality of the surgical set is indistinguishable from professional kits. Delivery to campus was smooth and right on time.&quot;</p>
              <p className="font-bold uppercase text-[10px] tracking-widest text-[var(--navy)]">— Ahmed S., Cairo University</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="border border-navy/10 p-7 rounded-[var(--radius)] bg-background hover:shadow-md transition-shadow h-full">
              <div className="flex text-[var(--primary)] mb-4">
                {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined font-normal text-lg!">star</span>)}
              </div>
              <p className="italic mb-6 text-[var(--navy)]/70 font-light text-sm leading-relaxed">&quot;Odda saved me a lot of hassle. Getting all my restorative tools in one bundle was a lifesaver during exams.&quot;</p>
              <p className="font-bold uppercase text-[10px] tracking-widest text-[var(--navy)]">— Sarah K., Ain Shams</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="border border-navy/10 p-7 rounded-[var(--radius)] bg-background hover:shadow-md transition-shadow h-full">
              <div className="flex text-[var(--primary)] mb-4">
                {[1,2,3,4,5].map(s => <span key={s} className="material-symbols-outlined font-normal text-lg!">star</span>)}
              </div>
              <p className="italic mb-6 text-[var(--navy)]/70 font-light text-sm leading-relaxed">&quot;Pricing is very competitive for this level of quality. The mirror visibility is amazing compared to cheap alternatives.&quot;</p>
              <p className="font-bold uppercase text-[10px] tracking-widest text-[var(--navy)]">— Omar M., Alexandria Uni</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </>
  );
}
