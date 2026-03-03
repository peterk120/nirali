'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="text-center">
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {/* Brand Logo with Pulse Animation */}
          <motion.div
            className="w-24 h-24 mx-auto bg-plum-500 rounded-full flex items-center justify-center"
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: 'easeInOut' 
            }}
          >
            <span className="text-white text-2xl font-bold">NS</span>
          </motion.div>
          
          {/* Loading Text */}
          <motion.p
            className="mt-6 text-gray-600 font-body text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Loading...
          </motion.p>
        </motion.div>
        
        {/* Shimmer Animation */}
        <div className="mt-12 max-w-md mx-auto">
          <motion.div
            className="h-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full"
            animate={{ 
              x: ['-100%', '100%'] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'linear' 
            }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full mt-3"
            animate={{ 
              x: ['-100%', '100%'] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'linear',
              delay: 0.2 
            }}
          />
          <motion.div
            className="h-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent rounded-full mt-3"
            animate={{ 
              x: ['-100%', '100%'] 
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'linear',
              delay: 0.4 
            }}
          />
        </div>
      </div>
    </div>
  );
}