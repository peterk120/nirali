'use client';

import AdminWrapper from '../AdminWrapper';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <AdminWrapper>
      <div className="p-8 md:p-12 max-w-7xl mx-auto">
        <div className="text-center py-20 bg-white rounded-[32px] border border-[#e0dbd4] shadow-luxury">
          <div className="w-20 h-20 bg-[#B76E79]/10 rounded-full flex items-center justify-center mx-auto mb-6 text-[#B76E79]">
            <BarChart3 size={40} />
          </div>
          <h1 className="text-4xl font-heading italic text-[#111110] mb-4">Analytics & Insights</h1>
          <p className="text-[#7a7673] max-w-md mx-auto mb-10 font-medium">
            We are fine-tuning the data engine. This section will soon provide premium insights into your collection's performance and admirer engagement.
          </p>
          <button className="px-8 py-3 bg-[#B76E79] text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center gap-2 mx-auto disabled:opacity-50" disabled>
            <TrendingUp size={16} /> Advanced Analytics Coming Soon
          </button>
        </div>
      </div>
    </AdminWrapper>
  );
}
