import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-12">
      <div className="mb-12">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-10 w-64" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="aspect-square w-full rounded-sm" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-sm" />
            ))}
          </div>
        </div>
        
        <div className="lg:col-span-5 space-y-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-24 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-16 w-full rounded-sm" />
        </div>
      </div>
    </div>
  );
}
