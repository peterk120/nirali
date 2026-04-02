'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { 
  ArrowLeft, Package, Truck, 
  MapPin, Calendar, CreditCard, 
  CheckCircle2, Loader2, Info,
  ExternalLink, ShoppingBag, Phone, Mail
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { token } = useAuthStore();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!token || !id) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/orders/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch order details', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [token, id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-brand-teal animate-spin mb-4" />
        <p className="text-gray-500 font-body">Unveiling your treasure details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-rose-light rounded-full flex items-center justify-center mb-6">
          <Info size={32} className="text-brand-rose-gold" />
        </div>
        <h3 className="font-heading text-2xl text-brand-dark mb-2">Order Not Found</h3>
        <p className="text-gray-500 font-body mb-8 max-w-sm">We couldn't find the details for this order. It might have been moved or doesn't exist.</p>
        <Link href="/orders" className="bg-brand-teal text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-dark transition-all shadow-lg">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-light/20 pb-24 font-body">
      <div className="max-w-6xl mx-auto px-4 pt-12">
        {/* Header Navigation */}
        <Link href="/orders" className="inline-flex items-center gap-2 text-brand-teal hover:gap-3 transition-all mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> All Orders
        </Link>

        {/* Order Identifier & Status Banner */}
        <div className="bg-white rounded-[40px] shadow-luxury border border-teal-light p-8 lg:p-12 mb-10 overflow-hidden relative group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-teal-light/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-rose-gold/10 transition-all duration-1000" />
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                 <div className="flex items-center gap-3 mb-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-600' : 
                      order.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-brand-teal/10 text-brand-teal'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-[10px] text-gray-300 font-bold tracking-widest">•</span>
                    <span className="text-[11px] font-bold text-brand-rose-gold uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                 </div>
                 <h1 className="font-heading text-4xl md:text-5xl text-brand-dark mb-2 italic">#{order.orderNumber}</h1>
                 <p className="text-gray-400 text-xs font-medium uppercase tracking-[0.3em]">Boutique Order ID</p>
              </div>
              <div className="flex items-center gap-4">
                 <button className="bg-brand-teal text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-dark transition-all shadow-lg flex items-center gap-3">
                   <Package size={18} /> Track Shipment
                 </button>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Detailed Order Items (2/3) */}
           <div className="lg:col-span-2 space-y-10">
              <section className="bg-white rounded-[40px] shadow-luxury border border-teal-light overflow-hidden">
                 <div className="px-10 py-8 border-b border-teal-light bg-teal-light/10">
                    <h2 className="font-heading text-2xl text-brand-dark flex items-center gap-3 italic">
                       <ShoppingBag size={24} className="text-brand-teal" />
                       Included Treasures ({order.items.length})
                    </h2>
                 </div>
                 <div className="divide-y divide-teal-light">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="p-10 flex flex-col sm:flex-row items-center gap-8 group hover:bg-teal-light/5 transition-colors">
                         <div className="w-32 h-32 rounded-3xl overflow-hidden border border-teal-light bg-gray-50 shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                            <img 
                              src={item.productImage} 
                              alt={item.productName} 
                              className="w-full h-full object-contain p-2"
                              onError={(e) => (e.currentTarget.src = 'https://placehold.co/400x400/FDFCF0/00494F?text=Luxury')}
                            />
                         </div>
                         <div className="flex-grow text-center sm:text-left">
                            <Link href={`/product/${item.productId}`} className="font-heading text-xl text-brand-dark hover:text-brand-teal transition-colors mb-2 block">{item.productName}</Link>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
                               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Qty: {item.quantity}</span>
                               {item.size && <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">Size: {item.size}</span>}
                            </div>
                            <p className="text-lg font-heading text-brand-teal italic">₹{item.unitPrice.toLocaleString('en-IN')}</p>
                         </div>
                         <div className="text-right shrink-0">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subtotal</p>
                            <p className="text-xl font-heading text-brand-dark">₹{item.totalPrice.toLocaleString('en-IN')}</p>
                         </div>
                      </div>
                    ))}
                 </div>
                 
                 {/* Financial Summary */}
                 <div className="bg-brand-dark p-12 text-white">
                    <div className="space-y-4 max-w-xs ml-auto">
                       <div className="flex justify-between text-teal-light/60 text-[10px] font-bold uppercase tracking-widest">
                          <span>Subtotal</span>
                          <span>₹{order.subtotal.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-brand-rose-gold text-[10px] font-bold uppercase tracking-widest">
                          <span>Discount Applied</span>
                          <span>- ₹{order.discount.toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between text-teal-light/60 text-[10px] font-bold uppercase tracking-widest">
                          <span>Concierge Shipping</span>
                          <span>{order.shippingCost === 0 ? 'COMPLIMENTARY' : `₹${order.shippingCost}`}</span>
                       </div>
                       <div className="h-px bg-white/10 my-4" />
                       <div className="flex justify-between items-end">
                          <span className="font-heading text-xl italic uppercase tracking-widest">Total</span>
                          <span className="font-heading text-3xl italic text-brand-rose-gold">₹{order.total.toLocaleString()}</span>
                       </div>
                    </div>
                 </div>
              </section>

              {/* Status Roadmap */}
              <section className="bg-white rounded-[40px] shadow-luxury border border-teal-light p-10 lg:p-12">
                 <h2 className="font-heading text-2xl text-brand-dark mb-10 italic">Journey Timeline</h2>
                 <div className="space-y-8 relative">
                    <div className="absolute top-0 bottom-0 left-[15px] w-0.5 bg-teal-light/30" />
                    {order.history.slice().reverse().map((h: any, idx: number) => (
                      <div key={idx} className="flex gap-8 relative z-10">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${idx === 0 ? 'bg-brand-teal border-brand-teal text-white shadow-lg shadow-brand-teal/20' : 'bg-white border-teal-light text-gray-300'}`}>
                            {idx === 0 ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-current" />}
                         </div>
                         <div>
                            <p className="text-xs font-bold text-brand-dark uppercase tracking-widest mb-1">{h.status}</p>
                            <p className="text-xs text-gray-500 font-body mb-2">{h.message}</p>
                            <p className="text-[10px] text-gray-400 font-medium">
                               {new Date(h.timestamp).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                            </p>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
           </div>

           {/* Sidebar Info (1/3) */}
           <div className="space-y-10">
              {/* Shipping Information */}
              <section className="bg-white rounded-[40px] shadow-luxury border border-teal-light overflow-hidden">
                 <div className="px-8 py-6 border-b border-teal-light bg-teal-light/5">
                    <h3 className="font-heading text-xl text-brand-dark italic flex items-center gap-3">
                       <Truck size={20} className="text-brand-teal" />
                       Delivery Destination
                    </h3>
                 </div>
                 <div className="p-8">
                    <div className="mb-6">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ship to</p>
                       <p className="text-sm font-bold text-brand-dark mb-1">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                       <div className="flex gap-2 text-gray-600 mb-4">
                          <MapPin size={14} className="shrink-0 mt-1 text-brand-teal" />
                          <p className="text-xs leading-relaxed">
                             {order.shippingAddress.street},<br />
                             {order.shippingAddress.city}, {order.shippingAddress.state},<br />
                             {order.shippingAddress.pincode}, India
                          </p>
                       </div>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-teal-light/50">
                       <div className="flex items-center gap-3 text-xs text-gray-600">
                          <Phone size={14} className="text-brand-teal" />
                          {order.shippingAddress.phone}
                       </div>
                       <div className="flex items-center gap-3 text-xs text-gray-600">
                          <Mail size={14} className="text-brand-teal" />
                          {order.shippingAddress.email}
                       </div>
                    </div>
                 </div>
              </section>

              {/* Payment Information */}
              <section className="bg-white rounded-[40px] shadow-luxury border border-teal-light overflow-hidden">
                 <div className="px-8 py-6 border-b border-teal-light bg-teal-light/5">
                    <h3 className="font-heading text-xl text-brand-dark italic flex items-center gap-3">
                       <CreditCard size={20} className="text-brand-teal" />
                       Payment Method
                    </h3>
                 </div>
                 <div className="p-8">
                    <div className="flex justify-between items-center bg-teal-light/20 p-4 rounded-2xl border border-teal-light">
                       <div className="flex items-center gap-3">
                          <CreditCard size={20} className="text-brand-teal" />
                          <span className="text-[11px] font-bold text-brand-dark uppercase tracking-widest">{order.paymentMethod}</span>
                       </div>
                       <span className="text-[9px] font-bold text-green-600 uppercase tracking-[0.2em] bg-green-100 px-3 py-1 rounded-full">{order.paymentStatus}</span>
                    </div>
                 </div>
              </section>

              {/* Support Card */}
              <section className="bg-brand-rose-gold/10 rounded-[40px] border border-brand-rose-gold/20 p-8 text-center">
                 <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-brand-rose-gold/20">
                    <Info size={24} className="text-brand-rose-gold" />
                 </div>
                 <h3 className="font-heading text-xl text-brand-dark mb-4 italic">Need Assistance?</h3>
                 <p className="text-xs text-gray-600 font-body mb-6 leading-relaxed">Our world-class concierges are ready to assist you with any questions regarding your treasure's journey.</p>
                 <button className="text-[11px] font-bold text-brand-rose-gold uppercase tracking-widest hover:text-brand-dark transition-all">Support Center</button>
              </section>
           </div>
        </div>
      </div>
    </div>
  );
}
