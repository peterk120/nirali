'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import AdminWrapper from '../AdminWrapper';
import { ProductHeader } from '@/components/admin/ProductHeader';
import { ProductFilters } from '@/components/admin/ProductFilters';
import { ProductTable } from '@/components/admin/ProductTable';
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

const premiumStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --brand-rose: #B76E79;
    --brand-rose-light: rgba(183, 110, 121, 0.1);
    --gold: #c9a84c;
    --gold-light: #f5edd8;
    --brand-teal: #1A7A7A;
    --ink: #0f0e0d;
    --ink-60: #5a5755;
    --ink-30: #b0adaa;
    --surface: #faf9f7;
    --white: #ffffff;
    --border: #ede9e4;
    --radius: 14px;
  }

  .admin-products-page {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
  }

  .admin-products-main {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2.5rem 2rem 4rem;
  }

  .stat-cards {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.25rem;
    margin-bottom: 2.5rem;
  }

  .stat-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem 1.75rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  }

  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 600;
    color: var(--ink);
  }
`;

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    const checkAuthAndFetch = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin' && payload.role !== 'sales') {
          router.push('/admin/login');
        } else {
          setIsAuthenticated(true);
          setUserRole(payload.role);
          setAuthLoading(false);
          
          // Fetch products from Sashti brand
          const response = await fetch(`${baseUrl}/products?brand=sashti`);
          const result = await response.json();
          if (result.success) {
            setProducts(result.data.map((p: any) => ({
              id: p._id,
              name: p.name,
              image: p.image || p.images?.[0]?.url,
              sku: p.sku || 'SKU-001',
              price: p.price || 0,
              stock: p.stock || 0,
              category: p.category || 'Jewellery',
              tags: p.tags || [],
              isFeatured: p.isFeatured || false,
              status: p.status || 'Active',
            })));
          }
          setLoading(false);
        }
      } catch {
        router.push('/admin/login');
      }
    };

    checkAuthAndFetch();
  }, [router, baseUrl]);

  const handleAddNew = () => router.push('/admin/products/new');
  const handleEdit = (id: string) => router.push(`/admin/products/edit/${id}`);
  
  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this piece from the catalogue?')) return;
    
    try {
      const response = await fetch(`${baseUrl}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Piece removed from collection');
        setProducts(products.filter(p => p.id !== id));
      } else {
        toast.error(result.message || 'Failed to delete');
      }
    } catch (err) {
      toast.error('Network error while deleting');
    }
  };

  if (authLoading || loading) return <AdminWrapper><div>Loading Sashti Inventory...</div></AdminWrapper>;

  return (
    <>
      <style>{premiumStyles}</style>
      <AdminWrapper>
        <div className="admin-products-page">
          <main className="admin-products-main">
            <ProductHeader 
              productCount={products.length} 
              onAddNew={handleAddNew} 
            />
            
            <div className="stat-cards">
               <div className="stat-card">
                  <div className="text-xs font-bold uppercase text-gray-400 mb-1">Total Pieces</div>
                  <div className="stat-value">{products.length}</div>
               </div>
               <div className="stat-card">
                  <div className="text-xs font-bold uppercase text-gray-400 mb-1">Low Stock</div>
                  <div className="stat-value text-brand-rose">{products.filter(p => p.stock < 5).length}</div>
               </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
               <ProductTable 
                 products={products} 
                 selectedIds={selectedIds}
                 userRole={userRole}
                 onSelectAll={(s) => setSelectedIds(s ? products.map(p => p.id) : [])}
                 onSelectProduct={(id, s) => setSelectedIds(s ? [...selectedIds, id] : selectedIds.filter(x => x !== id))}
                 onEdit={handleEdit}
                 onDelete={handleDelete}
                 onToggleFeatured={() => {}}
                 onView={(id) => router.push(`/product/${id}`)}
               />
            </div>
          </main>
        </div>
      </AdminWrapper>
    </>
  );
}
