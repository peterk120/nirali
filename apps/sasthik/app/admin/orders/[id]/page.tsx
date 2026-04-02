'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminWrapper from '../../AdminWrapper';
import { 
  ArrowLeft, 
  Printer, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  CreditCard,
  MapPin,
  User as UserIcon,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { Order, OrderStatus } from '@nirali-sai/types';
import { getOrderByIdAdmin, updateOrderStatus, verifyOrderPayment } from '@/lib/api';
import { formatDate, formatPrice } from '@nirali-sai/utils';
import toast from 'react-hot-toast';
import { OrderInvoice } from '@/components/admin/OrderInvoice';
import { OrderLabel } from '@/components/admin/OrderLabel';

const STATUS_STEPS = [
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'processing', label: 'Processing', icon: Package },
  { id: 'packed', label: 'Packed', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  
  const invoiceRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const response = await getOrderByIdAdmin(id);
      if (response.success && response.data) {
        setOrder(response.data);
      } else {
        toast.error(response.error?.message || 'Order not found');
        router.push('/admin/orders');
      }
    } catch (error) {
      toast.error('An error occurred while fetching order details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    setUpdating(true);
    try {
      const response = await updateOrderStatus(id, { status });
      if (response.success) {
        toast.success(`Order status updated to ${status}`);
        setOrder(response.data!);
      } else {
        toast.error(response.error?.message || 'Failed to update status');
      }
    } catch (error) {
      toast.error('An error occurred while updating status');
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyPayment = async () => {
    const transactionId = window.prompt('Enter Transaction ID for verification:');
    if (!transactionId) return;

    setVerifying(true);
    try {
      const response = await verifyOrderPayment(id, { transactionId });
      if (response.success) {
        toast.success('Payment verified successfully');
        setOrder(response.data!);
      } else {
        toast.error(response.error?.message || 'Failed to verify payment');
      }
    } catch (error) {
      toast.error('An error occurred while verifying payment');
    } finally {
      setVerifying(false);
    }
  };

  const handlePrint = (type: 'invoice' | 'label') => {
    const printWindow = window.open('', '_blank');
    if (!printWindow || !order) return;

    const content = type === 'invoice' 
      ? document.getElementById('printable-invoice')?.innerHTML 
      : document.getElementById('printable-label')?.innerHTML;

    printWindow.document.write(`
      <html>
        <head>
          <title>Sashti Sparkle - ${type.toUpperCase()}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@400;500;700&display=swap');
            body { font-family: 'DM Sans', sans-serif; }
            .font-serif { font-family: 'Cormorant Garamond', serif; }
            @media print {
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body class="p-0 m-0">
          <div class="p-8">
            ${content}
          </div>
          <script>
            window.onload = () => {
              window.print();
              // window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <AdminWrapper>
        <div className="p-8 md:p-12 animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-8" />
          <div className="h-64 bg-white border border-teal-light rounded-[32px] mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-64 bg-white border border-teal-light rounded-[32px]" />
            <div className="h-64 bg-white border border-teal-light rounded-[32px]" />
          </div>
        </div>
      </AdminWrapper>
    );
  }

  if (!order) return null;

  const currentStatusIndex = STATUS_STEPS.findIndex(s => s.id === order.status);

  return (
    <AdminWrapper>
      <div className="p-8 md:p-12 max-w-[1400px] mx-auto">
        {/* Back Button & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="p-3 bg-white border border-teal-light rounded-2xl text-brand-teal hover:shadow-md transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-heading text-3xl text-brand-dark italic mb-1">Order Details #{order.orderNumber}</h1>
              <div className="flex items-center gap-3">
                 <span className="text-[10px] text-brand-rose-gold font-bold tracking-widest uppercase">Placed on {formatDate(new Date(order.createdAt))} · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                 <span className="h-4 w-[1px] bg-teal-light" />
                 <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                   {order.paymentStatus}
                 </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={() => handlePrint('label')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-teal-light rounded-xl text-sm font-bold text-brand-teal hover:shadow-md transition-all"
             >
                <Printer size={18} />
                Print Label
             </button>
             <button 
                onClick={() => handlePrint('invoice')}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-bold hover:bg-brand-teal/90 shadow-lg shadow-brand-teal/20 transition-all"
             >
                <Printer size={18} />
                Print Invoice
             </button>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="bg-white border border-teal-light rounded-[32px] p-10 shadow-luxury mb-8">
           <h3 className="font-heading text-2xl mb-8 italic">Order Progression</h3>
           <div className="relative flex justify-between items-start w-full max-w-5xl mx-auto px-4">
              <div className="absolute top-5 left-0 w-full h-[2px] bg-teal-light/30 -z-0" />
              <div 
                className="absolute top-5 left-0 h-[2px] bg-brand-teal transition-all duration-500 -z-0" 
                style={{ width: `${(currentStatusIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
              />
              
              {STATUS_STEPS.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;

                return (
                  <div key={step.id} className="relative z-10 flex flex-col items-center group">
                    <button 
                      disabled={updating || index > currentStatusIndex + 1}
                      onClick={() => handleStatusUpdate(step.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isCompleted 
                          ? 'bg-brand-teal border-brand-teal text-white shadow-lg shadow-brand-teal/20' 
                          : 'bg-white border-teal-light text-teal-light hover:border-brand-teal/40'
                      } ${isCurrent ? 'ring-4 ring-brand-teal/10 scale-110' : ''}`}
                    >
                      {isCompleted ? <CheckCircle size={18} /> : <Icon size={18} />}
                    </button>
                    <p className={`mt-4 text-[10px] font-bold uppercase tracking-widest text-center max-w-[80px] ${
                      isCompleted ? 'text-brand-dark' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                       <span className="mt-1 text-[8px] font-bold text-brand-rose-gold uppercase animate-pulse">Current</span>
                    )}
                  </div>
                );
              })}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
           {/* Items Section */}
           <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="bg-white border border-teal-light rounded-[32px] p-8 shadow-luxury">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="font-heading text-2xl italic flex items-center gap-3">
                       <ShoppingBag size={24} className="text-brand-teal" />
                       Order Items
                    </h3>
                    <span className="text-sm font-bold text-brand-rose-gold">{order.items.length} Product(s)</span>
                 </div>
                 <div className="space-y-6">
                    {order.items.map((item, idx) => (
                       <div key={idx} className="flex gap-6 py-4 border-b border-teal-light/30 last:border-0 hover:bg-teal-light/5 transition-all p-4 rounded-2xl">
                          <div className="w-24 h-24 bg-teal-light/10 rounded-2xl overflow-hidden flex-shrink-0">
                             {item.productImage ? (
                                <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-brand-teal/40">
                                   <Package size={32} />
                                </div>
                             )}
                          </div>
                          <div className="flex-1 flex flex-col justify-center">
                             <div className="flex justify-between items-start mb-2">
                                <div>
                                   <h4 className="text-lg font-bold text-gray-800 leading-tight mb-1">{item.productName}</h4>
                                   <p className="text-xs font-bold text-brand-rose-gold uppercase tracking-wider">{item.variantId || 'Standard variant'}</p>
                                </div>
                                <div className="text-right">
                                   <p className="text-base font-bold text-brand-dark">{formatPrice(item.totalPrice)}</p>
                                   <p className="text-xs text-gray-400 font-medium tracking-tight">{formatPrice(item.unitPrice)} x {item.quantity}</p>
                                </div>
                             </div>
                             {(item.size || item.color) && (
                                <div className="flex gap-4 mt-2">
                                   {item.size && (
                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">
                                         Size: {item.size}
                                      </div>
                                   )}
                                   {item.color && (
                                      <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded text-[10px] font-bold text-gray-500 uppercase">
                                         Color: {item.color}
                                      </div>
                                   )}
                                </div>
                             )}
                          </div>
                       </div>
                    ))}
                 </div>

                 <div className="mt-10 pt-8 border-t border-teal-light space-y-4">
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500 font-medium">Subtotal Amount</span>
                       <span className="font-bold text-gray-800">{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500 font-medium">Shipping & Delivery</span>
                       <span className="font-bold text-gray-800 text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                       <span className="text-gray-500 font-medium">Tax & GST</span>
                       <span className="font-bold text-gray-800">{formatPrice(order.tax)}</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between items-center text-sm text-brand-rose-gold">
                        <span className="font-medium">Applied Discount</span>
                        <span className="font-bold">-{formatPrice(order.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-4 border-t border-teal-light text-2xl">
                       <span className="font-heading italic text-brand-dark">Grand Total</span>
                       <span className="font-heading font-bold text-brand-teal">{formatPrice(order.total)}</span>
                    </div>
                 </div>
              </div>

              <div className="bg-white border border-teal-light rounded-[32px] p-8 shadow-luxury">
                 <h3 className="font-heading text-2xl italic mb-6 flex items-center gap-3">
                    <Clock size={24} className="text-brand-teal" />
                    Order History
                 </h3>
                 <div className="space-y-6 relative ml-4 before:absolute before:left-[-17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-teal-light/50">
                    {order.history?.map((h, i) => {
                       const StageIcon = STATUS_COLORS[h.status]?.icon || AlertCircle;
                       return (
                          <div key={i} className="relative">
                             <div className="absolute left-[-22px] top-1 w-3 h-3 rounded-full bg-brand-teal ring-4 ring-white" />
                             <div>
                                <div className="flex items-center gap-2 mb-1">
                                   <span className="text-xs font-bold uppercase tracking-widest text-brand-dark">{h.status.replace(/_/g, ' ')}</span>
                                   <span className="text-[10px] text-gray-400">{formatDate(new Date(h.timestamp))} · {new Date(h.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-sm text-gray-500">{h.message}</p>
                                {i === 0 && <span className="text-[9px] font-bold text-brand-rose-gold uppercase tracking-tighter mt-1 block">Updated by {h.updatedBy || 'Admin'}</span>}
                             </div>
                          </div>
                       );
                    })}
                 </div>
              </div>
           </div>

           {/* Customer & Sidebar Section */}
           <div className="flex flex-col gap-8">
              <div className="bg-white border border-teal-light rounded-[32px] p-8 shadow-luxury relative overflow-hidden group">
                 <h3 className="font-heading text-2xl italic mb-6 relative z-10">Customer Info</h3>
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-brand-rose-gold/10 flex items-center justify-center text-brand-rose-gold">
                       <UserIcon size={24} />
                    </div>
                    <div>
                       <p className="text-lg font-bold text-brand-dark tracking-tight">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                       <p className="text-sm text-gray-500 font-medium">Customer ID: {order.userId.slice(-6).toUpperCase()}</p>
                    </div>
                 </div>
                 <div className="space-y-4 relative z-10">
                    <a href={`mailto:${order.shippingAddress.email}`} className="flex items-center gap-3 p-3 bg-teal-light/5 rounded-xl hover:bg-teal-light/10 transition-all text-sm group-hover:translate-x-1">
                       <AlertCircle size={16} className="text-brand-teal" />
                       <span className="font-medium text-gray-700">{order.shippingAddress.email}</span>
                       <ExternalLink size={12} className="ml-auto opacity-30" />
                    </a>
                    <a href={`tel:${order.shippingAddress.phone}`} className="flex items-center gap-3 p-3 bg-teal-light/5 rounded-xl hover:bg-teal-light/10 transition-all text-sm group-hover:translate-x-1">
                       <Clock size={16} className="text-brand-teal" />
                       <span className="font-medium text-gray-700">{order.shippingAddress.phone}</span>
                       <ExternalLink size={12} className="ml-auto opacity-30" />
                    </a>
                 </div>
              </div>

              <div className="bg-white border border-teal-light rounded-[32px] p-8 shadow-luxury">
                 <h3 className="font-heading text-2xl italic mb-6">Delivery Address</h3>
                 <div className="flex gap-4">
                    <div className="mt-1 p-2 bg-teal-light/10 rounded-lg text-brand-teal">
                       <MapPin size={20} />
                    </div>
                    <div className="text-sm text-gray-700 space-y-1.5 leading-relaxed">
                       <p className="font-bold text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                       <p>{order.shippingAddress.street}</p>
                       <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                       <p className="font-bold tracking-widest">{order.shippingAddress.pincode}</p>
                       <button className="text-brand-teal font-bold text-xs uppercase tracking-widest flex items-center gap-1 mt-2 hover:translate-x-1 transition-transform">
                          View on Map <ChevronRight size={14} />
                       </button>
                    </div>
                 </div>
              </div>

              <div className="bg-brand-teal text-white border border-teal-light rounded-[32px] p-8 shadow-luxury relative overflow-hidden">
                 <div className="relative z-10">
                    <h3 className="font-heading text-2xl italic mb-6">Payment Method</h3>
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                          <CreditCard size={24} />
                       </div>
                       <div>
                          <p className="text-lg font-bold tracking-tight uppercase">{order.paymentMethod}</p>
                          <p className="text-xs text-white/70 font-medium uppercase tracking-[0.2em]">{order.paymentStatus}</p>
                       </div>
                    </div>
                    {order.paymentStatus !== 'paid' && (
                       <button 
                         onClick={handleVerifyPayment}
                         disabled={verifying}
                         className="w-full py-3 bg-brand-rose-gold text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-brand-rose-gold/90 transition-all shadow-lg shadow-brand-rose-gold/20"
                       >
                         {verifying ? 'Verifying...' : 'Verify Payment Manually'}
                       </button>
                    )}
                    {order.paymentStatus === 'paid' && (
                       <div className="p-3 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                          <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest mb-1">Transaction ID</p>
                          <p className="text-sm font-bold truncate">TXN-09823487123984</p>
                       </div>
                    )}
                 </div>
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
              </div>
           </div>
        </div>

        {/* Hidden Printable components for ref rendering */}
        <div className="hidden">
           <div id="printable-invoice">
              <OrderInvoice order={order} />
           </div>
           <div id="printable-label">
              <OrderLabel order={order} />
           </div>
        </div>
      </div>
    </AdminWrapper>
  );
}

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: any }> = {
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
  confirmed: { bg: 'bg-blue-50', text: 'text-blue-700', icon: CheckCircle },
  processing: { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: Package },
  packed: { bg: 'bg-purple-50', text: 'text-purple-700', icon: Package },
  shipped: { bg: 'bg-blue-50', text: 'text-blue-700', icon: Truck },
  out_for_delivery: { bg: 'bg-cyan-50', text: 'text-cyan-700', icon: Truck },
  delivered: { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', icon: XCircle },
};
