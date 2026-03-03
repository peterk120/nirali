import { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, ThumbsDown, X, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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

interface ReviewCardProps {
  review: Review;
  onVoteHelpful: (reviewId: string, isHelpful: boolean) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onVoteHelpful }) => {
  const [showLightbox, setShowLightbox] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getFirstName = (name: string) => {
    const parts = name.split(' ');
    return parts[0];
  };

  const getLastInitial = (name: string) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return parts[parts.length - 1][0].toUpperCase() + '.';
    }
    return '';
  };

  const getNameDisplay = (name: string) => {
    const firstName = getFirstName(name);
    const lastInitial = getLastInitial(name);
    return lastInitial ? `${firstName} ${lastInitial}` : firstName;
  };

  const handlePhotoClick = (index: number) => {
    setLightboxIndex(index);
    setShowLightbox(true);
  };

  const handleNextPhoto = () => {
    if (review.photos && review.photos.length > 0) {
      setLightboxIndex((prev) => (prev + 1) % review.photos!.length);
    }
  };

  const handlePrevPhoto = () => {
    if (review.photos && review.photos.length > 0) {
      setLightboxIndex((prev) => 
        prev === 0 ? review.photos!.length - 1 : prev - 1
      );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start gap-4">
        {/* User Avatar */}
        <div className="flex-shrink-0">
          {review.user.avatar ? (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <Image
                src={review.user.avatar}
                alt={review.user.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-brand-rose/10 flex items-center justify-center">
              <span className="text-brand-rose font-medium">
                {getInitials(review.user.name)}
              </span>
            </div>
          )}
        </div>
        
        {/* Review Content */}
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">
              {getNameDisplay(review.user.name)}
            </h4>
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-medium">Verified Rental</span>
            </div>
          </div>
          
          {/* Star Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {review.rating}.0
            </span>
          </div>
          
          {/* Booking Details */}
          {review.bookingDate && (
            <p className="text-sm text-gray-600 mb-3">
              Wore on {formatDate(review.bookingDate)} — {review.bookingOccasion || 'Event'}
            </p>
          )}
          
          {/* Review Text */}
          <p className="text-gray-800 mb-4">{review.reviewText}</p>
          
          {/* Category Ratings */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {review.fitRating !== undefined && (
              <div>
                <p className="text-xs text-gray-600">Fit & Comfort</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`fit-${i}`}
                      className={`w-3 h-3 ${
                        i < review.fitRating!
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {review.qualityRating !== undefined && (
              <div>
                <p className="text-xs text-gray-600">Quality</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`quality-${i}`}
                      className={`w-3 h-3 ${
                        i < review.qualityRating!
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {review.deliveryRating !== undefined && (
              <div>
                <p className="text-xs text-gray-600">Delivery</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`delivery-${i}`}
                      className={`w-3 h-3 ${
                        i < review.deliveryRating!
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {review.valueRating !== undefined && (
              <div>
                <p className="text-xs text-gray-600">Value</p>
                <div className="flex mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`value-${i}`}
                      className={`w-3 h-3 ${
                        i < review.valueRating!
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Photos */}
          {review.photos && review.photos.length > 0 && (
            <div className="mb-4">
              <div className="grid grid-cols-3 gap-2">
                {review.photos.slice(0, 3).map((photo, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => handlePhotoClick(index)}
                  >
                    <Image
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Date and Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)}
            </p>
            
            <div className="flex items-center gap-4">
              <button
                className={`flex items-center gap-1 text-sm ${
                  review.isHelpful === true
                    ? 'text-green-600 font-medium'
                    : 'text-gray-600 hover:text-green-600'
                }`}
                onClick={() => onVoteHelpful(review.id, true)}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{review.helpfulCount}</span>
              </button>
              
              <button
                className={`flex items-center gap-1 text-sm ${
                  review.isHelpful === false
                    ? 'text-red-600 font-medium'
                    : 'text-gray-600 hover:text-red-600'
                }`}
                onClick={() => onVoteHelpful(review.id, false)}
              >
                <ThumbsDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lightbox for photos */}
      {showLightbox && review.photos && (
        <div 
          className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-2 z-10"
              onClick={() => setShowLightbox(false)}
            >
              <X className="w-6 h-6" />
            </button>
            
            {review.photos.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10"
                  onClick={handlePrevPhoto}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 rounded-full p-2 z-10"
                  onClick={handleNextPhoto}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
            
            <div className="w-full h-full flex items-center justify-center">
              <Image
                src={review.photos[lightboxIndex]}
                alt={`Review photo ${lightboxIndex + 1}`}
                width={800}
                height={600}
                className="max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};