'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '../../../../lib/stores/bookingStore';
import { BookingProgressBar } from '../../../../components/booking/BookingProgressBar';
import { Button } from '../../../../components/ui/button';
import { loadRazorpayScript, openRazorpayPayment } from '../../../../lib/razorpay';

const PaymentPage = () => {
  const router = useRouter();
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
    advancePaid,
    depositPaid,
    setStep,
    setAdvancePaid,
    setDepositPaid,
    setBookingId
  } = useBookingStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingRazorpay, setIsLoadingRazorpay] = useState(false);

  const jewelleryOptions = [
    { id: 'j1', name: 'Traditional Necklace Set', price: 800 },
    { id: 'j2', name: 'Diamond Stud Earrings', price: 1200 },
    { id: 'j3', name: 'Bangles Set', price: 600 },
    { id: 'j4', name: 'Maang Tikka', price: 700 },
  ];

  const jewelleryTotal = selectedJewellery.reduce((total, id) => {
    const jewellery = jewelleryOptions.find(j => j.id === id);
    return total + (jewellery ? jewellery.price : 0);
  }, 0);

  const totalPrice = selectedDress
    ? selectedDress.rentalPricePerDay + (customMeasurements ? 500 : 0) + jewelleryTotal
    : 0;

  const depositAmount = selectedDress ? selectedDress.depositAmount : 0;
  const advanceAmount = Math.round(totalPrice * 0.3);
  const balanceAmount = totalPrice - advanceAmount;
  const totalPayable = advanceAmount + depositAmount;

  useEffect(() => {
    setStep(5);
  }, [setStep]);

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    setIsLoadingRazorpay(true);

    try {
      await loadRazorpayScript();

      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalPayable,
          currency: 'INR',
          receipt: `ORDER_${Date.now()}`,
          notes: {
            bookingId: selectedDress?.id,
            userId: userProfile?.email || 'guest',
            advanceAmount: advanceAmount.toString(),
            depositAmount: depositAmount.toString()
          }
        })
      });

      if (!response.ok) throw new Error('Failed to create payment order');

      const { order } = await response.json();

      const options = {
        key: 'rzp_test_SKM0b29EDWHcE1',
        amount: order.amount,
        currency: order.currency,
        name: 'Nirali Boutique',
        description: 'Dress Rental Booking Payment',
        order_id: order.id,
        handler: async (response: any) => {
          console.log('Payment successful, response:', response);
          try {
            setAdvancePaid(advanceAmount);
            setDepositPaid(depositAmount);

            const bookingId = `BK${Math.floor(100000 + Math.random() * 900000)}`;
            setBookingId(bookingId);

            try {
              const orderData = {
                userId: 'user-123',
                productId: selectedDress?.id,
                productName: selectedDress?.name,
                productImage: selectedDress?.images?.[0] || '/placeholder-product.jpg',
                rentalStartDate: selectedDate,
                rentalEndDate: returnDate,
                rentalDays: 3,
                rentalPricePerDay: selectedDress?.rentalPricePerDay || 1000,
                depositAmount: selectedDress?.depositAmount || 500,
                totalAmount: totalPrice,
                customerName: userProfile?.name || 'Customer',
                customerEmail: userProfile?.email || 'customer@example.com',
                customerPhone: userProfile?.phone || '9999999999',
                deliveryAddress: 'Default Address'
              };

              const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData),
              });

              const orderResult = await orderResponse.json();

              if (orderResult.success) {
                console.log('Order saved successfully:', orderResult.data.orderId);
                localStorage.setItem('lastOrderId', orderResult.data.orderId);
              }
            } catch (orderError) {
              console.error('Error saving order:', orderError);
            }

            console.log('Payment completed successfully, redirecting to confirmation with bookingId:', bookingId);
            router.push(`/book/confirmation?bookingId=${bookingId}`);
          } catch (error) {
            console.error('Error in payment handler:', error);
            setIsProcessing(false);
            alert('Payment completed but navigation failed. Please contact support with reference: ' + response.razorpay_payment_id);
          }
        },
        prefill: {
          name: userProfile?.name || '',
          email: userProfile?.email || '',
          contact: userProfile?.phone || '',
        },
        theme: { color: '#C0436A' },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setIsLoadingRazorpay(false);
          }
        }
      };

      await openRazorpayPayment(options);
    } catch (error) {
      console.error('Payment error:', error);
      alert(error instanceof Error ? error.message : 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsLoadingRazorpay(false);
    }
  };

  const handleBack = () => {
    setStep(4);
    router.push('/book/review');
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .payment-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          background: #faf8f6;
          position: relative;
          overflow-x: hidden;
        }

        .bg-decoration {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }

        .bg-decoration::before {
          content: '';
          position: absolute;
          top: -200px;
          right: -200px;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(192,67,106,0.06) 0%, transparent 70%);
          border-radius: 50%;
        }

        .bg-decoration::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(192,67,106,0.04) 0%, transparent 70%);
          border-radius: 50%;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }

        /* Header */
        .page-header {
          margin-bottom: 48px;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 400;
          color: #9a7a7a;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 28px;
          transition: color 0.2s;
        }

        .back-btn:hover { color: #C0436A; }

        .back-btn svg {
          width: 14px;
          height: 14px;
          transition: transform 0.2s;
        }

        .back-btn:hover svg { transform: translateX(-3px); }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          color: #1a1018;
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin: 0 0 10px;
        }

        .page-title em {
          font-style: italic;
          color: #C0436A;
        }

        .page-subtitle {
          font-size: 14px;
          color: #9a7a7a;
          letter-spacing: 0.02em;
          font-weight: 300;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 0;
        }

        .page-subtitle::before {
          content: '';
          display: inline-block;
          width: 24px;
          height: 1px;
          background: #C0436A;
          opacity: 0.5;
        }

        /* Main grid */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 860px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        /* Card base */
        .card {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .card-header {
          padding: 24px 28px 20px;
          border-bottom: 1px solid #f3eeeb;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .card-header-icon {
          width: 32px;
          height: 32px;
          border: 1px solid rgba(192,67,106,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .card-header-icon svg {
          width: 14px;
          height: 14px;
          color: #C0436A;
        }

        .card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 500;
          color: #1a1018;
          margin: 0;
          letter-spacing: 0.01em;
        }

        .card-body {
          padding: 28px;
        }

        /* Payment breakdown rows */
        .breakdown-section {
          margin-bottom: 28px;
        }

        .breakdown-label {
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9a7a7a;
          margin-bottom: 12px;
        }

        .breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 14px 0;
          border-bottom: 1px solid #f7f3f0;
        }

        .breakdown-row:last-child { border-bottom: none; }

        .breakdown-row-label {
          font-size: 14px;
          color: #3d2830;
          font-weight: 400;
          line-height: 1.3;
        }

        .breakdown-row-sub {
          font-size: 11px;
          color: #b09898;
          margin-top: 3px;
          font-weight: 300;
        }

        .breakdown-row-amount {
          font-size: 15px;
          color: #1a1018;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
        }

        .breakdown-row-amount.muted { color: #9a7a7a; }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(192,67,106,0.15), transparent);
          margin: 4px 0 20px;
        }

        /* Pill badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          margin-top: 4px;
        }

        .badge-green {
          background: #f0faf5;
          color: #2d7a52;
          border: 1px solid #c3e8d5;
        }

        .badge-rose {
          background: #fdf2f5;
          color: #C0436A;
          border: 1px solid rgba(192,67,106,0.2);
        }

        /* Summary card right */
        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 11px 0;
          font-size: 14px;
        }

        .summary-line .lbl { color: #7a6262; font-weight: 300; }
        .summary-line .val { color: #1a1018; font-weight: 500; }

        .summary-divider {
          height: 1px;
          background: #f3eeeb;
          margin: 8px 0;
        }

        .summary-total-block {
          background: linear-gradient(135deg, #fdf2f5 0%, #faf8f6 100%);
          border: 1px solid rgba(192,67,106,0.15);
          border-radius: 2px;
          padding: 20px 22px;
          margin-top: 20px;
        }

        .summary-total-label {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9a7a7a;
          margin-bottom: 6px;
          font-weight: 400;
        }

        .summary-total-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 40px;
          font-weight: 300;
          color: #1a1018;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .summary-total-amount span {
          font-size: 20px;
          color: #9a7a7a;
          vertical-align: super;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
        }

        /* Info bullets */
        .info-list {
          margin: 20px 0 0;
          padding: 0;
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 9px;
        }

        .info-list li {
          font-size: 12px;
          color: #9a7a7a;
          font-weight: 300;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }

        .info-list li::before {
          content: '—';
          color: rgba(192,67,106,0.4);
          flex-shrink: 0;
          font-size: 10px;
          margin-top: 2px;
        }

        /* Pay button */
        .pay-btn-wrapper {
          margin-top: 24px;
        }

        .pay-btn {
          width: 100%;
          height: 56px;
          background: #C0436A;
          color: #fff;
          border: none;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.15s;
        }

        .pay-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
        }

        .pay-btn:hover:not(:disabled) {
          background: #a83860;
          transform: translateY(-1px);
        }

        .pay-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .pay-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .pay-btn-processing {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Razorpay trust badge */
        .trust-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 14px;
          font-size: 11px;
          color: #b09898;
          font-weight: 300;
          letter-spacing: 0.03em;
        }

        .trust-badge svg { width: 12px; height: 12px; }

        /* Progress bar wrapper */
        .progress-wrapper {
          margin-bottom: 40px;
        }

        /* Entrance animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-1 { animation: fadeUp 0.5s ease both; }
        .animate-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .animate-3 { animation: fadeUp 0.5s 0.2s ease both; }
        .animate-4 { animation: fadeUp 0.5s 0.3s ease both; }
      `}</style>

      <div className="payment-root">
        <div className="bg-decoration" />

        <div className="content-wrapper">

          {/* Progress */}
          <div className="progress-wrapper animate-1">
            <BookingProgressBar />
          </div>

          {/* Header */}
          <div className="page-header animate-2">
            <button className="back-btn" onClick={handleBack}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Review
            </button>

            <h1 className="page-title">
              Complete your <em>payment</em>
            </h1>
            <p className="page-subtitle">Secured & encrypted checkout</p>
          </div>

          {/* Main Grid */}
          <div className="main-grid">

            {/* Left — Payment Information */}
            <div className="animate-3">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <rect x="1" y="3" width="14" height="10" rx="1.5" />
                      <path d="M1 7h14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h2 className="card-title">Payment Breakdown</h2>
                </div>

                <div className="card-body">

                  {/* Rental total */}
                  <div className="breakdown-section">
                    <p className="breakdown-label">Rental</p>

                    <div className="breakdown-row">
                      <div>
                        <div className="breakdown-row-label">Rental Total</div>
                        <div className="breakdown-row-sub">
                          3 days × ₹{selectedDress?.rentalPricePerDay?.toLocaleString()}
                        </div>
                      </div>
                      <div className="breakdown-row-amount">₹{totalPrice.toLocaleString()}</div>
                    </div>

                    <div className="breakdown-row">
                      <div>
                        <div className="breakdown-row-label">Advance — 30%</div>
                        <div className="breakdown-row-sub">Pay now to confirm your booking</div>
                      </div>
                      <div className="breakdown-row-amount">₹{advanceAmount.toLocaleString()}</div>
                    </div>

                    <div className="breakdown-row">
                      <div>
                        <div className="breakdown-row-label">Balance</div>
                        <div className="breakdown-row-sub">Pay on collection</div>
                      </div>
                      <div className="breakdown-row-amount muted">₹{balanceAmount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="divider" />

                  {/* Deposit */}
                  <div className="breakdown-section" style={{ marginBottom: 0 }}>
                    <p className="breakdown-label">Security</p>

                    <div className="breakdown-row" style={{ borderBottom: 'none' }}>
                      <div>
                        <div className="breakdown-row-label">Security Deposit</div>
                        <div style={{ marginTop: 6 }}>
                          <span className="badge badge-green">
                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:10,height:10}}>
                              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            100% Refundable
                          </span>
                        </div>
                      </div>
                      <div className="breakdown-row-amount">₹{depositAmount.toLocaleString()}</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Right — Summary + Pay */}
            <div className="animate-4">
              <div className="card">
                <div className="card-header">
                  <div className="card-header-icon">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <path d="M8 1l2 4 5 .7-3.5 3.4.8 5L8 12l-4.3 2.1.8-5L1 5.7 6 5z" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h2 className="card-title">Order Summary</h2>
                </div>

                <div className="card-body">

                  {/* Line items */}
                  <div className="summary-line">
                    <span className="lbl">Dress Rental</span>
                    <span className="val">₹{(totalPrice - jewelleryTotal).toLocaleString()}</span>
                  </div>

                  {selectedJewellery.length > 0 && (
                    <div className="summary-line">
                      <span className="lbl">Added Jewellery</span>
                      <span className="val">₹{jewelleryTotal.toLocaleString()}</span>
                    </div>
                  )}

                  {customMeasurements && (
                    <div className="summary-line">
                      <span className="lbl">Custom Fitting</span>
                      <span className="val" style={{ color: '#C0436A' }}>+₹500</span>
                    </div>
                  )}

                  <div className="summary-divider" />

                  <div className="summary-line" style={{ fontWeight: 500 }}>
                    <span style={{ color: '#3d2830' }}>Total</span>
                    <span style={{ color: '#1a1018' }}>₹{totalPrice.toLocaleString()}</span>
                  </div>

                  <div style={{ height: 16 }} />

                  <div className="summary-line">
                    <span className="lbl">Advance (30%)</span>
                    <span className="val">₹{advanceAmount.toLocaleString()}</span>
                  </div>

                  <div className="summary-line">
                    <span className="lbl">Security Deposit</span>
                    <span className="val">₹{depositAmount.toLocaleString()}</span>
                  </div>

                  {/* Total block */}
                  <div className="summary-total-block">
                    <p className="summary-total-label">Total Due Now</p>
                    <div className="summary-total-amount">
                      <span>₹</span>{totalPayable.toLocaleString()}
                    </div>
                  </div>

                  {/* Info */}
                  <ul className="info-list">
                    <li>Advance of 30% locks in your booking date</li>
                    <li>Security deposit returned within 3 days of return</li>
                  </ul>

                  {/* Pay button */}
                  <div className="pay-btn-wrapper">
                    <button
                      className="pay-btn"
                      onClick={handleRazorpayPayment}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <span className="pay-btn-processing">
                          <span className="spinner" />
                          {isLoadingRazorpay ? 'Opening gateway...' : 'Processing...'}
                        </span>
                      ) : (
                        <>
                          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:16,height:16}}>
                            <rect x="1" y="4" width="16" height="11" rx="2"/>
                            <path d="M1 8h16"/>
                          </svg>
                          Pay ₹{totalPayable.toLocaleString()}
                        </>
                      )}
                    </button>

                    <div className="trust-badge">
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                        <path d="M7 1L2 3.5v4C2 10.5 4.5 13 7 13s5-2.5 5-5.5v-4L7 1z" strokeLinejoin="round"/>
                        <path d="M5 7l1.5 1.5L9 5.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Secured by Razorpay
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;