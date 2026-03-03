'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Filter, SlidersHorizontal, X, Heart, Star, ChevronDown, Search } from 'lucide-react';

/* ─────────────────────────── MOCK DATA ─────────────────────────── */
const mockJewellery = [
  { id:'j1', name:'Royal Gold Necklace Set', category:'Necklace Set', price:15000, originalPrice:18000, rating:4.8, reviewCount:127, isAvailable:true, function:['Wedding Day','Reception'], type:'Necklace Set', metal:'Gold', weight:45.2, karat:'22K', rentalDuration:3, tags:['Traditional','Bridal','Heavy'], description:'Exquisite gold necklace set with intricate designs perfect for wedding ceremonies.', includedItems:['Necklace','Chain','Pendant'] },
  { id:'j2', name:'Kundan Earrings', category:'Earrings', price:8500, rating:4.6, reviewCount:89, isAvailable:true, function:['Sangeet','Mehendi'], type:'Earrings', metal:'Kundan', weight:12.5, rentalDuration:1, tags:['Kundan','Light','Designer'], description:'Beautiful kundan earrings with traditional motifs.', includedItems:['Earrings'] },
  { id:'j3', name:'Diamond Maang Tikka', category:'Maang Tikka', price:12000, originalPrice:15000, rating:4.7, reviewCount:156, isAvailable:true, function:['Wedding Day','Reception'], type:'Maang Tikka', metal:'Diamond', weight:8.7, karat:'18K', rentalDuration:3, tags:['Diamond','Elegant','Heavy'], description:'Stunning diamond maang tikka for the perfect bridal look.', includedItems:['Maang Tikka','Chain'] },
  { id:'j4', name:'Polki Bangles Set', category:'Bangles', price:18000, rating:4.9, reviewCount:203, isAvailable:true, function:['Engagement','Wedding Day'], type:'Bangles', metal:'Polki', weight:65.3, karat:'22K', rentalDuration:7, tags:['Polki','Heavy','Traditional'], description:'Royal polki bangles set with authentic Mughal designs.', includedItems:['Bangles Set','Matching Bracelet'] },
  { id:'j5', name:'Silver Oxidized Full Set', category:'Full Set', price:25000, originalPrice:30000, rating:4.5, reviewCount:98, isAvailable:true, function:['Sangeet','Mehendi','Reception'], type:'Full Set', metal:'Silver', weight:89.2, rentalDuration:7, tags:['Silver','Oxidized','Light'], description:'Complete oxidized silver set for multiple functions.', includedItems:['Necklace','Earrings','Maang Tikka','Bangles','Armlets'] },
  { id:'j6', name:'Pearl Drop Earrings', category:'Earrings', price:6500, rating:4.3, reviewCount:67, isAvailable:true, function:['Reception','Engagement'], type:'Earrings', metal:'Silver', weight:5.1, rentalDuration:1, tags:['Pearl','Light','Classic'], description:'Elegant pearl drop earrings for subtle elegance.', includedItems:['Earrings'] },
  { id:'j7', name:'Temple Gold Bangles', category:'Bangles', price:22000, originalPrice:25000, rating:4.8, reviewCount:145, isAvailable:true, function:['Engagement','Wedding Day'], type:'Bangles', metal:'Gold', weight:42.8, karat:'22K', rentalDuration:3, tags:['Temple','Gold','Traditional'], description:'Intricately designed temple-style gold bangles.', includedItems:['Bangles Set'] },
  { id:'j8', name:'Ruby Studded Tikka', category:'Maang Tikka', price:16500, rating:4.6, reviewCount:78, isAvailable:true, function:['Wedding Day','Reception'], type:'Maang Tikka', metal:'Gold', weight:11.3, karat:'18K', rentalDuration:3, tags:['Ruby','Heavy','Designer'], description:'Exquisite ruby-studded maang tikka with gold accents.', includedItems:['Maang Tikka','Chain'] },
];

/* ─────────────────────────── PALETTE MOTIFS ─────────────────────────── */
const metalGradients = {
  Gold:    'linear-gradient(135deg, #c9960c 0%, #f0c040 40%, #e8a020 70%, #a85f0a 100%)',
  Kundan:  'linear-gradient(135deg, #7c5c2e 0%, #d4a843 50%, #8b6914 100%)',
  Diamond: 'linear-gradient(135deg, #b0c4de 0%, #e8f4f8 50%, #9bb5cc 100%)',
  Polki:   'linear-gradient(135deg, #6b3006 0%, #c97f10 50%, #f5bc44 100%)',
  Silver:  'linear-gradient(135deg, #7a7a8a 0%, #d0d0e0 50%, #a0a0b0 100%)',
};

