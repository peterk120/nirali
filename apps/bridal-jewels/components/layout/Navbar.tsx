'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, User, Menu, X, Phone } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would come from your auth context
  const [user, setUser] = useState(null); // This would come from your auth context
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Navigation links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Jewellery', href: '/jewellery' },
    { name: 'Collections', href: '/collections' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  // Language options
  const languages = [
    { code: 'en', name: 'EN' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'hi', name: 'हिंदी' },
  ];

  // Handle language change
  const handleLanguageChange = (langCode: string) => {
    setActiveLanguage(langCode);
    // In a real app, you would call i18n.changeLanguage(langCode)
    console.log(`Changing language to ${langCode}`);
  };

  // Toggle auth state for demo purposes
  const toggleAuthState = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      setUser(null);
    } else {
      setIsLoggedIn(true);
      setUser({ name: 'John Doe', avatar: '/placeholder-avatar.jpg' });
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white shadow-md py-2 backdrop-blur-md' 
            : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="text-2xl font-bold text-gold-500 font-heading">
                Bridal Jewels
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as any}
                  className={`relative py-2 font-body ${
                    pathname === link.href 
                      ? 'text-gold-500 font-semibold' 
                      : 'text-gray-700 hover:text-gold-500'
                  }`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.span
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-gold-500"
                      layoutId="navbarIndicator"
                      initial={false}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-6">
              <button className="text-gray-700 hover:text-gold-500 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <button className="text-gray-700 hover:text-gold-500 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  3
                </span>
              </div>
              
              {isLoggedIn ? (
                <div className="relative" ref={userDropdownRef}>
                  <button 
                    className="flex items-center space-x-2"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <span className="font-body text-sm">{user?.name}</span>
                  </button>
                  
                  <AnimatePresence>
                    {showUserDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                      >
                        <Link 
                          href={'/my-bookings' as any} 
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          My Bookings
                        </Link>
                        <button
                          onClick={toggleAuthState}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button 
                  onClick={toggleAuthState}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gold-500 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </button>
              )}
              
              <button className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Book Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 focus:outline-none"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.3 }}
              ref={mobileMenuRef}
              className="fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white shadow-lg z-50 lg:hidden"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <Link href="/" className="text-xl font-bold text-gold-500 font-heading">
                    Bridal Jewels
                  </Link>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <nav className="flex-1">
                  <ul className="space-y-6">
                    {navLinks.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href as any}
                          className={`block py-2 text-lg font-body ${
                            pathname === link.href 
                              ? 'text-gold-500 font-semibold' 
                              : 'text-gray-700'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <div className="mt-auto space-y-6">
                  {/* Language Toggle */}
                  <div className="flex space-x-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          activeLanguage === lang.code
                            ? 'bg-gold-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>

                  {/* WhatsApp Contact */}
                  <div className="flex items-center space-x-3 p-3 bg-green-100 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="font-body text-green-800">Contact us on WhatsApp</span>
                  </div>

                  {/* Auth Section */}
                  <div className="pt-4 border-t border-gray-200">
                    {isLoggedIn ? (
                      <div className="space-y-3">
                        <Link 
                          href={'/my-bookings' as any} 
                          className="block w-full text-center py-2 bg-gray-100 rounded-lg font-body"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <button
                          onClick={() => {
                            toggleAuthState();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-center py-2 bg-gray-100 rounded-lg font-body"
                        >
                          Logout
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          toggleAuthState();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full py-2 bg-gold-500 text-white rounded-lg font-body"
                      >
                        Login
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}