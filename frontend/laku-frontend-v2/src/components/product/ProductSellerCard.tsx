'use client';

import { Star, Users, ShoppingBag, ChevronRight, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import type { ProductSeller } from '@/types/product';

interface Props {
  seller: ProductSeller;
}

export function ProductSellerCard({ seller }: Props) {
  const router = useRouter();
  const { user } = useAuthStore();

  const handleFollow = () => {
    if (!user) {
      alert('Please login to follow sellers');
      return;
    }
    // In real app, toggle follow status
    console.log('Toggle follow for seller:', seller.id);
  };

  const handleViewStore = () => {
    router.push(`/seller/${seller.id}`);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 4.5) return { label: 'Excellent', color: 'text-green-600' };
    if (score >= 4.0) return { label: 'Good', color: 'text-blue-600' };
    if (score >= 3.5) return { label: 'Average', color: 'text-yellow-600' };
    return { label: 'Needs Improvement', color: 'text-red-600' };
  };

  const qualityScore = getScoreLabel(seller.qualityScore);
  const shippingScore = getScoreLabel(seller.shippingScore);
  const serviceScore = getScoreLabel(seller.serviceScore);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      {/* Seller Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <img
            src={seller.logo}
            alt={seller.name}
            className="w-12 h-12 rounded-full border-2 border-gray-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{seller.name}</h3>
              {seller.isVerified && (
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{seller.rating}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleFollow}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            seller.isFollowing
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          {seller.isFollowing ? 'Following' : 'Follow'}
        </button>
      </div>

      {/* Seller Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{seller.followers.toLocaleString()}</div>
          <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
            <Users className="w-3 h-3" />
            Followers
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{seller.sold}</div>
          <div className="text-xs text-gray-600 flex items-center justify-center gap-1">
            <ShoppingBag className="w-3 h-3" />
            Sold
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{seller.repurchaseRate}</div>
          <div className="text-xs text-gray-600">Repurchase</div>
        </div>
      </div>

      {/* Seller Scores */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Quality</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${(seller.qualityScore / 5) * 100}%` }}
              />
            </div>
            <span className={`font-medium ${qualityScore.color}`}>
              {seller.qualityScore}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${(seller.shippingScore / 5) * 100}%` }}
              />
            </div>
            <span className={`font-medium ${shippingScore.color}`}>
              {seller.shippingScore}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Service</span>
          <div className="flex items-center gap-2">
            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${(seller.serviceScore / 5) * 100}%` }}
              />
            </div>
            <span className={`font-medium ${serviceScore.color}`}>
              {seller.serviceScore}
            </span>
          </div>
        </div>
      </div>

      {/* Trending Badge */}
      {seller.isTrending && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-red-700">Trending Store</span>
          </div>
        </div>
      )}

      {/* View Store Button */}
      <button
        onClick={handleViewStore}
        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <span className="font-medium text-gray-900">All Items</span>
        <ChevronRight className="w-4 h-4 text-gray-500" />
      </button>
    </div>
  );
}