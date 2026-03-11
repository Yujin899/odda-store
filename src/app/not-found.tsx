import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
      <div className="relative mb-8">
        <span className="text-9xl font-black text-navy/5 tabular-nums">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
            <Search className="size-10 text-primary" />
          </div>
        </div>
      </div>

      <h1 className="text-3xl font-black uppercase tracking-tight text-navy mb-4">
        Page Not Found
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-10 text-lg">
        Sorry, the page you looking for doesn't exist or has been moved to another URL.
      </p>

      <Link 
        href="/"
        className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-(--radius) font-bold uppercase tracking-wider hover:bg-navy transition-colors duration-300 shadow-xl shadow-primary/20 group"
      >
        <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
    </div>
  );
}
