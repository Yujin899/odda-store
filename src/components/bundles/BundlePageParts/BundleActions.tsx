import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { AddToCartSection } from '@/components/shared/AddToCartSection';

interface BundleActionsProps {
  bundle: any;
  stock: number;
}

export function BundleActions({ bundle, stock }: BundleActionsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <AddToCartSection
      productId={String(bundle._id)}
      productName={bundle.name}
      price={bundle.price}
      image={bundle.images?.[0] || ''}
      slug={bundle.slug}
      type="bundle"
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
