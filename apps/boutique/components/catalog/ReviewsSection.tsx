import { useState, useEffect } from 'react';
import { RatingSummary } from '../../components/reviews/RatingSummary';
import { ReviewCard } from '../../components/reviews/ReviewCard';
import { ReviewForm } from '../../components/reviews/ReviewForm';
import { Button } from '../../components/ui/button';

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  reviewText: string;
  photos?: string[];
  createdAt: string;
  bookingDate?: string;
  bookingOccasion?: string;
  fitRating?: number;
  qualityRating?: number;
  deliveryRating?: number;
  valueRating?: number;
  helpfulCount: number;
  isHelpful?: boolean;
}

interface ReviewsSectionProps {
  productId: string;
  productType: string;
  userId?: string; // Optional for verification
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ 
  productId, 
  productType, 
  userId 
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'recent' | 'helpful'>('all');
  const [selectedStars, setSelectedStars] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratingSummary, setRatingSummary] = useState({
    average: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    },
    totalReviews: 0
  });

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          productId,
          productType,
          page: currentPage.toString(),
          sort: activeTab === 'recent' ? 'most-recent' : 
                activeTab === 'helpful' ? 'most-helpful' : 'most-recent'
        });
        
        if (selectedStars !== null) {
          params.append('stars', selectedStars.toString());
        }
        
        if (activeTab === 'photos') {
          params.append('photosOnly', 'true');
        }

        const response = await fetch(`/api/reviews?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data = await response.json();
        setReviews(data.reviews);
        setRatingSummary(data.ratingSummary);
        setTotalPages(data.pagination.totalPages);
      } catch (err) {
        console.error('Error fetching reviews:', err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, productType, activeTab, selectedStars, currentPage]);

  // Handle helpful vote
  const handleVoteHelpful = async (reviewId: string, isHelpful: boolean) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isHelpful }),
      });

      if (response.ok) {
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review.id === reviewId
              ? {
                  ...review,
                  isHelpful,
                  helpfulCount: isHelpful 
                    ? review.helpfulCount + 1 
                    : review.helpfulCount - (review.isHelpful ? 1 : 0)
                }
              : review
          )
        );
      }
    } catch (error) {
      console.error('Error updating helpful vote:', error);
    }
  };

  // Handle new review submission
  const handleNewReview = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
    setRatingSummary(prev => ({
      ...prev,
      average: ((prev.average * prev.totalReviews) + newReview.rating) / (prev.totalReviews + 1),
      distribution: {
        ...prev.distribution,
        [newReview.rating]: prev.distribution[newReview.rating] + 1
      },
      totalReviews: prev.totalReviews + 1
    }));
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <p className="text-red-500 text-center">Failed to load reviews. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Rating Summary */}
      <RatingSummary 
        average={ratingSummary.average}
        distribution={ratingSummary.distribution}
        totalReviews={ratingSummary.totalReviews}
      />

      {/* Review Form */}
      <ReviewForm 
        productId={productId}
        productType={productType}
        onSubmit={handleNewReview}
        userId={userId}
      />

      {/* Reviews List */}
      <div className="space-y-6">
        {/* Filters and Sorting */}
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'all'
                  ? 'bg-brand-rose text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveTab('all');
                setCurrentPage(1);
              }}
            >
              All Reviews
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'recent'
                  ? 'bg-brand-rose text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveTab('recent');
                setCurrentPage(1);
              }}
            >
              Most Recent
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'helpful'
                  ? 'bg-brand-rose text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveTab('helpful');
                setCurrentPage(1);
              }}
            >
              Most Helpful
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'photos'
                  ? 'bg-brand-rose text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setActiveTab('photos');
                setCurrentPage(1);
              }}
            >
              With Photos
            </button>
          </div>

          {/* Star Rating Filter */}
          <div className="flex flex-wrap gap-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedStars === star
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => {
                  setSelectedStars(selectedStars === star ? null : star);
                  setCurrentPage(1);
                }}
              >
                {star}★
              </button>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-rose"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onVoteHelpful={handleVoteHelpful}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="border-gray-300 text-gray-700"
            >
              Previous
            </Button>
            
            <span className="mx-2 text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            
            <Button
              variant="outline"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="border-gray-300 text-gray-700"
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};