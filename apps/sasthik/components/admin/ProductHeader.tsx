'use client';

import { Button } from '../ui/Button';
import { Plus, Upload, Download } from 'lucide-react';

interface ProductHeaderProps {
  productCount: number;
  onAddNew: () => void;
  onImport?: () => void;
  onExport?: () => void;
}

export function ProductHeader({ 
  productCount, 
  onAddNew, 
  onImport, 
  onExport 
}: ProductHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Products</h1>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-rose/10 text-brand-rose">
            {productCount} items
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">Manage your product inventory</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          onClick={onAddNew}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </Button>
        
        {onImport && (
          <Button 
            variant="outline" 
            onClick={onImport}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Import
          </Button>
        )}
        
        {onExport && (
          <Button 
            variant="outline" 
            onClick={onExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}