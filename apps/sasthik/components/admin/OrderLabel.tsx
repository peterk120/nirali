import React from 'react';
import { Order } from '@nirali-sai/types';

interface OrderLabelProps {
  order: Order;
}

export const OrderLabel: React.FC<OrderLabelProps> = ({ order }) => {
  return (
    <div className="bg-white p-6 w-[400px] border-2 border-dashed border-gray-300 rounded-lg selection:bg-none print:border-solid print:border-black print:rounded-none" id="printable-label">
      {/* Branding & Logo */}
      <div className="flex items-center justify-between border-b pb-4 mb-4 border-gray-100">
        <div>
          <h1 className="text-xl font-bold text-gray-800 italic">Sashti Sparkle</h1>
          <p className="text-[9px] font-bold text-brand-rose-gold tracking-widest uppercase">Premium Jewellery</p>
        </div>
        <div className="text-right">
           <div className="bg-brand-dark text-white text-[10px] font-bold px-2 py-1 rounded">
             {order.paymentMethod.toUpperCase()}
           </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="mb-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Ship To:</p>
        <div className="text-base font-bold text-gray-900 leading-tight">
          <p>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
          <p className="font-medium text-sm mt-1">{order.shippingAddress.street}</p>
          <p className="font-medium text-sm">{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p className="text-lg mt-1">{order.shippingAddress.pincode}</p>
          <p className="text-sm mt-1 font-bold">Ph: {order.shippingAddress.phone}</p>
        </div>
      </div>

      {/* Order Info & Barcode Placeholder */}
      <div className="flex justify-between items-end border-t pt-4 border-gray-100">
        <div>
          <p className="text-[9px] text-gray-400 font-bold uppercase mb-1">Order #</p>
          <p className="text-sm font-bold text-gray-800">{order.orderNumber}</p>
          <p className="text-[9px] text-gray-400 font-bold uppercase mt-2">Weight</p>
          <p className="text-sm font-bold text-gray-800">0.25 kg</p>
        </div>
        <div className="text-right">
           {/* Mock Barcode */}
           <div className="flex flex-col items-center">
             <div className="flex gap-[1px] h-10 items-center">
                {[2, 1, 3, 1, 2, 4, 1, 2, 3, 1, 2, 1, 3].map((w, i) => (
                  <div key={i} className="bg-black h-full" style={{ width: `${w}px` }} />
                ))}
             </div>
             <p className="text-[8px] font-mono mt-1 tracking-widest">{order.orderNumber}</p>
           </div>
        </div>
      </div>

      {/* Return Address */}
      <div className="mt-6 pt-4 border-t border-gray-800 border-dashed text-[9px] text-gray-500">
        <p className="font-bold text-gray-700 uppercase mb-1 underline">Return if Undelivered:</p>
        <p>Sashti Sparkle, 123 Luxury Lane, Jewellery Hub, Chennai, 600001</p>
      </div>
    </div>
  );
};
