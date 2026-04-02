'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Calendar } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [deliveryDate, setDeliveryDate] = useState('');

  useEffect(() => {
    // Generate an estimated delivery date 5-7 days from now
    const date = new Date();
    date.setDate(date.getDate() + 5);
    const start = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    date.setDate(date.getDate() + 2);
    const end = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    setDeliveryDate(`${start} - ${end}`);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-2xl w-full">
        {/* Animated Checkmark */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="w-24 h-24 bg-brand-teal text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-luxury"
        >
          <CheckCircle2 size={48} />
        </motion.div>

        {/* Heading */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="font-heading text-5xl md:text-6xl text-brand-dark mb-4 italic"
        >
          Sparkle Incoming!
        </motion.h1>

        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 font-body mb-10 max-w-md mx-auto"
        >
          Your order <span className="font-bold text-brand-dark">#{orderId || 'SAS-CONFIRMED'}</span> has been placed successfully. A confirmation email is on its way to you.
        </motion.p>

        {/* Order Details Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-luxury mb-12 text-left"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-teal-light/30 rounded-full flex items-center justify-center text-brand-teal shrink-0">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Estimated Delivery</p>
                <p className="text-sm font-bold text-brand-dark">{deliveryDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-light/30 rounded-full flex items-center justify-center text-brand-rose-gold shrink-0">
                <Package size={18} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Shipping Method</p>
                <p className="text-sm font-bold text-brand-dark">Premium Express Shipping</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-50">
             <p className="text-xs text-gray-500 italic font-body">
                "Jewelry has the power to be the one little thing that makes you feel unique." — Thank you for choosing Saasthik.
             </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            href="/orders" 
            className="w-full sm:w-auto px-10 py-4 bg-brand-dark text-white font-body text-[11px] tracking-widest uppercase font-bold hover:bg-brand-teal transition-all shadow-lg flex items-center justify-center gap-2"
          >
            Track Order <ArrowRight size={14} />
          </Link>
          <Link 
            href="/jewellery" 
            className="w-full sm:w-auto px-10 py-4 border border-brand-dark text-brand-dark font-body text-[11px] tracking-widest uppercase font-bold hover:bg-brand-dark hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Continue Shopping <ShoppingBag size={14} />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
