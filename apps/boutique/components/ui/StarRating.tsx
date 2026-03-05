'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating?: number; // Existing rating (read-only mode)
  onRate?: (rating: number) => void; // Callback when user selects a rating
  editable?: boolean; // Whether user can interact
  size?: 'sm' | 'md' | 'lg';
}

export const StarRating: React.FC<StarRatingProps> = ({ 
  rating = 0, 
  onRate, 
  editable = false,
  size = 'md'
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const handleClick = (starValue: number) => {
    if (editable && onRate) {
      onRate(starValue);
    }
  };

  const handleMouseEnter = (starValue: number) => {
    if (editable) {
      setHoverRating(starValue);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <div className="flex gap-1" style={{ cursor: editable ? 'pointer' : 'default' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!editable}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          className={`p-0 transition-all ${editable ? 'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded' : ''}`}
          aria-label={`Rate ${star} out of 5 stars`}
        >
          <Star
            className={`${sizeClasses[size]} ${
              star <= displayRating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } transition-colors`}
            strokeWidth={2}
          />
        </button>
      ))}
    </div>
  );
};

// Display-only rating with average
interface RatingDisplayProps {
  averageRating: number;
  totalReviews: number;
  size?: 'sm' | 'md' | 'lg';
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({ 
  averageRating, 
  totalReviews,
  size = 'md'
}) => {
  const roundedRating = Math.round(averageRating * 2) / 2; // Round to nearest 0.5

  return (
    <div className="flex items-center gap-2">
      <StarRating rating={roundedRating} size={size} />
      <span className="text-sm font-medium text-gray-700">
        {averageRating.toFixed(1)}
      </span>
      {totalReviews > 0 && (
        <span className="text-sm text-gray-500">
          ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  );
};