const typeIcons = { 'Necklace Set':'⬡', 'Earrings':'◇', 'Maang Tikka':'✦', 'Bangles':'◯', 'Full Set':'✴' };

/* ─────────────────────────── JEWELLERY CARD ─────────────────────────── */
const JewelleryCard = ({ item, index, isWishlisted, onWishlist }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.25,0.1,0.25,1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{ position: 'relative', cursor: 'pointer' }}
    >
      {/* Card */}
      <motion.div
        animate={{ y: hovered ? -6 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        style={{
          background: '#fff',
          border: '1px solid rgba(201,150,12,0.15)',
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: hovered
            ? '0 20px 60px rgba(201,150,12,0.18), 0 2px 16px rgba(0,0,0,0.06)'
            : '0 2px 16px rgba(0,0,0,0.04)',
          transition: 'box-shadow 0.35s ease',
        }}
      >
        {/* Image area */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          <div style={{
            width: '100%', height: '100%',
            background: metalGradients[item.metal] || metalGradients.Gold,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '3.5rem',
            transition: 'transform 0.5s ease',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
          }}>
            <span style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.2))' }}>
              {typeIcons[item.type] || '◈'}
            </span>
          </div>

          {/* Discount badge */}
          {item.originalPrice && (
            <div style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--amber-800)', color: '#fdf6e9',
              fontFamily: "'Cinzel', serif",
              fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 1,
            }}>
              {Math.round((1 - item.price / item.originalPrice) * 100)}% off
            </div>
          )}

          {/* Wishlist button */}
          <motion.button
            onClick={(e) => { e.stopPropagation(); onWishlist(item); }}
            whileTap={{ scale: 0.85 }}
            style={{
              position: 'absolute', top: 10, right: 10,
              width: 36, height: 36, borderRadius: '50%',
              background: isWishlisted ? 'var(--amber-700)' : 'rgba(253,246,233,0.9)',
              border: '1px solid rgba(201,150,12,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <Heart size={15} fill={isWishlisted ? '#fdf6e9' : 'none'} color={isWishlisted ? '#fdf6e9' : 'var(--amber-700)'} />
          </motion.button>

          {/* Rental tag */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            background: 'linear-gradient(transparent, rgba(74,30,4,0.8))',
            padding: '20px 12px 10px',
            fontFamily: 'Cinzel, serif',
            fontSize: '0.55rem', letterSpacing: '0.25em', color: 'var(--amber-200)',
            textTransform: 'uppercase',
          }}>
            {item.rentalDuration} day{item.rentalDuration > 1 ? 's' : ''} rental
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '1.1rem 1.25rem 1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <div style={{ fontFamily: 'Cinzel, serif', fontSize: '0.55rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--amber-500)' }}>
              {item.metal} · {item.karat || 'Alloy'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Star size={11} fill="var(--amber-400)" color="var(--amber-400)" />
              <span style={{ fontFamily: "EB Garamond, serif", fontSize: '0.8rem', color: 'var(--amber-700)' }}>{item.rating}</span>
            </div>
          </div>

          <h3 style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            fontWeight: 600, color: 'var(--amber-900)',
            lineHeight: 1.2, marginBottom: '0.75rem',
          }}>{item.name}</h3>

          {/* Tags */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {item.tags.slice(0, 2).map(t => (
              <span key={t} style={{
                fontFamily: "Cinzel, serif", fontSize: '0.5rem',
                letterSpacing: '0.15em', textTransform: 'uppercase',
                padding: '2px 8px', border: '1px solid rgba(201,150,12,0.3)',
                color: 'var(--amber-600)', borderRadius: 1,
              }}>{t}</span>
            ))}
          </div>

          {/* Price row */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--amber-800)' }}>
                ₹{item.price.toLocaleString()}
              </span>
              {item.originalPrice && (
                <span style={{ fontFamily: "EB Garamond, serif", fontSize: '0.85rem', color: '#999', textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                  ₹{item.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span style={{ fontFamily: "'EB Garamond', serif", fontSize: '0.8rem', color: 'var(--amber-600)' }}>
              {item.weight}g
            </span>
          </div>

          {/* CTA */}
          <motion.button
            whileHover={{ background: 'var(--amber-800)' }}
            style={{
              marginTop: '1rem', width: '100%',
              padding: '0.6rem 1rem',
              background: 'var(--amber-700)',
              color: '#fdf6e9',
              fontFamily: "'Cinzel', serif", fontSize: '0.6rem',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              border: 'none', borderRadius: 1, cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            Reserve Now
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ─────────────────────────── FILTER CHIP ─────────────────────────── */
const Chip = ({ label, active, onClick }) => (
  <motion.button
    onClick={onClick}
    whileTap={{ scale: 0.95 }}
    style={{
      padding: '6px 16px',
      fontFamily: "'Cinzel', serif", fontSize: '0.58rem',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      border: active ? 'none' : '1px solid rgba(201,150,12,0.35)',
      background: active ? 'var(--amber-700)' : 'transparent',
      color: active ? '#fdf6e9' : 'var(--amber-700)',
      borderRadius: 1, cursor: 'pointer',
      whiteSpace: 'nowrap', flexShrink: 0,
      transition: 'all 0.2s',
    }}
  >
    {label}
  </motion.button>
);

/* ─────────────────────────── FILTER SECTION ─────────────────────────── */
const FilterSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div style={{ borderBottom: '1px solid rgba(201,150,12,0.12)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: open ? '0.9rem' : 0 }}
      >
        <span style={{ fontFamily: "'Cinzel', serif", fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--amber-800)' }}>{title}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} color="var(--amber-500)" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─────────────────────────── MAIN PAGE ─────────────────────────── */
const JewelleryCatalog = () => {
  const [filtered, setFiltered] = useState(mockJewellery);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [selectedKarat, setSelectedKarat] = useState([]);
  const [rentalDuration, setRentalDuration] = useState(null);
  const [priceMax, setPriceMax] = useState(50000);
  const [weightMax, setWeightMax] = useState(100);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const functionTabs = ['Mehendi','Sangeet','Wedding Day','Reception','Engagement'];
  const types = ['Necklace Set','Earrings','Maang Tikka','Bangles','Full Set'];
  const metals = ['Gold','Kundan','Diamond','Polki','Silver'];
  const karats = ['18K','22K','24K'];

  const toggle = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val]);

  const resetFilters = () => {
    setSelectedFunction(null); setSelectedTypes([]); setSelectedMetals([]);
    setSelectedKarat([]); setRentalDuration(null); setPriceMax(50000); setWeightMax(100); setSearchQuery('');
  };

  useEffect(() => {
    let r = [...mockJewellery];
    if (selectedFunction) r = r.filter(i => i.function.includes(selectedFunction));
    if (selectedTypes.length) r = r.filter(i => selectedTypes.includes(i.type));
    if (selectedMetals.length) r = r.filter(i => selectedMetals.includes(i.metal));
    if (selectedKarat.length) r = r.filter(i => i.karat && selectedKarat.includes(i.karat));
    if (rentalDuration) r = r.filter(i => i.rentalDuration === rentalDuration);
    r = r.filter(i => i.price <= priceMax && i.weight <= weightMax);
    if (searchQuery) r = r.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFiltered(r);
  }, [selectedFunction, selectedTypes, selectedMetals, selectedKarat, rentalDuration, priceMax, weightMax, searchQuery]);

  const activeFilterCount = [
    selectedFunction, ...selectedTypes, ...selectedMetals, ...selectedKarat,
    rentalDuration, priceMax < 50000, weightMax < 100
  ].filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--amber-50)', fontFamily: "'EB Garamond', serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Cinzel:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --amber-50: #fdf6e9; --amber-100: #fdedc8; --amber-200: #fad78a;
          --amber-300: #f5bc44; --amber-400: #e8a020; --amber-500: #c97f10;
          --amber-600: #a85f0a; --amber-700: #874508; --amber-800: #6b3006;
          --amber-900: #4a1e04; --gold: #c9960c; --gold-light: #f0c040;
        }
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=range] { -webkit-appearance: none; appearance: none; width: 100%; height: 2px; background: rgba(201,150,12,0.25); outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; border-radius: 50%; background: var(--amber-700); cursor: pointer; border: 2px solid var(--amber-200); }
        input[type=checkbox] { accent-color: var(--amber-700); width: 13px; height: 13px; }
        input[type=radio] { accent-color: var(--amber-700); width: 13px; height: 13px; }
        .search-input::placeholder { color: rgba(107,48,6,0.4); }
        .search-input:focus { outline: none; }
        @media (max-width: 1024px) { .catalog-layout { flex-direction: column !important; } .filter-panel { display: none; } .filter-panel.open { display: block !important; } }
      `}</style>

      {/* ── HERO BANNER ── */}
      <div style={{
        background: 'linear-gradient(120deg, var(--amber-900) 0%, var(--amber-800) 55%, var(--amber-600) 100%)',
        padding: 'clamp(3rem,8vw,5rem) clamp(1.5rem,5vw,4rem)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[500, 750].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: s, height: s, borderRadius: '50%',
            border: `1px solid rgba(240,192,64,${0.08 - i*0.03})`,
            right: -s*0.3, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none',
          }} />
        ))}

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.8 }}>
            <div style={{ fontFamily:"'Cinzel', serif", fontSize:'0.65rem', letterSpacing:'0.4em', color:'var(--amber-300)', textTransform:'uppercase', marginBottom:'1rem' }}>
              Curated Bridal Collection
            </div>
            <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'clamp(2.5rem,7vw,5rem)', fontWeight:300, color:'#fdf6e9', lineHeight:1.05, marginBottom:'1rem' }}>
              Complete Bridal Set<br /><em style={{ fontWeight:600, color:'var(--gold-light)' }}>for Wedding Day</em>
            </h1>
            <p style={{ fontFamily:"'EB Garamond', serif", fontSize:'clamp(1rem,2vw,1.2rem)', color:'rgba(253,246,233,0.7)', maxWidth:540, lineHeight:1.7, marginBottom:'2rem' }}>
              Curated collection of necklace, earrings, maang tikka, and bangles — designed to complement each other perfectly.
            </p>
            <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap', marginBottom:'2rem' }}>
              {['Necklace','Earrings','Maang Tikka','Bangles'].map(item => (
                <span key={item} style={{
                  fontFamily:"'Cinzel', serif", fontSize:'0.55rem', letterSpacing:'0.2em', textTransform:'uppercase',
                  padding:'5px 14px', background:'rgba(240,192,64,0.15)',
                  border:'1px solid rgba(240,192,64,0.3)', color:'var(--amber-200)', borderRadius:1,
                }}>{item}</span>
              ))}
            </div>
            <motion.button
              whileHover={{ background:'var(--gold-light)', color:'var(--amber-900)' }}
              style={{
                fontFamily:"'Cinzel', serif", fontSize:'0.65rem', letterSpacing:'0.25em', textTransform:'uppercase',
                padding:'14px 32px',
                background:'var(--amber-300)', color:'var(--amber-900)',
                border:'none', borderRadius:1, cursor:'pointer',
                fontWeight:600, transition:'background 0.25s, color 0.25s',
              }}
            >
              Rent the Complete Set — ₹45,000
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* ── FUNCTION TABS ── */}
      <div style={{
        position:'sticky', top:0, zIndex:40,
        background:'rgba(253,246,233,0.95)', backdropFilter:'blur(8px)',
        borderBottom:'1px solid rgba(201,150,12,0.15)',
      }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0.9rem clamp(1.5rem,5vw,4rem)', display:'flex', gap:'0.5rem', overflowX:'auto' }} className="hide-scroll">
          {functionTabs.map(tab => (
            <Chip
              key={tab} label={tab} active={selectedFunction === tab}
              onClick={() => setSelectedFunction(selectedFunction === tab ? null : tab)}
            />
          ))}
        </div>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2.5rem clamp(1.5rem,5vw,4rem)', display:'flex', gap:'2.5rem', alignItems:'flex-start' }} className="catalog-layout">

        {/* ── SIDEBAR ── */}
        <div className={`filter-panel ${showFilters ? 'open' : ''}`} style={{ width:260, flexShrink:0 }}>
          <div style={{
            background:'#fff', border:'1px solid rgba(201,150,12,0.15)',
            borderRadius:2, padding:'1.75rem', position:'sticky', top:70,
          }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:'1px solid rgba(201,150,12,0.12)' }}>
              <span style={{ fontFamily:"'Cinzel', serif", fontSize:'0.7rem', letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--amber-900)' }}>Refine</span>
              <button onClick={resetFilters} style={{ fontFamily:"'Cinzel', serif", fontSize:'0.55rem', letterSpacing:'0.15em', textTransform:'uppercase', color:'var(--amber-500)', background:'none', border:'none', cursor:'pointer' }}>
                Clear all
              </button>
            </div>

            <FilterSection title="Type">
              {types.map(t => (
                <label key={t} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggle(selectedTypes, setSelectedTypes, t)} />
                  <span style={{ fontFamily:"'EB Garamond', serif", fontSize:'1.05rem', color:'var(--amber-800)' }}>{t}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Metal">
              {metals.map(m => (
                <label key={m} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={selectedMetals.includes(m)} onChange={() => toggle(selectedMetals, setSelectedMetals, m)} />
                  <span style={{ fontFamily:"'EB Garamond', serif", fontSize:'1.05rem', color:'var(--amber-800)' }}>{m}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Karat">
              {karats.map(k => (
                <label key={k} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, cursor:'pointer' }}>
                  <input type="checkbox" checked={selectedKarat.includes(k)} onChange={() => toggle(selectedKarat, setSelectedKarat, k)} />
                  <span style={{ fontFamily:"'EB Garamond', serif", fontSize:'1.05rem', color:'var(--amber-800)' }}>{k}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title="Rental Duration">
              {[1,3,7].map(d => (
                <label key={d} style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, cursor:'pointer' }}>
                  <input type="radio" name="dur" checked={rentalDuration===d} onChange={() => setRentalDuration(rentalDuration===d ? null : d)} />
                  <span style={{ fontFamily:"'EB Garamond', serif", fontSize:'1.05rem', color:'var(--amber-800)' }}>{d} day{d>1?'s':''}</span>
                </label>
              ))}
            </FilterSection>

            <FilterSection title={`Price — ₹${priceMax.toLocaleString()}`}>
              <input type="range" min={0} max={50000} step={500} value={priceMax} onChange={e => setPriceMax(+e.target.value)} />
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'EB Garamond', serif", fontSize:'0.85rem', color:'var(--amber-500)', marginTop:6 }}>
                <span>₹0</span><span>₹50,000</span>
              </div>
            </FilterSection>

            <FilterSection title={`Weight — ${weightMax}g`}>
              <input type="range" min={0} max={100} step={1} value={weightMax} onChange={e => setWeightMax(+e.target.value)} />
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:"'EB Garamond', serif", fontSize:'0.85rem', color:'var(--amber-500)', marginTop:6 }}>
                <span>0g</span><span>100g</span>
              </div>
            </FilterSection>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div style={{ flex:1, minWidth:0 }}>
          {/* Toolbar */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem', flexWrap:'wrap' }}>
            {/* Search */}
            <div style={{
              flex:1, minWidth:180, display:'flex', alignItems:'center', gap:'0.6rem',
              border:'1px solid rgba(201,150,12,0.25)', borderRadius:2, padding:'0.55rem 1rem',
              background:'#fff',
            }}>
              <Search size={14} color="var(--amber-500)" />
              <input
                className="search-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search pieces..."
                style={{ border:'none', background:'transparent', fontFamily:"'EB Garamond', serif", fontSize:'1rem', color:'var(--amber-800)', flex:1 }}
              />
            </div>

            {/* Mobile filter toggle */}
            <motion.button
              whileTap={{ scale:0.97 }}
              onClick={() => setShowFilters(o => !o)}
              style={{
                display:'flex', alignItems:'center', gap:'0.5rem',
                fontFamily:"'Cinzel', serif", fontSize:'0.58rem', letterSpacing:'0.2em', textTransform:'uppercase',
                padding:'0.55rem 1.1rem',
                background: activeFilterCount > 0 ? 'var(--amber-700)' : '#fff',
                color: activeFilterCount > 0 ? '#fdf6e9' : 'var(--amber-700)',
                border:'1px solid rgba(201,150,12,0.3)', borderRadius:1, cursor:'pointer',
              }}
            >
              <SlidersHorizontal size={13} />
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </motion.button>

            <span style={{ fontFamily:"'Cormorant Garamond', serif", fontStyle:'italic', fontSize:'1rem', color:'var(--amber-600)', marginLeft:'auto' }}>
              {filtered.length} piece{filtered.length!==1?'s':''} found
            </span>
          </div>

          {/* Grid */}
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ textAlign:'center', padding:'5rem 2rem' }}
              >
                <div style={{ fontSize:'4rem', marginBottom:'1.5rem', opacity:0.4 }}>◈</div>
                <h3 style={{ fontFamily:'Cormorant Garamond, serif', fontSize:'2rem', color:'var(--amber-800)', marginBottom:'0.75rem' }}>No Pieces Found</h3>
                <p style={{ fontFamily:'EB Garamond, serif', fontSize:'1.1rem', color:'var(--amber-600)', marginBottom:'1.5rem' }}>Adjust your filters to discover more</p>
                <button onClick={resetFilters} style={{
                  fontFamily:'Cinzel, serif', fontSize:'0.6rem', letterSpacing:'0.2em', textTransform:'uppercase',
                  padding:'10px 24px', background:'var(--amber-700)', color:'#fdf6e9', border:'none', borderRadius:1, cursor:'pointer',
                }}>Clear All Filters</button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px, 1fr))', gap:'1.5rem' }}
              >
                {filtered.map((item, i) => (
                  <JewelleryCard
                    key={item.id}
                    item={item}
                    index={i}
                    isWishlisted={wishlist.includes(item.id)}
                    onWishlist={it => setWishlist(prev => prev.includes(it.id) ? prev.filter(x => x!==it.id) : [...prev, it.id])}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default JewelleryCatalog;