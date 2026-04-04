import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, CheckCircle, Truck, RotateCcw, ShieldCheck, Star, Camera, Sparkles
} from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import HeroCarousel from '@/components/home/HeroCarousel';
import SubscriptionForm from '@/components/home/SubscriptionForm';

export const metadata: Metadata = {
  title: 'Niralisai — Artisanal Indian Jewelry & Bridal Sets',
  description: 'Explore our exquisite collection of premium Indian jewelry, from temple sets to modern minimal pieces. Tarnish-resistant, hypoallergenic, and crafted for your special moments.',
};

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

export default async function HomePage() {
  // Fetch products on the server
  const response = await getProducts({ limit: 8 });
  
  const allProducts = response.success && response.data && 'data' in response.data 
    ? response.data.data 
    : (Array.isArray(response.data) ? response.data : []);

  const trendingProducts = allProducts.slice(0, 4);
  const bestsellers = allProducts.length > 4 ? allProducts.slice(4, 8) : trendingProducts;

  return (
    <div className="flex flex-col bg-white overflow-hidden">
      
      {/* Hero Banner Carousel (Client Component) */}
      <HeroCarousel />

      {/* USP Strip */}
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

      {/* Shop by Category */}
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

      {/* Shop by Style */}
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
            <div className="absolute inset-0 bg-gradient-to-t from-brand-rose-gold/40 via-brand-rose-gold/5 to-transparent z-10" />
            <div className="absolute bottom-10 left-10 z-20">
              <span className="text-[10px] tracking-[0.5em] uppercase font-bold text-white/70 mb-2 block">Daily Essentials</span>
              <h3 className="font-heading text-4xl text-white italic tracking-wide">Modern Muse</h3>
              <div className="w-12 h-px bg-white mt-4 transform origin-left transition-all duration-500 group-hover:w-24" />
            </div>
          </Link>
        </div>
      </section>

      {/* Trending Now */}
      <section className="py-24 bg-teal-light/30">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl text-brand-dark mb-2">Trending This Week</h2>
              <div className="w-16 h-1 bg-brand-rose-gold" />
            </div>
            <Link href="/jewellery" className="font-body text-xs tracking-widest uppercase text-brand-rose-gold hover:text-brand-teal transition-colors flex items-center gap-2">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {trendingProducts.map((product: any) => (
              <ProductCard key={product.id || product._id} {...product} id={product.id || product._id} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-heading text-3xl md:text-5xl text-brand-dark mb-2">Most Loved Bestsellers</h2>
              <div className="w-16 h-1 bg-brand-rose-gold" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {bestsellers.map((product: any) => (
              <ProductCard key={product.id || product._id} {...product} id={product.id || product._id} />
            ))}
          </div>
        </div>
      </section>

      {/* The Saasthik Promise */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="container mx-auto px-6 text-center mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-brand-rose-gold mb-4 block">Our Commitment</span>
          <h2 className="font-heading text-4xl md:text-5xl text-brand-dark mb-4 italic">The Niralisai Promise</h2>
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

      {/* Bridal Corner */}
      <section className="container mx-auto px-6 py-24">
        <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col lg:flex-row shadow-luxury border border-gray-100 min-h-[600px]">
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
          <div className="w-full lg:w-1/2 relative bg-[#F0F7F7] flex items-center justify-center p-12 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-heading text-[20vw] lg:text-[12vw] text-brand-teal/5 italic -rotate-12 select-none">Bridal</span>
            </div>
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
          </div>
        </div>
      </section>

      {/* UGC Strip */}
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

      {/* Newsletter Signup */}
      <section className="bg-brand-teal py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-white text-center md:text-left flex flex-col gap-2">
            <h2 className="font-heading text-4xl italic">Join the Sparkle Club</h2>
            <p className="font-body text-white/70 tracking-widest uppercase text-xs">Get 10% off your first order & weekly new arrivals alert</p>
          </div>
          <SubscriptionForm />
        </div>
      </section>

    </div>
  );
}