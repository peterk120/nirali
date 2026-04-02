'use client';

import { useState, useEffect } from 'react';
import { verifyToken, UserJwtPayload } from '@/lib/auth';
import AdminWrapper from '../AdminWrapper';
import { Package, TrendingUp, Users, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const [user, setUser] = useState<UserJwtPayload | null>(null);
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, subscribers: 0 });
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token).then(setUser).catch(() => {});
      
      // Fetch dynamic stats
      fetch(`${baseUrl}/admin/dashboard-stats?brand=sashti`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(result => {
        if (result.success) {
          setStats(result.data.stats);
          setRecentProducts(result.data.recentProducts || []);
          setRecentOrders(result.data.recentOrders || []);
        }
      })
      .catch(err => console.error('Failed to fetch dashboard stats:', err))
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
     return (
       <AdminWrapper>
         <div className="p-8 flex justify-center items-center min-h-[400px]">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A7A7A]"></div>
         </div>
       </AdminWrapper>
     );
  }

  return (
    <AdminWrapper>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="font-heading text-4xl md:text-5xl text-brand-dark italic mb-2">Sashti Overview</h1>
          <p className="text-sm text-brand-rose-gold font-bold tracking-wider uppercase">Real-time stats for your jewellery brand</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            icon={<Package className="text-brand-teal" />} 
            label="Total Products" 
            value={stats.products.toString()} 
            sub="Items in catalogue" 
          />
          <StatCard 
            icon={<ShoppingBag className="text-brand-rose-gold" />} 
            label="Total Orders" 
            value={stats.orders.toString()} 
            sub="All time transactions" 
          />
          {user?.role === 'admin' && (
            <>
              <StatCard 
                icon={<Users className="text-brand-teal" />} 
                label="Subscribers" 
                value={stats.subscribers.toString()} 
                sub="Active newsletter audience" 
              />
              <StatCard 
                icon={<TrendingUp className="text-brand-rose-gold" />} 
                label="Revenue" 
                value={`₹${stats.revenue.toLocaleString()}`} 
                sub="Total collection earnings" 
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
           <div className="bg-white border border-teal-light rounded-[32px] p-8 shadow-luxury">
              <h3 className="font-heading text-2xl mb-6 italic">Recent Updates</h3>
              <div className="space-y-4">
                 {recentProducts.length > 0 ? recentProducts.map((p, i) => (
                    <div key={p._id || i} className="flex items-center gap-4 py-3 border-b border-teal-light/50 last:border-0">
                       <div className="w-10 h-10 bg-teal-light/20 rounded-full flex-shrink-0 flex items-center justify-center text-brand-teal text-xl">✨</div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{p.name || 'New Design Added'}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">₹{p.price?.toLocaleString()} · Stock: {p.stock || 0}</p>
                       </div>
                       <div className="text-[10px] text-brand-rose-gold font-bold uppercase tracking-widest bg-brand-rose-gold/5 px-2 py-1 rounded-md">
                          {p.status}
                       </div>
                    </div>
                 )) : (
                    <p className="text-sm text-gray-500 italic py-4">No recent product updates found</p>
                 )}
              </div>
           </div>
           
           <div className="bg-brand-teal text-white border border-teal-light rounded-[32px] p-8 shadow-luxury relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                 <h3 className="font-heading text-2xl mb-4 italic">Recent Orders</h3>
                 <div className="space-y-4 mb-6">
                    {recentOrders.length > 0 ? recentOrders.map((o, i) => (
                       <div key={o._id || i} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                          <div>
                             <p className="text-xs font-bold uppercase tracking-wider">{o.orderNumber || `#${o._id?.toString().slice(-6).toUpperCase()}`}</p>
                             <p className="text-[10px] text-white/60">{new Date(o.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                             <p className="text-sm font-bold">₹{o.total?.toLocaleString()}</p>
                             <p className="text-[10px] text-white/60 uppercase">{o.status}</p>
                          </div>
                       </div>
                    )) : (
                       <p className="text-sm text-white/60 italic">No recent orders yet</p>
                    )}
                 </div>
              </div>
              <div className="relative z-10">
                 <button className="bg-brand-rose-gold text-white px-6 py-2.5 rounded-xl text-sm font-bold tracking-wide uppercase hover:bg-[#a65d68] transition-colors shadow-lg">View All Orders</button>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24" />
           </div>
        </div>

        {user?.role === 'admin' && (
          <div className="bg-white border border-teal-light rounded-[32px] p-8 shadow-luxury mt-8">
            <h3 className="font-heading text-2xl mb-6 italic">Staff Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-teal-light/30">
                    <th className="pb-4">Staff Member</th>
                    <th className="pb-4">Products Added</th>
                    <th className="pb-4">Orders Handled</th>
                    <th className="pb-4 text-right">Last Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-light/20">
                  <PerformanceList baseUrl={baseUrl} token={localStorage.getItem('token')} />
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminWrapper>
  );
}

function PerformanceList({ baseUrl, token }: { baseUrl: string, token: string | null }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${baseUrl}/admin/staff-performance`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) setData(result.data);
    })
    .finally(() => setLoading(false));
  }, [baseUrl, token]);

  if (loading) return <tr><td colSpan={4} className="py-4 text-center text-xs animate-pulse">Loading performance data...</td></tr>;
  if (data.length === 0) return <tr><td colSpan={4} className="py-4 text-center text-xs text-gray-400 italic">No staff data available</td></tr>;

  return (
    <>
      {data.map(staff => (
        <tr key={staff._id} className="group hover:bg-teal-light/5 transition-colors">
          <td className="py-4">
            <p className="text-sm font-bold text-brand-dark">{staff.name}</p>
            <p className="text-[10px] text-gray-500 font-medium">{staff.email}</p>
          </td>
          <td className="py-4">
             <span className="bg-brand-teal/10 text-brand-teal px-2.5 py-1 rounded-lg text-xs font-bold">{staff.productsCount}</span>
          </td>
          <td className="py-4">
             <span className="bg-brand-rose-gold/10 text-brand-rose-gold px-2.5 py-1 rounded-lg text-xs font-bold">{staff.ordersCount}</span>
          </td>
          <td className="py-4 text-right">
             <p className="text-xs font-medium text-gray-600">
               {staff.lastActiveAt ? new Date(staff.lastActiveAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
             </p>
             <p className="text-[10px] text-gray-400 font-bold uppercase">
               {staff.lastActiveAt ? new Date(staff.lastActiveAt).toLocaleDateString() : 'N/A'}
             </p>
          </td>
        </tr>
      ))}
    </>
  );
}

function StatCard({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) {
  return (
    <div className="bg-white border border-teal-light rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-teal-light/10 rounded-xl flex items-center justify-center">{icon}</div>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</div>
      </div>
      <div className="font-heading text-3xl font-bold mb-1">{value}</div>
      <div className="text-xs text-brand-rose-gold uppercase tracking-wide font-bold">{sub}</div>
    </div>
  );
}

