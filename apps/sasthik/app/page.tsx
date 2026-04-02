'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, ChevronLeft, ChevronRight, CheckCircle, 
  Truck, RotateCcw, ShieldCheck, Star, Camera, Mail, ShoppingBag, Sparkles
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import { toast } from 'react-hot-toast';

// ── Dummy Data ──
const heroSlides = [
  { title: "", subtitle: "", color: "bg-brand-teal", image: "/img/banner 1.png", buttonText: "Shop Temple Jewelry", buttonLink: "/jewellery" },
  { title: "", subtitle: "", color: "bg-brand-rose-gold", image: "/img/banner 2.png", buttonText: "Explore Collection", buttonLink: "/jewellery" },
  { title: "", subtitle: "", color: "bg-[#1A1A2E]", image: "/img/banner 3.png", buttonText: "Shop New Arrivals", buttonLink: "/jewellery" },
];

const occasions = [
  { name: 'Bridal', image: '', count: '120+ Styles' },
  { name: 'Wedding Guest', image: '', count: '85+ Styles' },
  { name: 'Festive', image: '', count: '200+ Styles' },
  { name: 'Everyday Lounge', image: '', count: '45+ Styles' },
];

const categories = [
  { name: 'Earrings', icon: '💍', href: '/jewellery?category=Earrings' },
  { name: 'Necklaces', icon: '📿', href: '/jewellery?category=Necklace' },
  { name: 'Bangles', icon: '💫', href: '/jewellery?category=Bangles' },
  { name: 'Rings', icon: '✨', href: '/jewellery?category=Rings' },
  { name: 'Maang Tikka', icon: '👑', href: '/jewellery?category=Maang Tikka' },
  { name: 'Bridal Sets', icon: '👰', href: '/jewellery/bridal' },
  { name: 'Anklets', icon: '👣', href: '/jewellery?category=Anklets' },
  { name: 'Hair Access.', icon: '👱‍♀️', href: '/jewellery?category=Hair' },
];

