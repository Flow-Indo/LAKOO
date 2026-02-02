import { NextRequest, NextResponse } from 'next/server';

// This would normally interact with your database
// For now, we'll show the structure

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content } = await request.json();

    // Validate input
    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Get the current user from session/auth
    // 2. Create comment in database
    // 3. Return the created comment

    // Mock response - replace with actual database logic
    const newComment = {
      id: Date.now().toString(),
      postId: params.id,
      content: content.trim(),
      author: {
        id: 'user-123', // From session
        name: 'Current User', // From session
        avatar: '' // From session
      },
      createdAt: new Date().toISOString(),
      likes: 0
    };

    // In reality, you'd do something like:
    // const comment = await db.comment.create({
    //   data: {
    //     content: content.trim(),
    //     postId: params.id,
    //     authorId: session.user.id
    //   },
    //   include: {
    //     author: true
    //   }
    // });

    return NextResponse.json(newComment, { status: 201 });

  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Failed to post comment' },
      { status: 500 }
    );
  }
}
