'use client';

import { motion } from 'framer-motion';
import { ProductGridSkeleton } from '@/components/ProductSkeleton';

export default function Loading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Placeholder */}
      <div className="container mx-auto px-6 py-12">
        <div className="relative h-[300px] md:h-[500px] bg-teal-light rounded-[2rem] overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          <div className="absolute inset-0 flex flex-col justify-center items-center gap-4">
             {/* Brand Logo Pulse */}
             <motion.div
                className="w-16 h-16 md:w-20 md:h-20 bg-brand-teal rounded-full flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
             >
                <span className="text-white text-xl md:text-2xl font-bold italic font-heading">S</span>
             </motion.div>
             <div className="w-48 h-3 bg-brand-teal/10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Categories Placeholder */}
      <div className="container mx-auto px-6 py-12 flex justify-between gap-4 overflow-hidden">
        {[...Array(8)].map((_, i) => (
           <div key={i} className="flex flex-col items-center gap-3 shrink-0">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-teal-light" />
              <div className="w-12 h-2 bg-gray-100 rounded" />
           </div>
        ))}
      </div>

      {/* Main Grid Placeholder */}
      <section className="py-20 bg-teal-light/20 border-y border-teal-light">
        <div className="container mx-auto px-6">
          <div className="mb-12">
             <div className="w-64 h-8 bg-brand-dark/10 rounded-lg mb-2" />
             <div className="w-16 h-1 bg-brand-rose-gold/30" />
          </div>
          <ProductGridSkeleton count={4} columns="grid-cols-2 md:grid-cols-3 lg:grid-cols-4" />
        </div>
      </section>

      {/* Footer Text */}
      <div className="text-center py-10">
         <p className="font-body text-[10px] uppercase tracking-widest text-gray-300">Fetching the latest Indian treasures for you...</p>
      </div>
    </div>
  );
}