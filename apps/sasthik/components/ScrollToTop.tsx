'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
  const pathname = usePathname();
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Scroll to top when route changes
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Listen for scroll events to show/hide button
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Determine brand based on pathname
  const getBrandColor = () => {
    if (pathname.includes('/bridal-jewels')) return '#C9922A'; // brand-gold
    if (pathname.includes('/sasthik')) return '#0D9488'; // brand-teal
    if (pathname.includes('/tamilsmakeover')) return '#9D174D'; // brand-plum
    return '#C0436A'; // brand-rose (default for boutique)
  };

  const getHoverBrandColor = () => {
    if (pathname.includes('/bridal-jewels')) return '#B07E22'; // brand-gold hover
    if (pathname.includes('/sasthik')) return '#0F766E'; // brand-teal hover
    if (pathname.includes('/tamilsmakeover')) return '#831843'; // brand-plum hover
    return '#A83860'; // brand-rose hover
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 text-white rounded-full shadow-lg transition-colors z-40"
          style={{ 
            backgroundColor: getBrandColor(),
            transition: 'background-color 0.3s ease'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = getHoverBrandColor();
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = getBrandColor();
          }}
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;