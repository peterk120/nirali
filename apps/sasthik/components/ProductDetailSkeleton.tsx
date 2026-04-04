'use client';

import { motion } from 'framer-motion';

export default function ProductDetailSkeleton() {
  return (
    <div className="bg-white min-h-screen pb-24 border-t border-teal-light">
      {/* Breadcrumbs Skeleton */}
      <div className="container mx-auto px-6 py-6 flex gap-2">
        <div className="w-12 h-3 bg-gray-100 rounded" />
        <div className="w-4 h-3 bg-gray-100 rounded" />
        <div className="w-20 h-3 bg-gray-100 rounded" />
        <div className="w-4 h-3 bg-gray-100 rounded" />
        <div className="w-32 h-3 bg-gray-200 rounded" />
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Image Gallery Skeleton */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-4">
            <div className="hidden md:flex flex-col gap-4 w-20">
               {[...Array(4)].map((_, i) => (
                 <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-teal-light" />
               ))}
            </div>
            <div className="flex-grow aspect-square bg-gray-100 rounded-2xl relative overflow-hidden">
               <motion.div
                 className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                 animate={{ x: ['-100%', '100%'] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
               />
            </div>
          </div>

          {/* Right: Product Details Skeleton */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8">
            <div>
              <div className="flex gap-2 mb-4">
                <div className="w-20 h-6 bg-teal-light/50 rounded-sm" />
                <div className="w-24 h-6 bg-rose-light/50 rounded-sm" />
              </div>
              <div className="w-3/4 h-10 bg-gray-200 rounded-lg mb-4" />
              <div className="flex items-center gap-2 mb-6">
                 <div className="flex gap-1">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-4 h-4 bg-gray-100 rounded-full" />)}
                 </div>
                 <div className="w-32 h-4 bg-gray-100 rounded" />
              </div>
              
              <div className="flex items-baseline gap-4 mb-8">
                 <div className="w-32 h-10 bg-gray-200 rounded-lg" />
                 <div className="w-20 h-6 bg-gray-100 rounded" />
              </div>
              <div className="w-full h-3 bg-gray-50 rounded" />
            </div>

            {/* Actions Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-grow h-16 bg-gray-100 border-2 border-teal-light rounded-xl" />
              <div className="flex-grow h-16 bg-gray-200 rounded-xl" />
              <div className="w-16 h-16 bg-gray-100 border border-teal-light rounded-xl" />
            </div>

            {/* Service & Pincode Skeleton */}
            <div className="bg-teal-light/20 rounded-2xl p-8 border border-teal-light h-40" />

            {/* Accordions Skeleton */}
            <div className="flex flex-col border-t border-teal-light pt-4 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 border-b border-teal-light bg-gray-50/50 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
