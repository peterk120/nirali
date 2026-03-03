'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if we're on a client-side route that's not checkout or home
    setIsVisible(!['/checkout', '/', '/thank-you'].includes(pathname));
  }, [pathname]);

  if (!isVisible) {
    return null;
  }

  const phoneNumber = '+919876543210'; // Replace with actual business number
  const message = encodeURIComponent('Hi, I need assistance with my order.');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M17.472 14.387c-.356-.178-2.324-1.137-2.686-.958-.361.178-.568.567-.848.958-.28.391-.757.391-1.118.101-1.305-.958-2.608-2.506-2.888-4.644-.28-2.137 1.12-3.973 2.424-4.644.28-.178.568-.356.848-.256.28.1.568.567.848.958.28.39.757.677 1.118.567.361-.1.757-.567 1.118-.856.361-.28.757-.38.951-.101.28.28.28.856-.112 1.432-1.023 1.245-1.695 2.506-2.056 3.465-.361.958-.28 1.534.112 1.824z" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    </a>
  );
}