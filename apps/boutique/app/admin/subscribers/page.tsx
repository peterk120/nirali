'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, CheckCircle, XCircle, Search, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

  const fetchSubscribers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/subscribers`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/subscribers/${id}`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/subscribers/${id}/status`, {
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/subscribers/send-email`, {
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
    link.setAttribute("download", `subscribers_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#faf9f7] min-h-screen font-body">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Email Subscribers</h1>
            <p className="text-sm text-gray-500 font-body">Manage your newsletter audience and marketing outreach.</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => setIsEmailModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-rose-600 rounded-xl text-sm font-semibold text-white hover:bg-rose-700 transition-all shadow-md"
            >
              <Mail size={16} /> Send Email
            </button>
            <button 
              onClick={exportToCSV}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            >
              <Download size={16} /> Export CSV
            </button>
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                />
             </div>
             <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{subscribers.filter(s => s.status === 'active').length} Active</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                   <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">{subscribers.filter(s => s.status !== 'active').length} Unsubscribed</span>
                </div>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">
                    <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        onChange={(e) => {
                          if (e.target.checked) setSelectedSubscribers(filteredSubscribers.map(s => s._id));
                          else setSelectedSubscribers([]);
                        }}
                        checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                      Subscriber
                    </div>
                  </th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Subscription Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSubscribers.length > 0 ? (
                  filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox"
                            checked={selectedSubscribers.includes(subscriber._id)}
                            onChange={() => toggleSelectSubscriber(subscriber._id)}
                            className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                          />
                          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                            <Mail size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{subscriber.email}</p>
                            <p className="text-[10px] text-gray-400 font-medium">Newsletter Member</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
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
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border cursor-pointer transition-all ${
                            subscriber.status === 'active' 
                            ? 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100' 
                            : 'bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100'
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
                              className="text-[11px] font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest transition-colors"
                            >
                               Email
                            </button>
                            <button 
                              onClick={() => handleDelete(subscriber._id)}
                              className="text-[11px] font-bold text-rose-600 hover:text-rose-800 uppercase tracking-widest transition-colors"
                            >
                               Delete
                            </button>
                         </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-gray-400">
                       <Mail size={40} className="mx-auto mb-4 opacity-20" />
                       <p className="text-lg font-heading italic">No subscribers found</p>
                       <p className="text-sm font-body mt-1">Start your marketing journey by encouraging signups!</p>
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-heading font-bold text-gray-900">Send Newsletter</h2>
              <button 
                onClick={() => setIsEmailModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSendEmail} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Recipient(s)</label>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">
                  {selectedSubscribers.length > 0 
                    ? `Sending to ${selectedSubscribers.length} selected subscriber(s)` 
                    : `Sending to all ${subscribers.filter(s => s.status === 'active').length} active subscribers`}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Subject</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                  placeholder="Newsletter Subject..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">Message (HTML Supported)</label>
                <textarea 
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={8}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all resize-none"
                  placeholder="Write your newsletter content here..."
                  required
                />
                <p className="mt-2 text-[10px] text-gray-400 italic">Tip: You can use HTML tags for rich formatting.</p>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all font-heading"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={sendingEmail}
                  className="flex-1 px-6 py-3 bg-rose-600 rounded-xl text-sm font-bold text-white hover:bg-rose-700 disabled:bg-rose-300 transition-all shadow-lg font-heading"
                >
                  {sendingEmail ? 'Sending...' : 'Send Newsletter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
