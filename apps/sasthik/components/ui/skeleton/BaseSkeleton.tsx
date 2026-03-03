interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const BaseSkeleton = ({ className, children }: SkeletonProps) => {
  const baseClasses = 'animate-pulse rounded-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] motion-safe:animate-shimmer';
  const combinedClasses = className ? `${baseClasses} ${className}` : baseClasses;
  
  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};

export default BaseSkeleton;