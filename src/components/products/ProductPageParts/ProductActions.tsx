import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { AddToCartSection } from '@/components/shared/AddToCartSection';
import type { Product } from '@/types/store';

interface ProductActionsProps {
  product: Product;
  stock: number;
}

export function ProductActions({ product, stock }: ProductActionsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <AddToCartSection
      productId={product.id}
      productName={product.name}
      productNameAr={product.nameAr}
      price={product.price}
      image={product.images?.[0]?.url || product.image || ''}
      slug={product.slug}
      type="product"
      stock={stock}
      dict={{
        addToCart: dict.common.addToCart
      }}
    />
  );
}
