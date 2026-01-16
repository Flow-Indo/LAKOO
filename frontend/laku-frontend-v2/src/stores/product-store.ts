import { create } from 'zustand';
import { Product } from '@/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

interface ProductStore {
  products: Product[];
  filteredProducts: Product[];
  selectedProduct: Product | null;

  // Actions
  setProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  removeProduct: (id: string) => void;

  // Filtering and searching
  setFilteredProducts: (products: Product[]) => void;
  searchProducts: (query: string) => void;
  filterByCategory: (category: string) => void;
  sortProducts: (sortBy: 'name' | 'price' | 'rating' | 'newest') => void;

  // Selection
  selectProduct: (product: Product | null) => void;
  getProductById: (id: string) => Product | undefined;
  getProductBySlug: (slug: string) => Product | undefined;

  // Utilities
  getCategories: () => string[];
  getFeaturedProducts: (limit?: number) => Product[];
  getProductsByStore: (storeId: string) => Product[];
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: MOCK_PRODUCTS,
  filteredProducts: MOCK_PRODUCTS,
  selectedProduct: null,

  setProducts: (products) => set({ products, filteredProducts: products }),

  addProduct: (product) => {
    set((state) => ({
      products: [...state.products, product],
      filteredProducts: [...state.filteredProducts, product],
    }));
  },

  updateProduct: (id, updates) => {
    set((state) => {
      const updatedProducts = state.products.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      );
      const updatedFiltered = state.filteredProducts.map((product) =>
        product.id === id ? { ...product, ...updates } : product
      );

      return {
        products: updatedProducts,
        filteredProducts: updatedFiltered,
        selectedProduct:
          state.selectedProduct?.id === id
            ? { ...state.selectedProduct, ...updates }
            : state.selectedProduct,
      };
    });
  },

  removeProduct: (id) => {
    set((state) => ({
      products: state.products.filter((product) => product.id !== id),
      filteredProducts: state.filteredProducts.filter((product) => product.id !== id),
      selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
    }));
  },

  setFilteredProducts: (products) => set({ filteredProducts: products }),

  searchProducts: (query) => {
    const { products } = get();
    if (!query.trim()) {
      set({ filteredProducts: products });
      return;
    }

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.store.name.toLowerCase().includes(query.toLowerCase())
    );

    set({ filteredProducts: filtered });
  },

  filterByCategory: (category) => {
    const { products } = get();
    if (!category) {
      set({ filteredProducts: products });
      return;
    }

    const filtered = products.filter((product) => product.category === category);
    set({ filteredProducts: filtered });
  },

  sortProducts: (sortBy) => {
    set((state) => {
      const sorted = [...state.filteredProducts].sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.price - b.price;
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'newest':
            // For mock data, we'll sort by sold count as proxy for popularity
            return (b.sold || 0) - (a.sold || 0);
          default:
            return 0;
        }
      });

      return { filteredProducts: sorted };
    });
  },

  selectProduct: (product) => set({ selectedProduct: product }),

  getProductById: (id) => {
    return get().products.find((product) => product.id === id);
  },

  getProductBySlug: (slug) => {
    return get().products.find((product) => product.slug === slug);
  },

  getCategories: () => {
    const categories = get().products.map((product) => product.category);
    return [...new Set(categories)];
  },

  getFeaturedProducts: (limit = 8) => {
    return get()
      .products.filter((product) => (product.rating || 0) >= 4.0)
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, limit);
  },

  getProductsByStore: (storeId) => {
    return get().products.filter((product) => product.store.id === storeId);
  },
}));