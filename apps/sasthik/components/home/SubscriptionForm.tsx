'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email) return;
    setIsSubscribing(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/subscribers/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message || 'Successfully subscribed!');
        setEmail('');
      } else {
        toast.error(data.message || 'Failed to subscribe');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="w-full max-w-lg flex flex-col sm:flex-row gap-4">
      <div className="flex-grow flex items-center bg-white/10 backdrop-blur-md rounded-lg px-6 py-4 border border-white/20">
        <Mail size={18} className="text-white/60 mr-3" />
        <input 
          type="email" 
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border-none text-white placeholder:text-white/60 focus:ring-0 w-full text-sm font-body"
        />
      </div>
      <button 
        onClick={handleSubscribe}
        disabled={isSubscribing}
        className="bg-white text-brand-teal px-10 py-4 font-body text-[11px] tracking-widest uppercase font-bold hover:bg-brand-rose-gold hover:text-white transition-all shadow-lg disabled:opacity-50"
      >
        {isSubscribing ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
}
