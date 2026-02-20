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
    <div className="px-4 py-4 bg-white">
      {/* Title */}
      <h1 className="text-sm font-[600] text-gray-900 leading-snug mb-6">
        {post.title}
      </h1>
      
      {/* Content - More spacious */}
      <div className="py-2">
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>
      
        {/* Tags - More spacious */}
      {post.tags && post.tags.length > 0 && (
        <div className="py-2 flex flex-wrap gap-x-2">
          {post.tags.map((tag, i) => (
            <Link
              key={i}
              href={`/search?q=${encodeURIComponent(tag.replace('#', ''))}`}
              className="text-sm text-[#0044CC]"
            >
              {tag}
            </Link>
          ))}
        </div>
      )}
      
      {/* Group Card - More spacious */}
      {post.group && (
        <Link
          href={`/group/${post.group.id}`}
          className="py-2 flex items-center gap-3 p-3 mb-3 bg-[#F7F7F7] hover:bg-[#F0F0F0] rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-500 uppercase font-medium">GRUP</p>
            <p className="text-sm font-medium text-gray-900 truncate">{post.group.name}</p>
            <p className="text-xs text-gray-600">{post.group.memberCount} anggota</p>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
      
      {/* Event Card - More spacious */}
      {post.event && (
        <Link
          href={`/event/${post.event.id}`}
          className="py-2flex items-center gap-3 p-3 mb-3 bg-[#FFF7ED] hover:bg-[#FFEDD5] rounded-lg transition-colors"
        >
          <div className="w-10 h-10 bg-[#FF6B2C] rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#FF6B2C] uppercase font-medium">ACARA</p>
            <p className="text-sm font-medium text-gray-900 truncate">{post.event.name}</p>
            <p className="text-xs text-[#FF6B2C]">Sedang berlangsung</p>
          </div>
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
      
      {/* Suggestions - More spacious */}
      {post.suggestions && post.suggestions.length > 0 && post.suggestions.map((sug, i) => (
        <Link
          key={i}
          href={`/search?q=${encodeURIComponent(sug.text)}`}
          className="flex items-start gap-3 mb-3 group"
        >
          <span className="text-sm">💡</span>
          <div className="flex-1">
            <p className="text-[10px] text-gray-500 uppercase font-medium">MUNGKIN ANDA SUKA</p>
            <p className="text-sm text-gray-700">{sug.text}</p>
          </div>
        </Link>
      ))}
      
      {/* Metadata */}
      <div className="pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{post.editedAt} • {post.location}</span>
        </div>
      </div>
    </div>
  );
}
