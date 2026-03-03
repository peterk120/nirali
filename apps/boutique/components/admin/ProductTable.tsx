'use client';

import { useState } from 'react';
import { ProductRow } from './ProductRow';
import { Checkbox } from '../ui/checkbox';
import { cn } from '../../lib/utils';

interface Product {
  id: string;
  name: string;
  image?: string;
  sku?: string;
  price: number;
  stock: number;
  category: string;
  tags: string[];
  isFeatured: boolean;
  status: 'Active' | 'Inactive';
}

interface ProductTableProps {
  products: Product[];
  selectedIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectProduct: (id: string, selected: boolean) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export function ProductTable({
  products,
  selectedIds,
  onSelectAll,
  onSelectProduct,
  onEdit,
  onView,
  onDelete,
  onToggleFeatured
}: ProductTableProps) {
  const allSelected = products.length > 0 && selectedIds.length === products.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < products.length;

  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              {/* Checkbox Column */}
              <th scope="col" className="px-4 py-3 text-left">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
              </th>
              
              {/* Image Column */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              
              {/* Product Name Column */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              
              {/* Stock Status Column */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              
              {/* Price Column */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              
              {/* Category Column */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              
              {/* Tags Column */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              
              {/* Featured Column */}
              <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Featured
              </th>
              
              {/* Actions Column (Mobile) */}
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider md:hidden">
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">No products found</h3>
                    <p className="text-sm text-gray-500">Get started by adding a new product.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  isSelected={selectedIds.includes(product.id)}
                  onSelect={onSelectProduct}
                  onEdit={onEdit}
                  onView={onView}
                  onDelete={onDelete}
                  onToggleFeatured={onToggleFeatured}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}