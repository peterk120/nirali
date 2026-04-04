'use client';

import { motion } from 'framer-motion';

export default function ProductSkeleton() {
  return (
    <div className="bg-white border border-teal-light rounded-xl overflow-hidden shadow-sm">
      {/* Image Area Skeleton */}
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
        />
        {/* Badges Skeleton */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="w-12 h-4 bg-gray-200 rounded-sm" />
        </div>
        {/* Action Icons Skeleton */}
        <div className="absolute top-3 right-3 flex flex-col gap-3">
          <div className="w-9 h-9 bg-gray-200 rounded-full" />
          <div className="w-9 h-9 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Info Area Skeleton */}
      <div className="p-4 md:p-5 flex flex-col gap-3">
        {/* Chips Skeleton */}
        <div className="flex gap-2">
          <div className="w-16 h-4 bg-gray-100 rounded-sm" />
          <div className="w-12 h-4 bg-gray-100 rounded-sm" />
        </div>

        {/* Name Skeleton */}
        <div className="w-3/4 h-5 bg-gray-200 rounded-md" />
        
        {/* Description Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-3 bg-gray-100 rounded-md" />
          <div className="w-5/6 h-3 bg-gray-100 rounded-md" />
        </div>

        {/* Rating Skeleton */}
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded-full" />
            ))}
          </div>
          <div className="w-8 h-3 bg-gray-100 rounded-md ml-1" />
        </div>

        {/* Price Skeleton */}
        <div className="flex items-end justify-between mt-1">
          <div className="flex items-end gap-2">
            <div className="w-16 h-6 bg-gray-200 rounded-md" />
            <div className="w-10 h-4 bg-gray-100 rounded-md mb-0.5" />
          </div>
        </div>

        {/* Add to Cart button Skeleton */}
        <div className="mt-4 w-full h-10 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8, columns = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' }: { count?: number, columns?: string }) {
  return (
    <div className={`grid ${columns} gap-4 md:gap-8`}>
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
