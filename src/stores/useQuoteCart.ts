import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { QuoteCartItem } from '@/types/configurator';

interface QuoteCartStore {
  items: QuoteCartItem[];
  addItem: (item: QuoteCartItem) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
}

export const useQuoteCart = create<QuoteCartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),

      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),

      updateQuantity: (index, quantity) =>
        set((state) => ({
          items: state.items.map((item, i) =>
            i === index ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      itemCount: () => get().items.length,
    }),
    {
      name: 'kismet-quote-cart',
    }
  )
);
