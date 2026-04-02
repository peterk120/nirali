'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Calendar, Search, Filter, User, Package, ShoppingBag, LogIn, LogOut, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminWrapper from '../AdminWrapper';

interface ActivityLog {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  action: string;
  details: string;
  targetId?: string;
  metadata?: any;
  createdAt: string;
}

function ActivityContent() {
  const searchParams = useSearchParams();
  const initialStaffId = searchParams.get('staffId') || '';
  
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    staffId: initialStaffId,
    action: '',
    startDate: '',
    endDate: ''
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''))
      });

      const response = await fetch(`${baseUrl}/admin/activity-logs?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLogs(data.data);
        setTotal(data.total);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch activity logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, filters]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login': return <LogIn size={16} className="text-green-600" />;
      case 'logout': return <LogOut size={16} className="text-orange-600" />;
      case 'add_product': return <Package size={16} className="text-[#1A7A7A]" />;
      case 'update_order': return <ShoppingBag size={16} className="text-[#B76E79]" />;
      default: return <Clock size={16} className="text-[#7a7673]" />;
    }
  };

  return (
    <div className="p-8 bg-[#f5f4f1] min-h-screen font-body">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-heading italic text-[#111110] mb-2">Staff Activity</h1>
          <p className="text-sm text-[#7a7673] font-medium tracking-wide uppercase">Monitor actions and performance across your team</p>
        </header>

        {/* Filters */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#e0dbd4] mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Action Type</label>
            <select 
              value={filters.action}
              onChange={(e) => setFilters({...filters, action: e.target.value})}
              className="w-full px-4 py-2.5 bg-[#f5f4f1]/50 border border-[#e0dbd4] rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#1A7A7A]/10"
            >
              <option value="">All Actions</option>
              <option value="login">Login</option>
              <option value="logout">Logout</option>
              <option value="add_product">Add Product</option>
              <option value="update_order">Update Order</option>
              <option value="staff_created">Staff Created</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Start Date</label>
            <input 
              type="date" 
              value={filters.startDate}
              onChange={(e) => setFilters({...filters, startDate: e.target.value})}
              className="w-full px-4 py-2.5 bg-[#f5f4f1]/50 border border-[#e0dbd4] rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#1A7A7A]/10"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">End Date</label>
            <input 
              type="date" 
              value={filters.endDate}
              onChange={(e) => setFilters({...filters, endDate: e.target.value})}
              className="w-full px-4 py-2.5 bg-[#f5f4f1]/50 border border-[#e0dbd4] rounded-xl text-sm outline-none transition-all focus:ring-2 focus:ring-[#1A7A7A]/10"
            />
          </div>
          <button 
            onClick={() => {
              setFilters({ staffId: '', action: '', startDate: '', endDate: '' });
              setPage(1);
            }}
            className="w-full py-2.5 bg-white border border-[#1A7A7A] text-[#1A7A7A] rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#1A7A7A]/5 transition-all"
          >
            Clear Filters
          </button>
        </div>

        {/* Timeline Table */}
        <div className="bg-white rounded-[32px] shadow-luxury border border-[#e0dbd4] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5f4f1]/20">
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Staff Member</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Action</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f4f1]">
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-6 h-16 bg-[#f5f4f1]/10"></td>
                    </tr>
                  ))
                ) : logs.length > 0 ? (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#f5f4f1]/30 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#1A7A7A]/10 flex items-center justify-center text-[#1A7A7A]">
                            <User size={14} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#111110]">{log.userId?.name || 'Unknown'}</p>
                            <p className="text-[10px] text-[#7a7673] font-bold uppercase tracking-wider">{log.userId?.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="text-[10px] font-bold text-[#3d3b39] uppercase tracking-widest">
                            {log.action.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-[#3d3b39] max-w-xs">{log.details}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-[#7a7673] font-medium">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-[#7a7673]">
                       <p className="text-xl font-heading italic">No activity logs found</p>
                       <p className="text-sm font-body mt-1">Actions performed by staff will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-[#f5f4f1] flex items-center justify-between">
             <p className="text-xs text-[#7a7673] font-bold uppercase tracking-widest">
               Showing {logs.length} of {total} logs
             </p>
             <div className="flex items-center gap-2">
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-lg border border-[#e0dbd4] disabled:opacity-30 hover:bg-[#f5f4f1] transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold w-12 text-center uppercase tracking-widest">{page}</span>
                <button 
                  disabled={logs.length < 20}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-lg border border-[#e0dbd4] disabled:opacity-30 hover:bg-[#f5f4f1] transition-all"
                >
                  <ChevronRight size={16} />
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StaffActivityPage() {
  return (
    <AdminWrapper>
       <Suspense fallback={
         <div className="p-8 flex justify-center items-center min-h-[400px]">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A7A7A]"></div>
         </div>
       }>
          <ActivityContent />
       </Suspense>
    </AdminWrapper>
  );
}
