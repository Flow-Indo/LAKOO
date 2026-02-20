'use client';

import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image: string;
  href: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'T-shirt',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
    href: '/category/t-shirt',
  },
  {
    id: '2',
    name: 'Jeans',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop',
    href: '/category/jeans',
  },
  {
    id: '3',
    name: 'Jacket',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop',
    href: '/category/jacket',
  },
  {
    id: '4',
    name: 'Sweater',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=100&h=100&fit=crop',
    href: '/category/sweater',
  },
  {
    id: '5',
    name: 'Vest',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=100&h=100&fit=crop',
    href: '/category/vest',
  },
  {
    id: '6',
    name: 'Coat',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=100&h=100&fit=crop',
    href: '/category/coat',
  },
  {
    id: '7',
    name: 'Shirt',
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=100&h=100&fit=crop',
    href: '/category/shirt',
  },
  {
    id: '8',
    name: 'Dress',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=100&h=100&fit=crop',
    href: '/category/dress',
  },
  {
    id: '9',
    name: 'Shoes',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=100&h=100&fit=crop',
    href: '/category/shoes',
  },
  {
    id: '10',
    name: 'Pants',
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=100&h=100&fit=crop',
    href: '/category/pants',
  },
];

export function CategoryGrid() {
  return (
    <div className="bg-white border-b border-gray-100 py-3 px-3">
      {/* Category Grid - 2 rows x 5 columns */}
      <div className="grid grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="flex flex-col items-center gap-1.5"
          >
            {/* Category Image */}
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gray-100">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover"
                sizes="20vw"
              />
            </div>
            
            {/* Category Name */}
            <span className="text-[11px] text-gray-700 text-center leading-tight">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryGrid;
