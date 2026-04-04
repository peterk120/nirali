'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, Plus, Minus, 
  ArrowRight, Heart, ShieldCheck, Truck 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/lib/stores/cartStore';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const { items: cartItems, removeItem, updateQuantity, clearCart } = useCartStore();
  const { addItem: addToWishlist } = useWishlistStore();

  const subtotal = cartItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0);
  const discount = subtotal * 0.1; // 10% Member discount
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal - discount + shipping;

  const handleUpdateQuantity = (productId: string, currentQty: number, delta: number) => {
    updateQuantity(productId, currentQty + delta);
  };

  const handleMoveToWishlist = (item: any) => {
    addToWishlist({
      id: `wish-${item.productId}`,
      productId: item.productId,
      name: item.name || '',
      price: item.price || 0,
      image: item.image || '',
      category: 'Jewellery'
    });
    removeItem(item.productId);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-teal-light rounded-full flex items-center justify-center text-brand-teal mb-6">
           <ShoppingBag size={40} />
        </div>
        <h1 className="font-heading text-4xl text-brand-dark mb-4 italic">Your bag is empty!</h1>
        <p className="text-gray-500 font-body mb-8 max-w-sm">Looks like you haven't added anything to your sparkle collection yet. Time to explore!</p>
        <Link href={"/jewellery" as any} className="bg-brand-teal text-white px-12 py-4 rounded-xl font-bold tracking-widest uppercase text-xs hover:bg-brand-rose-gold transition-all">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-teal-light/20 py-12 border-b border-teal-light">
         <div className="container mx-auto px-6">
            <h1 className="font-heading text-5xl text-brand-dark italic mb-2">My Shopping Bag</h1>
            <p className="text-[12px] text-brand-rose-gold font-bold tracking-widest uppercase">You have {cartItems.length} items in your bag</p>
         </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Cart Items (65%) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-6 p-6 border border-teal-light rounded-2xl group hover:border-brand-teal transition-all bg-white"
                >
                  <div className="w-32 h-32 bg-rose-light rounded-xl shrink-0 flex items-center justify-center relative overflow-hidden border border-teal-light/20">
                     {item.image ? (
                       <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                     ) : (
                       <span className="font-heading text-xs text-brand-teal/20 italic text-center px-2">{item.name}</span>
                     )}
                     <div className="absolute inset-0 bg-brand-teal/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between py-1 text-left">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link href={`/product/${item.productId}` as any} className="font-heading text-xl text-brand-dark hover:text-brand-teal transition-colors leading-tight">{item.name}</Link>
                        <button onClick={() => removeItem(item.productId)} className="text-gray-300 hover:text-red-500 transition-colors p-1"><Trash2 size={18} /></button>
                      </div>
                      <p className="text-[11px] text-gray-400 font-body tracking-[0.2em] uppercase mb-4">{item.category || 'Jewellery'}</p>
                    </div>

                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-4 bg-teal-light/50 px-4 py-2 rounded-lg">
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity, -1)} 
                          className="text-brand-teal hover:bg-white rounded p-1 transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-bold min-w-[20px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleUpdateQuantity(item.productId, item.quantity, 1)} 
                          className="text-brand-teal hover:bg-white rounded p-1 transition-colors disabled:opacity-30"
                          disabled={item.quantity >= 10}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-brand-teal italic">₹{((item.price || 0) * item.quantity).toLocaleString()}</div>
                        <button onClick={() => handleMoveToWishlist(item)} className="text-[10px] text-brand-rose-gold font-bold uppercase tracking-widest mt-2 hover:text-brand-teal transition-colors flex items-center gap-1.5"><Heart size={10} /> Move to Wishlist</button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex justify-between items-center mt-6 p-6 bg-rose-light rounded-2xl border border-rose-medium">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-rose-gold/10 rounded-full flex items-center justify-center text-brand-rose-gold">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-[11px] font-bold text-brand-rose-gold uppercase tracking-[0.2em]">100% Quality Assurance & Secure Shopping</span>
               </div>
               <button onClick={clearCart} className="text-[10px] text-gray-400 font-bold uppercase tracking-widest hover:text-red-500 transition-colors">Empty Bag</button>
            </div>
          </div>

          {/* Right: Summary (35%) */}
          <div className="w-full lg:w-[35%]">
            <div className="bg-white border-2 border-brand-teal rounded-3xl p-8 sticky top-24 shadow-luxury">
              <h3 className="font-heading text-2xl text-brand-dark mb-8 border-b border-teal-light pb-4">Order Summary</h3>
              
              <div className="flex flex-col gap-5 mb-8">
                <div className="flex justify-between text-sm font-body text-gray-500">
                  <span>Bag Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-body text-brand-rose-gold font-bold">
                  <span>Sashti Member Discount (10%)</span>
                  <span>- ₹{discount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-body text-gray-500">
                  <span>Shipping & Handling</span>
                  <span className={shipping === 0 ? "text-green-600 font-bold uppercase text-[10px]" : ""}>
                    {shipping === 0 ? "FREE" : `₹${shipping.toLocaleString()}`}
                  </span>
                </div>
              </div>

              <div className="border-t border-teal-light pt-6 mb-10">
                <div className="flex justify-between items-end">
                  <span className="font-heading text-xl text-brand-dark">Grand Total</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-brand-teal italic leading-none">₹{total.toLocaleString()}</div>
                    <p className="text-[9px] text-gray-400 font-body uppercase mt-2 tracking-widest">(Inclusive of all taxes)</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => {
                    if (isLoggedIn) {
                      router.push('/checkout');
                    } else {
                      toast.error('Please login to continue to checkout', {
                        icon: '🛍️',
                        duration: 3000,
                      });
                      router.push('/login?redirectTo=/checkout');
                    }
                  }}
                  className="w-full bg-brand-teal text-white py-5 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs hover:bg-brand-dark shadow-xl flex items-center justify-center gap-3 group transition-all"
                >
                  Proceed to Checkout <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </button>
                
                <div className="bg-teal-light/50 p-4 rounded-xl flex items-center gap-3">
                  <Truck size={18} className="text-brand-teal" />
                  <p className="text-[10px] text-brand-teal font-medium leading-relaxed">Place order now and get it delivered by <span className="font-bold border-b border-brand-teal">Apr 15th, 2026</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
