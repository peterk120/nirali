'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookingCard } from '../../../../components/dashboard/BookingCard';
import { Button } from '../../../../components/ui/button';
import { StarRating } from '../../../../components/ui/StarRating';
import {
  Heart,
  User,
  Bell,
  Calendar,
  Star,
  Package,
  XCircle
} from 'lucide-react';

type BookingStatus = 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  orderId: string; // MongoDB Order _id for API calls
  dress: {
    id: string;
    name: string;
    category: string;
    image: string;
  };
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  amountPaid: number;
  depositStatus: 'held' | 'refunded' | 'refund_initiated';
  refundAmount?: number;
  isReviewed?: boolean; // Whether user has reviewed this order
  existingRating?: number; // User's existing rating (1-5)
}

const statusConfig = {
  upcoming: {
    label: 'Upcoming',
    color: '#2563eb',
    bg: '#eff6ff',
    border: 'rgba(37,99,235,0.15)',
    dot: '#2563eb',
  },
  active: {
    label: 'Active',
    color: '#15803d',
    bg: '#f0fdf4',
    border: 'rgba(21,128,61,0.15)',
    dot: '#15803d',
  },
  completed: {
    label: 'Completed',
    color: '#6b7280',
    bg: '#f9fafb',
    border: 'rgba(107,114,128,0.15)',
    dot: '#6b7280',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#dc2626',
    bg: '#fef2f2',
    border: 'rgba(220,38,38,0.15)',
    dot: '#dc2626',
  },
};

// Helper function to map order status to booking status
function mapOrderStatusToBookingStatus(orderStatus: string): 'upcoming' | 'active' | 'completed' | 'cancelled' {
  const today = new Date();

  // Map based on order status and dates
  if (orderStatus === 'cancelled') return 'cancelled';
  if (orderStatus === 'delivered') return 'active';
  if (orderStatus === 'returned' || orderStatus === 'completed') return 'completed';

  // Default logic based on rental dates
  const rentalStart = new Date(); // Will be set from order data
  const rentalEnd = new Date();   // Will be set from order data

  if (rentalStart > today) return 'upcoming';
  if (rentalEnd >= today) return 'active';
  return 'completed';
}

const MyBookingsPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<BookingStatus>('all');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  
  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<Booking | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [userReviewText, setUserReviewText] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Fetch current user and bookings on mount
  React.useEffect(() => {
    const initializeUserAndBookings = async () => {
      try {
        // Get current logged-in user from localStorage or auth context
        const storedUser = localStorage.getItem('user');

        if (!storedUser) {
          // User not logged in, redirect to login
          router.push('/login');
          return;
        }

        const user = JSON.parse(storedUser);
        const token = localStorage.getItem('token');
        setCurrentUser(user);

        if (!token) {
          console.warn('No authentication token found');
          setLoading(false);
          return;
        }

        // Fetch bookings for this user
        const response = await fetch(`/api/bookings?email=${encodeURIComponent(user.email)}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          // Transform MongoDB documents to Booking interface
          const transformedBookings = result.data.map((order: any) => ({
            id: order.orderId, // Display orderId
            orderId: order._id.toString(), // MongoDB _id for API calls
            dress: {
              id: order.productId?.toString() || order.productId || 'unknown',
              name: order.productName || 'Product',
              category: order.category || 'Unknown',
              image: order.productImage || '/placeholder-product.jpg'
            },
            startDate: new Date(order.rentalStartDate),
            endDate: new Date(order.rentalEndDate),
            status: mapOrderStatusToBookingStatus(order.status),
            amountPaid: order.totalAmount || 0,
            depositStatus: order.depositStatus || 'held',
            refundAmount: order.refundAmount,
            isReviewed: order.isReviewed || false,
            existingRating: order.rating
          }));

          setBookings(transformedBookings);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeUserAndBookings();
  }, [router]);

  const filteredBookings = activeTab === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeTab);

  // Customer-relevant actions only
  const handleCancelBooking = (id: string) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b));
  };

  const handleRescheduleBooking = (id: string) => {
    alert(`Rescheduling booking ${id}`);
  };

  // Submit review to API
  const submitReview = async (orderId: string, rating: number, reviewText: string) => {
    if (rating < 1) {
      alert('Please select at least 1 star');
      return;
    }

    setSubmittingReview(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          orderId: orderId,
          rating: rating,
          review: reviewText
        })
      });

      const result = await response.json();

      if (result.success) {
        alert('Thank you for your review!');
        
        // Update local state
        setBookings(prevBookings => prevBookings.map(b => 
          b.orderId === orderId
            ? { ...b, isReviewed: true, existingRating: rating }
            : b
        ));
        
        setShowReviewModal(false);
        setUserRating(0);
        setUserReviewText('');
      } else {
        alert(result.error || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Review submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLeaveReview = (id: string, rating?: number) => {
    const booking = bookings.find(b => b.orderId === id);
    if (!booking) return;

    if (rating) {
      // User clicked stars directly - submit rating immediately
      submitReview(booking.orderId, rating, '');
    } else {
      // Open modal for full review
      setSelectedBookingForReview(booking);
      setShowReviewModal(true);
    }
  };

  const handleBookAgain = (id: string) => {
    alert(`Booking again for booking ${id}`);
  };

  const handleViewRefundStatus = (id: string) => {
    alert(`Viewing refund status for booking ${id}`);
  };

  const bookingCounts = {
    all: bookings.length,
    upcoming: bookings.filter(b => b.status === 'upcoming').length,
    active: bookings.filter(b => b.status === 'active').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const emptyIcons: Record<BookingStatus, React.ReactNode> = {
    all: <Calendar size={28} strokeWidth={1.2} color="#C0436A" />,
    upcoming: <Calendar size={28} strokeWidth={1.2} color="#C0436A" />,
    active: <Package size={28} strokeWidth={1.2} color="#C0436A" />,
    completed: <Star size={28} strokeWidth={1.2} color="#C0436A" />,
    cancelled: <XCircle size={28} strokeWidth={1.2} color="#C0436A" />,
  };

  const emptyMessages: Record<BookingStatus, { title: string; desc: string }> = {
    all: { title: 'No bookings yet', desc: 'Your rental journey starts here.' },
    upcoming: { title: 'Nothing scheduled', desc: 'No upcoming bookings at the moment.' },
    active: { title: 'No active rentals', desc: "You don't have any items with you right now." },
    completed: { title: 'No past rentals', desc: "Your completed bookings will appear here." },
    cancelled: { title: 'No cancellations', desc: "You haven't cancelled any bookings." },
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const tabs: BookingStatus[] = ['all', 'upcoming', 'active', 'completed', 'cancelled'];

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .page-root {
          min-height: 100vh;
          background: #faf8f6;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }

        .bg-blob {
          position: fixed;
          top: -200px; right: -200px;
          width: 550px; height: 550px;
          background: radial-gradient(circle, rgba(192,67,106,0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .page-inner {
          position: relative; z-index: 1;
          max-width: 1120px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          display: grid;
          grid-template-columns: 220px 1fr;
          gap: 28px;
          align-items: start;
        }

        @media (max-width: 800px) {
          .page-inner { grid-template-columns: 1fr; padding-top: 32px; }
        }

        /* ── Sidebar ── */
        .sidebar {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          overflow: hidden;
          position: sticky;
          top: 28px;
        }

        .sidebar-profile {
          padding: 24px 20px 20px;
          border-bottom: 1px solid #f3eeeb;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar {
          width: 44px; height: 44px;
          border: 1px solid rgba(192,67,106,0.2);
          border-radius: 50%;
          background: #fdf2f5;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .profile-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 500;
          color: #1a1018;
          margin: 0 0 2px;
          line-height: 1.2;
        }

        .profile-badge {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C0436A;
          font-weight: 400;
        }

        .sidebar-nav {
          padding: 12px 10px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 12px;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 400;
          color: #7a6262;
          text-decoration: none;
          transition: all 0.15s;
          cursor: pointer;
        }

        .nav-item:hover { background: #fdf7f5; color: #3d2830; }

        .nav-item.active {
          background: #fdf2f5;
          color: #C0436A;
          font-weight: 500;
        }

        .nav-item.active svg { color: #C0436A; }

        /* ── Main content ── */
        .main {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* Header */
        .content-header {
          margin-bottom: 4px;
        }

        .page-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(34px, 4vw, 50px);
          font-weight: 300;
          color: #1a1018;
          margin: 0 0 8px;
          line-height: 1.05;
        }

        .page-title em { font-style: italic; color: #C0436A; }

        .page-sub {
          font-size: 13px;
          color: #9a7a7a;
          font-weight: 300;
          display: flex; align-items: center; gap: 8px;
          margin: 0;
        }

        .page-sub::before {
          content: '';
          display: inline-block;
          width: 22px; height: 1px;
          background: rgba(192,67,106,0.4);
        }

        /* Tabs */
        .tabs-bar {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          border-bottom: 1px solid #f0eae6;
          padding-bottom: 0;
          margin-bottom: 4px;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 16px;
          background: none;
          border: none;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 400;
          color: #9a7a7a;
          letter-spacing: 0.02em;
          cursor: pointer;
          transition: color 0.15s;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .tab-btn:hover { color: #3d2830; }

        .tab-btn.active {
          color: #C0436A;
          font-weight: 500;
          border-bottom-color: #C0436A;
        }

        .tab-count {
          font-size: 10px;
          font-weight: 500;
          padding: 2px 7px;
          border-radius: 20px;
          background: #f3eeeb;
          color: #9a7a7a;
          line-height: 1.6;
          transition: all 0.15s;
        }

        .tab-btn.active .tab-count {
          background: rgba(192,67,106,0.1);
          color: #C0436A;
        }

        /* Booking card */
        .booking-card {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          overflow: hidden;
          transition: border-color 0.2s;
        }

        .booking-card:hover { border-color: rgba(192,67,106,0.18); }

        .booking-card-inner {
          display: flex;
          gap: 0;
        }

        /* Image strip */
        .booking-img {
          width: 110px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          background: #f3eeeb;
        }

        .booking-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        @media (max-width: 560px) {
          .booking-img { width: 80px; }
        }

        /* Card body */
        .booking-body {
          flex: 1;
          padding: 22px 24px;
          display: flex;
          flex-direction: column;
          gap: 0;
          min-width: 0;
        }

        .booking-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 12px;
        }

        .booking-category {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C0436A;
          font-weight: 400;
          margin: 0 0 4px;
        }

        .booking-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 500;
          color: #1a1018;
          margin: 0;
          line-height: 1.15;
        }

        .booking-id {
          font-size: 11px;
          color: #b09898;
          font-weight: 300;
          letter-spacing: 0.04em;
          margin-top: 4px;
        }

        /* Status pill */
        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 20px;
          flex-shrink: 0;
          white-space: nowrap;
        }

        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Dates row */
        .dates-row {
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 14px;
        }

        .date-block { }

        .date-lbl {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #b09898;
          font-weight: 400;
          margin-bottom: 3px;
        }

        .date-val {
          font-size: 13px;
          color: #3d2830;
          font-weight: 400;
        }

        .date-sep {
          display: flex;
          align-items: center;
          padding-top: 14px;
          color: #ddd0cc;
          font-size: 18px;
          font-weight: 300;
        }

        /* Amount + deposit row */
        .meta-row {
          display: flex;
          gap: 24px;
          flex-wrap: wrap;
          padding: 12px 0;
          border-top: 1px solid #f7f3f0;
          border-bottom: 1px solid #f7f3f0;
          margin-bottom: 16px;
        }

        .meta-block { }

        .meta-lbl {
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #b09898;
          margin-bottom: 3px;
        }

        .meta-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 400;
          color: #1a1018;
          line-height: 1;
        }

        .deposit-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 500;
          padding: 3px 8px;
          border-radius: 20px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .deposit-held {
          background: #fffbeb;
          color: #b45309;
          border: 1px solid rgba(180,83,9,0.15);
        }

        .deposit-refunded {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid rgba(21,128,61,0.15);
        }

        .deposit-initiated {
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid rgba(37,99,235,0.15);
        }

        /* Actions */
        .actions-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
        }

        .action-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #C0436A;
          color: #fff;
          border: none;
          padding: 9px 18px;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .action-btn-primary:hover { background: #a83860; transform: translateY(-1px); }

        .action-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          color: #7a6262;
          border: 1px solid #ecddd5;
          padding: 8px 16px;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .action-btn-ghost:hover {
          border-color: rgba(192,67,106,0.3);
          color: #C0436A;
          background: #fdf7f5;
        }

        .action-btn-danger {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          color: #b09898;
          border: none;
          padding: 8px 12px;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.15s;
          margin-left: auto;
          white-space: nowrap;
        }

        .action-btn-danger:hover { color: #dc2626; }

        /* Refund notice */
        .refund-notice {
          margin-top: 10px;
          padding: 10px 14px;
          background: #f0fdf4;
          border: 1px solid rgba(21,128,61,0.15);
          border-radius: 2px;
          font-size: 12px;
          color: #15803d;
          font-weight: 300;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Empty state */
        .empty-state {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          padding: 64px 32px;
          text-align: center;
        }

        .empty-icon {
          width: 68px; height: 68px;
          border: 1px solid rgba(192,67,106,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 24px;
        }

        .empty-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 300;
          color: #1a1018;
          margin: 0 0 10px;
        }

        .empty-title em { font-style: italic; color: #C0436A; }

        .empty-desc {
          font-size: 13px;
          color: #9a7a7a;
          font-weight: 300;
          margin: 0 0 28px;
          line-height: 1.6;
        }

        .empty-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #C0436A;
          color: #fff;
          border: none;
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.2s, transform 0.15s;
        }

        .empty-btn:hover { background: #a83860; transform: translateY(-1px); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.4s ease both; }
        .delay-1 { animation-delay: 0.05s; }
        .delay-2 { animation-delay: 0.1s; }
        .delay-3 { animation-delay: 0.15s; }
        .delay-4 { animation-delay: 0.2s; }
      `}</style>

      <div className="page-root">
        <div className="bg-blob" />

        <div className="page-inner">

          {/* ── Sidebar ── */}
          <aside className="sidebar fade-up">
            <div className="sidebar-profile">
              <div className="avatar">
                <User size={18} color="#C0436A" strokeWidth={1.4} />
              </div>
              <div>
                <p className="profile-name">{currentUser?.name || 'Guest User'}</p>
                <span className="profile-badge">{currentUser?.email || 'Nirali Member'}</span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <a href="/dashboard/bookings" className="nav-item active">
                <Calendar size={15} strokeWidth={1.5} />
                My Bookings
              </a>
              <a href="/wishlist" className="nav-item">
                <Heart size={15} strokeWidth={1.5} />
                Wishlist
              </a>
              <a href="/dashboard/profile" className="nav-item">
                <User size={15} strokeWidth={1.5} />
                Profile
              </a>
              <a href="/notifications" className="nav-item">
                <Bell size={15} strokeWidth={1.5} />
                Notifications
              </a>
            </nav>
          </aside>

          {/* ── Main ── */}
          <main className="main">

            {/* Header */}
            <div className="content-header fade-up delay-1">
              <h1 className="page-title">My <em>bookings</em></h1>
              <p className="page-sub">{bookings.length} total reservation{bookings.length !== 1 ? 's' : ''}</p>
            </div>

            {/* Tabs */}
            <div className="tabs-bar fade-up delay-2">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  <span className="tab-count">{bookingCounts[tab]}</span>
                </button>
              ))}
            </div>

            {/* List */}
            <div className="fade-up delay-3" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {filteredBookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">{emptyIcons[activeTab]}</div>
                  <h3 className="empty-title">
                    {emptyMessages[activeTab].title.split(' ').slice(0, -1).join(' ')}{' '}
                    <em>{emptyMessages[activeTab].title.split(' ').slice(-1)}</em>
                  </h3>
                  <p className="empty-desc">{emptyMessages[activeTab].desc}</p>
                  <button className="empty-btn" onClick={() => router.push('/catalog/dresses')}>
                    Browse Collection
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 13, height: 13 }}>
                      <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                filteredBookings.map((booking, i) => {
                  const sc = statusConfig[booking.status];
                  return (
                    <div key={booking.id} className="booking-card" style={{ animationDelay: `${i * 0.07}s` }}>
                      <div className="booking-card-inner">

                        {/* Image */}
                        <div className="booking-img">
                          <img
                            src={booking.dress.image || '/placeholder-product.jpg'}
                            alt={booking.dress.name}
                            onError={(e) => { e.currentTarget.src = '/placeholder-product.jpg'; }}
                          />
                        </div>

                        {/* Body */}
                        <div className="booking-body">

                          {/* Top row */}
                          <div className="booking-top">
                            <div>
                              <p className="booking-category">{booking.dress.category}</p>
                              <h3 className="booking-name">{booking.dress.name}</h3>
                              <p className="booking-id">#{booking.id}</p>
                            </div>
                            <span
                              className="status-pill"
                              style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}
                            >
                              <span className="status-dot" style={{ background: sc.dot }} />
                              {sc.label}
                            </span>
                          </div>

                          {/* Dates */}
                          <div className="dates-row">
                            <div className="date-block">
                              <p className="date-lbl">Pickup</p>
                              <p className="date-val">{formatDate(booking.startDate)}</p>
                            </div>
                            <div className="date-sep">→</div>
                            <div className="date-block">
                              <p className="date-lbl">Return</p>
                              <p className="date-val">{formatDate(booking.endDate)}</p>
                            </div>
                          </div>

                          {/* Amount + Deposit */}
                          <div className="meta-row">
                            <div className="meta-block">
                              <p className="meta-lbl">Amount Paid</p>
                              <p className="meta-val">₹{booking.amountPaid.toLocaleString()}</p>
                            </div>
                            <div className="meta-block" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                              <p className="meta-lbl">Deposit</p>
                              <span className={`deposit-badge ${booking.depositStatus === 'held' ? 'deposit-held' :
                                booking.depositStatus === 'refunded' ? 'deposit-refunded' :
                                  'deposit-initiated'
                                }`}>
                                {booking.depositStatus === 'held' ? 'Held' :
                                  booking.depositStatus === 'refunded' ? '✓ Refunded' :
                                    'Refund Processing'}
                              </span>
                            </div>

                            {booking.refundAmount && (
                              <div className="meta-block">
                                <p className="meta-lbl">Refund</p>
                                <p className="meta-val" style={{ color: '#15803d' }}>₹{booking.refundAmount.toLocaleString()}</p>
                              </div>
                            )}
                          </div>

                          {/* ── Customer-facing actions only ── */}
                          <div className="actions-row">

                            {/* UPCOMING: reschedule + cancel */}
                            {booking.status === 'upcoming' && (
                              <>
                                <button className="action-btn-primary" onClick={() => handleRescheduleBooking(booking.id)}>
                                  Reschedule
                                </button>
                                <button className="action-btn-danger" onClick={() => handleCancelBooking(booking.id)}>
                                  Cancel Booking
                                </button>
                              </>
                            )}

                            {/* ACTIVE: view refund status (deposit info) */}
                            {booking.status === 'active' && (
                              <button className="action-btn-ghost" onClick={() => handleViewRefundStatus(booking.id)}>
                                Deposit Info
                              </button>
                            )}

                            {/* COMPLETED: leave review + book again */}
                            {booking.status === 'completed' && (
                              <>
                                <button className="action-btn-primary" onClick={() => handleLeaveReview(booking.id)}>
                                  <Star size={12} strokeWidth={1.6} />
                                  Leave a Review
                                </button>
                                <button className="action-btn-ghost" onClick={() => handleBookAgain(booking.id)}>
                                  Book Again
                                </button>
                              </>
                            )}

                            {/* CANCELLED: refund status + book again */}
                            {booking.status === 'cancelled' && (
                              <>
                                <button className="action-btn-ghost" onClick={() => handleViewRefundStatus(booking.id)}>
                                  Refund Status
                                </button>
                                <button className="action-btn-ghost" onClick={() => handleBookAgain(booking.id)}>
                                  Book Again
                                </button>
                              </>
                            )}

                          </div>

                          {/* Refund notice for cancelled */}
                          {booking.status === 'cancelled' && booking.refundAmount && (
                            <div className="refund-notice">
                              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ width: 14, height: 14, flexShrink: 0 }}>
                                <path d="M8 1l2 4 5 .7-3.5 3.4.8 5L8 12l-4.3 2.1.8-5L1 5.7 6 5z" strokeLinejoin="round" />
                              </svg>
                              Refund of ₹{booking.refundAmount.toLocaleString()} has been initiated to your original payment method.
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && selectedBookingForReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>

            {/* Header */}
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Rate Your Experience
              </h3>
              <p className="text-sm text-gray-600">
                How was your experience with this product?
              </p>
            </div>

            {/* Product Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
              <img
                src={selectedBookingForReview.dress.image}
                alt={selectedBookingForReview.dress.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {selectedBookingForReview.dress.name}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedBookingForReview.dress.category}
                </p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex justify-center">
                <StarRating
                  rating={userRating}
                  onRate={setUserRating}
                  editable={true}
                  size="lg"
                />
              </div>
              {userRating > 0 && (
                <p className="text-center text-sm text-brand-rose mt-2">
                  You selected {userRating} out of 5 stars
                </p>
              )}
            </div>

            {/* Written Review (Optional) */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={userReviewText}
                onChange={(e) => setUserReviewText(e.target.value)}
                placeholder="Share your experience with others..."
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-rose focus:border-transparent resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {userReviewText.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => submitReview(selectedBookingForReview.orderId, userRating, userReviewText)}
              disabled={userRating === 0 || submittingReview}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                userRating === 0 || submittingReview
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-brand-rose hover:bg-brand-rose/90 text-white'
              }`}
            >
              {submittingReview ? 'Submitting...' : `Submit ${userRating > 0 ? `${userRating}-Star` : ''} Review`}
            </button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              Reviews help other customers make informed decisions
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MyBookingsPage;