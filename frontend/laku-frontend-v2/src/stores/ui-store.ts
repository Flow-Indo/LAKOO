import { create } from 'zustand';

interface UiStore {
  // Loading states
  isLoading: boolean;
  loadingMessage: string;
  setLoading: (loading: boolean, message?: string) => void;

  // Modal states
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  // Search states
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Filter states
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Notification states
  notification: {
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null;
  showNotification: (type: 'success' | 'error' | 'warning' | 'info', message: string) => void;
  hideNotification: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  // Loading states
  isLoading: false,
  loadingMessage: 'Memuat...',
  setLoading: (loading, message = 'Memuat...') => {
    set({ isLoading: loading, loadingMessage: message });
  },

  // Modal states
  isCartOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),

  // Search states
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Filter states
  selectedCategory: '',
  setSelectedCategory: (category) => set({ selectedCategory: category }),

  // Notification states
  notification: null,
  showNotification: (type, message) => {
    set({
      notification: {
        show: true,
        type,
        message,
      },
    });

    // Auto hide after 5 seconds
    setTimeout(() => {
      get().hideNotification();
    }, 5000);
  },
  hideNotification: () => {
    set({ notification: null });
  },
}));