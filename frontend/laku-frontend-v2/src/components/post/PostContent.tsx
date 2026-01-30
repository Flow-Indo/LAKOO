'use client';

import { useState } from 'react';
import Link from 'next/link';

interface PostContentProps {
  post: {
    title: string;
    content: string;
    tags: string[];
    group?: { id: string; name: string; memberCount: number };
    event?: { id: string; name: string };
    suggestions?: { text: string }[];
    location: string;
    editedAt: string;
    originalityDeclared: boolean;
  };
}

export default function PostContent({ post }: PostContentProps) {
  const [showFull, setShowFull] = useState(true); // Default to full

  return (
    <div className="px-3 py-3 bg-white">
      {/* Title - Smaller on mobile */}
      <h1 className="text-sm font-semibold text-gray-900 leading-snug mb-2">
        {post.title}
      </h1>
      
      {/* Content - Full display */}
      <div className="mb-2">
        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>
      
      {/* Tags - Compact */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5 gap-y-0.5 mb-3">
          {post.tags.map((tag, i) => (
            <Link 
              key={i}
              href={`/explore?tag=${tag.replace('#', '')}`}
              className="text-xs text-[#0066FF]"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* Group Card - Compact */}
      {post.group && (
        <Link
          href={`/group/${post.group.id}`}
          className="flex items-center gap-2 p-2 mb-2 bg-[#F7F7F7] hover:bg-[#F0F0F0] rounded-lg transition-colors"
        >
          <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 uppercase font-medium">GRUP</p>
            <p className="text-xs font-medium text-gray-900 truncate">{post.group.name}</p>
            <p className="text-[10px] text-gray-600">{post.group.memberCount} anggota</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
      
      {/* Event Card - Compact */}
      {post.event && (
        <Link
          href={`/event/${post.event.id}`}
          className="flex items-center gap-2 p-2 mb-2 bg-[#FFF7ED] hover:bg-[#FFEDD5] rounded-lg transition-colors"
        >
          <div className="w-8 h-8 bg-[#FF6B2C] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#FF6B2C] uppercase font-medium">ACARA</p>
            <p className="text-xs font-medium text-gray-900 truncate">{post.event.name}</p>
            <p className="text-[10px] text-[#FF6B2C]">Sedang berlangsung</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
      
      {/* Suggestions - Compact */}
      {post.suggestions && post.suggestions.length > 0 && post.suggestions.map((sug, i) => (
        <Link
          key={i}
          href={`/explore?q=${encodeURIComponent(sug.text)}`}
          className="flex items-start gap-2 mb-2 group"
        >
          <span className="text-xs">💡</span>
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 uppercase font-medium">MUNGKIN ANDA SUKA</p>
            <p className="text-xs text-gray-700">{sug.text}</p>
          </div>
        </Link>
      ))}
      
      {/* Translate - Compact */}
      <button className="flex items-center gap-1.5 mb-3 text-xs text-gray-600 hover:text-gray-900">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Terjemahkan</span>
      </button>
      
      {/* Metadata - Tighter */}
      <div className="pt-2 border-t border-gray-100 space-y-1">
        <div className="flex items-center gap-1 text-[10px] text-gray-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{post.editedAt} • {post.location}</span>
        </div>
        
        {post.originalityDeclared && (
          <Link
            href="/originality"
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-700"
          >
            <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Orisinalitas dinyatakan</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
