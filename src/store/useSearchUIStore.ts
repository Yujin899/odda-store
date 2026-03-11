import { create } from 'zustand';

interface SearchUIStore {
  isOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

export const useSearchUIStore = create<SearchUIStore>((set) => ({
  isOpen: false,
  openSearch: () => set({ isOpen: true }),
  closeSearch: () => set({ isOpen: false }),
  toggleSearch: () => set((state) => ({ isOpen: !state.isOpen })),
}));
