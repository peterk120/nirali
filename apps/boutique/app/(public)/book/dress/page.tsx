'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingStore } from '../../../../lib/stores/bookingStore';
import { BookingProgressBar } from '../../../../components/booking/BookingProgressBar';
import { DressCard } from '../../../../components/catalog/DressCard';
import fetcher from '../../../../lib/api';

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

  :root {
    --ivory:    #FFF8F8;
    --stone:    #F5E6E8;
    --mink:     #D4A0A8;
    --umber:    #A0525E;
    --espresso: #6B1F2A;
    --gold:     #C96E82;
    --gold-lt:  #F0C4CC;
  }

  .dress-root {
    min-height: 100vh;
    background: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    color: var(--espresso);
  }

  /* ── Header ── */
  .dress-header {
    padding: 48px 60px 36px;
    border-bottom: 1px solid var(--stone);
    position: relative;
  }
  .dress-header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 60px;
    width: 40px; height: 2px;
    background: var(--gold);
  }
  .dress-eyebrow {
    font-size: 10px; letter-spacing: 0.35em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 10px;
  }
  .dress-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 300; color: var(--espresso);
    margin: 0 0 8px;
  }
  .dress-title em { font-style: italic; color: var(--umber); }
  .dress-subtitle { font-size: 12px; letter-spacing: 0.1em; color: var(--mink); }

  /* ── Body ── */
  .dress-body {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 60px 80px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  @media (max-width: 700px) {
    .dress-header { padding: 36px 24px 28px; }
    .dress-header::after { left: 24px; }
    .dress-body { padding: 28px 24px 60px; }
  }

  /* ── Search ── */
  .search-wrap {
    position: relative;
    margin-bottom: 2px;
  }
  .search-input {
    width: 100%;
    padding: 14px 18px 14px 44px;
    border: 1px solid var(--stone);
    background: #fff;
    font-family: 'Jost', sans-serif;
    font-size: 13px; font-weight: 300;
    letter-spacing: 0.05em; color: var(--espresso);
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  }
  .search-input::placeholder { color: var(--mink); }
  .search-input:focus { border-color: var(--gold); }
  .search-icon {
    position: absolute;
    left: 16px; top: 50%; transform: translateY(-50%);
    color: var(--mink); pointer-events: none;
    font-size: 14px;
  }

  /* ── Selected dress preview ── */
  .selected-card {
    background: #fff;
    border: 1px solid var(--espresso);
    padding: 20px 24px;
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 20px;
    align-items: center;
    animation: fadeUp 0.3s ease;
    margin-bottom: 2px;
    position: relative;
  }
  .selected-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--gold);
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .selected-thumb {
    width: 80px; aspect-ratio: 3/4;
    object-fit: cover; display: block;
  }
  .selected-thumb-ph {
    width: 80px; aspect-ratio: 3/4;
    background: var(--stone);
    display: flex; align-items: center;
    justify-content: center; font-size: 24px; color: var(--mink);
  }
  .selected-info {}
  .selected-tag {
    font-size: 9px; letter-spacing: 0.3em;
    text-transform: uppercase; color: var(--gold);
    margin-bottom: 6px;
  }
  .selected-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; font-weight: 400; color: var(--espresso);
    margin-bottom: 3px;
  }
  .selected-cat { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--mink); margin-bottom: 8px; }
  .selected-price { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: var(--umber); }
  .selected-price span { font-family: 'Jost', sans-serif; font-size: 10px; letter-spacing: 0.12em; color: var(--mink); margin-left: 3px; }
  .btn-change {
    padding: 10px 22px;
    background: transparent;
    border: 1px solid var(--stone);
    font-family: 'Jost', sans-serif;
    font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--mink);
    cursor: pointer; white-space: nowrap;
    transition: all 0.2s;
  }
  .btn-change:hover { border-color: var(--espresso); color: var(--espresso); }

  /* ── Section heading ── */
  .section-heading {
    font-size: 9px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--mink);
    margin-bottom: 20px;
    display: flex; align-items: center; gap: 12px;
  }
  .section-heading::after { content: ''; flex: 1; height: 1px; background: var(--stone); }

  /* ── Dress grid ── */
  .dress-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  @media (max-width: 860px) { .dress-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px)  { .dress-grid { grid-template-columns: 1fr; } }

  /* dress grid item wrapper */
  .dress-grid-item {
    background: #fff;
    border: 1px solid var(--stone);
    overflow: hidden;
    transition: border-color 0.2s;
    display: flex;
    flex-direction: column;
  }
  .dress-grid-item:hover { border-color: var(--mink); }

  .dress-grid-item-footer {
    padding: 14px 16px;
    border-top: 1px solid var(--stone);
  }
  .btn-select {
    width: 100%;
    padding: 12px 0;
    background: var(--espresso);
    color: var(--ivory);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.28em; text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .btn-select:hover { background: var(--umber); }

  /* ── Loading skeleton ── */
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .skeleton-card {
    aspect-ratio: 3/4;
    background: linear-gradient(90deg, var(--stone) 25%, var(--ivory) 50%, var(--stone) 75%);
    background-size: 200% 100%;
    animation: shimmer 1.6s infinite;
  }
  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Empty state ── */
  .empty-state { padding: 60px 0; text-align: center; }
  .empty-icon  { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
  .empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px; font-weight: 300;
    color: var(--espresso); margin-bottom: 8px;
  }
  .empty-desc  { font-size: 12px; letter-spacing: 0.08em; color: var(--mink); }

  /* ── Error state ── */
  .error-state {
    padding: 28px 24px;
    border: 1px solid var(--gold-lt);
    background: #fff;
    display: flex; align-items: center; gap: 14px;
  }
  .error-icon  { font-size: 20px; flex-shrink: 0; }
  .error-text  { font-size: 13px; letter-spacing: 0.05em; color: var(--umber); }

  /* ── Footer ── */
  .dress-footer {
    padding: 32px 60px 48px;
    display: flex; justify-content: flex-end;
    border-top: 1px solid var(--stone);
  }
  @media (max-width: 700px) { .dress-footer { padding: 24px; } }
  .btn-continue {
    padding: 15px 48px;
    background: var(--espresso); color: var(--ivory);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    cursor: pointer; transition: background 0.2s;
  }
  .btn-continue:hover { background: var(--umber); }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const SelectDressPage = () => {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dressId      = searchParams.get('dressId');

  // ── Untouched store connection ─────────────────────────────────────────────
  const { step, selectedDress, setSelectedDress, setStep } = useBookingStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [dresses,     setDresses]     = useState<any[]>([]);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    const fetchDresses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetcher('/products');
        if (response.success && response.data) {
          const products = response.data as any[];
          const transformedDresses = products.map((product: any) => ({
            id: product._id || product.id,
            name: product.name,
            category: product.category,
            images: [product.image],
            rentalPricePerDay: product.price,
            depositAmount: product.price * 0.5,
            sizes: product.size ? [product.size] : ['S', 'M', 'L'],
            isAvailable: product.stock > 0,
            rating: 4.5,
            reviewCount: 10,
            slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            tags: [product.category],
            description: product.description,
            fabric: 'Premium',
            colors: product.color ? [product.color] : ['Various'],
          }));
          setDresses(transformedDresses);
        } else {
          throw new Error(response.error?.message || 'Failed to fetch dresses');
        }
      } catch (err: any) {
        console.error('Error fetching dresses:', err);
        setError(err.message || 'Failed to load dresses');
        setDresses([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDresses();
  }, []);

  const filteredDresses = dresses.filter(dress =>
    dress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dress.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (dressId && dresses.length > 0) {
      const dress = dresses.find(d => d.id === dressId);
      if (dress) {
        setSelectedDress(dress);
        setStep(2);
        router.push('/book/date');
      }
    }
  }, [dressId, dresses, setSelectedDress, setStep, router]);

  const handleSelectDress = (dress: any) => {
    setSelectedDress(dress);
    setStep(2);
    router.push('/book/date');
  };

  const handleContinue = () => {
    if (selectedDress) router.push('/book/date');
  };
  // ── End untouched logic ────────────────────────────────────────────────────

  return (
    <>
      <style>{css}</style>

      <div className="dress-root">
        <BookingProgressBar />

        {/* ── Header ── */}
        <div className="dress-header">
          <p className="dress-eyebrow">Step 1 of 4</p>
          <h1 className="dress-title">Select <em>Your Dress</em></h1>
          <p className="dress-subtitle">Choose the perfect piece for your special occasion</p>
        </div>

        {/* ── Body ── */}
        <div className="dress-body">

          {/* Search */}
          <div className="search-wrap">
            <span className="search-icon">✦</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search by name or category…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Selected dress preview */}
          {selectedDress && (
            <div className="selected-card">
              {selectedDress.images?.[0] ? (
                <img src={selectedDress.images[0]} alt={selectedDress.name} className="selected-thumb" />
              ) : (
                <div className="selected-thumb-ph">👗</div>
              )}
              <div className="selected-info">
                <div className="selected-tag">Selected</div>
                <div className="selected-name">{selectedDress.name}</div>
                <div className="selected-cat">{selectedDress.category}</div>
                <div className="selected-price">
                  ₹{selectedDress.rentalPricePerDay?.toLocaleString()}
                  <span>/day</span>
                </div>
              </div>
              <button className="btn-change" onClick={() => setSelectedDress(null)}>
                Change
              </button>
            </div>
          )}

          {/* Dress catalog */}
          {!selectedDress && (
            <>
              <div className="section-heading">Available Dresses</div>

              {/* Error */}
              {error && (
                <div className="error-state">
                  <span className="error-icon">✦</span>
                  <span className="error-text">{error}</span>
                </div>
              )}

              {/* Loading skeleton */}
              {isLoading && !error && (
                <div className="skeleton-grid">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="skeleton-card" />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!isLoading && !error && filteredDresses.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">👗</div>
                  <div className="empty-title">No dresses found</div>
                  <div className="empty-desc">Try a different search term</div>
                </div>
              )}

              {/* Grid */}
              {!isLoading && !error && filteredDresses.length > 0 && (
                <div className="dress-grid">
                  {filteredDresses.map(dress => (
                    <div key={dress.id} className="dress-grid-item">
                      <DressCard
                        id={dress.id}
                        name={dress.name}
                        category={dress.category}
                        images={dress.images}
                        rentalPricePerDay={dress.rentalPricePerDay}
                        depositAmount={dress.depositAmount}
                        sizes={dress.sizes}
                        isAvailable={dress.isAvailable}
                        rating={dress.rating}
                        slug={dress.slug}
                        tags={dress.tags}
                      />
                      <div className="dress-grid-item-footer">
                        <button
                          className="btn-select"
                          onClick={() => handleSelectDress(dress)}
                        >
                          Select Dress
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer CTA ── */}
        {selectedDress && (
          <div className="dress-footer">
            <button className="btn-continue" onClick={handleContinue}>
              Continue to Date Selection
            </button>
          </div>
        )}

      </div>
    </>
  );
};

export default SelectDressPage;