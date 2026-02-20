'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchHeader from '@/components/search/SearchHeader';
import SearchLanding from '@/components/search/SearchLanding';
import SearchResults from '@/components/search/SearchResults';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'products' | 'images'>('all');

  // Get query from URL
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    router.push('/search');
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchHeader
        query={searchQuery}
        onSearch={handleSearch}
        onClear={handleClearSearch}
      />

      {!searchQuery ? (
        <SearchLanding onSearch={handleSearch} />
      ) : (
        <SearchResults
          query={searchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff2742]"></div>
    </div>}>
      <SearchPageContent />
    </Suspense>
  );
}
