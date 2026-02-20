import React, { useState } from 'react';
import { Check } from 'lucide-react';


interface Props {
  selected?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  sizeClass?: string;
}

export default function CartSelectButton({
  selected,
  onClick,
  ariaLabel = 'Select product',
  sizeClass = 'w-6 h-6',
}: Props) {
  const [internalSelected, setInternalSelected] = useState(false);

  const isSelected = typeof selected === 'boolean' ? selected : internalSelected;

  const handleClick = (e?: React.MouseEvent) => {
    // prevent parent label click from also firing when clicking the inner button
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();

    if (onClick) {
      onClick();
    } else {
      setInternalSelected((s) => !s);
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => handleClick(e)}
      aria-pressed={isSelected}
      aria-label={ariaLabel}
      className={`flex-none inline-flex items-center justify-center ${sizeClass} aspect-square rounded-full p-0 leading-none overflow-hidden transition-colors min-h-0 ${
        isSelected ? 'bg-black text-white border-2 border-black' : 'bg-white border-2 border-gray-600'
      }`}
      style={{ minHeight: 0 }}
    >
      {isSelected ? <Check color="#ffffff" className="w-3 h-3" width={12} height={12} /> : null}
    </button>
  );
}
