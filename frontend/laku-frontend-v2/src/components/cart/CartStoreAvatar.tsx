'use client';

import Image from 'next/image';

interface Props {
  src: string;
  alt?: string;
  size?: number;
}

export function CartStoreAvatar({ src, alt = 'avatar', size = 24 }: Props) {
  return <Image src={src} alt={alt} width={size} height={size} className="rounded-full" />;
}

