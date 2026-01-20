'use client';

import Image from 'next/image';
import { Store } from '@/types/store';
import { Star, Users, Package, MapPin, Shield, Heart, MessageCircle, Share } from 'lucide-react';
import { formatPrice } from '@/lib/formatters';

interface MobileStoreInfoCardProps {
  store: Store;
}

export function MobileStoreInfoCard({ store }: MobileStoreInfoCardProps) {
  const handleFollow = () => {
    // TODO: Implement follow/unfollow logic
    console.log('Toggle follow store');
  };

  const handleChat = () => {
    // TODO: Implement chat functionality
    console.log('Open chat with store');
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share store');
  };

  return (
    <div className="px-4 pb-4">
      {/* Store Identity */}
      <div className="flex items-start gap-4 mb-4">
        {/* Store Logo */}
        <div className="relative -mt-8 flex-shrink-0">
          <div className="w-20 h-20 rounded-xl overflow-hidden border-4 border-white bg-white shadow-lg">
            <Image
              src={store.logo}
              alt={store.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          {store.verified && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Store Info */}
        <div className="flex-1 pt-4">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
            {store.badges.some(badge => badge.type === 'choice') && (
              <span className="px-2 py-1 bg-black text-white text-xs rounded font-medium">
                Choice
              </span>
            )}
          </div>

          {/* Store Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{store.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Package className="w-4 h-4" />
              <span>{store.productCount.toLocaleString()} items</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{(store.followers / 1000).toFixed(0)}K followers</span>
            </div>
          </div>

          {/* Performance Badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            {store.badges.map(badge => (
              <span
                key={badge.id}
                className="px-2 py-1 bg-red-50 text-red-600 text-xs rounded font-medium"
              >
                {badge.name}
              </span>
            ))}
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">Quality</div>
              <div className="text-sm font-semibold text-gray-900">
                {store.performance.productQuality}/5
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Shipping</div>
              <div className="text-sm font-semibold text-gray-900">
                {store.performance.shippingSpeed}/5
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Service</div>
              <div className="text-sm font-semibold text-gray-900">
                {store.performance.customerService}/5
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleFollow}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                store.isFollowing
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${store.isFollowing ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">
                {store.isFollowing ? 'Following' : 'Follow'}
              </span>
            </button>

            <button
              onClick={handleChat}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}