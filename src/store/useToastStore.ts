import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: ToastType;
}

interface ToastStore {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { ...toast, id };
      // Limit to max 3 toasts, removing the oldest if necessary
      const updatedToasts = [...state.toasts, newToast].slice(-3);
      return { toasts: updatedToasts };
    }),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

// Export a convenient toast object for use outside of components or in event handlers
export const toast = {
  addToast: (message: Omit<ToastMessage, 'id'>) => useToastStore.getState().addToast(message),
  success: (title: string, description?: string) => 
    useToastStore.getState().addToast({ title, description, type: 'success' }),
  error: (title: string, description?: string) => 
    useToastStore.getState().addToast({ title, description, type: 'error' }),
  info: (title: string, description?: string) => 
    useToastStore.getState().addToast({ title, description, type: 'info' }),
};
