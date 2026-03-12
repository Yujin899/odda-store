import { create } from 'zustand';

export interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
}

interface RecentlyViewedStore {
  items: Product[];
  addViewedItem: (item: Product) => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>((set) => ({
  items: [],
  addViewedItem: (item) =>
    set((state) => {
      // Remove existing occurrence if any
      const filtered = state.items.filter((i) => String(i.id) !== String(item.id));
      // Add to front, limit to 4
      const updatedItems = [item, ...filtered].slice(0, 4);
      return { items: updatedItems };
    }),
}));
