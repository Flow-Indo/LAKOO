'use client';

import SearchResultsAll from './SearchResultsAll';

interface SearchResultsImagesProps {
  query: string;
}

export default function SearchResultsImages({ query }: SearchResultsImagesProps) {
  // Images tab is similar to All tab but focuses on visual content
  // We can customize this later to show only images without text
  return <SearchResultsAll query={query} />;
}
