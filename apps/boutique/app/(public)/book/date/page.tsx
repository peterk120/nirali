'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '../../../../lib/stores/bookingStore';
import { BookingProgressBar } from '../../../../components/booking/BookingProgressBar';
import BookingCalendar from '../../../../components/booking/BookingCalendar';

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

  .date-root {
    min-height: 100vh;
    background: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    color: var(--espresso);
  }

  /* ── Page header ── */
  .date-header {
    padding: 48px 60px 36px;
    border-bottom: 1px solid var(--stone);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    position: relative;
  }
  .date-header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 60px;
    width: 40px; height: 2px;
    background: var(--gold);
  }
  .date-eyebrow {
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .date-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 300;
    letter-spacing: 0.01em;
    color: var(--espresso);
    margin: 0 0 8px;
  }
  .date-title em { font-style: italic; color: var(--umber); }
  .date-subtitle {
    font-size: 12px;
    letter-spacing: 0.1em;
    color: var(--mink);
  }
  .date-back {
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
  .date-back:hover { color: var(--espresso); }

  /* ── Body ── */
  .date-body {
    max-width: 780px;
    margin: 0 auto;
    padding: 48px 60px 80px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  @media (max-width: 700px) {
    .date-header { padding: 36px 24px 28px; }
    .date-header::after { left: 24px; }
    .date-body { padding: 32px 24px 60px; }
    .date-footer { padding: 0 24px 40px; }
    .dates-grid { grid-template-columns: 1fr !important; }
    .duration-group { flex-direction: column; }
  }

  /* Shared section card */
  .section-card {
    background: #fff;
    border: 1px solid var(--stone);
    padding: 28px 28px 32px;
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

  /* ── Duration options ── */
  .duration-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .duration-pill {
    flex: 1;
    min-width: 120px;
    padding: 14px 20px;
    border: 1px solid var(--stone);
    background: transparent;
    font-family: 'Jost', sans-serif;
    cursor: pointer;
    text-align: center;
    transition: all 0.2s;
  }
  .duration-pill:hover { border-color: var(--gold); }
  .duration-pill.active {
    background: var(--espresso);
    border-color: var(--espresso);
  }
  .duration-pill-label {
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.08em;
    color: var(--umber);
    display: block;
    transition: color 0.2s;
  }
  .duration-pill.active .duration-pill-label { color: var(--ivory); }
  .duration-pill-price {
    font-size: 11px;
    letter-spacing: 0.1em;
    color: var(--mink);
    margin-top: 4px;
    display: block;
    transition: color 0.2s;
  }
  .duration-pill.active .duration-pill-price { color: var(--gold-lt); }

  /* ── Calendar wrapper ── */
  .calendar-card {
    background: #fff;
    border: 1px solid var(--stone);
    padding: 28px;
  }

  /* ── Selected dates summary ── */
  .dates-summary {
    background: #fff;
    border: 1px solid var(--stone);
    padding: 28px 28px 32px;
    animation: fadeUp 0.3s ease;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .dates-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 4px;
  }
  .date-box {
    padding: 18px 20px;
    background: var(--ivory);
    border: 1px solid var(--stone);
    position: relative;
    transition: border-color 0.2s;
  }
  .date-box:hover { border-color: var(--mink); }
  .date-box-label {
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--mink);
    margin-bottom: 8px;
  }
  .date-box-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 300;
    color: var(--espresso);
    line-height: 1.2;
  }
  .date-box-day {
    font-size: 11px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--mink);
    margin-top: 4px;
  }
  /* accent corner */
  .date-box::after {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 3px; height: 100%;
    background: var(--gold);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .date-box:hover::after { opacity: 1; }

  /* ── Footer ── */
  .date-footer {
    padding: 32px 60px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-top: 1px solid var(--stone);
    flex-wrap: wrap;
  }
  .btn-ghost {
    padding: 13px 32px;
    background: transparent;
    border: 1px solid var(--stone);
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mink);
    cursor: pointer;
    transition: all 0.2s;
  }
  .btn-ghost:hover { border-color: var(--espresso); color: var(--espresso); }
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
  }
  .btn-continue:hover:not(:disabled) { background: var(--umber); }
  .btn-continue:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const SelectDatePage = () => {
  const router = useRouter();

  // ── All store logic untouched ──────────────────────────────────────────────
  const {
    step,
    selectedDress,
    bookingItems, // Support multiple items
    selectedDate,
    returnDate,
    rentalDuration,
    setStep,
    setSelectedDate,
    setReturnDate,
    setRentalDuration,
  } = useBookingStore();

  const itemsToBook = bookingItems.length > 0 ? bookingItems : (selectedDress ? [selectedDress] : []);
  // ... rest of the component

  const bookedDates = ['2026-03-15', '2026-03-16', '2026-03-20'];
  const limitedDates = ['2026-03-10', '2026-03-25'];

  const durationOptions = [
    { days: 1, label: '1 Day', price: 0 },
    { days: 3, label: '3 Days', price: 200 },
    { days: 7, label: '7 Days', price: 500 },
  ];

  const calculateReturnDate = (startDate: Date, days: number): Date => {
    const returnDate = new Date(startDate);
    returnDate.setDate(returnDate.getDate() + days);
    return returnDate;
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const calculatedReturnDate = calculateReturnDate(date, rentalDuration);
    setReturnDate(calculatedReturnDate);
  };

  const handleDurationChange = (days: number) => {
    setRentalDuration(days);
    if (selectedDate) {
      const calculatedReturnDate = calculateReturnDate(selectedDate, days);
      setReturnDate(calculatedReturnDate);
    }
  };

  const handleContinue = () => {
    if (selectedDate) {
      setStep(3);
      router.push('/book/customise');
    }
  };

  const handleBack = () => {
    setStep(1);
    router.push('/book/dress');
  };
  // ── End untouched logic ────────────────────────────────────────────────────

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' });

  const formatDay = (date: Date) =>
    new Date(date).toLocaleDateString('en-IN', { weekday: 'long' });

  return (
    <>
      <style>{css}</style>

      <div className="date-root">
        <BookingProgressBar />

        {/* ── Header ── */}
        <div className="date-header">
          <div>
            <p className="date-eyebrow">Step 2 of 4</p>
            <h1 className="date-title">Select <em>Rental Dates</em></h1>
            <p className="date-subtitle">
              Choose when your occasion begins
              {itemsToBook.length > 1 && <span style={{ color: 'var(--gold)', marginLeft: '8px' }}>— {itemsToBook.length} items selected</span>}
            </p>
          </div>
          <button className="date-back" onClick={handleBack}>
            ← Dress Selection
          </button>
        </div>

        {/* Item preview for multi-product */}
        {itemsToBook.length > 0 && (
          <div style={{
            maxWidth: '780px',
            margin: '20px auto 0',
            padding: '0 60px',
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '10px'
          }}>
            {itemsToBook.map((item, idx) => (
              <div key={idx} style={{ flexShrink: 0, width: '40px', height: '54px', border: '1px solid var(--stone)', background: '#fff' }}>
                <img src={item.image || item.images?.[0] || '/placeholder-product.jpg'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Body ── */}
        <div className="date-body">

          {/* Duration */}
          <div className="section-card">
            <div className="section-heading">Rental Duration</div>
            <div className="duration-group">
              {durationOptions.map(opt => (
                <button
                  key={opt.days}
                  className={`duration-pill ${rentalDuration === opt.days ? 'active' : ''}`}
                  onClick={() => handleDurationChange(opt.days)}
                >
                  <span className="duration-pill-label">{opt.label}</span>
                  {opt.price > 0 && (
                    <span className="duration-pill-price">+₹{opt.price}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar — component untouched */}
          <div className="calendar-card">
            <BookingCalendar
              bookedDates={bookedDates}
              limitedDates={limitedDates}
              onDateSelect={handleDateSelect}
              dressId={selectedDress?.id}
            />
          </div>

          {/* Selected dates summary */}
          {selectedDate && returnDate && (
            <div className="dates-summary">
              <div className="section-heading">Your Selected Period</div>
              <div className="dates-grid">
                <div className="date-box">
                  <div className="date-box-label">Pick-up Date</div>
                  <div className="date-box-value">{formatDate(selectedDate)}</div>
                  <div className="date-box-day">{formatDay(selectedDate)}</div>
                </div>
                <div className="date-box">
                  <div className="date-box-label">Return Date</div>
                  <div className="date-box-value">{formatDate(returnDate)}</div>
                  <div className="date-box-day">{formatDay(returnDate)}</div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div className="date-footer">
          <button className="btn-ghost" onClick={handleBack}>
            ← Back to Dress
          </button>
          <button
            className="btn-continue"
            onClick={handleContinue}
            disabled={!selectedDate}
          >
            Continue to Customisation
          </button>
        </div>

      </div>
    </>
  );
};

export default SelectDatePage;