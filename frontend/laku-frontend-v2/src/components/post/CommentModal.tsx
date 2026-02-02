'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Mic, Image as ImageIcon, AtSign, Smile, Plus } from 'lucide-react';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  onCommentAdded: () => void;
}

export default function CommentModal({
  isOpen,
  onClose,
  postId,
  onCommentAdded
}: CommentModalProps) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Emoji stickers
  const emojiStickers = ['😭', '😳', '🥺', '😘', '😍', '😊', '😎', '😂'];

  // Auto-focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setComment(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const handleSubmit = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Call API to post comment
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: comment.trim()
        })
      });

      if (response.ok) {
        // Success - notify parent and close modal
        onCommentAdded();
        setComment('');
        onClose();
      } else {
        throw new Error('Failed to post comment');
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Gagal mengirim komentar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Comment Input Section */}
        <div className="bg-[#F7F8FA] px-4 py-4 pt-12">
          {/* Textarea with Red Border */}
          <div className="relative mb-3">
            <textarea
              ref={textareaRef}
              value={comment}
              onChange={handleInput}
              placeholder="Tulis komentar..."
              className="w-full min-h-[80px] max-h-[120px] px-4 py-3 bg-white border-l-[3px] border-[#FF2442] rounded text-[15px] text-gray-900 placeholder:text-gray-400 focus:outline-none resize-none"
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
              rows={1}
            />
          </div>

          {/* Action Icons Row + Send Button */}
          <div className="flex items-center justify-between mb-3">
            {/* Left: Action Icons */}
            <div className="flex items-center gap-5">
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Mic className="w-[22px] h-[22px] text-gray-600" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <ImageIcon className="w-[22px] h-[22px] text-gray-600" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <AtSign className="w-[22px] h-[22px] text-gray-600" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Smile className="w-[22px] h-[22px] text-gray-600" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Plus className="w-[22px] h-[22px] text-gray-600" strokeWidth={2} />
              </button>
            </div>

            {/* Right: Send Button */}
            <button
              onClick={handleSubmit}
              disabled={!comment.trim() || isSubmitting}
              className={`px-8 py-2.5 rounded-full text-[15px] font-medium transition-all ${
                comment.trim() && !isSubmitting
                  ? 'bg-[#FFB3C1] text-white hover:bg-[#FF9BB0]'
                  : 'bg-[#FFD6E0] text-white cursor-not-allowed'
              }`}
              style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>

          {/* Emoji Stickers Row */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-2">
            {emojiStickers.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Safe Area (for iOS) */}
        <div className="h-safe-area-bottom bg-[#F7F8FA]" />
      </div>
    </>
  );
}
