import BaseSkeleton from './BaseSkeleton';

const ReviewSkeleton = () => {
  return (
    <div className="flex space-x-4 p-4 bg-white rounded-lg shadow-sm">
      <BaseSkeleton className="w-12 h-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between">
          <BaseSkeleton className="h-4 w-1/4" />
          <BaseSkeleton className="h-3 w-12" />
        </div>
        <BaseSkeleton className="h-4 w-full" />
        <BaseSkeleton className="h-4 w-5/6" />
        <BaseSkeleton className="h-4 w-4/6" />
      </div>
    </div>
  );
};

export default ReviewSkeleton;