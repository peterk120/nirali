'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  backgroundImage?: string;
  backgroundVideo?: string;
  brand: {
    eyebrow: string;
  };
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  backgroundVideo,
  brand
}) => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      {backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to background image if video fails
              const video = e.currentTarget;
              video.style.display = 'none';
              if (backgroundImage) {
                const img = document.createElement('img');
                img.src = backgroundImage;
                img.className = 'w-full h-full object-cover';
                video.parentNode?.appendChild(img);
              }
            }}
          >
            <source src={backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      
      {/* Background Image (fallback or primary) */}
      {backgroundImage && !backgroundVideo && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Hero background"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </div>
      )}
      
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/40 to-transparent" />
      
      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Eyebrow text */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="text-brand-gold uppercase tracking-widest text-sm font-medium">
              {brand.eyebrow}
            </span>
          </motion.div>
          
          {/* Main title */}
          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {title}
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            className="font-body text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {subtitle}
          </motion.p>
          
          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95, duration: 0.6 }}
            >
              <a 
                href={ctaPrimary.href}
                className="inline-flex items-center justify-center rounded-md bg-brand-rose text-white hover:bg-brand-rose/90 px-8 py-4 text-lg font-medium min-w-48 transition-colors"
              >
                {ctaPrimary.label}
              </a>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <a 
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center rounded-md border border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-medium min-w-48 transition-colors"
              >
                {ctaSecondary.label}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll down indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.div
          className="flex flex-col items-center text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChevronDown className="w-6 h-6" />
          <span className="text-xs uppercase tracking-widest mt-2">Scroll Down</span>
        </motion.div>
      </motion.div>
    </section>
  );
};