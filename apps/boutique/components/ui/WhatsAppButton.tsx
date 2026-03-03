'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const WhatsAppButton = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  // Check if we should hide the button on certain routes
  const shouldHide = ['/checkout', '/payment', '/confirmation'].some(route => 
    pathname.startsWith(route)
  );

  // Get phone number from environment variable
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919876543210';
  
  // Get current page title (we'll use the pathname as a substitute)
  const pageTitle = typeof document !== 'undefined' ? document.title : 'our website';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=Hi! I found you on ${pageTitle}.`;

  // Show the button after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (shouldHide) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: 'spring', 
            stiffness: 500, 
            damping: 30,
            delay: 0.5
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Chat with us on WhatsApp"
          role="link"
          onMouseEnter={() => setShowLabel(true)}
          onMouseLeave={() => setShowLabel(false)}
        >
          {/* Pulsing rings */}
          <motion.div
            className="absolute h-14 w-14 rounded-full bg-green-500 opacity-40"
            animate={{
              scale: [1, 1.4, 1.6],
              opacity: [0.4, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
          <motion.div
            className="absolute h-14 w-14 rounded-full bg-green-500 opacity-40"
            animate={{
              scale: [1, 1.8, 2],
              opacity: [0.4, 0.1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 0.5,
              repeatType: 'loop',
            }}
          />
          
          {/* WhatsApp button */}
          <motion.div 
            className="relative flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="white" 
              className="w-8 h-8"
            >
              <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
            </svg>
          </motion.div>
          
          {/* Label that slides in on hover */}
          <AnimatePresence>
            {showLabel && (
              <motion.span
                className="ml-3 px-4 py-2 bg-gray-800 text-white text-sm rounded-full whitespace-nowrap"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                Chat with us
              </motion.span>
            )}
          </AnimatePresence>
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppButton;