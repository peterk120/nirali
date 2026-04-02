'use client';

import { useEffect } from 'react';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useCartStore } from '@/lib/stores/cartStore';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    fetchWishlist();
    fetchCart();
  }, [fetchWishlist, fetchCart]);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      <main className="flex-grow pt-32 pb-24">
        <div className="container mx-auto px-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-teal-light pb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-brand-rose-gold text-[10px] font-bold tracking-[0.3em] uppercase">
                <Sparkles size={14} /> My Private Collection
              </div>
              <h1 className="font-heading text-6xl md:text-7xl text-brand-dark italic leading-none">
                Your <span className="text-brand-teal">Wishlist</span>
              </h1>
              <p className="font-body text-gray-500 max-w-md text-sm leading-relaxed mt-2">
                A curated selection of your most desired pieces. Take your time to decide on the perfect sparkle for your next extraordinary moment.
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-[11px] font-bold tracking-widest uppercase">
              <span className="text-gray-400">{wishlistItems.length} Treasures Saved</span>
            </div>
          </div>

          {/* Grid Section */}
          <AnimatePresence mode="wait">
            {wishlistItems.length > 0 ? (
              <motion.div 
                key="grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16"
              >
                {wishlistItems.map((item, index) => (
                  <motion.div
                    key={item.productId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard
                      id={item.productId}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                      category={item.category}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="w-24 h-24 bg-rose-light rounded-full flex items-center justify-center mb-8 text-brand-rose-gold relative">
                  <Heart size={40} className="relative z-10" />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    className="absolute inset-0 bg-brand-rose-gold/10 rounded-full"
                  />
                </div>
                <h2 className="font-heading text-4xl text-brand-dark italic mb-4">Your collection is empty</h2>
                <p className="font-body text-gray-400 max-w-xs mb-10 text-sm leading-relaxed">
                  Every masterpiece begins with a single choice. Explore our collection and save your favorites here.
                </p>
                <Link 
                  href={"/products" as any} 
                  className="bg-brand-teal text-white px-12 py-5 rounded-xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-brand-dark transition-all shadow-xl flex items-center gap-3 group"
                >
                  Explore Collection <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
