'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Truck, 
  MapPin, CreditCard, ChevronRight,
  CheckCircle2, Clock, ShieldCheck,
  Printer, Download, MessageSquare, Loader2
} from 'lucide-react';
import { getOrderById } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const response = await getOrderById(id as string);
        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || 'Order not found');
        }
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-brand-teal mb-4" size={40} />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Unveiling your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="font-heading text-4xl text-brand-dark mb-4 italic">Oops!</h2>
        <p className="text-gray-500 font-body mb-8">{error || 'Order not found'}</p>
        <Link href="/my-orders" className="text-brand-teal font-bold uppercase tracking-widest text-xs flex items-center gap-2">
          <ArrowLeft size={16} /> Back to My Orders
        </Link>
      </div>
    );
  }

  const steps = [
    { label: 'Pending', icon: Clock, key: 'pending' },
    { label: 'Confirmed', icon: CheckCircle2, key: 'confirmed' },
    { label: 'Processing', icon: Package, key: 'processing' },
    { label: 'Shipped', icon: Truck, key: 'shipped' },
    { label: 'Delivered', icon: CheckCircle2, key: 'delivered' }
  ];

  const currentStep = steps.findIndex(s => s.key === order.status);
  const displayStep = currentStep === -1 ? 0 : currentStep;

  return (
    <main className="min-h-screen bg-[#FBFBFB]">
      <Navbar />

      <div className="pt-32 pb-24 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <Link href="/my-orders" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-brand-teal flex items-center gap-2 mb-4 transition-colors">
                <ArrowLeft size={14} /> Back to My Orders
              </Link>
              <h1 className="font-heading text-5xl text-brand-dark italic mb-2">Order Detail</h1>
              <p className="text-sm font-bold text-brand-teal italic">{order.orderNumber}</p>
            </div>
            <div className="flex gap-4">
              <button className="p-4 bg-white border border-teal-light rounded-xl text-gray-400 hover:text-brand-teal transition-all shadow-sm">
                <Printer size={18} />
              </button>
              <button className="flex items-center gap-3 bg-brand-teal text-white px-8 py-4 rounded-xl font-bold tracking-widest uppercase text-[10px] hover:bg-brand-dark transition-all shadow-luxury">
                <Download size={16} /> Invoice
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content (Order Details) */}
            <div className="lg:col-span-2 flex flex-col gap-10">
              
              {/* Tracking Stepper */}
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-teal-light shadow-sm">
                <h3 className="text-[10px] uppercase tracking-widest text-brand-rose-gold font-bold mb-10">Order Status</h3>
                <div className="relative flex justify-between">
                  <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-100 -z-0" />
                  <div 
                    className="absolute top-4 left-0 h-[2px] bg-brand-teal -z-0 transition-all duration-1000" 
                    style={{ width: `${(displayStep / (steps.length - 1)) * 100}%` }}
                  />
                  
                  {steps.map((s, i) => (
                    <div key={s.label} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${i <= displayStep ? 'bg-brand-teal border-brand-teal text-white' : 'bg-white border-gray-100 text-gray-300'}`}>
                        <s.icon size={18} />
                      </div>
                      <p className={`mt-4 text-[9px] uppercase tracking-widest font-bold ${i <= displayStep ? 'text-brand-dark' : 'text-gray-300'}`}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="bg-white rounded-[2.5rem] border border-teal-light shadow-sm overflow-hidden">
                <div className="p-8 border-b border-teal-light flex justify-between items-center">
                   <h3 className="text-xl font-heading text-brand-dark italic">Items in this Order</h3>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{order.items.length} Items</span>
                </div>
                <div className="p-8 flex flex-col gap-8">
                  {order.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-6 items-center">
                      <div className="w-24 h-24 bg-teal-light/10 rounded-2xl border border-teal-light overflow-hidden shrink-0">
                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-grow text-center sm:text-left">
                        <h4 className="font-heading text-xl text-brand-dark mb-1">{item.productName}</h4>
                        <p className="text-xs text-gray-400 font-body mb-2">Category: {item.category || 'Luxury Collection'}</p>
                        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                           <span className="px-3 py-1 bg-teal-light/20 text-[9px] font-bold uppercase tracking-widest text-brand-teal rounded-full">Size: {item.size || 'N/A'}</span>
                           <span className="px-3 py-1 bg-teal-light/20 text-[9px] font-bold uppercase tracking-widest text-brand-teal rounded-full">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <div className="text-center sm:text-right">
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-1">Total</p>
                        <p className="text-lg font-bold text-brand-teal italic">₹{item.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* History Timeline */}
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-teal-light shadow-sm">
                 <h3 className="text-xl font-heading text-brand-dark italic mb-10">Order History</h3>
                 <div className="flex flex-col gap-8">
                    {order.history?.map((h: any, i: number) => (
                      <div key={i} className="flex gap-6 relative">
                         {i < order.history.length - 1 && <div className="absolute top-2 left-2 w-[1px] h-full bg-teal-light" />}
                         <div className="w-4 h-4 rounded-full bg-brand-teal border-4 border-teal-light/30 shrink-0 relative z-10" />
                         <div>
                            <p className="text-xs font-bold text-brand-dark uppercase tracking-widest mb-1">{h.status.replace(/_/g, ' ')}</p>
                            <p className="text-[10px] text-gray-400 mb-2">{new Date(h.timestamp).toLocaleString()}</p>
                            <p className="text-sm text-gray-500 font-body italic">"{h.message}"</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            {/* Sidebar (Summary & Info) */}
            <div className="flex flex-col gap-10">
              
              {/* Payment Summary */}
              <div className="bg-brand-dark p-10 rounded-[2.5rem] text-white shadow-luxury relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full -mr-16 -mt-16" />
                <h3 className="text-[10px] uppercase tracking-widest text-teal-light font-bold mb-8">Payment Summary</h3>
                
                <div className="flex flex-col gap-4 mb-8">
                  <div className="flex justify-between text-sm opacity-60">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-60">
                    <span>Tax</span>
                    <span>₹{order.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm opacity-60">
                    <span>Shipping</span>
                    <span>₹{order.shippingCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-brand-rose-gold font-bold">
                    <span>Discount</span>
                    <span>- ₹{order.discount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                   <div>
                     <p className="text-[9px] uppercase tracking-widest opacity-40 font-bold mb-1">Total Amount</p>
                     <p className="text-3xl font-heading italic">₹{order.total.toLocaleString()}</p>
                   </div>
                   <div className="px-3 py-1 bg-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest">
                      {order.paymentStatus}
                   </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-teal-light shadow-sm">
                 <div className="flex items-center gap-3 mb-8">
                    <MapPin className="text-brand-rose-gold" size={20} />
                    <h3 className="text-sm font-bold text-brand-dark uppercase tracking-widest">Shipping Address</h3>
                 </div>
                 <div className="text-sm text-gray-600 font-body leading-relaxed">
                    <p className="font-bold text-brand-dark mb-2">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                    <p>{order.shippingAddress.street}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.pincode}</p>
                    <p>{order.shippingAddress.state}, {order.shippingAddress.country}</p>
                    <p className="mt-4 pt-4 border-t border-teal-light/30">Phone: {order.shippingAddress.phone}</p>
                 </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-10 rounded-[2.5rem] border border-teal-light shadow-sm">
                 <div className="flex items-center gap-3 mb-6">
                    <CreditCard className="text-brand-teal" size={20} />
                    <h3 className="text-sm font-bold text-brand-dark uppercase tracking-widest">Payment Details</h3>
                 </div>
                 <p className="text-sm text-gray-600 font-body mb-4">Method: <span className="font-bold text-brand-dark uppercase">{order.paymentMethod}</span></p>
                 {order.paymentDetails?.transactionId && (
                   <p className="text-[10px] text-gray-400 font-mono">TXN: {order.paymentDetails.transactionId}</p>
                 )}
                 <div className="mt-6 flex items-center gap-2 text-green-600">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Secure Transaction</span>
                 </div>
              </div>

              {/* Need Help? */}
              <Link href="/" className="bg-teal-light/10 border border-teal-light p-8 rounded-[2rem] flex items-center justify-between group">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all">
                       <MessageSquare size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-bold text-brand-dark">Need Help?</p>
                       <p className="text-[10px] text-gray-400">Contact Sashti Support</p>
                    </div>
                 </div>
                 <ChevronRight size={18} className="text-gray-300 group-hover:text-brand-teal transition-all" />
              </Link>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
