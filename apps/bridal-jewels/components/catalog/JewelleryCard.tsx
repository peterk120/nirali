'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@nirali-sai/ui';
import { showAddedToWishlist } from '../../lib/toast';

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

interface JewelleryCardProps {
  item: JewelleryItem;
  index?: number;
  isInWishlist: (id: string) => boolean;
  addToWishlist: (item: any) => void;
}

const JewelleryCard: React.FC<JewelleryCardProps> = ({ 
  item, 
  index = 0, 
  isInWishlist,
  addToWishlist
}) => {
  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      {/* Image */}
      <div className="relative">
        <div className="aspect-square bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center">
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
          onClick={() => {
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
          }}
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
          <span className="text-sm text-amber-600 font-medium">{item.type}</span>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">{item.rating}</span>
            <span className="text-xs text-gray-400">({item.reviewCount})</span>
          </div>
        </div>
        
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-amber-600">₹{item.price.toLocaleString()}</span>
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
        
        {/* Function Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {item.function.slice(0, 2).map(func => (
            <span 
              key={func} 
              className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full"
            >
              {func}
            </span>
          ))}
          {item.function.length > 2 && (
            <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">
              +{item.function.length - 2}
            </span>
          )}
        </div>
        
        <Button 
          className="w-full bg-amber-600 hover:bg-amber-700 flex items-center justify-center gap-2"
          disabled={!item.isAvailable}
        >
          <span>Rent for {item.rentalDuration} day{item.rentalDuration > 1 ? 's' : ''}</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default JewelleryCard;