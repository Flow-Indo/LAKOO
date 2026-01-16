import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { MAX_CART_ITEMS } from '@/constants';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalDiscount: () => number;
  isInCart: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1) => {
        const { items, getTotalItems } = get();

        // Check stock availability
        if (quantity > product.stock) {
          throw new Error(`Only ${product.stock} items available in stock`);
        }

        // Check cart limit
        if (getTotalItems() >= MAX_CART_ITEMS) {
          throw new Error(`Cart cannot exceed ${MAX_CART_ITEMS} items`);
        }

        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            throw new Error(`Cannot add more items. Only ${product.stock} available in stock`);
          }

          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },

      removeItem: (productId: string) => {
        set({ items: get().items.filter(item => item.id !== productId) });
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        const { items } = get();
        const item = items.find(item => item.id === productId);

        if (item && quantity > item.stock) {
          throw new Error(`Cannot update quantity. Only ${item.stock} available in stock`);
        }

        set({
          items: get().items.map(item =>
            item.id === productId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((total, item) => total + item.price * item.quantity, 0),

      getTotalDiscount: () =>
        get().items.reduce((total, item) => {
          const discount = item.originalPrice && item.discount
            ? (item.originalPrice - item.price) * item.quantity
            : 0;
          return total + discount;
        }, 0),

      isInCart: (productId: string) => get().items.some(item => item.id === productId),

      getItemQuantity: (productId: string) =>
        get().items.find(item => item.id === productId)?.quantity || 0,
    }),
    {
      name: 'cart-storage',
    }
  )
);