'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_COLORS, TYPOGRAPHY, TRANSITIONS } from '../lib/design-system';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Navigation items with dropdowns
  const navItems = [
    { name: 'New Collections', href: '/collections/new' },
    {
      name: 'Necklace Sets',
      href: '/jewellery/necklaces',
      dropdown: [
        { name: 'Choker Sets', href: '/jewellery/necklaces/chokers' },
        { name: 'Long Necklace', href: '/jewellery/necklaces/long' },
        { name: 'Layered', href: '/jewellery/necklaces/layered' },
        { name: 'Collar', href: '/jewellery/necklaces/collar' },
        { name: 'Statement', href: '/jewellery/necklaces/statement' },
      ]
    },
    {
      name: 'Earrings',
      href: '/jewellery/earrings',
      dropdown: [
        { name: 'Jhumkas', href: '/jewellery/earrings/jhumkas' },
        { name: 'Chandbalis', href: '/jewellery/earrings/chandbalis' },
        { name: 'Studs', href: '/jewellery/earrings/studs' },
        { name: 'Ear Chains', href: '/jewellery/earrings/chains' },
        { name: 'Maang Tikka + Earring', href: '/jewellery/earrings/sets' },
      ]
    },
    {
      name: 'Maang Tikka',
      href: '/jewellery/maang-tikka',
      dropdown: [
        { name: 'Traditional', href: '/jewellery/maang-tikka/traditional' },
        { name: 'Passa', href: '/jewellery/maang-tikka/passa' },
        { name: 'Jhoomar', href: '/jewellery/maang-tikka/jhoomar' },
        { name: 'Modern', href: '/jewellery/maang-tikka/modern' },
      ]
    },
    {
      name: 'Bangles & Kadas',
      href: '/jewellery/bangles',
      dropdown: [
        { name: 'Gold Bangles', href: '/jewellery/bangles/gold' },
        { name: 'Kundan Bangles', href: '/jewellery/bangles/kundan' },
        { name: 'Kada', href: '/jewellery/bangles/kada' },
        { name: 'Haath Phool', href: '/jewellery/bangles/haath-phool' },
      ]
    },
    {
      name: 'Bridal Sets by Function',
      href: '/bridal-sets',
      dropdown: [
        { name: 'Mehendi Set', href: '/bridal-sets/mehendi' },
        { name: 'Sangeet Set', href: '/bridal-sets/sangeet' },
        { name: 'Wedding Day Set', href: '/bridal-sets/wedding' },
        { name: 'Reception Set', href: '/bridal-sets/reception' },
        { name: 'Engagement Set', href: '/bridal-sets/engagement' },
        { name: 'Full 5-Function Bundle', href: '/bridal-sets/full-bundle' },
      ]
    },
    {
      name: 'By Metal',
      href: '/metal-types',
      dropdown: [
        { name: '22K Gold', href: '/metal-types/22k-gold' },
        { name: 'Kundan', href: '/metal-types/kundan' },
        { name: 'Polki', href: '/metal-types/polki' },
        { name: 'Diamond', href: '/metal-types/diamond' },
        { name: 'Temple', href: '/metal-types/temple' },
        { name: 'Antique Silver', href: '/metal-types/silver' },
      ]
    },
    { name: 'How It Works', href: '/how-it-works' },
  ];

  const handleMouseEnter = (itemName: string) => {
    setOpenDropdown(itemName);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <>
      {/* Top Bar */}
      <div 
        className="w-full py-2 px-4 md:px-8"
        style={{ 
          backgroundColor: BRAND_COLORS.maroon,
          color: BRAND_COLORS.cream,
          fontFamily: TYPOGRAPHY.accent,
          fontSize: TYPOGRAPHY.tiny,
          fontWeight: TYPOGRAPHY.medium
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span>100% Original Gold, Diamond & Kundan</span>
            <span className="hidden sm:inline">|</span>
            <span>Fully Insured Delivery</span>
          </div>
          <div className="flex items-center gap-6">
            <button className="hover:opacity-80 transition-opacity">English</button>
            <span className="hidden sm:inline">|</span>
            <span>+91 98765 XXXXX</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className="sticky top-0 z-50 w-full border-b"
        style={{ 
          backgroundColor: BRAND_COLORS.cream,
          borderColor: 'rgba(184,134,11,0.2)',
          height: '76px'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col">
            <span 
              className="font-bold"
              style={{ 
                fontFamily: TYPOGRAPHY.heading,
                fontSize: '28px',
                color: BRAND_COLORS.gold
              }}
            >
              Nirali Sai
            </span>
            <span 
              className="font-bold tracking-widest"
              style={{ 
                fontFamily: TYPOGRAPHY.accent,
                fontSize: TYPOGRAPHY.micro,
                color: BRAND_COLORS.maroon,
                letterSpacing: '0.2em'
              }}
            >
              BRIDAL JEWELS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <div 
                key={item.name}
                className="relative"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href as any}
                  className="font-medium transition-colors"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.base,
                    color: BRAND_COLORS.darkMaroon,
                    gap: '32px'
                  }}
                >
                  {item.name}
                  {item.dropdown && (
                    <span className="ml-1">▾</span>
                  )}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {openDropdown === item.name && item.dropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-64 rounded-lg shadow-xl"
                      style={{ 
                        backgroundColor: BRAND_COLORS.cream,
                        border: `2px solid ${BRAND_COLORS.gold}`,
                        borderTop: `2px solid ${BRAND_COLORS.gold}`
                      }}
                    >
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href as any}
                            className="block px-4 py-3 hover:border-l-2 transition-all duration-200"
                            style={{ 
                              color: BRAND_COLORS.darkMaroon,
                              borderLeftColor: BRAND_COLORS.gold
                            }}
                            onMouseDown={() => setOpenDropdown(null)}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="hover:text-gold transition-colors" style={{ color: BRAND_COLORS.darkMaroon }}>
              🔍
            </button>
            <div className="relative">
              <button className="hover:text-gold transition-colors" style={{ color: BRAND_COLORS.darkMaroon }}>
                ❤️
              </button>
              <span 
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ 
                  backgroundColor: BRAND_COLORS.gold,
                  color: BRAND_COLORS.cream 
                }}
              >
                3
              </span>
            </div>
            <div className="relative">
              <button className="hover:text-gold transition-colors" style={{ color: BRAND_COLORS.darkMaroon }}>
                🛒
              </button>
              <span 
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                style={{ 
                  backgroundColor: BRAND_COLORS.gold,
                  color: BRAND_COLORS.cream 
                }}
              >
                5
              </span>
            </div>
            <button className="hover:text-gold transition-colors" style={{ color: BRAND_COLORS.darkMaroon }}>
              Account
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ color: BRAND_COLORS.darkMaroon }}
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden"
            >
              <div 
                className="px-4 py-6"
                style={{ backgroundColor: BRAND_COLORS.darkMaroon }}
              >
                <div className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <div key={item.name}>
                      <Link
                        href={item.href as any}
                        className="block py-2 font-medium"
                        style={{ 
                          color: BRAND_COLORS.cream,
                          fontFamily: TYPOGRAPHY.accent,
                          fontSize: TYPOGRAPHY.base
                        }}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                      {item.dropdown && (
                        <div className="ml-4 mt-2 flex flex-col gap-2">
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href as any}
                              className="block py-1 text-sm opacity-80"
                              style={{ color: BRAND_COLORS.cream }}
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
};

export default Navbar;