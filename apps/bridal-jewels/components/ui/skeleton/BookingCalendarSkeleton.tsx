import BaseSkeleton from './BaseSkeleton';

const BookingCalendarSkeleton = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <BaseSkeleton className="h-6 w-32" />
        <div className="flex space-x-2">
          <BaseSkeleton className="h-8 w-8 rounded-full" />
          <BaseSkeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {[...Array(7)].map((_, i) => (
          <BaseSkeleton key={i} className="h-8 w-full text-center" />
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {[...Array(35)].map((_, i) => (
          <BaseSkeleton key={i} className="h-16 w-full rounded" />
        ))}
      </div>
    </div>
  );
};

export default BookingCalendarSkeleton;