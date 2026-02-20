'use client';

import Image from 'next/image';
import { Store } from '@/types/store';
import { Star, Users, Package, Shield, Heart, MessageCircle, Share } from 'lucide-react';

interface DesktopStoreInfoBarProps {
  store: Store;
}

export function DesktopStoreInfoBar({ store }: DesktopStoreInfoBarProps) {
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
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-start justify-between">
          {/* Left Side - Store Info */}
          <div className="flex items-start gap-6">
            {/* Store Logo */}
            <div className="relative -mt-8 flex-shrink-0">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-4 border-white bg-white shadow-lg">
                <Image
                  src={store.logo}
                  alt={store.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {store.verified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            {/* Store Details */}
            <div className="pt-4">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                {store.badges.some(badge => badge.type === 'choice') && (
                  <span className="px-3 py-1 bg-black text-white text-sm rounded font-medium">
                    Choice Store
                  </span>
                )}
              </div>

              {/* Store Stats */}
              <div className="flex items-center gap-6 text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-gray-900">{store.rating}</span>
                  <span>({store.reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Package className="w-5 h-5" />
                  <span>{store.productCount.toLocaleString()} items</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-5 h-5" />
                  <span>{(store.followers / 1000).toFixed(0)}K followers</span>
                </div>
              </div>

              {/* Performance Badges */}
              <div className="flex gap-2 mb-4">
                {store.badges.slice(0, 3).map(badge => (
                  <span
                    key={badge.id}
                    className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded font-medium"
                  >
                    {badge.name}
                  </span>
                ))}
              </div>

              {/* Performance Metrics */}
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Quality</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {store.performance.productQuality}/5
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Shipping</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {store.performance.shippingSpeed}/5
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Service</div>
                  <div className="text-lg font-semibold text-gray-900">
                    {store.performance.customerService}/5
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Share className="w-5 h-5" />
              <span>Share</span>
            </button>

            <button
              onClick={handleFollow}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                store.isFollowing
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${store.isFollowing ? 'fill-current' : ''}`} />
              <span>{store.isFollowing ? 'Following' : 'Follow'}</span>
            </button>

            <button
              onClick={handleChat}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}