'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ShoppingCart,
  Calendar,
  Users,
  Sparkles
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { showSuccess, showError } from '../../../../../lib/toast';

interface DressDetailClientProps {
  product: any;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export const DressDetailClient: React.FC<DressDetailClientProps> = ({ product, searchParams }) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  // Initialize wishlist state from localStorage or API
  useEffect(() => {
    const checkWishlist = () => {
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setIsWishlisted(wishlist.includes(product._id || product.id));
      } catch (error) {
        console.error('Error checking wishlist:', error);
      }
    };

    checkWishlist();
  }, [product]);

  const handleWishlist = async () => {
    try {
      const newWishlistedState = !isWishlisted;
      setIsWishlisted(newWishlistedState);

      // Update localStorage
      try {
        const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (newWishlistedState) {
          wishlist.push(product._id || product.id);
          showSuccess('Added to wishlist');
        } else {
          const index = wishlist.indexOf(product._id || product.id);
          if (index > -1) wishlist.splice(index, 1);
          showSuccess('Removed from wishlist');
        }
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
      } catch (error) {
        console.error('Error updating wishlist:', error);
      }
    } catch (error) {
      console.error('Error handling wishlist:', error);
      setIsWishlisted(isWishlisted); // Revert state on error
      showError('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this beautiful dress: ${product.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showSuccess('Link copied to clipboard');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      showError('Failed to share');
    }
  };

  const handleRentNow = () => {
    router.push(`/book/dress?dressId=${product._id || product.id}`);
  };

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const { useCartStore } = await import('../../../../../lib/stores/cartStore');
      await useCartStore.getState().addItem({
        productId: product._id || product.id,
        quantity: quantity,
        rentalDays: parseInt(searchParams.days as string) || 3,
        size: product.size || 'Medium',
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category
      });
      showSuccess('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showError('Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-rose mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={product.image || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-product.jpg';
                  }}
                />
              </div>

              {/* Thumbnails */}
              {product.image && (
                <div className="flex gap-2">
                  <button
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === 0 ? 'border-brand-rose' : 'border-gray-200'
                      }`}
                    onClick={() => setSelectedImage(0)}
                  >
                    <img
                      src={product.image}
                      alt={`${product.name} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-brand-gold/10 text-brand-gold rounded-full mb-3">
                  {product.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-gray-600">{product.description || 'Beautiful dress for your special occasion'}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-brand-rose">₹{product.price?.toLocaleString()}</span>
                <span className="text-lg text-gray-500">per day</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">(4.0 • 128 reviews)</span>
              </div>

              {/* Size Selection */}
              {product.size && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Size</h3>
                  <div className="flex gap-2">
                    <span className="px-4 py-2 bg-brand-rose text-white rounded-lg font-medium">
                      {product.size}
                    </span>
                  </div>
                </div>
              )}

              {/* Color */}
              {product.color && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Color</h3>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: product.color }}
                    />
                    <span className="text-gray-600 capitalize">{product.color}</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-brand-rose hover:bg-brand-rose/90 py-3 text-base font-medium"
                  onClick={handleRentNow}
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Rent Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 border-brand-rose text-brand-rose hover:bg-brand-rose/10 py-3 text-base font-medium"
                  onClick={handleAddToCart}
                  disabled={loading}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {loading ? 'Adding...' : 'Add to Cart'}
                </Button>
              </div>

              {/* Wishlist and Share */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className={`flex-1 ${isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  onClick={handleWishlist}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-brand-rose" />
                  <div>
                    <p className="font-medium text-gray-900">Free Delivery</p>
                    <p className="text-sm text-gray-600">Within 2 days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-brand-rose" />
                  <div>
                    <p className="font-medium text-gray-900">Quality Assured</p>
                    <p className="text-sm text-gray-600">100% authentic</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="w-6 h-6 text-brand-rose" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-600">7-day window</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Additional Info Section */}
        <motion.div
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600">
                {product.description || 'This elegant dress is perfect for weddings, parties, and special occasions. Made with premium quality materials and designed to make you feel confident and beautiful.'}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Care Instructions</h3>
              <ul className="text-gray-600 space-y-2">
                <li>• Dry clean only</li>
                <li>• Store in a cool, dry place</li>
                <li>• Handle with care</li>
                <li>• Professional pressing recommended</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};