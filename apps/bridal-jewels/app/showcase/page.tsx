'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ── Placeholder sub-components ─────────────────────────────────── */
const Placeholder = ({ label, icon }) => (
  <div style={{
    minHeight: '70vh', display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
    background: 'linear-gradient(160deg, #fdf6e9 0%, #fdedc8 100%)',
  }}>
    <div style={{
      width: 100, height: 100, borderRadius: '50%',
      background: 'linear-gradient(135deg, var(--amber-200), var(--amber-400))',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '2.8rem',
      boxShadow: '0 0 0 1px var(--amber-300), 0 12px 40px rgba(201,150,12,0.2)',
    }}>{icon}</div>
    <h2 style={{
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 300,
      color: 'var(--amber-900)', letterSpacing: '-0.01em',
    }}>{label}</h2>
    <p style={{
      fontFamily: 'EB Garamond, serif', fontStyle: 'italic',
      fontSize: '1.1rem', color: 'var(--amber-600)',
    }}>Component renders here</p>
  </div>
);

const HeroSection        = () => <Placeholder label="Hero Section"         icon="✦" />;
const JewelleryCatalog   = () => <Placeholder label="Jewellery Catalog"    icon="◈" />;
const JewelleryDetail    = () => <Placeholder label="Product Detail"       icon="◇" />;
const MixAndMatchBuilder = () => <Placeholder label="Mix & Match Builder"  icon="⬡" />;
const BookingFlow        = () => <Placeholder label="Booking Flow"         icon="◯" />;

/* ── Nav ──────────────────────────────────────────────────────────── */
const Navbar = () => (
  <nav style={{
    background: 'var(--amber-900)',
    padding: '0 clamp(1.5rem,5vw,4rem)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    height: 64, position: 'relative', zIndex: 50,
  }}>
    <span style={{
      fontFamily: 'Cormorant Garamond, serif',
      fontSize: '1.5rem', fontWeight: 600, fontStyle: 'italic',
      color: 'var(--gold-light)', letterSpacing: '0.02em',
    }}>Bridal Jewels</span>
    <span style={{
      fontFamily: 'Cinzel, serif', fontSize: '0.55rem',
      letterSpacing: '0.35em', textTransform: 'uppercase',
      color: 'rgba(253,246,233,0.45)',
    }}>Est. 1950 · Mumbai</span>
  </nav>
);

/* ── Component registry ───────────────────────────────────────────── */
const COMPONENTS = [
  { id: 'hero',    name: 'Hero Section',       icon: '✦', component: <HeroSection /> },
  { id: 'catalog', name: 'Catalog',            icon: '◈', component: <JewelleryCatalog /> },
  { id: 'detail',  name: 'Product Detail',     icon: '◇', component: <JewelleryDetail /> },
  { id: 'builder', name: 'Mix & Match',        icon: '⬡', component: <MixAndMatchBuilder /> },
  { id: 'booking', name: 'Booking Flow',       icon: '◯', component: <BookingFlow /> },
];

