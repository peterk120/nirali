'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { useWishlistStore } from '../../lib/stores/wishlistStore';
import { showAddedToWishlist } from '../../lib/toast';

interface WishlistButtonProps {
  productId: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  productId, 
  name,
  image,
  price,
  category
}) => {
  const { isInWishlist, addItem, removeItem, items } = useWishlistStore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);
  
  const handleWishlistToggle = () => {
    if (!isLoggedIn) {
      // If not logged in, show login modal
      // In a real app, this would open a login modal
      alert('Please log in to add items to your wishlist');
      return;
    }
    
    if (isInWishlist(productId)) {
      // Remove from wishlist
      const itemToRemove = items.find(item => item.productId === productId);
      if (itemToRemove) {
        removeItem(itemToRemove.id);
      }
    } else {
      // Add to wishlist
      const newItem = {
        id: `wishlist-${Date.now()}`, // Generate a unique ID
        productId,
        name,
        image,
        price,
        category,
      };
      
      addItem(newItem);
      showAddedToWishlist(name);
    }
  };
  
  const isInList = isInWishlist(productId);
  
  return (
    <motion.button
      className={`p-2 rounded-full ${
        isInList 
          ? 'bg-brand-rose text-white' 
          : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white'
      }`}
      onClick={handleWishlistToggle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      animate={{
        scale: isInList && isHovered ? 1.1 : 1,
      }}
      transition={{ type: 'spring', stiffness: 500 }}
      aria-label={isInList ? "Remove from wishlist" : "Add to wishlist"}
    >
      <motion.div
        animate={{
          scale: isInList ? 1.2 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 10 }}
      >
        <Heart
          className={`w-5 h-5 ${
            isInList ? 'fill-current' : ''
          }`}
        />
      </motion.div>
    </motion.button>
  );
};