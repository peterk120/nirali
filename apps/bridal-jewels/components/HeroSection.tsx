'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS, TYPOGRAPHY, TRANSITIONS } from '../lib/design-system';

const HeroSection = () => {
  const [selectedFunction, setSelectedFunction] = useState('wedding');

  const functions = [
    { id: 'engagement', name: 'Engagement', image: '/images/engagement-set.jpg' },
    { id: 'mehendi', name: 'Mehendi', image: '/images/mehendi-set.jpg' },
    { id: 'sangeet', name: 'Sangeet', image: '/images/sangeet-set.jpg' },
    { id: 'wedding', name: 'Wedding Day', image: '/images/wedding-set.jpg' },
    { id: 'reception', name: 'Reception', image: '/images/reception-set.jpg' },
  ];

  const currentFunction = functions.find(f => f.id === selectedFunction) || functions[3];

  return (
    <div className="relative w-full min-h-screen flex">
      {/* Left Panel - Showcase */}
      <div 
        className="w-1/2 relative overflow-hidden"
        style={{ backgroundColor: BRAND_COLORS.darkMaroon }}
      >
        {/* Decorative Elements */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Outer Ring */}
          <motion.div
            className="absolute rounded-full border"
            style={{
              width: '520px',
              height: '520px',
              borderColor: 'rgba(184,134,11,0.15)',
              borderWidth: '1px'
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Ring */}
          <div 
            className="absolute rounded-full border"
            style={{
              width: '480px',
              height: '480px',
              borderColor: 'rgba(184,134,11,0.3)',
              borderWidth: '1px'
            }}
          />
        </div>

        {/* Main Image */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center p-16"
          key={selectedFunction}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full h-full">
            <img
              src={currentFunction.image || '/images/placeholder-jewellery.jpg'}
              alt={`${currentFunction.name} Bridal Set`}
              className="w-full h-full object-contain"
              style={{ 
                filter: 'drop-shadow(0 20px 25px rgba(0,0,0,0.3))'
              }}
            />
          </div>
        </motion.div>

        {/* Corner Decorations */}
        <div className="absolute top-8 left-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke={BRAND_COLORS.gold} 
                  strokeWidth="1.5" 
                  fill="none"/>
          </svg>
        </div>
        <div className="absolute top-8 right-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke={BRAND_COLORS.gold} 
                  strokeWidth="1.5" 
                  fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-8 left-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke={BRAND_COLORS.gold} 
                  strokeWidth="1.5" 
                  fill="none"/>
          </svg>
        </div>
        <div className="absolute bottom-8 right-8">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke={BRAND_COLORS.gold} 
                  strokeWidth="1.5" 
                  fill="none"/>
          </svg>
        </div>
      </div>

      {/* Right Panel - Content */}
      <div 
        className="w-1/2 flex flex-col justify-center relative"
        style={{ backgroundColor: BRAND_COLORS.cream }}
      >
        {/* Top Badge */}
        <motion.div
          className="absolute top-16 left-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span 
            className="font-bold uppercase tracking-wider"
            style={{ 
              fontFamily: TYPOGRAPHY.accent,
              fontSize: TYPOGRAPHY.micro,
              color: BRAND_COLORS.gold
            }}
          >
            ✦ EXCLUSIVE BRIDAL COLLECTION
          </span>
        </motion.div>

        {/* Main Content */}
        <div className="px-16 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="mb-4">
              <span 
                className="block italic font-light"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: '72px',
                  color: BRAND_COLORS.darkMaroon,
                  lineHeight: '1.1'
                }}
              >
                Adorn Yourself
              </span>
              <span 
                className="block font-bold"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: '72px',
                  color: BRAND_COLORS.gold,
                  lineHeight: '1.1'
                }}
              >
                in Gold.
              </span>
              <span 
                className="block italic font-light"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: '40px',
                  color: BRAND_COLORS.maroon,
                  lineHeight: '1.2'
                }}
              >
                Rent the Royalty.
              </span>
            </h1>

            <motion.p
              className="max-w-md mb-12"
              style={{ 
                fontFamily: TYPOGRAPHY.body,
                fontSize: TYPOGRAPHY.large,
                color: '#555555'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Premium 22K gold, diamond & Kundan sets for your wedding.
              Rent for 1–7 days. Delivered fully insured to your door.
            </motion.p>
          </motion.div>

          {/* Function Selector */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <p 
              className="font-bold mb-4"
              style={{ 
                fontFamily: TYPOGRAPHY.accent,
                fontSize: TYPOGRAPHY.tiny,
                color: '#888888'
              }}
            >
              Browse by Function:
            </p>
            
            <div className="flex flex-wrap gap-3">
              {functions.map((func) => (
                <button
                  key={func.id}
                  onClick={() => setSelectedFunction(func.id)}
                  className="px-6 py-2 rounded-full transition-all duration-300"
                  style={{
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.small,
                    fontWeight: TYPOGRAPHY.bold,
                    ...(selectedFunction === func.id
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
                  {func.name}
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <button
              className="px-8 py-4 rounded-md font-bold transition-all hover:scale-105"
              style={{ 
                backgroundColor: BRAND_COLORS.maroon,
                color: BRAND_COLORS.cream,
                fontFamily: TYPOGRAPHY.accent,
                fontSize: TYPOGRAPHY.base
              }}
            >
              BROWSE WEDDING SETS
            </button>
            
            <button
              className="font-medium underline hover:no-underline transition-all"
              style={{ 
                color: BRAND_COLORS.gold,
                fontFamily: TYPOGRAPHY.accent,
                fontSize: TYPOGRAPHY.small
              }}
            >
              or Build Your Own Set →
            </button>
          </motion.div>
        </div>

        {/* Trust Strip */}
        <div className="absolute bottom-0 left-0 right-0 px-16 py-6 border-t">
          <div className="flex justify-center gap-8">
            {[
              { icon: '🔍', text: 'Fully Insured' },
              { icon: '🚚', text: 'Doorstep Delivery' },
              { icon: '✅', text: 'Certified Genuine' },
              { icon: '💰', text: 'Deposit Refunded' }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span>{item.icon}</span>
                <span 
                  className="font-medium"
                  style={{ 
                    fontFamily: TYPOGRAPHY.body,
                    fontSize: TYPOGRAPHY.small,
                    color: '#888888'
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;