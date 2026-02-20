'use client';

interface Props {
  variations?: string;
}

export function CartStoreVariations({ variations }: Props) {
  if (!variations) return null;
  return <p className="text-xs text-gray-600 w-[200px] mb-[10px]">{variations}</p>;
}

