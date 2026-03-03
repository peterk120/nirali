'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useWishlistStore } from '../../../lib/stores/wishlistStore';
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
  material: string;
  weight?: string;
  tags: string[];
}

const JewelleryPage = () => {
  const [jewellery, setJewellery] = useState<JewelleryItem[]>([]);
  const [filteredJewellery, setFilteredJewellery] = useState<JewelleryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMaterial, setSelectedMaterial] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  // Mock data - in real app this would come from API
  useEffect(() => {
    const mockJewellery: JewelleryItem[] = [
      {
        id: 'j1',
        name: 'Traditional Gold Necklace Set',
        category: 'Necklaces',
        images: ['/jewellery/necklace1.jpg'],
        price: 45000,
        originalPrice: 50000,
        rating: 4.8,
        reviewCount: 127,
        isAvailable: true,
        material: '22K Gold',
        weight: '25.5g',
        tags: ['Traditional', 'Bridal', 'Gold']
      },
      {
        id: 'j2',
        name: 'Diamond Stud Earrings',
        category: 'Earrings',
        images: ['/jewellery/earrings1.jpg'],
        price: 18500,
        rating: 4.6,
        reviewCount: 89,
        isAvailable: true,
        material: '18K Gold + Diamond',
        weight: '3.2g',
        tags: ['Diamond', 'Studs', 'Elegant']
      },
      {
        id: 'j3',
        name: 'Kundan Maang Tikka',
        category: 'Maang Tikka',
        images: ['/jewellery/tikka1.jpg'],
        price: 12500,
        originalPrice: 15000,
        rating: 4.7,
        reviewCount: 156,
        isAvailable: true,
        material: 'Silver + Kundan',
        weight: '18.7g',
        tags: ['Kundan', 'Traditional', 'Bridal']
      },
      {
        id: 'j4',
        name: 'Pearl Drop Earrings',
        category: 'Earrings',
        images: ['/jewellery/earrings2.jpg'],
        price: 8900,
        rating: 4.4,
        reviewCount: 67,
        isAvailable: true,
        material: 'Silver + Pearl',
        weight: '5.1g',
        tags: ['Pearl', 'Drop', 'Classic']
      },
      {
        id: 'j5',
        name: 'Temple Gold Bangles',
        category: 'Bangles',
        images: ['/jewellery/bangles1.jpg'],
        price: 32000,
        originalPrice: 38000,
        rating: 4.9,
        reviewCount: 203,
        isAvailable: true,
        material: '22K Gold',
        weight: '42.3g',
        tags: ['Temple', 'Gold', 'Traditional']
      },
      {
        id: 'j6',
        name: 'Silver Oxidized Ring Set',
        category: 'Rings',
        images: ['/jewellery/rings1.jpg'],
        price: 4500,
        rating: 4.2,
        reviewCount: 45,
        isAvailable: true,
        material: 'Silver Oxidized',
        weight: '12.8g',
        tags: ['Silver', 'Oxidized', 'Modern']
      }
    ];
    
    setJewellery(mockJewellery);
    setFilteredJewellery(mockJewellery);
  }, []);

  // Filter and search logic
  useEffect(() => {
    let result = [...jewellery];
    
    // Search filter
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.material.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Material filter
    if (selectedMaterial !== 'all') {
      result = result.filter(item => item.material.includes(selectedMaterial));
    }
    
    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Featured - keep original order
        break;
    }
    
    setFilteredJewellery(result);
  }, [jewellery, searchQuery, selectedCategory, selectedMaterial, sortBy]);

  const categories = ['all', 'Necklaces', 'Earrings', 'Maang Tikka', 'Bangles', 'Rings'];
  const materials = ['all', 'Gold', 'Silver', 'Diamond', 'Pearl', 'Kundan'];

  const handleAddToWishlist = (item: JewelleryItem) => {
    const wishlistItem = {
      id: item.id,
      productId: item.id,
      name: item.name,
      image: item.images[0],
      price: item.price,
      category: item.category,
    };
    
    addToWishlist(wishlistItem);
    showAddedToWishlist(item.name);
  };

  return (
    <div className="min-h-screen bg-brand-ivory">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-brand-rose/10 to-brand-gold/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-brand-rose font-heading mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Exquisite Jewellery Collection
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-700 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Discover our curated collection of traditional and contemporary jewellery pieces, 
            crafted with the finest materials and attention to detail.
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jewellery..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
                />
              </div>
            </div>
            
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            
            {/* Material Filter */}
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
            >
              {materials.map(material => (
                <option key={material} value={material}>
                  {material === 'all' ? 'All Materials' : material}
                </option>
              ))}
            </select>
            
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredJewellery.length} of {jewellery.length} jewellery pieces
          </p>
        </div>

        {/* Jewellery Grid */}
        {filteredJewellery.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Filter className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No jewellery found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <Button 
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedMaterial('all');
              }}
              className="bg-brand-rose hover:bg-brand-rose/90"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredJewellery.map((item, index) => (
              <motion.div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Image */}
                <div className="relative">
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img
                      src={item.images[0] || '/placeholder-jewellery.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-jewellery.jpg';
                      }}
                    />
                  </div>
                  
                  {/* Wishlist Button */}
                  <button
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isInWishlist(item.id)
                        ? 'bg-red-500/80 text-white'
                        : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                    }`}
                    onClick={() => handleAddToWishlist(item)}
                    aria-label={isInWishlist(item.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(item.id) ? 'fill-current' : ''}`} />
                  </button>
                  
                  {/* Discount Badge */}
                  {item.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                      {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-brand-gold font-medium">{item.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{item.rating}</span>
                      <span className="text-xs text-gray-400">({item.reviewCount})</span>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
                  
                  <p className="text-sm text-gray-600 mb-3">{item.material}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xl font-bold text-brand-rose">₹{item.price.toLocaleString()}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-500 line-through ml-2">₹{item.originalPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.isAvailable 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {item.isAvailable ? 'Available' : 'Out of Stock'}
                    </span>
                  </div>
                  
                  <Button 
                    className="w-full bg-brand-rose hover:bg-brand-rose/90 flex items-center justify-center gap-2"
                    disabled={!item.isAvailable}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JewelleryPage;