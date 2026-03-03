import { X } from 'lucide-react';

interface ActiveFilter {
  name: string;
  value: string;
  label: string;
}

interface ActiveFilterChipsProps {
  filters: ActiveFilter[];
  onRemove: (filterName: string, value: string | null) => void;
}

export const ActiveFilterChips: React.FC<ActiveFilterChipsProps> = ({ filters, onRemove }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <div 
          key={`${filter.name}-${filter.value}`} 
          className="flex items-center bg-brand-rose/10 text-brand-rose px-3 py-1 rounded-full text-sm"
        >
          <span>{filter.label}</span>
          <button
            onClick={() => onRemove(filter.name, null)}
            className="ml-2 p-1 rounded-full hover:bg-brand-rose/20"
            aria-label={`Remove ${filter.label} filter`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
      {filters.length > 0 && (
        <button
          onClick={() => filters.forEach(f => onRemove(f.name, null))}
          className="flex items-center text-gray-500 hover:text-gray-700 text-sm underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
};