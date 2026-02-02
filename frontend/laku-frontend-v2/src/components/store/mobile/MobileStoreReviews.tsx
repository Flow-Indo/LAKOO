import Image from 'next/image';
import { Store } from '@/types/store';
import { Star, ThumbsUp } from 'lucide-react';

interface MobileStoreReviewsProps {
  store: Store;
}

export function MobileStoreReviews({ store }: MobileStoreReviewsProps) {
  const averageRating = store.rating;
  const totalReviews = store.reviews.length;

  return (
    <div className="bg-white">
      {/* Review Summary */}
      <div className="p-4 border-b border-gray-100">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{averageRating}</div>
          <div className="flex justify-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">{totalReviews} reviews</p>
        </div>
      </div>

      {/* Reviews List */}
      <div className="p-4 space-y-4">
        {store.reviews.map((review) => (
          <div key={review.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3 mb-3">
              <Image
                src={review.user.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(review.user.name)}`}
                alt={review.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900">{review.user.name}</span>
                  {review.user.isVerified && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-3">{review.comment}</p>

            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-3 overflow-x-auto">
                {review.images.map((image, index) => (
                  <Image
                    key={index}
                    src={image}
                    alt={`Review image ${index + 1}`}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover flex-shrink-0"
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between">
              <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                <ThumbsUp className="w-4 h-4" />
                <span>Helpful ({review.helpful})</span>
              </button>
            </div>

            {review.sellerReply && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Image
                    src={store.logo}
                    alt={store.name}
                    width={20}
                    height={20}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-900">Store Response</span>
                </div>
                <p className="text-sm text-gray-700">{review.sellerReply.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.sellerReply.createdAt).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}