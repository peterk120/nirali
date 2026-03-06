'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../../lib/auth';
import AdminWrapper from '../AdminWrapper';
import { LogOut, Eye, RefreshCw, Package, Clock, CheckCircle, Truck, Search, SlidersHorizontal } from 'lucide-react';

interface Order {
  id: string;
  orderId: string;
  customer: string;
  date: string;
  amount: number;
  status: string;
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --rose-deep:   #6B1F2A;
    --rose-mid:    #A0525E;
    --rose-light:  #C96E82;
    --rose-pale:   #F0C4CC;
    --rose-bg:     #FFF8F8;
    --rose-card:   #F5E6E8;
    --white:       #ffffff;
    --ink:         #1a0a0d;
    --border:      #F0DADE;
    --gold:        #C9A84C;
  }

  /* ── Page ── */
  .ob-page {
    min-height: 100vh;
    background: var(--rose-bg);
    font-family: 'DM Sans', sans-serif;
    position: relative;
  }
  /* Subtle diagonal rule background */
  .ob-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 48px,
      rgba(201,110,130,0.025) 48px,
      rgba(201,110,130,0.025) 49px
    );
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  .ob-header {
    position: relative;
    z-index: 2;
    background: var(--rose-deep);
    border-bottom: 1px solid rgba(240,196,204,0.15);
  }
  .ob-header-inner {
    max-width: 1340px;
    margin: 0 auto;
    padding: 0 2.5rem;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ob-header-brand {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
  }
  .ob-header-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem;
    font-weight: 300;
    color: var(--rose-bg);
    letter-spacing: 0.04em;
  }
  .ob-header-role {
    font-size: 0.6rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: rgba(240,196,204,0.4);
  }
  .ob-header-right {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }
  .ob-header-user {
    font-size: 0.7rem;
    letter-spacing: 0.1em;
    color: rgba(240,196,204,0.45);
    text-transform: uppercase;
  }
  .ob-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 1rem;
    border: 1px solid rgba(240,196,204,0.2);
    background: transparent;
    color: rgba(240,196,204,0.6);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    transition: border-color 0.2s, color 0.2s, background 0.2s;
  }
  .ob-logout-btn:hover {
    border-color: var(--rose-pale);
    color: var(--rose-bg);
    background: rgba(240,196,204,0.08);
  }

  /* ── Main ── */
  .ob-main {
    position: relative;
    z-index: 1;
    max-width: 1340px;
    margin: 0 auto;
    padding: 3.5rem 2.5rem 6rem;
  }

  /* ── Page title ── */
  .ob-title-block {
    margin-bottom: 3rem;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
  }
  .ob-title-eyebrow {
    font-size: 0.62rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: var(--rose-light);
    margin-bottom: 0.6rem;
  }
  .ob-title-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.75rem;
    font-weight: 300;
    color: var(--rose-deep);
    margin: 0;
    line-height: 1;
  }
  .ob-title-rule {
    width: 36px;
    height: 1px;
    background: linear-gradient(90deg, var(--rose-light), transparent);
    margin-top: 0.9rem;
  }
  .ob-title-meta {
    font-size: 0.75rem;
    color: var(--rose-mid);
    letter-spacing: 0.04em;
  }

  /* ── Stats ── */
  .ob-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    margin-bottom: 2.5rem;
    overflow: hidden;
    border-radius: 12px;
  }
  .ob-stat {
    background: var(--white);
    padding: 1.5rem 1.75rem;
    position: relative;
    transition: background 0.2s;
  }
  .ob-stat:first-child {
    background: var(--rose-deep);
  }
  .ob-stat:hover:not(:first-child) {
    background: #fffafa;
  }
  .ob-stat-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.6rem;
    font-weight: 300;
    line-height: 1;
    margin-bottom: 0.3rem;
  }
  .ob-stat-label {
    font-size: 0.62rem;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    margin-top: 0.25rem;
  }
  .ob-stat:first-child .ob-stat-value { color: var(--rose-bg); }
  .ob-stat:first-child .ob-stat-label { color: rgba(240,196,204,0.45); }

  /* ── Toolbar ── */
  .ob-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0;
    padding: 1.1rem 1.5rem;
    background: var(--white);
    border: 1px solid var(--border);
    border-bottom: none;
    border-radius: 12px 12px 0 0;
    flex-wrap: wrap;
  }
  .ob-search-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--rose-bg);
    border: 1px solid var(--border);
    border-radius: 7px;
    padding: 0.45rem 0.85rem;
    min-width: 220px;
  }
  .ob-search-wrap input {
    border: none;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    color: var(--rose-deep);
    outline: none;
    width: 100%;
  }
  .ob-search-wrap input::placeholder { color: var(--rose-pale); }
  .ob-toolbar-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .ob-filter-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    letter-spacing: 0.1em;
    color: var(--rose-mid);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    text-transform: uppercase;
  }
  .ob-filter-btn:hover { border-color: var(--rose-pale); color: var(--rose-deep); }
  .ob-count-badge {
    font-size: 0.7rem;
    color: var(--rose-mid);
    letter-spacing: 0.06em;
  }

  /* ── Table card ── */
  .ob-table-card {
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 0 0 12px 12px;
    overflow: hidden;
  }

  /* ── Table header ── */
  .ob-thead {
    display: grid;
    grid-template-columns: 1.2fr 1.6fr 1fr 1fr 1.3fr 1.4fr;
    padding: 0 1.5rem;
    background: #fdf6f7;
    border-bottom: 1px solid var(--border);
  }
  .ob-th {
    padding: 0.85rem 0;
    font-size: 0.62rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--rose-light);
    font-weight: 600;
  }
  .ob-th:last-child { text-align: right; }

  /* ── Table rows ── */
  .ob-row {
    display: grid;
    grid-template-columns: 1.2fr 1.6fr 1fr 1fr 1.3fr 1.4fr;
    padding: 0 1.5rem;
    border-bottom: 1px solid var(--border);
    align-items: center;
    transition: background 0.15s;
    cursor: default;
  }
  .ob-row:last-child { border-bottom: none; }
  .ob-row:hover { background: #fffafa; }

  .ob-cell {
    padding: 1.2rem 0;
  }
  .ob-cell-id {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--rose-deep);
    letter-spacing: 0.08em;
    font-family: 'DM Sans', sans-serif;
  }
  .ob-cell-id::before {
    content: '#';
    opacity: 0.35;
    font-weight: 400;
  }
  .ob-cell-customer {
    font-size: 0.85rem;
    color: var(--rose-deep);
    font-weight: 400;
  }
  .ob-cell-date {
    font-size: 0.78rem;
    color: var(--rose-mid);
    letter-spacing: 0.03em;
  }
  .ob-cell-amount {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem;
    font-weight: 300;
    color: var(--rose-deep);
  }
  .ob-cell-amount-curr {
    font-size: 0.7rem;
    vertical-align: super;
    margin-right: 1px;
    color: var(--rose-mid);
  }
  .ob-cell-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  /* ── Status badge ── */
  .ob-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    font-size: 0.6rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    font-weight: 600;
    border-radius: 4px;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Action buttons ── */
  .ob-btn-view {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.45rem 0.9rem;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: transparent;
    color: var(--rose-deep);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
  }
  .ob-btn-view:hover {
    border-color: var(--rose-deep);
    background: var(--rose-bg);
  }
  .ob-btn-update {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.45rem 0.9rem;
    border: none;
    border-radius: 6px;
    background: var(--rose-deep);
    color: var(--rose-bg);
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.2s;
  }
  .ob-btn-update:hover { background: var(--rose-mid); }

  /* ── Empty state ── */
  .ob-empty {
    padding: 5rem 2rem;
    text-align: center;
  }
  .ob-empty-icon {
    width: 56px;
    height: 56px;
    background: var(--rose-card);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.25rem;
  }
  .ob-empty-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem;
    font-weight: 300;
    color: var(--rose-deep);
    margin: 0 0 0.4rem;
  }
  .ob-empty-sub {
    font-size: 0.8rem;
    color: var(--rose-mid);
  }

  /* ── Footer note ── */
  .ob-footer-note {
    margin-top: 1.25rem;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
  }
  .ob-footer-text {
    font-size: 0.7rem;
    color: var(--rose-pale);
    letter-spacing: 0.08em;
  }
  .ob-footer-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--rose-pale);
  }

  /* ── Loading ── */
  .ob-loading {
    min-height: 100vh;
    background: var(--rose-bg);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1.25rem;
    font-family: 'DM Sans', sans-serif;
  }
  .ob-spinner {
    width: 36px; height: 36px;
    border: 1px solid var(--border);
    border-top-color: var(--rose-deep);
    border-radius: 50%;
    animation: obspin 0.75s linear infinite;
  }
  @keyframes obspin { to { transform: rotate(360deg); } }
  .ob-loading-text {
    font-size: 0.65rem;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: var(--rose-light);
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .ob-stats { grid-template-columns: repeat(2, 1fr); }
    .ob-thead, .ob-row { grid-template-columns: 1.2fr 1.5fr 1fr 1.2fr 1.4fr; }
    .ob-th:nth-child(3), .ob-cell:nth-child(3) { display: none; }
  }
  @media (max-width: 640px) {
    .ob-main { padding: 2rem 1rem 4rem; }
    .ob-stats { grid-template-columns: 1fr 1fr; }
    .ob-title-h1 { font-size: 2rem; }
  }
