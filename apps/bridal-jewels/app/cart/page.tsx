import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, Package, CreditCard, WalletCards } from 'lucide-react';
import { Button } from '@nirali-sai/ui';

export const metadata: Metadata = {
  title: 'Shopping Cart - Bridal Jewels',
  description: 'Manage your bridal jewellery selections and rental periods',
};

const CartPage = () => {
  // Mock cart items
  const cartItems = [
    {
      id: 'j1',
      name: 'Royal Gold Necklace Set',
      type: 'Necklace Set',
      image: '/jewellery/necklace1.jpg',
      price: 15000,
      rentalPeriod: 3,
      quantity: 1,
    },
    {
      id: 'j3',
      name: 'Diamond Maang Tikka',
      type: 'Maang Tikka',
      image: '/jewellery/tikka1.jpg',
      price: 12000,
      rentalPeriod: 3,
      quantity: 1,
    },
    {
      id: 'j4',
      name: 'Polki Bangles Set',
      type: 'Bangles',
      image: '/jewellery/bangles1.jpg',
      price: 18000,
      rentalPeriod: 7,
      quantity: 1,
    },
  ];

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + tax;

  // Update quantity function
  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    console.log(`Update quantity for ${id} to ${newQuantity}`);
  };

  // Update rental period function
  const updateRentalPeriod = (id: string, newPeriod: number) => {
    console.log(`Update rental period for ${id} to ${newPeriod} days`);
  };

  // Remove item function
  const removeItem = (id: string) => {
    console.log(`Remove item ${id} from cart`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-800 mb-4">
            Your Bridal Collection
          </h1>
          <p className="text-xl text-amber-700">
            Review your selected pieces and rental periods
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-amber-800 flex items-center">
                  <Package className="w-6 h-6 mr-2" />
                  Selected Pieces ({cartItems.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    className="p-6 flex flex-col sm:flex-row"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mb-4 sm:mb-0 sm:mr-6">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-jewellery.jpg';
                        }}
                      />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg text-amber-800">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.type}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        {/* Quantity Control */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            className="px-3 py-2 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-800">{item.quantity}</span>
                          <button
                            className="px-3 py-2 text-amber-600 hover:bg-amber-50"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {/* Rental Period Selector */}
                        <div className="flex items-center">
                          <label className="text-sm text-gray-600 mr-2">Rental:</label>
                          <select
                            value={item.rentalPeriod}
                            onChange={(e) => updateRentalPeriod(item.id, parseInt(e.target.value))}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          >
                            <option value={1}>1 day</option>
                            <option value={3}>3 days</option>
                            <option value={7}>7 days</option>
                          </select>
                        </div>
                        
                        {/* Price */}
                        <div className="ml-auto">
                          <p className="font-bold text-amber-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                          <p className="text-xs text-gray-500">₹{item.price.toLocaleString()} × {item.quantity}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      className="mt-4 sm:mt-0 sm:ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-800 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200">
                  <span className="text-lg font-bold text-amber-800">Total</span>
                  <span className="text-lg font-bold text-amber-800">₹{total.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <Button className="w-full bg-amber-600 hover:bg-amber-700 py-3 text-lg">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>
                
                <Button variant="outline" className="w-full border-amber-600 text-amber-600 hover:bg-amber-50 py-3">
                  <WalletCards className="w-5 h-5 mr-2" />
                  Pay Later
                </Button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-amber-800 mb-3">Rental Information</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Rental period starts from delivery date</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Free delivery & pickup in Mumbai region</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Insurance included for all rentals</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    <span>Easy exchange policy within rental period</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;