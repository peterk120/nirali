import { useState } from 'react';
import { Button } from '../../components/ui/button';

interface CustomFittingProps {
  isEnabled: boolean;
  onToggle: (enabled: boolean) => void;
  rentalPrice: number;
  onNotesChange?: (notes: string) => void;
}

export const CustomFitting = ({ 
  isEnabled, 
  onToggle, 
  rentalPrice, 
  onNotesChange 
}: CustomFittingProps) => {
  const [notes, setNotes] = useState('');

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNotes(value);
    if (onNotesChange) {
      onNotesChange(value);
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-3">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => onToggle(e.target.checked)}
            className="h-4 w-4 text-brand-rose border-gray-300 rounded focus:ring-brand-rose"
          />
          <span className="ml-2 text-sm text-gray-900">Request Custom Fitting</span>
        </label>
        
        {isEnabled && (
          <span className="text-sm font-medium text-brand-rose">
            +₹500 to rental price
          </span>
        )}
      </div>
      
      {isEnabled && (
        <div className="space-y-3">
          <textarea
            value={notes}
            onChange={handleNotesChange}
            placeholder="Please provide your exact body measurements (bust, waist, hips, length, etc.) for custom fitting..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose resize-none"
            rows={4}
          />
          <div className="flex justify-between items-center pt-2">
            <span className="text-base font-bold text-brand-rose">
              ₹{(rentalPrice + 500).toLocaleString()} / day
            </span>
            <span className="text-sm text-gray-600">
              Total includes custom fitting charge
            </span>
          </div>
        </div>
      )}
    </div>
  );
};