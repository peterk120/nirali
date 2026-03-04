'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '../../../../lib/stores/bookingStore';
import { BookingProgressBar } from '../../../../components/booking/BookingProgressBar';
import { useAuthStore } from '../../../../lib/stores/authStore';

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

  .review-root {
    min-height: 100vh;
    background: var(--ivory);
    font-family: 'Jost', sans-serif;
    font-weight: 300;
    color: var(--espresso);
  }

  /* ── Header ── */
  .review-header {
    padding: 48px 60px 36px;
    border-bottom: 1px solid var(--stone);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    position: relative;
  }
  .review-header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 60px;
    width: 40px; height: 2px;
    background: var(--gold);
  }
  .review-eyebrow {
    font-size: 10px;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 10px;
  }
  .review-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 300;
    color: var(--espresso);
    margin: 0 0 8px;
  }
  .review-title em { font-style: italic; color: var(--umber); }
  .review-subtitle { font-size: 12px; letter-spacing: 0.1em; color: var(--mink); }
  .review-back {
    background: none; border: none;
    font-family: 'Jost', sans-serif;
    font-size: 11px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--mink);
    cursor: pointer; white-space: nowrap; padding: 0;
    transition: color 0.2s; flex-shrink: 0;
  }
  .review-back:hover { color: var(--espresso); }

  /* ── Body ── */
  .review-body {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2px;
    padding: 2px 60px 80px;
    align-items: start;
  }
  @media (max-width: 900px) {
    .review-body { grid-template-columns: 1fr; padding: 2px 24px 60px; }
    .review-header { padding: 36px 24px 28px; }
    .review-header::after { left: 24px; }
  }

  /* Shared card */
  .r-card {
    background: #fff;
    border: 1px solid var(--stone);
    padding: 28px 28px 32px;
    margin-bottom: 2px;
    transition: border-color 0.25s;
  }
  .r-card:focus-within { border-color: var(--mink); }

  .r-heading {
    font-size: 9px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--mink);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .r-heading::after { content: ''; flex: 1; height: 1px; background: var(--stone); }

  /* ── Dress detail card ── */
  .dress-row {
    display: grid;
    grid-template-columns: 100px 1fr;
    gap: 20px;
    align-items: start;
  }
  .dress-thumb {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
  }
  .dress-thumb-ph {
    width: 100%; aspect-ratio: 3/4;
    background: var(--stone);
    display: flex; align-items: center;
    justify-content: center; font-size: 32px; color: var(--mink);
  }
  .dress-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px; font-weight: 400;
    color: var(--espresso); margin-bottom: 4px;
  }
  .dress-cat {
    font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; color: var(--mink); margin-bottom: 12px;
  }
  .dress-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 20px; color: var(--umber); margin-bottom: 14px;
  }
  .dress-price span {
    font-family: 'Jost', sans-serif;
    font-size: 10px; letter-spacing: 0.12em; color: var(--mink); margin-left: 3px;
  }
  .detail-pills { display: flex; flex-wrap: wrap; gap: 8px; }
  .detail-pill {
    padding: 5px 14px;
    border: 1px solid var(--stone);
    font-size: 11px; letter-spacing: 0.12em;
    color: var(--umber);
  }
  .detail-pill strong { font-weight: 500; color: var(--espresso); margin-right: 4px; }

  /* ── Dates grid ── */
  .dates-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .date-box {
    padding: 16px 18px;
    background: var(--ivory);
    border: 1px solid var(--stone);
    position: relative; transition: border-color 0.2s;
  }
  .date-box:hover { border-color: var(--mink); }
  .date-box::after {
    content: ''; position: absolute;
    top: 0; left: 0; width: 3px; height: 100%;
    background: var(--gold); opacity: 0; transition: opacity 0.2s;
  }
  .date-box:hover::after { opacity: 1; }
  .date-box-label { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--mink); margin-bottom: 7px; }
  .date-box-value { font-family: 'Cormorant Garamond', serif; font-size: 19px; font-weight: 300; color: var(--espresso); }

  /* ── Jewellery rows ── */
  .jewellery-list { display: flex; flex-direction: column; gap: 8px; }
  .jewellery-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 12px 16px;
    background: var(--ivory); border: 1px solid var(--stone);
  }
  .jewellery-name { font-size: 13px; letter-spacing: 0.06em; color: var(--espresso); }
  .jewellery-price { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: var(--umber); }

  /* ── Right column ── */
  .review-right { display: flex; flex-direction: column; gap: 2px; padding-top: 2px; }

  /* Login card */
  .login-prompt { font-size: 13px; letter-spacing: 0.05em; color: var(--mink); margin-bottom: 20px; line-height: 1.7; }
  .btn-google {
    width: 100%; padding: 13px 0;
    background: #fff; border: 1px solid var(--stone);
    font-family: 'Jost', sans-serif; font-size: 11px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--espresso); cursor: pointer;
    transition: border-color 0.2s, box-shadow 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-bottom: 10px;
  }
  .btn-google:hover { border-color: var(--mink); box-shadow: 0 2px 12px rgba(107,31,42,0.06); }
  .btn-otp {
    width: 100%; padding: 13px 0;
    background: transparent; border: 1px solid var(--stone);
    font-family: 'Jost', sans-serif; font-size: 11px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--mink); cursor: pointer; transition: all 0.2s;
  }
  .btn-otp:hover { border-color: var(--espresso); color: var(--espresso); }
  .or-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 16px 0;
  }
  .or-divider::before, .or-divider::after { content: ''; flex: 1; height: 1px; background: var(--stone); }
  .or-divider span { font-size: 10px; letter-spacing: 0.25em; color: var(--mink); }

  /* Profile rows */
  .profile-grid { display: flex; flex-direction: column; gap: 14px; }
  .profile-row {}
  .profile-label { font-size: 9px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--mink); margin-bottom: 4px; }
  .profile-value { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: var(--espresso); }

  /* Payment summary */
  .payment-lines { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
  .payment-row {
    display: flex; justify-content: space-between; align-items: baseline;
    font-size: 13px; letter-spacing: 0.05em; color: var(--umber);
  }
  .payment-row span:last-child { font-family: 'Cormorant Garamond', serif; font-size: 16px; color: var(--espresso); }
  .payment-divider { height: 1px; background: var(--stone); margin: 6px 0; }
  .payment-total {
    display: flex; justify-content: space-between; align-items: baseline;
    padding-top: 4px;
  }
  .payment-total-label { font-size: 10px; letter-spacing: 0.28em; text-transform: uppercase; color: var(--mink); }
  .payment-total-value { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-weight: 300; color: var(--espresso); }
  .payment-sub { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--stone); }
  .payment-sub-row {
    display: flex; justify-content: space-between;
    font-size: 11px; letter-spacing: 0.08em; color: var(--mink);
  }
  .payment-sub-row span:last-child { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: var(--umber); }

  /* Terms */
  .terms-row {
    display: flex; align-items: flex-start; gap: 12px;
    margin: 20px 0 16px; cursor: pointer;
  }
  .terms-check {
    width: 16px; height: 16px; flex-shrink: 0;
    border: 1px solid var(--mink);
    display: flex; align-items: center; justify-content: center;
    margin-top: 1px; transition: all 0.2s;
  }
  .terms-check.checked { background: var(--espresso); border-color: var(--espresso); }
  .terms-check-mark { color: var(--ivory); font-size: 10px; line-height: 1; }
  .terms-text { font-size: 11px; letter-spacing: 0.06em; color: var(--mink); line-height: 1.7; }
  .terms-text a { color: var(--gold); text-decoration: none; }
  .terms-text a:hover { text-decoration: underline; }

  /* CTA */
  .btn-pay {
    width: 100%; padding: 15px 0;
    background: var(--espresso); color: var(--ivory);
    border: none; font-family: 'Jost', sans-serif;
    font-size: 11px; font-weight: 500;
    letter-spacing: 0.3em; text-transform: uppercase;
    cursor: pointer; transition: background 0.2s;
  }
  .btn-pay:hover:not(:disabled) { background: var(--umber); }
  .btn-pay:disabled { opacity: 0.35; cursor: not-allowed; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const ReviewPage = () => {
  const router = useRouter();

  // ── All store logic untouched ──────────────────────────────────────────────
  const {
    step,
    selectedDress,
    selectedDate,
    returnDate,
    selectedSize,
    customMeasurements,
    specialInstructions,
    selectedJewellery,
    userProfile,
    termsAccepted,
    setStep,
    setUserProfile,
    setTermsAccepted,
  } = useBookingStore();
  const { isLoggedIn, user, login } = useAuthStore();

  const [loginMethod, setLoginMethod] = useState<'google' | 'otp' | null>(null);

  const jewelleryOptions = [
    { id: 'j1', name: 'Traditional Necklace Set', price: 800 },
    { id: 'j2', name: 'Diamond Stud Earrings', price: 1200 },
    { id: 'j3', name: 'Bangles Set', price: 600 },
    { id: 'j4', name: 'Maang Tikka', price: 700 },
  ];

  const totalPrice = selectedDress
    ? selectedDress.rentalPricePerDay +
    (customMeasurements ? 500 : 0) +
    selectedJewellery.reduce((total, id) => {
      const j = jewelleryOptions.find(j => j.id === id);
      return total + (j ? j.price : 0);
    }, 0)
    : 0;

  const depositAmount = selectedDress ? selectedDress.depositAmount : 0;
  const advanceAmount = Math.round(totalPrice * 0.3);
  const jewelleryTotal = selectedJewellery.reduce((total, id) => {
    const j = jewelleryOptions.find(j => j.id === id);
    return total + (j ? j.price : 0);
  }, 0);
  const dressRental = totalPrice - jewelleryTotal;

  const handleLogin = (method: 'google' | 'otp') => {
    setLoginMethod(method);
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      address: '123 Main Street, City, State - 123456',
    };
    login(mockUser);
    setUserProfile(mockUser);
  };

  const handleContinue = () => {
    if (termsAccepted) { setStep(5); router.push('/book/payment'); }
  };

  const handleBack = () => {
    setStep(3); router.push('/book/customise');
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  };
  // ── End untouched logic ────────────────────────────────────────────────────

  const fmtDate = (d: Date | null | undefined) =>
    d ? new Date(d).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }) : '—';

  const selectedJewelleryItems = selectedJewellery
    .map(id => jewelleryOptions.find(j => j.id === id))
    .filter(Boolean) as typeof jewelleryOptions;

  return (
    <>
      <style>{css}</style>

      <div className="review-root">
        <BookingProgressBar />

        {/* ── Header ── */}
        <div className="review-header">
          <div>
            <p className="review-eyebrow">Step 4 of 4</p>
            <h1 className="review-title">Review <em>Your Booking</em></h1>
            <p className="review-subtitle">Confirm every detail before proceeding to payment</p>
          </div>
          <button className="review-back" onClick={handleBack}>← Customisation</button>
        </div>

        {/* ── Body ── */}
        <div className="review-body">

          {/* ── Left: booking summary ── */}
          <div>

            {/* Dress */}
            <div className="r-card">
              <div className="r-heading">Dress Details</div>
              {selectedDress && (
                <div className="dress-row">
                  {selectedDress.images?.[0] ? (
                    <img src={selectedDress.images[0]} alt={selectedDress.name} className="dress-thumb" />
                  ) : (
                    <div className="dress-thumb-ph">👗</div>
                  )}
                  <div>
                    <div className="dress-name">{selectedDress.name}</div>
                    <div className="dress-cat">{selectedDress.category}</div>
                    <div className="dress-price">
                      ₹{selectedDress.rentalPricePerDay.toLocaleString()}
                      <span>/day</span>
                    </div>
                    <div className="detail-pills">
                      {selectedSize && (
                        <span className="detail-pill"><strong>Size</strong>{selectedSize}</span>
                      )}
                      {customMeasurements && (
                        <span className="detail-pill"><strong>Fitting</strong>Custom</span>
                      )}
                      {specialInstructions && (
                        <span className="detail-pill"><strong>Note</strong>{specialInstructions}</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rental period */}
            <div className="r-card">
              <div className="r-heading">Rental Period</div>
              <div className="dates-grid">
                <div className="date-box">
                  <div className="date-box-label">Pick-up</div>
                  <div className="date-box-value">{fmtDate(selectedDate)}</div>
                </div>
                <div className="date-box">
                  <div className="date-box-label">Return</div>
                  <div className="date-box-value">{fmtDate(returnDate)}</div>
                </div>
              </div>
            </div>

            {/* Jewellery */}
            {selectedJewelleryItems.length > 0 && (
              <div className="r-card">
                <div className="r-heading">Added Jewellery</div>
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
          </div>

          {/* ── Right: login + payment ── */}
          <div className="review-right">

            {/* User info */}
            <div className="r-card">
              <div className="r-heading">Your Information</div>

              {!isLoggedIn ? (
                <>
                  <p className="login-prompt">Please sign in to complete your reservation.</p>
                  <button className="btn-google" onClick={() => handleLogin('google')}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
                  </button>
                  <div className="or-divider"><span>or</span></div>
                  <button className="btn-otp" onClick={() => handleLogin('otp')}>
                    Continue with Phone OTP
                  </button>
                </>
              ) : (
                user && (
                  <div className="profile-grid">
                    {[
                      { label: 'Name', value: user.name },
                      { label: 'Email', value: user.email },
                      { label: 'Phone', value: user.phone },
                      { label: 'Address', value: user.address },
                    ].map(row => (
                      <div key={row.label} className="profile-row">
                        <div className="profile-label">{row.label}</div>
                        <div className="profile-value">{row.value}</div>
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>

            {/* Payment summary */}
            <div className="r-card">
              <div className="r-heading">Payment Summary</div>

              <div className="payment-lines">
                <div className="payment-row">
                  <span>Dress Rental</span>
                  <span>₹{dressRental.toLocaleString()}</span>
                </div>
                {selectedJewelleryItems.length > 0 && (
                  <div className="payment-row">
                    <span>Jewellery</span>
                    <span>₹{jewelleryTotal.toLocaleString()}</span>
                  </div>
                )}
                {customMeasurements && (
                  <div className="payment-row">
                    <span>Custom Fitting</span>
                    <span>₹500</span>
                  </div>
                )}
              </div>

              <div className="payment-divider" />
              <div className="payment-total">
                <span className="payment-total-label">Total</span>
                <span className="payment-total-value">₹{totalPrice.toLocaleString()}</span>
              </div>

              <div className="payment-sub">
                <div className="payment-sub-row">
                  <span>Advance Due (30%)</span>
                  <span>₹{advanceAmount.toLocaleString()}</span>
                </div>
                <div className="payment-sub-row">
                  <span>Security Deposit</span>
                  <span>₹{depositAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Terms */}
              <label className="terms-row">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  style={{ display: 'none' }}
                />
                <div className={`terms-check ${termsAccepted ? 'checked' : ''}`}>
                  {termsAccepted && <span className="terms-check-mark">✓</span>}
                </div>
                <span className="terms-text">
                  I agree to the <a href="#">Terms &amp; Conditions</a> and <a href="#">Privacy Policy</a>
                </span>
              </label>

              <button
                className="btn-pay"
                onClick={handleContinue}
                disabled={!termsAccepted || !isLoggedIn}
              >
                Proceed to Payment
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewPage;