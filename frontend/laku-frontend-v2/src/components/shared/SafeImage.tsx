'use client';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
}

export function SafeImage({
  src,
  alt,
  className = '',
  fill = false,
}: SafeImageProps) {
  const style: React.CSSProperties = {
    objectFit: 'cover',
    width: '100%',
    height: '100%',
  };

  if (fill) {
    style.position = 'absolute';
    style.top = '0';
    style.left = '0';
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
    />
  );
}
