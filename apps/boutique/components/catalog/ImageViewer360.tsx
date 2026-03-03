'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '../ui/button';

interface ImageViewer360Props {
  images: string[];
}

export const ImageViewer360: React.FC<ImageViewer360Props> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [showTooltip, setShowTooltip] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const autoRotateRef = useRef<NodeJS.Timeout | null>(null);
  const preloadRef = useRef(false);

  // Preload all images
  useEffect(() => {
    if (preloadRef.current) return; // Prevent multiple preloads
    
    preloadRef.current = true;
    setIsLoading(true);
    setProgress(0);
    
    const totalImages = images.length;
    let loadedCount = 0;
    
    const preloadPromises = images.map((src, index) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = () => {
          loadedCount++;
          setProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.src = src;
        imagesRef.current[index] = img;
      });
    });

    Promise.all(preloadPromises).then(() => {
      setIsLoading(false);
    });
  }, [images]);

  // Auto-rotate effect
  useEffect(() => {
    if (autoRotate && !isDragging && !isLoading) {
      autoRotateRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % images.length);
      }, 150);
    }

    return () => {
      if (autoRotateRef.current) {
        clearInterval(autoRotateRef.current);
      }
    };
  }, [autoRotate, isDragging, isLoading, images.length]);

  // Hide tooltip after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle mouse events for dragging
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setAutoRotate(false);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartX;
    if (Math.abs(deltaX) > 10) { // Threshold to prevent accidental drags
      const newIndex = deltaX > 0 
        ? (currentIndex - 1 + images.length) % images.length
        : (currentIndex + 1) % images.length;
      
      setCurrentIndex(newIndex);
      setDragStartX(e.clientX);
    }
  }, [isDragging, dragStartX, currentIndex, images.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setAutoRotate(true);
  }, []);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStartX(e.touches[0].clientX);
    setAutoRotate(false);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 10) { // Threshold to prevent accidental drags
      const newIndex = deltaX > 0 
        ? (currentIndex - 1 + images.length) % images.length
        : (currentIndex + 1) % images.length;
      
      setCurrentIndex(newIndex);
      setDragStartX(e.touches[0].clientX);
    }
  }, [isDragging, dragStartX, currentIndex, images.length]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setAutoRotate(true);
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove as any);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove as any);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  // Navigation functions
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
    setAutoRotate(false);
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length);
    setAutoRotate(false);
  };

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxOpen) {
        setLightboxOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  if (isLoading) {
    return (
      <div className="relative w-full aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-64 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-brand-rose h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main 360 viewer */}
      <div 
        ref={containerRef}
        className={`relative w-full aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img
          src={images[currentIndex]}
          alt={`360 view - angle ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
        
        {/* 360° badge */}
        <div className="absolute top-4 left-4 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
          <RotateCcw className="w-3 h-3" />
          360°
        </div>
        
        {/* Frame counter */}
        <div className="absolute bottom-4 right-4 bg-black/70 text-white text-sm font-medium px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
        
        {/* Tooltip */}
        {showTooltip && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-sm font-medium bg-black/70 px-4 py-2 rounded-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            Drag to rotate
          </motion.div>
        )}
        
        {/* Navigation arrows */}
        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            goToPrevious();
          }}
          aria-label="Previous angle"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            goToNext();
          }}
          aria-label="Next angle"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        
        {/* Lightbox trigger */}
        <button
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          onClick={() => setLightboxOpen(true)}
          aria-label="Open fullscreen view"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
      
      {/* Lightbox */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div 
            className="relative w-full max-w-6xl aspect-square"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`360 view - angle ${currentIndex + 1}`}
              className="w-full h-full object-contain"
            />
            
            {/* Close button */}
            <button
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Navigation arrows in lightbox */}
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              aria-label="Previous angle"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              aria-label="Next angle"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            
            {/* Frame counter in lightbox */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-full">
              {currentIndex + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
};