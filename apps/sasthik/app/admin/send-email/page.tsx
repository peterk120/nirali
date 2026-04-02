'use client';

import AdminWrapper from '../AdminWrapper';
import { Mail, Send } from 'lucide-react';

export default function SendEmailPage() {
  return (
    <AdminWrapper>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <div className="text-center py-20 bg-white rounded-[32px] border border-[#e0dbd4] shadow-luxury">
          <div className="w-20 h-20 bg-[#1A7A7A]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1A7A7A]">
            <Mail size={40} />
          </div>
          <h1 className="text-4xl font-heading italic text-[#111110] mb-4">Newsletter Engine</h1>
          <p className="text-[#7a7673] max-w-md mx-auto mb-10 font-medium">
            This module is being refined. Soon you'll be able to craft and send premium collection updates directly from here.
          </p>
          <button className="px-8 py-3 bg-[#1A7A7A] text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 mx-auto disabled:opacity-50" disabled>
            <Send size={16} /> Integrated Campaign Coming Soon
          </button>
        </div>
      </div>
    </AdminWrapper>
  );
}
