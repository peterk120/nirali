import BaseSkeleton from './BaseSkeleton';

const HeroSkeleton = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <BaseSkeleton className="absolute inset-0" />
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto space-y-6">
        <BaseSkeleton className="mx-auto h-6 w-64" />
        <BaseSkeleton className="mx-auto h-16 w-full max-w-2xl" />
        <BaseSkeleton className="mx-auto h-6 w-96" />
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <BaseSkeleton className="w-40 h-12 rounded-full" />
          <BaseSkeleton className="w-40 h-12 rounded-full" />
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <BaseSkeleton className="w-10 h-16 rounded-full" />
      </div>
    </div>
  );
};

export default HeroSkeleton;