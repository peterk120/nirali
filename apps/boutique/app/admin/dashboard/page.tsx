'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../../lib/auth';
import AdminWrapper from '../AdminWrapper';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@nirali-sai/ui';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBookings: 0,
    totalSupportTickets: 0,
    revenue: 0,
    ordersGrowth: 0,
    revenueGrowth: 0
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }

    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin') {
          router.push('/');
        } else {
          try {
            const response = await fetch('/api/admin/dashboard');
            const result = await response.json();
            if (result.success) {
              setStats(result.data.stats);
              setRecentBookings(result.data.recentBookings || []);
              setRecentProducts(result.data.recentProducts || []);
            } else {
              console.error('Failed to fetch dashboard stats:', result.error);
            }
          } catch (error) {
            console.error('Error fetching dashboard stats:', error);
          } finally {
            setLoading(false);
          }
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <AdminWrapper>
        <>
          <style jsx>{`
            @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
            .loader { min-height:100vh; background:#faf8f6; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; }
            .ring { width:40px; height:40px; border:2px solid rgba(192,67,106,0.15); border-top-color:#C0436A; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 14px; }
            .txt { font-size:12px; color:#9a7a7a; letter-spacing:0.08em; text-transform:uppercase; font-weight:300; }
            @keyframes spin { to { transform:rotate(360deg); } }
          `}</style>
          <div className="loader"><div><div className="ring"/><p className="txt">Loading dashboard</p></div></div>
        </>
      </AdminWrapper>
    );
  }

  const statCards = [
    {
      label: 'Total Products',
      value: stats.totalProducts,
      growth: stats.ordersGrowth,
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" style={{width:15,height:15}}>
          <path d="M4 7h12M4 7a2 2 0 01-2-2V4h16v1a2 2 0 01-2 2M4 7v9a2 2 0 002 2h8a2 2 0 002-2V7M8 12h4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      growth: stats.ordersGrowth,
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" style={{width:15,height:15}}>
          <rect x="2" y="4" width="16" height="13" rx="2"/>
          <path d="M2 9h16M7 2v4M13 2v4" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      label: 'Support Tickets',
      value: stats.totalSupportTickets,
      growth: 5,
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" style={{width:15,height:15}}>
          <path d="M10 2C5.58 2 2 5.13 2 9c0 2.3 1.3 4.33 3.33 5.6L5 17l3.12-1.56C8.73 15.81 9.36 16 10 16c4.42 0 8-3.13 8-7s-3.58-7-8-7z" strokeLinejoin="round"/>
          <path d="M10 9v.01M7 9v.01M13 9v.01" strokeLinecap="round" strokeWidth="2"/>
        </svg>
      )
    },
    {
      label: 'Revenue',
      value: null,
      valueFormatted: `₹${stats.revenue.toLocaleString()}`,
      growth: stats.revenueGrowth,
      icon: (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.3" style={{width:15,height:15}}>
          <circle cx="10" cy="10" r="8"/>
          <path d="M10 6v8M7.5 8.5C7.5 7.67 8.67 7 10 7s2.5.67 2.5 1.5S11.33 10 10 10s-2.5.67-2.5 1.5S8.67 13 10 13s2.5-.67 2.5-1.5" strokeLinecap="round"/>
        </svg>
      )
    },
  ];

  const quickActions = [
    { label: 'Manage Products', href: '/admin/products', primary: true },
    { label: 'Manage Bookings', href: '/admin/bookings', primary: false },
    { label: 'Support Tickets', href: '/admin/support', primary: false },
    { label: 'Manage Products', href: '/admin/products', primary: false },
  ];

  return (
    <AdminWrapper>
      <>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
          * { box-sizing: border-box; }

          .adm-root {
            min-height: 100vh;
            background: #faf8f6;
            font-family: 'DM Sans', sans-serif;
            color: #1a1018;
            position: relative;
          }

          .bg-blob {
            position: fixed;
            top: -200px; right: -200px;
            width: 560px; height: 560px;
            background: radial-gradient(circle, rgba(192,67,106,0.05) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
          }

          .adm-inner {
            position: relative; z-index: 1;
            max-width: 1280px;
            margin: 0 auto;
            padding: 48px 28px 80px;
          }

          /* Header */
          .adm-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-bottom: 44px;
            flex-wrap: wrap;
            gap: 16px;
          }

          .adm-eyebrow {
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #C0436A;
            font-weight: 400;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .adm-eyebrow::before {
            content: '';
            display: inline-block;
            width: 18px; height: 1px;
            background: #C0436A;
            opacity: 0.5;
          }

          .adm-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(34px, 4vw, 50px);
            font-weight: 300;
            color: #1a1018;
            margin: 0 0 6px;
            line-height: 1.05;
            letter-spacing: -0.01em;
          }

          .adm-title em { font-style: italic; color: #C0436A; }

          .adm-sub {
            font-size: 13px;
            color: #9a7a7a;
            font-weight: 300;
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0;
          }

          .adm-sub::before {
            content: '';
            display: inline-block;
            width: 22px; height: 1px;
            background: rgba(192,67,106,0.4);
          }

          .logout-btn {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: none;
            border: 1px solid rgba(192,67,106,0.2);
            color: #9a7a7a;
            padding: 9px 18px;
            font-family: 'DM Sans', sans-serif;
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border-radius: 2px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .logout-btn:hover {
            border-color: #C0436A;
            color: #C0436A;
            background: rgba(192,67,106,0.04);
          }

          /* Stats grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
            margin-bottom: 28px;
          }

          @media (max-width: 900px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 520px) { .stats-grid { grid-template-columns: 1fr; } }

          .stat-card {
            background: #fff;
            border: 1px solid rgba(192,67,106,0.08);
            padding: 24px 22px 20px;
            position: relative;
            overflow: hidden;
            transition: border-color 0.2s;
          }

          .stat-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 2px;
            background: linear-gradient(to right, #C0436A, transparent);
            opacity: 0;
            transition: opacity 0.2s;
          }

          .stat-card:hover { border-color: rgba(192,67,106,0.22); }
          .stat-card:hover::before { opacity: 1; }

          .stat-icon {
            width: 32px; height: 32px;
            border: 1px solid rgba(192,67,106,0.18);
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            color: #C0436A;
            margin-bottom: 16px;
          }

          .stat-label {
            font-size: 10px;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            color: #9a7a7a;
            font-weight: 400;
            margin-bottom: 8px;
          }

          .stat-value {
            font-family: 'Cormorant Garamond', serif;
            font-size: 38px;
            font-weight: 300;
            color: #1a1018;
            line-height: 1;
            margin-bottom: 8px;
            letter-spacing: -0.01em;
          }

          .stat-growth {
            font-size: 11px;
            font-weight: 400;
          }

          .stat-growth.up { color: #15803d; }
          .stat-growth.down { color: #dc2626; }
          .stat-growth.flat { color: #9a7a7a; }

          /* Section label */
          .section-label {
            font-size: 10px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #9a7a7a;
            font-weight: 400;
            margin-bottom: 12px;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(192,67,106,0.08);
          }

          /* Quick actions */
          .actions-row {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 2px;
            margin-bottom: 28px;
          }

          @media (max-width: 700px) { .actions-row { grid-template-columns: repeat(2, 1fr); } }

          .action-tile {
            background: #fff;
            border: 1px solid rgba(192,67,106,0.08);
            padding: 18px 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            transition: all 0.18s;
          }

          .action-tile:hover {
            border-color: rgba(192,67,106,0.22);
            background: #fdf7f5;
          }

          .action-tile.primary {
            border-color: rgba(192,67,106,0.25);
            background: #fdf2f5;
          }

          .action-tile.primary:hover {
            border-color: rgba(192,67,106,0.5);
            background: rgba(192,67,106,0.07);
          }

          .tile-label {
            font-size: 13px;
            font-weight: 400;
            color: #3d2830;
          }

          .action-tile.primary .tile-label { color: #C0436A; font-weight: 500; }

          .tile-arrow {
            color: #ddd0cc;
            flex-shrink: 0;
            transition: transform 0.15s, color 0.15s;
          }

          .action-tile:hover .tile-arrow { transform: translateX(3px); color: #C0436A; }

          /* Two col activity */
          .two-col {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2px;
          }

          @media (max-width: 760px) { .two-col { grid-template-columns: 1fr; } }

          .activity-panel {
            background: #fff;
            border: 1px solid rgba(192,67,106,0.08);
            padding: 24px;
          }

          .activity-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 12px 0;
            border-bottom: 1px solid #f7f3f0;
            gap: 12px;
          }

          .activity-row:last-child { border-bottom: none; }

          .act-name {
            font-size: 13px;
            color: #3d2830;
            font-weight: 400;
            margin-bottom: 3px;
          }

          .act-sub {
            font-size: 11px;
            color: #9a7a7a;
            font-weight: 300;
          }

          .act-amount {
            font-family: 'Cormorant Garamond', serif;
            font-size: 18px;
            font-weight: 400;
            color: #1a1018;
            text-align: right;
            white-space: nowrap;
          }

          .act-date {
            font-size: 11px;
            color: #b09898;
            text-align: right;
            margin-top: 2px;
          }

          .stock-badge {
            display: inline-block;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            padding: 2px 8px;
            border-radius: 20px;
          }

          .badge-active { background: #f0fdf4; color: #15803d; border: 1px solid rgba(21,128,61,0.18); }
          .badge-inactive { background: #fffbeb; color: #b45309; border: 1px solid rgba(180,83,9,0.18); }

          .empty-row {
            text-align: center;
            padding: 28px 16px;
            font-size: 13px;
            color: #c4adad;
            font-weight: 300;
          }

          @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
          .fu { animation: fadeUp 0.42s ease both; }
          .d1 { animation-delay: 0.06s; }
          .d2 { animation-delay: 0.12s; }
          .d3 { animation-delay: 0.18s; }
        `}</style>

        <div className="adm-root">
          <div className="bg-blob" />

          <div className="adm-inner">

            {/* Header */}
            <div className="adm-header fu">
              <div>
                <p className="adm-eyebrow">Admin Panel</p>
                <h1 className="adm-title">Dashboard <em>overview</em></h1>
                <p className="adm-sub">Welcome to the admin dashboard</p>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:12,height:12}}>
                  <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3M10 11l3-3-3-3M13 8H6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Logout
              </button>
            </div>

            {/* Stats */}
            <div className="stats-grid fu d1">
              {statCards.map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <p className="stat-label">{s.label}</p>
                  <p className="stat-value">{s.valueFormatted ?? s.value}</p>
                  <p className={`stat-growth ${s.growth > 0 ? 'up' : s.growth < 0 ? 'down' : 'flat'}`}>
                    {s.growth > 0 ? '↑' : s.growth < 0 ? '↓' : '—'} {Math.abs(s.growth)}% vs last month
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="fu d2">
              <p className="section-label">Quick Actions</p>
              <div className="actions-row">
                {quickActions.map((a, i) => (
                  <div
                    key={i}
                    className={`action-tile ${a.primary ? 'primary' : ''}`}
                    onClick={() => router.push(a.href as any)}
                  >
                    <span className="tile-label">{a.label}</span>
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="tile-arrow" style={{width:13,height:13}}>
                      <path d="M2 7h10M8 3l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="two-col fu d3">

              {/* Bookings */}
              <div className="activity-panel">
                <p className="section-label">Recent Bookings</p>
                {recentBookings.length > 0 ? recentBookings.map((order) => (
                  <div key={order.id} className="activity-row">
                    <div>
                      <p className="act-name">{order.orderId || `Booking #${order.id?.substring(0, 6)}`}</p>
                      <p className="act-sub">{order.customer}</p>
                    </div>
                    <div>
                      <p className="act-amount">₹{order.amount?.toLocaleString()}</p>
                      <p className="act-date">{order.date}</p>
                    </div>
                  </div>
                )) : <p className="empty-row">No recent bookings</p>}
              </div>

              {/* Products */}
              <div className="activity-panel">
                <p className="section-label">Recent Products</p>
                {recentProducts.length > 0 ? recentProducts.map((product) => (
                  <div key={product.id} className="activity-row">
                    <div>
                      <p className="act-name">{product.name}</p>
                      <p className="act-sub">₹{product.price?.toLocaleString()}/day · Stock: {product.stock}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <span className={`stock-badge ${product.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                        {product.status}
                      </span>
                    </div>
                  </div>
                )) : <p className="empty-row">No recent products</p>}
              </div>

            </div>
          </div>
        </div>
      </>
    </AdminWrapper>
  );
}