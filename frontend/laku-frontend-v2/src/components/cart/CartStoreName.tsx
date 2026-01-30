'use client';

interface Props {
  name: string;
}

export function CartStoreName({ name }: Props) {
  return (
    <h3 className="text-sm text-gray-900 font-medium line-clamp-1 mb-1 w-[200px] cart-store-name">
      {name}
    </h3>
  );
}

