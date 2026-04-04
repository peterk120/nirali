'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useQuickViewStore } from '@/lib/stores/quickViewStore';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  isNew?: boolean;
  material?: string;
  category?: string;
  description?: string;
  stock?: number;
  style?: string;
  image?: string;
  slug?: string;
}

export default function ProductCard({
  id, _id, name, price, originalPrice, rating = 4.5, reviewCount = 0, isNew, material, category, description, stock, style, image, slug
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const { openQuickView } = useQuickViewStore();

  const productId = id || _id || '';
  const isWishlisted = wishlistItems.some(item => item.productId === productId);
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
  const isOutOfStock = stock !== undefined && stock <= 0;

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({ 
        id: `wish-${productId}`, 
        productId: productId, 
        name, 
        price, 
        image: image || '', 
        category: category || material || 'Jewellery' 
      });
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart({ 
      productId: productId, 
      name, 
      price, 
      quantity: 1, 
      image: image || '', 
      rentalDays: 1 
    });
    toast.success(`${name} added to cart!`);
  };

  return (
    <motion.div 
      className="group relative bg-white border border-teal-light rounded-xl overflow-hidden hover:shadow-luxury transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Area */}
      <div className="aspect-square relative overflow-hidden bg-rose-light">
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isNew && (
            <span className="bg-brand-rose-gold text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-bold">New</span>
          )}
          {discount > 0 && (
            <span className="bg-brand-teal text-white text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-sm font-bold">{discount}% OFF</span>
          )}
        </div>

        {/* Action Icons Area */}
        <div className="absolute top-3 right-3 flex flex-col gap-3 z-20">
          <button 
            onClick={handleWishlist}
            className={`w-11 h-11 md:w-9 md:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
              isWishlisted ? 'bg-brand-rose-gold text-white shadow-md' : 'bg-white/80 text-gray-400 hover:text-brand-rose-gold hover:bg-white'
            }`}
          >
            <Heart size={18} className={isWishlisted ? "fill-white" : ""} />
          </button>

          {/* Persistent Quick View Icon for Mobile & Desktop */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView({
                id: productId,
                _id: productId,
                name,
                price,
                originalPrice,
                rating,
                reviewCount,
                isNew,
                material,
                category,
                description,
                stock,
                style,
                image,
                slug
              });
            }}
            className="w-11 h-11 md:w-9 md:h-9 rounded-full bg-white/80 text-gray-400 hover:text-brand-teal hover:bg-white flex items-center justify-center transition-all duration-300 shadow-sm"
          >
            <Eye size={18} />
          </button>
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openQuickView({
              id: productId, _id: productId, name, price, originalPrice, 
              rating, reviewCount, isNew, material, category, description, 
              stock, style, image, slug
            });
          }}
          className={`hidden md:flex absolute inset-x-4 bottom-4 bg-white/95 backdrop-blur-sm border border-brand-teal/20 text-brand-teal min-h-[44px] py-3 rounded-xl font-body text-[11px] tracking-widest uppercase items-center justify-center gap-2 z-[30] hover:bg-brand-teal hover:text-white transition-all duration-300 shadow-lg cursor-pointer ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <Eye size={16} /> Quick View
        </button>

        {/* Main Image */}
        <div className={`w-full h-full relative overflow-hidden transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}>
          {image ? (
            <Image 
              src={image} 
              alt={name} 
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover"
              priority={isNew} // Priority for new products (likely top of fold)
            />
          ) : (
            <div className="w-full h-full bg-brand-teal/5 flex items-center justify-center">
              <span className="font-heading text-4xl text-brand-teal/20 rotate-45 italic">Sparkle</span>
            </div>
          )}
        </div>
      </div>

      {/* Info Area */}
      <div className="p-4 md:p-5 flex flex-col gap-2 relative text-left">
        {/* Chips & Stock */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex gap-2">
            {(category || material) && (
              <span className="px-2 py-0.5 bg-teal-medium text-brand-teal text-[9px] font-bold tracking-widest uppercase rounded-sm">
                {category || material}
              </span>
            )}
            {style && (
              <span className="px-2 py-0.5 bg-rose-medium text-brand-rose-gold text-[9px] font-bold tracking-widest uppercase rounded-sm">
                {style}
              </span>
            )}
          </div>
          
          {stock !== undefined && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
              isOutOfStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              {isOutOfStock ? 'OUT OF STOCK' : 'IN STOCK'}
            </span>
          )}
        </div>

        <Link href={`/product/${slug || productId}` as any} className="block">
          <h3 className="font-body text-[14px] text-brand-dark font-medium line-clamp-1 group-hover:text-brand-teal transition-colors">
            {name}
          </h3>
        </Link>
        
        {description && (
          <p className="text-[11px] text-gray-500 font-body line-clamp-2 min-h-[32px]">
            {description}
          </p>
        )}

        <div className="flex items-center gap-1">
          <div className="flex text-brand-rose-gold">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className={i < Math.floor(rating || 4.5) ? "fill-brand-rose-gold" : "text-gray-200"} />
            ))}
          </div>
          <span className="text-[10px] text-gray-400 font-body">({reviewCount})</span>
        </div>

        <div className="flex items-end justify-between mt-2">
          <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-brand-teal leading-none">₹{price.toLocaleString()}</span>
            {originalPrice && originalPrice > price && (
              <span className="text-xs text-gray-400 line-through mb-0.5">₹{originalPrice.toLocaleString()}</span>
            )}
          </div>
          
          {stock !== undefined && stock > 0 && stock <= 5 && (
            <span className="text-[10px] text-brand-rose-gold font-medium italic">
              Only {stock} left!
            </span>
          )}
        </div>

        {/* Add to Cart button */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`mt-4 w-full py-3 rounded-lg font-body text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 transition-colors shadow-sm ${
            isOutOfStock 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-brand-teal text-white hover:bg-brand-rose-gold'
          }`}
        >
          <ShoppingBag size={14} /> {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
