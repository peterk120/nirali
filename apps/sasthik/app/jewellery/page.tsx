'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '@/lib/api';

const filters = [
  { name: 'Category', options: ['Earrings', 'Necklaces', 'Bangles', 'Rings', 'Hair Accessories', 'Bridal'] },
  { name: 'Price', options: ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹2000', 'Over ₹2000'] },
  { name: 'Material', options: ['Kundan', 'Oxidised', 'Brass', 'CZ / American Diamond', 'Pearl'] },
];

export default function AllProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // getProducts without category filter fetches all jewellery for the store
        const response = await getProducts();
        if (response.success && response.data) {
          const allProducts = Array.isArray(response.data) ? response.data : (response.data as any).data || [];
          setProducts(allProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-teal-light/30 border-b border-teal-light py-4">
        <div className="container mx-auto px-6 text-[11px] font-body text-gray-500 tracking-widest uppercase flex gap-2">
          <span>Home</span> / <span className="text-brand-teal font-bold text-black opacity-80">Full Collection</span>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-12">
          
          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden md:block w-64 shrink-0">
            <h2 className="font-heading text-2xl text-brand-dark mb-8 border-b border-teal-light pb-4">Refine Selection</h2>
            <div className="flex flex-col gap-8">
              {filters.map((filter) => (
                <div key={filter.name}>
                  <h4 className="text-[11px] uppercase tracking-[0.2em] text-brand-rose-gold font-bold mb-4">{filter.name}</h4>
                  <div className="flex flex-col gap-3">
                    {filter.options.map((opt) => (
                      <label key={opt} className="flex items-center gap-3 cursor-pointer group text-black opacity-70">
                        <input type="checkbox" className="w-4 h-4 rounded border-teal-light text-brand-teal focus:ring-brand-teal" />
                        <span className="text-[13px] group-hover:text-brand-teal transition-colors font-body">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-grow">
            <div className="flex justify-between items-end mb-10 pb-6 border-b border-teal-light">
              <div>
                <h1 className="font-heading text-4xl md:text-5xl text-brand-dark mb-2 italic">The <span className="text-brand-teal">Entire</span> Edit</h1>
                <p className="text-[12px] text-gray-400 font-body tracking-wider uppercase">{products.length} Treasures Available</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMobileFiltersOpen(true)}
                  className="md:hidden flex items-center gap-2 bg-teal-light text-brand-teal px-4 py-2 rounded text-xs font-bold"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <div className="flex items-center gap-2 border-b border-teal-light pb-1 cursor-pointer">
                  <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold">Sort By:</span>
                  <span className="text-[11px] uppercase tracking-widest text-brand-teal font-bold flex items-center gap-1">New Arrivals <ChevronDown size={12} /></span>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16 animate-pulse">
                {[...Array(6)].map((_, i) => <div key={i} className="h-80 bg-teal-light rounded-xl" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-teal-light/20 rounded-3xl border border-dashed border-teal-light">
                <p className="font-body text-gray-500 uppercase tracking-widest text-xs">Our collection is currently transitioning. Check back soon for new treasures.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-8 md:gap-y-16">
                {products.map((p) => (
                  <ProductCard key={p.id || p._id} {...p} id={p.id || p._id} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-[100] md:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 bottom-0 w-[85%] bg-white p-8 overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="font-heading text-3xl italic">Refine Selection</h2>
                <button onClick={() => setMobileFiltersOpen(false)}><X size={24} className="text-gray-400" /></button>
              </div>
              <div className="flex flex-col gap-10">
                {filters.map((filter) => (
                  <div key={filter.name}>
                    <h4 className="text-[11px] uppercase tracking-[0.2em] text-brand-rose-gold font-bold mb-4">{filter.name}</h4>
                    <div className="flex flex-col gap-4">
                      {filter.options.map((opt) => (
                        <label key={opt} className="flex items-center gap-4 cursor-pointer text-black opacity-70">
                          <input type="checkbox" className="w-5 h-5 rounded border-teal-light text-brand-teal" />
                          <span className="text-[14px] font-body">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full bg-brand-teal text-white py-4 mt-12 rounded-xl font-bold tracking-[0.2em] uppercase text-xs shadow-luxury">Explore Filtered Treasures</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
