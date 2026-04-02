'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlus, Shield, Mail, CheckCircle, XCircle, Search, UserCog } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminWrapper from '../AdminWrapper';

interface Staff {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'sales' | 'admin';
  status: 'active' | 'disabled';
  lastLoginAt?: string;
  lastActiveAt?: string;
}

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  
  // Staff form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'sales' as 'sales' | 'admin',
    status: 'active' as 'active' | 'disabled'
  });
  const [submitting, setSubmitting] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/admin/staff`, {
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
      const response = await fetch(`${baseUrl}/admin/staff`, {
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
        setFormData({ name: '', email: '', password: '', phone: '', role: 'sales', status: 'active' });
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

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStaff) return;
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/admin/staff/${editingStaff._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Staff account updated successfully');
        setIsEditModalOpen(false);
        setEditingStaff(null);
        setFormData({ name: '', email: '', password: '', phone: '', role: 'sales', status: 'active' });
        fetchStaff();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update staff account');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff account permanently? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/admin/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Staff deleted successfully');
        setStaffList(staffList.filter(s => s._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete staff');
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/admin/staff/${id}/status`, {
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

  const openEditModal = (staff: Staff) => {
    setEditingStaff(staff);
    setFormData({
      name: staff.name,
      email: staff.email,
      password: '', // Don't show password
      phone: staff.phone || '',
      role: staff.role,
      status: staff.status
    });
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (staff: Staff) => {
    if (staff.status === 'disabled') return { label: 'Disabled', color: 'bg-[#B76E79]/10 text-[#B76E79]' };
    
    // Check if lastActiveAt is within 5 minutes
    if (staff.lastActiveAt) {
      const lastActive = new Date(staff.lastActiveAt).getTime();
      const now = new Date().getTime();
      if (now - lastActive < 5 * 60 * 1000) {
        return { label: 'Active now', color: 'bg-green-100 text-green-700 border-green-200' };
      }
      
      // Return last seen
      const diffHrs = Math.floor((now - lastActive) / (1000 * 60 * 60));
      if (diffHrs < 24) {
        return { label: `Last seen ${diffHrs}h ago`, color: 'bg-blue-100 text-blue-700 border-blue-200' };
      }
    }
    
    return { label: 'Active', color: 'bg-[#1A7A7A]/10 text-[#1A7A7A]' };
  };

  const filteredStaff = staffList.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="p-8 bg-[#f5f4f1] min-h-screen font-body">
        <div className="max-w-6xl mx-auto">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-heading italic text-[#111110] mb-2">Staff Management</h1>
              <p className="text-sm text-[#7a7673] font-medium tracking-wide uppercase">Manage your premium sales team and access</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1A7A7A] rounded-xl text-sm font-bold text-white hover:bg-[#146363] transition-all shadow-md uppercase tracking-wider"
            >
              <UserPlus size={16} /> Add Staff Account
            </button>
          </header>

          <div className="bg-white rounded-[32px] shadow-luxury border border-[#e0dbd4] overflow-hidden">
            <div className="p-6 border-b border-[#f5f4f1] bg-[#f5f4f1]/30 flex flex-col md:flex-row gap-4 items-center justify-between">
               <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7673]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search staff by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                  />
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#1A7A7A]"></div>
                     <span className="text-[10px] font-bold text-[#3d3b39] uppercase tracking-widest">{staffList.filter(s => s.status === 'active').length} Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#B76E79]"></div>
                     <span className="text-[10px] font-bold text-[#3d3b39] uppercase tracking-widest">{staffList.filter(s => s.status === 'disabled').length} Disabled</span>
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f5f4f1]/20">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Staff Member</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Role</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f4f1]">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((staff) => (
                      <tr key={staff._id} className="hover:bg-[#f5f4f1]/30 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#1A7A7A]/10 flex items-center justify-center text-[#1A7A7A]">
                              <Shield size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#111110]">{staff.name}</p>
                              <p className="text-[10px] text-[#7a7673] font-bold uppercase tracking-wider">{staff.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-2.5 py-1 rounded-lg bg-[#b0ADAa]/10 text-[#3d3b39] text-[10px] font-bold uppercase tracking-widest border border-[#e0dbd4]">
                            {staff.role}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                             {(() => {
                               const badge = getStatusBadge(staff);
                               return (
                                 <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${badge.color}`}>
                                   {badge.label}
                                 </span>
                               );
                             })()}
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-4">
                              <button 
                                onClick={() => openEditModal(staff)}
                                className="text-[11px] font-bold text-[#1A7A7A] hover:text-[#146363] uppercase tracking-widest transition-colors"
                              >
                                 Edit
                              </button>
                              <button 
                                onClick={() => deleteStaff(staff._id)}
                                className="text-[11px] font-bold text-[#B76E79] hover:text-[#a65d68] uppercase tracking-widest transition-colors"
                              >
                                 Delete
                              </button>
                              <Link 
                                href={`/admin/activity?staffId=${staff._id}`}
                                className="text-[11px] font-bold text-[#7a7673] hover:text-[#111110] uppercase tracking-widest transition-colors"
                              >
                                 Activity
                              </Link>
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-[#7a7673]">
                         <UserCog size={40} className="mx-auto mb-4 opacity-20" />
                         <p className="text-xl font-heading italic">No management found</p>
                         <p className="text-sm font-body mt-1">Your premium team list is currently empty.</p>
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
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-[#e0dbd4]">
              <div className="p-6 border-b border-[#f5f4f1] flex items-center justify-between bg-[#f5f4f1]/30">
                <h2 className="text-2xl font-heading italic text-[#111110]">Onboard Staff</h2>
                <button 
                   onClick={() => {
                     setIsModalOpen(false);
                     setFormData({ name: '', email: '', password: '', phone: '', role: 'sales', status: 'active' });
                   }}
                   className="text-[#7a7673] hover:text-[#111110] transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    placeholder="staff@jewels.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Access Password</label>
                  <input 
                    type="password" 
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    placeholder="+91..."
                  />
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#1A7A7A] rounded-xl text-xs font-bold text-white hover:bg-[#146363] disabled:bg-[#1A7A7A]/30 transition-all shadow-lg uppercase tracking-widest"
                  >
                    {submitting ? 'Onboarding...' : 'Create Sales Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Staff Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 border border-[#e0dbd4]">
              <div className="p-6 border-b border-[#f5f4f1] flex items-center justify-between bg-[#f5f4f1]/30">
                <h2 className="text-2xl font-heading italic text-[#111110]">Edit Staff Profle</h2>
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-[#7a7673] hover:text-[#111110] transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <form onSubmit={handleUpdateStaff} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    placeholder="staff@jewels.com"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Role</label>
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    >
                      <option value="sales">Sales</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-1.5 ml-1">Status</label>
                    <select 
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    >
                      <option value="active">Active</option>
                      <option value="disabled">Disabled</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-[#1A7A7A] rounded-xl text-xs font-bold text-white hover:bg-[#146363] disabled:bg-[#1A7A7A]/30 transition-all shadow-lg uppercase tracking-widest"
                  >
                    {submitting ? 'Updating...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminWrapper>
  );
}
