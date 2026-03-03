'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS, TYPOGRAPHY, RADIUS } from '../lib/design-system';

const MixAndMatchBuilder = () => {
  const [activeCategory, setActiveCategory] = useState('necklace');
  const [selectedPieces, setSelectedPieces] = useState<any[]>([]);

  const categories = [
    { id: 'necklace', name: 'Necklace', icon: '💎' },
    { id: 'earrings', name: 'Earrings', icon: '👂' },
    { id: 'maang-tikka', name: 'Maang Tikka', icon: '👑' },
    { id: 'bangles', name: 'Bangles', icon: '⭕' },
    { id: 'haath-phool', name: 'Haath Phool', icon: '🌸' },
    { id: 'nath', name: 'Nath', icon: '💎' },
    { id: 'waistband', name: 'Waistband', icon: '🎀' }
  ];

  const mockPieces = {
    necklace: [
      { id: 1, name: 'Diamond Choker', price: 1800, image: '/images/choker-1.jpg' },
      { id: 2, name: 'Kundan Necklace', price: 2200, image: '/images/kundan-necklace.jpg' },
      { id: 3, name: 'Gold Pendant Set', price: 1500, image: '/images/gold-pendant.jpg' }
    ],
    earrings: [
      { id: 4, name: 'Jhumka Earrings', price: 800, image: '/images/jhumkas.jpg' },
      { id: 5, name: 'Stud Earrings', price: 600, image: '/images/studs.jpg' },
      { id: 6, name: 'Chandbali Earrings', price: 1200, image: '/images/chandbalis.jpg' }
    ],
    'maang-tikka': [
      { id: 7, name: 'Traditional Maang Tikka', price: 900, image: '/images/maang-tikka-1.jpg' },
      { id: 8, name: 'Modern Maang Tikka', price: 1100, image: '/images/maang-tikka-2.jpg' }
    ]
  };

  const currentPieces = mockPieces[activeCategory as keyof typeof mockPieces] || [];

  const addToSet = (piece: any) => {
    if (!selectedPieces.find(p => p.id === piece.id)) {
      setSelectedPieces([...selectedPieces, { ...piece, category: activeCategory }]);
    }
  };

  const removeFromSet = (pieceId: number) => {
    setSelectedPieces(selectedPieces.filter(p => p.id !== pieceId));
  };

  const isPieceSelected = (pieceId: number) => {
    return selectedPieces.some(p => p.id === pieceId);
  };

  const totalCost = selectedPieces.reduce((sum, piece) => sum + piece.price, 0);
  const totalDeposit = selectedPieces.length * 5000;

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.cream }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="font-bold mb-4"
            style={{ 
              fontFamily: TYPOGRAPHY.heading,
              fontSize: TYPOGRAPHY.h2,
              color: BRAND_COLORS.darkMaroon
            }}
          >
            Build Your Own Bridal Set
          </h1>
          <p 
            className="max-w-2xl mx-auto"
            style={{ 
              fontFamily: TYPOGRAPHY.body,
              fontSize: TYPOGRAPHY.large,
              color: '#888888'
            }}
          >
            Choose each piece individually. We will deliver them together.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Category Selector */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 
                className="font-bold mb-6 uppercase tracking-wider"
                style={{ 
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.tiny,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                Select Category
              </h2>
              
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                      activeCategory === category.id ? 'shadow-md' : ''
                    }`}
                    style={{
                      backgroundColor: activeCategory === category.id 
                        ? BRAND_COLORS.cream 
                        : 'transparent',
                      border: activeCategory === category.id 
                        ? `1px solid ${BRAND_COLORS.gold}` 
                        : '1px solid transparent'
                    }}
                  >
                    <span className="text-xl">{category.icon}</span>
                    <span 
                      className="font-medium"
                      style={{ 
                        fontFamily: TYPOGRAPHY.accent,
                        fontSize: TYPOGRAPHY.base,
                        color: BRAND_COLORS.darkMaroon
                      }}
                    >
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
              <h3 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.base,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                {categories.find(c => c.id === activeCategory)?.name} Options
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {currentPieces.map((piece) => (
                  <div 
                    key={piece.id}
                    className="border rounded-lg overflow-hidden hover:shadow-md transition-all"
                    style={{ borderColor: BRAND_COLORS.border }}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                          style={{ backgroundColor: BRAND_COLORS.cream }}
                        >
                          <img
                            src={piece.image}
                            alt={piece.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 
                            className="font-medium mb-1"
                            style={{ 
                              fontFamily: TYPOGRAPHY.accent,
                              fontSize: TYPOGRAPHY.small,
                              color: BRAND_COLORS.darkMaroon
                            }}
                          >
                            {piece.name}
                          </h4>
                          <p 
                            className="font-bold"
                            style={{ 
                              fontFamily: TYPOGRAPHY.accent,
                              fontSize: TYPOGRAPHY.base,
                              color: BRAND_COLORS.gold
                            }}
                          >
                            ₹{piece.price}/day
                          </p>
                        </div>
                        <button
                          onClick={() => isPieceSelected(piece.id) 
                            ? removeFromSet(piece.id) 
                            : addToSet(piece)
                          }
                          className={`px-4 py-2 rounded-full font-medium transition-all ${
                            isPieceSelected(piece.id) 
                              ? 'bg-green-100 text-green-800' 
                              : 'border'
                          }`}
                          style={{
                            borderColor: BRAND_COLORS.gold,
                            color: isPieceSelected(piece.id) ? '' : BRAND_COLORS.gold
                          }}
                        >
                          {isPieceSelected(piece.id) ? 'SELECTED ✓' : 'ADD +'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Set Preview */}
          <div className="lg:w-2/3">
            <div 
              className="sticky top-8 rounded-lg p-6 shadow-lg"
              style={{ 
                backgroundColor: BRAND_COLORS.cream,
                borderLeft: `1px solid ${BRAND_COLORS.gold}`
              }}
            >
              <h2 
                className="font-bold mb-6"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: '28px',
                  color: BRAND_COLORS.gold
                }}
              >
                YOUR CUSTOM SET
              </h2>

              {/* Dress Silhouette */}
              <div className="relative mb-8">
                <div className="text-center py-12" style={{ color: '#888888' }}>
                  <div className="text-6xl mb-4">👗</div>
                  <p>Dress silhouette with jewellery placement zones</p>
                  <p className="text-sm mt-2">Visual representation would go here</p>
                </div>
                
                {/* Placement Zones */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center text-xs"
                    style={{ borderColor: BRAND_COLORS.gold, color: BRAND_COLORS.gold }}>
                    +
                  </div>
                </div>
              </div>

              {/* Selected Pieces List */}
              <div className="mb-8">
                <h3 
                  className="font-bold mb-4 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Selected Pieces
                </h3>
                
                {selectedPieces.length === 0 ? (
                  <div className="text-center py-8" style={{ color: '#888888' }}>
                    <p>No pieces selected yet</p>
                    <p className="text-sm mt-2">Select pieces from the left panel</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedPieces.map((piece) => (
                      <div 
                        key={piece.id}
                        className="flex items-center gap-4 p-3 rounded-lg"
                        style={{ backgroundColor: BRAND_COLORS.creamLight }}
                      >
                        <div 
                          className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                          style={{ backgroundColor: BRAND_COLORS.cream }}
                        >
                          <img
                            src={piece.image}
                            alt={piece.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 
                            className="font-medium"
                            style={{ 
                              fontFamily: TYPOGRAPHY.accent,
                              fontSize: TYPOGRAPHY.small,
                              color: BRAND_COLORS.darkMaroon
                            }}
                          >
                            {piece.name}
                          </h4>
                          <p 
                            className="text-sm"
                            style={{ color: '#888888' }}
                          >
                            {categories.find(c => c.id === piece.category)?.name}
                          </p>
                        </div>
                        <div 
                          className="font-bold"
                          style={{ 
                            fontFamily: TYPOGRAPHY.accent,
                            color: BRAND_COLORS.gold
                          }}
                        >
                          ₹{piece.price}/day
                        </div>
                        <button
                          onClick={() => removeFromSet(piece.id)}
                          className="p-1 rounded-full hover:bg-red-100 transition-colors"
                          style={{ color: '#dc2626' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pricing Summary */}
              {selectedPieces.length > 0 && (
                <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.creamLight }}>
                  <div className="flex justify-between items-center mb-2">
                    <span 
                      className="font-medium"
                      style={{ 
                        fontFamily: TYPOGRAPHY.accent,
                        fontSize: TYPOGRAPHY.base,
                        color: BRAND_COLORS.darkMaroon
                      }}
                    >
                      Your Set Total:
                    </span>
                    <span 
                      className="font-bold"
                      style={{ 
                        fontFamily: TYPOGRAPHY.accent,
                        fontSize: '24px',
                        color: BRAND_COLORS.gold
                      }}
                    >
                      ₹{totalCost}/day
                    </span>
                  </div>
                  <p 
                    className="text-sm"
                    style={{ 
                      fontFamily: TYPOGRAPHY.body,
                      color: '#888888'
                    }}
                  >
                    Combined Security Deposit: ₹{totalDeposit.toLocaleString()}
                  </p>
                </div>
              )}

              {/* CTA Buttons */}
              {selectedPieces.length > 0 && (
                <div className="space-y-4">
                  <button
                    className="w-full py-4 font-bold rounded-lg transition-all hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: BRAND_COLORS.maroon,
                      color: BRAND_COLORS.cream,
                      fontFamily: TYPOGRAPHY.accent,
                      fontSize: TYPOGRAPHY.base
                    }}
                  >
                    RENT THIS SET
                  </button>
                  
                  <button
                    className="w-full py-3 font-medium rounded-lg border transition-all"
                    style={{ 
                      borderColor: BRAND_COLORS.gold,
                      color: BRAND_COLORS.gold,
                      fontFamily: TYPOGRAPHY.accent,
                      fontSize: TYPOGRAPHY.base,
                      backgroundColor: 'transparent'
                    }}
                  >
                    SAVE SET TO WISHLIST
                  </button>
                </div>
              )}

              {/* Availability Check */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: BRAND_COLORS.border }}>
                <h3 
                  className="font-bold mb-4"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.base,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Check Availability
                </h3>
                <div className="text-center py-6" style={{ color: '#888888' }}>
                  <p>Date picker would go here</p>
                  <p className="text-sm mt-2">Check if all selected pieces are available on your date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixAndMatchBuilder;