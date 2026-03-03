'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import { Button } from '../ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  stock: number;
  status: string;
  color?: string;
  size?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleDetails = () => {
    // Temporary: log the product ID since route doesn't exist yet
    console.log(`Navigate to product: ${product.id}`);
    // In the future, when route is created:
    // router.push(`/catalog/products/${product.id}`);
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    console.log(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist: ${product.name}`);
  };

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-md group relative"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden">
        {/* Main image */}
        <Image
          src={product.image}
          alt={product.name}
          fill
          className={`object-cover ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error('Image load error for product:', product.name, e);
            // Set fallback image
            e.currentTarget.src = '/placeholder-product.jpg';
          }}
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Category badge - top left */}
        <div className="absolute top-3 left-3 bg-brand-gold text-white text-xs font-medium px-2 py-1 rounded-full">
          {product.category}
        </div>
        
        {/* Wishlist heart - top right */}
        <motion.button
          className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white"
          onClick={(e) => {
            e.stopPropagation();
            handleWishlist();
          }}
          whileTap={{ scale: 1.4 }}
          transition={{ type: 'spring', stiffness: 500 }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-700'}`}
          />
        </motion.button>
        
        {/* Availability badge - bottom right */}
        <div className={`absolute bottom-3 right-3 text-white text-xs font-medium px-2 py-1 rounded-full ${
          product.status === 'Active' 
            ? 'bg-green-500' 
            : 'bg-gray-500'
        }`}>
          {product.status}
        </div>
      </div>
      
      {/* Content below image */}
      <div className="p-4">
        <h3 className="font-playfair text-lg font-medium truncate">{product.name}</h3>
        
        {/* Price */}
        <div className="mt-2">
          <p className="text-brand-rose font-medium">₹{product.price.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
        </div>
        
        {/* View Details button */}
        <Button 
          className="w-full mt-4 bg-brand-rose hover:bg-brand-rose/90 py-2"
          onClick={handleDetails}
        >
          View Details
        </Button>
      </div>
    </motion.div>
  );
};