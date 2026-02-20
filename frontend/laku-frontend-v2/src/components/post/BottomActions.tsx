'use client';

import { useState } from 'react';
import CommentModal from './CommentModal';

interface BottomActionsProps {
  postId: string;
  onCommentAdded?: () => void;
}

export default function BottomActions({
  postId,
  onCommentAdded
}: BottomActionsProps) {
  const [showCommentModal, setShowCommentModal] = useState(false);

  const handleCommentAdded = () => {
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  return (
    <>
      {/* Comment Modal */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        postId={postId}
        onCommentAdded={handleCommentAdded}
      />
    </>
  );
}
