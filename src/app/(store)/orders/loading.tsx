import { Package } from 'lucide-react';

export default function OrdersLoading() {
  return (
    <div className="bg-background min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-black uppercase tracking-tight italic mb-8">My Orders</h1>
        
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-card border border-border rounded-(--radius) overflow-hidden shadow-sm">
              <div className="bg-muted p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
                <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-sm">
                  <div className="space-y-2">
                    <div className="h-3 w-20 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-5 w-24 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-12 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-5 w-24 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-12 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-5 w-16 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                </div>
                
                <div className="h-6 w-24 bg-slate-200 animate-pulse rounded-full shrink-0"></div>
              </div>

              <div className="p-4 sm:px-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-48 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-4 w-12 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
                    <div className="h-4 w-12 bg-slate-200 animate-pulse rounded"></div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <div className="h-4 w-32 bg-slate-200 animate-pulse rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
