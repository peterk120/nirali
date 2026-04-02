'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, ShoppingBag, Star, Share2, 
  ChevronRight, MapPin, ShieldCheck, 
  RotateCcw, Truck, Info
} from 'lucide-react';
import { useWishlistStore } from '@/lib/stores/wishlistStore';
import { useCartStore } from '@/lib/stores/cartStore';
import ProductCard from '@/components/ProductCard';
import { getProductBySlug } from '@/lib/api';
import { toast } from 'react-hot-toast';

const crossSellProducts = [
  { id: 'cs1', name: 'Matching Kundan Earrings', price: 499, rating: 4.8, reviews: 24, material: 'Kundan', style: 'Traditional' },
  { id: 'cs2', name: 'Pearl Drop Maang Tikka', price: 299, rating: 4.9, reviews: 12, material: 'Pearl', style: 'Bridal' },
];

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<string | null>(null);

  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductBySlug(params.slug);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch product', error);
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-heading text-2xl italic text-brand-teal animate-pulse">Loading Product Details...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center font-heading text-2xl italic text-brand-rose-gold">Product not found</div>;

  const id = product.id || product._id;
  const name = product.name;
  const price = product.price;
  const originalPrice = product.originalPrice || price * 2;
  const isWishlisted = wishlistItems.some(item => item.productId === id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isWishlisted) {
      removeFromWishlist(id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist({ 
        id: `wish-${id}`, 
        productId: id, 
        name, 
        price, 
        image: product.image || '', 
        category: product.category || 'Jewellery' 
      });
      toast.success('Added to wishlist');
    }
  };

  const handleAddToCart = () => {
    addToCart({
      productId: id,
      name,
      price,
      quantity: 1,
      image: product.image || '',
      rentalDays: 1
    });
    toast.success('Added to bag');
  };

  const checkPincode = () => {
    if (pincode.length === 6) setPincodeStatus('Estimated delivery: 2-4 business days');
    else setPincodeStatus('Please enter a valid 6-digit pincode');
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 py-6 text-[11px] font-body text-gray-500 tracking-widest uppercase flex gap-2">
        <span>Home</span> <ChevronRight size={10} className="mt-0.5" /> 
        <span>Jewellery</span> <ChevronRight size={10} className="mt-0.5" /> 
        <span>Necklaces</span> <ChevronRight size={10} className="mt-0.5" /> 
        <span className="text-brand-teal font-bold">{name}</span>
      </div>

      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Left: Image Gallery (60%) */}
          <div className="w-full lg:w-[60%] flex flex-col md:flex-row gap-4">
            <div className="hidden md:flex flex-col gap-4 w-20">
               {(product.images || [product.image]).map((img: string, i: number) => (
                 <div key={i} className="aspect-square bg-teal-light rounded-lg border border-teal-light flex items-center justify-center cursor-pointer hover:border-brand-teal transition-all overflow-hidden">
                    <img src={img} alt={`${name} ${i}`} className="w-full h-full object-cover" />
                 </div>
               ))}
            </div>
            <div className="flex-grow aspect-square bg-rose-light rounded-2xl flex items-center justify-center relative overflow-hidden group">
               <img src={product.image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
               <button className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-luxury flex items-center justify-center text-gray-400 hover:text-brand-rose-gold transition-colors z-20">
                  <Share2 size={20} />
               </button>
            </div>
          </div>

          {/* Right: Product Details (40%) */}
          <div className="w-full lg:w-[40%] flex flex-col gap-8">
            <div>
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-teal-medium text-brand-teal text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm">
                  {product.material || 'Premium'}
                </span>
                <span className="px-3 py-1 bg-rose-medium text-brand-rose-gold text-[10px] font-bold tracking-[0.2em] uppercase rounded-sm">
                  {product.style || 'New Arrival'}
                </span>
              </div>
              <h1 className="font-heading text-4xl text-brand-dark mb-4 leading-tight">{name}</h1>
              <div className="flex items-center gap-2 mb-6">
                 <div className="flex text-brand-rose-gold">
                   {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < Math.floor(product.rating || 4.5) ? "fill-brand-rose-gold" : ""} />)}
                 </div>
                 <span className="text-xs text-gray-400 font-body">({product.reviewCount || 100}+ verified reviews)</span>
              </div>
              
              <div className="flex items-baseline gap-4 mb-8">
                 <span className="text-4xl font-bold text-brand-teal italic">₹{price.toLocaleString()}</span>
                 <span className="text-xl text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                 <span className="text-brand-rose-gold font-bold text-sm">({Math.round((originalPrice - price) / originalPrice * 100)}% OFF)</span>
              </div>
              <p className="text-[10px] text-gray-400 mb-8 tracking-widest uppercase">Price inclusive of all taxes & delivery across India</p>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="flex-grow bg-brand-teal text-white py-5 rounded-xl font-body text-[12px] tracking-[0.2em] uppercase font-bold hover:bg-brand-dark hover:shadow-luxury transition-all flex items-center justify-center gap-3"
              >
                <ShoppingBag size={18} /> Add to Bag
              </button>
              <button 
                onClick={handleWishlist}
                className={`w-16 h-16 border rounded-xl flex items-center justify-center transition-all ${isWishlisted ? 'bg-brand-rose-gold border-brand-rose-gold text-white shadow-md' : 'border-teal-light text-gray-400 hover:text-brand-rose-gold hover:border-brand-rose-gold'}`}
              >
                <Heart size={22} className={isWishlisted ? "fill-white" : ""} />
              </button>
            </div>

            {/* Service & Pincode */}
            <div className="bg-teal-light/30 rounded-2xl p-6 border border-teal-light">
               <div className="flex items-center gap-3 mb-6">
                  <MapPin size={18} className="text-brand-teal" />
                  <div className="flex-grow flex items-center border-b border-teal-light pb-2">
                    <input 
                      type="text" 
                      placeholder="Check delivery at your pincode"
                      className="bg-transparent border-none focus:ring-0 text-sm font-body w-full placeholder:text-gray-400"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                    <button onClick={checkPincode} className="text-[11px] font-bold text-brand-rose-gold uppercase tracking-widest px-4 py-1 hover:text-brand-teal transition-colors">Check</button>
                  </div>
               </div>
               {pincodeStatus && <p className="text-[11px] text-brand-teal font-body mb-4 pl-8">{pincodeStatus}</p>}

               <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2 text-center">
                     <Truck size={18} className="text-brand-rose-gold" />
                     <span className="text-[9px] text-gray-500 uppercase font-medium">Free Shipping</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                     <RotateCcw size={18} className="text-brand-rose-gold" />
                     <span className="text-[9px] text-gray-500 uppercase font-medium">7-Day Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 text-center">
                     <ShieldCheck size={18} className="text-brand-rose-gold" />
                     <span className="text-[9px] text-gray-500 uppercase font-medium">Quality Gurantee</span>
                  </div>
               </div>
            </div>

            {/* Accordions */}
            <div className="flex flex-col border-t border-teal-light pt-4">
              {[
                { id: 'details', title: 'Product Details', content: product.description || 'Premium jewellery crafted with excellence.' },
                { id: 'care', title: 'Care Instructions', content: product.careInstructions || 'Keep in airtight box. Avoid contact with perfume and water.' },
                { id: 'shipping', title: 'Shipping & Returns', content: 'Ships within 24 hours. Delivered in 3-5 business days across India. Hassle-free 7-day return policy.' },
              ].map((item) => (
                <div key={item.id} className="border-b border-teal-light">
                   <button 
                    onClick={() => setActiveTab(activeTab === item.id ? '' : item.id)}
                    className="w-full py-5 flex justify-between items-center text-left"
                   >
                     <span className="font-heading text-lg text-brand-dark tracking-wide">{item.title}</span>
                     <ChevronRight size={18} className={`text-brand-rose-gold transition-transform ${activeTab === item.id ? 'rotate-90' : ''}`} />
                   </button>
                   {activeTab === item.id && (
                     <div className="pb-6 text-sm text-gray-500 font-body leading-relaxed animate-fade-in whitespace-pre-wrap">
                        {item.content}
                     </div>
                   )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete the Look Cross-sell */}
        <section className="mt-24">
           <div className="flex items-center gap-4 mb-12">
              <h2 className="font-heading text-3xl md:text-5xl text-brand-dark italic shrink-0">Complete the Look</h2>
              <div className="h-px bg-teal-light flex-grow" />
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {crossSellProducts.map((p) => <ProductCard key={p.id} {...p as any} />)}
              <div className="lg:col-span-2 bg-teal-light/20 rounded-2xl p-10 flex flex-col justify-center items-start gap-4 border border-dashed border-brand-teal/20">
                 <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
                    <Info size={24} />
                 </div>
                 <h3 className="font-heading text-2xl text-brand-dark italic">Need styling advice?</h3>
                 <p className="text-sm text-gray-500 font-body max-w-xs">Our bridal consultants are available on WhatsApp to help you coordinate your jewellery for your special day.</p>
                 <a href="#" className="font-body text-[11px] font-bold text-brand-rose-gold uppercase tracking-widest border-b border-brand-rose-gold pb-1 mt-2">Chat with an Expert</a>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}
