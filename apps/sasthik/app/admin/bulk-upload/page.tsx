'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getAllowedStoreTypes, getCSVTemplate } from '@/lib/csv-templates';
import AdminWrapper from '../AdminWrapper';

function BulkUploadPageContent() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [storeType, setStoreType] = useState<string>('sashti'); // Default to Sashti
  const [uploadStatus, setUploadStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [dataFile, setDataFile] = useState<File | null>(null);
  const [zipFile, setZipFile] = useState<File | null>(null);
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setAuthLoading(false); setIsAuthenticated(false); router.push('/admin/login'); return; }

    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin' && payload.role !== 'sales') {
          setAuthLoading(false); setIsAuthenticated(false); router.push('/admin/login');
        } else {
          setIsAuthenticated(true); setAuthLoading(false);
        }
      } catch (error) {
        setAuthLoading(false); setIsAuthenticated(false);      router.push('/admin/login');
      }
    };
    checkAuth();
  }, [router]);

  if (authLoading) return <p className="p-8 text-center text-brand-teal">Verifying Sashti Admin...</p>;
  if (!isAuthenticated) return null;

  const handleDownloadTemplate = () => {
    if (!storeType) { alert('Please select a store type'); return; }
    // Reach out to backend on port 3001 with format=xlsx
    window.location.href = `${baseUrl}/admin/bulk-upload?storeType=${storeType}&format=xlsx`;
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

    setUploadStatus({ type: 'loading', message: 'Uploading jewellery catalogue...' });

    try {
      const formData = new FormData();
      formData.append('storeType', storeType);
      formData.append('csvFile', dataFile);
      formData.append('zipFile', zipFile);

      const response = await fetch(`${baseUrl}/admin/bulk-upload`, { 
        method: 'POST', 
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData 
      });
      
      const result = await response.json();

      if (response.ok && result.success) {
        setUploadStatus({ 
          type: 'success', 
          message: `Catalogue Uploaded: ${result.results.successful} pieces added, ${result.results.failed} failed` 
        });
      } else {
        setUploadStatus({ type: 'error', message: result.error || 'Upload failed' });
      }
    } catch (error: any) {
      setUploadStatus({ type: 'error', message: 'Upload failed: ' + error.message });
    }
  };

  const canSubmit = !!storeType && !!dataFile && !!zipFile;

  return (
    <>
      <style jsx>{`
        .bu-root { min-height: 100vh; background: #faf9f7; font-family: 'DM Sans', sans-serif; padding: 48px; }
        .bu-title { font-family: 'Cormorant Garamond', serif; font-size: 3rem; color: #1A7A7A; margin-bottom: 8px; font-style: italic; }
        .bu-sub { color: #B76E79; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 48px; }
        .panel { background: white; border: 1px solid #ede9e4; border-radius: 24px; padding: 32px; margin-bottom: 24px; box-shadow: 0 4px 20px rgba(26,122,122,0.05); }
        .field-label { display: block; font-size: 13px; font-weight: 700; color: #3d3b39; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 12px; }
        .file-zone { border: 2px dashed #ede9e4; border-radius: 16px; padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.2s; background: #faf9f7; }
        .file-zone:hover { border-color: #1A7A7A; background: rgba(26,122,122,0.02); }
        .file-zone.has-file { border-color: #1A7A7A; background: rgba(26,122,122,0.05); border-style: solid; }
        .status-banner { margin-top: 24px; padding: 16px; border-radius: 12px; font-size: 14px; font-weight: 500; }
        .status-success { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .status-error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .status-loading { background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; }
      `}</style>

      <div className="bu-root">
        <div className="max-w-4xl mx-auto">
          <h1 className="bu-title">Bulk Catalogue Upload</h1>
          <p className="bu-sub">Sync jewellery collections in seconds</p>

          <form onSubmit={handleSubmit}>
            <div className="panel">
              <label className="field-label">Catalogue Identity</label>
              <select 
                 className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-teal"
                 value={storeType}
                 onChange={(e) => setStoreType(e.target.value)}
              >
                 <option value="sashti">Sashti Jewels Catalogue</option>
                 {getAllowedStoreTypes().filter(t => t !== 'sashti').map(type => (
                    <option key={type} value={type}>{getCSVTemplate(type).displayName}</option>
                 ))}
              </select>
                <button 
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="mt-4 text-[10px] font-bold text-brand-teal uppercase tracking-widest hover:underline"
                >
                  Download Master Excel Template
                </button>

                {storeType === 'sashti' && (
                  <div className="mt-6 p-4 bg-teal-50/50 border border-brand-teal/10 rounded-lg">
                    <p className="text-[10px] font-bold text-brand-teal uppercase tracking-wider mb-2">Required Template Columns:</p>
                    <div className="flex flex-wrap gap-2">
                      {['productName', 'description', 'category', 'price', 'stock', 'imageName'].map(col => (
                        <span key={col} className="bg-white px-2 py-1 rounded border border-brand-teal/20 text-[10px] font-medium text-brand-dark">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="panel">
                <label className="field-label">Data File (CSV/XLSX)</label>
                <div 
                  className={`file-zone ${dataFile ? 'has-file' : ''}`}
                  onClick={() => document.getElementById('data-upload')?.click()}
                >
                  <p className="text-sm font-semibold text-gray-700">{dataFile ? dataFile.name : 'Select Jewellery Data'}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Inventory & Pricing (CSV or XLSX)</p>
                  <input id="data-upload" type="file" accept=".csv,.xlsx" className="hidden" onChange={(e) => handleFileChange(e, 'data')} />
                </div>
              </div>

              <div className="panel">
                <label className="field-label">Images Archive (ZIP)</label>
                <div 
                  className={`file-zone ${zipFile ? 'has-file' : ''}`}
                  onClick={() => document.getElementById('zip-upload')?.click()}
                >
                  <p className="text-sm font-semibold text-gray-700">{zipFile ? zipFile.name : 'Select Image Assets'}</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">High-res ZIP Archive</p>
                  <input id="zip-upload" type="file" accept=".zip" className="hidden" onChange={(e) => handleFileChange(e, 'zip')} />
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <Button 
                type="submit" 
                disabled={!canSubmit || uploadStatus.type === 'loading'}
                className="bg-brand-rose-gold text-white px-12 py-6 rounded-2xl text-[11px] font-bold tracking-widest uppercase hover:bg-brand-dark transition-all"
              >
                {uploadStatus.type === 'loading' ? 'Processing Catalogue...' : 'Initiate Bulk Upload'}
              </Button>
            </div>

            {uploadStatus.type !== 'idle' && (
              <div className={`status-banner ${
                uploadStatus.type === 'success' ? 'status-success' :
                uploadStatus.type === 'error' ? 'status-error' :
                'status-loading'
              }`}>
                {uploadStatus.message}
              </div>
            )}
          </form>
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
