'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { MapPin, Plus, Trash2, Edit2, Home, Briefcase, Map, ArrowLeft, CheckCircle2, Loader2, X, Save } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AddressesPage() {
  const { user, token } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [fetching, setFetching] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    street: '',
    area: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    type: 'Home',
    isDefault: false
  });

  const fetchAddresses = async () => {
    if (!token) return;
    setFetching(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/addresses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAddresses(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Address added successfully');
        setShowAddModal(false);
        setAddresses(data.data);
        setFormData({
          firstName: '', lastName: '', street: '', area: '', city: '', state: '', zip: '', phone: '', type: 'Home', isDefault: false
        });
      } else {
        toast.error(data.message || 'Failed to add address');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this address?')) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/auth/addresses/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        toast.success('Address deleted');
        setAddresses(data.data);
      }
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-brand-teal animate-spin mb-4" />
        <p className="text-gray-500 font-body">Locating your saved destinations...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-light/20 pb-20 font-body">
      <div className="max-w-5xl mx-auto px-4 pt-12">
        <Link href="/" className="inline-flex items-center gap-2 text-brand-teal hover:gap-3 transition-all mb-8 text-sm font-medium">
          <ArrowLeft size={16} /> Back to Shopping
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="font-heading text-4xl md:text-5xl mb-3 text-brand-dark leading-tight">My Addresses</h1>
            <p className="text-brand-rose-gold uppercase tracking-[0.3em] text-[10px] font-bold">Manage Your Delivery Destinations</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-brand-teal text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-dark transition-all shadow-lg flex items-center gap-3"
          >
            <Plus size={18} /> Add New Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-[40px] p-16 text-center shadow-luxury border border-teal-light max-w-2xl mx-auto">
            <div className="w-24 h-24 bg-teal-light rounded-full flex items-center justify-center mx-auto mb-8">
              <Map size={40} className="text-brand-teal opacity-30" />
            </div>
            <h3 className="font-heading text-3xl text-brand-dark mb-4">No Saved Addresses</h3>
            <p className="text-gray-500 font-body mb-10 leading-relaxed">Save your shipping details for a faster, one-click checkout experience on all your future treasures.</p>
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-brand-teal text-white px-12 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] hover:bg-brand-dark transition-all"
            >
              Add First Address
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {addresses.map((addr) => (
              <div 
                key={addr._id}
                className={`bg-white rounded-3xl p-8 border hover:border-brand-teal/30 transition-all duration-500 group relative ${
                  addr.isDefault ? 'border-brand-teal/50 shadow-luxury' : 'border-teal-light shadow-sm'
                }`}
              >
                {addr.isDefault && (
                  <div className="absolute top-6 right-8 flex items-center gap-1.5 text-brand-teal text-[10px] font-bold uppercase tracking-widest">
                    <CheckCircle2 size={12} /> Default
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-teal-light/40 w-12 h-12 rounded-2xl flex items-center justify-center text-brand-teal">
                    {addr.type === 'Home' ? <Home size={22} /> : addr.type === 'Work' ? <Briefcase size={22} /> : <MapPin size={22} />}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-brand-dark">{addr.type}</h3>
                    <p className="text-[10px] uppercase tracking-widest text-brand-rose-gold font-bold">{addr.zip}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-8">
                  <p className="text-sm font-bold text-brand-dark">{addr.firstName} {addr.lastName}</p>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
                    {addr.street}{addr.area ? `, ${addr.area}` : ''}, {addr.city}, {addr.state}
                  </p>
                  <p className="text-[13px] text-brand-teal font-medium">{addr.phone}</p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-teal-light/50">
                  <button className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-brand-teal transition-colors">
                    <Edit2 size={14} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(addr._id)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden border border-teal-light">
              <div className="p-8 border-b border-teal-light flex justify-between items-center bg-teal-light/10">
                <h2 className="font-heading text-2xl text-brand-dark">Add New Address</h2>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-brand-dark transition-colors">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddAddress} className="p-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="First Name" required
                    value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                  />
                  <input 
                    type="text" placeholder="Last Name" required
                    value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                  />
                </div>
                <input 
                  type="text" placeholder="Flat No. / Building Name" required
                  value={formData.street} onChange={(e) => setFormData({...formData, street: e.target.value})}
                  className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                />
                <input 
                  type="text" placeholder="Area / Street"
                  value={formData.area} onChange={(e) => setFormData({...formData, area: e.target.value})}
                  className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="City" required
                    value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                  />
                  <input 
                    type="text" placeholder="State" required
                    value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})}
                    className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" placeholder="Pincode" required
                    value={formData.zip} onChange={(e) => setFormData({...formData, zip: e.target.value})}
                    className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                  />
                  <input 
                    type="tel" placeholder="Phone Number" required
                    value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-teal-light/20 border border-teal-light rounded-2xl text-sm"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" onClick={() => setFormData({...formData, type: 'Home'})}
                    className={`flex-grow py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.type === 'Home' ? 'bg-brand-teal text-white border-brand-teal' : 'border-teal-light text-gray-400'}`}
                  >Home</button>
                  <button 
                    type="button" onClick={() => setFormData({...formData, type: 'Work'})}
                    className={`flex-grow py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${formData.type === 'Work' ? 'bg-brand-teal text-white border-brand-teal' : 'border-teal-light text-gray-400'}`}
                  >Work</button>
                </div>
                <button 
                  type="submit"
                  className="w-full pt-8 pb-4 text-brand-teal font-bold tracking-[0.2em] uppercase text-xs hover:text-brand-dark transition-all flex items-center justify-center gap-2"
                >
                  <Save size={18} /> Confirm & Save Address
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
