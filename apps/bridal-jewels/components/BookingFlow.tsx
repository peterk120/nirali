'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BRAND_COLORS, TYPOGRAPHY, RADIUS } from '../lib/design-system';

const BookingFlow = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState('3');
  const [startDate, setStartDate] = useState('');
  const [deliveryType, setDeliveryType] = useState('courier');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const steps = [
    { id: 1, name: 'Select Duration', icon: '⏱️' },
    { id: 2, name: 'Delivery Details', icon: '🚚' },
    { id: 3, name: 'Summary', icon: '📋' },
    { id: 4, name: 'Payment', icon: '💳' }
  ];

  const durationOptions = [
    { days: '1', price: 2500 },
    { days: '3', price: 6500 },
    { days: '7', price: 14000 }
  ];

  const deliveryOptions = [
    {
      id: 'courier',
      name: 'Courier Delivery',
      price: 299,
      description: 'Insured BlueDart / DTDC delivery. 1-2 days.',
      icon: '📦'
    },
    {
      id: 'doorstep',
      name: 'Doorstep by Our Team',
      price: 499,
      description: 'Our staff delivers and collects personally.',
      icon: '👤'
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      price: 0,
      description: 'Pick up from our store. Address shown after booking.',
      icon: '🏪'
    }
  ];

  const mockJewellerySet = {
    name: 'Royal Kundan Bridal Set',
    pieces: ['Necklace', 'Jhumka Earrings', 'Maang Tikka', '2 Bangles'],
    image: '/images/bridal-set.jpg',
    rentalPrice: 2500,
    deposit: 15000,
    insurance: 180000
  };

  const calculateEndDate = () => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(start.getDate() + parseInt(selectedDuration));
    return end.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTotalPrice = () => {
    const rentalCost = durationOptions.find(d => d.days === selectedDuration)?.price || 0;
    const deliveryCost = deliveryOptions.find(d => d.id === deliveryType)?.price || 0;
    return rentalCost + deliveryCost;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 
                className="font-bold mb-2"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: TYPOGRAPHY.h4,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                Select Rental Duration
              </h2>
              <p style={{ color: '#888888' }}>
                Choose how long you'd like to rent the jewellery
              </p>
            </div>

            {/* Duration Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {durationOptions.map((option) => (
                <button
                  key={option.days}
                  onClick={() => setSelectedDuration(option.days)}
                  className={`p-6 rounded-lg border-2 transition-all text-center ${
                    selectedDuration === option.days ? 'border-gold shadow-lg' : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: BRAND_COLORS.cream,
                    borderColor: selectedDuration === option.days ? BRAND_COLORS.gold : 'transparent'
                  }}
                >
                  <div 
                    className="font-bold mb-2"
                    style={{ 
                      fontFamily: TYPOGRAPHY.accent,
                      fontSize: TYPOGRAPHY.h5,
                      color: BRAND_COLORS.darkMaroon
                    }}
                  >
                    {option.days} Day{option.days !== '1' ? 's' : ''}
                  </div>
                  <div 
                    className="font-bold"
                    style={{ 
                      fontFamily: TYPOGRAPHY.accent,
                      fontSize: TYPOGRAPHY.h6,
                      color: BRAND_COLORS.gold
                    }}
                  >
                    ₹{option.price.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>

            {/* Calendar */}
            <div>
              <h3 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.base,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                Select Start Date
              </h3>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-4 rounded-lg border"
                style={{ 
                  borderColor: BRAND_COLORS.border,
                  backgroundColor: BRAND_COLORS.cream
                }}
              />
            </div>

            {startDate && (
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: BRAND_COLORS.creamLight }}
              >
                <p className="font-medium" style={{ color: BRAND_COLORS.darkMaroon }}>
                  Return by: {calculateEndDate()}
                </p>
                <p className="text-sm mt-1" style={{ color: '#888888' }}>
                  Your jewellery is insured for ₹{mockJewellerySet.insurance.toLocaleString()} during the rental period
                </p>
              </div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 
                className="font-bold mb-2"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: TYPOGRAPHY.h4,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                Delivery Details
              </h2>
              <p style={{ color: '#888888' }}>
                How would you like to receive your jewellery?
              </p>
            </div>

            {/* Delivery Type Selector */}
            <div className="space-y-4">
              {deliveryOptions.map((option) => (
                <label 
                  key={option.id}
                  className={`block p-6 rounded-lg border-2 cursor-pointer transition-all ${
                    deliveryType === option.id ? 'border-gold shadow-lg' : 'border-transparent'
                  }`}
                  style={{
                    backgroundColor: BRAND_COLORS.cream,
                    borderColor: deliveryType === option.id ? BRAND_COLORS.gold : 'transparent'
                  }}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={option.id}
                    checked={deliveryType === option.id}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 
                          className="font-bold"
                          style={{ 
                            fontFamily: TYPOGRAPHY.accent,
                            fontSize: TYPOGRAPHY.base,
                            color: BRAND_COLORS.darkMaroon
                          }}
                        >
                          {option.name}
                        </h3>
                        <span 
                          className="font-bold"
                          style={{ 
                            fontFamily: TYPOGRAPHY.accent,
                            color: BRAND_COLORS.gold
                          }}
                        >
                          {option.price === 0 ? 'Free' : `₹${option.price}`}
                        </span>
                      </div>
                      <p 
                        className="mt-2"
                        style={{ 
                          fontFamily: TYPOGRAPHY.body,
                          color: '#888888'
                        }}
                      >
                        {option.description}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Address Form */}
            {deliveryType !== 'pickup' && (
              <div className="space-y-4">
                <h3 
                  className="font-bold"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.base,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Delivery Address
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={address.name}
                    onChange={(e) => setAddress({...address, name: e.target.value})}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: BRAND_COLORS.border,
                      backgroundColor: BRAND_COLORS.cream
                    }}
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={address.phone}
                    onChange={(e) => setAddress({...address, phone: e.target.value})}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: BRAND_COLORS.border,
                      backgroundColor: BRAND_COLORS.cream
                    }}
                  />
                </div>
                
                <textarea
                  placeholder="Full Address"
                  value={address.address}
                  onChange={(e) => setAddress({...address, address: e.target.value})}
                  rows={3}
                  className="w-full p-4 rounded-lg border"
                  style={{ 
                    borderColor: BRAND_COLORS.border,
                    backgroundColor: BRAND_COLORS.cream
                  }}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: BRAND_COLORS.border,
                      backgroundColor: BRAND_COLORS.cream
                    }}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: BRAND_COLORS.border,
                      backgroundColor: BRAND_COLORS.cream
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    onChange={(e) => setAddress({...address, pincode: e.target.value})}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: BRAND_COLORS.border,
                      backgroundColor: BRAND_COLORS.cream
                    }}
                  />
                </div>
              </div>
            )}

            {/* ID Proof Upload */}
            <div>
              <h3 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.base,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                ID Proof Verification
              </h3>
              <p className="mb-4" style={{ color: '#888888' }}>
                Upload any government ID for security verification
              </p>
              <button
                className="px-6 py-3 rounded-lg border font-medium"
                style={{ 
                  borderColor: BRAND_COLORS.gold,
                  color: BRAND_COLORS.gold,
                  backgroundColor: 'transparent'
                }}
              >
                Upload Aadhar/PAN
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div>
              <h2 
                className="font-bold mb-2"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: TYPOGRAPHY.h4,
                  color: BRAND_COLORS.darkMaroon
                }}
              >
                Rental Summary
              </h2>
              <p style={{ color: '#888888' }}>
                Review your booking details before payment
              </p>
            </div>

            {/* Jewellery Set */}
            <div className="flex items-center gap-6 p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.cream }}>
              <div 
                className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0"
                style={{ backgroundColor: BRAND_COLORS.creamLight }}
              >
                <img
                  src={mockJewellerySet.image}
                  alt={mockJewellerySet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 
                  className="font-bold mb-2"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.base,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  {mockJewellerySet.name}
                </h3>
                <p style={{ color: '#888888' }}>
                  {mockJewellerySet.pieces.join(' + ')}
                </p>
              </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 
                  className="font-bold mb-3 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Rental Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Duration:</span>
                    <span>{selectedDuration} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Start Date:</span>
                    <span>{startDate ? new Date(startDate).toLocaleDateString() : 'Not selected'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Return Date:</span>
                    <span>{calculateEndDate() || 'Not calculated'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Delivery Type:</span>
                    <span>{deliveryOptions.find(d => d.id === deliveryType)?.name}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 
                  className="font-bold mb-3 uppercase tracking-wider"
                  style={{ 
                    fontFamily: TYPOGRAPHY.accent,
                    fontSize: TYPOGRAPHY.tiny,
                    color: BRAND_COLORS.darkMaroon
                  }}
                >
                  Pricing Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Rental ({selectedDuration} days):</span>
                    <span>₹{durationOptions.find(d => d.days === selectedDuration)?.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Delivery:</span>
                    <span>₹{deliveryOptions.find(d => d.id === deliveryType)?.price.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: '#888888' }}>Security Deposit:</span>
                    <span>₹{mockJewellerySet.deposit.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Today's Payment:</span>
                      <span>₹{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold" style={{ color: BRAND_COLORS.gold }}>
                      <span>Total (including deposit):</span>
                      <span>₹{(getTotalPrice() + mockJewellerySet.deposit).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: BRAND_COLORS.creamLight }}
            >
              <p className="font-medium" style={{ color: BRAND_COLORS.darkMaroon }}>
                Security deposit refunded within 48hrs of safe return
              </p>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 text-center"
          >
            <div>
              <div className="text-6xl mb-6">🔍</div>
              <h2 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: TYPOGRAPHY.heading,
                  fontSize: TYPOGRAPHY.h3,
                  color: BRAND_COLORS.gold
                }}
              >
                Your Jewellery is Reserved!
              </h2>
              <p className="text-xl" style={{ color: BRAND_COLORS.darkMaroon }}>
                ₹{(getTotalPrice() + mockJewellerySet.deposit).toLocaleString()} today
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.cream }}>
                <div className="text-2xl mb-3">📅</div>
                <h3 className="font-bold mb-2" style={{ color: BRAND_COLORS.darkMaroon }}>Rental Period</h3>
                <p>{startDate ? new Date(startDate).toLocaleDateString() : 'Not set'} to {calculateEndDate() || 'Not set'}</p>
              </div>
              
              <div className="p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.cream }}>
                <div className="text-2xl mb-3">🚚</div>
                <h3 className="font-bold mb-2" style={{ color: BRAND_COLORS.darkMaroon }}>Delivery</h3>
                <p>{deliveryOptions.find(d => d.id === deliveryType)?.name || 'Not selected'}</p>
              </div>
              
              <div className="p-6 rounded-lg" style={{ backgroundColor: BRAND_COLORS.cream }}>
                <div className="text-2xl mb-3">⏰</div>
                <h3 className="font-bold mb-2" style={{ color: BRAND_COLORS.darkMaroon }}>Return Deadline</h3>
                <p>{calculateEndDate() || 'Not set'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <button
                className="w-full py-4 font-bold rounded-lg transition-all hover:scale-[1.02]"
                style={{ 
                  backgroundColor: BRAND_COLORS.gold,
                  color: BRAND_COLORS.cream,
                  fontFamily: TYPOGRAPHY.accent,
                  fontSize: TYPOGRAPHY.base
                }}
              >
                PROCEED TO PAYMENT
              </button>
              
              <div className="flex gap-4 justify-center">
                <button className="px-6 py-3 rounded-lg border font-medium" style={{ borderColor: BRAND_COLORS.gold, color: BRAND_COLORS.gold }}>
                  Add to Calendar
                </button>
                <button className="px-6 py-3 rounded-lg border font-medium" style={{ borderColor: BRAND_COLORS.gold, color: BRAND_COLORS.gold }}>
                  WhatsApp Confirmation
                </button>
                <button className="px-6 py-3 rounded-lg border font-medium" style={{ borderColor: BRAND_COLORS.gold, color: BRAND_COLORS.gold }}>
                  Track Delivery
                </button>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND_COLORS.cream }}>
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between relative">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold mb-2 transition-all ${
                    currentStep >= step.id ? 'text-white' : 'text-gray-400'
                  }`}
                  style={{
                    backgroundColor: currentStep >= step.id ? BRAND_COLORS.gold : BRAND_COLORS.cream,
                    border: currentStep >= step.id ? 'none' : `2px solid ${BRAND_COLORS.border}`
                  }}
                >
                  {currentStep > step.id ? '✓' : step.id}
                </div>
                <span 
                  className="text-sm font-medium text-center"
                  style={{ 
                    color: currentStep >= step.id ? BRAND_COLORS.darkMaroon : '#888888'
                  }}
                >
                  {step.name}
                </span>
              </div>
            ))}
            <div 
              className="absolute top-6 left-0 right-0 h-1 rounded-full"
              style={{ backgroundColor: BRAND_COLORS.cream }}
            />
            <div 
              className="absolute top-6 left-0 h-1 rounded-full transition-all"
              style={{ 
                backgroundColor: BRAND_COLORS.gold,
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg p-8 shadow-lg mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            style={{ 
              backgroundColor: BRAND_COLORS.cream,
              color: BRAND_COLORS.darkMaroon,
              border: `1px solid ${BRAND_COLORS.border}`
            }}
          >
            ← Previous
          </button>
          
          <button
            onClick={() => {
              if (currentStep < 4) {
                setCurrentStep(currentStep + 1);
              }
            }}
            disabled={currentStep === 4}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              currentStep === 4 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
            }`}
            style={{ 
              backgroundColor: currentStep === 4 ? BRAND_COLORS.maroon : BRAND_COLORS.gold,
              color: BRAND_COLORS.cream
            }}
          >
            {currentStep === 4 ? 'Complete Booking' : 'Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;