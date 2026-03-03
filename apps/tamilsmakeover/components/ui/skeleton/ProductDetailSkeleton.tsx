import BaseSkeleton from './BaseSkeleton';

const ProductDetailSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image gallery section */}
        <div className="space-y-4">
          <BaseSkeleton className="aspect-square w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <BaseSkeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
        </div>
        
        {/* Product info section */}
        <div className="space-y-6">
          <div>
            <BaseSkeleton className="h-6 w-1/2 mb-2" />
            <BaseSkeleton className="h-8 w-3/4 mb-4" />
            <BaseSkeleton className="h-4 w-1/4" />
          </div>
          
          <div className="space-y-3">
            <BaseSkeleton className="h-4 w-full" />
            <BaseSkeleton className="h-4 w-5/6" />
            <BaseSkeleton className="h-4 w-4/6" />
          </div>
          
          <div className="space-y-4">
            <BaseSkeleton className="h-10 w-full" />
            <div className="flex space-x-4">
              <BaseSkeleton className="h-10 w-10 rounded-full" />
              <BaseSkeleton className="h-10 w-10 rounded-full" />
              <BaseSkeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <BaseSkeleton className="h-4 w-1/3 mb-2" />
            <div className="flex space-x-3">
              <BaseSkeleton className="h-10 w-16 rounded" />
              <BaseSkeleton className="h-10 w-16 rounded" />
              <BaseSkeleton className="h-10 w-16 rounded" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Description section */}
      <div className="mt-16 space-y-6">
        <BaseSkeleton className="h-6 w-1/4 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-3">
              <BaseSkeleton className="h-5 w-2/3" />
              <BaseSkeleton className="h-4 w-full" />
              <BaseSkeleton className="h-4 w-5/6" />
              <BaseSkeleton className="h-4 w-4/6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;