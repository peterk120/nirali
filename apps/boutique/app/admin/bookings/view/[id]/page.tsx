'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { verifyToken } from '../../../../../lib/auth';
import AdminWrapper from '../../../AdminWrapper';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, Package, CheckCircle, Truck } from 'lucide-react';

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string; Icon: React.ElementType }> = {
    Completed: { bg: '#F0FAF4', color: '#1A6B3C', Icon: CheckCircle },
    Delivered: { bg: '#F0FAF4', color: '#1A6B3C', Icon: CheckCircle },
    Pending:   { bg: '#FFF8F8', color: '#A0525E', Icon: Clock       },
    Shipped:   { bg: '#F0F4FF', color: '#1A3A8F', Icon: Truck       },
    Confirmed: { bg: '#F5E6E8', color: '#6B1F2A', Icon: Package     },
  };
  const s = map[status] || { bg: '#F5F5F5', color: '#555', Icon: Package };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '6px 16px', background: s.bg, color: s.color,
      fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
      fontFamily: "'Jost', sans-serif", fontWeight: 500,
    }}>
      <s.Icon size={12} /> {status}
    </span>
  );
}

// ─── Info field ───────────────────────────────────────────────────────────────
function InfoField({ label, value, Icon }: { label: string; value: React.ReactNode; Icon?: React.ElementType }) {
  return (
    <div style={{ padding: '16px 0', borderBottom: '1px solid #F5E6E8' }}>
      <span style={{ display: 'block', fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C96E82', marginBottom: 6, fontFamily: "'Jost', sans-serif" }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        {Icon && <Icon size={13} style={{ color: '#D4A0A8', marginTop: 2, flexShrink: 0 }} />}
        <span style={{ fontSize: 14, color: '#6B1F2A', fontFamily: "'Jost', sans-serif", lineHeight: 1.5 }}>{value}</span>
      </div>
    </div>
  );
}

// ─── Section card ─────────────────────────────────────────────────────────────
function Section({ title, children, accent = false }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #F5E6E8', overflow: 'hidden' }}>
      <div style={{
        padding: '16px 28px',
        borderBottom: '1px solid #F5E6E8',
        background: accent ? '#6B1F2A' : 'transparent',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{
          fontSize: 10, letterSpacing: '0.28em', textTransform: 'uppercase',
          fontFamily: "'Jost', sans-serif", fontWeight: 500,
          color: accent ? 'rgba(240,196,204,0.7)' : '#A0525E',
        }}>{title}</span>
      </div>
      <div style={{ padding: '24px 28px' }}>{children}</div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ViewBookingPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/login'); return; }
    verifyToken(token)
      .then(p => { if (p.role !== 'admin') router.push('/'); })
      .catch(() => router.push('/login'));
  }, [router]);

  const order = {
    id: orderId,
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 9876543210',
      address: '123 Main Street, Mumbai, Maharashtra',
    },
    items: [
      { id: 1, name: 'Classic Lehenga',  price: 5000, qty: 1, total: 5000  },
      { id: 2, name: 'Designer Blouse',  price: 2000, qty: 1, total: 2000  },
      { id: 3, name: 'Jewellery Set',    price: 3500, qty: 1, total: 3500  },
    ],
    date: '2026-02-20',
    status: 'Completed',
    totalAmount: 10500,
    rentalPeriod: '3 days',
    deliveryDate: '2026-02-22',
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <AdminWrapper>
      <div style={{ minHeight: '100vh', background: '#FFF8F8', fontFamily: "'Jost', sans-serif" }}>
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 48px 80px' }}>

          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 40 }}>
            <div>
              <button
                onClick={() => router.back()}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none',
                  fontFamily: "'Jost', sans-serif",
                  fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: '#A0525E', cursor: 'pointer', padding: 0, marginBottom: 16,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#6B1F2A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#A0525E')}
              >
                <ArrowLeft size={12} /> Back to Bookings
              </button>
              <p style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#C96E82', marginBottom: 8 }}>
                Booking #{order.id}
              </p>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, color: '#6B1F2A', margin: 0 }}>
                Booking <em style={{ fontStyle: 'italic' }}>Details</em>
              </h1>
              <div style={{ width: 32, height: 1, background: '#C96E82', marginTop: 12 }} />
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Content grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 2, alignItems: 'start' }}>

            {/* Left — Items table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Section title="Rental Items">
                {/* Table header */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 80px 1fr', gap: 0, marginBottom: 0 }}>
                  {['Item', 'Price / Day', 'Qty', 'Total'].map((h, i) => (
                    <div key={h} style={{
                      padding: '10px 0',
                      fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
                      color: '#C96E82', borderBottom: '1px solid #F5E6E8',
                      textAlign: i > 1 ? 'right' : 'left',
                    }}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                {order.items.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr 1fr 80px 1fr',
                      padding: '16px 0',
                      borderBottom: idx < order.items.length - 1 ? '1px solid #F5E6E8' : 'none',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ fontSize: 14, color: '#6B1F2A' }}>{item.name}</span>
                    <span style={{ fontSize: 13, color: '#A0525E' }}>₹{item.price.toLocaleString()}</span>
                    <span style={{ fontSize: 13, color: '#A0525E', textAlign: 'right' }}>{item.qty}</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 300, color: '#6B1F2A', textAlign: 'right' }}>
                      ₹{item.total.toLocaleString()}
                    </span>
                  </div>
                ))}

                {/* Subtotal row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid #F0C4CC' }}>
                  <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A0525E' }}>Total Amount</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 300, color: '#6B1F2A' }}>
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </Section>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 8, padding: '20px 28px', background: '#fff', border: '1px solid #F5E6E8' }}>
                <button
                  style={{
                    padding: '11px 28px',
                    background: '#6B1F2A', color: '#FFF8F8',
                    border: 'none', fontFamily: "'Jost', sans-serif",
                    fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#A0525E')}
                  onMouseLeave={e => (e.currentTarget.style.background = '#6B1F2A')}
                >
                  Update Status
                </button>
                <button
                  style={{
                    padding: '11px 28px',
                    background: 'transparent', color: '#6B1F2A',
                    border: '1px solid #F0C4CC', fontFamily: "'Jost', sans-serif",
                    fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget).style.borderColor = '#6B1F2A'; }}
                  onMouseLeave={e => { (e.currentTarget).style.borderColor = '#F0C4CC'; }}
                >
                  Print Details
                </button>
              </div>
            </div>

            {/* Right — Info panels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

              {/* Booking info */}
              <Section title="Booking Info" accent>
                <div>
                  <InfoField label="Booking ID"     value={`#${order.id}`}          />
                  <InfoField label="Booking Date"   value={fmt(order.date)}  Icon={Calendar} />
                  <InfoField label="Rental Period"  value={order.rentalPeriod} Icon={Clock} />
                  <InfoField label="Delivery Date"  value={fmt(order.deliveryDate)} Icon={Calendar} />
                  <InfoField label="Status"         value={<StatusBadge status={order.status} />} />
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #F5E6E8' }}>
                    <span style={{ fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: '#C96E82', display: 'block', marginBottom: 6 }}>Total Amount</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 300, color: '#6B1F2A' }}>
                      ₹{order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Section>

              {/* Customer info */}
              <Section title="Customer">
                <div>
                  <InfoField label="Name"    value={order.customer.name}    Icon={User}    />
                  <InfoField label="Email"   value={order.customer.email}   Icon={Mail}    />
                  <InfoField label="Phone"   value={order.customer.phone}   Icon={Phone}   />
                  <InfoField label="Address" value={order.customer.address} Icon={MapPin}  />
                </div>
              </Section>

            </div>
          </div>
        </main>
      </div>
    </AdminWrapper>
  );
}