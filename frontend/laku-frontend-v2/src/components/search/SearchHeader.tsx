'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Camera, X } from 'lucide-react';

interface SearchHeaderProps {
  query: string;
  onSearch: (query: string) => void;
  onClear: () => void;
}

export default function SearchHeader({ query, onSearch, onClear }: SearchHeaderProps) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(query);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  // Fetch suggestions
  useEffect(() => {
      if (inputValue.length > 0) {
          const mockSuggestions = [
            `${inputValue} fashion`,
            `${inputValue} style`,
            `${inputValue} outfit`,
            `${inputValue} review`,
            `${inputValue} tutorial`,
            `${inputValue} aesthetic`,
            `${inputValue} trends`,
            `${inputValue} inspirasi`,
            `${inputValue} rekomendasi`,
            `${inputValue} terbaik`,
            `${inputValue} murah`,
            `${inputValue} original`,
            `${inputValue} import`,
            `${inputValue} lokal`,
            `${inputValue} branded`,
          ];
          setSuggestions(mockSuggestions);
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      }, [inputValue]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleClear = () => {
    setInputValue('');
    onClear();
    inputRef.current?.focus();
  };

  return (
    <>
      {/* UNIFIED SEARCH BAR - Single container for all elements */}
      <header ref={containerRef} className="sticky top-0 z-50 bg-white">
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="p-2 -ml-1 flex-shrink-0"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" strokeWidth={2} />
          </button>

          {/* UNIFIED SEARCH CONTAINER - All in one bar */}
          <div className="flex-1 flex items-center gap-2 h-9 px-3.5 bg-[#F7F8FA] rounded-[18px]">
            {/* Search Input */}
            <form onSubmit={handleSubmit} className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Cari di Laku..."
                className="w-full bg-transparent text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
                style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontSize: '16px' }}
              />
            </form>

            {/* Clear Button (shows when typing) */}
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="w-5 h-5 flex items-center justify-center bg-gray-400 rounded-full hover:bg-gray-500 transition-colors flex-shrink-0"
              >
                <X className="w-3 h-3 text-white" strokeWidth={2.5} />
              </button>
            )}

            {/* Camera Icon - INSIDE the bar */}
            <button
              type="button"
              className="flex-shrink-0 p-1"
            >
              <Camera className="w-[20px] h-[20px] text-gray-600" strokeWidth={2} />
            </button>
          </div>

          {/* Search Button - OUTSIDE but adjacent */}
          <button
            onClick={handleSubmit}
            className="flex-shrink-0 px-4 h-9 bg-[#FF2442] text-white rounded-[18px] text-[15px] font-medium hover:bg-[#E61E3A] transition-colors"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
          >
            Cari
          </button>
        </div>
      </header>

      {/* Autocomplete Suggestions - Full height dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setShowSuggestions(false)}
          />
          <div className="fixed left-0 right-0 top-[52px] bottom-0 bg-white z-50 shadow-lg overflow-y-auto">
            <div className="pb-20">
              {suggestions.map((suggestion, index) => {
                const parts = suggestion.split(inputValue);

                return (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    {/* Search Icon */}
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                    </svg>

                    {/* Suggestion Text with Highlighted Query */}
                    <span className="flex-1 text-left text-[16px] text-gray-900">
                      {parts[0]}
                      <span className="text-[#FF2442] font-medium">{inputValue}</span>
                      {parts[1]}
                    </span>

                    {/* Arrow Icon */}
                    <svg className="w-5 h-5 text-gray-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
}
