import Link from 'next/link';
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
import { Product } from '@/models/Product';
import Category from '@/models/Category';
import Badge from '@/models/Badge';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function getProducts(searchParams: { [key: string]: string | string[] | undefined }) {
  await connectDB();
  Category;
  Badge;

  const categoryId = searchParams.categoryId as string | undefined;
  const search = searchParams.search as string | undefined;
  const sort = searchParams.sort as string | undefined;
  const page = parseInt((searchParams.page as string) || '1');
  const limit = parseInt((searchParams.limit as string) || '12');
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {};
  if (categoryId) query.categoryId = categoryId;
  if (search) query.name = { $regex: search, $options: 'i' };

  let sortOption: any = { createdAt: -1 };
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
      .lean(),
    Product.countDocuments(query),
  ]);

  return {
    products: JSON.parse(JSON.stringify(products)),
    pagination: {
      totalItems: total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit
    }
  };
}

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;
  const { products, pagination } = await getProducts(resolvedParams);

  const currentPage = pagination?.currentPage || 1;
  const totalPages = pagination?.totalPages || 0;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (resolvedParams.categoryId) params.set('categoryId', resolvedParams.categoryId as string);
    if (resolvedParams.sort) params.set('sort', resolvedParams.sort as string);
    if (resolvedParams.search) params.set('search', resolvedParams.search as string);
    params.set('page', pageNumber.toString());
    return `/products?${params.toString()}`;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[var(--background)]">
      <main className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 py-12">
        <div className="mb-10">
          <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-4 uppercase tracking-widest font-bold">
            <Link href="/" className="hover:text-(--primary) transition-colors">Home</Link>
            <ChevronRight className="size-3 text-muted-foreground stroke-[3px]" />
            <span className="text-[var(--foreground)]">Instruments</span>
          </nav>
          <h1 className="text-4xl font-extrabold tracking-tight text-[var(--foreground)] uppercase">Our Catalog</h1>
          <p className="mt-2 text-[var(--muted-foreground)] max-w-2xl font-light">High-precision clinical tools and diagnostic sets engineered for excellence in modern healthcare environments.</p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12">
          <ProductFilters 
            currentCategory={resolvedParams.categoryId as string} 
            currentSort={resolvedParams.sort as string}
          />
          
          <section className="flex-1 space-y-12">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
                  {products.map((product: any) => (
                    <ProductCard key={product._id} product={product} />
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
                <p className="text-lg font-bold uppercase tracking-[0.2em] text-foreground">No instruments match your criteria</p>
                <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-widest leading-loose max-w-sm">Try relaxing your filters or cleaning up your search to find what you are looking for.</p>
                <Link 
                   href="/products"
                   className="mt-10 px-10 py-4 bg-(--primary) text-white font-bold rounded-(--radius) uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all outline-none border-none cursor-pointer"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
