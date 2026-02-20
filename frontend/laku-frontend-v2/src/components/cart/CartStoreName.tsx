'use client';

interface Props {
  name: string;
}

export function CartStoreName({ name }: Props) {
  return (
    <h3
      className="text-sm font-bold text-gray-900 w-[200px] cart-store-name"
      style={{
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        lineHeight: '1.45',
        wordBreak: 'break-word',
        margin: 0,
        padding: 0,
        minHeight: 0,
        fontWeight: 600,
      }}
    >
      {name}
    </h3>
  );
}

