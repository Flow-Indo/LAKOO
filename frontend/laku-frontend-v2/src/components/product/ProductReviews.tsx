 'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Star, ChevronRight, X, ChevronDown, Clock, Play, ThumbsUp, MessageSquare, Share2, MessageCircle } from 'lucide-react';

export default function ProductReviews({ product }: any) {
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('Semua');

  const defaultReviews = [
    { id: 'r_default_1', author: 'b***o', rating: 5, date: '2 hari yang lalu', text: 'Kualitas bahan sangat bagus, nyaman dipakai seharian. Model juga kece dan versatile, bisa dipake kemana aja. Wajib beli sekarang juga. Yang ga beli pasti fomo atau ga pny temen.', images: [], purchaseDetails: 'Warna: Biru Tua; Ukuran: L' },
    { id: 'r_default_2', author: 's***7', rating: 4, date: '5 hari yang lalu', text: 'Warna sesuai gambar, ukuran pas.', images: ['/jeans/jean_mock_reviews/reviews1.JPG'], purchaseDetails: 'Warna: Hitam; Ukuran: M' },
  ];

  const allReviews = (product?.reviews && product.reviews.length > 0) ? product.reviews : defaultReviews;
  const reviewCount = product?.reviewCount ?? allReviews.length;

  function getReviewTextField(rev: any) {
    const fields = ['text', 'comment', 'content', 'review', 'body', 'reviewText', 'shortText'];
    for (const f of fields) {
      const v = rev[f];
      if (typeof v === 'string' && v.trim().length > 0) return v.trim();
    }
    return '';
  }

  const sampleReviews = allReviews.slice(0, 2).map((r: any, idx: number) => ({
    ...r,
    text: getReviewTextField(r) || defaultReviews[idx % defaultReviews.length].text,
  }));

  // For modal list (placeholder filtering logic)
  const filteredReviews = allReviews;

  function ReviewCardFull({ review }: { review: any }) {
    return (
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3 relative">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex-shrink-0 flex items-center justify-center text-white font-semibold">
            {review.author ? review.author.charAt(0).toUpperCase() : 'U'}
          </div>

          <div className="flex-1">
            {/* Username with Badge */}
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{review.author}</span>
              {review.loyaltyBadge && (
                <span className="text-blue-500 text-sm">💎 {review.loyaltyBadge}</span>
              )}
            </div>

            {/* Super Badge */}
            {review.isSuperReview && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded text-xs font-medium mb-2">
                👍 Super
              </div>
            )}

            {/* Purchase Badge & Details */}
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-medium">
                Pembeli
              </span>
              <span className="text-xs text-gray-500">{review.purchaseDetails}</span>
            </div>

            {/* Stars - if showing */}
            {review.showStars && (
              <div className="flex gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < review.rating ? 'fill-[#FF2442] text-[#FF2442]' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Date - Top Right */}
            <div className="text-xs text-gray-400 absolute top-4 right-4">
              {review.date}
            </div>
          </div>
        </div>

        {/* Review Text */}
        <p className="text-sm text-gray-900 leading-relaxed mb-3">
          {review.text}
        </p>

        {/* Media Grid - Images/Videos */}
        {review.media && review.media.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {review.media.map((item: any, idx: number) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100 relative">
                {item.type === 'video' ? (
                  <>
                    <Image src={item.thumbnail} alt={`Media ${idx + 1}`} fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="w-5 h-5 text-gray-900 ml-0.5" />
                      </div>
                    </div>
                  </>
                ) : (
                  <Image src={item.url} alt={`Review image ${idx + 1}`} fill className="object-cover" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Size Fit Badge (if applicable) */}
        {review.sizeFit && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-sm mb-3">
            <span className="text-gray-600">Ukuran pas</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm">{review.likes || 1}</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">Komentar</span>
          </button>
          <button className="flex items-center gap-1.5 text-gray-600 hover:text-orange-500">
            <Share2 className="w-4 h-4" />
            <span className="text-sm">Bagikan</span>
          </button>
          {review.comments > 0 && (
            <button className="flex items-center gap-1.5 text-orange-500">
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm">{review.comments}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 border-b border-gray-200">
      

      {/* Header with Statistics */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-[16px] leading-tight">Ulasan · {reviewCount}</h3>
        <div className="flex flex-col items-end">
          <button
            onClick={() => setReviewsModalOpen(true)}
            className="pt-3 text-gray-500 text-xs sm:text-sm flex items-center gap-1 leading-tight"
          >
            Lihat Semua
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="text-[12px] text-gray-500">Rata-rata</span>
            <Star className="w-3.5 h-3.5 fill-[#FF2442] text-[#FF2442]" />
            <span className="text-xs font-medium text-gray-900">{product?.rating ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Reviews Preview */}
      <div className="py-0">
        {sampleReviews.map((review: any) => (
          <div key={review.id} className="bg-white pb-3 mb-4 border-b border-gray-100 last:border-b-0">
            <div className="pt-2 flex items-start gap-3">
              <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-br from-[#FF2442] to-[#FF6B35] flex-shrink-0 flex items-center justify-center text-white font-medium">
                <span className="text-[9px]">
                  {review.author ? review.author.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-xs sm:text-sm">{review.author}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < (review.rating || 0) ? 'fill-[#FF2442] text-[#FF2442]' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                </div>

                {review.purchaseDetails && (
                  <div className="text-xs text-gray-500 mb-2">
                    {review.purchaseDetails}
                  </div>
                )}

                  <p className="py-1 text-xs sm:text-sm text-gray-900 leading-relaxed mb-2 line-clamp-3">
                    {review.text}
                  </p>

                {review.images && review.images.length > 0 && (
                  <div className="pb-2 flex gap-2 overflow-x-auto no-scrollbar mb-2">
                    {review.images.map((img: string, idx: number) => (
                      <div key={idx} className="w-24 h-24 rounded overflow-hidden bg-gray-100 flex-shrink-0">
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

                <div className="text-xs text-gray-400 mt-2">{review.date}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reviews Modal - Full Screen */}
      {reviewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header - Fixed */}
          <div className="bg-white border-b border-gray-200">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="font-semibold text-gray-900 text-lg">Ulasan</h3>
              <button
                onClick={() => setReviewsModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Main Filter Tabs */}
            <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setReviewFilter('Semua')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  reviewFilter === 'Semua' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setReviewFilter('Dengan Gambar')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  reviewFilter === 'Dengan Gambar' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Gambar/Video {allReviews.filter((r: any) => (r.images || []).length > 0).length}
              </button>
              <button
                onClick={() => setReviewFilter('Ulasan Lanjutan')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  reviewFilter === 'Ulasan Lanjutan' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Ulasan Lanjutan 1
              </button>
              <button
                onClick={() => setReviewFilter('Positif')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  reviewFilter === 'Positif' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Positif {reviewCount}
              </button>
            </div>

            {/* Tag Filters */}
            <div className="flex gap-2 px-4 py-2 overflow-x-auto no-scrollbar border-b border-gray-100">
              <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm whitespace-nowrap">
                Desain Keren 3
              </button>
              <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm whitespace-nowrap">
                Kualitas Bagus 2
              </button>
              <ChevronDown className="w-5 h-5 text-gray-400 self-center" />
            </div>

            {/* Sort Options */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-gray-400">✓</span>
                <span>Menampilkan ulasan asli untuk Anda</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1 text-sm text-gray-700">
                  <span>Terbaru</span>
                  <Clock className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-1 text-sm text-gray-700">
                  <span>Gaya</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Reviews List - Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {filteredReviews.map((review: any) => (
              <ReviewCardFull key={review.id} review={review} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

