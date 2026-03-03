'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '../../../lib/auth';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/button';
import { getAllowedStoreTypes, getCSVTemplate } from '../../../lib/csv-templates';
import AdminWrapper from '../AdminWrapper';

function BulkUploadPageContent() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storeType, setStoreType] = useState<string>('');
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);

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
        }
      } catch (error) {
        setAuthLoading(false); setIsAuthenticated(false); router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  if (authLoading) {
    return (
      <>
        <style jsx>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&display=swap');
          .l { min-height:100vh; background:#faf8f6; display:flex; align-items:center; justify-content:center; font-family:'DM Sans',sans-serif; }
          .ring { width:40px; height:40px; border:2px solid rgba(192,67,106,0.15); border-top-color:#C0436A; border-radius:50%; animation:spin 0.8s linear infinite; margin:0 auto 14px; }
          .txt { font-size:12px; color:#9a7a7a; letter-spacing:0.08em; text-transform:uppercase; font-weight:300; text-align:center; }
          @keyframes spin { to { transform:rotate(360deg); } }
        `}</style>
        <div className="l"><div><div className="ring"/><p className="txt">Verifying authentication</p></div></div>
      </>
    );
  }

  if (!isAuthenticated) return null;

  const handleDownloadTemplate = () => {
    if (!storeType) { alert('Please select a store type first'); return; }
    window.location.href = `/api/admin/bulk-upload?storeType=${storeType}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'data' | 'zip') => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === 'data') setDataFile(file);
      else setZipFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeType) { setUploadStatus({ type: 'error', message: 'Please select a store type' }); return; }
    if (!dataFile) { setUploadStatus({ type: 'error', message: 'Please select a data file (CSV or XLSX)' }); return; }
    if (!zipFile) { setUploadStatus({ type: 'error', message: 'Please select a ZIP file with images' }); return; }

    setUploadStatus({ type: 'loading', message: 'Uploading...' });

    try {
      const formData = new FormData();
      formData.append('storeType', storeType);
      formData.append('csvFile', dataFile);
      formData.append('zipFile', zipFile);

      const response = await fetch('/api/admin/bulk-upload', { method: 'POST', body: formData });
      const result = await response.json();

      if (response.ok) {
        setUploadStatus({ type: 'success', message: `Upload completed: ${result.results.successful} successful, ${result.results.failed} failed` });
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Upload failed' });
      }
    } catch (error) {
      setUploadStatus({ type: 'error', message: 'Upload failed: ' + error.message });
    }
  };

  const handleStoreTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStoreType(e.target.value);
  };

  const canSubmit = !!storeType && !!dataFile && !!zipFile;

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .bu-root {
          min-height: 100vh;
          background: #faf8f6;
          font-family: 'DM Sans', sans-serif;
          color: #1a1018;
          position: relative;
          padding: 48px 24px 80px;
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

        .bu-inner {
          position: relative; z-index: 1;
          max-width: 860px;
          margin: 0 auto;
        }

        .bu-eyebrow {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C0436A;
          font-weight: 400;
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .bu-eyebrow::before { content: ''; display:inline-block; width:18px; height:1px; background:#C0436A; opacity:0.5; }

        .bu-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 300;
          color: #1a1018;
          margin: 0 0 6px;
          line-height: 1.05;
          letter-spacing: -0.01em;
        }
        .bu-title em { font-style: italic; color: #C0436A; }

        .bu-sub {
          font-size: 13px;
          color: #9a7a7a;
          font-weight: 300;
          margin: 0 0 36px;
          display: flex; align-items: center; gap: 8px;
        }
        .bu-sub::before { content: ''; display:inline-block; width:22px; height:1px; background:rgba(192,67,106,0.4); }

        /* Cards */
        .panel {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          padding: 32px;
          margin-bottom: 20px;
        }

        .panel-title {
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9a7a7a;
          font-weight: 400;
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(192,67,106,0.07);
        }

        /* Fields */
        .field-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9a7a7a;
          font-weight: 400;
          display: block;
          margin-bottom: 8px;
        }

        .field-select {
          width: 100%;
          background: #faf8f6;
          border: 1px solid rgba(192,67,106,0.12);
          border-radius: 2px;
          padding: 11px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 300;
          color: #1a1018;
          outline: none;
          transition: border-color 0.2s;
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%239a7a7a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }

        .field-select:focus { border-color: rgba(192,67,106,0.4); background-color: #fff; }
        .field-select:disabled { opacity: 0.5; cursor: not-allowed; }

        .template-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: none;
          border: 1px solid rgba(192,67,106,0.2);
          color: #C0436A;
          padding: 9px 18px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          margin-top: 12px;
          transition: all 0.15s;
        }
        .template-btn:hover:not(:disabled) { background: rgba(192,67,106,0.04); border-color: #C0436A; }
        .template-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* File upload grid */
        .file-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }

        @media (max-width: 560px) { .file-grid { grid-template-columns: 1fr; } }

        .file-zone {
          background: #faf8f6;
          border: 1px dashed rgba(192,67,106,0.22);
          border-radius: 2px;
          padding: 24px 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.18s;
          position: relative;
        }

        .file-zone:hover { border-color: rgba(192,67,106,0.42); background: #fdf7f5; }
        .file-zone.has-file { border-style: solid; border-color: rgba(192,67,106,0.3); background: #fdf2f5; }

        .file-zone-icon {
          width: 36px; height: 36px;
          border: 1px solid rgba(192,67,106,0.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 10px;
          color: #C0436A;
          background: #fff;
        }

        .file-zone-lbl {
          font-size: 12px;
          color: #9a7a7a;
          font-weight: 300;
        }

        .file-zone-name {
          font-size: 11px;
          color: #C0436A;
          font-weight: 400;
          margin-top: 4px;
          word-break: break-all;
        }

        .file-zone-hint {
          font-size: 10px;
          color: #b09898;
          margin-top: 5px;
          letter-spacing: 0.03em;
        }

        .file-input { display: none; }

        /* Submit */
        .submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #C0436A;
          color: #fff;
          border: none;
          padding: 12px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .submit-btn:hover:not(:disabled) { background: #a83860; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        /* Status banner */
        .status-banner {
          margin-top: 20px;
          padding: 13px 16px;
          border-radius: 2px;
          font-size: 13px;
          font-weight: 300;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .status-success { background: #f0fdf4; color: #15803d; border: 1px solid rgba(21,128,61,0.18); }
        .status-error   { background: #fef2f2; color: #dc2626; border: 1px solid rgba(220,38,38,0.18); }
        .status-loading { background: #eff6ff; color: #2563eb; border: 1px solid rgba(37,99,235,0.18); }

        /* Store types grid */
        .types-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2px;
        }

        @media (max-width: 560px) { .types-grid { grid-template-columns: 1fr; } }

        .type-card {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          padding: 18px 20px;
          transition: border-color 0.15s;
        }

        .type-card:hover { border-color: rgba(192,67,106,0.2); }

        .type-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1018;
          margin-bottom: 8px;
        }

        .type-fields {
          font-size: 11px;
          color: #9a7a7a;
          font-weight: 300;
          line-height: 1.6;
        }

        .type-fields strong { color: #3d2830; font-weight: 400; }

        /* Tips panel */
        .tips-panel {
          background: #fdf2f5;
          border: 1px solid rgba(192,67,106,0.12);
          border-radius: 2px;
          padding: 22px 24px;
          margin-top: 20px;
        }

        .tips-title {
          font-size: 12px;
          font-weight: 500;
          color: #C0436A;
          letter-spacing: 0.04em;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tips-list {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .tips-list li {
          font-size: 12px;
          color: #7a3050;
          font-weight: 300;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          line-height: 1.5;
        }

        .tips-list li::before {
          content: '—';
          color: rgba(192,67,106,0.5);
          font-size: 10px;
          margin-top: 2px;
          flex-shrink: 0;
        }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fu { animation: fadeUp 0.42s ease both; }
        .d1 { animation-delay: 0.08s; }
        .d2 { animation-delay: 0.14s; }
        .d3 { animation-delay: 0.20s; }
      `}</style>

      <div className="bu-root">
        <div className="bg-blob" />

        <div className="bu-inner">

          {/* Header */}
          <div className="fu">
            <p className="bu-eyebrow">Admin Panel</p>
            <h1 className="bu-title">Bulk <em>upload</em> products</h1>
            <p className="bu-sub">Import multiple products at once using a CSV or XLSX file</p>
          </div>

          {/* Upload panel */}
          <div className="panel fu d1">
            <p className="panel-title">1 — Select Store Type</p>

            <label className="field-label" htmlFor="storeType">Store Type</label>
            <select
              id="storeType"
              value={storeType}
              onChange={handleStoreTypeChange}
              className="field-select"
            >
              <option value="">Select a store type</option>
              {getAllowedStoreTypes().map((type) => (
                <option key={type} value={type}>{getCSVTemplate(type).displayName}</option>
              ))}
            </select>

            <button
              onClick={handleDownloadTemplate}
              className="template-btn"
              disabled={!storeType}
            >
              <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:12,height:12}}>
                <path d="M7 2v8M3 8l4 4 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 13h10" strokeLinecap="round"/>
              </svg>
              Download Template
            </button>
          </div>

          <div className="panel fu d2">
            <p className="panel-title">2 — Upload Files</p>

            <form onSubmit={handleSubmit}>
              <div className="file-grid">

                {/* Data file */}
                <div
                  className={`file-zone ${dataFile ? 'has-file' : ''}`}
                  onClick={() => document.getElementById('dataFileInput')?.click()}
                >
                  <div className="file-zone-icon">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" style={{width:14,height:14}}>
                      <rect x="2" y="1" width="12" height="14" rx="1.5"/>
                      <path d="M5 5h6M5 8h6M5 11h4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {dataFile ? (
                    <>
                      <p className="file-zone-name">{dataFile.name}</p>
                      <p className="file-zone-hint">Click to change</p>
                    </>
                  ) : (
                    <>
                      <p className="file-zone-lbl">Data File</p>
                      <p className="file-zone-hint">CSV or XLSX</p>
                    </>
                  )}
                  <input
                    id="dataFileInput"
                    type="file"
                    accept=".csv,.xlsx"
                    className="file-input"
                    onChange={(e) => handleFileChange(e, 'data')}
                  />
                </div>

                {/* ZIP file */}
                <div
                  className={`file-zone ${zipFile ? 'has-file' : ''}`}
                  onClick={() => document.getElementById('zipFileInput')?.click()}
                >
                  <div className="file-zone-icon">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" style={{width:14,height:14}}>
                      <rect x="2" y="1" width="12" height="14" rx="1.5"/>
                      <path d="M6 1v14M6 4h4M6 7h4M6 10h4" strokeLinecap="round"/>
                    </svg>
                  </div>
                  {zipFile ? (
                    <>
                      <p className="file-zone-name">{zipFile.name}</p>
                      <p className="file-zone-hint">Click to change</p>
                    </>
                  ) : (
                    <>
                      <p className="file-zone-lbl">Images ZIP</p>
                      <p className="file-zone-hint">.zip archive</p>
                    </>
                  )}
                  <input
                    id="zipFileInput"
                    type="file"
                    accept=".zip"
                    className="file-input"
                    onChange={(e) => handleFileChange(e, 'zip')}
                  />
                </div>

              </div>

              <button type="submit" className="submit-btn" disabled={!canSubmit}>
                {uploadStatus.type === 'loading' ? (
                  <>
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{width:12,height:12,animation:'spin 0.7s linear infinite'}}>
                      <circle cx="8" cy="8" r="6" strokeDasharray="25" strokeDashoffset="10"/>
                    </svg>
                    Uploading...
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:12,height:12}}>
                      <path d="M7 10V2M3 6l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12h10" strokeLinecap="round"/>
                    </svg>
                    Upload Products
                  </>
                )}
              </button>

              {uploadStatus.type !== 'idle' && (
                <div className={`status-banner ${
                  uploadStatus.type === 'success' ? 'status-success' :
                  uploadStatus.type === 'error' ? 'status-error' :
                  'status-loading'
                }`}>
                  {uploadStatus.type === 'success' && (
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13,flexShrink:0}}>
                      <path d="M2 7l3.5 3.5L12 3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                  {uploadStatus.type === 'error' && (
                    <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:13,height:13,flexShrink:0}}>
                      <circle cx="7" cy="7" r="6"/>
                      <path d="M7 4v3M7 9.5v.5" strokeLinecap="round"/>
                    </svg>
                  )}
                  {uploadStatus.message}
                </div>
              )}
            </form>
          </div>

          {/* Store types */}
          <div className="fu d3">
            <p className="panel-title" style={{marginBottom:14}}>Supported Store Types</p>
            <div className="types-grid">
              {getAllowedStoreTypes().map((type) => {
                const template = getCSVTemplate(type);
                return (
                  <div key={type} className="type-card">
                    <p className="type-name">{template.displayName}</p>
                    <p className="type-fields">
                      <strong>Required:</strong> {template.required.join(', ')}
                    </p>
                    <p className="type-fields">
                      <strong>Optional:</strong> {template.headers.filter(h => !template.required.includes(h)).join(', ')}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="tips-panel">
              <p className="tips-title">
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" style={{width:13,height:13}}>
                  <circle cx="7" cy="7" r="6"/>
                  <path d="M7 5v2.5M7 9.5v.5" strokeLinecap="round"/>
                </svg>
                Tips for XLSX Files
              </p>
              <ul className="tips-list">
                <li>Use the first sheet in your Excel file</li>
                <li>Make sure headers match exactly with the template</li>
                <li>Save as .xlsx format for best compatibility</li>
                <li>Numbers should be in numeric format, not text</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default function BulkUploadPage() {
  return (
    <AdminWrapper>
      <BulkUploadPageContent />
    </AdminWrapper>
  );
}