import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const productType = searchParams.get('productType') || 'dress';
    const sort = searchParams.get('sort') || 'most-recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const starFilter = searchParams.get('stars'); // Filter by star rating

    // Validate required parameters
    if (!productId) {
      return NextResponse.json(
        { error: 'productId is required' },
        { status: 400 }
      );
    }

    // Mock data - in a real app this would come from a database
    const mockReviews = [
      {
        id: 'rev-1',
        user: {
          name: 'Priya Sharma',
          avatar: '/avatars/priya.jpg'
        },
        rating: 5,
        reviewText: 'Absolutely loved this saree! The fabric quality is amazing and it fit perfectly. Received so many compliments at my sister\'s wedding.',
        photos: ['/reviews/saree-1.jpg', '/reviews/saree-2.jpg'],
        createdAt: '2026-02-15T10:30:00Z',
        bookingDate: '2026-02-14T00:00:00Z',
        bookingOccasion: 'Wedding',
        fitRating: 5,
        qualityRating: 5,
        deliveryRating: 4,
        valueRating: 5,
        helpfulCount: 12,
        isHelpful: true
      },
      {
        id: 'rev-2',
        user: {
          name: 'Ananya Patel',
          avatar: '/avatars/ananya.jpg'
        },
        rating: 4,
        reviewText: 'Beautiful dress, excellent quality. The only issue was that it was slightly tight around the waist, but overall a great experience.',
        photos: ['/reviews/dress-1.jpg'],
        createdAt: '2026-02-10T14:22:00Z',
        bookingDate: '2026-02-09T00:00:00Z',
        bookingOccasion: 'Party',
        fitRating: 4,
        qualityRating: 5,
        deliveryRating: 5,
        valueRating: 4,
        helpfulCount: 8,
        isHelpful: false
      },
      {
        id: 'rev-3',
        user: {
          name: 'Kavya Nair',
          avatar: '/avatars/kavya.jpg'
        },
        rating: 3,
        reviewText: 'Good quality but the color was slightly different from what I expected. Fit was decent though.',
        photos: [],
        createdAt: '2026-02-05T09:15:00Z',
        bookingDate: '2026-02-04T00:00:00Z',
        bookingOccasion: 'Festival',
        fitRating: 3,
        qualityRating: 3,
        deliveryRating: 4,
        valueRating: 3,
        helpfulCount: 3,
        isHelpful: null
      },
      {
        id: 'rev-4',
        user: {
          name: 'Riya Gupta',
          avatar: '/avatars/riya.jpg'
        },
        rating: 5,
        reviewText: 'Outstanding quality and fit! The customer service was exceptional and the delivery was on time. Will definitely rent again!',
        photos: ['/reviews/lehenga-1.jpg', '/reviews/lehenga-2.jpg', '/reviews/lehenga-3.jpg'],
        createdAt: '2026-02-01T16:45:00Z',
        bookingDate: '2026-01-31T00:00:00Z',
        bookingOccasion: 'Wedding Reception',
        fitRating: 5,
        qualityRating: 5,
        deliveryRating: 5,
        valueRating: 5,
        helpfulCount: 21,
        isHelpful: true
      }
    ];

    // Filter reviews based on product and star rating
    let filteredReviews = mockReviews.filter(review => 
      review.id.startsWith(productId)
    );

    if (starFilter) {
      const starValue = parseInt(starFilter);
      filteredReviews = filteredReviews.filter(review => review.rating === starValue);
    }

    // Sort reviews
    let sortedReviews = [...filteredReviews];
    switch (sort) {
      case 'most-recent':
        sortedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'most-helpful':
        sortedReviews.sort((a, b) => b.helpfulCount - a.helpfulCount);
        break;
      case 'highest-rated':
        sortedReviews.sort((a, b) => b.rating - a.rating);
        break;
      case 'lowest-rated':
        sortedReviews.sort((a, b) => a.rating - b.rating);
        break;
      default:
        sortedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Filter by photos only if requested
    if (searchParams.get('photosOnly') === 'true') {
      sortedReviews = sortedReviews.filter(review => review.photos && review.photos.length > 0);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = sortedReviews.slice(startIndex, endIndex);

    // Calculate pagination metadata
    const totalPages = Math.ceil(sortedReviews.length / limit);

    // Calculate rating summary
    const ratingSummary = {
      average: sortedReviews.reduce((sum, review) => sum + review.rating, 0) / sortedReviews.length || 0,
      distribution: {
        5: sortedReviews.filter(r => r.rating === 5).length,
        4: sortedReviews.filter(r => r.rating === 4).length,
        3: sortedReviews.filter(r => r.rating === 3).length,
        2: sortedReviews.filter(r => r.rating === 2).length,
        1: sortedReviews.filter(r => r.rating === 1).length
      }
    };

    return NextResponse.json({
      reviews: paginatedReviews,
      pagination: {
        currentPage: page,
        totalPages,
        totalReviews: sortedReviews.length,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      ratingSummary
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // In a real app, we would verify the user is authenticated and has completed the booking
    const formData = await request.formData();
    
    const productId = formData.get('productId') as string;
    const productType = formData.get('productType') as string;
    const rating = parseInt(formData.get('rating') as string);
    const reviewText = formData.get('reviewText') as string;
    const fitRating = parseInt(formData.get('fitRating') as string) || 0;
    const qualityRating = parseInt(formData.get('qualityRating') as string) || 0;
    const deliveryRating = parseInt(formData.get('deliveryRating') as string) || 0;
    const valueRating = parseInt(formData.get('valueRating') as string) || 0;
    
    // Validate required fields
    if (!productId || !productType || rating < 1 || rating > 5 || !reviewText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    if (reviewText.length < 50) {
      return NextResponse.json(
        { error: 'Review must be at least 50 characters' },
        { status: 400 }
      );
    }

    // Process uploaded photos
    const photos: string[] = [];
    const photoFiles = formData.getAll('photos') as File[];
    
    for (const photo of photoFiles) {
      // In a real app, we would upload to a cloud storage service
      // For now, we'll just store the filename
      photos.push(`/uploads/reviews/${photo.name}`);
    }

    // Mock new review object
    const newReview = {
      id: `rev-${Date.now()}`, // In a real app, this would be a proper ID
      user: {
        name: 'Current User', // In a real app, this would come from auth
        avatar: '/avatars/current-user.jpg'
      },
      rating,
      reviewText,
      photos,
      createdAt: new Date().toISOString(),
      bookingDate: new Date().toISOString(), // In a real app, this would come from booking data
      bookingOccasion: 'Event',
      fitRating,
      qualityRating,
      deliveryRating,
      valueRating,
      helpfulCount: 0,
      isHelpful: null
    };

    // In a real app, we would save to the database
    // For now, just return the new review
    return NextResponse.json(newReview);
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}