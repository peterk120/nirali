import { Star } from 'lucide-react';

interface RatingSummaryProps {
  average: number;
  distribution: {
    [key: number]: number;
  };
  totalReviews: number;
}

export const RatingSummary: React.FC<RatingSummaryProps> = ({ 
  average, 
  distribution, 
  totalReviews 
}) => {
  // Calculate percentages for each rating
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  const ratingPercentages = [5, 4, 3, 2, 1].map(rating => {
    const count = distribution[rating] || 0;
    return {
      rating,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-6 mb-6">
        <div className="text-center">
          <div className="text-5xl font-bold text-gray-900">
            {average.toFixed(1)}
          </div>
          <div className="flex items-center justify-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(average)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-2">
            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>
        
        <div className="flex-grow">
          {ratingPercentages.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3 mb-2 last:mb-0">
              <div className="w-8 text-sm font-medium text-gray-700">
                {rating} star
              </div>
              <div className="flex-grow">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-10 text-right text-sm text-gray-600">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};