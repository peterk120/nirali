'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Share2, ShoppingBag, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useWishlistStore } from '../../../lib/stores/wishlistStore';
import { DressCard } from '../../../components/catalog/DressCard';
import { showAddedToWishlist } from '../../../lib/toast';

export default function WishlistPage() {
  const router = useRouter();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const [shareUrl, setShareUrl] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    document.title = `Your Wishlist (${items.length})`;
  }, [items.length]);

  const handleRemoveItem = (id: string) => {
    removeItem(id);
  };

  const handleClearWishlist = () => {
    clearWishlist();
  };

  const handleShareWishlist = async () => {
    setIsSharing(true);
    try {
      const currentUrl = window.location.href;
      const shareableUrl = `${currentUrl}?shared=true`;
      setShareUrl(shareableUrl);
      await navigator.clipboard.writeText(shareableUrl);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
    } finally {
      setIsSharing(false);
    }
  };

  const handleMoveAllToBooking = () => {
    const availableItems = items.filter(item => item.price > 0);
    if (availableItems.length === 0) {
      alert('No available dresses to book.');
      return;
    }
    alert(`Booking ${availableItems.length} dresses...`);
  };

  // ── Empty State ──
  if (items.length === 0) {
    return (
      <>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

          .empty-root {
            min-height: 100vh;
            background: #faf8f6;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'DM Sans', sans-serif;
          }

          .empty-inner {
            text-align: center;
            max-width: 380px;
            padding: 0 24px;
          }

          .empty-icon-ring {
            width: 88px; height: 88px;
            border: 1px solid rgba(192,67,106,0.15);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            margin: 0 auto 32px;
            position: relative;
          }

          .empty-icon-ring::before {
            content: '';
            position: absolute;
            inset: 6px;
            border: 1px solid rgba(192,67,106,0.08);
            border-radius: 50%;
          }

          .empty-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: 40px;
            font-weight: 300;
            color: #1a1018;
            margin: 0 0 12px;
            line-height: 1.1;
          }

          .empty-title em { font-style: italic; color: #C0436A; }

          .empty-text {
            font-size: 14px;
            color: #9a7a7a;
            font-weight: 300;
            line-height: 1.7;
            margin: 0 0 32px;
          }

          .empty-btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #C0436A;
            color: #fff;
            border: none;
            padding: 14px 32px;
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
        `}</style>

        <div className="empty-root">
          <div className="empty-inner">
            <div className="empty-icon-ring">
              <Heart size={30} color="#C0436A" strokeWidth={1.2} />
            </div>
            <h1 className="empty-title">Your wishlist is <em>empty</em></h1>
            <p className="empty-text">
              Save pieces you love by tapping the heart on any dress. They'll be waiting here for you.
            </p>
            <button className="empty-btn" onClick={() => router.push('/catalog/dresses')}>
              Browse Collection
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13}}>
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Main Page ──
  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; }

        .wl-root {
          min-height: 100vh;
          background: #faf8f6;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        .bg-blob {
          position: fixed;
          top: -200px; right: -200px;
          width: 560px; height: 560px;
          background: radial-gradient(circle, rgba(192,67,106,0.05) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .bg-blob-2 {
          position: fixed;
          bottom: -120px; left: -120px;
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(192,67,106,0.03) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .wl-inner {
          position: relative; z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 52px 24px 80px;
        }

        /* ── Header ── */
        .wl-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 48px;
          gap: 24px;
          flex-wrap: wrap;
        }

        .wl-title-block {}

        .wl-eyebrow {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C0436A;
          font-weight: 400;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .wl-eyebrow::before {
          content: '';
          display: inline-block;
          width: 20px; height: 1px;
          background: #C0436A;
          opacity: 0.5;
        }

        .wl-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5vw, 58px);
          font-weight: 300;
          color: #1a1018;
          margin: 0 0 8px;
          line-height: 1.05;
          letter-spacing: -0.01em;
        }

        .wl-title em { font-style: italic; color: #C0436A; }

        .wl-count {
          font-size: 13px;
          color: #9a7a7a;
          font-weight: 300;
          letter-spacing: 0.03em;
        }

        /* ── Action buttons ── */
        .wl-actions {
          display: flex;
          gap: 10px;
          align-items: center;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #C0436A;
          color: #fff;
          border: none;
          padding: 11px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
        }

        .btn-primary:hover { background: #a83860; transform: translateY(-1px); }

        .btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          color: #7a6262;
          border: 1px solid #ecddd5;
          padding: 10px 20px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .btn-ghost:hover {
          border-color: rgba(192,67,106,0.3);
          color: #C0436A;
          background: #fdf7f5;
        }

        .btn-ghost:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-clear {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: none;
          color: #c4adad;
          border: none;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 2px;
          transition: color 0.15s;
          white-space: nowrap;
        }

        .btn-clear:hover { color: #dc2626; }

        /* ── Divider ── */
        .wl-divider {
          height: 1px;
          background: linear-gradient(to right, rgba(192,67,106,0.12), transparent);
          margin-bottom: 36px;
        }

        /* ── Grid ── */
        .wl-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }

        /* ── Item wrapper ── */
        .wl-item {
          position: relative;
        }

        .remove-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 10;
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(4px);
          border: 1px solid rgba(192,67,106,0.15);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          color: #C0436A;
          transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
        }

        .remove-btn:hover {
          background: #fff;
          border-color: rgba(192,67,106,0.35);
          transform: scale(1.08);
        }

        /* ── Toast ── */
        .share-toast {
          position: fixed;
          bottom: 32px;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          background: #1a1018;
          color: #fff;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.03em;
          padding: 12px 24px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 100;
          white-space: nowrap;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }

        .share-toast svg { flex-shrink: 0; }

        /* Animations */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.45s ease both; }
        .delay-1 { animation-delay: 0.06s; }
        .delay-2 { animation-delay: 0.12s; }
      `}</style>

      <div className="wl-root">
        <div className="bg-blob" />
        <div className="bg-blob-2" />

        <div className="wl-inner">

          {/* Header */}
          <div className="wl-header fade-up">
            <div className="wl-title-block">
              <p className="wl-eyebrow">Saved pieces</p>
              <h1 className="wl-title">Your <em>wishlist</em></h1>
              <p className="wl-count">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
            </div>

            <div className="wl-actions">
              <button
                className="btn-ghost"
                onClick={handleShareWishlist}
                disabled={isSharing}
              >
                <Share2 size={13} strokeWidth={1.6} />
                {isSharing ? 'Copying...' : 'Share'}
              </button>

              <button className="btn-primary" onClick={handleMoveAllToBooking}>
                <ShoppingBag size={13} strokeWidth={1.6} />
                Book All
              </button>

              <button className="btn-clear" onClick={handleClearWishlist}>
                <X size={12} strokeWidth={1.6} />
                Clear All
              </button>
            </div>
          </div>

          <div className="wl-divider fade-up delay-1" />

          {/* Grid */}
          <div className="wl-grid fade-up delay-2">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  className="wl-item"
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <DressCard
                    id={item.productId}
                    name={item.name}
                    category={item.category}
                    images={[item.image]}
                    rentalPricePerDay={item.price}
                    depositAmount={item.price * 0.5}
                    sizes={['S', 'M', 'L']}
                    isAvailable={true}
                    rating={4.5}
                    slug={item.productId}
                    tags={[]}
                  />

                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={14} strokeWidth={0} fill="#C0436A" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

        </div>

        {/* Share toast */}
        <AnimatePresence>
          {shareToast && (
            <motion.div
              className="share-toast"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <svg viewBox="0 0 16 16" fill="none" stroke="#C0436A" strokeWidth="1.5" style={{width:14,height:14}}>
                <path d="M2 8l4 4 8-8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Wishlist link copied to clipboard
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </>
  );
}