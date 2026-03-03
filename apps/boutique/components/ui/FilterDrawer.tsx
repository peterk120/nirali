import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './button';
import { Slider } from './slider';
import { Checkbox } from './checkbox';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
  color?: string;
  size?: string;
  priceMin?: number;
  priceMax?: number;
  sort: string;
  onFilterChange: (filterName: string, value: string | null) => void;
  onSortChange: (value: string) => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  category,
  color,
  size,
  priceMin,
  priceMax,
  sort,
  onFilterChange,
  onSortChange,
}) => {
  if (!isOpen) return null;

  const [minPrice, setMinPrice] = useState<number>(priceMin || 0);
  const [maxPrice, setMaxPrice] = useState<number>(priceMax || 10000);

  const categories = ['lehenga', 'saree', 'gown', 'anarkali'];
  const colors = ['red', 'blue', 'green', 'pink', 'purple', 'gold'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  const sorts = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'price-low-high', label: 'Price Low-High' },
    { value: 'price-high-low', label: 'Price High-Low' },
    { value: 'newest', label: 'Newest' },
  ];

  const handlePriceApply = () => {
    onFilterChange('priceMin', minPrice.toString());
    onFilterChange('priceMax', maxPrice.toString());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end">
      <div className="bg-white w-full max-w-sm h-full p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Sort Dropdown */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Sort By</h3>
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {sorts.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Category</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center">
                <Checkbox
                  id={`drawer-category-${cat}`}
                  checked={category === cat}
                  onCheckedChange={(checked) => onFilterChange('category', checked ? cat : null)}
                />
                <label htmlFor={`drawer-category-${cat}`} className="ml-2 text-sm capitalize">
                  {cat}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Color Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Color</h3>
          <div className="space-y-2">
            {colors.map((clr) => (
              <div key={clr} className="flex items-center">
                <Checkbox
                  id={`drawer-color-${clr}`}
                  checked={color === clr}
                  onCheckedChange={(checked) => onFilterChange('color', checked ? clr : null)}
                />
                <label htmlFor={`drawer-color-${clr}`} className="ml-2 text-sm capitalize">
                  {clr}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Size Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Size</h3>
          <div className="space-y-2">
            {sizes.map((sz) => (
              <div key={sz} className="flex items-center">
                <Checkbox
                  id={`drawer-size-${sz}`}
                  checked={size === sz}
                  onCheckedChange={(checked) => onFilterChange('size', checked ? sz : null)}
                />
                <label htmlFor={`drawer-size-${sz}`} className="ml-2 text-sm">
                  {sz}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Price Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="px-1">
            <Slider
              defaultValue={[minPrice, maxPrice]}
              min={0}
              max={10000}
              step={100}
              onValueChange={([newMin, newMax]) => {
                setMinPrice(newMin);
                setMaxPrice(newMax);
              }}
            />
            <div className="flex justify-between mt-2 text-sm">
              <span>₹{minPrice}</span>
              <span>₹{maxPrice}</span>
            </div>
            <button
              onClick={handlePriceApply}
              className="mt-3 w-full py-2 bg-brand-rose text-white rounded-md text-sm hover:bg-brand-rose/90"
            >
              Apply Price
            </button>
          </div>
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onClose}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};