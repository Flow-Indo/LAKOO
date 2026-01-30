'use client';

import React from 'react';

type ImageItem = string | { src: string; y?: string | number; x?: string | number; scale?: number };

type Props = {
  images: ImageItem[];
  /** gap between items (CSS size) */
  gap?: string;
  /** optional wrapper class */
  className?: string;
};

export default function ProductShow({ images, gap = '12px', className = '', background = '/jeans/jean_mock_details/bgrb.png' }: Props & { background?: string }) {
  const count = Math.max(0, images.length);
  const cols = count === 0 ? 1 : count < 3 ? count : 3;

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap,
    alignItems: 'start',
    justifyItems: 'stretch',
  };

  const wrapperStyle: React.CSSProperties = {
    backgroundImage: `url(${background})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '12px',   //untuk product box nya dengan background jarak
    borderRadius: 12,
  };

  const cardStyle: React.CSSProperties = {
    background: 'white',
    borderRadius: 10,
    padding: 0,
    boxShadow: '0 1px 0 rgba(0,0,0,0.06)',
  };

  return (
    <div className={className} style={wrapperStyle}>
      <div style={gridStyle}>
        {images.map((item, i) => {
          const src = typeof item === 'string' ? item : item.src;
          const y = typeof item === 'string' ? '50%' : item.y ?? '50%';
          const x = typeof item === 'string' ? '50%' : item.x ?? '50%';
          const scale = typeof item === 'string' ? 100 : item.scale ?? 120;
          const yValue = typeof y === 'number' ? `${y}px` : y;
          const xValue = typeof x === 'number' ? `${x}%` : x;
          const scaleValue = `${scale}%`;
          return (
            <div key={src + '-' + i} style={{ width: '100%', position: 'relative' }}>
              <div style={cardStyle}>
                <div style={{ width: '100%', paddingTop: '100%', position: 'relative', overflow: 'hidden', borderRadius: 6 }}>
                  <img
                    src={src}
                    alt={`product-${i}`}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      height: scaleValue,
                      width: 'auto',
                      // center then apply x/y offsets (x as percent or px, y as percent or px)
                      transform: `translate(calc(-50% + ${xValue}), calc(-50% + ${yValue}))`,
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

