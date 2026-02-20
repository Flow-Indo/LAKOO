'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Heart, MessageCircle, Gift, Send, Volume2, VolumeX } from 'lucide-react';

interface Comment {
  id: string;
  user: {
    username: string;
    avatar: string;
  };
  text: string;
  likes: number;
  isLiked?: boolean;
  timestamp: string;
  replies?: Comment[];
}

interface CommentSheetProps {
  visible: boolean;
  onClose: () => void;
  onCommentOpen?: () => void;
  onCommentClose?: () => void;
  videoUrl?: string;
  videoThumbnail?: string;
  isMuted: boolean;
  onToggleMute: () => void;
  comments: Comment[];
  onLikeComment: (commentId: string) => void;
  currentUser?: {
    username: string;
    avatar: string;
  };
}

const EMOJI_REACTIONS = ['❤️', '🙌', '🔥', '👏', '😢', '😍', '😲', '😂'];

// Mock current user if not provided
const DEFAULT_USER = {
  username: 'you',
  avatar: '/placeholder-avatar.png',
};

const DRAG_CLOSE_THRESHOLD = 80;

export function CommentSheet({
  visible,
  onClose,
  onCommentOpen,
  onCommentClose,
  videoUrl,
  videoThumbnail,
  isMuted,
  onToggleMute,
  comments,
  onLikeComment,
  currentUser = DEFAULT_USER,
}: CommentSheetProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const commentsRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef<number>(0);
  const currentTranslateY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);

  // Handle sheet visibility with animation
  useEffect(() => {
    if (visible) {
      setShowSheet(true);
      // Small delay to allow DOM to render before starting animation
      setTimeout(() => setIsAnimating(true), 10);
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      // Notify parent that comment sheet is open
      onCommentOpen?.();
    } else {
      setIsAnimating(false);
      document.body.style.overflow = '';
      // Notify parent that comment sheet is closed
      onCommentClose?.();
      // Wait for animation to finish before hiding
      setTimeout(() => {
        if (!visible) setShowSheet(false);
      }, 300);
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [visible, onCommentOpen, onCommentClose]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visible) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [visible, onClose]);

  // Handle keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      setIsKeyboardVisible(window.innerHeight < window.screen.height * 0.8);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSendComment = () => {
    if (commentText.trim()) {
      console.log('Sending comment:', commentText);
      setCommentText('');
    }
  };

  const handleEmojiReaction = (emoji: string) => {
    // Append emoji to the comment text
    setCommentText(prev => prev + emoji);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Drag gesture handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    dragStartY.current = 'touches' in e ? e.touches[0].clientY : e.clientY;
    currentTranslateY.current = 0;
  };

  const handleDragMove = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const currentY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const deltaY = currentY - dragStartY.current;
    
    // Only allow dragging down (positive delta)
    if (deltaY > 0) {
      currentTranslateY.current = deltaY;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
        sheetRef.current.style.transition = 'none';
      }
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    
    // Check if dragged past threshold
    if (currentTranslateY.current > DRAG_CLOSE_THRESHOLD) {
      onClose();
    } else {
      // Snap back to original position
      if (sheetRef.current) {
        sheetRef.current.style.transform = '';
        sheetRef.current.style.transition = 'transform 300ms ease-out';
      }
    }
    currentTranslateY.current = 0;
  }, [onClose]);

  // Add global event listeners for drag
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging.current && sheetRef.current) {
        const deltaY = e.clientY - dragStartY.current;
        if (deltaY > 0) {
          sheetRef.current.style.transform = `translateY(${deltaY}px)`;
          sheetRef.current.style.transition = 'none';
        }
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging.current) {
        handleDragEnd();
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleDragEnd]);

  // Handle tap on top zone to close
  const handleTopZoneClick = () => {
    onClose();
  };

  if (!showSheet) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] transition-opacity duration-300 ease-out ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
      style={{
        backgroundColor: 'transparent',
      }}
    >
      {/* Top Zone - Black background with video (clickable to close) */}
      <div
        className={`absolute left-0 right-0 top-0 transition-all duration-300 ease-out flex items-center justify-center cursor-pointer ${
          isAnimating ? 'h-[35%]' : 'h-full'
        }`}
        style={{
          backgroundColor: '#000',
        }}
        onClick={handleTopZoneClick}
        onTouchEnd={handleTopZoneClick}
      >
        {/* Video container */}
        <div
          className={`relative transition-all duration-300 ease-out ${
            isAnimating
              ? 'w-[85%] h-[85%] rounded-2xl'
              : 'w-full h-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {videoUrl ? (
            <video
              key={visible ? 'playing' : 'paused'}
              src={videoUrl}
              className="w-full h-full object-cover"
              muted={isMuted}
              loop
              playsInline
              autoPlay
            />
          ) : videoThumbnail ? (
            <Image
              src={videoThumbnail}
              alt="Video thumbnail"
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <MessageCircle className="w-12 h-12 text-gray-600" />
            </div>
          )}

          {/* Mute/Unmute button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="absolute right-3 top-3 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center transition-colors hover:bg-black/70"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-white" />
            ) : (
              <Volume2 className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Bottom Zone - Dark gray sheet */}
      <div
        ref={sheetRef}
        className={`absolute left-0 right-0 bottom-0 transition-all duration-300 ease-out flex flex-col ${
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          height: '65%',
          backgroundColor: '#1C1C1E',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingBottom: isKeyboardVisible ? 'max(16px, env(safe-area-inset-bottom))' : 0,
        }}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
      >
        {/* Drag handle */}
        <div
          className="w-full flex justify-center cursor-grab active:cursor-grabbing"
          style={{ paddingTop: 10, paddingBottom: 8 }}
        >
          <div
            className="rounded-full"
            style={{
              width: 40,
              height: 4,
              backgroundColor: '#555',
            }}
          />
        </div>

        {/* Comments count header */}
        <div className="px-4 pb-2 flex-shrink-0">
          <span className="text-white font-semibold text-sm">
            {comments.length} comments
          </span>
        </div>

        {/* Comments FlatList - scrollable, flex-1 to fill available space */}
        <div
          ref={commentsRef}
          className="flex-1 overflow-y-auto px-4 min-h-0"
        >
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={onLikeComment}
              isExpanded={expandedComments.has(comment.id)}
              onToggleReplies={() => toggleReplies(comment.id)}
            />
          ))}
          
          {/* Empty state */}
          {comments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-600 mb-2" />
              <p className="text-gray-500 text-sm">No comments yet</p>
              <p className="text-gray-600 text-xs">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Emoji reaction bar */}
        <div
          className="flex items-center justify-between px-4 flex-shrink-0"
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            borderTopWidth: 1,
            borderTopColor: '#3A3A3C',
          }}
        >
          {EMOJI_REACTIONS.map((emoji, index) => (
            <button
              key={index}
              onClick={() => handleEmojiReaction(emoji)}
              className="text-2xl p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Bottom input row */}
        <div
          className="px-4 pt-2 pb-10 flex-shrink-0"
        >
          <KeyboardAvoidingInput
            value={commentText}
            onChange={setCommentText}
            onSend={handleSendComment}
            avatar={currentUser.avatar}
          />
        </div>
      </div>
    </div>
  );
}

// Comment Item Component
interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => void;
  isExpanded: boolean;
  onToggleReplies: () => void;
}

