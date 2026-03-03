'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useCompareStore } from '../../../lib/stores/compareStore';
import { Button } from '../../../components/ui/button';
import { X, CheckCircle } from 'lucide-react';

export default function ComparePage() {
  const router = useRouter();
  const { items, removeFromCompare, clearAll } = useCompareStore();
  const [bestValues, setBestValues] = useState<Record<string, number>>({});

  // Determine best values for each attribute
  useEffect(() => {
    if (items.length === 0) return;

    const newBestValues: Record<string, number> = {};

    // Find best rental price (lowest)
    if (items.length > 0) {
      const lowestPrice = Math.min(...items.map(item => item.rentalPricePerDay));
      const lowestPriceIndex = items.findIndex(item => item.rentalPricePerDay === lowestPrice);
      newBestValues['rentalPricePerDay'] = lowestPriceIndex;
    }

    // Find best deposit (lowest)
    if (items.length > 0) {
      const lowestDeposit = Math.min(...items.map(item => item.depositAmount));
      const lowestDepositIndex = items.findIndex(item => item.depositAmount === lowestDeposit);
      newBestValues['depositAmount'] = lowestDepositIndex;
    }

    // Find best rating (highest)
    if (items.length > 0) {
      const highestRating = Math.max(...items.map(item => item.rating));
      const highestRatingIndex = items.findIndex(item => item.rating === highestRating);
      newBestValues['rating'] = highestRatingIndex;
    }

    // Find best review count (highest)
    if (items.length > 0) {
      const highestReviewCount = Math.max(...items.map(item => item.reviewCount));
      const highestReviewCountIndex = items.findIndex(item => item.reviewCount === highestReviewCount);
      newBestValues['reviewCount'] = highestReviewCountIndex;
    }

    setBestValues(newBestValues);
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <X className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Compare</h1>
          <p className="text-gray-600 mb-6">
            You haven't selected any dresses to compare. Go back to the catalog and select items to compare.
          </p>
          <Button onClick={() => router.push('/catalog/dresses')}>
            Browse Dresses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Compare Dresses</h1>
        <Button 
          variant="outline" 
          onClick={clearAll}
          className="text-red-600 hover:text-red-700"
        >
          Clear All
        </Button>
      </div>

      {/* Comparison Table - Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-200 p-4 text-left bg-gray-50 w-48">Attribute</th>
              {items.map((dress, index) => (
                <th key={dress.id} className="border border-gray-200 p-4 text-center bg-gray-50 min-w-64 relative">
                  <button
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
                    onClick={() => removeFromCompare(dress.id)}
                    aria-label={`Remove ${dress.name} from comparison`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 mb-2">
                      <Image
                        src={dress.images[0] || '/placeholder-dress.jpg'}
                        alt={dress.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 text-center">{dress.name}</h3>
                    <p className="text-sm text-gray-600">{dress.category}</p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Dress Name</td>
              {items.map((dress) => (
                <td key={`name-${dress.id}`} className="border border-gray-200 p-4 text-center">
                  {dress.name}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Category</td>
              {items.map((dress) => (
                <td key={`category-${dress.id}`} className="border border-gray-200 p-4 text-center">
                  {dress.category}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Price/Day</td>
              {items.map((dress, index) => (
                <td 
                  key={`price-${dress.id}`} 
                  className={`border border-gray-200 p-4 text-center ${
                    bestValues['rentalPricePerDay'] === index 
                      ? 'bg-green-100 font-semibold' 
                      : ''
                  }`}
                >
                  ₹{dress.rentalPricePerDay.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Deposit</td>
              {items.map((dress, index) => (
                <td 
                  key={`deposit-${dress.id}`} 
                  className={`border border-gray-200 p-4 text-center ${
                    bestValues['depositAmount'] === index 
                      ? 'bg-green-100 font-semibold' 
                      : ''
                  }`}
                >
                  ₹{dress.depositAmount.toLocaleString()}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Sizes</td>
              {items.map((dress) => (
                <td key={`sizes-${dress.id}`} className="border border-gray-200 p-4 text-center">
                  <div className="flex flex-wrap justify-center gap-1">
                    {dress.sizes.slice(0, 3).map((size, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                      >
                        {size}
                      </span>
                    ))}
                    {dress.sizes.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        +{dress.sizes.length - 3}
                      </span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Colors</td>
              {items.map((dress) => (
                <td key={`colors-${dress.id}`} className="border border-gray-200 p-4 text-center">
                  {dress.colors && dress.colors.length > 0 ? (
                    <div className="flex justify-center gap-2">
                      {dress.colors.slice(0, 3).map((color, idx) => {
                        const colorMap: Record<string, string> = {
                          red: 'bg-red-500',
                          blue: 'bg-blue-500',
                          green: 'bg-green-500',
                          pink: 'bg-pink-500',
                          purple: 'bg-purple-500',
                          gold: 'bg-yellow-600',
                          silver: 'bg-gray-400',
                          black: 'bg-black',
                          white: 'bg-white border border-gray-300',
                          navy: 'bg-blue-900',
                          maroon: 'bg-red-900',
                          orange: 'bg-orange-500',
                        };
                        
                        return (
                          <div 
                            key={idx}
                            className={`w-6 h-6 rounded-full ${colorMap[color.toLowerCase()] || 'bg-gray-300'}`}
                            title={color}
                          />
                        );
                      })}
                      {dress.colors.length > 3 && (
                        <span className="text-xs text-gray-600">+{dress.colors.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Fabric</td>
              {items.map((dress) => (
                <td key={`fabric-${dress.id}`} className="border border-gray-200 p-4 text-center">
                  {dress.fabric || '-'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Rating</td>
              {items.map((dress, index) => (
                <td 
                  key={`rating-${dress.id}`} 
                  className={`border border-gray-200 p-4 text-center ${
                    bestValues['rating'] === index 
                      ? 'bg-green-100 font-semibold' 
                      : ''
                  }`}
                >
                  {dress.rating.toFixed(1)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Reviews</td>
              {items.map((dress, index) => (
                <td 
                  key={`reviews-${dress.id}`} 
                  className={`border border-gray-200 p-4 text-center ${
                    bestValues['reviewCount'] === index 
                      ? 'bg-green-100 font-semibold' 
                      : ''
                  }`}
                >
                  {dress.reviewCount}
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Availability</td>
              {items.map((dress) => (
                <td key={`availability-${dress.id}`} className="border border-gray-200 p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    dress.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dress.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="border border-gray-200 p-4 font-medium bg-gray-50">Actions</td>
              {items.map((dress) => (
                <td key={`actions-${dress.id}`} className="border border-gray-200 p-4 text-center">
                  <Button className="w-full bg-brand-rose hover:bg-brand-rose/90">
                    Book Now
                  </Button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mobile Comparison - Horizontal Scroll */}
      <div className="md:hidden space-y-6">
        {items.map((dress, dressIndex) => (
          <motion.div
            key={dress.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dressIndex * 0.1 }}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-4 bg-gray-50 flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">{dress.name}</h3>
                <p className="text-sm text-gray-600">{dress.category}</p>
              </div>
              <button
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={() => removeFromCompare(dress.id)}
                aria-label={`Remove ${dress.name} from comparison`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex justify-center mb-4">
                <div className="w-32 h-32">
                  <Image
                    src={dress.images[0] || '/placeholder-dress.jpg'}
                    alt={dress.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Price/Day</span>
                  <span className={`font-medium ${
                    bestValues['rentalPricePerDay'] === dressIndex 
                      ? 'text-green-600 font-semibold' 
                      : 'text-brand-rose'
                  }`}>
                    ₹{dress.rentalPricePerDay.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Deposit</span>
                  <span className={`font-medium ${
                    bestValues['depositAmount'] === dressIndex 
                      ? 'text-green-600 font-semibold' 
                      : 'text-gray-900'
                  }`}>
                    ₹{dress.depositAmount.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Sizes</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {dress.sizes.slice(0, 3).map((size, idx) => (
                      <span 
                        key={idx} 
                        className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full ml-1"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Rating</span>
                  <span className={`font-medium ${
                    bestValues['rating'] === dressIndex 
                      ? 'text-green-600 font-semibold' 
                      : 'text-gray-900'
                  }`}>
                    {dress.rating.toFixed(1)}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Reviews</span>
                  <span className={`font-medium ${
                    bestValues['reviewCount'] === dressIndex 
                      ? 'text-green-600 font-semibold' 
                      : 'text-gray-900'
                  }`}>
                    {dress.reviewCount}
                  </span>
                </div>
                
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Availability</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    dress.isAvailable 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {dress.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
                
                <div className="pt-3">
                  <Button className="w-full bg-brand-rose hover:bg-brand-rose/90">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-8 flex justify-center">
          <Button 
            className="bg-brand-rose hover:bg-brand-rose/90"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            Back to Top
          </Button>
        </div>
      )}
    </div>
  );
}