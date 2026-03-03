import { ChevronDown } from 'lucide-react';
import { Button } from './button';

interface SortDropdownProps {
  currentValue: string;
  onChange: (value: string) => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ currentValue, onChange }) => {
  const options = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low-high', label: 'Price Low-High' },
    { value: 'price-high-low', label: 'Price High-Low' },
    { value: 'newest', label: 'Newest' },
  ];

  const currentLabel = options.find(opt => opt.value === currentValue)?.label || 'Most Popular';

  return (
    <div className="relative">
      <select
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
    </div>
  );
};