`;

// ─── Status badge ──────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; Icon: React.ElementType }> = {
    Completed: { bg: '#F0FAF4', color: '#1A6B3C', Icon: CheckCircle },
    Delivered: { bg: '#F0FAF4', color: '#1A6B3C', Icon: CheckCircle },
    Pending:   { bg: '#FFF8F8', color: '#A0525E', Icon: Clock       },
    Shipped:   { bg: '#F0F4FF', color: '#1A3A8F', Icon: Truck       },
    Confirmed: { bg: '#F5E6E8', color: '#6B1F2A', Icon: Package     },
  };
  const s = map[status] || { bg: '#F5F5F5', color: '#555', Icon: Package };
  const { bg, color, Icon } = s;
  return (
    <span className="ob-badge" style={{ background: bg, color }}>
      <Icon size={9} /> {status}
    </span>
  );
}

// ─── Loading screen ────────────────────────────────────────────────────────
function LoadingScreen({ message }: { message: string }) {
  return (
    <>
      <style>{styles}</style>
      <div className="ob-loading">
        <div className="ob-spinner" />
        <p className="ob-loading-text">{message}</p>
      </div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setAuthLoading(false); router.push('/login'); return; }

    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin') { setAuthLoading(false); router.push('/'); return; }
        setIsAuthenticated(true);
        setAuthLoading(false);
        try {
          const token = localStorage.getItem('token');
          const res = await fetch('/api/orders', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const result = await res.json();
          if (result.success) {
            setOrders(result.data.map((o: any) => ({
              id: o._id || o.id,
              orderId: o.orderId || `ORD-${(o._id || '').substring(0, 6)}`,
              customer: o.customerName || o.email || 'N/A',
              date: new Date(o.createdAt || o.updatedAt || Date.now()).toISOString().split('T')[0],
              amount: o.totalAmount || o.amount || 0,
              status: o.status || 'Pending',
            })));
          }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
      } catch { setAuthLoading(false); router.push('/login'); }
    };
    checkAuth();
  }, [router]);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Pending' ? 'Confirmed' : 'Pending';
      const token = localStorage.getItem('token');
      
      // Call API to update status in database
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      
      const result = await res.json();
      
      if (result.success) {
        // Update local state after successful API call
        setOrders(prev => prev.map(o => 
          o.id === id ? { ...o, status: newStatus } : o
        ));
        alert(`Order ${newStatus.toLowerCase()} successfully!`);
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating order status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (authLoading) return <LoadingScreen message="Verifying authentication" />;
  if (!isAuthenticated) return null;
  if (loading) return <AdminWrapper><LoadingScreen message="Loading bookings" /></AdminWrapper>;

  const stats = [
    { label: 'Total Bookings', value: orders.length,                                                                   color: '#FFF8F8', labelColor: 'rgba(240,196,204,0.45)' },
    { label: 'Pending',        value: orders.filter(o => o.status === 'Pending').length,                               color: '#A0525E', labelColor: '#C96E82' },
    { label: 'Confirmed',      value: orders.filter(o => o.status === 'Confirmed' || o.status === 'Shipped').length,   color: '#1A3A8F', labelColor: '#6B80C4' },
    { label: 'Completed',      value: orders.filter(o => o.status === 'Completed' || o.status === 'Delivered').length, color: '#1A6B3C', labelColor: '#4A9E6A' },
  ];

  const filtered = search
    ? orders.filter(o =>
        o.customer.toLowerCase().includes(search.toLowerCase()) ||
        o.orderId.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <>
      <style>{styles}</style>
      <AdminWrapper>
        <div className="ob-page">

          {/* Header */}
          <header className="ob-header">
            <div className="ob-header-inner">
              <div className="ob-header-brand">
                <span className="ob-header-name">Nirali Sai</span>
                <span className="ob-header-role">Admin</span>
              </div>
              <div className="ob-header-right">
                <span className="ob-header-user">Admin User</span>
                <button className="ob-logout-btn" onClick={handleLogout}>
                  <LogOut size={11} /> Logout
                </button>
              </div>
            </div>
          </header>

          <main className="ob-main">

            {/* Page title */}
            <div className="ob-title-block">
              <div>
                <p className="ob-title-eyebrow">Management</p>
                <h1 className="ob-title-h1">Manage <em>Bookings</em></h1>
                <div className="ob-title-rule" />
              </div>
              <span className="ob-title-meta">{orders.length} total booking{orders.length !== 1 ? 's' : ''}</span>
            </div>

            {/* Stats */}
            <div className="ob-stats">
              {stats.map((s, i) => (
                <div key={i} className="ob-stat" style={{ background: i === 0 ? 'var(--rose-deep)' : 'var(--white)' }}>
                  <div className="ob-stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="ob-stat-label" style={{ color: s.labelColor }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Toolbar */}
            <div className="ob-toolbar">
              <div className="ob-search-wrap">
                <Search size={13} color="var(--rose-pale)" />
                <input
                  type="text"
                  placeholder="Search by customer or booking ID…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="ob-toolbar-right">
                <span className="ob-count-badge">{filtered.length} results</span>
                <button className="ob-filter-btn">
                  <SlidersHorizontal size={12} /> Filter
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="ob-table-card">
              <div className="ob-thead">
                {['Booking ID', 'Customer', 'Date', 'Amount', 'Status', 'Actions'].map((h, i) => (
                  <div key={h} className="ob-th" style={{ textAlign: i === 5 ? 'right' : 'left' }}>{h}</div>
                ))}
              </div>

              {filtered.length === 0 ? (
                <div className="ob-empty">
                  <div className="ob-empty-icon">
                    <Package size={24} color="var(--rose-pale)" />
                  </div>
                  <p className="ob-empty-title">No bookings found</p>
                  <p className="ob-empty-sub">
                    {search ? 'Try a different search term' : 'Orders will appear here once customers make bookings'}
                  </p>
                </div>
              ) : (
                filtered.map((order) => (
                  <div key={order.id} className="ob-row">
                    <div className="ob-cell">
                      <span className="ob-cell-id">{order.orderId}</span>
                    </div>
                    <div className="ob-cell">
                      <span className="ob-cell-customer">{order.customer}</span>
                    </div>
                    <div className="ob-cell">
                      <span className="ob-cell-date">
                        {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="ob-cell">
                      <span className="ob-cell-amount">
                        <span className="ob-cell-amount-curr">₹</span>
                        {order.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="ob-cell">
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="ob-cell ob-cell-actions">
                      <button
                        className="ob-btn-view"
                        onClick={() => router.push(`/admin/bookings/view/${order.id}`)}
                      >
                        <Eye size={11} /> View
                      </button>
                      <button
                        className="ob-btn-update"
                        onClick={() => handleUpdateStatus(order.id, order.status)}
                      >
                        <RefreshCw size={11} />
                        {order.status === 'Pending' ? 'Confirm' : 'Update'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer note */}
            {filtered.length > 0 && (
              <div className="ob-footer-note">
                <span className="ob-footer-text">Showing {filtered.length} of {orders.length} bookings</span>
                <span className="ob-footer-dot" />
                <span className="ob-footer-text">Last updated just now</span>
              </div>
            )}

          </main>
        </div>
      </AdminWrapper>
    </>
  );
}