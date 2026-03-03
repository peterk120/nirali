'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { verifyToken } from '../../lib/auth';
import Link from 'next/link';
import { Menu, X, Home, Calendar, Package, LifeBuoy, Archive, LogOut, ChevronRight } from 'lucide-react';

// ─── Premium styles ────────────────────────────────────────────────────────
const wrapperStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

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
    --sidebar-w: 260px;
  }

  /* ── Layout shell ── */
  .aw-shell {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Sidebar ── */
  .aw-sidebar {
    position: fixed;
    inset-y: 0;
    left: 0;
    z-index: 40;
    width: var(--sidebar-w);
    background: var(--white);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    transform: translateX(0);
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }
  .aw-sidebar.closed { transform: translateX(-100%); }

  /* Logo area */
  .aw-logo {
    padding: 0 1.5rem;
    height: 68px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border);
    gap: 0.6rem;
    flex-shrink: 0;
  }
  .aw-logo-icon {
    width: 32px;
    height: 32px;
    background: var(--brand-rose);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .aw-logo-icon svg {
    width: 16px; height: 16px; fill: none;
    stroke: #fff; stroke-width: 2;
  }
  .aw-logo-text {
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }
  .aw-logo-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.01em;
  }
  .aw-logo-sub {
    font-size: 0.62rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-30);
  }

  /* Nav section label */
  .aw-nav-section {
    padding: 1.5rem 1.5rem 0.5rem;
    font-size: 0.62rem;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-30);
  }

  /* Nav */
  .aw-nav {
    flex: 1;
    overflow-y: auto;
    padding: 0 0.75rem;
    padding-bottom: 1rem;
  }
  .aw-nav::-webkit-scrollbar { width: 0; }

  .aw-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--ink-60);
    text-decoration: none;
    margin-bottom: 2px;
    transition: background 0.15s, color 0.15s;
    position: relative;
    cursor: pointer;
  }
  .aw-nav-item:hover {
    background: var(--surface);
    color: var(--ink);
  }
  .aw-nav-item.active {
    background: var(--brand-rose-light);
    color: var(--brand-rose);
    font-weight: 600;
  }
  .aw-nav-item.active .aw-nav-icon {
    color: var(--brand-rose);
  }
  .aw-nav-item .aw-nav-chevron {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.15s;
  }
  .aw-nav-item:hover .aw-nav-chevron,
  .aw-nav-item.active .aw-nav-chevron {
    opacity: 1;
  }
  .aw-nav-icon {
    width: 18px; height: 18px;
    flex-shrink: 0;
    color: var(--ink-30);
    transition: color 0.15s;
  }
  .aw-nav-item:hover .aw-nav-icon { color: var(--ink-60); }

  /* Active indicator bar */
  .aw-nav-item.active::before {
    content: '';
    position: absolute;
    left: -0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: var(--brand-rose);
    border-radius: 0 2px 2px 0;
  }

  /* Sidebar footer */
  .aw-sidebar-footer {
    padding: 1rem 0.75rem;
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  .aw-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.7rem 0.85rem;
    border-radius: 10px;
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--ink-60);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .aw-logout-btn:hover {
    background: #fef2f2;
    color: var(--brand-rose);
  }
  .aw-logout-btn:hover svg { color: var(--brand-rose); }

  /* ── Mobile toggle ── */
  .aw-mobile-toggle {
    position: fixed;
    top: 1rem;
    left: 1rem;
    z-index: 50;
    width: 40px;
    height: 40px;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(15,14,13,0.08);
    transition: box-shadow 0.15s;
  }
  .aw-mobile-toggle:hover { box-shadow: 0 4px 12px rgba(15,14,13,0.12); }

  /* ── Overlay ── */
  .aw-overlay {
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgba(15,14,13,0.35);
    backdrop-filter: blur(2px);
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

  /* ── Main content ── */
  .aw-content {
    margin-left: var(--sidebar-w);
    min-height: 100vh;
    transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  /* ── Loading ── */
  .aw-loading {
    min-height: 100vh;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
    font-family: 'DM Sans', sans-serif;
  }
  .aw-spinner {
    width: 40px; height: 40px;
    border: 2px solid var(--border);
    border-top-color: var(--brand-rose);
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .aw-loading-text {
    font-size: 0.75rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-30);
  }

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .aw-sidebar { transform: translateX(-100%); }
    .aw-sidebar.open { transform: translateX(0); }
    .aw-content { margin-left: 0; }
    .aw-mobile-toggle { display: flex; }
  }
  @media (min-width: 769px) {
    .aw-sidebar { transform: translateX(0) !important; }
    .aw-mobile-toggle { display: none; }
  }
`;

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      setIsAuthenticated(false);
      router.push('/login');
      return;
    }
    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin') {
          setAuthLoading(false);
          setIsAuthenticated(false);
          router.push('/');
        } else {
          setAuthLoading(false);
          setIsAuthenticated(true);
        }
      } catch {
        setAuthLoading(false);
        setIsAuthenticated(false);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const navItems = [
    { name: 'Dashboard',   href: '/admin/dashboard',   icon: Home },
    { name: 'Bookings',    href: '/admin/bookings',    icon: Calendar },
    { name: 'Products',    href: '/admin/products',    icon: Package },
    { name: 'Bulk Upload', href: '/admin/bulk-upload', icon: Archive },
    { name: 'Support',     href: '/admin/support',     icon: LifeBuoy },
  ];

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (authLoading) {
    return (
      <>
        <style>{wrapperStyles}</style>
        <div className="aw-loading">
          <div className="aw-spinner" />
          <p className="aw-loading-text">Verifying authentication</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{wrapperStyles}</style>
      <div className="aw-shell">

        {/* Mobile toggle */}
        <button className="aw-mobile-toggle" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle menu">
          {sidebarOpen ? <X size={18} color="var(--ink)" /> : <Menu size={18} color="var(--ink)" />}
        </button>

        {/* Sidebar */}
        <aside className={`aw-sidebar${sidebarOpen ? ' open' : ''}`}>

          {/* Logo */}
          <div className="aw-logo">
            <div className="aw-logo-icon">
              {/* Diamond SVG mark */}
              <svg viewBox="0 0 16 16">
                <path d="M8 1 L15 6 L8 15 L1 6 Z" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="aw-logo-text">
              <span className="aw-logo-title">Admin Panel</span>
              <span className="aw-logo-sub">Management Console</span>
            </div>
          </div>

          {/* Nav */}
          <div style={{ padding: '0.5rem 0' }}>
            <p className="aw-nav-section">Navigation</p>
          </div>
          <nav className="aw-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={`aw-nav-item${isActive ? ' active' : ''}`}
                >
                  <Icon className="aw-nav-icon" size={18} />
                  {item.name}
                  <ChevronRight className="aw-nav-chevron" size={14} />
                </Link>
              );
            })}
          </nav>

          {/* Footer / logout */}
          <div className="aw-sidebar-footer">
            <button
              className="aw-logout-btn"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                router.push('/');
              }}
            >
              <LogOut size={18} style={{ color: 'var(--ink-30)', flexShrink: 0 }} />
              Sign out
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="aw-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className="aw-content">
          {children}
        </div>

      </div>
    </>
  );
}