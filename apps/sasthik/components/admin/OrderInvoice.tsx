import { Order } from '@nirali-sai/types';
import { formatDate, formatPrice } from '@nirali-sai/utils';

interface OrderInvoiceProps {
  order: Order;
}

export const OrderInvoice: React.FC<OrderInvoiceProps> = ({ order }) => {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto border border-gray-200 shadow-sm print:shadow-none print:border-none" id="printable-invoice">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-gray-100 pb-8 mb-8">
        <div>
          <h1 className="text-3xl font-serif italic text-brand-dark mb-1">Sashti Sparkle</h1>
          <p className="text-xs text-brand-rose-gold font-bold tracking-widest uppercase mb-4">Premium Imitation Jewellery</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>123 Luxury Lane, Jewellery Hub</p>
            <p>Chennai, Tamil Nadu - 600001</p>
            <p>Phone: +91 98765 43210</p>
            <p>Email: care@sasthisparkle.com</p>
            <p>GSTIN: 33AAAAA0000A1Z5</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-tight mb-2">Invoice</h2>
          <div className="text-sm space-y-1">
            <p><span className="text-gray-400 font-medium">Invoice No:</span> <span className="font-bold">#INV-{order.orderNumber}</span></p>
            <p><span className="text-gray-400 font-medium">Date:</span> <span className="font-bold">{formatDate(new Date(order.createdAt))}</span></p>
            <p><span className="text-gray-400 font-medium">Order ID:</span> <span className="font-bold">#{order.orderNumber}</span></p>
          </div>
        </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-12 mb-10">
        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bill To</h3>
          <div className="text-sm text-gray-800 space-y-1">
            <p className="font-bold text-base">{order.billingAddress.firstName} {order.billingAddress.lastName}</p>
            <p>{order.billingAddress.street}</p>
            <p>{order.billingAddress.city}, {order.billingAddress.state} - {order.billingAddress.pincode}</p>
            <p>Phone: {order.billingAddress.phone}</p>
            <p>Email: {order.billingAddress.email}</p>
          </div>
        </div>
        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Ship To</h3>
          <div className="text-sm text-gray-800 space-y-1">
            <p className="font-bold text-base">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-10">
        <thead>
          <tr className="border-b-2 border-gray-800 text-left">
            <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Item Description</th>
            <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
            <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Price</th>
            <th className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {order.items.map((item, index) => (
            <tr key={index}>
              <td className="py-5">
                <p className="text-sm font-bold text-gray-800">{item.productName}</p>
                {item.variantId && <p className="text-[10px] text-gray-500 font-medium mt-0.5">Variant: {item.variantId}</p>}
                {(item.size || item.color) && (
                  <p className="text-[10px] text-gray-500 font-medium">
                    {item.size && `Size: ${item.size}`} {item.color && `| Color: ${item.color}`}
                  </p>
                )}
              </td>
              <td className="py-5 text-center text-sm font-medium text-gray-700">{item.quantity}</td>
              <td className="py-5 text-right text-sm font-medium text-gray-700">{formatPrice(item.unitPrice)}</td>
              <td className="py-5 text-right text-sm font-bold text-gray-800">{formatPrice(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div className="flex justify-end mb-12">
        <div className="w-full max-w-[240px] space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-semibold text-gray-800">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Shipping</span>
            <span className="font-semibold text-gray-800">{formatPrice(order.shippingCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tax (GST)</span>
            <span className="font-semibold text-gray-800">{formatPrice(order.tax)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount</span>
              <span className="font-semibold">-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border-t border-gray-800 pt-3 mt-3 text-brand-dark">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 pt-8 text-center">
        <p className="text-sm font-bold text-brand-dark italic mb-1">Thank you for choosing Sashti Sparkle!</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em]">Authorized Signature • Online Generated Invoice</p>
        <div className="mt-6 flex justify-center gap-8 opacity-20 filter grayscale">
           {/* Placeholder for small icons/badges */}
           <div className="w-8 h-8 rounded-full border border-current" />
           <div className="w-8 h-8 rounded-full border border-current" />
           <div className="w-8 h-8 rounded-full border border-current" />
        </div>
      </div>
    </div>
  );
};
