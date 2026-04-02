'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOrderByIdAdmin } from '@/lib/api';
import { Order } from '@nirali-sai/types';
import { OrderLabel } from '@/components/admin/OrderLabel';
import toast from 'react-hot-toast';

export default function OrderPrintPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idsString = searchParams.get('ids');
    if (!idsString) {
      setLoading(false);
      return;
    }

    const ids = idsString.split(',');
    const fetchOrders = async () => {
      try {
        const orderPromises = ids.map(id => getOrderByIdAdmin(id));
        const results = await Promise.all(orderPromises);
        
        const successfulOrders = results
          .filter(res => res.success && res.data)
          .map(res => res.data as Order);
        
        setOrders(successfulOrders);
        
        if (successfulOrders.length > 0) {
          // Wait for images to potentially load
          setTimeout(() => {
            window.print();
          }, 1000);
        }
      } catch (error) {
        console.error('Print fetch error:', error);
        toast.error('Failed to load orders for printing');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [searchParams]);

  if (loading) return <div className="p-10 text-center">Loading labels...</div>;
  if (orders.length === 0) return <div className="p-10 text-center text-red-500 font-bold">No valid order IDs provided for printing.</div>;

  return (
    <div className="bg-white min-h-screen p-8 print:p-0">
      <div className="flex flex-wrap gap-10 justify-center print:block print:gap-0">
        {orders.map((order, index) => (
          <div key={order.id} className="print:break-after-page print:mb-0 mb-10">
            <OrderLabel order={order} />
          </div>
        ))}
      </div>
      
      <div className="fixed bottom-10 right-10 print:hidden">
        <button 
          onClick={() => window.print()}
          className="bg-brand-teal text-white px-8 py-3 rounded-xl font-bold shadow-2xl hover:bg-brand-teal/90 transition-all uppercase tracking-widest"
        >
          Print Now
        </button>
      </div>
    </div>
  );
}
