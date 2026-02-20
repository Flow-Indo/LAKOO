import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartStore {
  items: CartItem[];
  // selection state (client-only): list of selected item ids
  selectedIds: string[];

  // cart operations
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  // selection operations
  toggleSelectItem: (productId: string) => void;
  selectItems: (productIds: string[]) => void;
  toggleSelectStore: (storeId: string, select?: boolean) => void;
  selectAll: () => void;
  clearSelection: () => void;
  getSelectedItems: () => CartItem[];
  getSelectedCount: () => number;
  getSelectedTotalPrice: () => number;
  removeItems: (productIds: string[]) => void;

  // analytics
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
      selectedIds: [],

      addItem: (product: Product, quantity = 1) => {
        const { items, getTotalItems } = get();

        // Check stock availability
        if (quantity > product.stock) {
          throw new Error(`Only ${product.stock} items available in stock`);
        }

        // Basic add behavior
        const existingItem = items.find(item => item.id === product.id);

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity;
          if (newQuantity > product.stock) {
            throw new Error(`Cannot add more items. Only ${product.stock} available in stock`);
          }

          set({
            items: items.map(item =>
              item.id === product.id ? { ...item, quantity: newQuantity } : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter(item => item.id !== productId),
          selectedIds: get().selectedIds.filter(id => id !== productId),
        });
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

      clearCart: () => set({ items: [], selectedIds: [] }),

      // selection methods
      toggleSelectItem: (productId: string) => {
        const selected = get().selectedIds;
        if (selected.includes(productId)) {
          set({ selectedIds: selected.filter(id => id !== productId) });
        } else {
          set({ selectedIds: [...selected, productId] });
        }
      },

      selectItems: (productIds: string[]) => {
        const setOfIds = new Set(get().selectedIds);
        productIds.forEach(id => setOfIds.add(id));
        set({ selectedIds: Array.from(setOfIds) });
      },

      toggleSelectStore: (storeId: string, select?: boolean) => {
        const itemsInStore = get().items.filter(i => i.store?.id === storeId).map(i => i.id);
        if (select === undefined) {
          // toggle: if all selected -> deselect all, else select all
          const allSelected = itemsInStore.every(id => get().selectedIds.includes(id));
          if (allSelected) {
            set({ selectedIds: get().selectedIds.filter(id => !itemsInStore.includes(id)) });
          } else {
            set({ selectedIds: Array.from(new Set([...get().selectedIds, ...itemsInStore])) });
          }
        } else if (select) {
          set({ selectedIds: Array.from(new Set([...get().selectedIds, ...itemsInStore])) });
        } else {
          set({ selectedIds: get().selectedIds.filter(id => !itemsInStore.includes(id)) });
        }
      },

      selectAll: () => {
        set({ selectedIds: get().items.map(i => i.id) });
      },

      clearSelection: () => set({ selectedIds: [] }),

      getSelectedItems: () => {
        const selectedSet = new Set(get().selectedIds);
        return get().items.filter(i => selectedSet.has(i.id));
      },

      getSelectedCount: () => get().selectedIds.length,

      getSelectedTotalPrice: () =>
        get().items.reduce((total, item) => {
          if (get().selectedIds.includes(item.id)) {
            return total + item.price * item.quantity;
          }
          return total;
        }, 0),
      
      // bulk remove helper
      removeItems: (productIds: string[]) => {
        set({
          items: get().items.filter(item => !productIds.includes(item.id)),
          selectedIds: get().selectedIds.filter(id => !productIds.includes(id)),
        });
      },

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