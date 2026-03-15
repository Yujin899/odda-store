import React from 'react';
import { useLanguageStore } from '@/store/useLanguageStore';
import { getDictionary } from '@/dictionaries';
import { AddToCartSection } from '@/components/shared/AddToCartSection';

interface BundleActionsData {
  _id: string;
  name: string;
  nameAr?: string;
  slug: string;
  price: number;
  images: string[];
}

interface BundleActionsProps {
  bundle: BundleActionsData;
  stock: number;
}

export function BundleActions({ bundle, stock }: BundleActionsProps) {
  const { language } = useLanguageStore();
  const dict = getDictionary(language);

  return (
    <AddToCartSection
      productId={bundle._id}
      productName={bundle.name}
      productNameAr={bundle.nameAr}
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
