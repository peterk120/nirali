import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import { BRAND_COLORS, TYPOGRAPHY } from '../lib/design-system';

export default function HomePage() {
  return (
    <div style={{ backgroundColor: BRAND_COLORS.cream }}>
      <Navbar />
      <HeroSection />
      
      {/* Component Showcase Navigation */}
      <div className="py-16 px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="font-bold mb-6"
            style={{ 
              fontFamily: TYPOGRAPHY.heading,
              fontSize: TYPOGRAPHY.h3,
              color: BRAND_COLORS.darkMaroon
            }}
          >
            Explore Our Components
          </h2>
          <p 
            className="mb-12 max-w-2xl mx-auto"
            style={{ 
              fontFamily: TYPOGRAPHY.body,
              fontSize: TYPOGRAPHY.large,
              color: '#888888'
            }}
          >
            View our complete design system and components in action
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Showcase All Components', href: '/showcase', color: BRAND_COLORS.gold },
              { name: 'Jewellery Catalog', href: '/jewellery', color: BRAND_COLORS.maroon },
              { name: 'Product Detail', href: '/jewellery/royal-kundan-set', color: BRAND_COLORS.gold },
              { name: 'Build Your Set', href: '/build-your-set', color: BRAND_COLORS.maroon },
              { name: 'Booking Flow', href: '/book', color: BRAND_COLORS.gold },
              { name: 'How It Works', href: '/how-it-works', color: BRAND_COLORS.maroon }
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href as any}
                className="block p-6 rounded-lg border transition-all hover:scale-105 hover:shadow-lg"
                style={{
                  backgroundColor: BRAND_COLORS.cream,
                  borderColor: item.color,
                  border: `2px solid ${item.color}`
                }}
              >
                <h3 
                  className="font-bold mb-2"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.base,
                    color: item.color
                  }}
                >
                  {item.name}
                </h3>
                <p 
                  className="text-sm"
                  style={{ color: '#888888' }}
                >
                  Click to view this component
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}