function CommentItem({ comment, onLike, isExpanded, onToggleReplies }: CommentItemProps) {
  const [isLiked, setIsLiked] = useState(comment.isLiked || false);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(comment.id);
  };

  return (
    <div
      className="flex gap-3"
      style={{ marginBottom: 16 }}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="rounded-full overflow-hidden bg-gray-700"
          style={{ width: 36, height: 36 }}
        >
          <Image
            src={comment.user.avatar}
            alt={comment.user.username}
            width={36}
            height={36}
            className="object-cover"
          />
        </div>
      </div>

      {/* Comment content */}
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-[13px] leading-tight truncate">
              {comment.user.username}
            </p>
            <p className="text-white text-[13px] leading-tight mt-0.5 break-words">
              {comment.text}
            </p>
            <button className="text-gray-500 text-[12px] mt-1 hover:text-white transition-colors">
              Reply
            </button>
          </div>

          {/* Like button */}
          <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
            <button
              onClick={handleLike}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <Heart
                className={`w-4 h-4 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'
                }`}
              />
            </button>
            <span className="text-gray-500 text-[10px]">
              {likeCount > 0 ? likeCount : ''}
            </span>
          </div>
        </div>

        {/* Nested replies - only show when expanded */}
        {comment.replies && comment.replies.length > 0 && !isExpanded && (
          <button 
            onClick={onToggleReplies}
            className="text-gray-500 text-[12px] mt-1 ml-2 hover:text-white transition-colors"
          >
            View {comment.replies.length} more {comment.replies.length === 1 ? 'reply' : 'replies'}
          </button>
        )}

        {/* Expanded replies */}
        {comment.replies && comment.replies.length > 0 && isExpanded && (
          <div className="mt-2 ml-2 border-l-2 border-gray-700 pl-3">
            {comment.replies.map((reply) => (
              <ReplyItem key={reply.id} reply={reply} onLike={onLike} />
            ))}
            <button 
              onClick={onToggleReplies}
              className="text-gray-500 text-[12px] mt-1 hover:text-white transition-colors"
            >
              Hide replies
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Reply Item Component
interface ReplyItemProps {
  reply: Comment;
  onLike: (commentId: string) => void;
}

function ReplyItem({ reply, onLike }: ReplyItemProps) {
  const [isLiked, setIsLiked] = useState(reply.isLiked || false);
  const [likeCount, setLikeCount] = useState(reply.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(reply.id);
  };

  return (
    <div className="flex gap-2 mb-2">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="rounded-full overflow-hidden bg-gray-700"
          style={{ width: 28, height: 28 }}
        >
          <Image
            src={reply.user.avatar}
            alt={reply.user.username}
            width={28}
            height={28}
            className="object-cover"
          />
        </div>
      </div>

      {/* Reply content */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-[12px] leading-tight truncate">
          {reply.user.username}
        </p>
        <p className="text-white text-[12px] leading-tight mt-0.5 break-words">
          {reply.text}
        </p>
      </div>

      {/* Like button */}
      <button
        onClick={handleLike}
        className="flex flex-col items-center flex-shrink-0"
      >
        <Heart
          className={`w-3 h-3 ${
            isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'
          }`}
        />
        <span className="text-gray-500 text-[9px]">
          {likeCount > 0 ? likeCount : ''}
        </span>
      </button>
    </div>
  );
}

// Keyboard Avoiding Input Component
interface KeyboardAvoidingInputProps {
  value: string;
  onChange: (text: string) => void;
  onSend: () => void;
  avatar: string;
}

function KeyboardAvoidingInput({
  value,
  onChange,
  onSend,
  avatar,
}: KeyboardAvoidingInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2"
    >
      {/* User avatar */}
      <div className="flex-shrink-0">
        <div
          className="rounded-full overflow-hidden bg-gray-700"
          style={{ width: 32, height: 32 }}
        >
          <Image
            src={avatar}
            alt="Your avatar"
            width={32}
            height={32}
            className="object-cover"
          />
        </div>
      </div>

      {/* Text input */}
      <div
        className="flex-1 relative py-2"
        style={{
          backgroundColor: '#2C2C2E',
          borderRadius: 20,
          paddingLeft: 16,
          paddingRight: 12,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Join the conversation..."
          className="w-full bg-transparent text-white text-sm outline-none placeholder-gray-500"
        />
      </div>

      {/* GIF and Gift buttons */}
      <div className="flex items-center gap-1">
        {/* GIF button */}
        <button
          type="button"
          className="flex items-center justify-center transition-colors hover:bg-white/10"
          style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: '#555',
          }}
        >
          <span className="text-[10px] text-gray-400 font-medium">GIF</span>
        </button>

        {/* Gift button */}
        <button
          type="button"
          onClick={() => console.log('Gift button clicked')}
          className="flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
          style={{ width: 32, height: 32 }}
        >
          <Gift className="w-5 h-5 text-gray-400" />
        </button>

        {/* Send button */}
        {value.trim() && (
          <button
            type="submit"
            className="flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
            style={{ width: 32, height: 32 }}
          >
            <Send className="w-5 h-5 text-red-500" />
          </button>
        )}
      </div>
    </form>
  );
}

export default CommentSheet;
