'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Minus, Plus, Heart } from 'lucide-react';
import { Button } from '@nirali-sai/ui';
import JewelleryCard from '../../../components/catalog/JewelleryCard';
import { showAddedToWishlist } from '../../../lib/toast';

interface JewelleryItem {
  id: string;
  name: string;
  category: string;
  images: string[];
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  function: string[];
  type: string;
  metal: string;
  weight: number; // in grams
  karat?: string;
  rentalDuration: number; // in days
  tags: string[];
  description?: string;
  includedItems?: string[];
}

const JewelleryCatalog = () => {
  const [jewellery, setJewellery] = useState<JewelleryItem[]>([]);
  const [filteredJewellery, setFilteredJewellery] = useState<JewelleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedMetals, setSelectedMetals] = useState<string[]>([]);
  const [weightRange, setWeightRange] = useState<[number, number]>([0, 100]);
  const [selectedKarat, setSelectedKarat] = useState<string[]>([]);
  const [rentalDuration, setRentalDuration] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  // Mock wishlist functionality since we don't have the store in this app
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  
  const isInWishlist = (id: string) => wishlistIds.includes(id);
  
  const addToWishlist = (item: any) => {
    if (!wishlistIds.includes(item.id)) {
      setWishlistIds([...wishlistIds, item.id]);
    }
  };

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockJewellery: JewelleryItem[] = [
      {
        id: 'j1',
        name: 'Royal Gold Necklace Set',
        category: 'Necklace Set',
        images: ['/jewellery/necklace1.jpg'],
        price: 15000,
        originalPrice: 18000,
        rating: 4.8,
        reviewCount: 127,
        isAvailable: true,
        function: ['Wedding Day', 'Reception'],
        type: 'Necklace Set',
        metal: 'Gold',
        weight: 45.2,
        karat: '22K',
        rentalDuration: 3,
        tags: ['Traditional', 'Bridal', 'Heavy'],
        description: 'Exquisite gold necklace set with intricate designs perfect for wedding ceremonies.',
        includedItems: ['Necklace', 'Chain', 'Pendant']
      },
      {
        id: 'j2',
        name: 'Kundan Earrings',
        category: 'Earrings',
        images: ['/jewellery/earrings1.jpg'],
        price: 8500,
        rating: 4.6,
        reviewCount: 89,
        isAvailable: true,
        function: ['Sangeet', 'Mehendi'],
        type: 'Earrings',
        metal: 'Kundan',
        weight: 12.5,
        rentalDuration: 1,
        tags: ['Kundan', 'Light', 'Designer'],
        description: 'Beautiful kundan earrings with traditional motifs.',
        includedItems: ['Earrings']
      },
      {
        id: 'j3',
        name: 'Diamond Maang Tikka',
        category: 'Maang Tikka',
        images: ['/jewellery/tikka1.jpg'],
        price: 12000,
        originalPrice: 15000,
        rating: 4.7,
        reviewCount: 156,
        isAvailable: true,
        function: ['Wedding Day', 'Reception'],
        type: 'Maang Tikka',
        metal: 'Diamond',
        weight: 8.7,
        karat: '18K',
        rentalDuration: 3,
        tags: ['Diamond', 'Elegant', 'Heavy'],
        description: 'Stunning diamond maang tikka for the perfect bridal look.',
        includedItems: ['Maang Tikka', 'Chain']
      },
      {
        id: 'j4',
        name: 'Polki Bangles Set',
        category: 'Bangles',
        images: ['/jewellery/bangles1.jpg'],
        price: 18000,
        rating: 4.9,
        reviewCount: 203,
        isAvailable: true,
        function: ['Engagement', 'Wedding Day'],
        type: 'Bangles',
        metal: 'Polki',
        weight: 65.3,
        karat: '22K',
        rentalDuration: 7,
        tags: ['Polki', 'Heavy', 'Traditional'],
        description: 'Royal polki bangles set with authentic Mughal designs.',
        includedItems: ['Bangles Set', 'Matching Bracelet']
      },
      {
        id: 'j5',
        name: 'Silver Oxidized Set',
        category: 'Full Set',
        images: ['/jewellery/set1.jpg'],
        price: 25000,
        originalPrice: 30000,
        rating: 4.5,
        reviewCount: 98,
        isAvailable: true,
        function: ['Sangeet', 'Mehendi', 'Reception'],
        type: 'Full Set',
        metal: 'Silver',
        weight: 89.2,
        rentalDuration: 7,
        tags: ['Silver', 'Oxidized', 'Light'],
        description: 'Complete oxidized silver set for multiple functions.',
        includedItems: ['Necklace', 'Earrings', 'Maang Tikka', 'Bangles', 'Armlets']
      },
      {
        id: 'j6',
        name: 'Pearl Drop Earrings',
        category: 'Earrings',
        images: ['/jewellery/earrings2.jpg'],
        price: 6500,
        rating: 4.3,
        reviewCount: 67,
        isAvailable: true,
        function: ['Reception', 'Engagement'],
        type: 'Earrings',
        metal: 'Silver',
        weight: 5.1,
        rentalDuration: 1,
        tags: ['Pearl', 'Light', 'Classic'],
        description: 'Elegant pearl drop earrings for subtle elegance.',
        includedItems: ['Earrings']
      },
      {
        id: 'j7',
        name: 'Temple Gold Bangles',
        category: 'Bangles',
        images: ['/jewellery/bangles2.jpg'],
        price: 22000,
        originalPrice: 25000,
        rating: 4.8,
        reviewCount: 145,
        isAvailable: true,
        function: ['Engagement', 'Wedding Day'],
        type: 'Bangles',
        metal: 'Gold',
        weight: 42.8,
        karat: '22K',
        rentalDuration: 3,
        tags: ['Temple', 'Gold', 'Traditional'],
        description: 'Intricately designed temple-style gold bangles.',
        includedItems: ['Bangles Set']
      },
      {
        id: 'j8',
        name: 'Ruby Studded Tikka',
        category: 'Maang Tikka',
        images: ['/jewellery/tikka2.jpg'],
        price: 16500,
        rating: 4.6,
        reviewCount: 78,
        isAvailable: true,
        function: ['Wedding Day', 'Reception'],
        type: 'Maang Tikka',
        metal: 'Gold',
        weight: 11.3,
        karat: '18K',
        rentalDuration: 3,
        tags: ['Ruby', 'Heavy', 'Designer'],
        description: 'Exquisite ruby-studded maang tikka with gold accents.',
        includedItems: ['Maang Tikka', 'Chain']
      }
    ];
    
    setJewellery(mockJewellery);
    setFilteredJewellery(mockJewellery);
    setIsLoading(false);
  }, []);

  // Filter jewellery based on selected filters
  useEffect(() => {
    let result = [...jewellery];
    
    // Function filter
    if (selectedFunction) {
      result = result.filter(item => item.function.includes(selectedFunction));
    }
    
    // Type filter
    if (selectedTypes.length > 0) {
      result = result.filter(item => selectedTypes.includes(item.type));
    }
    
    // Metal filter
    if (selectedMetals.length > 0) {
      result = result.filter(item => selectedMetals.includes(item.metal));
    }
    
    // Weight filter
    result = result.filter(item => 
      item.weight >= weightRange[0] && item.weight <= weightRange[1]
    );
    
    // Karat filter
    if (selectedKarat.length > 0) {
      result = result.filter(item => 
        item.karat && selectedKarat.includes(item.karat)
      );
    }
    
    // Rental duration filter
    if (rentalDuration) {
      result = result.filter(item => item.rentalDuration === rentalDuration);
    }
    
    // Price filter
    result = result.filter(item => 
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );
    
    setFilteredJewellery(result);
  }, [jewellery, selectedFunction, selectedTypes, selectedMetals, weightRange, selectedKarat, rentalDuration, priceRange]);

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const toggleMetalFilter = (metal: string) => {
    setSelectedMetals(prev => 
      prev.includes(metal) 
        ? prev.filter(m => m !== metal) 
        : [...prev, metal]
    );
  };

  const toggleKaratFilter = (karat: string) => {
    setSelectedKarat(prev => 
      prev.includes(karat) 
        ? prev.filter(k => k !== karat) 
        : [...prev, karat]
    );
  };

  const resetFilters = () => {
    setSelectedFunction(null);
    setSelectedTypes([]);
    setSelectedMetals([]);
    setWeightRange([0, 100]);
    setSelectedKarat([]);
    setRentalDuration(null);
    setPriceRange([0, 50000]);
  };

  const functionTabs = ['Mehendi', 'Sangeet', 'Wedding Day', 'Reception', 'Engagement'];
  const types = ['Necklace Set', 'Earrings', 'Maang Tikka', 'Bangles', 'Full Set'];
  const metals = ['Gold', 'Kundan', 'Diamond', 'Polki', 'Silver'];
  const karats = ['18K', '22K', '24K'];
  const durations = [1, 3, 7];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      {/* Function Tabs */}
      <div className="sticky top-16 z-40 bg-amber-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
            {functionTabs.map(tab => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full whitespace-nowrap flex-shrink-0 ${
                  selectedFunction === tab
                    ? 'bg-amber-600 text-white'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
                onClick={() => setSelectedFunction(selectedFunction === tab ? null : tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Featured Banner */}
        <div className="mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-amber-500 to-amber-700 text-white p-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Complete Bridal Set for Wedding Day</h2>
            <p className="text-lg mb-6 opacity-90">
              Curated collection of necklace, earrings, maang tikka, and bangles designed to complement each other perfectly for your special day.
            </p>
            <div className="flex flex-wrap gap-4 mb-6">
              {['Necklace', 'Earrings', 'Maang Tikka', 'Bangles'].map((item, index) => (
                <div key={index} className="bg-amber-600/30 px-3 py-1 rounded-full text-sm">
                  {item}
                </div>
              ))}
            </div>
            <Button className="bg-white text-amber-700 hover:bg-amber-50 text-lg font-bold px-8 py-4">
              Rent the Complete Set - ₹45,000
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-80 flex-shrink-0`}>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Filters</h3>
                <button 
                  onClick={resetFilters}
                  className="text-amber-600 hover:text-amber-700 text-sm font-medium"
                >
                  Reset
                </button>
              </div>

              {/* Type Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Type</h4>
                <div className="space-y-2">
                  {types.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleTypeFilter(type)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metal Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Metal</h4>
                <div className="space-y-2">
                  {metals.map(metal => (
                    <label key={metal} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedMetals.includes(metal)}
                        onChange={() => toggleMetalFilter(metal)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-gray-700">{metal}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Karat Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Karat</h4>
                <div className="space-y-2">
                  {karats.map(karat => (
                    <label key={karat} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedKarat.includes(karat)}
                        onChange={() => toggleKaratFilter(karat)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-gray-700">{karat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Weight Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Weight Range: {weightRange[0]}g - {weightRange[1]}g
                </h4>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={weightRange[1]}
                  onChange={(e) => setWeightRange([weightRange[0], parseInt(e.target.value)])}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0g</span>
                  <span>100g</span>
                </div>
              </div>

              {/* Rental Duration */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Rental Duration</h4>
                <div className="space-y-2">
                  {durations.map(duration => (
                    <label key={duration} className="flex items-center">
                      <input
                        type="radio"
                        name="rentalDuration"
                        checked={rentalDuration === duration}
                        onChange={() => setRentalDuration(rentalDuration === duration ? null : duration)}
                        className="rounded-full border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-gray-700">{duration} day{duration > 1 ? 's' : ''}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Price Range: ₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()}
                </h4>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-amber-600"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>₹0</span>
                  <span>₹50,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-grow">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
              >
                <span className="font-medium text-gray-900">Filters</span>
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Results Info */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing {filteredJewellery.length} of {jewellery.length} jewellery pieces
              </p>
            </div>

            {/* Jewellery Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJewellery.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-6">
                  <Filter className="w-12 h-12 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No jewellery found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
                <Button 
                  onClick={resetFilters}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredJewellery.map((item, index) => (
                  <JewelleryCard
                    key={item.id}
                    item={item}
                    index={index}
                    isInWishlist={isInWishlist}
                    addToWishlist={addToWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelleryCatalog;