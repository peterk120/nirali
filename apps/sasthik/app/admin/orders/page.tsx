'use client';

import { useState, useEffect } from 'react';
import AdminWrapper from '../AdminWrapper';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  MoreHorizontal, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle,
  Download,
  Printer,
  Calendar,
  CreditCard,
  User as UserIcon,
  Package,
  ShoppingBag
} from 'lucide-react';
import { Order, OrderStatus } from '@nirali-sai/types';
import { getAllOrders, bulkUpdateOrderStatus } from '@/lib/api';
import { formatDate, formatPrice } from '@nirali-sai/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    search: '',
    page: 1,
    limit: 10
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getAllOrders(filters);
      if (response.success && response.data) {
        setOrders(response.data.data);
      } else {
        toast.error(response.error?.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('An error occurred while fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) return;
    
    const ordersToExport = selectedOrders.length > 0 
      ? orders.filter(o => selectedOrders.includes(o.id))
      : orders;

    const headers = ['Order Number', 'Date', 'Customer', 'Phone', 'Items', 'Total', 'Payment Status', 'Status'];
    const csvContent = [
      headers.join(','),
      ...ordersToExport.map(o => [
        `#${o.orderNumber}`,
        formatDate(new Date(o.createdAt)),
        `"${o.shippingAddress.firstName} ${o.shippingAddress.lastName}"`,
        o.shippingAddress.phone,
        o.items.length,
        o.total,
        o.paymentStatus,
        o.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sashti_orders_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Orders exported successfully');
  };

  const handleBulkPrint = () => {
    if (selectedOrders.length === 0) {
      toast.error('Please select orders to print');
      return;
    }
    const ids = selectedOrders.join(',');
    window.open(`/admin/orders/print?ids=${ids}`, '_blank');
  };

  useEffect(() => {
    fetchOrders();
  }, [filters.status, filters.paymentStatus, filters.page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrders(orders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (id: string) => {
    setSelectedOrders(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedOrders.length === 0) return;
    
    const promise = bulkUpdateOrderStatus({
      orderIds: selectedOrders,
      status,
      message: `Bulk status update to ${status}`
    });

    toast.promise(promise, {
      loading: 'Updating orders...',
      success: 'Orders updated successfully',
      error: 'Failed to update orders'
    });

    const response = await promise;
    if (response.success) {
      fetchOrders();
      setSelectedOrders([]);
    }
  };

  return (
    <AdminWrapper>
      <div className="p-8 md:p-12 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl text-brand-dark italic mb-2">Order Management</h1>
            <p className="text-sm text-brand-rose-gold font-bold tracking-wider uppercase">Efficiently track and process customer orders</p>
          </div>
          <div className="flex gap-3">
             <button 
               onClick={handleExportCSV}
               className="flex items-center gap-2 px-5 py-2.5 bg-white border border-teal-light rounded-xl text-sm font-bold text-brand-teal hover:shadow-md transition-all"
             >
                <Download size={18} />
                Export CSV
             </button>
             <button 
               onClick={handleBulkPrint}
               className="flex items-center gap-2 px-5 py-2.5 bg-brand-teal text-white rounded-xl text-sm font-bold hover:bg-brand-teal/90 shadow-lg shadow-brand-teal/20 transition-all"
             >
                <Printer size={18} />
                Bulk Print Labels
             </button>
          </div>
        </div>

        {/* Filters & Actions */}
        <div className="bg-white border border-teal-light rounded-[32px] p-6 shadow-luxury mb-8">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <form onSubmit={handleSearch} className="relative w-full lg:max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-teal/50" size={20} />
              <input 
                type="text" 
                placeholder="Search by Order ID or Customer..."
                className="w-full pl-12 pr-4 py-3 bg-teal-light/5 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-teal/20 transition-all"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </form>

            <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
              <select 
                className="px-4 py-2.5 bg-teal-light/5 border-none rounded-xl text-sm font-semibold text-gray-700 min-w-[140px]"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select 
                className="px-4 py-2.5 bg-teal-light/5 border-none rounded-xl text-sm font-semibold text-gray-700 min-w-[140px]"
                value={filters.paymentStatus}
                onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
              >
                <option value="">All Payments</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>

              <div className="h-8 w-[1px] bg-teal-light/50 mx-2 hidden md:block" />

              {selectedOrders.length > 0 && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                  <span className="text-xs font-bold text-brand-rose-gold uppercase tracking-wider">{selectedOrders.length} selected</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleBulkStatusUpdate('packed')}
                      className="px-3 py-1.5 bg-brand-teal/10 text-brand-teal text-[11px] font-bold rounded-lg border border-brand-teal/20 hover:bg-brand-teal/20 transition-all uppercase"
                    >
                      Mark Packed
                    </button>
                    <button 
                      onClick={() => handleBulkStatusUpdate('shipped')}
                      className="px-3 py-1.5 bg-brand-teal/10 text-brand-teal text-[11px] font-bold rounded-lg border border-brand-teal/20 hover:bg-brand-teal/20 transition-all uppercase"
                    >
                      Mark Shipped
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-teal-light rounded-[32px] overflow-hidden shadow-luxury">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-light/5 border-b border-teal-light">
                  <th className="px-6 py-5 text-left w-12">
                    <input 
                      type="checkbox" 
                      className="rounded border-teal-light text-brand-teal focus:ring-brand-teal/20"
                      onChange={handleSelectAll}
                      checked={orders.length > 0 && selectedOrders.length === orders.length}
                    />
                  </th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Order Details</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Payment</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-5 text-center text-[11px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-light/50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={8} className="px-6 py-8 h-20 bg-gray-50/50" />
                    </tr>
                  ))
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <div className="max-w-xs mx-auto">
                        <ShoppingBag size={48} className="mx-auto text-teal-light mb-4" />
                        <h3 className="font-heading text-xl mb-1">No orders found</h3>
                        <p className="text-sm text-gray-500">Try adjusting your filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const StatusIcon = STATUS_COLORS[order.status]?.icon || Clock;
                    return (
                      <tr key={order.id} className="hover:bg-teal-light/5 transition-all group">
                        <td className="px-6 py-5">
                          <input 
                            type="checkbox" 
                            className="rounded border-teal-light text-brand-teal focus:ring-brand-teal/20"
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleSelectOrder(order.id)}
                          />
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-light/10 flex items-center justify-center text-brand-teal">
                              <CreditCard size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800 tracking-tight">#{order.orderNumber}</p>
                              <p className="text-[10px] font-bold text-brand-rose-gold uppercase tracking-wider">{order.items.length} items</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full bg-brand-rose-gold/10 flex items-center justify-center text-brand-rose-gold">
                                <UserIcon size={14} />
                             </div>
                             <div>
                                <p className="text-sm font-semibold text-gray-700">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</p>
                                <p className="text-[11px] text-gray-500">{order.shippingAddress.phone}</p>
                             </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-600">{formatDate(new Date(order.createdAt))}</span>
                            <span className="text-[10px] text-gray-400">{new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{order.paymentMethod}</span>
                            <span className={`text-[10px] font-bold uppercase py-0.5 px-2 rounded-full w-fit ${
                              order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {order.paymentStatus}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full w-fit ${STATUS_COLORS[order.status]?.bg} ${STATUS_COLORS[order.status]?.text}`}>
                            <StatusIcon size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-wider">{order.status.replace(/_/g, ' ')}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <p className="text-sm font-bold text-gray-800">{formatPrice(order.total)}</p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center justify-center gap-2">
                             <Link href={`/admin/orders/${order.id}`}>
                                <button className="p-2 text-gray-400 hover:text-brand-teal hover:bg-teal-light/10 rounded-lg transition-all" title="View Details">
                                  <Eye size={18} />
                                </button>
                             </Link>
                             <button className="p-2 text-gray-400 hover:text-brand-teal hover:bg-teal-light/10 rounded-lg transition-all" title="Actions">
                                <MoreHorizontal size={18} />
                             </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!loading && orders.length > 0 && (
            <div className="px-6 py-6 border-top border-teal-light flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500">Showing <span className="font-bold text-gray-800">1 to {orders.length}</span> of <span className="font-bold text-gray-800">24</span> orders</p>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-teal-light rounded-xl text-xs font-bold text-gray-400 hover:bg-teal-light/5 uppercase transition-all disabled:opacity-50" disabled>Previous</button>
                <button className="px-4 py-2 bg-brand-teal text-white rounded-xl text-xs font-bold shadow-lg shadow-brand-teal/20 uppercase transition-all">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
