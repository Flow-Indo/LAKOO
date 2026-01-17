'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { useCartStore } from '@/stores/cart-store';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice } from '@/lib/formatters';
import { MOCK_PRODUCTS } from '@/lib/mock-data';

function UserProfileCard() {
  const { user, isAuthenticated } = useAuthStore();
  const { t } = useLanguage();

  if (!isAuthenticated || !user) {
    return (
      <Card className="bg-gradient-to-br from-red-50 to-white border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-gray-500 text-lg">?</span>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {t('user.login')}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Masuk untuk pengalaman belanja terbaik
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('user.login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Generate avatar color based on user ID
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500'];
  const colorIndex = user.id.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  return (
    <Card className="bg-gradient-to-br from-red-50 to-white border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-10 h-10 ${avatarColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {user.name}
            </h3>
            <p className="text-xs text-gray-500 truncate">
              {user.email}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Silver Member
          </span>
          <Link
            href="/profile"
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            View Profile
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniCartSection() {
  const { items, getTotalPrice, getTotalItems } = useCartStore();
  const { t } = useLanguage();
  const totalItems = getTotalItems();

  // Show recently viewed if cart is empty
  if (totalItems === 0) {
    const recentProducts = MOCK_PRODUCTS.slice(0, 3);

    return (
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Recently Viewed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {product.name}
                </p>
                <p className="text-sm text-red-600 font-medium">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
          <div className="pt-2 border-t">
            <Link
              href="/products"
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              View All Products →
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show mini cart
  const totalPrice = getTotalPrice();

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center justify-between">
          {t('cart.title')}
          <span className="text-xs text-gray-500">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center space-x-3">
            <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">
                Qty: {item.quantity}
              </p>
              <p className="text-sm text-red-600 font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}

        {items.length > 3 && (
          <p className="text-xs text-gray-500 text-center">
            +{items.length - 3} more items
          </p>
        )}

        <div className="pt-3 border-t space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total:</span>
            <span className="text-sm font-bold text-red-600">
              {formatPrice(totalPrice)}
            </span>
          </div>
          <Link
            href="/cart"
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            View Cart
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function WhatsAppWidget() {
  const { t, locale } = useLanguage();

  const handleWhatsAppClick = () => {
    const phoneNumber = '6281234567890'; // Replace with real WhatsApp number
    const message = locale === 'id'
      ? 'Halo, saya butuh bantuan dengan belanja di LAKU'
      : 'Hi, I need help with shopping on LAKU';

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Card className="border-0 shadow-sm bg-green-50">
      <CardContent className="p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {locale === 'id' ? 'Butuh Bantuan?' : 'Need Help?'}
            </h3>
            <p className="text-xs text-gray-600">
              {locale === 'id' ? 'Chat dengan customer service' : 'Chat with customer service'}
            </p>
          </div>
        </div>
        <button
          onClick={handleWhatsAppClick}
          className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          {locale === 'id' ? 'Chat via WhatsApp' : 'Chat via WhatsApp'}
        </button>
      </CardContent>
    </Card>
  );
}

export function RightSidebarContent() {
  return (
    <div className="space-y-4">
      <UserProfileCard />
      <MiniCartSection />
      <WhatsAppWidget />
    </div>
  );
}