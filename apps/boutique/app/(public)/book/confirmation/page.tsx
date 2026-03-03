'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingStore } from '../../../../lib/stores/bookingStore';

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

  .confirm-root {
    min-height: 100vh;
    background: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    color: var(--espresso);
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding: 60px 20px 80px;
  }

  .confirm-card {
    width: 100%;
    max-width: 640px;
    background: #fff;
    border: 1px solid var(--stone);
    position: relative;
    overflow: hidden;
  }

  /* top decorative bar */
  .confirm-card::before {
    content: '';
    display: block;
    height: 3px;
    background: linear-gradient(to right, var(--gold-lt), var(--espresso), var(--gold-lt));
  }

  /* ── Hero section ── */
  .confirm-hero {
    padding: 48px 48px 36px;
    text-align: center;
    border-bottom: 1px solid var(--stone);
    position: relative;
  }
  .confirm-hero::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 50%;
    transform: translateX(-50%);
    width: 40px; height: 3px;
    background: var(--gold);
  }

  .confirm-icon-wrap {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: var(--stone);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
    position: relative;
  }
  .confirm-icon-wrap::after {
    content: '';
    position: absolute;
    inset: -5px;
    border-radius: 50%;
    border: 1px solid var(--gold-lt);
  }
  .confirm-check {
    font-size: 28px;
  }

  .confirm-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 5vw, 38px);
    font-weight: 300;
    letter-spacing: 0.01em;
    color: var(--espresso);
    margin: 0 0 10px;
  }
  .confirm-title em {
    font-style: italic;
    color: var(--umber);
  }
  .confirm-subtitle {
    font-size: 13px;
    letter-spacing: 0.06em;
    color: var(--mink);
    line-height: 1.7;
    max-width: 380px;
    margin: 0 auto;
  }

  /* Booking ID badge */
  .booking-id-wrap {
    margin-top: 28px;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 14px 32px;
    border: 1px solid var(--stone);
    background: var(--ivory);
  }
  .booking-id-label {
    font-size: 9px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--mink);
  }
  .booking-id-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 400;
    color: var(--espresso);
    letter-spacing: 0.08em;
  }

  /* ── Details section ── */
  .confirm-body {
    padding: 36px 48px 40px;
    display: flex;
    flex-direction: column;
    gap: 28px;
  }

  .detail-block {
    border-left: 2px solid var(--stone);
    padding-left: 20px;
    transition: border-color 0.2s;
  }
  .detail-block:hover {
    border-color: var(--gold);
  }

  .detail-section-title {
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--mink);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .detail-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--stone);
  }

  .detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px 32px;
  }
  @media (max-width: 480px) {
    .detail-grid { grid-template-columns: 1fr; }
    .confirm-body { padding: 28px 24px 32px; }
    .confirm-hero { padding: 36px 24px 28px; }
    .confirm-actions { padding: 0 24px 36px; }
  }

  .detail-item-label {
    font-size: 9px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--mink);
    margin-bottom: 5px;
  }
  .detail-item-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 17px;
    font-weight: 400;
    color: var(--espresso);
    line-height: 1.3;
  }
  .detail-item-sub {
    font-size: 11px;
    letter-spacing: 0.08em;
    color: var(--mink);
    margin-top: 2px;
  }

  /* Jewellery list */
  .jewellery-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .jewellery-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: var(--ivory);
    border: 1px solid var(--stone);
  }
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

  /* ── Actions ── */
  .confirm-actions {
    padding: 0 48px 44px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .btn-primary {
    width: 100%;
    padding: 15px 0;
    background: var(--espresso);
    color: var(--ivory);
    border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s ease;
  }
  .btn-primary:hover { background: var(--umber); }

  .btn-outline {
    width: 100%;
    padding: 14px 0;
    background: transparent;
    color: var(--espresso);
    border: 1px solid var(--espresso);
    font-family: 'Jost', sans-serif;
    font-size: 11px;
    font-weight: 400;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s ease;
  }
  .btn-outline:hover { background: var(--espresso); color: var(--ivory); }

  /* ── Footer note ── */
  .confirm-footer {
    padding: 20px 48px 36px;
    border-top: 1px solid var(--stone);
    text-align: center;
  }
  .confirm-footer p {
    font-size: 12px;
    letter-spacing: 0.07em;
    color: var(--mink);
    line-height: 1.9;
    margin: 0;
  }
  .confirm-footer a {
    color: var(--gold);
    text-decoration: none;
  }
  .confirm-footer a:hover { text-decoration: underline; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const ConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── All store/logic untouched ──────────────────────────────────────────────
  const {
    selectedDress,
    selectedDate,
    returnDate,
    selectedSize,
    customMeasurements,
    specialInstructions,
    selectedJewellery,
    bookingId,
    resetBooking,
  } = useBookingStore();

  const [localBookingId, setLocalBookingId] = useState<string | null>(null);

  const jewelleryOptions = [
    { id: 'j1', name: 'Traditional Necklace Set', price: 800 },
    { id: 'j2', name: 'Diamond Stud Earrings',    price: 1200 },
    { id: 'j3', name: 'Bangles Set',              price: 600 },
    { id: 'j4', name: 'Maang Tikka',              price: 700 },
  ];

  useEffect(() => {
    const urlBookingId = searchParams.get('bookingId');
    if (urlBookingId) {
      setLocalBookingId(urlBookingId);
      if (typeof window !== 'undefined') {
        console.log('Booking confirmed successfully!');
      }
    } else if (bookingId) {
      setLocalBookingId(bookingId);
    }
  }, [searchParams, bookingId]);

  const handleNewBooking = () => {
    resetBooking();
    router.push('/book/dress');
  };

  const handleViewBooking = () => {
    alert('This would navigate to your bookings page');
  };
  // ── End untouched logic ────────────────────────────────────────────────────

  const formatDate = (date: Date | null | undefined) =>
    date
      ? date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      : 'N/A';

  const selectedJewelleryItems = selectedJewellery
    .map(id => jewelleryOptions.find(j => j.id === id))
    .filter(Boolean) as typeof jewelleryOptions;

  return (
    <>
      <style>{css}</style>

      <div className="confirm-root">
        <div className="confirm-card">

          {/* ── Hero ── */}
          <div className="confirm-hero">
            <div className="confirm-icon-wrap">
              <span className="confirm-check">✦</span>
            </div>

            <h1 className="confirm-title">
              Booking <em>Confirmed</em>
            </h1>
            <p className="confirm-subtitle">
              Your dress rental has been successfully reserved. A confirmation has been sent to your email.
            </p>

            {localBookingId && (
              <div className="booking-id-wrap">
                <span className="booking-id-label">Booking Reference</span>
                <span className="booking-id-value">{localBookingId}</span>
              </div>
            )}
          </div>

          {/* ── Details ── */}
          <div className="confirm-body">

            {/* Dress + rental info */}
            <div className="detail-block">
              <div className="detail-section-title">Reservation Details</div>
              <div className="detail-grid">
                {selectedDress && (
                  <div>
                    <div className="detail-item-label">Dress</div>
                    <div className="detail-item-value">{selectedDress.name}</div>
                    <div className="detail-item-sub">{selectedDress.category}</div>
                  </div>
                )}

                <div>
                  <div className="detail-item-label">Size</div>
                  <div className="detail-item-value">{selectedSize || '—'}</div>
                </div>

                <div>
                  <div className="detail-item-label">Rental Period</div>
                  <div className="detail-item-value">
                    {formatDate(selectedDate)} — {formatDate(returnDate)}
                  </div>
                </div>

                {specialInstructions && (
                  <div>
                    <div className="detail-item-label">Special Instructions</div>
                    <div className="detail-item-value" style={{ fontSize: 14 }}>
                      {specialInstructions}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Jewellery */}
            {selectedJewelleryItems.length > 0 && (
              <div className="detail-block">
                <div className="detail-section-title">Added Jewellery</div>
                <div className="jewellery-list">
                  {selectedJewelleryItems.map(j => (
                    <div key={j.id} className="jewellery-row">
                      <span className="jewellery-name">{j.name}</span>
                      <span className="jewellery-price">₹{j.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Custom measurements */}
            {customMeasurements && (
              <div className="detail-block">
                <div className="detail-section-title">Custom Measurements</div>
                <p style={{ fontSize: 13, letterSpacing: '0.05em', color: 'var(--umber)', lineHeight: 1.7, margin: 0 }}>
                  {customMeasurements}
                </p>
              </div>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="confirm-actions">
            <button className="btn-primary" onClick={handleViewBooking}>
              View Booking Details
            </button>
            <button className="btn-outline" onClick={handleNewBooking}>
              Book Another Dress
            </button>
          </div>

          {/* ── Footer ── */}
          <div className="confirm-footer">
            <p>You will receive an SMS and email confirmation shortly.</p>
            <p>
              Need help?{' '}
              <a href="mailto:support@niraliboutique.com">support@niraliboutique.com</a>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default ConfirmationPage;