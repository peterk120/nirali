'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dress } from '@nirali-sai/types';
import { showAddedToCart } from '../../../../lib/toast';

// ─── Luxury Design Tokens ────────────────────────────────────────────────────
const css = `
  :root {
    --ivory:   #FFF8F8;
    --stone:   #F5E6E8;
    --mink:    #D4A0A8;
    --umber:   #A0525E;
    --espresso:#6B1F2A;
    --gold:    #C96E82;
    --gold-lt: #F0C4CC;
  }

  .catalog-root {
    min-height: 100vh;
    background: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    color: var(--espresso);
  }

  /* ── Hero banner ── */
  .catalog-hero {
    position: relative;
    padding: 80px 60px 60px;
    border-bottom: 1px solid var(--stone);
    overflow: hidden;
  }
  .catalog-hero::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--gold-lt) 0%, transparent 70%);
    opacity: 0.5;
    pointer-events: none;
  }
  .hero-label {
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 16px;
  }
  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 5vw, 76px);
    font-weight: 300;
    line-height: 1.05;
    letter-spacing: -0.01em;
    color: var(--espresso);
    margin: 0 0 20px;
  }
  .hero-title em {
    font-style: italic;
    color: var(--umber);
  }
  .hero-meta {
    font-size: clamp(11px, 2vw, 13px);
    letter-spacing: 0.1em;
    color: var(--mink);
  }
  .hero-divider {
    width: 40px;
    height: 1px;
    background: var(--gold);
    margin: 24px 0;
  }

  /* ── Layout ── */
  .catalog-body {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 0;
    align-items: start;
    padding: 0 60px 80px;
  }
  @media (max-width: 900px) {
    .catalog-body { grid-template-columns: 1fr; padding: 0 20px 60px; }
    .catalog-sidebar { display: none; }
    .catalog-hero { padding: 48px 20px 40px; }
    .mobile-filter-bar { display: flex !important; }
  }
  @media (max-width: 480px) {
    .catalog-body { padding: 0 16px 40px; }
    .catalog-hero { padding: 36px 16px 32px; }
  }

  /* ── Sidebar ── */
  .catalog-sidebar {
    position: sticky;
    top: 24px;
    padding: 48px 40px 48px 0;
    border-right: 1px solid var(--stone);
  }
  .sidebar-section { margin-bottom: 40px; }
  .sidebar-heading {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--mink);
    margin-bottom: 18px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .sidebar-heading::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--stone);
  }
  .filter-pill-group { display: flex; flex-wrap: wrap; gap: 8px; }
  .filter-pill {
    padding: 6px 16px;
    border: 1px solid var(--stone);
    background: transparent;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.08em;
    color: var(--umber);
    cursor: pointer;
    transition: all 0.2s ease;
    border-radius: 0;
  }
  .filter-pill:hover { border-color: var(--gold); color: var(--espresso); }
  .filter-pill.active { background: var(--espresso); border-color: var(--espresso); color: var(--ivory); }

  /* Price inputs */
  .price-range { display: flex; flex-direction: column; gap: 10px; }
  .price-inputs { display: flex; gap: 12px; align-items: center; }
  .price-input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid var(--stone);
    background: transparent;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    color: var(--espresso);
    outline: none;
    transition: border-color 0.2s;
  }
  .price-input:focus { border-color: var(--gold); }
  .price-sep { color: var(--mink); font-size: 12px; }

  /* ── Controls bar ── */
  .controls-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28px 0 28px 40px;
    border-bottom: 1px solid var(--stone);
  }
  .sort-group { display: flex; align-items: center; gap: 24px; }
  .sort-label {
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--mink);
  }
  .sort-btn {
    background: none;
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    letter-spacing: 0.08em;
    color: var(--umber);
    cursor: pointer;
    padding: 0;
    transition: color 0.2s;
  }
  .sort-btn:hover, .sort-btn.active { color: var(--espresso); font-weight: 500; }
  .sort-btn.active { text-decoration: underline; text-underline-offset: 4px; }
  .view-toggle { display: flex; gap: 12px; align-items: center; }
  .view-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--mink);
    transition: color 0.2s;
    padding: 4px;
    display: flex;
    align-items: center;
  }
  .view-btn.active { color: var(--espresso); }

  /* ── Active filter chips ── */
  .active-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 4px;
    margin-top: 16px;
  }
  .chip {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 14px;
    background: var(--espresso);
    color: var(--ivory);
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
  .chip-remove {
    background: none;
    border: none;
    color: var(--mink);
    cursor: pointer;
    font-size: 14px;
    line-height: 1;
    padding: 0;
    transition: color 0.2s;
  }
  .chip-remove:hover { color: var(--ivory); }

  /* ── Grid ── */
  .dress-grid-wrapper { padding: 0 0 0 40px; }
  .dress-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    margin-top: 32px;
  }
  .dress-grid.list-view { grid-template-columns: 1fr; gap: 1px; }
  @media (max-width: 1100px) {
    .dress-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .dress-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .dress-grid-wrapper { padding: 0; }
  }
  @media (max-width: 480px) {
    .dress-grid { grid-template-columns: 1fr; }
  }

  /* ── Dress card (grid) ── */
  .luxury-card {
    position: relative;
    background: #fff;
    cursor: pointer;
    overflow: hidden;
    aspect-ratio: 3/4;
  }
  .luxury-card:hover .card-overlay { opacity: 1; }
  .luxury-card:hover .card-img { transform: scale(1.04); }
  .card-img-wrap { position: relative; width: 100%; height: 100%; overflow: hidden; }
  .card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    display: block;
  }
  .card-img-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--stone) 0%, var(--ivory) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: clamp(32px, 5vw, 48px);
    color: var(--mink);
  }
  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(44,33,24,0.85) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: clamp(16px, 3vw, 24px);
  }
  .card-overlay-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(16px, 3vw, 20px);
    font-weight: 300;
    color: var(--ivory);
    margin-bottom: 4px;
    line-height: 1.3;
  }
  .card-overlay-price {
    font-size: clamp(11px, 2vw, 13px);
    letter-spacing: 0.1em;
    color: var(--gold-lt);
  }
  .card-overlay-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 14px;
  }
  .card-overlay-btn {
    padding: clamp(8px, 2vw, 10px) 0;
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: clamp(10px, 2vw, 11px);
    font-weight: 500;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    width: 100%;
    transition: all 0.2s ease;
  }
  .reserve-btn {
    background: var(--gold);
    color: var(--espresso);
  }
  .reserve-btn:hover {
    background: var(--umber);
    color: var(--ivory);
  }
  .cart-btn {
    background: transparent;
    color: var(--ivory);
    border: 1px solid var(--ivory);
  }
  .cart-btn:hover {
    background: var(--ivory);
    color: var(--espresso);
  }
    transition: background 0.2s;
  }
  .card-overlay-btn:hover { background: var(--gold-lt); }
  .card-info { padding: clamp(10px, 2vw, 14px) 0 0; }
  .card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(14px, 2.5vw, 16px);
    font-weight: 400;
    color: var(--espresso);
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  }
  .card-meta { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
  .card-category { font-size: clamp(10px, 2vw, 11px); letter-spacing: 0.15em; text-transform: uppercase; color: var(--mink); }
  .card-price { font-size: clamp(12px, 2.5vw, 13px); font-weight: 500; color: var(--umber); }
  .card-fav {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(250,248,245,0.85);
    border: none;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    backdrop-filter: blur(4px);
    transition: background 0.2s;
    z-index: 2;
  }
  .card-fav:hover { background: var(--ivory); }

  /* ── Dress card (list) ── */
  .luxury-card-list {
    display: grid;
    grid-template-columns: 200px 1fr auto;
    gap: 0;
    background: #fff;
    height: 180px;
    overflow: hidden;
    cursor: pointer;
    transition: box-shadow 0.3s;
  }
  .luxury-card-list:hover { box-shadow: 0 8px 40px rgba(44,33,24,0.1); }
  .list-img { width: 100%; height: 100%; object-fit: cover; }
  .list-info {
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
  }
  .list-name { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 400; color: var(--espresso); }
  .list-details { font-size: 12px; letter-spacing: 0.1em; color: var(--mink); text-transform: uppercase; }
  .list-price-col {
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 12px;
    border-left: 1px solid var(--stone);
  }
  .list-price { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 300; color: var(--umber); }
  .list-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
  }
  .list-cta {
    padding: 8px 20px;
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
  }
  .list-cta.reserve-btn {
    background: var(--espresso);
    color: var(--ivory);
  }
  .list-cta.reserve-btn:hover {
    background: var(--umber);
  }
  .list-cta.cart-btn {
    background: transparent;
    color: var(--espresso);
    border: 1px solid var(--espresso);
  }
  .list-cta.cart-btn:hover {
    background: var(--espresso);
    color: var(--ivory);
  }

  /* ── Load more ── */
  .load-more-wrap {
    padding: 60px 0 0 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .load-more-btn {
    padding: 14px 48px;
    background: transparent;
    border: 1px solid var(--espresso);
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--espresso);
    cursor: pointer;
    transition: all 0.25s ease;
  }
  .load-more-btn:hover { background: var(--espresso); color: var(--ivory); }
  .load-more-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .load-more-text { font-size: 11px; letter-spacing: 0.1em; color: var(--mink); }

  /* ── Empty state ── */
  .empty-state { padding: 80px 40px; text-align: center; }
  .empty-icon { font-size: 56px; margin-bottom: 24px; opacity: 0.5; }
  .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 300; color: var(--espresso); margin-bottom: 12px; }
  .empty-desc { font-size: 13px; letter-spacing: 0.05em; color: var(--mink); margin-bottom: 32px; }
  .empty-btn {
    padding: 12px 36px;
    background: var(--espresso);
    color: var(--ivory);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .empty-btn:hover { background: var(--umber); }

  /* ── Skeleton ── */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
    margin-top: 32px;
  }
  .skeleton-card {
    aspect-ratio: 3/4;
    background: linear-gradient(90deg, var(--stone) 25%, var(--ivory) 50%, var(--stone) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Mobile filter bar ── */
  .mobile-filter-bar {
    display: none;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--stone);
    position: sticky;
    top: 0;
    background: var(--ivory);
    z-index: 10;
  }
  .mobile-filter-btn {
    padding: 10px 24px;
    background: var(--espresso);
    color: var(--ivory);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
  }
  .mobile-count { font-size: 12px; letter-spacing: 0.1em; color: var(--mink); }

  /* ── Mobile Drawer ── */
  .drawer-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(44,33,24,0.5);
    z-index: 100;
    backdrop-filter: blur(2px);
    animation: fadeIn 0.25s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .drawer {
    position: fixed;
    right: 0; top: 0; bottom: 0;
    width: min(360px, 90vw);
    background: var(--ivory);
    z-index: 101;
    padding: 32px 28px;
    overflow-y: auto;
    animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }
  @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
  .drawer-close {
    background: none;
    border: none;
    font-size: 22px;
    cursor: pointer;
    color: var(--umber);
    position: absolute;
    top: 20px;
    right: 24px;
  }
  .drawer-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 300;
    margin-bottom: 32px;
    color: var(--espresso);
  }
`;

