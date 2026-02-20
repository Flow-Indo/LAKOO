'use client';

import { useEffect, useState } from 'react';
import { LiveHeader } from './LiveHeader';
import { LiveChat } from './LiveChat';
import { LiveProductCard } from './LiveProductCard';
import { LiveActionBar } from './LiveActionBar';
import type { LiveStream, LiveComment, LiveViewer } from '@/types/live-stream';
import { mockComments, mockJoins, mockGifts } from '@/lib/mock-live-stream-data';

interface Props {
  stream: LiveStream;
}

export function LiveStreamPlayer({ stream }: Props) {
  const [currentStream, setCurrentStream] = useState<LiveStream>(stream);
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);

  // Simulate live chat
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly add comments, joins, or gifts
      const randomType = Math.random();

      if (randomType < 0.6) {
        // Add regular comment
        const mockComment = mockComments[Math.floor(Math.random() * mockComments.length)];
        const newComment: LiveComment = {
          id: Date.now().toString(),
          user: {
            id: mockComment.user,
            username: mockComment.user,
            avatar: mockComment.avatar,
            isVerified: Math.random() > 0.8, // 20% chance of verification
          },
          text: mockComment.text,
          timestamp: new Date(),
          type: 'comment',
        };
        setComments(prev => [...prev.slice(-4), newComment]); // Keep last 5 comments

      } else if (randomType < 0.8) {
        // Add join notification
        const mockJoin = mockJoins[Math.floor(Math.random() * mockJoins.length)];
        const newComment: LiveComment = {
          id: Date.now().toString(),
          user: {
            id: mockJoin.user,
            username: mockJoin.user,
            avatar: mockJoin.avatar,
          },
          text: mockJoin.text,
          timestamp: new Date(),
          type: 'join',
        };
        setComments(prev => [...prev.slice(-4), newComment]);

        // Increase viewer count
        setCurrentStream(prev => ({
          ...prev,
          viewerCount: prev.viewerCount + Math.floor(Math.random() * 3) + 1,
        }));

      } else {
        // Add gift/rose
        const mockGift = mockGifts[Math.floor(Math.random() * mockGifts.length)];
        const isRose = mockGift.name === 'Rose';
        const newComment: LiveComment = {
          id: Date.now().toString(),
          user: {
            id: 'gift-user',
            username: 'Anonymous',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=32&h=32&fit=crop',
          },
          text: `sent ${mockGift.icon} ${mockGift.name}`,
          timestamp: new Date(),
          type: isRose ? 'rose' : 'gift',
          giftValue: mockGift.value,
        };
        setComments(prev => [...prev.slice(-4), newComment]);
      }
    }, 3000 + Math.random() * 2000); // 3-5 second intervals

    return () => clearInterval(interval);
  }, []);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStream(prev => ({
        ...prev,
        viewerCount: Math.max(1000, prev.viewerCount + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 10)),
      }));
    }, 10000 + Math.random() * 10000); // 10-20 second intervals

    return () => clearInterval(interval);
  }, []);

  const handleLike = () => {
    setCurrentStream(prev => ({
      ...prev,
      likeCount: prev.likeCount + 1,
    }));
  };

  const handleComment = () => {
    setShowCommentInput(true);
    // In a real app, this would open a comment input modal
  };

  const handleShop = () => {
    // In a real app, this would show product details or cart
    console.log('Open shop/cart');
  };

  const handleRose = () => {
    // In a real app, this would open rose/gift selection
    console.log('Send rose');
  };

  const handleGift = () => {
    // In a real app, this would open gift selection modal
    console.log('Send gift');
  };

  const handleShare = () => {
    // In a real app, this would open share options
    console.log('Share live stream');
  };

  const handleBuy = () => {
    // In a real app, this would add to cart and show confirmation
    console.log('Buy product:', currentStream.currentProduct?.name);
  };

  return (
    <div className="relative w-full h-screen bg-black">
      {/* Live Video Stream */}
      <video
        src="https://videos.pexels.com/video-files/4720473/4720473-sd_640_426_25fps.mp4"
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Header Overlay */}
      <LiveHeader stream={currentStream} onLike={handleLike} />

      {/* Live Chat */}
      <LiveChat comments={comments} onCommentClick={handleComment} />

      {/* Product Card */}
      {currentStream.currentProduct && (
        <LiveProductCard
          product={currentStream.currentProduct}
          onBuy={handleBuy}
        />
      )}

      {/* Action Bar */}
      <LiveActionBar
        cartItemCount={2} // Mock cart count
        onShop={handleShop}
        onComment={handleComment}
        onRose={handleRose}
        onGift={handleGift}
        onShare={handleShare}
      />

      {/* Comment Input Modal (placeholder) */}
      {showCommentInput && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-2xl p-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full"
                autoFocus
              />
              <button
                onClick={() => setShowCommentInput(false)}
                className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}