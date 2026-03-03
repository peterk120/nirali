'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

const RouteProgressBar = () => {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  // Determine brand based on pathname
  const getBrandColor = () => {
    if (pathname.includes('/bridal-jewels')) return '#C9922A'; // brand-gold
    if (pathname.includes('/sasthik')) return '#0D9488'; // brand-teal
    if (pathname.includes('/tamilsmakeover')) return '#9D174D'; // brand-plum
    return '#C0436A'; // brand-rose (default for boutique)
  };

  useEffect(() => {
    setIsLoading(true);
    setProgress(0);
    setShow(true);

    // Simulate progress during navigation
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Simulate completion when route changes
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setShow(false);
      }, 300); // Allow time for fade out
    }, 500);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [pathname]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 z-50"
      style={{ backgroundColor: getBrandColor() }}
      initial={{ width: '0%' }}
      animate={{ width: isLoading ? `${progress}%` : '100%' }}
      transition={{ duration: isLoading ? 0.1 : 0.3, ease: 'linear' }}
      exit={{ opacity: 0 }}
    />
  );
};

export default RouteProgressBar;