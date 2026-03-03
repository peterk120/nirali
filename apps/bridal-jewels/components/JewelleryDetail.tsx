'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS, TYPOGRAPHY, RADIUS } from '../lib/design-system';

const JewelleryDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState('3');
  const [quantity, setQuantity] = useState(1);
  
  // Mock data
  const product = {
    id: 1,
    name: 'Royal Kundan Bridal Necklace + Earring + Maang Tikka Set',
    category: 'Bridal Set',
    function: 'Wedding Day',
    images: [
      '/images/detail-1.jpg',
      '/images/detail-2.jpg', 
      '/images/detail-3.jpg',
      '/images/detail-4.jpg',
      '/images/360-view.jpg'
    ],
    pieces: ['Necklace', 'Jhumka Earrings', 'Maang Tikka', '2 Bangles'],
    price: 2500,
    deposit: 15000,
    insurance: 180000,
    metal: '22K Gold-plated',
    stone: 'Kundan',
    weight: '120 grams',
    karat: '22K',
    certification: 'BIS Hallmarked'
  };

  const durationOptions = [
    { days: '1', price: 2500 },
    { days: '3', price: 6500 },
    { days: '7', price: 14000 }
  ];

  const specifications = [
    { label: 'Metal Type', value: product.metal },
    { label: 'Stone', value: product.stone },
    { label: 'Weight', value: product.weight },
    { label: 'Karat', value: product.karat },
    { label: 'Certification', value: product.certification },
    { label: 'Security Deposit', value: `₹${product.deposit.toLocaleString()}` },
    { label: 'Insurance Value', value: `₹${product.insurance.toLocaleString()}` }
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.cream }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left - Image Gallery */}
          <div className="lg:w-1/2">
            <div className="sticky top-8">
              {/* Main Image */}
              <div 
                className="relative mb-6 rounded-lg overflow-hidden"
                style={{ 
                  backgroundColor: BRAND_COLORS.cream,
                  height: '520px'
                }}
              >
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain p-8"
                />
                
                {/* Info Tooltip */}
                <div 
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ 
                    backgroundColor: BRAND_COLORS.gold,
                    color: BRAND_COLORS.cream
                  }}
                >
                  All 5 pieces included
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-1 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-gold' : 'border-transparent'
                    }`}
                    style={{ 
                      backgroundColor: BRAND_COLORS.cream,
                      borderColor: selectedImage === index ? BRAND_COLORS.gold : 'transparent'
                    }}
                  >
                    <img
                      src={image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Product Info */}
          <div className="lg:w-1/2">
            {/* Category Tag */}
            <div className="mb-4">
              <span 
                className="font-bold uppercase tracking-wider px-3 py-1 rounded-full text-xs"
                style={{ 
                  backgroundColor: 'transparent',
                  color: BRAND_COLORS.gold,
                  border: `1px solid ${BRAND_COLORS.gold}`,
                  fontFamily: TYPOGRAPHY.accent
                }}
              >
                {product.category} | {product.function}
              </span>
            </div>

            {/* Product Name */}
            <h1 
              className="font-bold mb-6"
              style={{ 
                fontFamily: TYPOGRAPHY.accent,
                fontSize: TYPOGRAPHY.h5,
                color: BRAND_COLORS.darkMaroon,
                lineHeight: '1.3'
              }}
            >
              {product.name}
            </h1>

            {/* Pieces Included */}
            <p 
              className="mb-6"
              style={{ 
                fontFamily: TYPOGRAPHY.accent,
                fontSize: TYPOGRAPHY.small,
                color: '#888888'
              }}
            >
              Includes: {product.pieces.join(' + ')}
            </p>

            {/* Certification Badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['BIS Hallmarked', '22K Gold', 'Certified Authentic', 'Insured ₹1,80,000'].map((badge, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full text-xs font-bold"
                  style={{ 
                    backgroundColor: 'transparent',
                    color: BRAND_COLORS.gold,
                    border: `1px solid ${BRAND_COLORS.gold}`,
                    fontFamily: TYPOGRAPHY.accent
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Price Block */}
            <div className="mb-8">
              <div className="mb-4">
                <span 
                  className="font-bold"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: '36px',
                    color: BRAND_COLORS.gold
                  }}
                >
                  ₹{product.price}/day
                </span>
              </div>
              
              <p 
                className="mb-6"
                style={{ 
                  fontFamily: TYPOGRAPHY.body,
                  fontSize: TYPOGRAPHY.small,
                  color: '#888888'
                }}
              >
                Security Deposit: ₹{product.deposit.toLocaleString()} (refunded within 48hrs of return)
              </p>

              {/* Duration Selector */}
              <div className="flex flex-wrap gap-3 mb-6">
                {durationOptions.map((option) => (
                  <button
                    key={option.days}
                    onClick={() => setSelectedDuration(option.days)}
                    className="px-6 py-3 rounded-full font-bold transition-all"
                    style={{
                      fontFamily: TYPOGRAPHY.accent,
                      fontSize: TYPOGRAPHY.base,
                      ...(selectedDuration === option.days
                        ? {
                            backgroundColor: BRAND_COLORS.gold,
                            color: BRAND_COLORS.cream
                          }
                        : {
                            border: `1px solid ${BRAND_COLORS.gold}`,
                            color: BRAND_COLORS.gold,
                            backgroundColor: 'transparent'
                          })
                    }}
                  >
                    {option.days} day{option.days !== '1' ? 's' : ''} — ₹{option.price.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Calendar */}
            <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.creamLight }}>
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
              <div className="text-center py-8" style={{ color: '#888888' }}>
                Calendar component would go here
              </div>
            </div>

            {/* Specifications */}
            <div className="mb-8">
              <h3 
                className="font-bold mb-4 uppercase tracking-wider"
                style={{ 
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.tiny,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {specifications.map((spec, index) => (
                  <div key={index} className="py-2 border-b" style={{ borderColor: BRAND_COLORS.border }}>
                    <p 
                      className="font-medium"
                      style={{ 
                        fontFamily: TYPOGRAPHY.accent,
                        fontSize: TYPOGRAPHY.small,
                        color: BRAND_COLORS.darkMaroon
                      }}
                    >
                      {spec.label}
                    </p>
                    <p 
                      className="text-sm"
                      style={{ 
                        fontFamily: TYPOGRAPHY.body,
                        color: '#888888'
                      }}
                    >
                      {spec.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-4 mb-8">
              <button
                className="w-full py-4 font-bold rounded-lg transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: BRAND_COLORS.gold,
                  color: BRAND_COLORS.cream,
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.base
                }}
              >
                ADD TO RENTAL CART
              </button>
              
              <button
                className="w-full py-4 font-bold rounded-lg transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: BRAND_COLORS.maroon,
                  color: BRAND_COLORS.cream,
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.base
                }}
              >
                BOOK NOW — SELECT DATE
              </button>
            </div>

            {/* AI Style Suggestion */}
            <div className="p-6 rounded-lg mb-8" style={{ backgroundColor: BRAND_COLORS.creamLight }}>
              <h4 
                className="font-bold mb-4 flex items-center"
                style={{ 
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.small,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                ✨ Pairs beautifully with:
              </h4>
              <div className="flex gap-4 mb-4">
                {[1, 2].map((i) => (
                  <div 
                    key={i}
                    className="w-20 h-20 rounded-lg overflow-hidden border"
                    style={{ 
                      backgroundColor: BRAND_COLORS.cream,
                      borderColor: BRAND_COLORS.border
                    }}
                  >
                    <img 
                      src={`/images/dress-${i}.jpg`} 
                      alt={`Dress ${i}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <button 
                className="text-sm font-medium underline hover:no-underline"
                style={{ color: BRAND_COLORS.gold }}
              >
                Rent the matching dress →
              </button>
            </div>

            {/* Tabs */}
            <div className="border-t" style={{ borderColor: BRAND_COLORS.border }}>
              <div className="flex border-b" style={{ borderColor: BRAND_COLORS.border }}>
                {['Set Details', 'Care & Handling', 'Delivery & Return', 'Reviews (43)'].map((tab, index) => (
                  <button
                    key={index}
                    className="px-6 py-4 font-medium relative"
                    style={{ 
                      fontFamily: TYPOGRAPHY.accent,
                      fontSize: TYPOGRAPHY.base,
                      color: index === 0 ? BRAND_COLORS.gold : '#888888'
                    }}
                  >
                    {tab}
                    {index === 0 && (
                      <div 
                        className="absolute bottom-0 left-0 right-0 h-0.5"
                        style={{ backgroundColor: BRAND_COLORS.gold }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="py-6">
                <p style={{ color: '#888888' }}>Set details content would go here...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryDetail;