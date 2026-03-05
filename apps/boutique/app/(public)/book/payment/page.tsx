'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '../../../../lib/stores/bookingStore';
import { BookingProgressBar } from '../../../../components/booking/BookingProgressBar';
import { Button } from '../../../../components/ui/button';
import { loadRazorpayScript, openRazorpayPayment } from '../../../../lib/razorpay';
import { Calendar, PlusCircleIcon } from 'lucide-react';

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
    bookingId,
    bookingItems,
    rentalDuration,
    setStep,
    setAdvancePaid,
    setDepositPaid,
    setBookingId
  } = useBookingStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingRazorpay, setIsLoadingRazorpay] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [countdown, setCountdown] = useState(8);

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

  // Calculate total price based on all booking items or the single selected dress
  const itemsToBook = bookingItems.length > 0 ? bookingItems : (selectedDress ? [selectedDress] : []);

  // Validate dates before allowing payment
  useEffect(() => {
    if (!selectedDate || !returnDate) return;
    
    const startDate = new Date(selectedDate);
    const endDate = new Date(returnDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    if (startDate < today) {
      alert('Rental start date cannot be in the past');
      router.push('/book/date');
    } else if (endDate <= startDate) {
      alert('Return date must be after start date');
      router.push('/book/date');
    }
  }, [selectedDate, returnDate, router]);

  const itemsTotal = itemsToBook.reduce((total, item) => {
    const price = item.rentalPricePerDay || item.price || 0;
    const qty = item.quantity || 1;
    return total + (price * qty);
  }, 0);

  const totalPrice = itemsTotal + (customMeasurements ? 500 : 0) + jewelleryTotal;

  const depositAmount = itemsToBook.reduce((total, item) => {
    const dep = item.depositAmount || ((item.rentalPricePerDay || item.price || 0) * 0.5);
    return total + (dep * (item.quantity || 1));
  }, 0);

  const advanceAmount = Math.round(totalPrice * 0.3);
  const balanceAmount = totalPrice - advanceAmount;
  const totalPayable = advanceAmount + depositAmount;

  useEffect(() => {
    setStep(5);
  }, [setStep]);

  // Countdown timer for success modal redirect
  useEffect(() => {
    if (!showSuccessModal) return;
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [showSuccessModal, countdown]);

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);

    // SIMULATED PAYMENT SUCCESS (as requested by user)
    // In production, this would be replaced by the Razorpay integration
    setTimeout(async () => {
      try {
        console.log('Simulating successful payment verification...');

        // Call the consolidated checkout API with dummy payment data
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            items: itemsToBook,
            customerDetails: {
              name: userProfile?.name || 'Customer',
              email: userProfile?.email || 'customer@example.com',
              phone: userProfile?.phone || '9999999999',
              address: userProfile?.address || 'Default Address'
            },
            paymentDetails: {
              // Dummy data for simulation - bypassed verification on backend for simulation purposes 
              // OR we can make backend accept "SIMULATED_SUCCESS" if in dev mode
              razorpayOrderId: `SIM_ORD_${Date.now()}`,
              razorpayPaymentId: `SIM_PAY_${Date.now()}`,
              razorpaySignature: 'SIM_SIG_123456789'
            },
            bookingPeriod: {
              startDate: selectedDate,
              endDate: returnDate,
              days: rentalDuration || 3
            },
            globalSpecialInstructions: specialInstructions || ''
          })
        });

        const checkoutResult = await checkoutRes.json();

        if (checkoutResult.success) {
          setAdvancePaid(advanceAmount);
          setDepositPaid(depositAmount);
          setBookingId(checkoutResult.orders[0] || 'Confirmed');
          setPaymentCompleted(true);

          // Update global store counts
          const { useCartStore } = await import('../../../../lib/stores/cartStore');
          useCartStore.getState().fetchCart();
          const { useAuthStore } = await import('../../../../lib/stores/authStore');
          useAuthStore.getState().fetchBookingsCount();

          setShowSuccessModal(true);
          setTimeout(() => {
            router.push('/dashboard/bookings');
          }, 8000);
        } else {
          throw new Error(checkoutResult.error || 'Checkout failed');
        }
      } catch (err: any) {
        console.error('Simulated checkout error:', err);
        alert(err.message || 'Payment simulated successfully but encounterd an error creating your booking.');
      } finally {
        setIsProcessing(false);
      }
    }, 1500); // Small realistic delay
  };

  const handleBack = () => {
    setStep(4);
    router.push('/book/review');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

  const formatDateFull = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const modalDetails = [
    { label: 'Booking ID', value: bookingId || '', mono: true },
    { label: 'Dress', value: selectedDress?.name || 'N/A' },
    { label: 'Rental Period', value: `${selectedDate ? formatDate(selectedDate.toString()) : 'N/A'} – ${returnDate ? formatDate(returnDate.toString()) : 'N/A'}` },
    { label: 'Amount Paid', value: `₹${totalPayable.toLocaleString()}` },
    { label: 'Status', value: 'Confirmed', highlight: true },
  ];

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        /* ── Brand Tokens ── */
        :root {
          --deep-rose:   #6B1F2A;
          --accent-rose: #C96E82;
          --blush:       #F0C4CC;
          --stone:       #F5E6E8;
          --ivory:       #FFF8F8;
          --muted-rose:  #A0525E;
          --body-text:   #7A5560;
          --dark-body:   rgba(240, 196, 204, 0.7);
          --dark-sub:    rgba(240, 196, 204, 0.55);
        }

        .payment-root {
          font-family: 'Jost', sans-serif;
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

        /* ── Header ── */
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
          font-family: 'Jost', sans-serif;
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

        /* ── Main grid ── */
        .main-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 32px;
          align-items: start;
        }

        @media (max-width: 860px) {
          .main-grid { grid-template-columns: 1fr; }
        }

        /* ── Card base ── */
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

        /* ── Payment breakdown ── */
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
          font-family: 'Jost', sans-serif;
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
          font-family: 'Jost', sans-serif;
        }

        .breakdown-row-sub {
          font-size: 11px;
          color: #b09898;
          margin-top: 3px;
          font-weight: 300;
          font-family: 'Jost', sans-serif;
        }

        .breakdown-row-amount {
          font-size: 15px;
          color: #1a1018;
          font-weight: 500;
          letter-spacing: -0.01em;
          white-space: nowrap;
          font-family: 'Jost', sans-serif;
        }

        .breakdown-row-amount.muted { color: #9a7a7a; }

        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(192,67,106,0.15), transparent);
          margin: 4px 0 20px;
        }

        /* ── Badge ── */
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
          font-family: 'Jost', sans-serif;
        }

        .badge-green {
          background: #f0faf5;
          color: #2d7a52;
          border: 1px solid #c3e8d5;
        }

        /* ── Summary card ── */
        .summary-line {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 11px 0;
          font-size: 14px;
          font-family: 'Jost', sans-serif;
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
          font-family: 'Jost', sans-serif;
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
          font-family: 'Jost', sans-serif;
          font-weight: 300;
        }

        /* ── Info list ── */
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
          font-family: 'Jost', sans-serif;
        }

        .info-list li::before {
          content: '—';
          color: rgba(192,67,106,0.4);
          flex-shrink: 0;
          font-size: 10px;
          margin-top: 2px;
        }

        /* ── Pay button ── */
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
          font-family: 'Jost', sans-serif;
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

        .pay-btn:active:not(:disabled) { transform: translateY(0); }
        .pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }

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
          font-family: 'Jost', sans-serif;
        }

        .trust-badge svg { width: 12px; height: 12px; }

        .progress-wrapper { margin-bottom: 40px; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .animate-1 { animation: fadeUp 0.5s ease both; }
        .animate-2 { animation: fadeUp 0.5s 0.1s ease both; }
        .animate-3 { animation: fadeUp 0.5s 0.2s ease both; }
        .animate-4 { animation: fadeUp 0.5s 0.3s ease both; }

        /* ════════════════════════════
           SUCCESS MODAL
        ════════════════════════════ */

        .sm-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(107, 31, 42, 0.55);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          z-index: 999;
          padding: 20px;
        }

        .sm-card {
          position: relative;
          width: 100%;
          max-width: 468px;
          background: var(--ivory);
          border-radius: 28px;
          overflow: hidden;
          animation: smCardEnter 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          box-shadow:
            0 2px 0 0 var(--blush),
            0 24px 64px rgba(107, 31, 42, 0.18),
            0 8px 24px rgba(107, 31, 42, 0.08);
        }

        @keyframes smCardEnter {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sm-header {
          background: var(--deep-rose);
          padding: 36px 36px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .sm-header::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 50% at 15% 110%, rgba(201,110,130,0.18) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 85% -10%, rgba(240,196,204,0.1) 0%, transparent 60%);
          pointer-events: none;
        }

        .sm-header::after {
          content: '';
          position: absolute; top: 0; left: 20%; right: 20%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(240,196,204,0.45), transparent);
        }

        /* Confetti */
        .sm-confetti {
          position: absolute; top: 0; left: 0; right: 0;
          height: 80px; pointer-events: none;
        }

        .sm-dot {
          position: absolute;
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--blush);
          animation: dotFall 1.4s ease-out forwards;
          opacity: 0;
        }
        .sm-dot:nth-child(2) { background: var(--accent-rose); }
        .sm-dot:nth-child(3) { background: var(--stone); }
        .sm-dot:nth-child(4) { background: var(--accent-rose); }
        .sm-dot:nth-child(5) { background: var(--blush); }

        @keyframes dotFall {
          0%   { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(72px); }
        }

        /* Check ring */
        .sm-check-wrap {
          position: relative;
          margin-bottom: 20px;
          z-index: 1;
        }

        .sm-ring-outer {
          width: 76px; height: 76px; border-radius: 50%;
          border: 1px solid rgba(240,196,204,0.2);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }

        .sm-ring-outer::before {
          content: '';
          position: absolute; inset: -8px; border-radius: 50%;
          border: 1px dashed rgba(240,196,204,0.15);
          animation: orbitSpin 18s linear infinite;
        }

        @keyframes orbitSpin { to { transform: rotate(360deg); } }

        .sm-ring-inner {
          width: 58px; height: 58px; border-radius: 50%;
          background: rgba(240,196,204,0.1);
          border: 1.5px solid rgba(240,196,204,0.3);
          display: flex; align-items: center; justify-content: center;
        }

        .sm-ring-inner svg {
          width: 24px; height: 24px;
          stroke: var(--blush); stroke-width: 2.2;
          stroke-dasharray: 38; stroke-dashoffset: 38;
          animation: drawCheck 0.65s 0.35s cubic-bezier(0.22,1,0.36,1) forwards;
        }

        @keyframes drawCheck { to { stroke-dashoffset: 0; } }

        /* Header text */
        .sm-header-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--dark-sub);
          margin-bottom: 8px; z-index: 1;
        }

        .sm-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 30px; font-weight: 300;
          color: var(--ivory);
          text-align: center; line-height: 1.2;
          z-index: 1;
        }

        .sm-title em { font-style: italic; color: var(--blush); }

        /* Modal body */
        .sm-body { padding: 28px 32px 32px; }

        .sm-message {
          font-size: 13px; font-weight: 300;
          color: var(--body-text);
          text-align: center; line-height: 1.85;
          margin-bottom: 24px;
          font-family: 'Jost', sans-serif;
        }

        /* Details table */
        .sm-details {
          border: 1px solid var(--stone);
          border-radius: 16px; overflow: hidden;
          margin-bottom: 24px;
        }

        .sm-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 11px 18px; gap: 16px;
          background: var(--ivory);
          border-bottom: 1px solid var(--stone);
          transition: background 0.15s;
        }

        .sm-row:nth-child(even) { background: var(--stone); }
        .sm-row:last-child      { border-bottom: none; }
        .sm-row:hover           { background: #f7d5db; }

        .sm-label {
          font-family: 'Jost', sans-serif;
          font-size: 10px; font-weight: 500;
          letter-spacing: 0.35em; text-transform: uppercase;
          color: var(--accent-rose); flex-shrink: 0;
        }

        .sm-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 16px; font-weight: 400;
          color: var(--deep-rose); text-align: right;
        }

        .sm-value.mono {
          font-family: 'Jost', sans-serif;
          font-size: 12px; font-weight: 400;
          letter-spacing: 0.1em; color: var(--muted-rose);
        }

        .sm-value.highlight {
          font-family: 'Jost', sans-serif;
          font-size: 14px; font-weight: 500;
          color: #2d7a52;
          display: flex; align-items: center; gap: 6px;
        }

        .sm-value.highlight::before {
          content: '';
          width: 6px; height: 6px; border-radius: 50%;
          background: #4caf78;
          box-shadow: 0 0 7px rgba(76,175,120,0.5);
          flex-shrink: 0;
          animation: statusPulse 2s ease-in-out infinite;
        }

        @keyframes statusPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }

        /* Divider */
        .sm-divider {
          display: flex; align-items: center; gap: 12px;
          margin-bottom: 20px;
        }

        .sm-divider-line { flex: 1; height: 1px; background: var(--stone); }
        .sm-divider-icon { color: var(--accent-rose); font-size: 14px; line-height: 1; }

        /* Modal primary button */
        .sm-cta {
          display: block; width: 100%; padding: 15px;
          background: var(--deep-rose);
          border: 1.5px solid var(--deep-rose);
          border-radius: 14px;
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: black; cursor: pointer;
          margin-bottom: 12px;
          transition: background 0.2s, border-color 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 16px rgba(107,31,42,0.22);
        }

        .sm-cta:hover {
          background: var(--muted-rose); border-color: var(--muted-rose);
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(107,31,42,0.28);
        }

        .sm-cta:active { transform: scale(0.98); }

        /* Modal ghost button */
        .sm-cta-ghost {
          display: block; width: 100%; padding: 13px;
          background: transparent;
          border: 1.5px solid var(--accent-rose);
          border-radius: 14px;
          font-family: 'Jost', sans-serif;
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: black; cursor: pointer;
          margin-bottom: 24px;
          transition: background 0.2s, color 0.2s, transform 0.15s;
        }

        .sm-cta-ghost:hover {
          background: var(--stone); color: var(--deep-rose);
          transform: translateY(-1px);
        }

        .sm-cta-ghost:active { transform: scale(0.98); }

        /* Progress + countdown */
        .sm-progress-track {
          height: 2px; border-radius: 2px;
          background: var(--stone); margin-bottom: 12px; overflow: hidden;
        }

        .sm-progress-fill {
          height: 100%; border-radius: 2px;
          background: linear-gradient(90deg, var(--accent-rose), var(--blush));
          transition: width 1s linear;
        }

        .sm-redirect {
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }

        .sm-redirect-text {
          font-size: 11px; font-weight: 300;
          color: var(--body-text); letter-spacing: 0.04em;
          font-family: 'Jost', sans-serif;
        }

        .sm-countdown {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 50%;
          background: var(--stone); border: 1px solid var(--blush);
          font-family: 'Cormorant Garamond', serif;
          font-size: 13px; font-weight: 400;
          color: var(--accent-rose);
          font-variant-numeric: tabular-nums;
        }
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

            {/* Left — Payment Breakdown */}
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

                  <div className="breakdown-section" style={{ marginBottom: 0 }}>
                    <p className="breakdown-label">Security</p>

                    <div className="breakdown-row" style={{ borderBottom: 'none' }}>
                      <div>
                        <div className="breakdown-row-label">Security Deposit</div>
                        <div style={{ marginTop: 6 }}>
                          <span className="badge badge-green">
                            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 10, height: 10 }}>
                              <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
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
                      <path d="M8 1l2 4 5 .7-3.5 3.4.8 5L8 12l-4.3 2.1.8-5L1 5.7 6 5z" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h2 className="card-title">Order Summary</h2>
                </div>

                <div className="card-body">

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

                  <div className="summary-total-block">
                    <p className="summary-total-label">Total Due Now</p>
                    <div className="summary-total-amount">
                      <span>₹</span>{totalPayable.toLocaleString()}
                    </div>
                  </div>

                  <ul className="info-list">
                    <li>Advance of 30% locks in your booking date</li>
                    <li>Security deposit returned within 3 days of return</li>
                  </ul>

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
                          <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 16, height: 16 }}>
                            <rect x="1" y="4" width="16" height="11" rx="2" />
                            <path d="M1 8h16" />
                          </svg>
                          Pay ₹{totalPayable.toLocaleString()}
                        </>
                      )}
                    </button>

                    <div className="trust-badge">
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3">
                        <path d="M7 1L2 3.5v4C2 10.5 4.5 13 7 13s5-2.5 5-5.5v-4L7 1z" strokeLinejoin="round" />
                        <path d="M5 7l1.5 1.5L9 5.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Secured by Razorpay
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Success Modal ── */}
        {showSuccessModal && (
          <div className="sm-overlay">
            <div className="sm-card">

              <div className="sm-header">
                <div className="sm-confetti">
                  {[
                    { left: '12%', delay: '0.3s' },
                    { left: '28%', delay: '0.5s' },
                    { left: '48%', delay: '0.2s' },
                    { left: '64%', delay: '0.6s' },
                    { left: '80%', delay: '0.4s' },
                  ].map((d, i) => (
                    <span key={i} className="sm-dot" style={{ left: d.left, animationDelay: d.delay }} />
                  ))}
                </div>

                <div className="sm-check-wrap">
                  <div className="sm-ring-outer">
                    <div className="sm-ring-inner">
                      <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                </div>

                <p className="sm-header-label">Booking confirmed</p>
                <h2 className="sm-title">Your dress is <em>reserved</em></h2>
              </div>

              <div className="sm-body">
                <p className="sm-message">
                  Your rental has been confirmed. A summary has been sent to your registered email address.
                </p>

                <div className="sm-details">
                  {modalDetails.map((d, i) => (
                    <div className="sm-row" key={i}>
                      <span className="sm-label">{d.label}</span>
                      <span className={`sm-value${d.mono ? ' mono' : ''}${d.highlight ? ' highlight' : ''}`}>
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="sm-divider">
                  <div className="sm-divider-line" />
                  <span className="sm-divider-icon">✿</span>
                  <div className="sm-divider-line" />
                </div>

                <button className="sm-cta" onClick={() => router.push('/dashboard/bookings')}>
                  View My Bookings
                </button>
                <button className="sm-cta-ghost" onClick={() => router.push('/')}>
                  Continue Browsing
                </button>

                <div className="sm-progress-track">
                  <div className="sm-progress-fill" style={{ width: `${((8 - countdown) / 8) * 100}%` }} />
                </div>

                <div className="sm-redirect">
                  <span className="sm-redirect-text">Redirecting to My Bookings in</span>
                  <span className="sm-countdown">{countdown}</span>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PaymentPage;