import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCompareStore } from '../../lib/stores/compareStore';
import { Button } from '../ui/button';
import { X, Shuffle } from 'lucide-react';

export const CompareStickyBar = () => {
  const router = useRouter();
  const { items, clearAll, removeFromCompare } = useCompareStore();
  const [isVisible, setIsVisible] = useState(items.length > 0);

  useEffect(() => {
    setIsVisible(items.length > 0);
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40 p-4"
        >
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-900">Compare Products</h3>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearAll}
                  className="text-gray-700"
                >
                  Clear All
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => router.push('/compare')}
                  className="bg-brand-rose hover:bg-brand-rose/90"
                >
                  Compare Now
                </Button>
              </div>
            </div>
            
            <div className="flex gap-3 overflow-x-auto pb-2">
              {items.map((dress, index) => (
                <div 
                  key={dress.id} 
                  className="flex-shrink-0 w-20 h-24 relative group"
                >
                  <div className="absolute -top-2 -right-2 z-10">
                    <button
                      className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                      onClick={() => removeFromCompare(dress.id)}
                      aria-label={`Remove ${dress.name} from comparison`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="w-full h-full rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                      src={dress.images[0] || '/placeholder-dress.jpg'}
                      alt={dress.name}
                      width={80}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs text-center truncate px-1 py-0.5">
                    {dress.name.substring(0, 10)}...
                  </div>
                </div>
              ))}
              
              {/* Empty slots */}
              {Array.from({ length: 3 - items.length }).map((_, index) => (
                <div 
                  key={`empty-${index}`} 
                  className="flex-shrink-0 w-20 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
                >
                  <Shuffle className="w-6 h-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};