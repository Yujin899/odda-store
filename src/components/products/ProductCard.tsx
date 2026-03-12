'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useCartUIStore } from '@/store/useCartUIStore';
import { useCartStore } from '@/store/useCartStore';
import { useToastStore } from '@/store/useToastStore';

export function ProductCard({ product }: { product: any }) {
  const router = useRouter();
  const { openCart } = useCartUIStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url || product.image;
  const inStock = product.stock > 0;
  const badge = product.badgeId || (product.badge ? { name: product.badge, color: product.badge.includes('Hot') ? '#E11D48' : '#0073E6', textColor: '#FFFFFF' } : null);
  const categoryName = product.categoryId?.name || product.category;

  const handleAddToCart = (e: React.MouseEvent, productToAdd: any) => {
    e.stopPropagation();
    if (productToAdd.stock <= 0) return;

    addItem({
      id: String(productToAdd._id),
      slug: productToAdd.slug,
      name: productToAdd.name,
      price: productToAdd.price,
      image: primaryImage,
    });
    openCart();
    addToast({
      title: 'Added to Cart',
      description: `${productToAdd.name} has been added to your cart.`,
      type: 'success',
    });
  };

  return (
    <div 
      className="group bg-background border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 rounded-(--radius) cursor-pointer flex flex-col h-full" 
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img 
          loading="lazy" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={product.name} 
          src={primaryImage}
        />
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex items-center justify-center">
            <span className="bg-foreground text-background text-[10px] font-black px-4 py-2 rounded-(--radius) uppercase tracking-[0.2em] shadow-2xl">Sold Out</span>
          </div>
        )}
        {badge && (
          <span 
            className="absolute top-4 left-4 text-[10px] font-black px-3 py-1.5 rounded-(--radius) uppercase tracking-widest z-10 shadow-lg"
            style={{ backgroundColor: badge.color || '#0073E6', color: badge.textColor || '#FFFFFF' }}
          >
            {badge.name}
          </span>
        )}
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h4 className="font-bold text-foreground group-hover:text-(--primary) transition-colors uppercase tracking-tight text-lg mb-1 truncate">{product.name}</h4>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-6 font-bold">{categoryName}</p>
        <div className="mt-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl font-black text-foreground">{product.price.toLocaleString()} EGP</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through opacity-50 font-light">{product.originalPrice.toLocaleString()} EGP</span>
            )}
          </div>
          <button 
            disabled={product.stock <= 0}
            onClick={(e) => handleAddToCart(e, product)}
            className={`w-full py-3 text-xs font-bold uppercase tracking-widest transition-colors rounded-sm outline-none border-none flex items-center justify-center gap-2 ${
              product.stock <= 0 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-(--primary) hover:bg-navy text-white cursor-pointer'
            }`}
          >
            <ShoppingCart className="size-4 stroke-[2px]" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
