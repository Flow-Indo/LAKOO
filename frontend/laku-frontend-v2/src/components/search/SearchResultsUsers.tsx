'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface SearchResultsUsersProps {
  query: string;
}

export default function SearchResultsUsers({ query }: SearchResultsUsersProps) {
  // Mock users
  const users = [
    {
      id: '1',
      username: 'Fashion Diary',
      avatar: '',
      followers: 88500,
      redId: '4207665189',
      subtitle: 'Fashion enthusiast'
    },
    {
      id: '2',
      username: 'Style Maven',
      avatar: '',
      followers: 21100,
      redId: null,
      hasRelatedPosts: true,
      subtitle: 'Memposting catatan terkait'
    },
    {
      id: '3',
      username: 'Beauty Guru',
      avatar: '',
      followers: 45600,
      redId: '4207665190',
      subtitle: 'Makeup tutorials'
    },
    {
      id: '4',
      username: 'OOTD Daily',
      avatar: '',
      followers: 32400,
      redId: null,
      hasRelatedPosts: true,
      subtitle: 'Memposting catatan terkait'
    },
    {
      id: '5',
      username: 'Cozy Corner',
      avatar: '',
      followers: 18900,
      redId: '4207665191',
      subtitle: 'Home decor'
    }
  ];

  const [following, setFollowing] = useState<Set<string>>(new Set());

  const formatFollowers = (count: number) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}rb`;
    }
    return count.toString();
  };

  const handleFollow = (userId: string) => {
    setFollowing(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="px-3 py-4">
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 p-2"
            >
              {/* Avatar with Icon Badge */}
              <Link href={`/user/${user.id}`} className="relative flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <HelpCircle className="w-6 h-6 text-blue-500" />
                  )}
                </div>
              </Link>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <Link href={`/user/${user.id}`} className="block">
                  <h3 className="text-sm font-medium text-gray-900 mb-0.5 truncate">
                    {user.username}
                  </h3>
                  <p className="text-xs text-gray-500 mb-0.5">
                    Pengikut {formatFollowers(user.followers)}
                  </p>
                  {user.hasRelatedPosts ? (
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <span>📝</span>
                      <span>{user.subtitle}</span>
                    </div>
                  ) : user.redId ? (
                    <p className="text-xs text-gray-400">
                      RED ID: {user.redId}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      {user.subtitle}
                    </p>
                  )}
                </Link>
              </div>

              {/* Follow Button - MOBILE OPTIMIZED */}
              <button
                onClick={() => handleFollow(user.id)}
                className={`flex-shrink-0 h-8 px-4 border rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                  following.has(user.id)
                    ? 'border-gray-300 text-gray-700 bg-gray-100 hover:bg-gray-200'
                    : 'border-[#FF2442] text-[#FF2442] hover:bg-[#FF2442] hover:text-white'
                }`}
              >
                {following.has(user.id) ? 'Mengikuti' : 'Ikuti'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
