'use client';

import { useState, useEffect, useCallback } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import * as Dialog from '@radix-ui/react-dialog';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';

interface FilterPanelProps {
  currentFilters: {
    category?: string[];
    color?: string[];
    size?: string[];
    priceMin?: number;
    priceMax?: number;
    occasion?: string[];
    fabric?: string[];
    rating?: string;
  };
  onFilterChange: (filterName: string, value: any) => void;
}

interface FilterOption {
  value: string;
  label: string;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ currentFilters, onFilterChange }) => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(currentFilters);
  const [debouncedPriceMin, setDebouncedPriceMin] = useState(currentFilters.priceMin ?? 500);
  const [debouncedPriceMax, setDebouncedPriceMax] = useState(currentFilters.priceMax ?? 20000);
  
  // Categories
  const categories: FilterOption[] = [
    { value: 'lehenga', label: 'Lehenga' },
    { value: 'saree', label: 'Saree' },
    { value: 'gown', label: 'Gown' },
    { value: 'fusion', label: 'Fusion' },
  ];
  
  // Colors
  const colors: FilterOption[] = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'pink', label: 'Pink' },
    { value: 'purple', label: 'Purple' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'navy', label: 'Navy' },
    { value: 'maroon', label: 'Maroon' },
    { value: 'orange', label: 'Orange' },
  ];
  
  // Sizes
  const sizes: FilterOption[] = [
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'custom', label: 'Custom' },
  ];
  
  // Occasions
  const occasions: FilterOption[] = [
    { value: 'wedding', label: 'Wedding' },
    { value: 'reception', label: 'Reception' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'pre-wedding', label: 'Pre-wedding' },
  ];
  
  // Fabrics
  const fabrics: FilterOption[] = [
    { value: 'silk', label: 'Silk' },
    { value: 'chiffon', label: 'Chiffon' },
    { value: 'net', label: 'Net' },
    { value: 'velvet', label: 'Velvet' },
    { value: 'georgette', label: 'Georgette' },
  ];

  // Update local filters when currentFilters prop changes
  useEffect(() => {
    setLocalFilters(currentFilters);
    setDebouncedPriceMin(currentFilters.priceMin ?? 500);
    setDebouncedPriceMax(currentFilters.priceMax ?? 20000);
  }, [currentFilters]);

  // Handle category change
  const handleCategoryChange = (category: string) => {
    const updatedCategories = localFilters.category?.includes(category)
      ? localFilters.category.filter(c => c !== category)
      : [...(localFilters.category || []), category];
    
    setLocalFilters({
      ...localFilters,
      category: updatedCategories,
    });
    
    onFilterChange('category', updatedCategories);
  };

  // Handle color change
  const handleColorChange = (color: string) => {
    const updatedColors = localFilters.color?.includes(color)
      ? localFilters.color.filter(c => c !== color)
      : [...(localFilters.color || []), color];
    
    setLocalFilters({
      ...localFilters,
      color: updatedColors,
    });
    
    onFilterChange('color', updatedColors);
  };

  // Handle size change
  const handleSizeChange = (size: string) => {
    const updatedSizes = localFilters.size?.includes(size)
      ? localFilters.size.filter(s => s !== size)
      : [...(localFilters.size || []), size];
    
    setLocalFilters({
      ...localFilters,
      size: updatedSizes,
    });
    
    onFilterChange('size', updatedSizes);
  };

  // Handle occasion change
  const handleOccasionChange = (occasion: string) => {
    const updatedOccasions = localFilters.occasion?.includes(occasion)
      ? localFilters.occasion.filter(o => o !== occasion)
      : [...(localFilters.occasion || []), occasion];
    
    setLocalFilters({
      ...localFilters,
      occasion: updatedOccasions,
    });
    
    onFilterChange('occasion', updatedOccasions);
  };

  // Handle fabric change
  const handleFabricChange = (fabric: string) => {
    const updatedFabrics = localFilters.fabric?.includes(fabric)
      ? localFilters.fabric.filter(f => f !== fabric)
      : [...(localFilters.fabric || []), fabric];
    
    setLocalFilters({
      ...localFilters,
      fabric: updatedFabrics,
    });
    
    onFilterChange('fabric', updatedFabrics);
  };

  // Handle rating change
  const handleRatingChange = (rating: string) => {
    setLocalFilters({
      ...localFilters,
      rating,
    });
    
    onFilterChange('rating', rating);
  };

  // Handle price range change with debounce
  const handlePriceChange = ([min, max]: number[]) => {
    setLocalFilters({
      ...localFilters,
      priceMin: min,
      priceMax: max,
    });
    
    setDebouncedPriceMin(min);
    setDebouncedPriceMax(max);
    
    // Debounce the actual filter change
    setTimeout(() => {
      onFilterChange('priceMin', min);
      onFilterChange('priceMax', max);
    }, 500);
  };

  // Clear all filters
  const handleClearAll = () => {
    setLocalFilters({});
    onFilterChange('clearAll', null);
  };

  // State for show more functionality
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);
  const [showAllOccasions, setShowAllOccasions] = useState(false);
  const [showAllFabrics, setShowAllFabrics] = useState(false);

  // Render filter section with show more functionality
  const renderFilterSection = (title: string, options: FilterOption[], selectedValues: string[] = [], renderOption: (option: FilterOption) => JSX.Element, showMoreLimit: number = 5, showAllState: boolean, setShowAllState: React.Dispatch<React.SetStateAction<boolean>>) => {
    const visibleOptions = showAllState ? options : options.slice(0, showMoreLimit);
    
    return (
      <Accordion.Item value={title.toLowerCase().replace(/\s+/g, '-')} className="border-b border-gray-200">
        <Accordion.Header>
          <Accordion.Trigger className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-900 hover:underline">
            <div className="flex items-center">
              {title}
              {selectedValues.length > 0 && (
                <span className="ml-2 bg-brand-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {selectedValues.length}
                </span>
              )}
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
          </Accordion.Trigger>
        </Accordion.Header>
        <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4">
          <div className="grid grid-cols-2 gap-2">
            {visibleOptions.map(option => renderOption(option))}
          </div>
          {options.length > showMoreLimit && (
            <button 
              className="mt-2 text-sm text-brand-rose hover:underline"
              onClick={(e) => {
                e.preventDefault();
                setShowAllState(!showAllState);
              }}
            >
              {showAllState ? 'Show less' : 'Show more'}
            </button>
          )}
        </Accordion.Content>
      </Accordion.Item>
    );
  };

  // Render category checkboxes
  const renderCategoryOption = (option: FilterOption) => (
    <div key={option.value} className="flex items-center">
      <input
        type="checkbox"
        id={`category-${option.value}`}
        checked={localFilters.category?.includes(option.value) || false}
        onChange={() => handleCategoryChange(option.value)}
        className="h-4 w-4 text-brand-rose border-gray-300 rounded focus:ring-brand-rose"
      />
      <label htmlFor={`category-${option.value}`} className="ml-2 text-sm text-gray-700">
        {option.label}
      </label>
    </div>
  );

  // Render color swatches
  const renderColorOption = (option: FilterOption) => {
    const colorMap: Record<string, string> = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      pink: 'bg-pink-500',
      purple: 'bg-purple-500',
      gold: 'bg-yellow-600',
      silver: 'bg-gray-400',
      black: 'bg-black',
      white: 'bg-white border border-gray-300',
      navy: 'bg-blue-900',
      maroon: 'bg-red-900',
      orange: 'bg-orange-500',
    };

    return (
      <div key={option.value} className="flex items-center">
        <button
          onClick={() => handleColorChange(option.value)}
          className={`w-6 h-6 rounded-full ${colorMap[option.value]} ${
            localFilters.color?.includes(option.value) ? 'ring-2 ring-offset-2 ring-brand-rose' : ''
          }`}
          aria-label={option.label}
        />
        <label className="ml-2 text-sm text-gray-700">
          {option.label}
        </label>
      </div>
    );
  };

  // Render size pills
  const renderSizeOption = (option: FilterOption) => (
    <button
      key={option.value}
      onClick={() => handleSizeChange(option.value)}
      className={`px-3 py-1 text-sm rounded-full border ${
        localFilters.size?.includes(option.value)
          ? 'bg-brand-rose text-white border-brand-rose'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
      }`}
    >
      {option.label}
    </button>
  );

  // Render occasion checkboxes
  const renderOccasionOption = (option: FilterOption) => (
    <div key={option.value} className="flex items-center">
      <input
        type="checkbox"
        id={`occasion-${option.value}`}
        checked={localFilters.occasion?.includes(option.value) || false}
        onChange={() => handleOccasionChange(option.value)}
        className="h-4 w-4 text-brand-rose border-gray-300 rounded focus:ring-brand-rose"
      />
      <label htmlFor={`occasion-${option.value}`} className="ml-2 text-sm text-gray-700">
        {option.label}
      </label>
    </div>
  );

  // Render fabric checkboxes
  const renderFabricOption = (option: FilterOption) => (
    <div key={option.value} className="flex items-center">
      <input
        type="checkbox"
        id={`fabric-${option.value}`}
        checked={localFilters.fabric?.includes(option.value) || false}
        onChange={() => handleFabricChange(option.value)}
        className="h-4 w-4 text-brand-rose border-gray-300 rounded focus:ring-brand-rose"
      />
      <label htmlFor={`fabric-${option.value}`} className="ml-2 text-sm text-gray-700">
        {option.label}
      </label>
    </div>
  );

  // Render rating radios
  const renderRatingOption = (option: FilterOption) => (
    <div key={option.value} className="flex items-center">
      <input
        type="radio"
        id={`rating-${option.value}`}
        name="rating"
        checked={localFilters.rating === option.value}
        onChange={() => handleRatingChange(option.value)}
        className="h-4 w-4 text-brand-rose border-gray-300 focus:ring-brand-rose"
      />
      <label htmlFor={`rating-${option.value}`} className="ml-2 text-sm text-gray-700">
        {option.label}
      </label>
    </div>
  );

  return (
    <>
      {/* Desktop Filter Panel */}
      <div className="hidden md:block bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button 
            className="text-brand-rose hover:underline text-sm"
            onClick={handleClearAll}
          >
            Clear All
          </button>
        </div>
        
        <Accordion.Root type="multiple" className="w-full">
          {/* Category Section */}
          {renderFilterSection(
            'Category',
            categories,
            localFilters.category || [],
            renderCategoryOption,
            5,
            showAllCategories,
            setShowAllCategories
          )}
          
          {/* Color Section */}
          {renderFilterSection(
            'Color',
            colors,
            localFilters.color || [],
            renderColorOption,
            5,
            showAllColors,
            setShowAllColors
          )}
          
          {/* Size Section */}
          {renderFilterSection(
            'Size',
            sizes,
            localFilters.size || [],
            renderSizeOption,
            5,
            showAllSizes,
            setShowAllSizes
          )}
          
          {/* Price Range Section */}
          <Accordion.Item value="price-range" className="border-b border-gray-200">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-900 hover:underline">
                <div className="flex items-center">
                  Price Range
                  {(localFilters.priceMin !== 500 || localFilters.priceMax !== 20000) && (
                    <span className="ml-2 bg-brand-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4">
              <div className="px-1">
                <Slider
                  defaultValue={[debouncedPriceMin, debouncedPriceMax]}
                  min={500}
                  max={20000}
                  step={100}
                  onValueChange={handlePriceChange}
                />
                <div className="flex justify-between mt-2 text-sm">
                  <span>₹{debouncedPriceMin.toLocaleString()}</span>
                  <span>₹{debouncedPriceMax.toLocaleString()}</span>
                </div>
                <div className="mt-2 text-center font-medium">
                  ₹{debouncedPriceMin.toLocaleString()} — ₹{debouncedPriceMax.toLocaleString()}
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
          
          {/* Occasion Section */}
          {renderFilterSection(
            'Occasion',
            occasions,
            localFilters.occasion || [],
            renderOccasionOption,
            5,
            showAllOccasions,
            setShowAllOccasions
          )}
          
          {/* Fabric Section */}
          {renderFilterSection(
            'Fabric',
            fabrics,
            localFilters.fabric || [],
            renderFabricOption,
            5,
            showAllFabrics,
            setShowAllFabrics
          )}
          
          {/* Rating Section */}
          <Accordion.Item value="rating" className="border-b border-gray-200">
            <Accordion.Header>
              <Accordion.Trigger className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-900 hover:underline">
                <div className="flex items-center">
                  Rating
                  {localFilters.rating && (
                    <span className="ml-2 bg-brand-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      1
                    </span>
                  )}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4">
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-4"
                    name="rating"
                    checked={localFilters.rating === '4+'}
                    onChange={() => handleRatingChange('4+')}
                    className="h-4 w-4 text-brand-rose border-gray-300 focus:ring-brand-rose"
                  />
                  <label htmlFor="rating-4" className="ml-2 text-sm text-gray-700">
                    4+ stars
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="rating-3"
                    name="rating"
                    checked={localFilters.rating === '3+'}
                    onChange={() => handleRatingChange('3+')}
                    className="h-4 w-4 text-brand-rose border-gray-300 focus:ring-brand-rose"
                  />
                  <label htmlFor="rating-3" className="ml-2 text-sm text-gray-700">
                    3+ stars
                  </label>
                </div>
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      </div>
      
      {/* Mobile Filter Button */}
      <div className="md:hidden">
        <button
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-white border border-gray-300 rounded-lg text-gray-700"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>
      
      {/* Mobile Filter Sheet */}
      <Dialog.Root open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 z-50 h-[80vh] bg-white rounded-t-xl flex flex-col">
            {/* Handle bar */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-2" />
            
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <Dialog.Title className="text-lg font-semibold">Filters</Dialog.Title>
              <Dialog.Close asChild>
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </Dialog.Close>
            </div>
            
            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <Accordion.Root type="multiple" className="w-full">
                {/* Category Section */}
                {renderFilterSection(
                  'Category',
                  categories,
                  localFilters.category || [],
                  renderCategoryOption,
                  5,
                  showAllCategories,
                  setShowAllCategories
                )}
                
                {/* Color Section */}
                {renderFilterSection(
                  'Color',
                  colors,
                  localFilters.color || [],
                  renderColorOption,
                  5,
                  showAllColors,
                  setShowAllColors
                )}
                
                {/* Size Section */}
                {renderFilterSection(
                  'Size',
                  sizes,
                  localFilters.size || [],
                  renderSizeOption,
                  5,
                  showAllSizes,
                  setShowAllSizes
                )}
                
                {/* Price Range Section */}
                <Accordion.Item value="price-range" className="border-b border-gray-200">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-900 hover:underline">
                      <div className="flex items-center">
                        Price Range
                        {(localFilters.priceMin !== 500 || localFilters.priceMax !== 20000) && (
                          <span className="ml-2 bg-brand-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            1
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4">
                    <div className="px-1">
                      <Slider
                        defaultValue={[debouncedPriceMin, debouncedPriceMax]}
                        min={500}
                        max={20000}
                        step={100}
                        onValueChange={handlePriceChange}
                      />
                      <div className="flex justify-between mt-2 text-sm">
                        <span>₹{debouncedPriceMin.toLocaleString()}</span>
                        <span>₹{debouncedPriceMax.toLocaleString()}</span>
                      </div>
                      <div className="mt-2 text-center font-medium">
                        ₹{debouncedPriceMin.toLocaleString()} — ₹{debouncedPriceMax.toLocaleString()}
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
                
                {/* Occasion Section */}
                {renderFilterSection(
                  'Occasion',
                  occasions,
                  localFilters.occasion || [],
                  renderOccasionOption,
                  5,
                  showAllOccasions,
                  setShowAllOccasions
                )}
                
                {/* Fabric Section */}
                {renderFilterSection(
                  'Fabric',
                  fabrics,
                  localFilters.fabric || [],
                  renderFabricOption,
                  5,
                  showAllFabrics,
                  setShowAllFabrics
                )}
                
                {/* Rating Section */}
                <Accordion.Item value="rating" className="border-b border-gray-200">
                  <Accordion.Header>
                    <Accordion.Trigger className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-900 hover:underline">
                      <div className="flex items-center">
                        Rating
                        {localFilters.rating && (
                          <span className="ml-2 bg-brand-rose text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            1
                          </span>
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300 ease-in-out group-data-[state=open]:rotate-180" />
                    </Accordion.Trigger>
                  </Accordion.Header>
                  <Accordion.Content className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down pb-4">
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="rating-4-mobile"
                          name="rating-mobile"
                          checked={localFilters.rating === '4+'}
                          onChange={() => handleRatingChange('4+')}
                          className="h-4 w-4 text-brand-rose border-gray-300 focus:ring-brand-rose"
                        />
                        <label htmlFor="rating-4-mobile" className="ml-2 text-sm text-gray-700">
                          4+ stars
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="rating-3-mobile"
                          name="rating-mobile"
                          checked={localFilters.rating === '3+'}
                          onChange={() => handleRatingChange('3+')}
                          className="h-4 w-4 text-brand-rose border-gray-300 focus:ring-brand-rose"
                        />
                        <label htmlFor="rating-3-mobile" className="ml-2 text-sm text-gray-700">
                          3+ stars
                        </label>
                      </div>
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
            
            {/* Sticky Apply & Reset Buttons */}
            <div className="border-t p-4 bg-white sticky bottom-0">
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  onClick={handleClearAll}
                >
                  Reset
                </button>
                <button
                  className="flex-1 py-3 bg-brand-rose text-white rounded-lg hover:bg-brand-rose/90"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};