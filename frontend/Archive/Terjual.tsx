import * as React from 'react';

type TerjualProps = {
  value: number;
  className?: string;
};

function formatTerjual(value: number) {
  if (value < 1000) return `${value}`;
  if (value < 10_000) return `${Math.floor(value / 1000)} rb+`;
  return `${Math.floor(value / 1000)} rb+`;
}

export function Terjual({ value, className = "" }: TerjualProps) {
  return (
    <span
      className={`text-gray-500 font-medium whitespace-nowrap
        text-[clamp(14px,2.2vw,16px)]
        ${className}`}
    >
      {formatTerjual(value)} terjual 
    </span>
  );
}
