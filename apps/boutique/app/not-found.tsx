'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const NotFoundPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <motion.div
            className="inline-block"
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              repeatType: 'reverse' 
            }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 200 200" 
              className="w-48 h-48 mx-auto text-rose-300"
            >
              <path 
                fill="currentColor" 
                d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z M100,40 C70,40 40,70 40,100 C40,130 70,160 100,160 C130,160 160,130 160,100 C160,70 130,40 100,40 Z M100,70 C116.57,70 130,83.43 130,100 C130,116.57 116.57,130 100,130 C83.43,130 70,116.57 70,100 C70,83.43 83.43,70 100,70 Z M90,90 L110,90 L110,110 L90,110 Z"
              />
            </svg>
          </motion.div>
        </motion.div>
        
        <motion.h1
          className="text-8xl md:text-9xl font-heading font-bold text-rose-500 mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          404
        </motion.h1>
        
        <motion.h2
          className="text-3xl md:text-4xl font-heading font-semibold text-gray-800 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Page Not Found
        </motion.h2>
        
        <motion.p
          className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Sorry, we couldn't find the page you're looking for. Perhaps you've mistyped the URL? 
          Or the page has been moved or removed.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <button
            onClick={handleGoBack}
            className="px-8 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Go Back
          </button>
          <Link 
            href="/" 
            className="px-8 py-3 bg-white text-rose-500 border border-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
          >
            Go Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;