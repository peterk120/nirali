'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ChevronUp } from 'lucide-react';

export default function BackToTop() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isAdminPath) return;
    const toggleVisibility = () => {
      if (window.scrollY > 400) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, [isAdminPath]);

  if (isAdminPath) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-28 right-8 z-50 bg-white border border-teal-light text-brand-teal p-3 rounded-full shadow-luxury hover:bg-brand-teal hover:text-white transition-all transform hover:scale-110"
          aria-label="Back to Top"
        >
          <ChevronUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
