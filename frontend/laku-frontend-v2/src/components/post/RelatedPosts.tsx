import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye } from 'lucide-react';

interface RelatedPost {
  id: string;
  image: string;
  title: string;
  author: { name: string; avatar: string };
  views: number;
  likes: number;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return num.toString();
};

export default function RelatedPosts({ posts = [] }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null; // Don't render if no related posts
  }

  return (
    <div className="px-3 py-5 bg-white">
      {/* Header - Tighter spacing */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">Mungkin Anda Suka</h2>
        <p className="text-xs text-gray-600">Konten untuk Anda</p>
      </div>
      
      {/* Grid - Optimized for iPhone */}
      <div className="grid grid-cols-2 gap-2.5">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="group block"
          >
            {/* Image - Slightly smaller on mobile */}
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden mb-2">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 390px) 50vw, (max-width: 768px) 33vw, 25vw"
              />
              
              {/* Stats Overlay - Compact */}
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-white text-[9px]">
                  <Eye className="w-2 h-2" />
                  <span>{formatNumber(post.views)}</span>
                </div>
                <div className="flex items-center gap-0.5 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded text-white text-[9px]">
                  <Heart className="w-2 h-2" />
                  <span>{formatNumber(post.likes)}</span>
                </div>
              </div>
            </div>
            
            {/* Title - Tighter */}
            <h3 className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-[#ff2742]">
              {post.title}
            </h3>
            
            {/* Author - Compact */}
            <div className="flex items-center gap-1">
              <Image
                src={post.author.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(post.author.name)}`}
                alt={post.author.name}
                width={14}
                height={14}
                className="rounded-full"
              />
              <span className="text-[10px] text-gray-600 truncate max-w-[80px]">{post.author.name}</span>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Load More - Compact */}
      <button className="mt-4 w-full py-2 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
        Lihat lebih banyak
      </button>
    </div>
  );
}
