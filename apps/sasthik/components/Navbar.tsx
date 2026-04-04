'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, User, Menu, X, ChevronDown, ChevronRight, 
  Phone, ShoppingBag, MapPin, Truck, Mic, ArrowRight, Sparkles,
  LogOut, Package, Map, Settings
} from 'lucide-react';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from 'react-hot-toast';

const navItems = [
  { name: 'Shop All', href: '/jewellery' },
  { name: 'Earrings', href: '/jewellery/earrings' },
  { name: 'Necklaces & Sets', href: '/jewellery/necklaces' },
  { name: 'Bangles & Bracelets', href: '/jewellery/bangles' },
  { name: 'Rings', href: '/jewellery/rings' },
  { name: 'Maang Tikka & Hair', href: '/jewellery/hair' },
  { name: 'Bridal Collection', href: '/jewellery/bridal' },
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'Sale 🔥', href: '/sale' },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const { isLoggedIn, user, logout } = useAuthStore();
  const { items: wishlistItems, fetchWishlist } = useWishlistStore();
  const { items: cartItems, fetchCart } = useCartStore();
  
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  // Fetch cart and wishlist on mount or login change
  useEffect(() => {
    fetchCart();
    fetchWishlist();
  }, [fetchCart, fetchWishlist, isLoggedIn]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSuggestions(false);
  }, [pathname]);

  // Handle Suggestions Fetching
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/products/suggest?q=${searchQuery}`);
        const data = await response.json();
        if (data.success) {
          setSuggestions(data.data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSuggestions(false);
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const handleLogout = () => {
    const role = user?.role;
    logout();
    toast.success('Logged out from this device');
    if (role === 'admin' || role === 'sales') {
      window.location.href = '/admin/login';
    } else {
      window.location.href = '/';
    }
  };

  const handleLogoutAll = () => {
    const { logoutAll } = useAuthStore.getState();
    logoutAll();
    toast.success('Logged out from all devices');
  };

  const handleMouseEnter = (itemName: string, e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return; // Disable hover on mobile
    if (itemName === 'Shop All') return; // Direct page link, no megamenu
    setActiveMenu(itemName);
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const menuWidth = 900;
    
    let left = rect.left + (rect.width / 2) - (menuWidth / 2);
    if (left < 20) left = 20;
    if (left + menuWidth > viewportWidth - 20) {
      left = viewportWidth - menuWidth - 20;
    }
    const relativeLeft = left - rect.left;
    
    setMenuStyle({
      left: `${relativeLeft}px`,
      transform: 'none',
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdminPath) return null;

  return (
    <header className="w-full z-50 bg-white">
      {/* ── ROW 1: Utility Bar (Desktop Only) ── */}
      <div className="border-b border-teal-light py-2 px-6 md:px-12 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] font-body text-gray-500 tracking-wider">
          <div className="flex gap-6 items-center">
            <a href="tel:9342661671" className="flex items-center gap-1.5 hover:text-brand-teal transition-colors"><Phone size={12} className="text-brand-rose-gold" /> +91 93426 61671</a>
            <a href="https://share.google/MHAIIcO5uzrsAp2xv" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-brand-teal transition-colors">
              <MapPin size={12} className="text-brand-rose-gold" /> Store Locator
            </a>
          </div>
          <div className="flex gap-6 items-center">
            <Link href={"/track-order" as any} className="flex items-center gap-1.5 hover:text-brand-teal transition-colors">
              <Truck size={12} className="text-brand-rose-gold" /> Track Order
            </Link>
            
            {/* Account Section */}
            {isLoggedIn ? (
              <div className="relative group/account">
                <button className="flex items-center gap-2 text-brand-dark hover:text-brand-teal transition-colors py-1">
                  <div className="w-6 h-6 rounded-full bg-teal-light flex items-center justify-center border border-teal-medium">
                    <User size={12} className="text-brand-teal" />
                  </div>
                  <span className="font-bold text-[11px] max-w-[80px] truncate">{user?.name?.split(' ')[0] || 'Member'}</span>
                  <ChevronDown size={10} className="group-hover/account:rotate-180 transition-transform duration-300" />
                </button>

                {/* Profile Dropdown */}
                <div className="absolute right-0 top-full pt-3 z-[100] opacity-0 invisible group-hover/account:opacity-100 group-hover/account:visible transition-all duration-300 transform translate-y-2 group-hover/account:translate-y-0">
                  <div className="w-56 bg-white shadow-luxury rounded-xl border border-teal-light overflow-hidden">
                    <div className="p-4 bg-teal-light/20 border-b border-teal-light">
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">Welcome back,</p>
                      <p className="text-sm font-heading text-brand-dark truncate">{user?.name}</p>
                    </div>
                    <div className="py-2">
                      {[
                        { label: 'My Profile', icon: User, href: '/profile' },
                        { label: 'My Orders', icon: Package, href: '/orders' },
                        { label: 'Saved Addresses', icon: Map, href: '/addresses' },
                        { label: 'My Wishlist', icon: Heart, href: '/wishlist' },
                        { label: 'Settings', icon: Settings, href: '/settings' },
                      ].map((item) => (
                        <Link 
                          key={item.label}
                          href={item.href as any}
                          className="flex items-center gap-3 px-4 py-2.5 text-[12px] text-gray-600 hover:bg-teal-light/40 hover:text-brand-teal transition-colors group/item"
                        >
                          <item.icon size={14} className="text-brand-rose-gold group-hover/item:scale-110 transition-transform" />
                          {item.label}
                          <ChevronRight size={10} className="ml-auto opacity-0 group-hover/item:opacity-100 -translate-x-2 group-hover/item:translate-x-0 transition-all" />
                        </Link>
                      ))}
                    </div>
                    <div className="p-2 border-t border-teal-light bg-gray-50">
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-[11px] font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors uppercase tracking-widest"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                href={"/login" as any} 
                className="bg-brand-teal text-white px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-dark hover:shadow-lg transition-all active:scale-95"
              >
                Sign In
              </Link>
            )}

            <Link href={"/wishlist" as any} className="flex items-center gap-1.5 hover:text-brand-teal transition-colors border-l border-gray-200 pl-6">
              <Heart size={13} className={wishlistItems.length > 0 ? "fill-brand-rose-gold text-brand-rose-gold" : "text-brand-rose-gold"} />
              Wishlist ({wishlistItems.length})
            </Link>
            <Link href={"/cart" as any} className="flex items-center gap-1.5 hover:text-brand-teal transition-colors">
              <div className="relative">
                <ShoppingBag size={13} className="text-brand-teal" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-brand-rose-gold text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </div>
              Cart
            </Link>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Logo & Search (Sticky on scroll) ── */}
      <div className={`py-3 md:py-4 px-4 md:px-12 transition-all duration-300 ${scrolled ? 'fixed top-0 left-0 right-0 bg-white shadow-md' : 'relative border-b border-teal-light'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-16">
          
          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-brand-teal p-1"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-teal rounded-sm flex items-center justify-center text-white rotate-45 transition-transform group-hover:rotate-[225deg]">
              <span className="-rotate-45 text-lg md:text-xl font-heading leading-none">N</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl md:text-2xl leading-none tracking-tight text-brand-dark">Niralisai</span>
              <span className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-brand-rose-gold font-bold">Premium Jewels</span>
            </div>
          </Link>

          {/* Search Pill (Desktop Preferred, but shown minimal on mobile) */}
          <div className="hidden md:flex flex-grow max-w-2xl relative">
            <div className="hidden lg:flex flex-1 max-w-md relative group">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input 
                type="text" 
                placeholder="Search treasures (e.g. 'Bangles', 'Kundan')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                className="w-full bg-teal-light/50 border border-teal-light rounded-full py-2.5 px-6 pl-12 text-[13px] font-body focus:bg-white focus:ring-2 focus:ring-brand-teal/20 transition-all outline-none"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-teal opacity-60" size={16} />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-teal transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-3 bg-white shadow-2xl rounded-2xl border border-teal-light overflow-hidden z-50 p-2"
                  >
                    <div className="px-4 py-2 border-b border-teal-light flex justify-between items-center bg-teal-light/20">
                      <span className="text-[10px] uppercase tracking-widest text-brand-teal font-bold">Suggested Treasures</span>
                      <Sparkles size={12} className="text-brand-rose-gold animate-pulse" />
                    </div>
                    {suggestions.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.type === 'category' ? `/jewellery/${item.text.toLowerCase()}` : `/product/${item.id}`}
                        onClick={() => setShowSuggestions(false)}
                        className="flex items-center justify-between px-4 py-3 hover:bg-teal-light/40 transition-colors group rounded-xl"
                      >
                        <div className="flex flex-col">
                          <span className="text-[13px] text-brand-dark group-hover:text-brand-teal transition-colors font-medium">
                            {item.text}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-body">
                            {item.type === 'category' ? 'Category' : `In ${item.category}`}
                          </span>
                        </div>
                        <ArrowRight size={12} className="text-brand-rose-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </Link>
                    ))}
                    <button 
                      onClick={() => handleSearchSubmit()}
                      className="w-full py-3 bg-brand-teal text-white text-[11px] font-bold uppercase tracking-[0.2em] mt-2 rounded-xl hover:bg-brand-dark transition-colors shadow-lg"
                    >
                      View All Results for "{searchQuery}"
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
   {/* Trending Dropdown */}
            <AnimatePresence>
              {searchFocused && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-4 right-4 mt-2 bg-white shadow-luxury border border-teal-light p-5 z-50 rounded-xl"
                >
                  <p className="text-[10px] uppercase tracking-widest text-brand-rose-gold font-medium mb-3">Trending Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {['Kundan', 'Oxidised', 'Bridal Set', 'Temple', 'Rings'].map(tag => (
                      <button key={tag} className="px-4 py-2 bg-teal-light hover:bg-teal-medium text-brand-teal text-xs rounded-full transition-colors font-body">
                        {tag}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Right Icons */}
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="text-brand-teal p-1"
            >
              <Search size={22} />
            </button>
            <Link href={"/cart" as any} className="text-brand-teal relative">
              <ShoppingBag size={22} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-rose-gold text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </Link>
          </div>

        </div>

        {/* Mobile Search Input Expansion */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden bg-white px-4 pb-4"
            >
              <form onSubmit={handleSearchSubmit} className="relative mt-2">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Search for jewels, collections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-teal-light/40 border border-teal-light rounded-full py-3 px-6 pl-12 text-sm outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all font-body"
                />
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-teal opacity-50" size={18} />
                <button 
                  type="button" 
                  onClick={() => { setSearchQuery(''); setIsMobileSearchOpen(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  <X size={16} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ROW 3: Mega Menu Bar (Desktop Only) ── */}
      <nav className="hidden md:block py-1 bg-white border-b border-teal-medium">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-10">
          {navItems.map((item) => (
            <div 
              key={item.name} 
              className="relative py-2 group"
              onMouseEnter={(e) => handleMouseEnter(item.name, e)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <Link 
                href={item.href as any}
                className="font-body text-[12px] tracking-[0.05em] uppercase text-gray-700 hover:text-brand-teal transition-colors font-medium relative py-1"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-rose-gold transition-all duration-300 group-hover:w-full" />
              </Link>

              <AnimatePresence>
                {activeMenu === item.name && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    style={menuStyle}
                    className="absolute top-full w-[900px] bg-white shadow-luxury border-t-[3px] border-brand-teal p-10 z-[60]"
                  >
                  <div className="grid grid-cols-4 gap-12">
                    <div>
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-brand-rose-gold font-bold mb-6">Shop by Type</h4>
                      <ul className="flex flex-col gap-3 font-body text-[13px] text-gray-600">
                        <li><Link href="#" className="hover:text-brand-teal hover:pl-2 transition-all">Jhumkas</Link></li>
                        <li><Link href="#" className="hover:text-brand-teal hover:pl-2 transition-all">Studs</Link></li>
                        <li><Link href="#" className="hover:text-brand-teal hover:pl-2 transition-all">Chandbalis</Link></li>
                        <li><Link href="#" className="hover:text-brand-teal hover:pl-2 transition-all">Hoops</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-brand-rose-gold font-bold mb-6">Shop by Style</h4>
                      <ul className="flex flex-col gap-3 font-body text-[13px] text-gray-600">
                        <li><Link href="#" className="hover:text-brand-teal hover:pl-2 transition-all">Traditional</Link></li>
                        <li><Link href="#" className="hover:text-brand-teal hover:pl-2 transition-all">Contemporary</Link></li>
                        <li><Link href="#" className="hover:text-brand-teal hover:pl-2 transition-all">Bridal Look</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[11px] uppercase tracking-[0.2em] text-brand-rose-gold font-bold mb-6">Explore</h4>
                      <ul className="flex flex-col gap-3 font-body text-[13px] text-gray-600">
                       <li><Link href={"/new-arrivals" as any} className="hover:text-brand-teal hover:pl-2 transition-all">New Arrivals</Link></li>
                        <li><Link href={"/sale" as any} className="hover:text-brand-teal hover:pl-2 transition-all">Best Deals</Link></li>
                      </ul>
                    </div>
                    <div className="bg-teal-light p-6 rounded-lg flex flex-col justify-end min-h-[180px] relative">
                       <div>
                         <div className="font-heading text-3xl mb-2">Niralisai Jewels</div>
                         <p className="text-[11px] uppercase tracking-[0.3em] text-brand-rose-gold font-medium">
                           Premium Indian Jewellery
                         </p>
                       </div>
                       <h5 className="font-heading text-xl text-brand-teal mb-4 italic">The Festive Edit</h5>
                       <Link href={"/festive" as any} className="text-[10px] uppercase tracking-widest font-bold text-brand-dark hover:text-brand-teal transition-colors">Explore</Link>
                    </div>
                  </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </nav>

      {/* ── MOBILE SLIDE-IN DRAWER ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] md:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-white z-[110] md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-teal-light flex justify-between items-center bg-teal-light/20">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 bg-brand-teal rounded flex items-center justify-center text-white rotate-45">
                      <span className="-rotate-45 text-sm font-heading">N</span>
                   </div>
                   <span className="font-heading text-xl text-brand-teal uppercase tracking-tighter">Niralisai</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-white rounded-full shadow-sm">
                  <X size={20} className="text-gray-400" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-4">
                <div className="px-6 py-4 flex flex-col gap-6">
                   {navItems.map((item) => (
                      <Link 
                        key={item.name} 
                        href={item.href as any}
                        className="flex items-center justify-between group"
                      >
                         <span className="font-body text-sm uppercase tracking-[0.1em] text-brand-dark group-hover:text-brand-teal font-medium transition-colors">{item.name}</span>
                         <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-teal group-hover:translate-x-1 transition-all" />
                      </Link>
                   ))}
                </div>

                <div className="mt-8 pt-8 border-t border-teal-light px-6 space-y-6">
                   <Link href={"/wishlist" as any} className="flex items-center gap-4 text-brand-dark font-body text-sm tracking-wide">
                      <Heart size={18} className="text-brand-rose-gold" /> My Wishlist
                   </Link>
                   <Link href={"/track-order" as any} className="flex items-center gap-4 text-brand-dark font-body text-sm tracking-wide">
                      <Truck size={18} className="text-brand-rose-gold" /> Track Order
                   </Link>
                    <a 
                      href="https://share.google/MHAIIcO5uzrsAp2xv" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-4 text-brand-dark font-body text-sm tracking-wide"
                    >
                       <MapPin size={18} className="text-brand-rose-gold" /> Store Locator
                    </a>
                </div>
              </div>

              <div className="p-6 border-t border-teal-light bg-teal-light/10">
                {isLoggedIn ? (
                  <div className="flex flex-col gap-1">
                    <p className="px-4 text-[10px] font-body text-gray-500 uppercase tracking-widest mb-3">My Account</p>
                    {[
                      { label: 'My Profile', icon: User, href: '/profile' },
                      { label: 'My Orders', icon: Package, href: '/orders' },
                      { label: 'Saved Addresses', icon: Map, href: '/addresses' },
                      { label: 'My Wishlist', icon: Heart, href: '/wishlist' },
                      { label: 'Settings', icon: Settings, href: '/settings' },
                    ].map((item) => (
                      <Link 
                        key={item.label}
                        href={item.href as any}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 px-4 py-3.5 text-[13px] text-gray-700 hover:bg-white rounded-xl transition-all font-body"
                      >
                        <item.icon size={18} className="text-brand-rose-gold" />
                        {item.label}
                        <ChevronRight size={14} className="ml-auto text-gray-300" />
                      </Link>
                    ))}
                    <button 
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-3 py-4 mt-6 bg-red-50 text-red-500 rounded-xl font-bold tracking-widest uppercase text-[10px] shadow-sm border border-red-100"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                ) : (
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full py-4 bg-brand-teal text-white rounded-xl font-bold tracking-widest uppercase text-[10px] shadow-lg text-center">Sign In / Register</Link>
                )}
                <p className="mt-8 text-center text-[9px] text-gray-400 uppercase tracking-[0.2em] px-4 font-body">Crafting Timeless Elegance Since 2012</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}