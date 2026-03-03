import BaseSkeleton from './BaseSkeleton';

const JewelleryCardSkeleton = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-md">
      <BaseSkeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <BaseSkeleton className="h-4 w-3/4" />
        <BaseSkeleton className="h-3 w-1/2" />
        <div className="flex justify-between items-center mt-2">
          <BaseSkeleton className="h-5 w-1/3" />
          <BaseSkeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default JewelleryCardSkeleton;