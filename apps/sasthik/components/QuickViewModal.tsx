'use client';

import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Star, Heart, ArrowRight } from 'lucide-react';
import { useQuickViewStore } from '@/lib/stores/quickViewStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function QuickViewModal() {
  const { isOpen, product, closeQuickView, openQuickView } = useQuickViewStore();
  const { addItem: addToCart } = useCartStore();
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();

  if (!product) return null;

  const isWishlisted = wishlistItems.some(item => item.productId === (product.id || product._id));
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error('Product is out of stock');
      return;
    }
    addToCart({
      productId: product.id || product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image || '',
      rentalDays: 1
    });
    toast.success(`${product.name} added to cart!`);
    closeQuickView();
  };

  const handleWishlist = () => {
    const id = product.id || product._id;
    if (isWishlisted) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({
        id: `wish-${id}`,
        productId: id,
        name: product.name,
        price: product.price,
        image: product.image || '',
        category: product.category || 'Jewellery'
      });
      toast.success('Added to wishlist');
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeQuickView()}>
      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
              />
            </Dialog.Overlay>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 pointer-events-none">
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="bg-white w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-luxury relative flex flex-col md:flex-row max-h-[90vh] pointer-events-auto"
                >
                  <Dialog.Title className="sr-only">Quick View: {product.name}</Dialog.Title>
                  <Dialog.Description className="sr-only">
                    {product.description || `Quick view for ${product.name}`}
                  </Dialog.Description>

                  <Dialog.Close className="absolute top-6 right-6 z-50 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md text-gray-400 hover:text-brand-teal transition-colors">
                    <X size={20} />
                  </Dialog.Close>

                  {/* Left: Interactive Image Area */}
                  <div className="w-full md:w-1/2 bg-rose-light relative group h-[300px] md:h-auto overflow-hidden">
                     {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                        />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center font-heading text-6xl text-brand-teal/10 italic rotate-12">Sparkle</div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Right: Content Area */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        {product.isNew && (
                          <span className="bg-brand-rose-gold text-white text-[9px] uppercase tracking-[0.3em] px-3 py-1 rounded-sm font-bold">New Arrival</span>
                        )}
                        <span className="text-[10px] tracking-[0.2em] text-brand-rose-gold uppercase font-bold">{product.category || product.material || 'Jewellery'}</span>
                      </div>
                      <h2 className="font-heading text-4xl md:text-5xl text-brand-dark italic leading-tight">{product.name}</h2>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex text-brand-rose-gold">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} className={i < Math.floor(product.rating || 4.5) ? "fill-brand-rose-gold" : "text-gray-200"} />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400 font-body">({product.reviewCount || 12} Authentic Reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-heading text-brand-teal italic">₹{product.price.toLocaleString()}</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-lg text-gray-300 line-through font-body">₹{product.originalPrice.toLocaleString()}</span>
                      )}
                    </div>

                    <p className="font-body text-gray-500 text-sm leading-relaxed">
                      {product.description || "A masterpiece of craftsmanship, this piece captures the timeless elegance of luxury Indian jewellery. Perfect for moments that demand nothing but extraordinary sparkle."}
                    </p>

                    <div className="grid grid-cols-2 gap-4 py-4 border-y border-teal-light">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-brand-rose-gold font-bold">Material</span>
                        <span className="text-xs font-body text-brand-dark">{product.material || product.attributes?.metalType || 'Premium Finish'}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-widest text-brand-rose-gold font-bold">Collection</span>
                        <span className="text-xs font-body text-brand-dark">{product.style || product.brand || 'Heritage'}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                      <div className="flex gap-4">
                        <button 
                          onClick={handleAddToCart}
                          disabled={isOutOfStock}
                          className={cn(
                            "flex-grow py-5 rounded-xl font-body text-xs tracking-[0.2em] uppercase font-bold flex items-center justify-center gap-3 transition-all shadow-lg",
                            isOutOfStock 
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                              : "bg-brand-teal text-white hover:bg-brand-dark"
                          )}
                        >
                          <ShoppingBag size={18} /> {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                        </button>
                        <button 
                          onClick={handleWishlist}
                          className={cn(
                            "w-16 h-16 rounded-xl flex items-center justify-center border transition-all duration-300 hover:shadow-md",
                            isWishlisted 
                              ? "bg-brand-rose-gold border-brand-rose-gold text-white" 
                              : "bg-white border-teal-light text-gray-400 hover:text-brand-rose-gold hover:border-brand-rose-gold"
                          )}
                        >
                          <Heart size={20} className={isWishlisted ? "fill-white" : ""} />
                        </button>
                      </div>
                      
                      <Link 
                        href={`/product/${product.slug || (product.id || product._id)}` as any}
                        onClick={closeQuickView}
                        className="text-center font-body text-[10px] tracking-[0.3em] uppercase text-brand-rose-gold hover:text-brand-teal transition-colors py-2 flex items-center justify-center gap-2 group"
                      >
                        View Full Details <ArrowRight size={12} className="transition-transform group-hover:translate-x-2" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
