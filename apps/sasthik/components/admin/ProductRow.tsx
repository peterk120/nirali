'use client';

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { Edit, Eye, Trash2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';

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

interface ProductRowProps {
  product: Product;
  isSelected: boolean;
  userRole?: string;
  onSelect: (id: string, selected: boolean) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export function ProductRow({
  product,
  isSelected,
  userRole,
  onSelect,
  onEdit,
  onView,
  onDelete,
  onToggleFeatured
}: ProductRowProps) {
  const [showActions, setShowActions] = useState(false);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
    }
  };

  const handleToggleFeatured = () => {
    onToggleFeatured(product.id);
  };

  const stockStatus = product.stock > 0 ? 'In Stock' : 'Out of Stock';
  const stockColor = product.stock > 0 ? 'text-green-600' : 'text-red-600';
  const stockBg = product.stock > 0 ? 'bg-green-100' : 'bg-red-100';
  const stockText = product.stock > 0 ? 'text-green-800' : 'text-red-800';

  return (
    <tr 
      className={cn(
        "border-b border-gray-200 hover:bg-gray-50 transition-colors",
        isSelected && "bg-brand-rose/5"
      )}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Checkbox */}
      <td className="px-4 py-4 whitespace-nowrap">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(product.id, checked as boolean)}
        />
      </td>

      {/* Product Image */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex-shrink-0 h-12 w-12">
          <img
            className="h-12 w-12 rounded-md object-cover border border-gray-200"
            src={product.image || '/placeholder-product.jpg'}
            alt={product.name}
          />
        </div>
      </td>

      {/* Product Name */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <div>
            <div className="text-sm font-medium text-gray-900">
              {product.name}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              SKU: {product.sku || 'N/A'}
            </div>
          </div>
          {product.isFeatured && (
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
          )}
        </div>
        
        {/* Hover Actions */}
        <div 
          className={cn(
            "flex gap-2 mt-2 transition-opacity duration-200",
            showActions ? "opacity-100" : "opacity-0"
          )}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product.id)}
            className="h-7 px-2 text-xs"
          >
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(product.id)}
            className="h-7 px-2 text-xs"
          >
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          {userRole === 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-7 px-2 text-xs text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      </td>

      {/* Stock Status */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className={cn(
          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
          stockBg,
          stockText
        )}>
          {stockStatus}
        </span>
        <div className="text-xs text-gray-500 mt-1">
          {product.stock} in stock
        </div>
      </td>

      {/* Price */}
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
        ₹{product.price.toLocaleString()}
      </td>

      {/* Categories */}
      <td className="px-4 py-4 text-sm text-gray-500">
        {product.category}
      </td>

      {/* Tags */}
      <td className="px-4 py-4">
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
          {product.tags.length > 2 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
              +{product.tags.length - 2}
            </span>
          )}
        </div>
      </td>

      {/* Featured */}
      <td className="px-4 py-4 whitespace-nowrap text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleFeatured}
          className={cn(
            "p-1",
            product.isFeatured 
              ? "text-yellow-500 hover:text-yellow-600" 
              : "text-gray-400 hover:text-gray-500"
          )}
        >
          <Star className={cn(
            "w-5 h-5",
            product.isFeatured && "fill-current"
          )} />
        </Button>
      </td>

      {/* Actions (Mobile/Tablet) */}
      <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium md:hidden">
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(product.id)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          {userRole === 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </td>
    </tr>
  );
}