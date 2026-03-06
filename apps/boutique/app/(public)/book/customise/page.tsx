'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '../../../../lib/stores/bookingStore';
import { BookingProgressBar } from '../../../../components/booking/BookingProgressBar';
import { CustomFitting } from '../../../../components/features/CustomFitting';

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

  .cust-root {
    min-height: 100vh;
    background: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    color: var(--espresso);
  }

  /* ── Page header ── */
  .cust-header {
    padding: 48px 60px 36px;
    border-bottom: 1px solid var(--stone);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    position: relative;
  }
  .cust-header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 60px;
    width: 40px; height: 2px;
    background: var(--gold);
  }
  .cust-header-left {}
  .cust-eyebrow {
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .cust-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 300;
    letter-spacing: 0.01em;
    color: var(--espresso);
    margin: 0 0 8px;
  }
  .cust-title em { font-style: italic; color: var(--umber); }
  .cust-subtitle {
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--mink);
  }
  .cust-back {
    background: none;
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--mink);
    cursor: pointer;
    white-space: nowrap;
    padding: 0;
    transition: color 0.2s;
    flex-shrink: 0;
  }
  .cust-back:hover { color: var(--espresso); }

  /* ── Body grid ── */
  .cust-body {
    display: grid;
    grid-template-columns: 260px 1fr;
    gap: 0;
    padding: 0 60px 80px;
    align-items: start;
  }
  @media (max-width: 860px) {
    .cust-body { grid-template-columns: 1fr; padding: 0 24px 60px; }
    .cust-header { padding: 36px 24px 28px; }
    .cust-header::after { left: 24px; }
    .cust-footer { padding: 0 24px 40px; }
  }

  /* ── Sidebar (dress info) ── */
  .cust-sidebar {
    padding: 40px 32px 40px 0;
    border-right: 1px solid var(--stone);
    position: sticky;
    top: 24px;
  }
  .dress-info-card {
    background: #fff;
    border: 1px solid var(--stone);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .dress-thumb {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
  }
  .dress-thumb-placeholder {
    width: 100%;
    aspect-ratio: 3/4;
    background: var(--stone);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: var(--mink);
  }
  .dress-info-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    font-weight: 400;
    color: var(--espresso);
  }
  .dress-info-cat {
    font-size: 10px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mink);
    margin-top: 2px;
  }
  .dress-info-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px;
    color: var(--umber);
    margin-top: 4px;
  }
  .dress-info-price span {
    font-family: 'Jost', sans-serif;
    font-size: 10px;
    letter-spacing: 0.15em;
    color: var(--mink);
    margin-left: 4px;
  }

  /* ── Main content ── */
  .cust-main {
    padding: 40px 0 0 48px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  @media (max-width: 860px) {
    .cust-main { padding: 32px 0 0 0; }
    .cust-sidebar { border-right: none; border-bottom: 1px solid var(--stone); padding: 24px 0 24px 0; }
  }

  /* Shared section card */
  .section-card {
    background: #fff;
    border: 1px solid var(--stone);
    padding: 28px 28px 32px;
    margin-bottom: 2px;
    transition: border-color 0.25s;
  }
  .section-card:focus-within { border-color: var(--mink); }

  .section-heading {
    font-size: 9px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--mink);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-heading::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--stone);
  }

  /* ── Size pills ── */
  .size-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .size-pill {
    padding: 8px 20px;
    border: 1px solid var(--stone);
    background: transparent;
    font-family: 'Jost', sans-serif;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: 0.12em;
    color: var(--umber);
    cursor: pointer;
    transition: all 0.2s;
  }
  .size-pill:hover { border-color: var(--gold); color: var(--espresso); }
  .size-pill.active {
    background: var(--espresso);
    border-color: var(--espresso);
    color: var(--ivory);
  }

  /* ── Textarea ── */
  .luxury-textarea {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid var(--stone);
    background: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 300;
    color: var(--espresso);
    resize: none;
    outline: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
    letter-spacing: 0.04em;
    line-height: 1.7;
  }
  .luxury-textarea::placeholder { color: var(--mink); }
  .luxury-textarea:focus { border-color: var(--gold); }

  /* ── Jewellery rows ── */
  .jewellery-list { display: flex; flex-direction: column; gap: 8px; }
  .jewellery-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    border: 1px solid var(--stone);
    background: var(--ivory);
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    gap: 12px;
  }
  .jewellery-row:hover { border-color: var(--mink); }
  .jewellery-row.selected { border-color: var(--espresso); background: #fff; }
  .jewellery-row-left { display: flex; flex-direction: column; gap: 3px; }
  .jewellery-name {
    font-size: 13px;
    letter-spacing: 0.06em;
    color: var(--espresso);
  }
  .jewellery-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: var(--umber);
  }
  /* custom checkbox */
  .jcheck {
    width: 18px; height: 18px;
    border: 1px solid var(--mink);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    transition: all 0.2s;
    background: transparent;
  }
  .jewellery-row.selected .jcheck {
    background: var(--espresso);
    border-color: var(--espresso);
  }
  .jcheck-mark {
    color: var(--ivory);
    font-size: 11px;
    line-height: 1;
  }

  /* ── Footer bar ── */
  .cust-footer {
    padding: 0 60px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }
  .total-block { display: flex; flex-direction: column; gap: 3px; }
  .total-label {
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--mink);
  }
  .total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 30px;
    font-weight: 300;
    color: var(--espresso);
  }
  .total-value sup {
    font-family: 'Jost', sans-serif;
    font-size: 13px;
    font-weight: 400;
    vertical-align: super;
    margin-right: 2px;
    color: var(--umber);
  }

  .btn-continue {
    padding: 15px 48px;
    background: var(--espresso);
    color: var(--ivory);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
    white-space: nowrap;
  }
  .btn-continue:hover { background: var(--umber); }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const CustomisePage = () => {
  const router = useRouter();

  // ── All store logic untouched ──────────────────────────────────────────────
  const {
    step,
    selectedDress,
    bookingItems, // Support multiple items
    selectedSize,
    selectedDate,
    returnDate,
    customMeasurements,
    specialInstructions,
    selectedJewellery,
    setStep,
    setSelectedSize,
    setCustomMeasurements,
    setSpecialInstructions,
    setSelectedJewellery,
  } = useBookingStore();

  const itemsToBook = bookingItems.length > 0 ? bookingItems : (selectedDress ? [selectedDress] : []);

  // Enhanced state for individual product size customization
  const [productSizes, setProductSizes] = useState<{[key: string]: string}>({});
  const [showSizeSelector, setShowSizeSelector] = useState<string | null>(null); // productId showing size selector

  const [isCustomFittingEnabled, setIsCustomFittingEnabled] = useState(false);
  const [jewelleryOptions] = useState([
    { id: 'j1', name: 'Traditional Necklace Set', price: 800 },
    { id: 'j2', name: 'Diamond Stud Earrings', price: 1200 },
    { id: 'j3', name: 'Bangles Set', price: 600 },
    { id: 'j4', name: 'Maang Tikka', price: 700 },
  ]);

  const handleSizeChange = (size: string) => setSelectedSize(size);

  // Enhanced size handlers for individual products
  const handleProductSizeSelect = (productId: string, size: string) => {
    setProductSizes(prev => ({ ...prev, [productId]: size }));
    setShowSizeSelector(null);
  };

  const handleChangeSizeClick = (productId: string) => {
    setShowSizeSelector(showSizeSelector === productId ? null : productId);
  };

  const handleJewelleryToggle = (jewelleryId: string) => {
    if (selectedJewellery.includes(jewelleryId)) {
      setSelectedJewellery(selectedJewellery.filter(id => id !== jewelleryId));
    } else {
      setSelectedJewellery([...selectedJewellery, jewelleryId]);
    }
  };

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

  const handleContinue = () => {
    setStep(4);
    router.push('/book/review');
  };

  const handleBack = () => {
    setStep(2);
    router.push('/book/date');
  };

  const itemsTotal = itemsToBook.reduce((total, item) => {
    const price = item.price || item.rentalPricePerDay || 0;
    const qty = item.quantity || 1;
    return total + (price * qty);
  }, 0);

  const totalPrice = itemsTotal +
    (isCustomFittingEnabled ? 500 : 0) +
    selectedJewellery.reduce((total, id) => {
      const jewellery = jewelleryOptions.find(j => j.id === id);
      return total + (jewellery ? jewellery.price : 0);
    }, 0);
  // ── End untouched logic ────────────────────────────────────────────────────

  return (
    <>
      <style>{css}</style>

      <div className="cust-root">
        <BookingProgressBar />

        {/* ── Header ── */}
        <div className="cust-header">
          <div className="cust-header-left">
            <p className="cust-eyebrow">Step 3 of 4</p>
            <h1 className="cust-title">Personalise <em>Your Order</em></h1>
            <p className="cust-subtitle">Tailor every detail to your vision</p>
          </div>
          <button className="cust-back" onClick={handleBack}>
            ← Date Selection
          </button>
        </div>

        {/* ── Body ── */}
        <div className="cust-body">

          {/* Sidebar — dress summary */}
          <div className="cust-sidebar">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {itemsToBook.map((item, idx) => (
                <div key={idx} className="dress-info-card" style={{ position: 'relative' }}>
                  {(item.image || item.images?.[0]) ? (
                    <img
                      src={item.image || item.images[0]}
                      alt={item.name}
                      className="dress-thumb"
                    />
                  ) : (
                    <div className="dress-thumb-placeholder">👗</div>
                  )}
                  <div>
                    <div className="dress-info-name">{item.name}</div>
                    <div className="dress-info-cat">{item.category}</div>
                    <div className="dress-info-price">
                      ₹{(item.price || item.rentalPricePerDay || 0).toLocaleString()}
                      <span>/day</span>
                    </div>
                    
                    {/* Size display with change button */}
                    <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--stone)' }}>
                      <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--mink)', marginBottom: '4px' }}>
                        Selected Size
                      </div>
                      {showSizeSelector === item.id ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                          {(item.sizes || ['S', 'M', 'L', 'XL']).map(size => (
                            <button
                              key={size}
                              onClick={() => handleProductSizeSelect(item.id, size)}
                              style={{
                                padding: '6px 12px',
                                border: productSizes[item.id] === size ? '1px solid var(--espresso)' : '1px solid var(--stone)',
                                background: productSizes[item.id] === size ? 'var(--espresso)' : 'transparent',
                                color: productSizes[item.id] === size ? '#fff' : 'var(--umber)',
                                fontSize: '11px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--espresso)' }}>
                            {productSizes[item.id] || item.selectedSize || selectedSize || 'Not selected'}
                          </span>
                          <button
                            onClick={() => handleChangeSizeClick(item.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '10px',
                              color: 'var(--gold)',
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              padding: 0
                            }}
                          >
                            Change Size
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Rental period if available */}
                    {(selectedDate && returnDate) && (
                      <div style={{ marginTop: '8px', fontSize: '10px', color: 'var(--mink)' }}>
                        <div>{formatDate(selectedDate)} → {formatDate(returnDate)}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main customisation panels */}
          <div className="cust-main">

            {/* Size */}
            <div className="section-card">
              <div className="section-heading">Select Size {itemsToBook.length > 1 && '(Individual sizes shown in sidebar)'}</div>
              <div className="size-group">
                {selectedDress?.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-pill ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => handleSizeChange(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {itemsToBook.length > 1 && (
                <p style={{ fontSize: '11px', color: 'var(--mink)', marginTop: '12px', fontStyle: 'italic' }}>
                  Note: For multiple items, use the "Change Size" button on each product in the sidebar to set individual sizes.
                </p>
              )}
            </div>

            {/* Custom fitting — component untouched */}
            <div className="section-card">
              <CustomFitting
                isEnabled={isCustomFittingEnabled}
                onToggle={setIsCustomFittingEnabled}
                rentalPrice={selectedDress?.rentalPricePerDay || 0}
                onNotesChange={setCustomMeasurements}
              />
            </div>

            {/* Special instructions */}
            <div className="section-card">
              <div className="section-heading">Special Instructions</div>
              <textarea
                className="luxury-textarea"
                rows={4}
                value={specialInstructions}
                onChange={e => setSpecialInstructions(e.target.value)}
                placeholder="Any special requests for our atelier? (e.g. 'I need a matching dupatta')"
              />
            </div>

            {/* Matching jewellery */}
            <div className="section-card">
              <div className="section-heading">Add Matching Jewellery</div>
              <div className="jewellery-list">
                {jewelleryOptions.map(j => {
                  const isSelected = selectedJewellery.includes(j.id);
                  return (
                    <div
                      key={j.id}
                      className={`jewellery-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleJewelleryToggle(j.id)}
                    >
                      <div className="jewellery-row-left">
                        <span className="jewellery-name">{j.name}</span>
                        <span className="jewellery-price">₹{j.price.toLocaleString()}</span>
                      </div>
                      <div className="jcheck">
                        {isSelected && <span className="jcheck-mark">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* ── Footer ── */}
        <div className="cust-footer">
          <div className="total-block">
            <span className="total-label">Total</span>
            <span className="total-value">
              <sup>₹</sup>{totalPrice.toLocaleString()}
            </span>
          </div>
          <button className="btn-continue" onClick={handleContinue}>
            Continue to Review
          </button>
        </div>

      </div>
    </>
  );
};

export default CustomisePage;