export default function HomePage() {
  const router = useRouter();
  const [currentHero, setCurrentHero] = useState(0);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [router]);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const response = await getProducts({ limit: 8 });
        if (response.success && response.data) {
          const allProducts = Array.isArray(response.data) ? response.data : (response.data as any).data || [];
          const trending = allProducts.slice(0, 4);
          setTrendingProducts(trending);
          
          // If we have more than 4 products, use the next 4 for bestsellers
          // Otherwise, reuse the first 4 (or whatever we have) to keep the section full
          const best = allProducts.length > 4 ? allProducts.slice(4, 8) : trending;
          setBestsellers(best);
        }
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const handleSubscribe = async () => {
    if (!subscribeEmail) return;
    setIsSubscribing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/subscribers/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subscribeEmail })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || 'Successfully subscribed!');
        setSubscribeEmail('');
      } else {
        toast.error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHero((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      
      {/* [3A] Hero Banner Carousel */}
      <section className="relative h-[500px] md:h-[650px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentHero}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className={`absolute inset-0 ${heroSlides[currentHero].color} flex items-center justify-center`}
            style={heroSlides[currentHero].image ? {
              backgroundImage: `url('${heroSlides[currentHero].image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            } : {}}
          >
            {heroSlides[currentHero].image && <div className="absolute inset-0 bg-black/40 z-0" />} 
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            <div className="container mx-auto px-6 md:px-12 relative z-10 flex flex-col items-center justify-center text-center text-white h-full">
              {heroSlides[currentHero].title && !heroSlides[currentHero].image && (
                <div className="max-w-4xl mx-auto">
                  <motion.span 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold mb-4 block text-brand-rose-gold"
                  >
                    Exclusive Collection 2026
                  </motion.span>
                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="font-heading text-[clamp(2rem,10vw,4.5rem)] leading-[1.1] mb-6 italic"
                  >
                    {heroSlides[currentHero].title}
                  </motion.h1>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="font-body text-lg md:text-2xl mb-10 opacity-90"
                  >
                    {heroSlides[currentHero].subtitle}
                  </motion.p>
                </div>
              )}
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className={`flex flex-col sm:flex-row items-center justify-center gap-4 ${heroSlides[currentHero].image ? 'mt-40 md:mt-80' : ''}`}
              >
                <Link href={heroSlides[currentHero].buttonLink as any} className="bg-white text-[#1A1A2E] px-12 py-4 font-body text-[11px] tracking-widest uppercase hover:bg-brand-rose-gold hover:text-white transition-all shadow-xl font-bold flex items-center gap-2">
                  {heroSlides[currentHero].buttonText} <ArrowRight size={14} />
                </Link>
                {!heroSlides[currentHero].image && (
                  <Link href={"/jewellery" as any} className="border border-white/30 text-white px-12 py-4 font-body text-[11px] tracking-widest uppercase hover:bg-white/10 transition-all">View Collection</Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentHero(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentHero === i ? 'bg-brand-rose-gold w-8' : 'bg-white/40'}`}
            />
          ))}
        </div>
      </section>

      {/* [3B] USP Strip */}
      <section className="bg-teal-light py-8 md:py-12 border-b border-teal-medium">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: ShieldCheck, text: "Tarnish-Resistant Coating" },
            { icon: Truck, text: "Free Shipping ₹499+" },
            { icon: RotateCcw, text: "7-Day Easy Returns" },
            { icon: Star, text: "1000+ Unique Styles" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3 group">
              <item.icon size={28} className="text-brand-rose-gold transition-transform group-hover:scale-110" strokeWidth={1.5} />
              <span className="font-body text-[11px] md:text-xs tracking-wider uppercase text-brand-teal font-bold">{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* [3C] Shop by Category — Circular Icon Grid */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex justify-between min-w-[800px] md:min-w-0">
            {categories.map((cat, i) => (
              <Link key={i} href={cat.href as any} className="flex flex-col items-center gap-3 group shrink-0">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-teal-light border-2 border-transparent transition-all duration-300 group-hover:border-brand-teal group-hover:shadow-lg flex items-center justify-center text-2xl md:text-3xl">
                  {cat.icon}
                </div>
                <span className="font-body text-[10px] md:text-[11px] tracking-widest uppercase text-gray-600 group-hover:text-brand-rose-gold font-bold transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* [3D] Shop by Style — Fashion Editorial Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Link href={"/jewellery" as any} className="relative h-[400px] md:h-[600px] group overflow-hidden rounded-2xl shadow-luxury">
            <div 
              className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110"
              style={{
                backgroundImage: "url('/img/HERITAGE.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* Soft Gradient Color Wash Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-brand-teal/10 to-transparent z-10" />
            
            <div className="absolute bottom-10 left-10 z-20">
              <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-white/70 mb-2 block">The Collection</span>
              <h3 className="font-heading text-4xl text-white italic tracking-wide">Heritage Look</h3>
              <div className="w-12 h-px bg-brand-rose-gold mt-4 transform origin-left transition-all duration-500 group-hover:w-24" />
            </div>
          </Link>

          <Link href={"/jewellery" as any} className="relative h-[400px] md:h-[600px] group overflow-hidden rounded-2xl shadow-luxury">
            <div 
              className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110"
              style={{
                backgroundImage: "url('/img/MINIMAL.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
            {/* Muted Rose Pink Gradient Wash */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-rose-gold/40 via-brand-rose-gold/5 to-transparent z-10" />
            
            <div className="absolute bottom-10 left-10 z-20">
              <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-white/70 mb-2 block">Daily Essentials</span>
              <h3 className="font-heading text-4xl text-white italic tracking-wide">Modern Muse</h3>
              <div className="w-12 h-px bg-white mt-4 transform origin-left transition-all duration-500 group-hover:w-24" />
            </div>
          </Link>
        </div>
      </section>

      {/* [3E] Trending Now Product Carousel */}
      <section className="py-24 bg-teal-light/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl text-brand-dark mb-2">Trending This Week</h2>
              <div className="w-16 h-1 bg-brand-rose-gold" />
            </div>
            <Link href="#" className="font-body text-xs tracking-widest uppercase text-brand-rose-gold hover:text-brand-teal transition-colors flex items-center gap-2">View All <ArrowRight size={14} /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
               {[...Array(4)].map((_, i) => <div key={i} className="h-80 bg-teal-light rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {trendingProducts.map(product => (
                <ProductCard key={product.id || product._id} {...product} id={product.id || product._id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3G: Bestsellers Carousel (Static Grid for now) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl text-brand-dark mb-2">Most Loved Bestsellers</h2>
              <div className="w-16 h-1 bg-brand-rose-gold" />
            </div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-pulse">
               {[...Array(4)].map((_, i) => <div key={i} className="h-80 bg-teal-light rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {bestsellers.map(product => (
                <ProductCard key={product.id || product._id} {...product} id={product.id || product._id} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* [3H] The Saasthik Promise — High-End Editorial Trust Strip */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-brand-rose-gold mb-4 block">Our Commitment</span>
          <h2 className="font-heading text-4xl md:text-5xl text-brand-dark mb-4 italic">The Saasthik Promise</h2>
          <div className="w-12 h-0.5 bg-brand-rose-gold/30 mx-auto" />
        </div>
        
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { 
              title: "Tarnish Resistant", 
              sub: "Premium plating that maintains its original brilliance for years with minimal care.", 
              icon: ShieldCheck,
              highlight: "Lifetime Shine"
            },
            { 
              title: "Hypoallergenic", 
              sub: "Crafted on a 100% nickel-free and lead-free brass base. Safe for the most sensitive skin.", 
              icon: CheckCircle,
              highlight: "Skin Friendly"
            },
            { 
              title: "Luxury Updated", 
              sub: "Over 500+ curated high-fashion styles added every month to your collection.", 
              icon: Star,
              highlight: "Fresh Trends"
            },
          ].map((item, i) => (
            <div key={i} className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-luxury hover:shadow-2xl transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center">
              {/* Decorative Corner Sparkle */}
              <div className="absolute -top-4 -right-4 text-brand-rose-gold/5 group-hover:text-brand-rose-gold/20 transition-colors">
                <Sparkles size={80} />
              </div>
              
              <div className="w-20 h-20 bg-teal-light/30 rounded-full flex items-center justify-center text-brand-teal mb-8 border border-teal-light group-hover:bg-brand-teal group-hover:text-white transition-all duration-500 transform group-hover:rotate-[360deg]">
                <item.icon size={32} strokeWidth={1} />
              </div>
              
              <span className="text-[9px] tracking-[0.3em] uppercase font-bold text-brand-rose-gold mb-3">{item.highlight}</span>
              <h4 className="font-heading text-2xl mb-4 text-brand-dark italic">{item.title}</h4>
              <p className="font-body text-[13px] text-gray-500 leading-relaxed font-light">{item.sub}</p>
              
              <div className="mt-8 w-8 h-px bg-gray-200 group-hover:w-16 group-hover:bg-brand-rose-gold transition-all duration-500" />
            </div>
          ))}
        </div>
      </section>

      {/* [3J] Bridal Corner — Custom Split Layout Editorial */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-luxury border border-gray-100 min-h-[600px]">
          {/* Left Content Panel */}
          <div className="w-full lg:w-1/2 p-8 md:p-16 lg:p-20 flex flex-col items-start justify-center gap-6 md:gap-8 bg-white">
            <span className="px-3 py-1 bg-brand-rose-gold text-white text-[10px] tracking-[0.3em] font-bold rounded-sm uppercase">Featured</span>
            <h2 className="font-heading text-[clamp(2.5rem,12vw,5rem)] text-brand-dark italic leading-[1.1]">Complete <br className="hidden md:block" /> Bridal Sets</h2>
            <p className="font-body text-gray-500 max-w-sm leading-relaxed text-sm md:text-base">
              Curated master-sets featuring Necklace, Earrings, Maang Tikka, and Bangles. Everything you need for your wedding ceremony in one box.
            </p>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-rose-gold font-bold">Starting From</span>
              <span className="text-4xl font-heading text-brand-teal italic tracking-tight">₹1,499</span>
            </div>
            
            <Link href={"/jewellery/bridal" as any} className="bg-brand-teal text-white px-10 py-4 font-body text-[11px] tracking-[0.2em] uppercase font-bold flex items-center gap-3 hover:bg-brand-dark transition-all shadow-lg group">
              Explore Bridal <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
            </Link>
          </div>
          
          {/* Right Visual Panel */}
          <div className="w-full lg:w-1/2 relative bg-[#F0F7F7] flex items-center justify-center p-12 overflow-hidden">
            {/* Faded Watermark Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-heading text-[20vw] lg:text-[12vw] text-brand-teal/5 italic -rotate-12 select-none">Bridal</span>
            </div>
            
            {/* Tilted Card Overlay Effect */}
            <div className="relative w-full max-w-md aspect-[4/5] transform rotate-3 shadow-2xl rounded-2xl overflow-hidden group">
              <div 
                className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110"
                style={{
                  backgroundImage: "url('/img/Complete_Bridal_Sets.jpeg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent" />
            </div>
            
            {/* Subtle decorative elements */}
            <div className="absolute top-10 right-10 w-24 h-24 border border-brand-teal/10 rounded-full animate-pulse" />
            <div className="absolute bottom-20 left-10 w-12 h-12 bg-white/40 backdrop-blur-sm rounded-full" />
          </div>
        </div>
      </section>

      {/* [3K] UGC Strip */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center mb-12">
           <h2 className="font-heading text-3xl text-brand-dark italic">Real Customers, Real Sparkle 💛</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square bg-teal-light relative group cursor-pointer overflow-hidden">
               <div className="absolute inset-0 bg-brand-rose-gold/60 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <Camera size={24} className="text-white" />
               </div>
               <div className="w-full h-full flex items-center justify-center font-heading text-2xl text-brand-teal/10 italic">Gallery</div>
            </div>
          ))}
        </div>
      </section>

      {/* [3M] Newsletter Signup */}
      <section className="bg-brand-teal py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-white text-center md:text-left flex flex-col gap-2">
            <h2 className="font-heading text-4xl italic">Join the Sparkle Club</h2>
            <p className="font-body text-white/70 tracking-widest uppercase text-xs">Get 10% off your first order & weekly new arrivals alert</p>
          </div>
          <div className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
            <div className="flex-grow flex items-center bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20">
              <Mail size={18} className="text-white/60 mr-3" />
              <input 
                type="email" 
                placeholder="Email Address"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                className="bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 w-full text-sm font-body"
              />
            </div>
            <button 
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="bg-white text-brand-teal px-10 py-4 font-body text-[11px] tracking-widest uppercase font-bold hover:bg-brand-rose-gold hover:text-white transition-all shadow-lg disabled:opacity-50"
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}