// ─── Types ───────────────────────────────────────────────────────────────────

const transformDressToCardProps = (dress: Dress) => ({
  id: dress.id,
  name: dress.name,
  price: dress.price || dress.finalPrice || dress.basePrice || 0,
  category: dress.category,
  color: dress.colors?.[0]?.name || dress.color || 'N/A',
  size: dress.sizes?.[0]?.size || dress.size || 'N/A',
  image: dress.images?.[0]?.url || dress.image || null,
  isFavorite: false,
  // ✅ slug added so Reserve can route correctly
  slug: (dress as any).slug || String(dress.id),
});

interface DressCatalogClientProps {
  searchParams: Record<string, string | string[] | undefined>;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ['All', 'Lehenga', 'Saree', 'Gown', 'Anarkali', 'Sharara'];
const COLORS = ['Ivory', 'Blush', 'Red', 'Navy', 'Sage', 'Champagne', 'Black'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SORT_OPTIONS = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'price_asc', label: 'Price ↑' },
  { value: 'price_desc', label: 'Price ↓' },
  { value: 'newest', label: 'Newest' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function LuxurySidebar({ category, color, size, priceMin, priceMax, onFilterChange }: any) {
  const [localMin, setLocalMin] = useState(priceMin || '');
  const [localMax, setLocalMax] = useState(priceMax || '');

  return (
    <aside className="catalog-sidebar">
      <div className="sidebar-section">
        <div className="sidebar-heading">Category</div>
        <div className="filter-pill-group">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`filter-pill ${(c === 'All' && !category) || c === category ? 'active' : ''}`}
              onClick={() => onFilterChange('category', c === 'All' ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">Colour</div>
        <div className="filter-pill-group">
          {COLORS.map(c => (
            <button
              key={c}
              className={`filter-pill ${c === color ? 'active' : ''}`}
              onClick={() => onFilterChange('color', c === color ? null : c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">Size</div>
        <div className="filter-pill-group">
          {SIZES.map(s => (
            <button
              key={s}
              className={`filter-pill ${s === size ? 'active' : ''}`}
              onClick={() => onFilterChange('size', s === size ? null : s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-heading">Price Range (₹)</div>
        <div className="price-range">
          <div className="price-inputs">
            <input
              className="price-input"
              placeholder="Min"
              value={localMin}
              onChange={e => setLocalMin(e.target.value)}
              onBlur={() => onFilterChange('priceMin', localMin || null)}
              type="number"
            />
            <span className="price-sep">—</span>
            <input
              className="price-input"
              placeholder="Max"
              value={localMax}
              onChange={e => setLocalMax(e.target.value)}
              onBlur={() => onFilterChange('priceMax', localMax || null)}
              type="number"
            />
          </div>
        </div>
      </div>
    </aside>
  );
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="0" width="7" height="7" /><rect x="9" y="0" width="7" height="7" />
      <rect x="0" y="9" width="7" height="7" /><rect x="9" y="9" width="7" height="7" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <rect x="0" y="0" width="16" height="3" /><rect x="0" y="6" width="16" height="3" />
      <rect x="0" y="12" width="16" height="3" />
    </svg>
  );
}

// ─── LuxuryDressCard ─────────────────────────────────────────────────────────
// ✅ Now accepts onReserve callback for routing

type CardProps = ReturnType<typeof transformDressToCardProps>;

function LuxuryDressCard({
  dress,
  viewMode,
  onReserve,
}: {
  dress: CardProps;
  viewMode: 'grid' | 'list';
  onReserve: (slug: string) => void;
}) {
  const [isFav, setIsFav] = useState(dress.isFavorite);

  if (viewMode === 'list') {
    return (
      // List view - clicking navigates to details page
      <div className="luxury-card-list" onClick={() => {
        // Navigate to dress details page
        window.location.href = `/catalog/dresses/${dress.slug}`;
      }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {dress.image ? (
            <img src={dress.image} alt={dress.name} className="list-img" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'var(--stone)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>👗</div>
          )}
        </div>
        <div className="list-info">
          <div className="list-name">{dress.name}</div>
          <div className="list-details">{dress.category} · {dress.color} · Size {dress.size}</div>
        </div>
        <div className="list-price-col">
          <div className="list-price">₹{dress.price?.toLocaleString()}</div>
          {/* Reserve and Add to Cart buttons for list view */}
          <div className="list-buttons">
            <button
              className="list-cta reserve-btn"
              onClick={e => { e.stopPropagation(); onReserve(dress.slug); }}
            >
              Reserve
            </button>
            <button
              className="list-cta cart-btn"
              onClick={e => { 
                e.stopPropagation(); 
                // Add to cart functionality
                const cartItem = {
                  id: dress.id,
                  name: dress.name,
                  price: dress.price,
                  image: dress.image,
                  quantity: 1
                };
                            
                // Get existing cart from localStorage
                const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                            
                // Check if item already exists
                const existingItemIndex = existingCart.findIndex((item: any) => item.id === cartItem.id);
                            
                if (existingItemIndex > -1) {
                  // Update quantity if item exists
                  existingCart[existingItemIndex].quantity += 1;
                } else {
                  // Add new item
                  existingCart.push(cartItem);
                }
                            
                // Save back to localStorage
                localStorage.setItem('cart', JSON.stringify(existingCart));
                            
                // Show success message using a toast notification
                showAddedToCart(dress.name);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    // Card container - clicking navigates to details page
    <div className="luxury-card" onClick={() => {
      // Navigate to dress details page
      window.location.href = `/catalog/dresses/${dress.slug}`;
    }}>
      <div className="card-img-wrap">
        {dress.image ? (
          <img src={dress.image} alt={dress.name} className="card-img" />
        ) : (
          <div className="card-img-placeholder">👗</div>
        )}
        <div className="card-overlay">
          <div className="card-overlay-name">{dress.name}</div>
          <div className="card-overlay-price">₹{dress.price?.toLocaleString()} / day</div>
          {/* Reserve Now and Add to Cart buttons */}
          <div className="card-overlay-buttons">
            <button
              className="card-overlay-btn reserve-btn"
              onClick={e => { e.stopPropagation(); onReserve(dress.slug); }}
            >
              Reserve Now
            </button>
            <button
              className="card-overlay-btn cart-btn"
              onClick={e => { 
                e.stopPropagation(); 
                // Add to cart functionality
                const cartItem = {
                  id: dress.id,
                  name: dress.name,
                  price: dress.price,
                  image: dress.image,
                  quantity: 1
                };
                            
                // Get existing cart from localStorage
                const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
                            
                // Check if item already exists
                const existingItemIndex = existingCart.findIndex((item: any) => item.id === cartItem.id);
                            
                if (existingItemIndex > -1) {
                  // Update quantity if item exists
                  existingCart[existingItemIndex].quantity += 1;
                } else {
                  // Add new item
                  existingCart.push(cartItem);
                }
                            
                // Save back to localStorage
                localStorage.setItem('cart', JSON.stringify(existingCart));
                            
                // Show success message using a toast notification
                showAddedToCart(dress.name);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
        {/* ✅ Fav button does NOT trigger card navigation */}
        <button
          className="card-fav"
          onClick={e => { e.stopPropagation(); setIsFav(f => !f); }}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>
      <div className="card-info">
        <div className="card-name">{dress.name}</div>
        <div className="card-meta">
          <span className="card-category">{dress.category}</span>
          <span className="card-price">₹{dress.price?.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const DressCatalogClient: React.FC<DressCatalogClientProps> = ({ searchParams }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // ─── Param helpers ──────────────────────────────────────────────────────────
  const getParam = (key: string) => {
    const v = searchParams[key];
    return Array.isArray(v) ? v[0] : v;
  };
  const category = getParam('category');
  const color    = getParam('color');
  const size     = getParam('size');
  const priceMin = getParam('priceMin');
  const priceMax = getParam('priceMax');
  const sort     = getParam('sort') || 'popular';
  const page     = parseInt(getParam('page') || '1');

  // ─── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchDresses = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (color)    params.append('color', color);
        if (size)     params.append('size', size);
        if (priceMin) params.append('priceMin', priceMin);
        if (priceMax) params.append('priceMax', priceMax);
        if (sort)     params.append('sort', sort);
        params.append('page', String(page));

        const response = await fetch(`/api/products?${params.toString()}`);
        const result = await response.json();

        if (result.success) {
          const fetchedDresses: Dress[] = result.data.map((product: any) => ({
            id: product._id || product.id,
            name: product.name,
            category: product.category,
            images: [{ url: product.image }],
            colors: product.color ? [{ name: product.color }] : [],
            sizes: product.size ? [{ size: product.size }] : [],
            rentalPricePerDay: product.price,
            depositAmount: product.price * 0.2,
            isAvailable: product.stock > 0,
            rating: 4.5,
            reviewCount: 5,
            // ✅ slug built here so routing always works
            slug: product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            tags: [product.category],
            price: product.price,
            color: product.color || '',
            size: product.size || '',
            image: product.image,
            description: product.description,
            isFavorite: false,
          }));
          setDresses(fetchedDresses);
          setHasMore(result.hasMore || result.data.length === (result.pageSize || 12));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDresses();
  }, [category, color, size, priceMin, priceMax, sort, page]);

  // ─── URL builder ────────────────────────────────────────────────────────────
  const buildUrl = (overrides: Record<string, string | null>) => {
    const params = new URLSearchParams();
    const merged = { category, color, size, priceMin, priceMax, sort, ...overrides };
    Object.entries(merged).forEach(([k, v]) => { if (v) params.set(k, v); });
    params.set('page', '1');
    return `/catalog/dresses?${params.toString()}`;
  };

  const handleFilterChange = (filterName: string, value: string | null) =>
    router.push(buildUrl({ [filterName]: value }) as any);

  const handleSortChange = (value: string) =>
    router.push(buildUrl({ sort: value }) as any);

  const handleClearFilters = () => router.push('/catalog/dresses' as any);

  const handleLoadMore = () => {
    const params = new URLSearchParams();
    Object.entries({ category, color, size, priceMin, priceMax, sort }).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set('page', String(page + 1));
    router.push(`/catalog/dresses?${params.toString()}`);
  };

  // ✅ Reserve handler — routes to booking page using dress ID
  const handleReserve = (slug: string) => {
    // Find the dress object by slug to get the ID
    const dress = dresses.find(d => (d as any).slug === slug || String(d.id) === slug);
    if (dress) {
      router.push(`/book/dress?dressId=${dress.id}`);
    } else {
      // Fallback: try to use the slug as ID if dress not found
      router.push(`/book/dress?dressId=${slug}`);
    }
  };

  // ─── Active filters ──────────────────────────────────────────────────────────
  const activeFilters = [
    category ? { name: 'category', label: category }            : null,
    color    ? { name: 'color',    label: color }               : null,
    size     ? { name: 'size',     label: `Size ${size}` }      : null,
    priceMin ? { name: 'priceMin', label: `From ₹${priceMin}` } : null,
    priceMax ? { name: 'priceMax', label: `To ₹${priceMax}` }   : null,
  ].filter(Boolean) as { name: string; label: string }[];

  const cardDresses = dresses.map(transformDressToCardProps);

  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap"
      />

      <div className="catalog-root">
        {/* Hero */}
        <div className="catalog-hero">
          <p className="hero-label">Nirali Sai Bridal Atelier</p>
          <h1 className="hero-title">Bridal <em>Collections</em></h1>
          <div className="hero-divider" />
          <p className="hero-meta">
            {loading ? 'Curating your selection…' : `${dresses.length} pieces available for rental`}
          </p>
        </div>

        {/* Mobile sticky bar */}
        <div className="mobile-filter-bar">
          <span className="mobile-count">{dresses.length} pieces</span>
          <button className="mobile-filter-btn" onClick={() => setIsDrawerOpen(true)}>
            Filters &amp; Sort
          </button>
        </div>

        {/* Active chips */}
        {activeFilters.length > 0 && (
          <div
            className="active-chips"
            style={{ padding: isMobile ? '12px 24px' : '16px 60px' }}
          >
            {activeFilters.map(f => (
              <span key={f.name} className="chip">
                {f.label}
                <button className="chip-remove" onClick={() => handleFilterChange(f.name, null)}>×</button>
              </span>
            ))}
            <button
              style={{
                background: 'none', border: '1px solid var(--mink)', padding: '5px 14px',
                fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                cursor: 'pointer', color: 'var(--mink)', fontFamily: 'Jost, sans-serif',
              }}
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          </div>
        )}

        {/* Body */}
        <div className="catalog-body">
          {/* Desktop Sidebar */}
          <LuxurySidebar
            category={category}
            color={color}
            size={size}
            priceMin={priceMin ? parseInt(priceMin) : undefined}
            priceMax={priceMax ? parseInt(priceMax) : undefined}
            onFilterChange={handleFilterChange}
          />

          {/* Main content */}
          <div>
            {/* Controls bar */}
            <div className="controls-bar">
              <div className="sort-group">
                <span className="sort-label">Sort</span>
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    className={`sort-btn ${sort === o.value ? 'active' : ''}`}
                    onClick={() => handleSortChange(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
              <div className="view-toggle">
                <button className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                  <GridIcon />
                </button>
                <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} onClick={() => setViewMode('list')}>
                  <ListIcon />
                </button>
              </div>
            </div>

            {/* Grid / List / Skeleton / Empty */}
            <div className="dress-grid-wrapper">
              {loading ? (
                <div className="skeleton-grid">
                  {[...Array(9)].map((_, i) => <div key={i} className="skeleton-card" />)}
                </div>
              ) : dresses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">👗</div>
                  <h3 className="empty-title">No pieces match your selection</h3>
                  <p className="empty-desc">Try refining your filters to discover our curated collection</p>
                  <button className="empty-btn" onClick={handleClearFilters}>Clear Filters</button>
                </div>
              ) : (
                <div className={`dress-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                  {cardDresses.map(dress => (
                    // ✅ onReserve wired in
                    <LuxuryDressCard
                      key={dress.id}
                      dress={dress}
                      viewMode={viewMode}
                      onReserve={handleReserve}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Load more */}
            {!loading && hasMore && dresses.length > 0 && (
              <div className="load-more-wrap">
                <button className="load-more-btn" onClick={handleLoadMore}>
                  Discover More
                </button>
                <span className="load-more-text">Showing {dresses.length} of many</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {isDrawerOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)} />
          <div className="drawer">
            <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>×</button>
            <div className="drawer-title">Refine</div>

            <div style={{ marginBottom: 32 }}>
              <div className="sidebar-heading">Sort By</div>
              <div className="filter-pill-group">
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    className={`filter-pill ${sort === o.value ? 'active' : ''}`}
                    onClick={() => { handleSortChange(o.value); setIsDrawerOpen(false); }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <LuxurySidebar
              category={category}
              color={color}
              size={size}
              priceMin={priceMin ? parseInt(priceMin) : undefined}
              priceMax={priceMax ? parseInt(priceMax) : undefined}
              onFilterChange={(name: string, val: string | null) => {
                handleFilterChange(name, val);
                setIsDrawerOpen(false);
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default DressCatalogClient;