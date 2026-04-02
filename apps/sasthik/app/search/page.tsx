'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { getProducts } from '@/lib/api';
import Link from 'next/link';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await getProducts({ search: query });
        if (response.success && response.data) {
          const results = Array.isArray(response.data) ? response.data : (response.data as any).data || [];
          setProducts(results);
        }
      } catch (err) {
        console.error('Search failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-teal-light/30 border-b border-teal-light py-12 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-heading text-4xl md:text-6xl text-brand-dark mb-4 italic">
            Search <span className="text-brand-teal">Results</span>
          </h1>
          <p className="text-[14px] text-gray-500 font-body tracking-widest uppercase">
            {loading ? 'Searching our vault...' : `Showing results for "${query}"`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-pulse">
            {[...Array(8)].map((_, i) => <div key={i} className="h-80 bg-teal-light rounded-2xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="max-w-2xl mx-auto text-center py-20 bg-teal-light/20 rounded-[3rem] border border-dashed border-teal-light p-12">
            <Search size={48} className="mx-auto text-brand-teal mb-6 opacity-30" />
            <h2 className="font-heading text-3xl text-brand-dark mb-4">No treasures found</h2>
            <p className="text-gray-500 mb-8 font-body leading-relaxed">
              We couldn't find any matches for "{query}". Try checking your spelling or explore our most popular categories below.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['Bangles', 'Earrings', 'Necklaces', 'Bridal'].map(cat => (
                <Link 
                  key={cat}
                  href={`/jewellery/${cat.toLowerCase()}`}
                  className="px-6 py-2 bg-white border border-teal-light rounded-full text-xs font-bold uppercase tracking-widest hover:border-brand-teal hover:text-brand-teal transition-all shadow-sm"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-12 pb-6 border-b border-teal-light">
              <span className="text-[11px] uppercase tracking-[0.2em] text-brand-rose-gold font-bold">
                {products.length} Items Found
              </span>
              <div className="flex items-center gap-2 cursor-pointer group">
                <span className="text-[11px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-brand-teal transition-colors">Refine Search</span>
                <SlidersHorizontal size={14} className="text-gray-400 group-hover:text-brand-teal transition-colors" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12 md:gap-8">
              {products.map((p) => (
                <ProductCard key={p.id || p._id} {...p} id={p.id || p._id} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommended Section if NO category or results */}
      <section className="bg-brand-dark py-20 mt-20">
        <div className="container mx-auto px-6 text-center">
            <h2 className="font-heading text-4xl text-white mb-4">Didn't find what you were looking for?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">Our specialists are ready to help you find the perfect piece for your collection.</p>
            <Link 
              href={"/contact" as any}
              className="inline-flex items-center gap-3 bg-brand-rose-gold text-white px-10 py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:text-brand-dark transition-all"
            >
              Contact Specialist <ArrowRight size={16} />
            </Link>
        </div>
      </section>
    </div>
  );
}
