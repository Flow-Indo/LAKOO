'use client';

import React from 'react';
import XiaohongshuPost from '../../../../components/explore/XiaohongshuPost';

const SAMPLE_POSTS = [
  {
    // matches productsData key 'cult-suri'
    id: 'cult-suri',
    image: '/products/CULT SURI - Coco Top Chiffon Dengan Scarf Detail/cult_eksplor1.webp',
    title: 'Atasan Chiffon Elegan untuk Acara Spesial ✨',
    author: { username: 'FashionDiary', avatar: '' },
    likes: 2847,
  },
  {
    // matches productsData key 'wearthreek'
    id: 'wearthreek',
    image: '/products/WEAR THREEK - Britney Low Waist Jeans/wearthreek_eksplor1.webp',
    title: 'Jeans Low Waist - Comfortable & Stylish',
    author: { username: 'JeanLover', avatar: '' },
    likes: 1298,
  },
  {
    // matches productsData key 'rue'
    id: 'rue',
    image: '/products/RUE - Sheer Top Atasan Lengan Panjang Boatneck Longsleeve/rue_eksplor1.webp',
    title: 'Sheer Top Boatneck — Dress it up or down',
    author: { username: 'StyleGuru', avatar: '' },
    likes: 945,
  },
];

export default function ProfilePosts() {
  return (
    <div className="w-full min-h-[300px] flex flex-col items-center justify-center">
      <div className="w-full p-1">
        <div className="grid grid-cols-2 gap-1.5">
          {SAMPLE_POSTS.map((post) => (
            <div key={post.id} className="col-span-1">
              <XiaohongshuPost post={post as any} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
