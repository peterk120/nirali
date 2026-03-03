'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../../lib/auth';
import AdminWrapper from '../AdminWrapper';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@nirali-sai/ui';

const mockTickets = [
  { id: 1, subject: 'Product Inquiry', customer: 'John Doe', date: '2026-02-20', priority: 'Medium', status: 'Open' },
  { id: 2, subject: 'Booking Issue', customer: 'Jane Smith', date: '2026-02-21', priority: 'High', status: 'In Progress' },
  { id: 3, subject: 'Payment Problem', customer: 'Robert Johnson', date: '2026-02-22', priority: 'High', status: 'Resolved' },
  { id: 4, subject: 'Delivery Delay', customer: 'Emily Davis', date: '2026-02-23', priority: 'Low', status: 'Open' },
];

export default function AdminSupportPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setAuthLoading(false); setIsAuthenticated(false); router.push('/login'); return; }

    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin') {
          setAuthLoading(false); setIsAuthenticated(false); router.push('/');
        } else {
          setIsAuthenticated(true); setAuthLoading(false);
          setTimeout(() => { setTickets(mockTickets); setLoading(false); }, 500);
        }
      } catch (error) {
        setAuthLoading(false); setIsAuthenticated(false); router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleViewTicket = (id: number) => { console.log('View ticket:', id); };

  const handleUpdateStatus = (id: number) => {
    setTickets(tickets.map(ticket =>
      ticket.id === id
        ? { ...ticket, status: ticket.status === 'Open' ? 'In Progress' : ticket.status === 'In Progress' ? 'Resolved' : 'Open' }
        : ticket
    ));
  };

  const Loader = ({ msg }: { msg: string }) => (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
        .l { min-height:100vh; background:#faf8f6; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; }
        .ring { width:40px; height:40px; border:2px solid rgba(192,67,106,0.15); border-top-color:#C0436A; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 14px; }
        .txt { font-size:12px; color:#9a7a7a; letter-spacing:0.08em; text-transform:uppercase; font-weight:300; text-align:center; }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
      <div className="l"><div><div className="ring"/><p className="txt">{msg}</p></div></div>
    </>
  );

  if (authLoading) return <Loader msg="Verifying authentication" />;
  if (!isAuthenticated) return null;
  if (loading) return <AdminWrapper><Loader msg="Loading support tickets" /></AdminWrapper>;

  const priorityStyle: Record<string, { bg: string; color: string; border: string }> = {
    High:   { bg: '#fef2f2', color: '#dc2626', border: 'rgba(220,38,38,0.18)' },
    Medium: { bg: '#fffbeb', color: '#b45309', border: 'rgba(180,83,9,0.18)' },
    Low:    { bg: '#f0fdf4', color: '#15803d', border: 'rgba(21,128,61,0.18)' },
  };

  const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
    Open:        { bg: '#fffbeb', color: '#b45309', border: 'rgba(180,83,9,0.18)' },
    'In Progress': { bg: '#eff6ff', color: '#2563eb', border: 'rgba(37,99,235,0.18)' },
    Resolved:    { bg: '#f0fdf4', color: '#15803d', border: 'rgba(21,128,61,0.18)' },
  };

  return (
    <AdminWrapper>
      <>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
          * { box-sizing: border-box; }

          .sp-root {
            min-height: 100vh;
            background: #faf8f6;
            font-family: 'DM Sans', sans-serif;
            color: #1a1018;
            position: relative;
          }

          .bg-blob {
            position: fixed;
            top: -200px; right: -200px;
            width: 500px; height: 500px;
            background: radial-gradient(circle, rgba(192,67,106,0.05) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
          }

          .sp-inner {
            position: relative; z-index: 1;
            max-width: 1280px;
            margin: 0 auto;
            padding: 48px 28px 80px;
          }

          .sp-header { margin-bottom: 40px; }

          .sp-eyebrow {
            font-size: 10px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: #C0436A;
            font-weight: 400;
            margin-bottom: 8px;
            display: flex; align-items: center; gap: 8px;
          }
          .sp-eyebrow::before { content: ''; display:inline-block; width:18px; height:1px; background:#C0436A; opacity:0.5; }

          .sp-title {
            font-family: 'Cormorant Garamond', serif;
            font-size: clamp(34px, 4vw, 50px);
            font-weight: 300;
            color: #1a1018;
            margin: 0 0 6px;
            line-height: 1.05;
          }
          .sp-title em { font-style: italic; color: #C0436A; }

          .sp-sub {
            font-size: 13px;
            color: #9a7a7a;
            font-weight: 300;
            margin: 0;
            display: flex; align-items: center; gap: 8px;
          }
          .sp-sub::before { content: ''; display:inline-block; width:22px; height:1px; background:rgba(192,67,106,0.4); }

          /* Table card */
          .table-card {
            background: #fff;
            border: 1px solid rgba(192,67,106,0.08);
            border-radius: 2px;
            overflow: hidden;
          }

          .table-head-row {
            display: grid;
            grid-template-columns: 80px 1fr 140px 110px 90px 110px 120px;
            padding: 0 20px;
            background: #fdf7f5;
            border-bottom: 1px solid rgba(192,67,106,0.08);
          }

          .th {
            font-size: 9px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: #9a7a7a;
            font-weight: 400;
            padding: 12px 8px;
          }

          .th.right { text-align: right; }

          .table-body-row {
            display: grid;
            grid-template-columns: 80px 1fr 140px 110px 90px 110px 120px;
            padding: 0 20px;
            border-bottom: 1px solid #f7f3f0;
            align-items: center;
            transition: background 0.15s;
          }

          .table-body-row:last-child { border-bottom: none; }
          .table-body-row:hover { background: #fdf9f8; }

          .td {
            font-size: 13px;
            color: #3d2830;
            font-weight: 300;
            padding: 14px 8px;
          }

          .td.id {
            font-family: 'DM Sans', sans-serif;
            font-size: 12px;
            font-weight: 500;
            color: #9a7a7a;
          }

          .td.name {
            font-weight: 400;
            color: #1a1018;
          }

          .td.right { text-align: right; }

          .pill {
            display: inline-flex;
            align-items: center;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.07em;
            text-transform: uppercase;
            padding: 3px 9px;
            border-radius: 20px;
            white-space: nowrap;
          }

          .act-view {
            background: none;
            border: none;
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #9a7a7a;
            cursor: pointer;
            padding: 0;
            margin-right: 14px;
            transition: color 0.15s;
            font-family: 'DM Sans', sans-serif;
          }
          .act-view:hover { color: #3d2830; }

          .act-update {
            background: none;
            border: none;
            font-size: 11px;
            font-weight: 500;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            color: #C0436A;
            cursor: pointer;
            padding: 0;
            transition: color 0.15s;
            font-family: 'DM Sans', sans-serif;
          }
          .act-update:hover { color: #a83860; }

          /* Mobile scroll note */
          .scroll-hint {
            font-size: 11px;
            color: #b09898;
            text-align: center;
            padding: 10px;
            display: none;
          }

          @media (max-width: 860px) {
            .table-card { overflow-x: auto; }
            .scroll-hint { display: block; }
          }

          .table-scroll { min-width: 760px; }

          @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
          .fu { animation: fadeUp 0.42s ease both; }
          .d1 { animation-delay: 0.08s; }
        `}</style>

        <div className="sp-root">
          <div className="bg-blob" />

          <div className="sp-inner">

            {/* Header */}
            <div className="sp-header fu">
              <p className="sp-eyebrow">Admin Panel</p>
              <h1 className="sp-title">Support <em>centre</em></h1>
              <p className="sp-sub">Manage customer support tickets</p>
            </div>

            {/* Table */}
            <div className="table-card fu d1">
              <p className="scroll-hint">Scroll horizontally to see all columns</p>
              <div className="table-scroll">

                {/* Head */}
                <div className="table-head-row">
                  <div className="th">ID</div>
                  <div className="th">Subject</div>
                  <div className="th">Customer</div>
                  <div className="th">Date</div>
                  <div className="th">Priority</div>
                  <div className="th">Status</div>
                  <div className="th right">Actions</div>
                </div>

                {/* Rows */}
                {tickets.map((ticket) => {
                  const ps = priorityStyle[ticket.priority] || priorityStyle['Low'];
                  const ss = statusStyle[ticket.status] || statusStyle['Open'];
                  return (
                    <div key={ticket.id} className="table-body-row">
                      <div className="td id">#{ticket.id}</div>
                      <div className="td name">{ticket.subject}</div>
                      <div className="td">{ticket.customer}</div>
                      <div className="td">{ticket.date}</div>
                      <div className="td">
                        <span className="pill" style={{ background: ps.bg, color: ps.color, border: `1px solid ${ps.border}` }}>
                          {ticket.priority}
                        </span>
                      </div>
                      <div className="td">
                        <span className="pill" style={{ background: ss.bg, color: ss.color, border: `1px solid ${ss.border}` }}>
                          {ticket.status}
                        </span>
                      </div>
                      <div className="td right">
                        <button className="act-view" onClick={() => handleViewTicket(ticket.id)}>View</button>
                        <button className="act-update" onClick={() => handleUpdateStatus(ticket.id)}>
                          {ticket.status === 'Resolved' ? 'Reopen' : 'Update'}
                        </button>
                      </div>
                    </div>
                  );
                })}

              </div>
            </div>

          </div>
        </div>
      </>
    </AdminWrapper>
  );
}