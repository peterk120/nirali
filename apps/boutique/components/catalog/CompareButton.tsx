import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCompareStore } from '../../lib/stores/compareStore';
import { CheckSquare, Square } from 'lucide-react';

interface CompareButtonProps {
  dress: {
    id: string;
    name: string;
    category: string;
    images: string[];
    rentalPricePerDay: number;
    depositAmount: number;
    sizes: string[];
    isAvailable: boolean;
    rating: number;
    reviewCount: number;
    slug: string;
    tags: string[];
    description?: string;
    fabric?: string;
    weight?: string;
    embroidery?: string;
    colors?: string[];
  };
}

export const CompareButton: React.FC<CompareButtonProps> = ({ dress }) => {
  const { addToCompare, removeFromCompare, isInCompare, getMaxItemsReached } = useCompareStore();
  const [isChecked, setIsChecked] = useState(isInCompare(dress.id));
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (isInCompare(dress.id)) {
      removeFromCompare(dress.id);
      setIsChecked(false);
    } else if (!getMaxItemsReached()) {
      addToCompare(dress);
      setIsChecked(true);
      
      // Trigger animation
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const isDisabled = !isInCompare(dress.id) && getMaxItemsReached();

  return (
    <div className="relative group">
      {isDisabled && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-10">
          Maximum 3 items for comparison reached
        </div>
      )}
      <motion.button
        className={`flex items-center gap-1 text-xs ${
          isDisabled 
            ? 'text-gray-400 cursor-not-allowed' 
            : isChecked 
              ? 'text-brand-rose' 
              : 'text-gray-700'
        }`}
        onClick={handleToggle}
        disabled={isDisabled}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: isAnimating ? [1, 1.2, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        {isChecked ? (
          <CheckSquare className="w-4 h-4" />
        ) : (
          <Square className="w-4 h-4" />
        )}
        <span>Compare</span>
      </motion.button>
    </div>
  );
};