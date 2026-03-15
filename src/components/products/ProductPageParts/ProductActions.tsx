import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { AddToCartSection } from '@/components/shared/AddToCartSection';

interface ProductActionsProps {
  product: any;
  stock: number;
}

export function ProductActions({ product, stock }: ProductActionsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <AddToCartSection
      productId={String(product._id)}
      productName={product.name}
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

function bcn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
