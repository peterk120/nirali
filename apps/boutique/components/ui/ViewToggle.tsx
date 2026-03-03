import { LayoutGrid, List } from 'lucide-react';
import { Button } from './button';

interface ViewToggleProps {
  currentView: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ currentView, onChange }) => {
  return (
    <div className="flex border border-gray-300 rounded-md p-1">
      <button
        onClick={() => onChange('grid')}
        className={`p-2 rounded-md ${
          currentView === 'grid' 
            ? 'bg-brand-rose text-white' 
            : 'hover:bg-gray-100'
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange('list')}
        className={`p-2 rounded-md ${
          currentView === 'list' 
            ? 'bg-brand-rose text-white' 
            : 'hover:bg-gray-100'
        }`}
        aria-label="List view"
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};