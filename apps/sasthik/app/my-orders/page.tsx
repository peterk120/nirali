'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Package, ChevronRight, 
  MapPin, Clock, CheckCircle2, 
  AlertCircle, ArrowRight, Loader2
} from 'lucide-react';
import { getMyOrders } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await getMyOrders();
        if (response.success && response.data) {
          setOrders(response.data.data);
        } else {
          setError(response.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-32 pb-20 container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12">
            <h1 className="font-heading text-5xl text-brand-dark italic mb-4">My Orders</h1>
            <p className="text-gray-500 font-body">Track and manage your Sashti Sparkle collection.</p>
          </header>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-brand-teal mb-4" size={40} />
              <p className="text-gray-400 font-body uppercase tracking-widest text-[10px] font-bold">Curating your history...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border border-rose-100 p-8 rounded-3xl text-center">
              <AlertCircle className="mx-auto text-brand-rose-gold mb-4" size={32} />
              <p className="text-brand-rose-gold font-bold mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="text-xs font-bold uppercase tracking-widest text-brand-teal underline"
              >
                Try Again
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-teal-light rounded-3xl">
              <div className="w-20 h-20 bg-teal-light/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="text-brand-teal" size={32} />
              </div>
              <h3 className="font-heading text-3xl text-brand-dark mb-4 italic">No Sparkle Yet?</h3>
              <p className="text-gray-500 font-body mb-8">Your order history is empty. Start exploring our exquisite collection.</p>
              <Link href="/" className="bg-brand-teal text-white px-10 py-4 rounded-xl font-bold tracking-widest uppercase text-[10px] hover:bg-brand-dark transition-all">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {orders.map((order) => (
                <motion.div 
                  key={order._id || order.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="bg-white border border-teal-light rounded-3xl overflow-hidden shadow-sm hover:shadow-luxury transition-all"
                >
                  <div className="p-6 md:p-8 bg-teal-light/5 border-b border-teal-light flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Order Date</p>
                        <p className="text-sm font-bold text-brand-dark">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div className="w-px h-8 bg-teal-light hidden sm:block" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Order Number</p>
                        <p className="text-sm font-bold text-brand-teal italic">{order.orderNumber}</p>
                      </div>
                      <div className="w-px h-8 bg-teal-light hidden sm:block" />
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total Amount</p>
                        <p className="text-sm font-bold text-brand-dark">₹{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 md:p-8">
                    <div className="flex flex-col gap-6">
                      {order.items.slice(0, 3).map((item: any, idx: number) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-white border border-teal-light rounded-lg overflow-hidden shrink-0">
                            <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-grow">
                            <h4 className="text-sm font-bold text-brand-dark line-clamp-1">{item.productName}</h4>
                            <p className="text-xs text-gray-400">Qty: {item.quantity} · Size: {item.size || 'N/A'}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-bold text-brand-teal italic">₹{item.totalPrice.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <p className="text-xs text-gray-400 italic">...and {order.items.length - 3} more items</p>
                      )}
                    </div>
                    
                    <div className="mt-8 pt-8 border-t border-teal-light flex items-center justify-between">
                       <div className="flex items-center gap-2 text-gray-400 text-xs">
                          <Clock size={14} />
                          <span>Estimated Delivery: {order.estimatedDelivery ? new Date(order.estimatedDelivery).toLocaleDateString() : 'Pending'}</span>
                       </div>
                       <Link href={`/my-orders/${order._id || order.id}` as any} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-brand-rose-gold hover:text-brand-teal transition-colors">
                          View Details <ArrowRight size={14} />
                       </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
