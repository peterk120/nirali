'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Search, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductFiltersProps {
  categories: string[];
  productTypes: string[];
  brands: string[];
  stockStatuses: string[];
  onSearch: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onProductTypeChange: (type: string) => void;
  onStockStatusChange: (status: string) => void;
  onBrandChange: (brand: string) => void;
  onBulkAction: (action: string) => void;
  selectedIds: string[];
}

export function ProductFilters({
  categories,
  productTypes,
  brands,
  stockStatuses,
  onSearch,
  onCategoryChange,
  onProductTypeChange,
  onStockStatusChange,
  onBrandChange,
  onBulkAction,
  selectedIds
}: ProductFiltersProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStock, setSelectedStock] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) return;
    onBulkAction(action);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Left side - Filters */}
        <div className="flex-1 flex flex-wrap gap-3 items-center">
          {/* Bulk Actions */}
          <div className="flex items-center gap-2">
            <select 
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
              onChange={(e) => handleBulkAction(e.target.value)}
              value=""
              disabled={selectedIds.length === 0}
            >
              <option value="">Bulk Actions</option>
              <option value="delete">Delete</option>
              <option value="featured">Mark as Featured</option>
              <option value="unfeatured">Remove from Featured</option>
            </select>
            <Button 
              size="sm"
              disabled={selectedIds.length === 0}
              onClick={() => handleBulkAction('apply')}
            >
              Apply
            </Button>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              onCategoryChange(e.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>

          {/* Product Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              onProductTypeChange(e.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
          >
            <option value="all">All Types</option>
            {productTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Stock Status Filter */}
          <select
            value={selectedStock}
            onChange={(e) => {
              setSelectedStock(e.target.value);
              onStockStatusChange(e.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
          >
            <option value="all">All Stock Status</option>
            {stockStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              onBrandChange(e.target.value);
            }}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        {/* Right side - Search */}
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-rose focus:border-brand-rose w-full sm:w-64"
            />
          </div>
          <Button onClick={handleSearch} size="sm">
            <Search className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}