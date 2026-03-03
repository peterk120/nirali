import { useState, useRef, useEffect } from 'react';
import { Star, Camera, X } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface ReviewFormProps {
  productId: string;
  productType: string;
  onSubmit: (review: any) => void;
  userId?: string; // Optional userId for verification
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ 
  productId, 
  productType, 
  onSubmit,
  userId 
}) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [fitRating, setFitRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(0);
  const [valueRating, setValueRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Verify if user can submit a review
  useEffect(() => {
    const verifyBooking = async () => {
      if (!userId) {
        // If no userId provided, assume verification failed
        setIsVerified(false);
        setVerificationLoading(false);
        return;
      }

      try {
        setVerificationLoading(true);
        const response = await fetch(`/api/bookings/verify-booking?userId=${userId}&productId=${productId}&productType=${productType}`);
        
        if (!response.ok) {
          throw new Error('Failed to verify booking');
        }
        
        const data = await response.json();
        setIsVerified(data.hasCompletedBooking);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationError('Could not verify booking status');
        setIsVerified(false);
      } finally {
        setVerificationLoading(false);
      }
    };

    verifyBooking();
  }, [userId, productId, productType]);

  if (verificationLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center h-40">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-rose mx-auto mb-2"></div>
          <p className="text-gray-600">Verifying your booking...</p>
        </div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">
            Only customers who have completed a rental can submit a review.
          </p>
          {verificationError && (
            <p className="text-red-500 text-sm">{verificationError}</p>
          )}
        </div>
      </div>
    );
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 3 - photos.length);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));

    setPhotos([...photos, ...newFiles]);
    setPhotoPreviews([...photoPreviews, ...newPreviews]);
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos.splice(index, 1);
    setPhotos(newPhotos);

    const newPreviews = [...photoPreviews];
    newPreviews.splice(index, 1);
    setPhotoPreviews(newPreviews);

    // Revoke object URL to free memory
    URL.revokeObjectURL(photoPreviews[index]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (reviewText.length < 50) {
      alert('Review must be at least 50 characters long');
      return;
    }
    
    if (rating === 0) {
      alert('Please provide a star rating');
      return;
    }

    setIsSubmitting(true);
    
    // Prepare form data
    const formData = new FormData();
    formData.append('productId', productId);
    formData.append('productType', productType);
    formData.append('rating', rating.toString());
    formData.append('reviewText', reviewText);
    formData.append('fitRating', fitRating.toString());
    formData.append('qualityRating', qualityRating.toString());
    formData.append('deliveryRating', deliveryRating.toString());
    formData.append('valueRating', valueRating.toString());

    // Add photos if any
    photos.forEach(photo => {
      formData.append('photos', photo);
    });

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onSubmit(result);
        
        // Show success toast
        import('../../lib/toast').then((toastModule) => {
          toastModule.showReviewSubmitted();
        });
        
        // Reset form
        setRating(0);
        setReviewText('');
        setPhotos([]);
        setPhotoPreviews([]);
        setFitRating(0);
        setQualityRating(0);
        setDeliveryRating(0);
        setValueRating(0);
      } else {
        const error = await response.json();
        import('../../lib/toast').then((toastModule) => {
          toastModule.showError(error.message || 'Failed to submit review');
        });
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      import('../../lib/toast').then((toastModule) => {
        toastModule.showError('Failed to submit review');
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      {/* Star Rating */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overall Rating
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-gray-600">
            {rating > 0 ? `${rating} Star${rating > 1 ? 's' : ''}` : 'Select rating'}
          </span>
        </div>
      </div>
      
      {/* Category Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fit & Comfort
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`fit-${star}`}
                type="button"
                className="p-1"
                onClick={() => setFitRating(star)}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= fitRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quality
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`quality-${star}`}
                type="button"
                className="p-1"
                onClick={() => setQualityRating(star)}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= qualityRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`delivery-${star}`}
                type="button"
                className="p-1"
                onClick={() => setDeliveryRating(star)}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= deliveryRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={`value-${star}`}
                type="button"
                className="p-1"
                onClick={() => setValueRating(star)}
              >
                <Star
                  className={`w-5 h-5 ${
                    star <= valueRating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Review Text */}
      <div className="mb-6">
        <label htmlFor="reviewText" className="block text-sm font-medium text-gray-700 mb-2">
          Your Review
        </label>
        <textarea
          id="reviewText"
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Share your experience with this dress. Was it comfortable? Did it fit well? How was the quality?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose resize-none"
          rows={4}
          minLength={50}
          maxLength={500}
        />
        <div className="mt-1 text-right text-sm text-gray-500">
          {reviewText.length}/500 characters
        </div>
      </div>
      
      {/* Photo Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Photos (Optional)
        </label>
        <div className="flex flex-wrap gap-4">
          {photoPreviews.map((preview, index) => (
            <div key={index} className="relative">
              <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                onClick={() => removePhoto(index)}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          
          {photos.length < 3 && (
            <button
              type="button"
              className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs">Add</span>
            </button>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            accept="image/*"
            multiple
            className="hidden"
            disabled={photos.length >= 3}
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Upload up to 3 photos from your rental (JPG, PNG)
        </p>
      </div>
      
      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-brand-rose hover:bg-brand-rose/90"
        disabled={isSubmitting || rating === 0 || reviewText.length < 50}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  );
};