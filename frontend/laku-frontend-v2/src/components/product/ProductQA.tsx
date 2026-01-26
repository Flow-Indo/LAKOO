'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronRight, ChevronLeft, Search, User, MoreVertical, ThumbsUp } from 'lucide-react';

export default function ProductQA({ product }: any) {
  const [qaModalOpen, setQAModalOpen] = useState(false);
  const [qaFilter, setQaFilter] = useState('Semua');

  const defaultQAs = [
    { id: 'q1', question: 'Apakah bahan ini stretch?', answer: 'Ya, bahan memiliki elastisitas ringan sehingga nyaman dipakai.', author: 'Andi S.', date: '3 hari yang lalu', category: 'Kualitas', answerCount: 3, hasPurchased: true },
    { id: 'q2', question: 'Apakah cocok untuk kegiatan olahraga?', answer: 'Cocok untuk olahraga ringan dan aktivitas sehari-hari.', author: 'Sari M.', date: '1 minggu yang lalu', category: 'Gaya', answerCount: 2, hasPurchased: false },
    { id: 'q3', question: 'Berapa panjang inseam untuk ukuran M?', answer: 'Sekitar 74 cm, sesuai standar kami.', author: 'Budi R.', date: '2 hari yang lalu', category: 'Ukuran', answerCount: 1, hasPurchased: true },
  ];

  const sampleQAs = (product?.qas && product.qas.length > 0) ? product.qas.slice(0, 2) : defaultQAs.slice(0, 2);
  const qaCount = (product?.qas?.length ?? sampleQAs.length);

  const filteredQAs = sampleQAs;

  function QACardFull({ qa }: { qa: any }) {
    const [showAllAnswers, setShowAllAnswers] = useState(false);
    const answersList = qa.answers ?? [];
    const displayedAnswers = showAllAnswers ? answersList : answersList.slice(0, 1);

    return (
      <div className="bg-white">
        {/* Question */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
            T
          </div>
          <div className="flex-1">
            <p className="text-base text-gray-900 font-medium mb-1">{qa.question}</p>
          </div>
        </div>

        {/* Answers */}
        <div className="ml-10 space-y-3">
          {displayedAnswers.map((answer: any, idx: number) => (
            <div key={idx} className="pb-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-start gap-2 mb-2">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex-shrink-0 overflow-hidden">
                  {answer.avatar ? (
                    <Image src={answer.avatar} alt={answer.author} width={32} height={32} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-sm font-semibold">
                      {answer.author.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  {/* Badge - Buyer or Merchant */}
                  <div className="flex items-center gap-2 mb-1">
                    {answer.isMerchant ? (
                      <span className="px-2 py-0.5 bg-blue-500 text-white text-xs rounded font-medium">
                        Penjual
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-medium">
                        Pembeli
                      </span>
                    )}
                    {answer.purchaseCount && (
                      <span className="text-xs text-gray-500">
                        Telah membeli {answer.purchaseCount}x
                      </span>
                    )}
                    {answer.loyaltyLevel && (
                      <span className="text-xs text-blue-500">💎 {answer.loyaltyLevel}</span>
                    )}
                  </div>

                  {/* Answer Text */}
                  <p className="text-sm text-gray-900 leading-relaxed mb-1">{answer.text}</p>

                  {/* Date and Author */}
                  <div className="text-xs text-gray-400">
                    {answer.author} · {answer.date}
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* Show More Answers */}
        {answersList.length > 1 && !showAllAnswers && (
            <button
              onClick={() => setShowAllAnswers(true)}
              className="text-orange-500 text-sm font-medium flex items-center gap-1"
            >
              {qa.answers.length - 1} jawaban pembeli lainnya
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-2 border-b border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-base">Tanya Jawab · {qaCount}</h3>
        <button
          onClick={() => setQAModalOpen(true)}
          className="text-gray-500 text-sm flex items-center gap-1"
        >
          Lihat Semua
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Q&A Preview Cards */}
      <div className="space-y-3 mb-4">
        {sampleQAs.map((qa: any) => (
          <div key={qa.id} className="bg-white">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                T
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900 font-medium">{qa.question}</p>
                <span className="text-xs text-gray-500">{qa.answerCount} Jawaban</span>
              </div>
            </div>

            <div className="ml-8">
              <div className="flex items-start gap-2 mb-1">
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded font-medium">Pembeli</span>
                <p className="text-sm text-gray-700 flex-1">{qa.answer}</p>
              </div>
              <div className="text-xs text-gray-400">
                {qa.author} · {qa.date}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Ask Question Box */}
      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 text-2xl font-bold">?</span>
          <span className="text-gray-600 text-sm">Punya pertanyaan? Tanya pembeli lain</span>
        </div>
        <button className="bg-white text-gray-900 font-medium text-sm px-4 py-2 rounded-md border border-gray-300">
          Tanya
        </button>
      </div>

      {/* Q&A Modal - Full Screen */}
      {qaModalOpen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* Header - Fixed */}
          <div className="bg-white border-b border-gray-200">
            {/* Top Bar with Back, Search, Profile */}
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={() => setQAModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              <h3 className="font-semibold text-gray-900 text-lg">Tanya Pembeli</h3>

              {/* Search Bar */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Ada pertanyaan? Cari di sini"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>

              {/* Profile Icon */}
              <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-600" />
              </button>

              {/* More Menu */}
              <button className="w-8 h-8 flex items-center justify-center">
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Info Banner */}
            <div className="px-4 py-2 bg-orange-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-orange-600 text-sm">🔄</span>
                <span className="text-sm text-orange-900">
                  Undang pembeli nyata secara acak untuk menjawab
                </span>
                <button className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                  <span className="text-white text-xs">?</span>
                </button>
              </div>
              <div className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4 text-orange-600" />
                <span className="text-sm text-orange-900 font-medium">Rating Bagus</span>
              </div>
            </div>

            {/* Statistics */}
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {/* Avatars */}
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 border-2 border-white"
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-600">Banyak orang sedang bertanya</span>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-orange-600">99.5%</div>
                  <div className="text-xs text-gray-500">Rating Bagus</div>
                </div>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
              <button
                onClick={() => setQaFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  qaFilter === 'all' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Semua 15
              </button>
              <button
                onClick={() => setQaFilter('quality')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  qaFilter === 'quality' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Kualitas 3
              </button>
              <button
                onClick={() => setQaFilter('material')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  qaFilter === 'material' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Bahan 2
              </button>
              <button
                onClick={() => setQaFilter('color')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  qaFilter === 'color' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Warna 2
              </button>
              <button
                onClick={() => setQaFilter('fabric')}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                  qaFilter === 'fabric' ? 'bg-orange-50 text-orange-600 font-medium' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Kain 1
              </button>
            </div>
          </div>

          {/* Q&A List - Scrollable */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {filteredQAs.map((q: any) => (
              <QACardFull key={q.id} qa={q} />
            ))}
          </div>

          {/* Bottom Action Bar */}
          <div className="bg-white border-t border-gray-200 p-4 flex items-center gap-3">
            {/* Product Thumbnail */}
            <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex-shrink-0">
              <Image
                src={product.images[0].url}
                alt={product.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>

            {/* Product Name */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 truncate">{product.name}</p>
            </div>

            {/* Action Buttons */}
            <button className="px-4 py-2 border border-orange-500 text-orange-500 rounded-lg text-sm font-medium whitespace-nowrap">
              Ajukan Pertanyaan
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold whitespace-nowrap">
              Beli Sekarang
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

