'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Locale = 'id' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string>) => string;
}

const translations = {
  id: {
    // Navigation
    'nav.home': 'Beranda',
    'nav.video': 'Video',
    'nav.messages': 'Pesan',
    'nav.cart': 'Keranjang',
    'nav.profile': 'Profil',
    'nav.more': 'Lainnya',
    'nav.settings': 'Pengaturan',
    'nav.appearance': 'Tampilan',
    'nav.logout': 'Keluar',
    'nav.signin': 'Masuk',
    'nav.signup': 'Daftar',
    'nav.search': 'Cari',
    'nav.discovery': 'Temukan',
    'nav.wishlist': 'Wishlist',
    'nav.orders': 'Pesanan',
    'nav.help': 'Bantuan',
    'nav.about': 'Tentang',
    'nav.terms': 'Syarat',
    'nav.privacy': 'Privasi',
    'nav.language': 'Bahasa',

    // Actions
    'action.search': 'Cari di LAKU...',
    'action.search_placeholder': 'Cari produk, toko, atau kategori...',
    'action.add_to_cart': 'Tambah ke Keranjang',
    'action.buy_now': 'Beli Sekarang',
    'action.view_details': 'Lihat Detail',
    'action.share': 'Bagikan',
    'action.save': 'Simpan',
    'action.follow': 'Ikuti',
    'action.unfollow': 'Berhenti Ikuti',
    'action.edit': 'Edit',
    'action.delete': 'Hapus',
    'action.cancel': 'Batal',
    'action.confirm': 'Konfirmasi',
    'action.continue': 'Lanjutkan',
    'action.back': 'Kembali',
    'action.next': 'Selanjutnya',
    'action.previous': 'Sebelumnya',
    'action.close': 'Tutup',
    'action.refresh': 'Refresh',
    'action.retry': 'Coba Lagi',
    'action.login': 'Masuk',
    'action.register': 'Daftar',
    'action.logout': 'Keluar',
    'action.view_profile': 'Lihat Profil',
    'action.view_all': 'Lihat Semua',
    'action.filter': 'Saring',
    'action.sort': 'Urutkan',
    'action.chat_whatsapp': 'Chat WhatsApp',

    // Live Mode
    'live.viewers': 'penonton',
    'live.watching_now': 'sedang menonton',

    // Messages
    'message.loading': 'Memuat...',
    'message.loading_more': 'Memuat lebih banyak...',
    'message.no_data': 'Tidak ada data',
    'message.no_products': 'Tidak ada produk ditemukan',
    'message.error': 'Terjadi kesalahan',
    'message.success': 'Berhasil',
    'message.added_to_cart': 'Ditambahkan ke keranjang',
    'message.removed_from_cart': 'Dihapus dari keranjang',
    'message.cart_empty': 'Keranjang kosong',
    'message.wishlist_empty': 'Wishlist kosong',
    'message.network_error': 'Kesalahan jaringan',
    'message.try_again': 'Silakan coba lagi',
    'message.coming_soon': 'Segera hadir',
    'message.end_of_feed': 'Anda sudah sampai akhir',
    'message.pull_to_refresh': 'Tarik untuk refresh',
    // Notifications
    'notifications.logistics': 'Logistik & Pelacakan',
    'notifications.promotions': 'Promosi & Penawaran',
    'notifications.system': 'Pesan Sistem',
    'notifications.view_all': 'Lihat Semua',
    'notifications.logistics.order_in_transit': 'Pesanan {{order}} dikirim - Dalam perjalanan',
    'notifications.logistics.out_for_delivery': 'Sedang dikirim',
    'notifications.logistics.delivered': 'Terkirim',
    'notifications.promos.welcome_title': '10k untuk pengguna baru',
    'notifications.promos.welcome_sub': 'Tebus voucher selamat datang sekarang',
    'notifications.promos.brand_sale_title': 'Anggota merek 50% sale',
    'notifications.promos.brand_sale_sub': 'Hanya untuk produk terpilih',
    'notifications.filter.all': 'Semua',
    'notifications.filter.orders': 'Pesanan',
    'notifications.filter.promos': 'Promo',
    'notifications.filter.system': 'Sistem',
    'notifications.promo.cta': 'Tebus sekarang',
    'notifications.promo.badge_hot': 'HOT',
    'notifications.promo.badge_promo': 'PROMO',

    // Product
    'product.price': 'Harga',
    'product.original_price': 'Harga Asli',
    'product.discount': 'Diskon',
    'product.sold': 'terjual',
    'product.stock': 'Stok',
    'product.out_of_stock': 'Stok Habis',
    'product.in_stock': 'Tersedia',
    'product.quantity': 'Jumlah',
    'product.description': 'Deskripsi',
    'product.specifications': 'Spesifikasi',
    'product.reviews': 'Ulasan',
    'product.related_products': 'Produk Terkait',
    'product.recommendations': 'Rekomendasi',
    'product.rating': 'Penilaian',

    // Categories
    'category.all': 'Semua',
    'category.fashion': 'Fashion',
    'category.electronics': 'Elektronik',
    'category.beauty': 'Kecantikan',
    'category.home': 'Rumah Tangga',
    'category.sports': 'Olahraga',
    'category.food': 'Makanan & Minuman',
    'category.books': 'Buku',
    'category.toys': 'Mainan',
    'category.automotive': 'Otomotif',

    // User
    'user.login': 'Masuk',
    'user.logout': 'Keluar',
    'user.register': 'Daftar',
    'user.forgot_password': 'Lupa Password',
    'user.reset_password': 'Reset Password',
    'user.change_password': 'Ubah Password',
    'user.profile': 'Profil Saya',
    'user.settings': 'Pengaturan',
    'user.address': 'Alamat',
    'user.orders': 'Pesanan',
    'user.wishlist': 'Wishlist',
    'user.loyalty_tier': 'Tingkat Loyalitas',
    'user.member_since': 'Anggota sejak',
    'user.login_prompt': 'Masuk untuk akses semua fitur',
    'user.member': 'Anggota',
    'user.guest': 'Tamu',
    'user.member_status': 'Silver Member',
    'user.view_profile': 'View Profile',
    'user.login_description': 'Masuk untuk pengalaman belanja terbaik',

    // Cart & Checkout
    'cart.title': 'Keranjang Belanja',
    'cart.select_all': 'Pilih Semua',
    'cart.edit': 'Edit',
    'cart.delete': 'Hapus',
    'cart.empty_message': 'Keranjang Anda kosong. Temukan produk yang Anda suka dan mulai belanja!',
    'cart.shop_now': 'Mulai Belanja',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Pengiriman',
    'cart.tax': 'Pajak',
    'cart.checkout': 'Checkout',
    'cart.continue_shopping': 'Lanjut Belanja',
    'cart.mini_title': 'Keranjang Belanja',
    'cart.view_all': 'Lihat Semua',
    'cart.empty': 'Keranjang kosong',
    'cart.items': 'barang',
    'cart.recently_viewed': 'Recently Viewed',
    'cart.view_all_products': 'View All Products →',
    'cart.view_cart': 'View Cart',
    'cart.add_success': '{{product}} berhasil ditambahkan ke keranjang!',
    'cart.add_error': 'Gagal menambahkan produk ke keranjang',

    // Recent & Help
    'recent.title': 'Baru Dilihat',
    'help.title': 'Butuh Bantuan?',
    'help.button': 'Chat via WhatsApp',
    'support.need_help': 'Butuh Bantuan?',
    'support.chat_description': 'Chat dengan customer service',
    'support.chat_whatsapp': 'Chat via WhatsApp',
    'support.whatsapp_message': 'Halo, saya butuh bantuan dengan belanja di LAKU',

    // Brand
    'brand.tagline': 'Belanja Bersama',

    // Language
    'language.id': 'ID',
    'language.en': 'EN',
    'checkout.title': 'Checkout',
    'checkout.payment': 'Pembayaran',
    'checkout.shipping_address': 'Alamat Pengiriman',
    'checkout.billing_address': 'Alamat Tagihan',
    'checkout.place_order': 'Buat Pesanan',

    // Common
    'common.yes': 'Ya',
    'common.no': 'Tidak',
    'common.ok': 'OK',
    'common.save': 'Simpan',
    'common.submit': 'Kirim',
    'common.send': 'Kirim',
    'common.receive': 'Terima',
    'common.accept': 'Terima',
    'common.reject': 'Tolak',
    'common.approve': 'Setujui',
    'common.deny': 'Tolak',
    'common.pending': 'Menunggu',
    'common.processing': 'Diproses',
    'common.completed': 'Selesai',
    'common.cancelled': 'Dibatalkan',
    'common.failed': 'Gagal',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.video': 'Video',
    'nav.messages': 'Messages',
    'nav.cart': 'Cart',
    'nav.profile': 'Profile',
    'nav.more': 'More',
    'nav.settings': 'Settings',
    'nav.appearance': 'Appearance',
    'nav.language': 'Language',
    'nav.logout': 'Logout',
    'nav.signin': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.search': 'Search',
    'nav.discovery': 'Discovery',
    'nav.wishlist': 'Wishlist',
    'nav.orders': 'Orders',
    'nav.help': 'Help',
    'nav.about': 'About',
    'nav.terms': 'Terms',
    'nav.privacy': 'Privacy',

    // Actions
    'action.search': 'Search on LAKU...',
    'action.search_placeholder': 'Search products, stores, or categories...',
    'action.add_to_cart': 'Add to Cart',
    'action.buy_now': 'Buy Now',
    'action.view_details': 'View Details',
    'action.share': 'Share',
    'action.save': 'Save',
    'action.follow': 'Follow',
    'action.unfollow': 'Unfollow',
    'action.edit': 'Edit',
    'action.delete': 'Delete',
    'action.cancel': 'Cancel',
    'action.confirm': 'Confirm',
    'action.continue': 'Continue',
    'action.back': 'Back',
    'action.next': 'Next',
    'action.previous': 'Previous',
    'action.close': 'Close',
    'action.refresh': 'Refresh',
    'action.retry': 'Try Again',
    'action.login': 'Login',
    'action.register': 'Register',
    'action.logout': 'Logout',
    'action.view_profile': 'View Profile',
    'action.view_all': 'View All',
    'action.filter': 'Filter',
    'action.sort': 'Sort',
    'action.chat_whatsapp': 'Chat WhatsApp',

    // Live Mode
    'live.viewers': 'viewers',
    'live.watching_now': 'watching now',

    // Messages
    'message.loading': 'Loading...',
    'message.loading_more': 'Loading more...',
    'message.no_data': 'No data',
    'message.no_products': 'No products found',
    'message.error': 'An error occurred',
    'message.success': 'Success',
    'message.added_to_cart': 'Added to cart',
    'message.removed_from_cart': 'Removed from cart',
    'message.cart_empty': 'Cart is empty',
    'message.wishlist_empty': 'Wishlist is empty',
    'message.network_error': 'Network error',
    'message.try_again': 'Please try again',
    'message.coming_soon': 'Coming soon',
    'message.end_of_feed': 'You\'ve reached the end',
    'message.pull_to_refresh': 'Pull to refresh',
    // Notifications
    'notifications.logistics': 'Logistics & Tracking',
    'notifications.promotions': 'Promotions & Offers',
    'notifications.system': 'System Messages',
    'notifications.view_all': 'View All',
    'notifications.logistics.order_in_transit': 'Order {{order}} shipped - In transit',
    'notifications.logistics.out_for_delivery': 'Out for delivery',
    'notifications.logistics.delivered': 'Delivered',
    'notifications.promos.welcome_title': '10k voucher for new users',
    'notifications.promos.welcome_sub': 'Claim your welcome voucher now',
    'notifications.promos.brand_sale_title': 'Brand members 50% sale',
    'notifications.promos.brand_sale_sub': 'Selected items only',
    'notifications.filter.all': 'All',
    'notifications.filter.orders': 'Orders',
    'notifications.filter.promos': 'Promos',
    'notifications.filter.system': 'System',
    'notifications.promo.cta': 'Tap to claim',
    'notifications.promo.badge_hot': 'HOT',
    'notifications.promo.badge_promo': 'PROMO',

    // Product
    'product.price': 'Price',
    'product.original_price': 'Original Price',
    'product.discount': 'Discount',
    'product.sold': 'sold',
    'product.stock': 'Stock',
    'product.out_of_stock': 'Out of Stock',
    'product.in_stock': 'In Stock',
    'product.quantity': 'Quantity',
    'product.description': 'Description',
    'product.specifications': 'Specifications',
    'product.reviews': 'Reviews',
    'product.related_products': 'Related Products',
    'product.recommendations': 'Recommendations',
    'product.rating': 'Rating',

    // Categories
    'category.all': 'All',
    'category.fashion': 'Fashion',
    'category.electronics': 'Electronics',
    'category.beauty': 'Beauty',
    'category.home': 'Home',
    'category.sports': 'Sports',
    'category.food': 'Food & Beverage',
    'category.books': 'Books',
    'category.toys': 'Toys',
    'category.automotive': 'Automotive',

    // User
    'user.login': 'Login',
    'user.logout': 'Logout',
    'user.register': 'Register',
    'user.forgot_password': 'Forgot Password',
    'user.reset_password': 'Reset Password',
    'user.change_password': 'Change Password',
    'user.profile': 'My Profile',
    'user.settings': 'Settings',
    'user.address': 'Address',
    'user.orders': 'Orders',
    'user.wishlist': 'Wishlist',
    'user.loyalty_tier': 'Loyalty Tier',
    'user.member_since': 'Member since',
    'user.login_prompt': 'Login to access all features',
    'user.member': 'Member',
    'user.guest': 'Guest',
    'user.member_status': 'Silver Member',
    'user.view_profile': 'View Profile',
    'user.login_description': 'Login for the best shopping experience',
    // Profile specific
    'profile.avatarAlt': 'Avatar',
    'profile.membership': 'Membership',
    'profile.savings': 'Saved amount',
    'profile.orders.title': 'My Orders',
    'profile.orders.viewAll': 'View All',
    'profile.stats.redEnvelope': 'Red Envelopes',
    'profile.stats.vouchers': 'Vouchers',
    'profile.stats.points': 'Points',
    'profile.stats.balance': 'Balance',
    'profile.order.toPay': 'To Pay',
    'profile.order.toShip': 'To Ship',
    'profile.order.toReceive': 'To Receive',
    'profile.order.toReview': 'To Review',
    'profile.order.refunds': 'Refunds/Returns',
    'profile.tools.favorites': 'Favorites',
    'profile.tools.followed': 'Followed Stores',
    'profile.tools.history': 'Browsing History',
    'profile.tools.help': 'Help Center',
    'profile.tools.payments': 'Payment Methods',
    'profile.tools.addresses': 'Saved Addresses',
    'profile.tools.notifications': 'Notification Settings',
    'profile.tools.vouchers': 'Voucher Center',
    'profile.tools.referral': 'Referral Program',
    'profile.tools.security': 'Security Settings',

    // Cart & Checkout
    'cart.title': 'Shopping Cart',
    'cart.select_all': 'Select All',
    'cart.edit': 'Edit',
    'cart.delete': 'Delete',
    'cart.empty_message': 'Your cart is empty. Find products you like and start shopping!',
    'cart.shop_now': 'Start Shopping',
    'cart.total': 'Total',
    'cart.subtotal': 'Subtotal',
    'cart.shipping': 'Shipping',
    'cart.tax': 'Tax',
    'cart.checkout': 'Checkout',
    'cart.continue_shopping': 'Continue Shopping',
    'cart.mini_title': 'Shopping Cart',
    'cart.view_all': 'View All',
    'cart.empty': 'Cart is empty',
    'cart.items': 'items',
    'cart.recently_viewed': 'Recently Viewed',
    'cart.view_all_products': 'View All Products →',
    'cart.view_cart': 'View Cart',
    'cart.add_success': '{{product}} added to cart successfully!',
    'cart.add_error': 'Failed to add product to cart',

    // Recent & Help
    'recent.title': 'Recently Viewed',
    'help.title': 'Need Help?',
    'help.button': 'Chat via WhatsApp',
    'support.need_help': 'Need Help?',
    'support.chat_description': 'Chat with customer service',
    'support.chat_whatsapp': 'Chat via WhatsApp',
    'support.whatsapp_message': 'Hi, I need help with shopping on LAKU',

    // Brand
    'brand.tagline': 'Shop Together',

    // Language
    'language.id': 'ID',
    'language.en': 'EN',
    'checkout.title': 'Checkout',
    'checkout.payment': 'Payment',
    'checkout.shipping_address': 'Shipping Address',
    'checkout.billing_address': 'Billing Address',
    'checkout.place_order': 'Place Order',

    // Common
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.ok': 'OK',
    'common.save': 'Save',
    'common.submit': 'Submit',
    'common.send': 'Send',
    'common.receive': 'Receive',
    'common.accept': 'Accept',
    'common.reject': 'Reject',
    'common.approve': 'Approve',
    'common.deny': 'Deny',
    'common.pending': 'Pending',
    'common.processing': 'Processing',
    'common.completed': 'Completed',
    'common.cancelled': 'Cancelled',
    'common.failed': 'Failed',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>('id');

  // Initialize locale from localStorage on mount
  useEffect(() => {
    const savedLocale = localStorage.getItem('laku-locale') as Locale;
    if (savedLocale && (savedLocale === 'id' || savedLocale === 'en')) {
      setLocaleState(savedLocale);
    }
  }, []);

  // Persist locale changes to localStorage
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('laku-locale', newLocale);
  };

  // Translation function
  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[locale][key as keyof typeof translations[typeof locale]];

    if (!translation) {
      return key; // Fallback to key if translation not found
    }

    // Handle parameter interpolation
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(new RegExp(`{{${param}}}`, 'g'), value);
      });
    }

    return translation;
  };

  const value: LanguageContextType = {
    locale,
    setLocale,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Fallback: return a safe default that uses the default Indonesian translations
    // so server and client render the same placeholder strings and avoid hydration mismatches.
    // eslint-disable-next-line no-console
    console.warn('useLanguage called without LanguageProvider - falling back to defaults');
    return {
      locale: 'id' as Locale,
      setLocale: () => {},
      t: (key: string) => {
        const val = (translations as any)['id']?.[key];
        return typeof val === 'string' ? val : key;
      },
    } as LanguageContextType;
  }
  return context;
}