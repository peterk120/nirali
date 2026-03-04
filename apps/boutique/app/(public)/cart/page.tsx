'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { X, Plus, Minus, ShoppingCart, CreditCard, Truck, Shield } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useWishlistStore } from '../../../lib/stores/wishlistStore';
import { showAddedToWishlist } from '../../../lib/toast';
import fetcher from '../../../lib/api';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  rentalDays: number;
  size?: string;
  rentalStartDate?: Date;
  isAvailable: boolean;
}

const CartPage = () => {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem: addToWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchCartItems = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setCartItems([]);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const resData = await response.json();

        if (resData.success && resData.data) {
          const items: CartItem[] = resData.data.map((item: any) => ({
            id: `cart-${item.productId._id || item.productId}`,
            productId: item.productId._id || item.productId,
            name: item.productId.name || 'Unknown Product',
            category: item.productId.category || 'Dress',
            image: item.productId.image || item.productId.images?.[0] || '',
            price: item.productId.rentalPricePerDay || item.productId.price || 0,
            originalPrice: item.productId.rentalPricePerDay || item.productId.price || 0,
            quantity: item.quantity,
            rentalDays: item.rentalDays,
            size: item.size || 'Medium',
            isAvailable: true
          }));
          setCartItems(items);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCartItems();
  }, []);

  const updateBackendCart = async (productId: string, quantity: number, rentalDays?: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          quantity,
          rentalDays,
          action: 'set'
        })
      });
    } catch (e) { console.error('Failed to update backend cart'); }
  };

  const updateQuantity = (id: string, productId: string, newQuantity: number, currentDays: number = 3) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    updateBackendCart(productId, newQuantity, currentDays);
  };

  const updateRentalDays = (id: string, productId: string, days: number, currentQuantity: number = 1) => {
    if (days < 1) return;
    setCartItems(prev => prev.map(item => item.id === id ? { ...item, rentalDays: days } : item));
    updateBackendCart(productId, currentQuantity, days);
  };

  const removeFromCart = async (id: string, productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));

    // update backend
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`/api/cart?productId=${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    }
  };

  const moveToWishlist = (item: CartItem) => {
    addToWishlist({ id: item.id, productId: item.productId, name: item.name, image: item.image, price: item.price, category: item.category });
    removeFromCart(item.id, item.productId);
    showAddedToWishlist(item.name);
  };

  const getTotalPrice = () => cartItems.reduce((total, item) => total + item.price * item.quantity * (item.rentalDays || 1), 0);

  const getDiscountAmount = () => cartItems.reduce((total, item) => {
    if (item.originalPrice) return total + (item.originalPrice - item.price) * item.quantity * (item.rentalDays || 1);
    return total;
  }, 0);

  const getTotalAfterDiscount = () => getTotalPrice() - getDiscountAmount();

  const handleCheckout = () => router.push('/book/dress');

  if (isLoading) {
    return (
      <>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
          .loader-root { min-height: 100vh; background: #faf8f6; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; }
          .loader-ring { width: 48px; height: 48px; border: 2px solid rgba(192,67,106,0.15); border-top-color: #C0436A; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 16px; }
          .loader-text { font-size: 13px; color: #9a7a7a; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 300; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div className="loader-root">
          <div>
            <div className="loader-ring" />
            <p className="loader-text">Loading your cart</p>
          </div>
        </div>
      </>
    );
  }

  if (cartItems.length === 0) {
    return (
      <>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
          .empty-root { min-height: 100vh; background: #faf8f6; display: flex; align-items: center; justify-content: center; font-family: 'DM Sans', sans-serif; }
          .empty-inner { text-align: center; max-width: 360px; padding: 0 24px; }
          .empty-icon-wrap { width: 80px; height: 80px; border: 1px solid rgba(192,67,106,0.15); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 28px; }
          .empty-title { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 300; color: #1a1018; margin: 0 0 12px; line-height: 1.1; }
          .empty-title em { font-style: italic; color: #C0436A; }
          .empty-text { font-size: 14px; color: #9a7a7a; font-weight: 300; line-height: 1.7; margin: 0 0 32px; }
          .empty-btn { display: inline-flex; align-items: center; gap: 8px; background: #C0436A; color: #fff; border: none; padding: 14px 32px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border-radius: 2px; transition: background 0.2s, transform 0.15s; }
          .empty-btn:hover { background: #a83860; transform: translateY(-1px); }
        `}</style>
        <div className="empty-root">
          <div className="empty-inner">
            <div className="empty-icon-wrap">
              <ShoppingCart size={28} color="#C0436A" strokeWidth={1.2} />
            </div>
            <h1 className="empty-title">Your cart is <em>empty</em></h1>
            <p className="empty-text">Browse our curated collection and find something you'll love to wear.</p>
            <button className="empty-btn" onClick={() => router.push('/catalog/dresses')}>
              Browse Collection
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}>
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        .cart-root {
          min-height: 100vh;
          background: #faf8f6;
          font-family: 'DM Sans', sans-serif;
          position: relative;
        }

        .bg-blob {
          position: fixed;
          top: -180px; right: -180px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(192,67,106,0.055) 0%, transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .cart-inner {
          position: relative; z-index: 1;
          max-width: 1160px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        /* Header */
        .cart-header { margin-bottom: 40px; }
        .cart-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(38px, 5vw, 58px);
          font-weight: 300;
          color: #1a1018;
          margin: 0 0 8px;
          line-height: 1.05;
          letter-spacing: -0.01em;
        }
        .cart-title em { font-style: italic; color: #C0436A; }
        .cart-count {
          font-size: 13px;
          color: #9a7a7a;
          font-weight: 300;
          letter-spacing: 0.04em;
          display: flex; align-items: center; gap: 8px;
        }
        .cart-count::before {
          content: '';
          display: inline-block;
          width: 24px; height: 1px;
          background: rgba(192,67,106,0.4);
        }

        /* Grid */
        .cart-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 28px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr; }
        }

        /* Items panel */
        .items-panel {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .cart-item {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .cart-item:hover { border-color: rgba(192,67,106,0.18); }

        .item-inner {
          display: flex;
          gap: 22px;
        }

        /* Image */
        .item-img-wrap {
          flex-shrink: 0;
          width: 88px; height: 120px;
          border-radius: 2px;
          overflow: hidden;
          background: #f3eeeb;
          position: relative;
        }
        .item-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Item body */
        .item-body { flex: 1; min-width: 0; }

        .item-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 14px;
          gap: 12px;
        }

        .item-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 500;
          color: #1a1018;
          margin: 0 0 4px;
          line-height: 1.2;
        }

        .item-category {
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #C0436A;
          font-weight: 400;
          margin: 0 0 3px;
        }

        .item-size {
          font-size: 12px;
          color: #9a7a7a;
          font-weight: 300;
        }

        .remove-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: none;
          border: 1px solid #ecddd5;
          border-radius: 50%;
          cursor: pointer;
          color: #b09898;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        .remove-btn:hover {
          background: #fdf2f5;
          border-color: rgba(192,67,106,0.3);
          color: #C0436A;
        }

        /* Price row */
        .price-row {
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 18px;
        }

        .price-main {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 400;
          color: #C0436A;
          line-height: 1;
        }

        .price-original {
          font-size: 15px;
          color: #c4adad;
          text-decoration: line-through;
          font-weight: 300;
        }

        .price-unit {
          font-size: 12px;
          color: #9a7a7a;
          font-weight: 300;
        }

        .discount-chip {
          background: #fdf2f5;
          border: 1px solid rgba(192,67,106,0.15);
          color: #C0436A;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.06em;
          padding: 3px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          margin-left: auto;
        }

        /* Controls row */
        .controls-row {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          align-items: center;
          margin-bottom: 18px;
        }

        .control-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .control-label {
          font-size: 11px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #9a7a7a;
          font-weight: 400;
        }

        .stepper {
          display: flex;
          align-items: center;
          border: 1px solid #ecddd5;
          border-radius: 2px;
          overflow: hidden;
        }

        .stepper-btn {
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: #3d2830;
          transition: background 0.15s;
        }

        .stepper-btn:hover:not(:disabled) { background: #fdf2f5; }
        .stepper-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .stepper-val {
          min-width: 36px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: #1a1018;
          padding: 0 4px;
          border-left: 1px solid #ecddd5;
          border-right: 1px solid #ecddd5;
          line-height: 32px;
        }

        .save-later-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #9a7a7a;
          font-weight: 400;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          letter-spacing: 0.02em;
          transition: color 0.2s;
        }
        .save-later-btn:hover { color: #C0436A; }

        /* Item footer */
        .item-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
          border-top: 1px solid #f7f3f0;
        }

        .item-total-label {
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9a7a7a;
          font-weight: 300;
        }

        .item-total-amount {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 400;
          color: #1a1018;
        }

        /* ---- Right sidebar ---- */
        .sidebar { display: flex; flex-direction: column; gap: 16px; }

        .summary-card {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          overflow: hidden;
        }

        .summary-header {
          padding: 22px 26px 18px;
          border-bottom: 1px solid #f3eeeb;
          display: flex; align-items: center; gap: 10px;
        }

        .summary-header-icon {
          width: 30px; height: 30px;
          border: 1px solid rgba(192,67,106,0.2);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .summary-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px;
          font-weight: 500;
          color: #1a1018;
          margin: 0;
        }

        .summary-body { padding: 24px 26px; }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 9px 0;
          font-size: 14px;
        }

        .summary-row .lbl { color: #7a6262; font-weight: 300; }
        .summary-row .val { color: #1a1018; font-weight: 500; }
        .summary-row .val.green { color: #2d7a52; }

        .summary-divider { height: 1px; background: #f3eeeb; margin: 8px 0; }

        .summary-total-block {
          background: linear-gradient(135deg, #fdf2f5 0%, #faf8f6 100%);
          border: 1px solid rgba(192,67,106,0.12);
          border-radius: 2px;
          padding: 18px 20px;
          margin: 20px 0 24px;
        }

        .summary-total-lbl {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9a7a7a;
          margin-bottom: 6px;
        }

        .summary-total-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 44px;
          font-weight: 300;
          color: #1a1018;
          line-height: 1;
          letter-spacing: -0.02em;
        }
        .summary-total-num span {
          font-size: 22px;
          color: #9a7a7a;
          vertical-align: super;
          font-family: 'DM Sans', sans-serif;
          font-weight: 300;
        }

        .checkout-btn {
          width: 100%;
          height: 54px;
          background: #C0436A;
          color: #fff;
          border: none;
          border-radius: 2px;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          gap: 10px;
          position: relative;
          overflow: hidden;
          transition: background 0.2s, transform 0.15s;
        }
        .checkout-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%);
        }
        .checkout-btn:hover { background: #a83860; transform: translateY(-1px); }

        .continue-link {
          text-align: center;
          margin-top: 14px;
          font-size: 12px;
          color: #9a7a7a;
        }

        .continue-link a {
          color: #C0436A;
          text-decoration: none;
          font-weight: 400;
          cursor: pointer;
        }

        /* Trust card */
        .trust-card {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          padding: 22px 26px;
        }

        .trust-title {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9a7a7a;
          font-weight: 400;
          margin-bottom: 16px;
        }

        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 0;
          font-size: 13px;
          color: #3d2830;
          font-weight: 300;
          border-bottom: 1px solid #f7f3f0;
        }
        .trust-item:last-child { border-bottom: none; }

        .trust-icon {
          width: 30px; height: 30px;
          background: #fdf2f5;
          border: 1px solid rgba(192,67,106,0.12);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

      <div className="cart-root">
        <div className="bg-blob" />

        <div className="cart-inner">

          {/* Header */}
          <motion.div className="cart-header" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="cart-title">Your <em>cart</em></h1>
            <p className="cart-count">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} selected</p>
          </motion.div>

          <div className="cart-grid">

            {/* Items */}
            <div className="items-panel">
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="cart-item"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <div className="item-inner">

                    {/* Image */}
                    <div className="item-img-wrap">
                      <img
                        src={item.image || '/placeholder-product.jpg'}
                        alt={item.name}
                        onError={(e) => { e.currentTarget.src = '/placeholder-product.jpg'; }}
                      />
                    </div>

                    {/* Body */}
                    <div className="item-body">
                      <div className="item-top">
                        <div>
                          <p className="item-category">{item.category}</p>
                          <h3 className="item-name">{item.name}</h3>
                          {item.size && <p className="item-size">Size: {item.size}</p>}
                        </div>
                        <button className="remove-btn" onClick={() => removeFromCart(item.id, item.productId)} aria-label="Remove">
                          <X size={13} strokeWidth={1.8} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="price-row">
                        <span className="price-main">₹{item.price.toLocaleString()}</span>
                        {item.originalPrice && item.originalPrice !== item.price && (
                          <span className="price-original">₹{item.originalPrice.toLocaleString()}</span>
                        )}
                        <span className="price-unit">/day</span>
                        {item.originalPrice && item.originalPrice !== item.price && (
                          <span className="discount-chip">
                            {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% off
                          </span>
                        )}
                      </div>

                      {/* Controls */}
                      <div className="controls-row">
                        <div className="control-group">
                          <span className="control-label">Qty</span>
                          <div className="stepper">
                            <button className="stepper-btn" onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1, item.rentalDays)} disabled={item.quantity <= 1}>
                              <Minus size={12} strokeWidth={2} />
                            </button>
                            <span className="stepper-val">{item.quantity}</span>
                            <button className="stepper-btn" onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1, item.rentalDays)}>
                              <Plus size={12} strokeWidth={2} />
                            </button>
                          </div>
                        </div>

                        {item.category !== 'Jewellery' && (
                          <div className="control-group">
                            <span className="control-label">Days</span>
                            <div className="stepper">
                              <button className="stepper-btn" onClick={() => updateRentalDays(item.id, item.productId, (item.rentalDays || 1) - 1, item.quantity)} disabled={(item.rentalDays || 1) <= 1}>
                                <Minus size={12} strokeWidth={2} />
                              </button>
                              <span className="stepper-val">{item.rentalDays || 1}</span>
                              <button className="stepper-btn" onClick={() => updateRentalDays(item.id, item.productId, (item.rentalDays || 1) + 1, item.quantity)}>
                                <Plus size={12} strokeWidth={2} />
                              </button>
                            </div>
                          </div>
                        )}

                        <button className="save-later-btn" onClick={() => moveToWishlist(item)}>
                          <svg width="13" height="13" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          Save for later
                        </button>
                      </div>

                      {/* Item total */}
                      <div className="item-footer">
                        <span className="item-total-label">Item total</span>
                        <span className="item-total-amount">
                          ₹{(item.price * item.quantity * (item.rentalDays || 1)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="sidebar">

              {/* Summary card */}
              <motion.div
                className="summary-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="summary-header">
                  <div className="summary-header-icon">
                    <svg viewBox="0 0 16 16" fill="none" stroke="#C0436A" strokeWidth="1.4" style={{ width: 13, height: 13 }}>
                      <rect x="1" y="3" width="14" height="10" rx="1.5" />
                      <path d="M1 7h14" strokeLinecap="round" />
                    </svg>
                  </div>
                  <h2 className="summary-title">Order Summary</h2>
                </div>

                <div className="summary-body">
                  <div className="summary-row">
                    <span className="lbl">Subtotal</span>
                    <span className="val">₹{getTotalPrice().toLocaleString()}</span>
                  </div>

                  {getDiscountAmount() > 0 && (
                    <div className="summary-row">
                      <span className="lbl">Discount</span>
                      <span className="val green">−₹{getDiscountAmount().toLocaleString()}</span>
                    </div>
                  )}

                  <div className="summary-row">
                    <span className="lbl">Rental Period</span>
                    <span className="val">
                      {cartItems.reduce((t, i) => t + (i.rentalDays || 1), 0)} days
                    </span>
                  </div>

                  <div className="summary-divider" />

                  {/* Big total */}
                  <div className="summary-total-block">
                    <p className="summary-total-lbl">Total Due</p>
                    <div className="summary-total-num">
                      <span>₹</span>{getTotalAfterDiscount().toLocaleString()}
                    </div>
                  </div>

                  <button className="checkout-btn" onClick={handleCheckout}>
                    <CreditCard size={15} strokeWidth={1.6} />
                    Proceed to Checkout
                  </button>

                  <div className="continue-link">
                    <a onClick={() => router.push('/catalog/dresses')}>Continue shopping</a>
                  </div>
                </div>
              </motion.div>

              {/* Trust card */}
              <motion.div
                className="trust-card"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <p className="trust-title">Why Nirali Boutique</p>

                <div className="trust-item">
                  <div className="trust-icon">
                    <Shield size={13} color="#C0436A" strokeWidth={1.4} />
                  </div>
                  Secure & Encrypted Payment
                </div>

                <div className="trust-item">
                  <div className="trust-icon">
                    <Truck size={13} color="#C0436A" strokeWidth={1.4} />
                  </div>
                  Free Delivery & Pickup
                </div>

                <div className="trust-item">
                  <div className="trust-icon">
                    <svg viewBox="0 0 16 16" fill="none" stroke="#C0436A" strokeWidth="1.4" style={{ width: 13, height: 13 }}>
                      <path d="M8 1l2 4 5 .7-3.5 3.4.8 5L8 12l-4.3 2.1.8-5L1 5.7 6 5z" strokeLinejoin="round" />
                    </svg>
                  </div>
                  Curated Quality Pieces
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartPage;