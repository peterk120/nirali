'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, CreditCard, Truck, 
  MapPin, ShoppingBag, ChevronRight, 
  ArrowLeft, ShieldCheck, Info
} from 'lucide-react';
import { useCartStore } from '@/lib/stores/cartStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from 'react-hot-toast';
import { createOrder as apiCreateOrder } from '@/lib/api';
import { useRouter } from 'next/navigation';

const steps = ['Details', 'Delivery', 'Payment'];

export default function CheckoutPage() {
  const { items: cartItems, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const subtotal = cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const discount = subtotal * 0.1;
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    area: '',
    pincode: '',
    city: '',
    state: ''
  });

  const nextStep = () => {
    if (step === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.pincode || !formData.state) {
        toast.error('Please fill all required fields');
        return;
      }
    }
    setStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const [saveAddress, setSaveAddress] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const { token } = useAuthStore();

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/addresses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setSavedAddresses(data.data);
          // Auto-select default address if it exists
          const defaultAddr = data.data.find((a: any) => a.isDefault);
          if (defaultAddr) {
             handleSelectAddress(defaultAddr);
          }
        }
      } catch (error) {
        console.error('Failed to fetch saved addresses', error);
      }
    };
    fetchSavedAddresses();
  }, [token]);

  const handleSelectAddress = (addr: any) => {
    setFormData({
      firstName: addr.firstName,
      lastName: addr.lastName || '',
      email: user?.email || '',
      phone: addr.phone,
      address: addr.street,
      area: addr.area || '',
      pincode: addr.zip,
      city: addr.city,
      state: addr.state || ''
    });
    toast.success('Address autofilled!');
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Save address if checked
      if (saveAddress && token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            street: formData.address,
            area: formData.area,
            city: formData.city,
            state: formData.state,
            zip: formData.pincode,
            phone: formData.phone,
            type: 'Home',
            isDefault: false
          })
        });
      }

      const orderData = {
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.name || 'Product',
          productImage: item.image || '',
          quantity: item.quantity,
          unitPrice: item.price || 0,
          totalPrice: (item.price || 0) * item.quantity,
          variantId: null,
          size: item.size || 'Standard',
          color: null
        })),
        subtotal,
        tax: 0, // Simplified
        shippingCost: shipping,
        discount,
        total,
        paymentMethod: 'cod', // Default to COD for now as per UI
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.address + ', ' + formData.area,
          city: formData.city,
          state: formData.state,
          country: 'India',
          pincode: formData.pincode,
          phone: formData.phone,
          email: formData.email
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          street: formData.address + ', ' + formData.area,
          city: formData.city,
          state: formData.state,
          country: 'India',
          pincode: formData.pincode,
          phone: formData.phone,
          email: formData.email
        },
        notes: ''
      };

      const response = await apiCreateOrder(orderData);
      if (response.success && response.data) {
        clearCart();
        toast.success('Order placed successfully!');
        router.push(`/checkout/success?orderId=${response.data.orderNumber}`);
      } else {
        toast.error(response.message || 'Failed to place order');
      }
    } catch (error: any) {
      toast.error('An error occurred while placing your order');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header / Stepper */}
      <div className="bg-white border-b border-teal-light py-8 sticky top-0 z-40">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
           <Link href="/" className="font-heading text-2xl text-brand-teal italic">Sashti Sparkle</Link>
           <div className="flex items-center gap-4 md:gap-12">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${step > i + 1 ? 'bg-brand-teal border-brand-teal text-white' : step === i + 1 ? 'border-brand-teal text-brand-teal' : 'border-gray-200 text-gray-300'}`}>
                    {step > i + 1 ? <CheckCircle2 size={14} /> : i + 1}
                  </div>
                  <span className={`text-[10px] uppercase tracking-widest font-bold hidden sm:block ${step >= i + 1 ? 'text-brand-dark' : 'text-gray-300'}`}>{s}</span>
                  {i < steps.length - 1 && <div className="h-px w-8 md:w-16 bg-gray-100 hidden sm:block" />}
                </div>
              ))}
           </div>
           <div className="hidden md:flex items-center gap-2 text-brand-rose-gold text-[10px] font-bold tracking-widest uppercase">
              <ShieldCheck size={14} /> 100% Secure Checkout
           </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Form Content (65%) */}
          <div className="w-full lg:w-[65%]">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-10">
                  <section>
                    <div className="flex justify-between items-center mb-8">
                       <h2 className="font-heading text-3xl italic">Contact Details</h2>
                       {savedAddresses.length > 0 && (
                         <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            Scroll to select saved 
                            <ChevronRight size={12} className="text-brand-teal" />
                         </div>
                       )}
                    </div>

                    {/* Saved Addresses Selector */}
                    {savedAddresses.length > 0 && (
                      <div className="flex gap-4 overflow-x-auto pb-6 mb-10 no-scrollbar">
                        {savedAddresses.map((addr) => (
                          <div 
                            key={addr._id}
                            onClick={() => handleSelectAddress(addr)}
                            className="min-w-[240px] p-5 border border-teal-light rounded-2xl bg-teal-light/10 hover:border-brand-teal/50 hover:bg-white transition-all cursor-pointer group shadow-sm active:scale-95"
                          >
                             <div className="flex justify-between items-start mb-3">
                               <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand-rose-gold">{addr.type}</span>
                               {addr.isDefault && <CheckCircle2 size={12} className="text-brand-teal" />}
                             </div>
                             <p className="text-xs font-bold text-brand-dark mb-1">{addr.firstName} {addr.lastName}</p>
                             <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">{addr.street}</p>
                             <p className="text-[9px] font-bold text-brand-teal uppercase tracking-widest">Select</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="text" 
                        placeholder="First Name" 
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                      <input 
                        type="text" 
                        placeholder="Last Name" 
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="md:col-span-2 p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                      <input 
                        type="tel" 
                        placeholder="Mobile Number" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="md:col-span-2 p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                    </div>
                  </section>
                  <section>
                    <h2 className="font-heading text-3xl mb-8 italic">Shipping Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input 
                        type="text" 
                        placeholder="Flat No. / Building Name" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="md:col-span-2 p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                      <input 
                        type="text" 
                        placeholder="Area / Street" 
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        className="md:col-span-2 p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                      <input 
                        type="text" 
                        placeholder="Pincode" 
                        value={formData.pincode}
                        onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                        className="p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                      <input 
                        type="text" 
                        placeholder="City" 
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        className="p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                      <input 
                        type="text" 
                        placeholder="State" 
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        className="p-4 bg-teal-light/30 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all" 
                      />
                    </div>
                    
                    {/* Save Address Checkbox */}
                    {token && (
                      <div className="mt-8 flex items-center gap-3 cursor-pointer group" onClick={() => setSaveAddress(!saveAddress)}>
                         <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${saveAddress ? 'bg-brand-teal border-brand-teal text-white' : 'border-teal-light bg-teal-light/30'}`}>
                            {saveAddress && <CheckCircle2 size={12} />}
                         </div>
                         <span className="text-[11px] font-bold text-gray-500 uppercase tracking-widest group-hover:text-brand-dark transition-colors">Save this address for future orders</span>
                      </div>
                    )}
                  </section>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <h2 className="font-heading text-3xl mb-8 italic text-left">Choose Delivery Method</h2>
                   <div className="flex flex-col gap-6">
                      <div className="p-6 border-2 border-brand-teal rounded-2xl bg-teal-light/10 flex justify-between items-center cursor-pointer">
                         <div className="flex items-center gap-4">
                            <Truck size={24} className="text-brand-teal" />
                            <div className="text-left">
                               <p className="text-sm font-bold text-brand-dark">Standard Delivery (FREE)</p>
                               <p className="text-xs text-gray-500">Delivered within 5-7 business days</p>
                            </div>
                         </div>
                         <CheckCircle2 size={24} className="text-brand-teal" />
                      </div>
                      <div className="p-6 border border-teal-light rounded-2xl flex justify-between items-center cursor-pointer opacity-50">
                         <div className="flex items-center gap-4">
                            <Truck size={24} className="text-gray-400" />
                            <div className="text-left">
                               <p className="text-sm font-bold text-gray-400">Express Delivery (+₹149)</p>
                               <p className="text-xs text-gray-400">Delivered within 24-48 hours (Currently unavailable)</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                   <h2 className="font-heading text-3xl mb-8 italic text-left">Select Payment Method</h2>
                   <div className="flex flex-col gap-6">
                      {[
                        { id: 'upi', name: 'UPI / PhonePe / Google Pay', icon: CreditCard },
                        { id: 'card', name: 'Credit / Debit Card', icon: CreditCard },
                        { id: 'cod', name: 'Cash on Delivery', icon: Truck },
                      ].map((p, i) => (
                        <div key={p.id} className={`p-6 border rounded-2xl flex justify-between items-center cursor-pointer ${i === 0 ? 'border-brand-teal bg-teal-light/10' : 'border-teal-light'}`}>
                           <div className="flex items-center gap-4 text-left">
                              <p.icon size={20} className={i === 0 ? 'text-brand-teal' : 'text-gray-400'} />
                              <p className="text-sm font-bold text-brand-dark">{p.name}</p>
                           </div>
                           <div className={`w-5 h-5 rounded-full border-2 ${i === 0 ? 'border-brand-teal border-[6px]' : 'border-teal-light'}`} />
                        </div>
                      ))}
                      
                      <div className="mt-6 bg-rose-light p-6 rounded-2xl border border-rose-medium flex items-start gap-4">
                         <Info size={18} className="text-brand-rose-gold mt-1 shrink-0" />
                         <div className="text-left">
                            <p className="text-xs font-bold text-brand-rose-gold tracking-widest uppercase mb-2">Member Special</p>
                            <p className="text-sm text-gray-600 font-body leading-relaxed">By paying online, you save an additional <span className="font-bold">₹50</span> on this order!</p>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-12 flex gap-4">
               {step > 1 && (
                 <button onClick={prevStep} className="px-8 py-5 border border-teal-light rounded-xl font-bold tracking-widest uppercase text-[10px] text-gray-400 hover:text-brand-teal transition-all flex items-center gap-2">
                    <ArrowLeft size={16} /> Back
                 </button>
               )}
               <button 
                onClick={() => step === 3 ? handlePlaceOrder() : nextStep()}
                disabled={loading}
                className={`flex-grow bg-brand-teal text-white py-5 rounded-xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-brand-dark transition-all shadow-xl ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
               >
                 {loading ? 'Processing...' : step === 3 ? 'Place Order & Pay' : 'Continue to ' + steps[step]}
               </button>
            </div>
          </div>

          {/* Cart Summary (35%) */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-teal-light/20 border border-teal-light rounded-3xl p-8 sticky top-36">
               <div className="flex justify-between items-end mb-8 border-b border-teal-light pb-4 text-left">
                  <h3 className="font-heading text-2xl text-brand-dark">Order Summary</h3>
                  <Link href="/cart" className="text-[10px] text-brand-rose-gold font-bold uppercase tracking-widest hover:text-brand-teal transition-colors">Edit Bag</Link>
               </div>
               
               <div className="flex flex-col gap-4 mb-8">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex gap-4 items-center text-left">
                       <div className="w-12 h-12 bg-white rounded border border-teal-light shrink-0 overflow-hidden">
                          {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                       </div>
                       <div className="flex-grow">
                          <p className="text-xs font-bold font-body text-brand-dark line-clamp-1">{item.name}</p>
                          <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                       </div>
                       <span className="text-xs font-bold text-brand-teal italic">₹{((item.price || 0) * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
               </div>

               <div className="flex flex-col gap-4 text-xs font-body text-gray-500 border-t border-teal-light pt-6">
                  <div className="flex justify-between font-body">
                     <span>Bag Total</span>
                     <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-brand-rose-gold font-bold font-body">
                     <span>Discount</span>
                     <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-body">
                     <span>Shipping</span>
                     <span className={shipping === 0 ? "text-green-600 font-bold uppercase text-[9px]" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString()}`}
                     </span>
                  </div>
                  <div className="flex justify-between border-t border-teal-light pt-4 mt-2">
                     <span className="text-base font-heading text-brand-dark italic">Total to Pay</span>
                     <span className="text-xl font-bold text-brand-teal italic">₹{total.toLocaleString()}</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
