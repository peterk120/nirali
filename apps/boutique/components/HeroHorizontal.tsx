'use client';

import { playfairDisplay, dmSans } from '@/lib/fonts';

interface ContinuousHeroProps {
  images?: string[];
  heading?: string;
  subheading?: string;
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
  heading = 'TIMELESS',
  subheading = 'ELEGANCE',
  subtitle = 'Discover exquisite bridal wear and jewellery\ncrafted for the modern Indian bride',
  ctaLabel = 'BROWSE COLLECTION',
  ctaHref = '/catalog',
  duration = 20,
}: ContinuousHeroProps) {
  const duplicatedImages = [...images, ...images, ...images];

  return (
    <>

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
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.65) 100%)',
            }}
          />

          {/* Centered Text Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">

            {/* Top ornament line */}
            <div className="flex items-center gap-4 mb-6">
              <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to right, transparent, #c9a96e)' }} />
              <span className={`${dmSans.className}`} style={{
                fontFamily: "var(--font-body)",
                fontSize: '0.6rem',
                letterSpacing: '0.45em',
                color: '#c9a96e',
                fontWeight: 300,
              }}>
                EST. 2024
              </span>
              <div style={{ width: '60px', height: '1px', background: 'linear-gradient(to left, transparent, #c9a96e)' }} />
            </div>

            {/* Main heading — TIMELESS */}
            <h1
              className={`${playfairDisplay.className}`}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 'clamp(2.8rem, 9vw, 8rem)',
                fontWeight: 500,
                color: '#ffffff',
                letterSpacing: '0.35em',
                lineHeight: 1,
                textShadow: '0 2px 40px rgba(0,0,0,0.3)',
                marginBottom: '0.1em',
              }}
            >
              TIMELESS
            </h1>

            {/* Sub heading — ELEGANCE italic in gold */}
            <h2
              className={`${playfairDisplay.className}`}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 'clamp(2.2rem, 7vw, 6.5rem)',
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#c9a96e',
                letterSpacing: '0.2em',
                lineHeight: 1,
                textShadow: '0 2px 30px rgba(0,0,0,0.4)',
                marginBottom: '1.8rem',
              }}
            >
              Elegance
            </h2>

            {/* Divider with diamond */}
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: '80px', height: '1px', background: 'rgba(255,255,255,0.35)' }} />
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect x="5" y="0" width="7" height="7" transform="rotate(45 5 5)" fill="#c9a96e" />
              </svg>
              <div style={{ width: '80px', height: '1px', background: 'rgba(255,255,255,0.35)' }} />
            </div>

            {/* Subtitle */}
            <p
              className={`${playfairDisplay.className}`}
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: 'clamp(0.95rem, 2vw, 1.25rem)',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.88)',
                letterSpacing: '0.08em',
                textAlign: 'center',
                lineHeight: 1.7,
                marginBottom: '2.8rem',
                maxWidth: '520px',
                textShadow: '0 1px 20px rgba(0,0,0,0.5)',
              }}
            >
              Discover exquisite bridal wear and jewellery<br />
              crafted for the modern Indian bride
            </p>

            {/* CTA Button */}
            <a
              href={ctaHref}
              className={`${dmSans.className}`}
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '0.7rem',
                fontWeight: 300,
                letterSpacing: '0.45em',
                color: '#ffffff',
                textDecoration: 'none',
                border: '1px solid rgba(201,169,110,0.6)',
                padding: '14px 40px',
                transition: 'all 0.4s ease',
                background: 'rgba(0,0,0,0.2)',
                backdropFilter: 'blur(4px)',
                textTransform: 'uppercase',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(201,169,110,0.2)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = '#c9a96e';
                (e.currentTarget as HTMLAnchorElement).style.color = '#c9a96e';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,0,0,0.2)';
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(201,169,110,0.6)';
                (e.currentTarget as HTMLAnchorElement).style.color = '#ffffff';
              }}
            >
              {ctaLabel}
            </a>

          </div>

          {/* Noise texture */}
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
          `}</style>

        </div>
      </div>
    </>
  );
}