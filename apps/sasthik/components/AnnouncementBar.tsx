'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const messages = [
  "Free Shipping on orders above ₹499",
  "Premium Quality Imitation Jewellery | Tarnish-Resistant Coating",
  "Easy 7-Day Returns | 100% Secure Checkout"
];

export default function AnnouncementBar() {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (isAdminPath) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isAdminPath]);

  if (!isVisible || isAdminPath) return null;

  return (
    <div className="bg-brand-teal text-white py-2 px-4 relative overflow-hidden group">
      <div className="max-w-7xl mx-auto flex justify-center items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="font-body text-[13px] tracking-wide text-center"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Close"
      >
        <X size={14} />
      </button>
    </div>
  );
}
