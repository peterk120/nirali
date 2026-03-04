'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Calendar, User, Menu, X, ChevronDown, Phone, LogOut, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '../lib/stores/wishlistStore';
import { useCartStore } from '../lib/stores/cartStore';
import { useAuthStore } from '../lib/stores/authStore';

// ─── Brand Tokens (rose palette) ─────────────────────────────────────────────
// Primary:   #6B1F2A  (brand-rose deep)
// Accent:    #C96E82  (rose-gold)
// Light:     #F0C4CC  (blush)
// Bg:        #FFF8F8  (ivory blush)
// Stone:     #F5E6E8

const navLinks = [
  { name: 'New Arrivals', href: '/' },
  {
    name: 'Lehengas', href: '#',
    dropdown: [
      { name: 'Bridal Lehenga', href: '/catalog/dresses' },
      { name: 'Designer Lehenga', href: '/catalog/dresses' },
      { name: 'Indo-Western', href: '/catalog/dresses' },
      { name: 'Georgette', href: '/catalog/dresses' },
      { name: 'Velvet', href: '/catalog/dresses' },
      { name: 'Plus-Size', href: '/catalog/dresses' },
    ],
  },
  {
    name: 'Sarees', href: '#',
    dropdown: [
      { name: 'Silk Saree', href: '/catalog/dresses' },
      { name: 'Kanjeevaram', href: '/catalog/dresses' },
      { name: 'Banarasi', href: '/catalog/dresses' },
      { name: 'Organza', href: '/catalog/dresses' },
      { name: 'Pre-Stitched', href: '/catalog/dresses' },
    ],
  },
  {
    name: 'Gowns', href: '#',
    dropdown: [
      { name: 'Ball Gown', href: '/catalog/dresses' },
      { name: 'A-Line', href: '/catalog/dresses' },
      { name: 'Mermaid', href: '/catalog/dresses' },
      { name: 'Cape Gown', href: '/catalog/dresses' },
    ],
  },
  {
    name: 'Occasion', href: '#',
    dropdown: [
      { name: 'Engagement', href: '/catalog/dresses' },
      { name: 'Mehendi', href: '/catalog/dresses' },
      { name: 'Sangeet', href: '/catalog/dresses' },
      { name: 'Wedding Day', href: '/catalog/dresses' },
      { name: 'Reception', href: '/catalog/dresses' },
    ],
  },
  { name: 'How It Works', href: '/about' },
];

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'hi', name: 'हिंदी' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeLang, setActiveLang] = useState('en');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { isLoggedIn, user, bookingsCount, logout, fetchBookingsCount } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const { items: cartItems, fetchCart } = useCartStore();

  const pathname = usePathname();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Sync cart and bookings count when logged in
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      fetchCart();
      fetchBookingsCount();
    }
  }, [isLoggedIn, user?.email, fetchCart, fetchBookingsCount]);

  // Removed local sync effect as it's now handled by the effect above or store actions directly

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setMobileOpen(false); setSearchOpen(false); setShowUserMenu(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    window.location.href = '/';
  };

  return (
    <>
      {/* ── Google Fonts ── */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap"
      />

      {/* ── Announcement Bar ── */}
      <div
        style={{
          background: '#6B1F2A',
          color: '#FFF8F8',
          fontSize: 11,
          letterSpacing: '0.12em',
          fontFamily: "'Jost', sans-serif",
          fontWeight: 400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'clamp(8px, 2vw, 0 40px)',
          height: 'auto',
          minHeight: 36,
          flexWrap: 'wrap',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: 'clamp(9px, 2vw, 11px)' }}>Free delivery on bookings above ₹5,000 &nbsp;·&nbsp; Pan-India Service</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
          {/* Language switcher */}
          <div style={{ display: 'flex', gap: 4 }}>
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => setActiveLang(l.code)}
                style={{
                  background: activeLang === l.code ? 'rgba(255,248,248,0.2)' : 'transparent',
                  border: 'none',
                  color: '#FFF8F8',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  cursor: 'pointer',
                  padding: '2px 8px',
                  fontFamily: "'Jost', sans-serif",
                  opacity: activeLang === l.code ? 1 : 0.65,
                  transition: 'opacity 0.2s',
                }}
              >
                {l.name}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0.8 }}>
            <Phone size={11} />
            <span>+91 98765 XXXXX</span>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: '#FFF8F8',
          borderBottom: scrolled ? '1px solid #F0C4CC' : '1px solid #F5E6E8',
          boxShadow: scrolled ? '0 4px 32px rgba(107,31,42,0.08)' : 'none',
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1280,
            margin: '0 auto',
            padding: 'clamp(12px, 3vw, 0 40px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 'clamp(60px, 10vh, 68px)',
          }}
        >
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 'clamp(20px, 4vw, 26px)',
                fontWeight: 400,
                color: '#6B1F2A',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}
            >
              Nirali Sai
            </span>
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: 'clamp(7px, 2vw, 9px)',
                fontWeight: 500,
                letterSpacing: '0.38em',
                color: '#C96E82',
                textTransform: 'uppercase',
              }}
            >
              Boutique
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 36 }} className="hidden-mobile">
            {navLinks.map((link, i) => (
              <div
                key={i}
                style={{ position: 'relative' }}
                onMouseEnter={() => link.dropdown && setActiveDropdown(`${i}`)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href as any}
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 12,
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: activeDropdown === `${i}` || pathname === link.href ? '#6B1F2A' : '#7A5560',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    paddingBottom: 2,
                    borderBottom: activeDropdown === `${i}` || pathname === link.href ? '1px solid #C96E82' : '1px solid transparent',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.name}
                  {link.dropdown && (
                    <ChevronDown
                      size={12}
                      style={{
                        transition: 'transform 0.2s',
                        transform: activeDropdown === `${i}` ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: '#C96E82',
                      }}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {link.dropdown && activeDropdown === `${i}` && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 16px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: '#FFF8F8',
                        border: '1px solid #F0C4CC',
                        minWidth: 200,
                        zIndex: 50,
                        boxShadow: '0 16px 48px rgba(107,31,42,0.12)',
                      }}
                    >
                      {/* small top accent bar */}
                      <div style={{ height: 2, background: 'linear-gradient(90deg, #6B1F2A, #C96E82)' }} />
                      <div style={{ padding: '12px 0' }}>
                        {link.dropdown.map((item, idx) => (
                          <Link
                            key={idx}
                            href={item.href as any}
                            style={{
                              display: 'block',
                              padding: '9px 24px',
                              fontFamily: "'Jost', sans-serif",
                              fontSize: 12,
                              letterSpacing: '0.08em',
                              color: '#6B1F2A',
                              textDecoration: 'none',
                              transition: 'background 0.15s, padding-left 0.15s',
                            }}
                            onMouseEnter={e => {
                              (e.target as HTMLElement).style.background = '#F5E6E8';
                              (e.target as HTMLElement).style.paddingLeft = '32px';
                            }}
                            onMouseLeave={e => {
                              (e.target as HTMLElement).style.background = 'transparent';
                              (e.target as HTMLElement).style.paddingLeft = '24px';
                            }}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }} className="hidden-mobile">
            {/* Search */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div
                  key="search-open"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', borderBottom: '1px solid #C96E82' }}
                >
                  <input
                    ref={searchRef}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search…"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 13,
                      color: '#6B1F2A',
                      outline: 'none',
                      width: '100%',
                      padding: '4px 0',
                    }}
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C96E82', display: 'flex' }}
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  key="search-closed"
                  onClick={() => setSearchOpen(true)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A5560', display: 'flex', transition: 'color 0.2s' }}
                  whileHover={{ color: '#6B1F2A' } as any}
                >
                  <Search size={18} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* Wishlist */}
            <NavIcon href="/wishlist" icon={<Heart size={18} />} badge={wishlistItems.length} />

            {/* Bookings */}
            <NavIcon href="/dashboard/bookings" icon={<Calendar size={18} />} badge={bookingsCount} badgeColor="#C96E82" />

            {/* Cart */}
            <NavIcon href="/cart" icon={<ShoppingBag size={18} />} badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />

            {/* Divider */}
            <div style={{ width: 1, height: 20, background: '#F0C4CC' }} />

            {/* User */}
            {isLoggedIn ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowUserMenu(v => !v)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: '#F5E6E8',
                      border: '1.5px solid #C96E82',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6B1F2A',
                    }}
                  >
                    <User size={15} />
                  </div>
                  <span
                    style={{
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 12,
                      letterSpacing: '0.08em',
                      color: '#6B1F2A',
                    }}
                  >
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={12} style={{ color: '#C96E82', transform: showUserMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 12px)',
                        background: '#FFF8F8',
                        border: '1px solid #F0C4CC',
                        minWidth: 180,
                        boxShadow: '0 12px 40px rgba(107,31,42,0.1)',
                        zIndex: 50,
                      }}
                    >
                      <div style={{ height: 2, background: 'linear-gradient(90deg, #6B1F2A, #C96E82)' }} />
                      {[
                        { label: 'My Bookings', href: '/dashboard/bookings' },
                        ...(user?.role === 'admin' ? [{ label: 'Admin Panel', href: '/admin' }] : []),
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href as any}
                          style={{
                            display: 'block',
                            padding: '10px 20px',
                            fontFamily: "'Jost', sans-serif",
                            fontSize: 12,
                            letterSpacing: '0.08em',
                            color: '#6B1F2A',
                            textDecoration: 'none',
                          }}
                          onMouseEnter={e => (e.target as HTMLElement).style.background = '#F5E6E8'}
                          onMouseLeave={e => (e.target as HTMLElement).style.background = 'transparent'}
                          onClick={() => setShowUserMenu(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                      <div style={{ borderTop: '1px solid #F5E6E8', margin: '4px 0' }} />
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          width: '100%',
                          padding: '10px 20px',
                          background: 'none',
                          border: 'none',
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 12,
                          letterSpacing: '0.08em',
                          color: '#A0525E',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F5E6E8'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <LogOut size={13} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#FFF8F8',
                  background: '#6B1F2A',
                  border: 'none',
                  padding: '9px 22px',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                  display: 'inline-block',
                }}
                onMouseEnter={e => (e.target as HTMLElement).style.background = '#A0525E'}
                onMouseLeave={e => (e.target as HTMLElement).style.background = '#6B1F2A'}
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B1F2A', display: 'none' }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(107,31,42,0.35)',
                zIndex: 60,
                backdropFilter: 'blur(2px)',
              }}
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.28 }}
              style={{
                position: 'fixed',
                top: 0, right: 0, bottom: 0,
                width: 'min(320px, 90vw)',
                background: '#FFF8F8',
                zIndex: 70,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {/* Drawer top accent */}
              <div style={{ height: 3, background: 'linear-gradient(90deg, #6B1F2A, #C96E82)' }} />

              {/* Drawer Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #F5E6E8' }}>
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: '#6B1F2A', fontWeight: 400 }}>Nirali Sai</div>
                  <div style={{ fontFamily: "'Jost', sans-serif", fontSize: 8, letterSpacing: '0.35em', color: '#C96E82', textTransform: 'uppercase' }}>Boutique</div>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7A5560' }}>
                  <X size={20} />
                </button>
              </div>

              {/* Drawer Nav */}
              <nav style={{ flex: 1, overflowY: 'auto', padding: '16px 0' }}>
                {navLinks.map((link, i) => (
                  <div key={i} style={{ borderBottom: '1px solid #F5E6E8' }}>
                    {link.dropdown ? (
                      <>
                        <button
                          onClick={() => setMobileExpanded(mobileExpanded === `${i}` ? null : `${i}`)}
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '14px 24px',
                            background: 'none',
                            border: 'none',
                            fontFamily: "'Jost', sans-serif",
                            fontSize: 12,
                            fontWeight: 400,
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            color: '#6B1F2A',
                            cursor: 'pointer',
                          }}
                        >
                          {link.name}
                          <ChevronDown
                            size={14}
                            style={{
                              color: '#C96E82',
                              transform: mobileExpanded === `${i}` ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.2s',
                            }}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === `${i}` && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              style={{ overflow: 'hidden', background: '#F5E6E8' }}
                            >
                              {link.dropdown.map((sub, si) => (
                                <Link
                                  key={si}
                                  href={sub.href as any}
                                  onClick={() => setMobileOpen(false)}
                                  style={{
                                    display: 'block',
                                    padding: '11px 36px',
                                    fontFamily: "'Jost', sans-serif",
                                    fontSize: 12,
                                    letterSpacing: '0.08em',
                                    color: '#6B1F2A',
                                    textDecoration: 'none',
                                  }}
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={link.href as any}
                        onClick={() => setMobileOpen(false)}
                        style={{
                          display: 'block',
                          padding: '14px 24px',
                          fontFamily: "'Jost', sans-serif",
                          fontSize: 12,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: pathname === link.href ? '#C96E82' : '#6B1F2A',
                          textDecoration: 'none',
                          fontWeight: pathname === link.href ? 500 : 400,
                        }}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>

              {/* Drawer Footer */}
              <div style={{ padding: '20px 24px', borderTop: '1px solid #F5E6E8', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* Icons row */}
                <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
                  <MobileIconLink href="/wishlist" icon={<Heart size={18} />} label="Wishlist" badge={wishlistItems.length} />
                  <MobileIconLink href="/dashboard/bookings" icon={<Calendar size={18} />} label="Bookings" badge={bookingsCount} />
                  <MobileIconLink href="/cart" icon={<ShoppingBag size={18} />} label="Cart" badge={cartItems.reduce((acc, item) => acc + item.quantity, 0)} />
                </div>

                {/* Language */}
                <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setActiveLang(l.code)}
                      style={{
                        padding: '4px 12px',
                        border: '1px solid',
                        borderColor: activeLang === l.code ? '#6B1F2A' : '#F0C4CC',
                        background: activeLang === l.code ? '#6B1F2A' : 'transparent',
                        color: activeLang === l.code ? '#FFF8F8' : '#7A5560',
                        fontFamily: "'Jost', sans-serif",
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      {l.name}
                    </button>
                  ))}
                </div>

                {/* Auth */}
                {isLoggedIn ? (
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    style={{
                      padding: '12px',
                      border: '1px solid #F0C4CC',
                      background: 'transparent',
                      color: '#A0525E',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <LogOut size={13} /> Logout
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '13px',
                      background: '#6B1F2A',
                      color: '#FFF8F8',
                      textAlign: 'center',
                      fontFamily: "'Jost', sans-serif",
                      fontSize: 11,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    Sign In
                  </Link>
                )}

                {/* Phone */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#A0525E', fontSize: 12, fontFamily: "'Jost', sans-serif" }}>
                  <Phone size={13} />
                  <span>+91 98765 XXXXX</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Responsive styles ── */}
      <style>{`
        @media (max-width: 1024px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function NavIcon({ href, icon, badge, badgeColor = '#6B1F2A' }: { href: string; icon: React.ReactNode; badge?: number; badgeColor?: string }) {
  return (
    <Link
      href={href as any}
      style={{ position: 'relative', color: '#7A5560', display: 'flex', transition: 'color 0.2s', textDecoration: 'none' }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#6B1F2A'}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#7A5560'}
    >
      {icon}
      {badge && badge > 0 ? (
        <span
          style={{
            position: 'absolute',
            top: -7, right: -7,
            background: badgeColor,
            color: '#FFF8F8',
            fontSize: 9,
            fontFamily: "'Jost', sans-serif",
            fontWeight: 500,
            borderRadius: '50%',
            width: 16, height: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

function MobileIconLink({ href, icon, label, badge }: { href: string; icon: React.ReactNode; label: string; badge?: number }) {
  return (
    <Link href={href as any} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textDecoration: 'none', color: '#6B1F2A', position: 'relative' }}>
      {icon}
      {badge && badge > 0 ? (
        <span style={{ position: 'absolute', top: -4, right: -4, background: '#6B1F2A', color: '#FFF8F8', fontSize: 8, borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {badge}
        </span>
      ) : null}
      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#A0525E' }}>{label}</span>
    </Link>
  );
}