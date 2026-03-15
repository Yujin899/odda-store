import Link from 'next/link';
import { ChevronRight, Search, Box } from 'lucide-react';
import { Suspense } from 'react';
import { ProductCard } from '@/components/products/ProductCard';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/models/Product';
import Category from '@/models/Category';
import Badge from '@/models/Badge';

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

async function getSearchResults(query: string) {
  if (!query) return { products: [], total: 0 };
  
  await connectDB();
  Category;
  Badge;

  const products = await Product.find({ name: { $regex: query, $options: 'i' } })
    .populate({ path: 'categoryId', strictPopulate: false })
    .populate({ path: 'badgeId', strictPopulate: false })
    .lean();

  return { 
    products: products.map((p: any) => ({
      _id: p._id.toString(),
      name: p.name,
      nameAr: p.nameAr,
      slug: p.slug,
      price: p.price,
      compareAtPrice: p.compareAtPrice ?? null,
      images: p.images,
      category: p.categoryId ? {
        _id: p.categoryId._id.toString(),
        name: p.categoryId.name
      } : null,
      badge: p.badgeId ? {
        name: p.badgeId.name,
        color: p.badgeId.color
      } : null,
      stock: p.stock
    })), 
    total: products.length 
  };
}

async function SearchResultsContent({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const query = (searchParams.q as string) || '';
  const { products } = await getSearchResults(query);

  return (
    <main className="max-w-7xl mx-auto w-full px-6 md:px-12 lg:px-24 py-12">
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4 uppercase tracking-widest font-bold">
          <Link href="/" className="hover:text-(--primary) transition-colors">Home</Link>
          <ChevronRight className="size-3 text-muted-foreground stroke-[3px]" />
          <Link href="/products" className="hover:text-(--primary) transition-colors">All Instruments</Link>
          <ChevronRight className="size-3 text-muted-foreground stroke-[3px]" />
          <span className="text-foreground">Search</span>
        </nav>
        
        {query ? (
          <>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground uppercase">
              Search results for &quot;{query}&quot;
            </h1>
            <p className="mt-2 text-muted-foreground font-light">
              Found {products.length} {products.length === 1 ? 'instrument' : 'instruments'} matching your search.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground uppercase">
              Search Catalog
            </h1>
            <p className="mt-2 text-muted-foreground font-light">
              Enter a search term to find instruments in our clinical catalog.
            </p>
          </>
        )}
      </div>

      <div className="mt-12">
        {query ? (
          products.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-8">
              {products.map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 border border-slate-100 rounded-2xl">
              <Box className="size-16 text-muted-foreground/10 mb-6 stroke-[1px]" />
              <p className="text-lg font-bold uppercase tracking-[0.2em] text-foreground">No results found for &quot;{query}&quot;</p>
              <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-widest leading-loose max-w-sm">
                Try different keywords or browse our full catalog to find what you are looking for.
              </p>
              <Link
                href="/products"
                className="mt-10 px-10 py-4 bg-(--primary) text-white font-bold rounded-(--radius) uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 transition-all inline-block"
              >
                Back to Products
              </Link>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-slate-50 border border-slate-100 rounded-2xl">
            <Search className="size-16 text-muted-foreground/10 mb-6 stroke-[1px]" />
            <p className="text-lg font-bold uppercase tracking-[0.2em] text-foreground">Awaiting search term</p>
            <p className="text-xs text-muted-foreground mt-4 font-medium uppercase tracking-widest leading-loose max-w-sm">
              Enter a clinical tool name or category in the search bar above to begin.
            </p>
            <Link
              href="/products"
              className="mt-10 px-10 py-4 border border-(--primary)/20 text-(--primary) font-bold rounded-(--radius) uppercase tracking-widest text-[10px] shadow-sm hover:bg-slate-100 transition-all inline-block"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedParams = await searchParams;
  
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]">Loading search results...</div>}>
        <SearchResultsContent searchParams={resolvedParams} />
      </Suspense>
    </div>
  );
}
