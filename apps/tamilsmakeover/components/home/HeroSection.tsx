'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface CTA {
  label: string;
  href: string;
}

interface HeroSectionProps {
  title: string;
  subtitle: string;
  eyebrow?: string;
  ctaPrimary: CTA;
  ctaSecondary?: CTA;
  backgroundImage: string;
  backgroundVideo?: string;
  brand: 'boutique' | 'bridal-jewels' | 'sasthik' | 'tamilsmakeover';
}

const brandColors = {
  boutique: 'text-rose-500',
  'bridal-jewels': 'text-gold-500',
  sasthik: 'text-teal-500',
  tamilsmakeover: 'text-plum-500',
};

const HeroSection = ({
  title,
  subtitle,
  eyebrow,
  ctaPrimary,
  ctaSecondary,
  backgroundImage,
  backgroundVideo,
  brand
}: HeroSectionProps) => {
  const [videoError, setVideoError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const brandColorClass = brandColors[brand];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100
      }
    }
  };

  const scrollDownVariants = {
    animate: {
      y: [0, 10, 0],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video or Image */}
      {backgroundVideo && !videoError ? (
        <div className="absolute inset-0 z-0">
          <video
            src={backgroundVideo}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsVideoPlaying(true)}
            onError={() => setVideoError(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isVideoPlaying ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {!isVideoPlaying && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-gray-500">Loading video...</div>
            </div>
          )}
        </div>
      ) : (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Dark Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-transparent z-0"></div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {eyebrow && (
          <motion.p
            className={`uppercase tracking-widest text-sm font-medium mb-4 ${brandColorClass}`}
            variants={childVariants}
            custom={0.2}
          >
            {eyebrow}
          </motion.p>
        )}
        
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-white mb-6"
          variants={childVariants}
          custom={0.4}
        >
          {title}
        </motion.h1>
        
        <motion.p
          className="text-lg md:text-xl lg:text-2xl font-body text-white max-w-3xl mx-auto mb-10"
          variants={childVariants}
          custom={0.6}
        >
          {subtitle}
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row justify-center gap-4 mb-16"
          variants={childVariants}
          custom={0.8}
        >
          <Link 
            href={ctaPrimary.href as any}
            className={`px-8 py-4 rounded-full font-body font-medium text-base transition-all duration-300 ${
              brand === 'boutique' 
                ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                : brand === 'bridal-jewels'
                  ? 'bg-gold-500 hover:bg-gold-600 text-white'
                  : brand === 'sasthik'
                    ? 'bg-teal-500 hover:bg-teal-600 text-white'
                    : 'bg-plum-500 hover:bg-plum-600 text-white'
            }`}
          >
            {ctaPrimary.label}
          </Link>
          
          {ctaSecondary && (
            <Link 
              href={ctaSecondary.href as any}
              className={`px-8 py-4 rounded-full font-body font-medium text-base transition-all duration-300 ${
                brand === 'boutique' 
                  ? 'bg-white hover:bg-gray-100 text-rose-500' 
                  : brand === 'bridal-jewels'
                    ? 'bg-white hover:bg-gray-100 text-gold-500'
                    : brand === 'sasthik'
                      ? 'bg-white hover:bg-gray-100 text-teal-500'
                      : 'bg-white hover:bg-gray-100 text-plum-500'
              }`}
            >
              {ctaSecondary.label}
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        variants={scrollDownVariants}
        animate="animate"
      >
        <div className="w-10 h-16 rounded-full border-2 border-white flex justify-center p-1">
          <motion.div
            className="w-3 h-3 rounded-full bg-white"
            animate={{ y: [0, 10, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: 'easeInOut'
            }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;