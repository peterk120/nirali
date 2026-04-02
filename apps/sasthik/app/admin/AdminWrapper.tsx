'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, X, Home, Calendar, Package, LifeBuoy, Archive, LogOut, ChevronRight, ShoppingBag, Users, ShieldCheck, Mail, BarChart3, Plus } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';

// ─── Premium Sashti Styles ──────────────────────────────────────────────────
// ... (omitting styles for brevity, but I need to make sure I don't delete them)

// ─── Premium Sashti Styles ──────────────────────────────────────────────────
const wrapperStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700&display=swap');

  :root {
    --brand-teal: #1A7A7A;
    --brand-teal-light: rgba(26, 122, 122, 0.08);
    --brand-rose-gold: #B76E79;
    --brand-rose-gold-light: rgba(183, 110, 121, 0.12);
    --ink: #111110;
    --ink-60: #3d3b39;
    --ink-30: #7a7673;
    --surface: #f5f4f1;
    --white: #ffffff;
    --border: #e0dbd4;
    --sidebar-w: 272px;
  }

  .aw-shell {
    min-height: 100vh;
    background: var(--surface);
    font-family: 'DM Sans', sans-serif;
  }

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
    background: var(--brand-teal);
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
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-30);
  }

  .aw-nav-section {
    padding: 1.5rem 1.5rem 0.5rem;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ink-30);
  }

  .aw-nav {
    flex: 1;
    overflow-y: auto;
    padding: 0 0.75rem;
    padding-bottom: 1rem;
  }

  .aw-nav-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.8rem 1rem;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--ink-60);
    text-decoration: none;
    margin-bottom: 3px;
    transition: background 0.15s, color 0.15s;
    position: relative;
    cursor: pointer;
  }
  .aw-nav-item:hover {
    background: var(--surface);
    color: var(--ink);
  }
  .aw-nav-item.active {
    background: var(--brand-teal-light);
    color: var(--brand-teal);
    font-weight: 700;
  }
  .aw-nav-item.active .aw-nav-icon {
    color: var(--brand-teal);
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
    color: var(--ink-60);
  }

  .aw-nav-item.active::before {
    content: '';
    position: absolute;
    left: -0.75rem;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background: var(--brand-teal);
    border-radius: 0 2px 2px 0;
  }

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
    padding: 0.8rem 1rem;
    border-radius: 10px;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--ink-60);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .aw-logout-btn:hover {
    background: #fef2f2;
    color: #e11d48;
  }

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
  }

  .aw-overlay {
    position: fixed;
    inset: 0;
    z-index: 30;
    background: rgba(15,14,13,0.35);
    backdrop-filter: blur(2px);
  }

  .aw-content {
    margin-left: var(--sidebar-w);
    min-height: 100vh;
    transition: margin-left 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  .aw-loading {
    min-height: 100vh;
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
  }
  .aw-spinner {
    width: 40px; height: 40px;
    border: 2px solid var(--border);
    border-top-color: var(--brand-teal);
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  @media (max-width: 768px) {
    .aw-sidebar { transform: translateX(-100%); }
    .aw-sidebar.open { transform: translateX(0); }
    .aw-content { margin-left: 0; }
  }
  @media (min-width: 769px) {
    .aw-sidebar { transform: translateX(0) !important; }
    .aw-mobile-toggle { display: none; }
  }
`;

export default function AdminWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, user: adminUser, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Wait for the store to hydrate/initialize
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthLoading(false);
      setIsAuthenticated(false);
      router.push('/admin/login');
      return;
    }

    if (isLoggedIn && adminUser) {
      if (adminUser.role !== 'admin' && adminUser.role !== 'sales') {
        router.push('/');
      } else {
        setIsAuthenticated(true);
        setAuthLoading(false);
      }
    } else {
      // If store says not logged in but token exists, it might be hydrating or session expired
      // In a real app, you'd call checkAuth() here, but for now let's set a small timeout or wait for isLoggedIn
      const timer = setTimeout(() => {
         if (!isLoggedIn) {
           setAuthLoading(false);
           setIsAuthenticated(false);
           router.push('/admin/login');
         }
      }, 2000); // Give it 2 seconds to restore session
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, adminUser, router]);

  const allNavItems = [
    { name: 'Dashboard',   href: '/admin/dashboard',   icon: Home,         roles: ['admin', 'sales'] },
    { name: 'Orders',      href: '/admin/orders',      icon: ShoppingBag,  roles: ['admin', 'sales'] },
    { name: 'Products',    href: '/admin/products',    icon: Package,      roles: ['admin', 'sales'] },
    { name: 'Add Product', href: '/admin/products/new', icon: Plus,         roles: ['admin', 'sales'] },
    { name: 'Subscribers', href: '/admin/subscribers', icon: Users,        roles: ['admin'] },
    { name: 'Send Email',  href: '/admin/send-email',  icon: Mail,         roles: ['admin'] },
    { name: 'Analytics',   href: '/admin/analytics',   icon: BarChart3,    roles: ['admin'] },
    { name: 'Manage Staff',href: '/admin/staff',       icon: ShieldCheck,  roles: ['admin'] },
    { name: 'Staff Activity', href: '/admin/activity', icon: Calendar,     roles: ['admin'] },
    { name: 'Bulk Upload', href: '/admin/bulk-upload', icon: Archive,      roles: ['admin', 'sales'] },
    { name: 'Support',     href: '/admin/support',     icon: LifeBuoy,     roles: ['admin'] },
  ];

  const navItems = allNavItems.filter(item => adminUser && item.roles.includes(adminUser.role));

  useEffect(() => {
    if (adminUser && !authLoading && isAuthenticated) {
      const currentPath = pathname;
      const restrictedItem = allNavItems.find(item => currentPath.startsWith(item.href));
      
      if (restrictedItem && !restrictedItem.roles.includes(adminUser.role)) {
        const target = adminUser.role === 'admin' ? '/admin/dashboard' : '/admin/products';
        if (currentPath !== target) {
          router.push(target);
        }
      }
    }
  }, [adminUser, pathname, authLoading, isAuthenticated, router]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (authLoading) {
    return (
      <>
        <style>{wrapperStyles}</style>
        <div className="aw-loading">
          <div className="aw-spinner" />
          <p className="aw-loading-text">Verifying admin access...</p>
        </div>
      </>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <>
      <style>{wrapperStyles}</style>
      <div className="aw-shell">

        <button className="aw-mobile-toggle" onClick={() => setSidebarOpen(v => !v)}>
          {sidebarOpen ? <X size={18} color="var(--ink)" /> : <Menu size={18} color="var(--ink)" />}
        </button>

        <aside className={`aw-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="aw-logo">
            <div className="aw-logo-icon">
              <svg viewBox="0 0 16 16">
                <path d="M8 1 L15 6 L8 15 L1 6 Z" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="aw-logo-text">
              <span className="aw-logo-title">Sashti Admin</span>
              <span className="aw-logo-sub">Jewels Management</span>
            </div>
          </div>

          <div style={{ padding: '0.5rem 0' }}>
            <p className="aw-nav-section">Management</p>
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

          <div className="aw-sidebar-footer">
            <button
              className="aw-logout-btn"
              onClick={() => {
                logout();
                window.location.href = '/admin/login';
              }}
            >
              <LogOut size={18} />
              Sign out
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="aw-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="aw-content">
          {children}
        </div>
      </div>
    </>
  );
}
