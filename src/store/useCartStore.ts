import { create } from 'zustand';

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  nameAr?: string;
  price: number;
  quantity: number;
  image: string;
  type?: 'product' | 'bundle';
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  addItem: (newItem: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  addItem: (newItem, quantity = 1) =>
    set((state) => {
      const existingItem = state.items.find((item) => item.id === newItem.id);
      let updatedItems;
      if (existingItem) {
        updatedItems = state.items.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        updatedItems = [...state.items, { ...newItem, quantity }];
      }
      return {
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }),
  removeItem: (id) =>
    set((state) => {
      const updatedItems = state.items.filter((item) => item.id !== id);
      return {
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }),
  updateQuantity: (id, quantity) =>
    set((state) => {
      let updatedItems;
      if (quantity <= 0) {
        updatedItems = state.items.filter((item) => item.id !== id);
      } else {
        updatedItems = state.items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
      }
      return {
        items: updatedItems,
        totalAmount: calculateTotal(updatedItems),
      };
    }),
  clearCart: () => set({ items: [], totalAmount: 0 }),
}));