/* ── Showcase Page ────────────────────────────────────────────────── */
export default function ShowcasePage() {
  const [active, setActive] = useState('hero');
  const [direction, setDirection] = useState(1);

  const currentIndex = COMPONENTS.findIndex(c => c.id === active);

  const switchTo = (id) => {
    const nextIndex = COMPONENTS.findIndex(c => c.id === id);
    setDirection(nextIndex > currentIndex ? 1 : -1);
    setActive(id);
  };

  const activeComp = COMPONENTS.find(c => c.id === active);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--amber-50)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --amber-50: #fdf6e9; --amber-100: #fdedc8; --amber-200: #fad78a;
          --amber-300: #f5bc44; --amber-400: #e8a020; --amber-500: #c97f10;
          --amber-600: #a85f0a; --amber-700: #874508; --amber-800: #6b3006;
          --amber-900: #4a1e04; --gold: #c9960c; --gold-light: #f0c040;
        }
        .tab-btn { transition: background 0.22s, color 0.22s, border-color 0.22s, box-shadow 0.22s; }
        .tab-btn:hover:not(.tab-active) { background: rgba(201,150,12,0.08) !important; }
      `}</style>

      <Navbar />

      {/* ── Sticky switcher bar ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 40,
        background: 'rgba(253,246,233,0.96)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(201,150,12,0.18)',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto',
          padding: '0 clamp(1.5rem,5vw,4rem)',
          display: 'flex', alignItems: 'stretch', gap: 0,
        }}>
          {COMPONENTS.map((comp, i) => {
            const isActive = active === comp.id;
            return (
              <React.Fragment key={comp.id}>
                <button
                  onClick={() => switchTo(comp.id)}
                  className={`tab-btn ${isActive ? 'tab-active' : ''}`}
                  style={{
                    position: 'relative',
                    padding: '1.1rem clamp(0.8rem,2vw,1.5rem)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: '0.35rem',
                    flex: 1,
                  }}
                >
                  {/* Active underline */}
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        height: 2,
                        background: 'linear-gradient(90deg, transparent, var(--gold), transparent)',
                      }}
                      transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                    />
                  )}

                  {/* Icon */}
                  <span style={{
                    fontSize: '1.1rem',
                    color: isActive ? 'var(--amber-700)' : 'var(--amber-400)',
                    transition: 'color 0.22s',
                    lineHeight: 1,
                  }}>{comp.icon}</span>

                  {/* Label */}
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 'clamp(0.48rem,1vw,0.6rem)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: isActive ? 'var(--amber-800)' : 'var(--amber-500)',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.22s',
                    fontWeight: isActive ? 600 : 400,
                  }}>{comp.name}</span>
                </button>

                {/* Hairline divider between tabs */}
                {i < COMPONENTS.length - 1 && (
                  <div style={{
                    width: 1, alignSelf: 'center', height: 24,
                    background: 'rgba(201,150,12,0.2)',
                    flexShrink: 0,
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Progress bar */}
        <motion.div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, var(--amber-900), var(--amber-400))',
            transformOrigin: 'left',
          }}
          animate={{ scaleX: (currentIndex + 1) / COMPONENTS.length }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* ── Breadcrumb strip ── */}
      <div style={{
        background: 'var(--amber-900)',
        padding: '0.6rem clamp(1.5rem,5vw,4rem)',
        display: 'flex', alignItems: 'center', gap: '0.6rem',
      }}>
        <span style={{ fontFamily:"'Cinzel', serif", fontSize:'0.5rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(253,246,233,0.35)' }}>
          Showcase
        </span>
        <span style={{ color:'rgba(253,246,233,0.2)', fontSize:'0.7rem' }}>›</span>
        <motion.span
          key={active}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          style={{ fontFamily:"'Cinzel', serif", fontSize:'0.5rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--amber-300)' }}
        >
          {activeComp?.name}
        </motion.span>
        <span style={{ marginLeft:'auto', fontFamily:"'EB Garamond', serif", fontStyle:'italic', fontSize:'0.85rem', color:'rgba(253,246,233,0.3)' }}>
          {currentIndex + 1} / {COMPONENTS.length}
        </span>
      </div>

      {/* ── Component area ── */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {activeComp?.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Prev / Next nav ── */}
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        padding: '2rem clamp(1.5rem,5vw,4rem)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderTop: '1px solid rgba(201,150,12,0.12)',
      }}>
        <motion.button
          onClick={() => currentIndex > 0 && switchTo(COMPONENTS[currentIndex - 1].id)}
          whileHover={{ x: -3 }}
          disabled={currentIndex === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            fontFamily: "'Cinzel', serif", fontSize: '0.58rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            background: 'none', border: '1px solid rgba(201,150,12,0.25)',
            color: currentIndex === 0 ? 'rgba(201,150,12,0.25)' : 'var(--amber-700)',
            padding: '0.7rem 1.25rem', borderRadius: 1, cursor: currentIndex === 0 ? 'default' : 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          ← {currentIndex > 0 ? COMPONENTS[currentIndex - 1].name : 'Start'}
        </motion.button>

        {/* Dot indicators */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {COMPONENTS.map((c, i) => (
            <motion.button
              key={c.id}
              onClick={() => switchTo(c.id)}
              animate={{ width: active === c.id ? 24 : 6, background: active === c.id ? 'var(--amber-700)' : 'rgba(201,150,12,0.3)' }}
              transition={{ duration: 0.3 }}
              style={{ height: 6, borderRadius: 3, border: 'none', cursor: 'pointer', padding: 0 }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => currentIndex < COMPONENTS.length - 1 && switchTo(COMPONENTS[currentIndex + 1].id)}
          whileHover={{ x: 3 }}
          disabled={currentIndex === COMPONENTS.length - 1}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            fontFamily: "'Cinzel', serif", fontSize: '0.58rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            background: 'none', border: '1px solid rgba(201,150,12,0.25)',
            color: currentIndex === COMPONENTS.length - 1 ? 'rgba(201,150,12,0.25)' : 'var(--amber-700)',
            padding: '0.7rem 1.25rem', borderRadius: 1,
            cursor: currentIndex === COMPONENTS.length - 1 ? 'default' : 'pointer',
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          {currentIndex < COMPONENTS.length - 1 ? COMPONENTS[currentIndex + 1].name : 'End'} →
        </motion.button>
      </div>
    </div>
  );
}