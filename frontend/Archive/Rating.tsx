import React from "react";

type RatingProps = {
  value: number; // 0.0 – 5.0
  className?: string;
};

export function Rating({ value, className = "" }: RatingProps) {
  const safeValue = Math.min(5, Math.max(0, value));

  return (
    <div
      className={`
        inline-flex items-center gap-[2px]
        text-yellow-400 font-semibold
        text-[clamp(14px,2.2vw,16px)]
        ${className}
      `}
    >
      <span className="leading-none text-[1.1em]">★</span>
      <span className="leading-none">{safeValue.toFixed(1)}</span>
    </div>
  );
}
