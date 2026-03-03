'use client';

import { playfairDisplay, dmSans } from '@/lib/fonts';

interface ContinuousHeroProps {
  images?: string[];
  heading?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  duration?: number;
}

export default function ContinuousHero({
  images = [
    '/images/dress/blue dress-1.jpg',
    '/images/dress/saree-1.jpg',
    '/images/dress/violet dress-1.jpg',
  ],
  heading = 'ELEGANT ATTIRE',
  subtitle = 'Discover timeless fashion for every occasion',
  ctaLabel = 'EXPLORE COLLECTION',
  ctaHref = '/catalog',
  duration = 20,
}: ContinuousHeroProps) {
  // Duplicate images 3x for seamless loop
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <div style={{ isolation: 'isolate' }}>
      <div className="relative w-full h-screen overflow-hidden">

        {/* Animated Image Strip */}
        <div
          className="absolute inset-0 flex"
          style={{
            width: `${duplicatedImages.length * 100}vw`,
            animation: `slide ${duration}s linear infinite`,
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
            contain: 'layout paint',
            pointerEvents: 'none',
          }}
        >
          {duplicatedImages.map((image, index) => (
            <div
              key={index}
              className="relative flex-shrink-0"
              style={{ width: '100vw', height: '100%' }}
            >
              <img
                src={image}
                alt={`Hero ${index % images.length + 1}`}
                className="w-full h-full object-cover"
                loading={index < images.length ? 'eager' : 'lazy'}
                fetchPriority={index < images.length ? 'high' : 'low'}
              />
              {/* Side vignette per frame */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Master overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 flex items-center justify-center">
          <div className="text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto z-20">
            <div className="mb-4">
              <span className={`${dmSans.className} font-sans text-[10px] xs:text-xs md:text-base tracking-widest uppercase`} style={{ color: '#c9a96e', fontWeight: 300 }}>Elegance</span>
              <span className="mx-2 hidden xs:inline" style={{ color: '#c9a96e', fontWeight: 300 }}>•</span>
              <span className={`${dmSans.className} font-sans text-[10px] xs:text-xs md:text-base tracking-widest uppercase`} style={{ color: '#c9a96e', fontWeight: 300 }}>EST. 2024</span>
            </div>
            <h1 className={`${playfairDisplay.className} font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-medium mb-4 xs:mb-6 tracking-wider`} style={{ color: '#ffffff', fontWeight: 500 }}>
              {heading}
            </h1>
            <p className={`${dmSans.className} font-sans text-sm xs:text-base md:text-xl lg:text-2xl mb-8 xs:mb-12 tracking-widest uppercase px-2`} style={{ color: 'rgba(255,255,255,0.88)', fontWeight: 300 }}>
              {subtitle}
            </p>
            <a
              href={ctaHref}
              className={`${dmSans.className} font-sans text-xs xs:text-sm md:text-base tracking-widest uppercase text-white relative group transition-all duration-300 hover:text-[#c9a96e] inline-block px-6 py-3`}
              style={{ fontWeight: 300 }}
            >
              {ctaLabel}
              <span className="absolute bottom-0 left-0 w-full h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" style={{ backgroundColor: '#c9a96e' }} />
            </a>
          </div>
        </div>

        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[2%] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Animation keyframes */}
        <style jsx>{`
          @keyframes slide {
            0% {
              transform: translateZ(0) translateX(0);
            }
            100% {
              transform: translateZ(0) translateX(-${100 / 3}%);
            }
          }
          
          /* Mobile-specific adjustments */
          @media (max-width: 768px) {
            .text-center {
              padding-left: 1rem;
              padding-right: 1rem;
            }
          }
        `}</style>

      </div>
    </div>
  );
}