import { CartPageClient } from '@/components/cart/CartPageClient';
import type { StoreCart } from '@/types/cart';

// Mock data for development
const mockCartData: StoreCart[] = [
  {
    storeId: 'store1',
    storeName: 'Toko Fashion Sarah',
    storeAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop',
    hasFreeGift: true,
    shippingInfo: 'Pengiriman reguler - Estimasi 2-3 hari',
    products: [
      {
        id: '1',
        productId: 'prod1',
        name: 'Dress Casual Wanita Modern jokowi hebat banget ji gila hebat coyyyr',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=300&fit=crop',
        price: 150000,
        originalPrice: 200000,
        quantity: 1,
        variations: 'Ukuran: M, Warna: Hitam',
        stock: 10,
        isSelected: true,
      },
      {
        id: '2',
        productId: 'prod2',
        name: 'Blouse Katun Premium jokowi hebat anjay',
        image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=300&h=300&fit=crop',
        price: 85000,
        quantity: 2,
        variations: 'Ukuran: L, Warna: Putih',
        stock: 15,
        isSelected: true,
      },
    ],
    vouchers: [
      {
        id: 'voucher1',
        title: 'Diskon Toko 20%',
        description: 'Minimum pembelian Rp200.000',
        discount: 'Up to Rp40K off',
        isApplied: false,
      },
    ],
  },
  {
    storeId: 'store2',
    storeName: 'Butik Elegan',
    storeAvatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&h=150&fit=crop',
    hasFreeGift: false,
    shippingInfo: 'Pengiriman kilat - Estimasi 1 hari',
    products: [
      {
        id: '3',
        productId: 'prod3',
        name: 'Sepatu Sneakers Wanita',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop',
        price: 250000,
        quantity: 1,
        variations: 'Ukuran: 37, Warna: Putih',
        stock: 8,
        isSelected: false,
      },
    ],
    vouchers: [],
  },
];

export default async function CartPage() {
  // TODO: Replace with real API call
  // const cartData: StoreCart[] = await fetch('http://localhost:3000/api/cart', {
  //   next: { revalidate: 0 }
  // }).then(r => r.json()).catch(() => []);

  // For now, use mock data
  const cartData = mockCartData;

  return <CartPageClient initialCart={cartData} />;
}