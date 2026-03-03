import BaseSkeleton from './BaseSkeleton';

const ProfileDashboardSkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center mb-6">
              <BaseSkeleton className="w-24 h-24 rounded-full mb-4" />
              <BaseSkeleton className="h-6 w-3/4" />
              <BaseSkeleton className="h-4 w-1/2 mt-2" />
            </div>
            
            <nav className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <BaseSkeleton key={i} className="h-10 w-full rounded" />
              ))}
            </nav>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <BaseSkeleton className="h-5 w-1/3 mb-4" />
            <div className="space-y-3">
              <BaseSkeleton className="h-4 w-full" />
              <BaseSkeleton className="h-4 w-5/6" />
              <BaseSkeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <BaseSkeleton className="h-8 w-1/4 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <BaseSkeleton className="h-6 w-1/2 mb-2" />
                  <BaseSkeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <BaseSkeleton className="h-6 w-1/4" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <BaseSkeleton className="w-16 h-16 rounded" />
                    <div>
                      <BaseSkeleton className="h-5 w-32 mb-2" />
                      <BaseSkeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <BaseSkeleton className="h-10 w-24 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDashboardSkeleton;