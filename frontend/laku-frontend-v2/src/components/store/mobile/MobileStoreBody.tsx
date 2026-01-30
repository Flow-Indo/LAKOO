 'use client';

import React from 'react';
import CarouselVerOne from './CarouselVerOne';
import CarouselVerTwo from './CarouselVerTwo';
import CarouselVerThree from './CarouselVerThree';
import StoreVirtualFit from './StoreVirtualFit';
import ProductShow from './ProductShow';
import RankingBox from './RankingBox';

export function MobileStoreBody() {
  const images = [
    '/jeans/jean_mock_images/IMG_9976.JPG',
    '/jeans/jean_mock_images/IMG_9977.JPG',
    '/jeans/jean_mock_images/IMG_9978.JPG',
    '/jeans/jean_mock_images/IMG_9979.JPG',
  ];

  return (
    <div className="px-4 pb-4 flex flex-col" style={{ gap: '10px' }}>
      <CarouselVerOne images={images} height="60vh" />
      <CarouselVerThree
        background="/jeans/jean_mock_details/bgrb.png"
        images={[
          { src: '/jeans/jean_mock_details/rb1.png', height: '500px', y: '0%' },
          { src: '/jeans/jean_mock_details/rb2.png', height: '500px', y: '0%' },
          { src: '/jeans/jean_mock_details/rb3.png', height: '550px', y: '0%' },
        ]}
        height="60vh"
        duration={8}
      />
      <div className="mt-2">
        <ProductShow images={[
          { src: '/jeans/jean_mock_details/rb1.png', y: '0%', x: '0%', scale: 120 },
          { src: '/jeans/jean_mock_details/rb2.png', y: '0%', x: '0%', scale: 120 } ,
          { src: '/jeans/jean_mock_details/rb3.png', y: '-5%', x: '0%', scale: 120 },
          { src: '/jeans/jean_mock_details/rb1.png', y: '0%', x: '0%', scale: 120 },
          { src: '/jeans/jean_mock_details/rb2.png', y: '0%', x: '0%', scale: 120 } ,
          { src: '/jeans/jean_mock_details/rb3.png', y: '0%', x: '0%', scale: 120 },
          { src: '/jeans/jean_mock_details/rb1.png', y: '0%', x: '0%', scale: 120 },
          { src: '/jeans/jean_mock_details/rb2.png', y: '0%', x: '0%', scale: 120 } ,
          { src: '/jeans/jean_mock_details/rb3.png', y: '0%', x: '0%', scale: 120 },

        ]} 
        gap="10px" />
      </div>
    
      <StoreVirtualFit/>
      <RankingBox top={3} />
     
      {/* Centered divider with 'Produk' label (gradient lines) */}
      <div className="w-full flex items-center justify-center my-1">
        <div
          style={{ width: '28%', height: '1px', background: 'linear-gradient(to left, #FF6A00 0%, #FFFFFF 100%)' }}
        />
        <span style={{ margin: '0 12px' }} className="text-[#FF6A00] font-semibold">Produk</span>
        <div
          style={{ width: '28%', height: '1px', background: 'linear-gradient(to right, #FF6A00 0%, #FFFFFF 100%)' }}
        />
      </div>

      </div>
 
  );
}