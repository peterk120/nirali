import { useState } from 'react';
import { Slider } from './slider';
import { Checkbox } from './checkbox';

interface FilterSidebarProps {
  category?: string;
  color?: string;
  size?: string;
  priceMin?: number;
  priceMax?: number;
  onFilterChange: (filterName: string, value: string | null) => void;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  category,
  color,
  size,
  priceMin,
  priceMax,
  onFilterChange,
}) => {
  const [minPrice, setMinPrice] = useState<number>(priceMin || 0);
  const [maxPrice, setMaxPrice] = useState<number>(priceMax || 10000);

  const categories = ['lehenga', 'saree', 'gown', 'anarkali'];
  const colors = ['red', 'blue', 'green', 'pink', 'purple', 'gold'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const handlePriceApply = () => {
    onFilterChange('priceMin', minPrice.toString());
    onFilterChange('priceMax', maxPrice.toString());
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-fit">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center">
              <Checkbox
                id={`category-${cat}`}
                checked={category === cat}
                onCheckedChange={(checked) => onFilterChange('category', checked ? cat : null)}
              />
              <label htmlFor={`category-${cat}`} className="ml-2 text-sm capitalize">
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
                id={`color-${clr}`}
                checked={color === clr}
                onCheckedChange={(checked) => onFilterChange('color', checked ? clr : null)}
              />
              <label htmlFor={`color-${clr}`} className="ml-2 text-sm capitalize">
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
                id={`size-${sz}`}
                checked={size === sz}
                onCheckedChange={(checked) => onFilterChange('size', checked ? sz : null)}
              />
              <label htmlFor={`size-${sz}`} className="ml-2 text-sm">
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
    </div>
  );
};