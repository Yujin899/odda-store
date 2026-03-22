import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'أدوات أسنان للطلاب | عُدّة (عدة)',
  description: 'متجر عُدّة (عدة) - حلول متكاملة لطلاب طب الأسنان. Dental Student Store - Comprehensive solutions for dental students.',
};
import { ChevronRight, Box } from 'lucide-react';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductCard } from '@/components/products/ProductCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Badge from '@/models/Badge';
import { Product } from '@/models/Product';
import { cookies } from 'next/headers';
import en from '@/dictionaries/en.json';
import ar from '@/dictionaries/ar.json';
import type { CategoryDoc, ProductDoc, BadgeDoc } from '@/types/models';
import type { Product as ProductType } from '@/types/store';

import { unstable_cache } from 'next/cache';

type SearchParams = Promise<{ [key: string]: string | undefined }>;

async function getAllCategories() {
  return unstable_cache(
    async () => {
      await connectDB();
      const categories = await Category.find().lean<CategoryDoc[]>();
      return categories.map((c) => ({
        id: c._id.toString(),
        name: c.name,
        nameAr: c.nameAr,
        slug: c.slug,
        image: c.image ?? null,
      }));
    },
    ['categories-list'],
    { revalidate: 3600, tags: ['categories-list'] }
  )();
}

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  const category = searchParams.category as string | undefined;
  const search = searchParams.search as string | undefined;
  const sort = searchParams.sort as string | undefined;
  const page = parseInt((searchParams.page as string) || '1');
  const limit = parseInt((searchParams.limit as string) || '12');
  
  // Create a cache key based on search params
  const cacheKey = JSON.stringify({ category, search, sort, page, limit });

  return unstable_cache(
    async () => {
      await connectDB();
      void Category.modelName;
      void Badge.modelName;

      const skip = (page - 1) * limit;
      const query: Record<string, string | number | boolean | object> = {};
      
      if (category) {
        const cat = await Category.findOne({ slug: category }).lean<CategoryDoc>();
        if (cat) query.categoryId = cat._id;
      }
      
      if (search) query.name = { $regex: search, $options: 'i' };

      let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
      if (sort === 'price_asc') sortOption = { price: 1 };
      if (sort === 'price_desc') sortOption = { price: -1 };
      if (sort === 'newest') sortOption = { createdAt: -1 };

      const [products, total] = await Promise.all([
        Product.find(query)
          .populate({ path: 'categoryId', strictPopulate: false })
          .populate({ path: 'badgeId', strictPopulate: false })
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .lean<ProductDoc[]>(),
        Product.countDocuments(query),
      ]);

      // Strict DTO Mapping to prevent internal data leaks
      const sanitizedProducts: ProductType[] = products.map((p) => {
        const cat = p.categoryId as unknown as CategoryDoc | null;
        const badge = p.badgeId as unknown as BadgeDoc | null;
        
        return {
          id: p._id.toString(),
          name: p.name,
          nameAr: p.nameAr,
          slug: p.slug,
          price: p.price,
          originalPrice: p.originalPrice ?? null,
          images: (p.images || []).map((img, idx) => ({
            url: img.url,
            isPrimary: img.isPrimary,
            order: (img as any).order ?? idx
          })),
          category: cat ? {
            id: cat._id.toString(),
            _id: cat._id.toString(),
            name: cat.name,
            nameAr: cat.nameAr || undefined
          } : { name: 'Uncategorized' },
          badge: badge ? {
            name: badge.name || badge.nameAr || '',
            nameAr: badge.nameAr,
            color: badge.color,
            textColor: badge.textColor
          } : null,
          _id: p._id.toString(),
          stock: p.stock,
          featured: p.featured,
          description: p.description || '',
          createdAt: p.createdAt.toISOString(),
          averageRating: p.averageRating || 0,
          numReviews: p.numReviews || 0
        };
      });

      return {
        products: sanitizedProducts,
        pagination: {
          totalItems: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          limit
        }
      };
    },
    [`products-list-${cacheKey}`],
    { revalidate: 60, tags: ['products-list'] }
  )();
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';
  const dict = locale === 'en' ? en : ar;

  const resolvedParams = await searchParams;
  const { products, pagination } = await getProducts(resolvedParams);
  const categories = await getAllCategories();

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 0;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (resolvedParams.category) params.set('category', resolvedParams.category as string);
    if (resolvedParams.sort) params.set('sort', resolvedParams.sort as string);
    if (resolvedParams.search) params.set('search', resolvedParams.search as string);
    params.set('page', pageNumber.toString());
    return `/products?${params.toString()}`;
  };

  // JSON-LD Structured Data for Products Listing
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: locale === 'ar' ? 'كتالوج المنتجات | عُدّة' : 'Product Catalog | Odda',
    itemListElement: products.map((p, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: locale === 'ar' ? p.nameAr || p.name : p.name,
        url: `https://www.odda-store.com/product/${p.slug}`,
        image: p.images?.[0]?.url,
        offers: {
          '@type': 'Offer',
          priceCurrency: 'EGP',
          price: p.price,
        }
      }
    }))
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 py-12">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-primary transition-colors">{dict.common.home}</Link>
            <ChevronRight className="size-3 text-muted-foreground stroke-[3px] rtl:-scale-x-100" />
            <span className="text-foreground">{dict.productsPage.instruments}</span>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground uppercase">{dict.productsPage.ourCatalog}</h1>
          <p className="mt-2 text-muted-foreground max-w-2xl font-light">{dict.productsPage.catalogDesc}</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <ProductFilters 
            currentCategory={resolvedParams.category as string} 
            currentSort={resolvedParams.sort as string}
            initialCategories={categories}
            locale={locale}
          />
          
          <section className="flex-1 space-y-12">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} locale={locale} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          href={createPageUrl(Math.max(1, currentPage - 1))}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            href={createPageUrl(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext 
                          href={createPageUrl(Math.min(totalPages, currentPage + 1))}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Box className="size-16 text-muted-foreground/10 mb-6 stroke-[1px]" />
                <p className="text-lg font-bold uppercase tracking-[0.2em] text-foreground">{dict.common.noProductsFound}</p>
                <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-widest leading-loose max-w-sm">{dict.productsPage.noMatchMsg}</p>
                <Link 
                   href="/products"
                   className="mt-10 px-10 py-4 bg-primary text-white font-bold rounded-(--radius) uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all outline-none border-none cursor-pointer"
                >
                  {dict.productsPage.clearAllFilters}
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
