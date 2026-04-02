'use client';

import { useState, useEffect } from 'react';
import { UserPlus, Shield, Mail, Phone, CheckCircle, XCircle, Search, Trash2, UserCog } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'sales';
  status: 'active' | 'disabled';
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New staff form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/staff`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setStaffList(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch staff');
      }
    } catch (error) {
      toast.error('An error occurred while fetching staff');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/staff`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Staff account created successfully');
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', phone: '' });
        fetchStaff();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to create staff account');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/admin/staff/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Status updated');
        setStaffList(staffList.map(s => s._id === id ? data.data : s));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#faf9f7] min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Staff Management</h1>
            <p className="text-sm text-gray-500 font-body">Manage your sales team and their access permissions.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 rounded-xl text-sm font-semibold text-white hover:bg-rose-700 transition-all shadow-md"
          >
            <UserPlus size={16} /> Add Staff Member
          </button>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search staff by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                />
             </div>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{staffList.filter(s => s.status === 'active').length} Active</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{staffList.filter(s => s.status === 'disabled').length} Disabled</span>
                </div>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Staff Member</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Role</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((staff) => (
                    <tr key={staff._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                            <Shield size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                            <p className="text-[11px] text-gray-400 font-medium">{staff.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                          {staff.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                         <button 
                           onClick={() => toggleStatus(staff._id)}
                           className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                             staff.status === 'active' 
                             ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' 
                             : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
                           }`}
                         >
                           {staff.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                           {staff.status}
                         </button>
                      </td>
                      <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                            <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors cursor-not-allowed">
                               Edit
                            </button>
                            <button className="text-[11px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest transition-colors cursor-not-allowed">
                               Activity
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                       <UserCog size={40} className="mx-auto mb-4 opacity-20" />
                       <p className="text-lg font-heading italic">No staff members found</p>
                       <p className="text-sm font-body mt-1">Start building your team by adding a new staff account!</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-gray-900">Add New Staff</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Full Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Email Address</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Password</label>
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-1.5 ml-1">Phone Number (Optional)</label>
                <input 
                  type="text" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-rose-600 rounded-xl text-sm font-bold text-white hover:bg-rose-700 disabled:bg-rose-300 transition-all shadow-lg shadow-rose-200 font-heading"
                >
                  {submitting ? 'Creating account...' : 'Create Sales Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
