'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { Package, Truck, Calendar, ArrowRight, ArrowLeft, Loader2, Search, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const { user, token } = useAuthStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.data.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-brand-teal animate-spin mb-4" />
        <p className="text-gray-500 font-body">Fetching your treasure history...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-light/20 pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-teal hover:gap-3 transition-all mb-8 font-body text-sm font-medium">
          <ArrowLeft size={16} /> Back to Shopping
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-10">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl mb-3 text-brand-dark">My Orders</h1>
            <p className="text-brand-rose-gold uppercase tracking-[0.3em] text-[10px] font-bold">Trace Your Journey of Elegance</p>
          </div>
          <p className="text-sm font-body text-gray-500">{orders.length} Orders Found</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-luxury border border-teal-light">
            <div className="w-20 h-20 bg-teal-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-brand-teal opacity-40" />
            </div>
            <h3 className="font-heading text-2xl text-brand-dark mb-2">No Orders Yet</h3>
            <p className="text-gray-500 font-body mb-8 max-w-sm mx-auto">Your journey is just beginning. Explore our latest collections and find your first treasure.</p>
            <Link href="/jewellery" className="inline-block bg-brand-teal text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-dark transition-all shadow-lg">
              Explore Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div 
                key={order._id}
                className="bg-white rounded-3xl shadow-luxury overflow-hidden border border-teal-light group hover:border-brand-teal/30 transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-teal-light">
                  {/* Order Meta */}
                  <div className="p-6 lg:p-8 bg-teal-light/10 lg:w-72 shrink-0">
                    <div className="space-y-4">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Order ID</p>
                        <p className="text-sm font-heading text-brand-dark flex items-center gap-2">
                          #{order.orderNumber}
                          <ExternalLink size={12} className="text-brand-teal" />
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Date</p>
                        <div className="flex items-center gap-2 text-[13px] text-gray-600 font-body">
                          <Calendar size={14} className="text-brand-rose-gold" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                          order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-brand-teal/10 text-brand-teal'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div className="flex-grow p-6 lg:p-8">
                    <div className="flex flex-wrap gap-4 mb-6">
                      {order.items.slice(0, 4).map((item: any, idx: number) => (
                        <div key={idx} className="w-16 h-16 rounded-xl overflow-hidden border border-teal-light bg-gray-50 flex-shrink-0">
                          <img 
                            src={item.productImage} 
                            alt={item.productName} 
                            className="w-full h-full object-contain p-1"
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/FDFCF0/00494F?text=Luxury')}
                          />
                        </div>
                      ))}
                      {order.items.length > 4 && (
                        <div className="w-16 h-16 rounded-xl bg-teal-light flex items-center justify-center text-[11px] font-bold text-brand-teal border border-teal-light">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-[13px] font-body text-gray-600 leading-relaxed mb-4">
                        {order.items[0].productName} {order.items.length > 1 && `and ${order.items.length - 1} more items...`}
                      </p>
                      <p className="text-lg font-heading text-brand-dark">₹{order.total.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 lg:p-8 flex items-center lg:items-end justify-between lg:justify-end lg:flex-col lg:w-48 bg-teal-light/5">
                    <Link 
                      href={`/orders/${order._id}`}
                      className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-brand-teal hover:text-brand-dark transition-all group/link"
                    >
                      View Details
                      <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-all" />
                    </Link>
                    <button className="lg:mt-4 bg-white border border-teal-light text-brand-dark px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-teal-light transition-all shadow-sm">
                      Reorder
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center font-body text-sm text-gray-500">
          Showing {orders.length} order(s). <button className="text-brand-teal font-bold hover:underline">Contact Concierge</button> for any assistance.
        </div>
      </div>
    </div>
  );
}
