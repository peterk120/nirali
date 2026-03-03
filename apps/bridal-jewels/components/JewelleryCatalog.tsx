'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS, TYPOGRAPHY, RADIUS, SHADOWS } from '../lib/design-system';

const JewelleryCatalog = () => {
  const [selectedFunction, setSelectedFunction] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([500, 25000]);
  const [stoneTypes, setStoneTypes] = useState<string[]>([]);

  const filterOptions = {
    functions: [
      { id: 'wedding', name: 'Wedding Day Sets', count: 112 },
      { id: 'reception', name: 'Reception Sets', count: 98 },
      { id: 'engagement', name: 'Engagement Sets', count: 87 },
      { id: 'mehendi', name: 'Mehendi Sets', count: 76 },
      { id: 'sangeet', name: 'Sangeet Sets', count: 65 },
      { id: 'full-bundle', name: 'Full Bundle', count: 42 },
    ],
    types: [
      'Complete Bridal Set', 'Necklace Only', 'Earrings Only', 
      'Maang Tikka', 'Bangles Set', 'Haath Phool', 'Nath', 'Waistband'
    ],
    metals: [
      { id: 'gold', name: '22K Gold', color: '#FFD700' },
      { id: 'silver', name: 'Antique Silver', color: '#C0C0C0' },
      { id: 'diamond', name: 'Diamond', color: '#B9F2FF' },
      { id: 'kundan', name: 'Kundan', color: '#E1C16E' },
      { id: 'polki', name: 'Polki', color: '#F0E68C' },
      { id: 'temple', name: 'Temple Gold', color: '#D4AF37' },
    ],
    stones: ['Meena', 'CZ', 'Pearls', 'Coral', 'Ruby', 'Emerald', 'Sapphire']
  };

  const mockJewellery = [
    {
      id: 1,
      name: 'Royal Kundan Necklace + Earring Set',
      image: '/images/kundan-set-1.jpg',
      price: 2500,
      type: 'Complete Bridal Set',
      metal: 'Kundan',
      pieces: 5,
      badge: 'BESTSELLER',
      badgeColor: BRAND_COLORS.gold
    },
    {
      id: 2,
      name: 'Diamond Choker Necklace',
      image: '/images/diamond-choker.jpg',
      price: 4200,
      type: 'Necklace Only',
      metal: 'Diamond',
      pieces: 1,
      badge: 'LIMITED',
      badgeColor: BRAND_COLORS.error
    },
    {
      id: 3,
      name: '22K Gold Jhumka Set',
      image: '/images/gold-jhumkas.jpg',
      price: 1800,
      type: 'Earrings Only',
      metal: '22K Gold',
      pieces: 2,
      badge: 'NEW',
      badgeColor: BRAND_COLORS.success
    },
    {
      id: 4,
      name: 'Traditional Maang Tikka',
      image: '/images/maang-tikka.jpg',
      price: 1200,
      type: 'Maang Tikka',
      metal: 'Kundan',
      pieces: 1,
      badge: null,
      badgeColor: null
    }
  ];

  const handleFunctionToggle = (id: string) => {
    setSelectedFunction(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type)
        ? prev.filter(item => item !== type)
        : [...prev, type]
    );
  };

  const handleStoneToggle = (stone: string) => {
    setStoneTypes(prev => 
      prev.includes(stone)
        ? prev.filter(item => item !== stone)
        : [...prev, stone]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="py-12 px-4 md:px-8 border-b" style={{ backgroundColor: BRAND_COLORS.cream, borderColor: BRAND_COLORS.border }}>
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm mb-4" style={{ color: '#888888' }}>
            Home / Jewellery
          </nav>
          <div className="flex justify-between items-end">
            <div>
              <h1 
                className="font-bold mb-2"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: TYPOGRAPHY.h3,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                Bridal Jewellery Sets
              </h1>
              <p className="font-medium" style={{ color: '#888888' }}>
                512 sets available to rent
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex gap-8">
          {/* Left Sidebar Filters */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-8">
              {/* Function Filter */}
              <div>
                <h3 
                  className="font-bold mb-4 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Function
                </h3>
                <div className="space-y-3">
                  {filterOptions.functions.map((func) => (
                    <label key={func.id} className="flex items-center justify-between cursor-pointer">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedFunction.includes(func.id)}
                          onChange={() => handleFunctionToggle(func.id)}
                          className="mr-3 w-4 h-4"
                          style={{ 
                            accentColor: BRAND_COLORS.gold,
                            border: `1px solid ${BRAND_COLORS.gold}`
                          }}
                        />
                        <span 
                          className="font-medium"
                          style={{ 
                            fontFamily: TYPOGRAPHY.body,
                            fontSize: TYPOGRAPHY.base,
                            color: BRAND_COLORS.darkMaroon
                          }}
                        >
                          {func.name}
                        </span>
                      </div>
                      <span 
                        className="text-sm"
                        style={{ color: '#888888' }}
                      >
                        ({func.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <h3 
                  className="font-bold mb-4 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Jewellery Type
                </h3>
                <div className="space-y-3">
                  {filterOptions.types.map((type) => (
                    <label key={type} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => handleTypeToggle(type)}
                        className="mr-3 w-4 h-4"
                        style={{ 
                          accentColor: BRAND_COLORS.gold,
                          border: `1px solid ${BRAND_COLORS.gold}`
                        }}
                      />
                      <span 
                        className="font-medium"
                        style={{ 
                          fontFamily: TYPOGRAPHY.body,
                          fontSize: TYPOGRAPHY.base,
                          color: BRAND_COLORS.darkMaroon
                        }}
                      >
                        {type}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metal Type Filter */}
              <div>
                <h3 
                  className="font-bold mb-4 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Metal Type
                </h3>
                <div className="space-y-3">
                  {filterOptions.metals.map((metal) => (
                    <label key={metal.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="metal"
                        checked={selectedMetal === metal.id}
                        onChange={() => setSelectedMetal(metal.id)}
                        className="mr-3 w-4 h-4"
                        style={{ 
                          accentColor: BRAND_COLORS.gold,
                          border: `1px solid ${BRAND_COLORS.gold}`
                        }}
                      />
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2 border"
                          style={{ 
                            backgroundColor: metal.color,
                            borderColor: BRAND_COLORS.gold
                          }}
                        />
                        <span 
                          className="font-medium"
                          style={{ 
                            fontFamily: TYPOGRAPHY.body,
                            fontSize: TYPOGRAPHY.base,
                            color: BRAND_COLORS.darkMaroon
                          }}
                        >
                          {metal.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 
                  className="font-bold mb-4 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Rental Price
                </h3>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span style={{ color: BRAND_COLORS.darkMaroon }}>₹{priceRange[0]}</span>
                    <span style={{ color: BRAND_COLORS.darkMaroon }}>₹{priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="25000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                    style={{
                      accentColor: BRAND_COLORS.gold,
                      height: '6px',
                      borderRadius: RADIUS.full,
                      background: `linear-gradient(to right, ${BRAND_COLORS.gold} 0%, ${BRAND_COLORS.gold} ${(priceRange[1] - 500) / (24500) * 100}%, #ddd ${(priceRange[1] - 500) / (24500) * 100}%, #ddd 100%)`
                    }}
                  />
                </div>
              </div>

              {/* Stone Type */}
              <div>
                <h3 
                  className="font-bold mb-4 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Stone Type
                </h3>
                <div className="space-y-3">
                  {filterOptions.stones.map((stone) => (
                    <label key={stone} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stoneTypes.includes(stone)}
                        onChange={() => handleStoneToggle(stone)}
                        className="mr-3 w-4 h-4"
                        style={{ 
                          accentColor: BRAND_COLORS.gold,
                          border: `1px solid ${BRAND_COLORS.gold}`
                        }}
                      />
                      <span 
                        className="font-medium"
                        style={{ 
                          fontFamily: TYPOGRAPHY.body,
                          fontSize: TYPOGRAPHY.base,
                          color: BRAND_COLORS.darkMaroon
                        }}
                      >
                        {stone}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Jewellery Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mockJewellery.map((item) => (
                <motion.div
                  key={item.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -5 }}
                >
                  {/* Image */}
                  <div className="relative" style={{ backgroundColor: BRAND_COLORS.cream }}>
                    <div className="aspect-square flex items-center justify-center p-8">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Badge */}
                    {item.badge && (
                      <div 
                        className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase"
                        style={{ 
                          backgroundColor: item.badgeColor,
                          color: BRAND_COLORS.cream
                        }}
                      >
                        {item.badge}
                      </div>
                    )}
                    
                    {/* Wishlist */}
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
                      ❤️
                    </button>
                    
                    {/* Quick View */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <button 
                        className="px-4 py-2 rounded-full font-medium"
                        style={{ 
                          backgroundColor: BRAND_COLORS.cream,
                          color: BRAND_COLORS.darkMaroon
                        }}
                      >
                        QUICK VIEW
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 
                      className="font-bold mb-2 line-clamp-2"
                      style={{ 
                        fontFamily: TYPOGRAPHY.accent,
                        fontSize: TYPOGRAPHY.base,
                        color: BRAND_COLORS.darkMaroon
                      }}
                    >
                      {item.name}
                    </h3>
                    
                    <p 
                      className="text-sm mb-3"
                      style={{ 
                        fontFamily: TYPOGRAPHY.body,
                        color: '#888888'
                      }}
                    >
                      {item.metal} | {item.type} | Includes: {item.pieces} pieces
                    </p>
                    
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <span 
                          className="font-bold"
                          style={{ 
                            fontFamily: TYPOGRAPHY.accent,
                            fontSize: '17px',
                            color: BRAND_COLORS.gold
                          }}
                        >
                          ₹{item.price}/day
                        </span>
                      </div>
                      <div className="flex items-center text-sm" style={{ color: BRAND_COLORS.success }}>
                        <span className="mr-1">✓</span>
                        <span>Available</span>
                      </div>
                    </div>
                    
                    <button
                      className="w-full py-3 font-bold rounded-b-lg transition-all hover:scale-[1.02]"
                      style={{ 
                        backgroundColor: BRAND_COLORS.maroon,
                        color: BRAND_COLORS.cream,
                        fontFamily: TYPOGRAPHY.accent,
                        fontSize: TYPOGRAPHY.small
                      }}
                    >
                      RENT NOW
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryCatalog;