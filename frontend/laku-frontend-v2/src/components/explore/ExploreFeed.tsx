'use client';

import { XiaohongshuPost } from './XiaohongshuPost';

const mockPosts = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=533&fit=crop',
    title: 'New fashion collection 2024! Check out these amazing pieces',
    author: {
      username: 'fashionista_id',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    likes: 501,
    isLiked: false,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=533&fit=crop',
    title: 'Shopping haul! Got these amazing deals today',
    author: {
      username: 'lifestyle_guru',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    likes: 183,
    isLiked: true,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=533&fit=crop',
    title: 'Best meal of the day! Recipe in my profile',
    author: {
      username: 'foodie_adventures',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    likes: 890,
    isLiked: false,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=400&h=533&fit=crop',
    title: 'Paradise found! Who wants to come here?',
    author: {
      username: 'travel_diary',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    likes: 1200,
    isLiked: false,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=533&fit=crop',
    title: 'Morning workout routine. Lets get fit together!',
    author: {
      username: 'fitness_coach',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    likes: 540,
    isLiked: true,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=533&fit=crop',
    title: 'Latest tech gadgets review. Link in bio!',
    author: {
      username: 'tech_reviewer',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    likes: 765,
    isLiked: false,
  },
  {
    id: '7',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=533&fit=crop',
    title: 'Sneaker collection update. Which one is your favorite?',
    author: {
      username: 'sneaker_head',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
    likes: 923,
    isLiked: false,
  },
  {
    id: '8',
    image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=533&fit=crop',
    title: 'Home decor ideas for small spaces',
    author: {
      username: 'interior_design',
      avatar: 'https://i.pravatar.cc/150?img=8',
    },
    likes: 456,
    isLiked: true,
  },
];

export function ExploreFeed() {
  return (
    <div className="px-1 py-1">
      <div
        className="grid grid-cols-2 gap-1"
        style={{
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        {mockPosts.map((post) => (
          <XiaohongshuPost key={post.id} post={post} />
        ))}
      </div>

      <div className="text-center py-4 pb-20">
        <button className="px-4 py-1.5 bg-white text-gray-700 rounded-full font-medium text-xs border border-gray-300 hover:bg-gray-50 transition-colors">
          Load More
        </button>
      </div>
    </div>
  );
}

export default ExploreFeed;
