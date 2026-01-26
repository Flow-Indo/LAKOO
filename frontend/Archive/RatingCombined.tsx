import React from "react";
import { Star } from "lucide-react";

type RatingCombinedProps = {
  rating: number; // 0.0 – 5.0
  sold: number;
  className?: string;
};

function formatTerjual(value: number) {
  if (value < 1000) return `${value}`;
  if (value < 10_000) return `${Math.floor(value / 1000)} rb+`;
  return `${Math.floor(value / 1000)} rb+`;
}

export function RatingCombined({ rating, sold, className = "" }: RatingCombinedProps) {
  const safeRating = Math.min(5, Math.max(0, rating));

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Rating with star */}
      <div className="inline-flex items-center gap-[2px] text-yellow-400 font-semibold text-[clamp(10px,2.2vw,12px)]">
        <span className="leading-none text-[1.1em]">
          <Star className="w-6 h-6" style={{ paddingLeft: "10px" }} fill="currentColor" stroke="none" />
        </span>
        <span className="leading-none">{safeRating.toFixed(1)}</span>
      </div>

      {/* Separator */}
      <span className="text-gray-400 text-[clamp(10px,2.2vw,12px)] leading-none">|</span>

      {/* Sales count */}
      <span className="text-gray-500 font-medium whitespace-nowrap text-[clamp(10px,2.2vw,12px)]">
        {formatTerjual(sold)} terjual
      </span>
    </div>
  );
}

export default RatingCombined;