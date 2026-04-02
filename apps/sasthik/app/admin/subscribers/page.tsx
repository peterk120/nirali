'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, CheckCircle, XCircle, Search, Download, Users } from 'lucide-react';
import { toast } from 'react-hot-toast';
import AdminWrapper from '../AdminWrapper';

interface Subscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/subscribers`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setSubscribers(data.data);
      } else {
        toast.error(data.message || 'Failed to fetch subscribers');
      }
    } catch (error) {
      toast.error('An error occurred while fetching subscribers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/subscribers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Subscriber deleted');
        setSubscribers(subscribers.filter(s => s._id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete subscriber');
    }
  };

  const toggleStatus = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/subscribers/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Status updated');
        setSubscribers(subscribers.map(s => s._id === id ? data.data : s));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSubject || !emailMessage) {
      toast.error('Please fill in both subject and message');
      return;
    }

    setSendingEmail(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${baseUrl}/subscribers/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: emailSubject,
          message: emailMessage,
          subscriberIds: selectedSubscribers.length > 0 ? selectedSubscribers : null
        })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setIsEmailModalOpen(false);
        setEmailSubject('');
        setEmailMessage('');
        setSelectedSubscribers([]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setSendingEmail(false);
    }
  };

  const toggleSelectSubscriber = (id: string) => {
    setSelectedSubscribers(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = () => {
    const headers = ['Email', 'Status', 'Date Subscribed'];
    const rows = subscribers.map(s => [
      s.email,
      s.status,
      new Date(s.subscribedAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sashti_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <h1 className="text-4xl font-heading italic text-[#111110] mb-2">Jewels Subscribers</h1>
              <p className="text-sm text-[#7a7673] font-medium tracking-wide uppercase">Manage your premium newsletter audience</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setIsEmailModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#1A7A7A] rounded-xl text-sm font-bold text-white hover:bg-[#146363] transition-all shadow-md uppercase tracking-wider"
              >
                <Mail size={16} /> Send Email
              </button>
              <button 
                onClick={exportToCSV}
                className="flex items-center gap-2 px-6 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm font-bold text-[#3d3b39] hover:bg-gray-50 transition-all shadow-sm uppercase tracking-wider"
              >
                <Download size={16} /> Export CSV
              </button>
            </div>
          </header>

          <div className="bg-white rounded-[32px] shadow-luxury border border-[#e0dbd4] overflow-hidden">
            <div className="p-6 border-b border-[#f5f4f1] bg-[#f5f4f1]/30 flex flex-col md:flex-row gap-4 items-center justify-between">
               <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7a7673]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                  />
               </div>
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#1A7A7A]"></div>
                     <span className="text-[10px] font-bold text-[#3d3b39] uppercase tracking-widest">{subscribers.filter(s => s.status === 'active').length} Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2.5 h-2.5 rounded-full bg-[#B76E79]"></div>
                     <span className="text-[10px] font-bold text-[#3d3b39] uppercase tracking-widest">{subscribers.filter(s => s.status !== 'active').length} Inactive</span>
                  </div>
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#f5f4f1]/20">
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox" 
                          onChange={(e) => {
                            if (e.target.checked) setSelectedSubscribers(filteredSubscribers.map(s => s._id));
                            else setSelectedSubscribers([]);
                          }}
                          checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                          className="rounded border-[#e0dbd4] text-[#1A7A7A] focus:ring-[#1A7A7A]"
                        />
                        Subscriber
                      </div>
                    </th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Joined Date</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold text-[#7a7673] uppercase tracking-[0.2em]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f4f1]">
                  {filteredSubscribers.length > 0 ? (
                    filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber._id} className="hover:bg-[#f5f4f1]/30 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              checked={selectedSubscribers.includes(subscriber._id)}
                              onChange={() => toggleSelectSubscriber(subscriber._id)}
                              className="rounded border-[#e0dbd4] text-[#1A7A7A] focus:ring-[#1A7A7A]"
                            />
                            <div className="w-10 h-10 rounded-full bg-[#1A7A7A]/10 flex items-center justify-center text-[#1A7A7A]">
                              <Mail size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#111110]">{subscriber.email}</p>
                              <p className="text-[10px] text-[#7a7673] font-bold uppercase tracking-wider">Premium Member</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-[#3d3b39]">
                            <Calendar size={14} className="text-[#7a7673]" />
                            <span className="text-sm font-medium">
                              {new Date(subscriber.subscribedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <button 
                            onClick={() => toggleStatus(subscriber._id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current cursor-pointer transition-all ${
                              subscriber.status === 'active' 
                              ? 'bg-[#1A7A7A]/10 text-[#1A7A7A] hover:bg-[#1A7A7A]/20' 
                              : 'bg-[#7a7673]/10 text-[#7a7673] hover:bg-[#7a7673]/20'
                            }`}
                          >
                            {subscriber.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                            {subscriber.status}
                          </button>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex items-center gap-4">
                              <button 
                                onClick={() => {
                                  setIsEmailModalOpen(true);
                                  setSelectedSubscribers([subscriber._id]);
                                }}
                                className="text-[11px] font-bold text-[#1A7A7A] hover:text-[#146363] uppercase tracking-widest transition-colors"
                              >
                                 Email
                              </button>
                              <button 
                                onClick={() => handleDelete(subscriber._id)}
                                className="text-[11px] font-bold text-[#B76E79] hover:text-[#9f5d66] uppercase tracking-widest transition-colors"
                              >
                                 Delete
                              </button>
                           </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-20 text-center text-[#7a7673]">
                         <Users size={40} className="mx-auto mb-4 opacity-20" />
                         <p className="text-xl font-heading italic">No jewels found</p>
                         <p className="text-sm font-body mt-1">Your marketing collection is currently empty.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Send Email Modal */}
        {isEmailModalOpen && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-[#e0dbd4]">
              <div className="p-6 border-b border-[#f5f4f1] flex items-center justify-between bg-[#f5f4f1]/30">
                <h2 className="text-2xl font-heading italic text-[#111110]">Send Collection News</h2>
                <button 
                  onClick={() => setIsEmailModalOpen(false)}
                  className="text-[#7a7673] hover:text-[#111110] transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSendEmail} className="p-6 space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-2">Recipient(s)</label>
                  <div className="p-3 bg-[#f5f4f1]/50 border border-[#e0dbd4] rounded-xl text-sm text-[#3d3b39] font-medium">
                    {selectedSubscribers.length > 0 
                      ? `Sending to ${selectedSubscribers.length} selected piece(s)` 
                      : `Sending to all ${subscribers.filter(s => s.status === 'active').length} active admirers`}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-2">Collection Subject</label>
                  <input 
                    type="text" 
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all"
                    placeholder="E.g. New Antique Collection Launch..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#7a7673] uppercase tracking-widest mb-2">Message (HTML Supported)</label>
                  <textarea 
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 bg-white border border-[#e0dbd4] rounded-xl text-sm focus:ring-2 focus:ring-[#1A7A7A]/20 focus:border-[#1A7A7A] outline-none transition-all resize-none"
                    placeholder="Craft your premium message here..."
                    required
                  />
                  <p className="mt-2 text-[10px] text-[#b09898] italic font-medium tracking-wide">Design tip: Use HTML tags for elevated formatting.</p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsEmailModalOpen(false)}
                    className="flex-1 px-6 py-3 border border-[#e0dbd4] rounded-xl text-xs font-bold text-[#7a7673] hover:bg-gray-50 transition-all uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={sendingEmail}
                    className="flex-1 px-6 py-3 bg-[#1A7A7A] rounded-xl text-xs font-bold text-white hover:bg-[#146363] disabled:bg-[#1A7A7A]/30 transition-all shadow-lg uppercase tracking-widest"
                  >
                    {sendingEmail ? 'Sending...' : 'Send Collection'}
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
