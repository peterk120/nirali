import { NextRequest, NextResponse } from 'next/server';

// Ensure the directory exists
// This route handles PATCH /api/reviews/:id/helpful

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const reviewId = params.id;
    
    // In a real app, we would verify the user is authenticated
    const { isHelpful } = await request.json();
    
    if (typeof isHelpful !== 'boolean') {
      return NextResponse.json(
        { error: 'isHelpful must be a boolean' },
        { status: 400 }
      );
    }

    // In a real app, we would update the database with the vote
    // For now, we'll just return a mock response
    const mockUpdatedReview = {
      id: reviewId,
      isHelpful,
      helpfulCount: isHelpful ? 1 : 0
    };

    return NextResponse.json(mockUpdatedReview);
  } catch (error) {
    console.error('Error updating helpful vote:', error);
    return NextResponse.json(
      { error: 'Failed to update helpful vote' },
      { status: 500 }
    );
  }
}