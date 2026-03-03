'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../../lib/auth';
import AdminWrapper from '../AdminWrapper';
import { ProductHeader } from '../../../components/admin/ProductHeader';
import { ProductFilters } from '../../../components/admin/ProductFilters';
import { ProductTable } from '../../../components/admin/ProductTable';
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

// ─── Inline premium styles injected once ───────────────────────────────────
const premiumStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --brand-rose: #e11d48;
    --brand-rose-light: #fce7ef;
    --brand-rose-dark: #9f1239;
    --gold: #c9a84c;
    --gold-light: #f5edd8;
    --ink: #0f0e0d;
    --ink-60: #5a5755;
    --ink-30: #b0adaa;
    --surface: #faf9f7;
    --white: #ffffff;
    --border: #ede9e4;
    --shadow-sm: 0 1px 3px rgba(15,14,13,0.06), 0 1px 2px rgba(15,14,13,0.04);
    --shadow-md: 0 4px 16px rgba(15,14,13,0.08), 0 2px 6px rgba(15,14,13,0.04);
    --shadow-lg: 0 12px 40px rgba(15,14,13,0.10), 0 4px 12px rgba(15,14,13,0.06);
    --radius: 14px;
    --radius-sm: 8px;
  }

  /* ── Page shell ── */
  .admin-products-page {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }

  /* Subtle grain overlay */
  .admin-products-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
    background-size: 200px 200px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Content wrapper ── */
  .admin-products-main {
    position: relative;
    z-index: 1;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2.5rem 2rem 4rem;
  }

  /* ── Breadcrumb ── */
  .admin-breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2.5rem;
    font-size: 0.78rem;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-30);
  }
  .admin-breadcrumb span { color: var(--ink-60); }
  .admin-breadcrumb .sep { color: var(--ink-30); }

  /* ── Stat cards row ── */
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
    box-shadow: var(--shadow-sm);
    transition: box-shadow 0.2s, transform 0.2s;
    position: relative;
    overflow: hidden;
  }
  .stat-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateY(-2px);
  }
  .stat-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--brand-rose), var(--gold));
    opacity: 0;
    transition: opacity 0.2s;
  }
  .stat-card:hover::after { opacity: 1; }

  .stat-label {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-30);
    margin-bottom: 0.5rem;
  }
  .stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.4rem;
    font-weight: 600;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 0.25rem;
  }
  .stat-sub {
    font-size: 0.75rem;
    color: var(--ink-60);
  }
  .stat-icon {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
  }

  /* ── Section card (wraps filters + table) ── */
  .section-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    overflow: hidden;
  }

  /* ── Divider ── */
  .section-divider {
    height: 1px;
    background: var(--border);
    margin: 0;
  }

  /* ── Loading screens ── */
  .loading-screen {
    min-height: 100vh;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    font-family: 'DM Sans', sans-serif;
  }
  .loading-spinner {
    width: 44px;
    height: 44px;
    border: 2px solid var(--border);
    border-top-color: var(--brand-rose);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text {
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-30);
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .stat-cards { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 640px) {
    .stat-cards { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .admin-products-main { padding: 1.5rem 1rem 3rem; }
  }
`;

// ─── Stat card data derived from products ──────────────────────────────────
function buildStats(products: Product[]) {
  const total = products.length;
  const active = products.filter(p => p.status === 'Active').length;
  const featured = products.filter(p => p.isFeatured).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  return { total, active, featured, lowStock, outOfStock };
}

// ─── Page component ────────────────────────────────────────────────────────
export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      setIsAuthenticated(false);
      router.push('/login');
      return;
    }

    const checkAuthAndFetchProducts = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin') {
          setAuthLoading(false);
          setIsAuthenticated(false);
          router.push('/');
        } else {
          setIsAuthenticated(true);
          setAuthLoading(false);
          const response = await fetch('/api/products');
          const result = await response.json();
          if (result.success) {
            const transformedProducts = result.data.map((product: any) => ({
              id: product._id || product.id,
              name: product.name,
              image: product.image || product.images?.[0]?.url,
              sku: product.sku || product.attributes?.sku || `SKU-${(product._id || product.id)?.substring(0, 6) || 'XXXXXX'}`,
              price: product.price || product.finalPrice || product.basePrice || 0,
              stock: product.stock || product.stockQuantity || 0,
              category: product.category || product.brand || 'Uncategorized',
              tags: product.tags || [],
              isFeatured: product.isFeatured || product.featured || false,
              status: product.status || 'Active',
            }));
            setProducts(transformedProducts);
          } else {
            toast.error('Failed to fetch products');
          }
          setLoading(false);
        }
      } catch {
        setAuthLoading(false);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };

    checkAuthAndFetchProducts();
  }, [router]);

  const handleEdit = (id: string) => router.push(`/admin/products/edit/${id}`);
  const handleView = (_id: string) => toast.success('View functionality would be implemented here');

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Product deleted successfully!');
        setProducts(products.filter(p => p.id !== id));
        setSelectedIds(selectedIds.filter(s => s !== id));
      } else {
        toast.error(result.error || 'Failed to delete product');
      }
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleAddNew = () => router.push('/admin/products/new');

  const handleToggleFeatured = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    setProducts(products.map(p => p.id === id ? { ...p, isFeatured: !p.isFeatured } : p));
    toast.success(`Product ${product.isFeatured ? 'removed from' : 'added to'} featured products`);
  };

  const handleSelectAll = (selected: boolean) =>
    setSelectedIds(selected ? products.map(p => p.id) : []);

  const handleSelectProduct = (id: string, selected: boolean) =>
    setSelectedIds(selected ? [...selectedIds, id] : selectedIds.filter(s => s !== id));

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) toast.success(`Searching for: ${term}`);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    toast.success(`Filtering by category: ${category}`);
  };

  const handleProductTypeChange = (type: string) => {
    setTypeFilter(type);
    toast.success(`Filtering by type: ${type}`);
  };

  const handleStockStatusChange = (status: string) => {
    setStockFilter(status);
    toast.success(`Filtering by stock status: ${status}`);
  };

  const handleBrandChange = (brand: string) => {
    setBrandFilter(brand);
    toast.success(`Filtering by brand: ${brand}`);
  };

  const handleBulkAction = (action: string) => {
    if (selectedIds.length === 0) return;
    switch (action) {
      case 'delete':
        if (confirm(`Are you sure you want to delete ${selectedIds.length} products?`)) {
          Promise.all(selectedIds.map(id => fetch(`/api/products/${id}`, { method: 'DELETE' }))).then(() => {
            toast.success(`${selectedIds.length} products deleted successfully!`);
            setProducts(products.filter(p => !selectedIds.includes(p.id)));
            setSelectedIds([]);
          });
        }
        break;
      case 'featured':
        setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, isFeatured: true } : p));
        toast.success(`${selectedIds.length} products marked as featured`);
        setSelectedIds([]);
        break;
      case 'unfeatured':
        setProducts(products.map(p => selectedIds.includes(p.id) ? { ...p, isFeatured: false } : p));
        toast.success(`${selectedIds.length} products removed from featured`);
        setSelectedIds([]);
        break;
    }
  };

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);
  const productTypes = ['Dress', 'Jewellery', 'Product', 'Service'];
  const brands = ['Boutique', 'Bridal Jewels', 'Sasthik', 'Tamilsmakeover'];
  const stockStatuses = ['In Stock', 'Out of Stock', 'Low Stock'];

  // ── Auth loading ──────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <>
        <style>{premiumStyles}</style>
        <div className="loading-screen">
          <div className="loading-spinner" />
          <p className="loading-text">Verifying authentication</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated) return null;

  // ── Products loading ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{premiumStyles}</style>
        <AdminWrapper>
          <div className="loading-screen">
            <div className="loading-spinner" />
            <p className="loading-text">Loading products</p>
          </div>
        </AdminWrapper>
      </>
    );
  }

  const stats = buildStats(products);

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{premiumStyles}</style>
      <AdminWrapper>
        <div className="admin-products-page">
          <main className="admin-products-main">

            {/* Breadcrumb */}
            <nav className="admin-breadcrumb">
              <span>Dashboard</span>
              <span className="sep">›</span>
              <span>Catalogue</span>
              <span className="sep">›</span>
              <span style={{ color: 'var(--ink)' }}>Products</span>
            </nav>

            {/* Header */}
            <ProductHeader
              productCount={products.length}
              onAddNew={handleAddNew}
              onImport={() => toast.success('Import functionality would be implemented here')}
              onExport={() => toast.success('Export functionality would be implemented here')}
            />

            {/* Stat Cards */}
            <div className="stat-cards">
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'var(--brand-rose-light)', color: 'var(--brand-rose)' }}>
                  📦
                </div>
                <div className="stat-label">Total Products</div>
                <div className="stat-value">{stats.total}</div>
                <div className="stat-sub">in catalogue</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                  ✦
                </div>
                <div className="stat-label">Active</div>
                <div className="stat-value">{stats.active}</div>
                <div className="stat-sub">{stats.total - stats.active} inactive</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'var(--gold-light)', color: 'var(--gold)' }}>
                  ★
                </div>
                <div className="stat-label">Featured</div>
                <div className="stat-value">{stats.featured}</div>
                <div className="stat-sub">on storefront</div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  ⚠
                </div>
                <div className="stat-label">Stock Alerts</div>
                <div className="stat-value">{stats.lowStock + stats.outOfStock}</div>
                <div className="stat-sub">{stats.outOfStock} out · {stats.lowStock} low</div>
              </div>
            </div>

            {/* Filters + Table inside unified card */}
            <div className="section-card">
              <ProductFilters
                categories={categories}
                productTypes={productTypes}
                brands={brands}
                stockStatuses={stockStatuses}
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                onProductTypeChange={handleProductTypeChange}
                onStockStatusChange={handleStockStatusChange}
                onBrandChange={handleBrandChange}
                onBulkAction={handleBulkAction}
                selectedIds={selectedIds}
              />

              <div className="section-divider" />

              <ProductTable
                products={products}
                selectedIds={selectedIds}
                onSelectAll={handleSelectAll}
                onSelectProduct={handleSelectProduct}
                onEdit={handleEdit}
                onView={handleView}
                onDelete={handleDelete}
                onToggleFeatured={handleToggleFeatured}
              />
            </div>

          </main>
        </div>
      </AdminWrapper>
    </>
  );
}