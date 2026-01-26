'use client';

import { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import Image from 'next/image';

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  verified: boolean;
  size: string;
  color: string;
  fit: 'Small' | 'True to Size' | 'Large';
  height?: string;
  weight?: string;
  waist?: string;
  comment: string;
  images?: string[];
  helpful: number;
}

interface ReviewsSectionProps {
  productId: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export function ReviewsSection({
  productId,
  averageRating,
  totalReviews,
  reviews: initialReviews,
}: ReviewsSectionProps) {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recommended');
  const [reviews, setReviews] = useState(initialReviews);
  const [displayCount, setDisplayCount] = useState(10);

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.floor(r.rating) === stars).length;
    const percentage = (count / reviews.length) * 100;
    return { stars, percentage, count };
  });

  const filterOptions = [
    { id: 'all', label: 'All Reviews', count: totalReviews },
    { id: 'image', label: 'With Images', count: reviews.filter((r) => r.images && r.images.length > 0).length },
    { id: 'true-to-size', label: 'True to Size', count: reviews.filter((r) => r.fit === 'True to Size').length },
  ];

  return (
    <div id="reviews" className="mt-8 md:mt-12 border-t border-gray-200 pt-8 px-4 md:px-0">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

      {/* Rating Summary */}
      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Overall Rating */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <div className="text-center md:text-left">
              <div className="text-5xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(2)}
              </div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Based on {totalReviews.toLocaleString()}+ reviews
              </p>
            </div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, percentage, count }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-8">
                  {stars}★
                </span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filterOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setFilter(option.id)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium transition-all
              ${
                filter === option.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {option.label}
            {option.count > 0 && ` (${option.count})`}
          </button>
        ))}
      </div>

      {/* Sort & Count */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <p className="text-sm text-gray-600">
          Showing 1-{Math.min(displayCount, reviews.length)} of{' '}
          {reviews.length} reviews
        </p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="recommended">Recommended</option>
          <option value="recent">Most Recent</option>
          <option value="helpful">Most Helpful</option>
          <option value="highest">Highest Rating</option>
          <option value="lowest">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.slice(0, displayCount).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < reviews.length && (
        <button
          onClick={() => setDisplayCount((prev) => prev + 10)}
          className="w-full mt-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
        >
          Load More Reviews
        </button>
      )}
    </div>
  );
}

// Individual Review Card
function ReviewCard({ review }: { review: Review }) {
  const [showFullComment, setShowFullComment] = useState(false);
  const isLongComment = review.comment.length > 200;

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-gray-400" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900">{review.author}</span>
            {review.verified && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded font-medium">
                Verified Purchase
              </span>
            )}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* User Details */}
          {(review.height || review.weight || review.waist) && (
            <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-gray-600 mb-2">
              <span>
                Overall Fit:{' '}
                <span className="font-medium text-gray-900">{review.fit}</span>
              </span>
              {review.height && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>Height: {review.height}</span>
                </>
              )}
              {review.weight && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>Weight: {review.weight}</span>
                </>
              )}
              {review.waist && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>Waist: {review.waist}</span>
                </>
              )}
            </div>
          )}

          {/* Product Variant */}
          <div className="flex flex-wrap gap-x-3 text-sm text-gray-600 mb-3">
            <span>
              Color: <span className="font-medium text-gray-900">{review.color}</span>
            </span>
            <span className="text-gray-400">•</span>
            <span>
              Size: <span className="font-medium text-gray-900">{review.size}</span>
            </span>
          </div>

          {/* Comment */}
          <p className="text-gray-700 mb-3 leading-relaxed">
            {isLongComment && !showFullComment
              ? `${review.comment.substring(0, 200)}...`
              : review.comment}
            {isLongComment && (
              <button
                onClick={() => setShowFullComment(!showFullComment)}
                className="text-primary ml-2 hover:underline"
              >
                {showFullComment ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-3 overflow-x-auto">
              {review.images.map((img, idx) => (
                <div
                  key={idx}
                  className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <Image
                    src={img}
                    alt={`Review image ${idx + 1}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{review.date}</span>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <ThumbsUp className="w-4 h-4" />
              <span>Helpful ({review.helpful})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}