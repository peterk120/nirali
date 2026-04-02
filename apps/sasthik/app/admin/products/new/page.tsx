'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { Camera, Image as ImageIcon, Plus, ArrowLeft, CheckCircle2, X, Crop, Check } from 'lucide-react';
import AdminWrapper from '../../AdminWrapper';

const CATEGORIES = [
  'Ring', 'Chain', 'Bangle', 'Necklace', 'Earrings', 
  'Bracelet', 'Anklet', 'Bridal Set', 'Maang Tikka', 'Others'
];

export default function MobileAddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // App Steps: 'form' | 'crop' | 'review' | 'success'
  const [step, setStep] = useState<'form' | 'crop' | 'review' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  
  // Image State
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Ring',
    description: '',
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setRawImage(event.target?.result as string);
        setStep('crop');
      };
      reader.readAsDataURL(file);
    }
  };

  // ─── Simple Square Cropper ────────────────────────────────────────────────
  const performCrop = () => {
    if (!rawImage || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Create a 1000x1000 square crop from center
      const size = Math.min(img.width, img.height);
      const startX = (img.width - size) / 2;
      const startY = (img.height - size) / 2;
      
      canvas.width = 1000;
      canvas.height = 1000;
      
      ctx?.drawImage(img, startX, startY, size, size, 0, 0, 1000, 1000);
      
      canvas.toBlob((blob) => {
        if (blob) {
          setCroppedBlob(blob);
          setCroppedPreview(canvas.toDataURL('image/jpeg', 0.8));
          setStep('review');
        }
      }, 'image/jpeg', 0.8);
    };
    img.src = rawImage;
  };

  const resetForm = () => {
    setFormData({ name: '', price: '', category: 'Ring', description: '' });
    setRawImage(null);
    setCroppedBlob(null);
    setCroppedPreview(null);
    setStep('form');
  };

  const handleSubmit = async () => {
    if (!croppedBlob) {
      toast.error('Please crop your product image first');
      return;
    }

    setLoading(true);
    
    try {
      const productPayload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        brand: 'sashti',
        storeType: 'sashti',
        status: 'Active',
        stock: 50,
      };

      const finalFormData = new FormData();
      finalFormData.append('product', JSON.stringify(productPayload));
      finalFormData.append('image', croppedBlob, 'product.jpg');

      const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: finalFormData
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Product Added Successfully! ✨');
        setStep('success');
      } else {
        toast.error(result.message || 'Failed to add product');
      }
    } catch (err) {
      toast.error('Connection error with backend');
    } finally {
      setLoading(false);
    }
  };

  // ─── Render Success Step ───────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <AdminWrapper>
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-green-100/50">
            <CheckCircle2 size={48} className="text-green-600" />
          </div>
          <h2 className="font-heading text-4xl text-brand-dark mb-4 italic">Published!</h2>
          <p className="text-brand-dark/50 mb-10 max-w-xs mx-auto text-sm leading-relaxed">The new piece is now live in the Sashti collection.</p>
          <div className="space-y-4 w-full max-w-sm">
            <Button onClick={resetForm} className="w-full bg-brand-teal h-16 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest text-[10px]">
              <Plus size={18} /> Add Next Product
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/products')} className="w-full h-16 rounded-2xl font-bold uppercase tracking-widest text-[10px] border-teal-light text-brand-teal">
              View Catalogue
            </Button>
          </div>
        </div>
      </AdminWrapper>
    );
  }

  // ─── Render Crop Step ──────────────────────────────────────────────────────
  if (step === 'crop') {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col animate-in slide-in-from-bottom duration-300">
        <div className="p-6 flex items-center justify-between border-b border-white/10">
          <button onClick={() => setStep('form')} className="text-white/60"><X size={24} /></button>
          <h2 className="text-white font-bold uppercase tracking-widest text-xs">Review & Crop</h2>
          <div className="w-6" />
        </div>
        <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
          <img src={rawImage!} alt="Original" className="max-w-full max-h-[70vh] object-contain opacity-50" />
          {/* Visual Crop Overlay */}
          <div className="absolute inset-x-4 aspect-square border-2 border-white rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.6)] flex items-center justify-center pointer-events-none">
             <div className="text-white/80 text-[10px] font-bold uppercase tracking-widest animate-pulse">Standard Product View</div>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="p-8 bg-zinc-900 rounded-t-[40px] space-y-6">
           <div className="text-center text-white/40 text-[10px] font-bold uppercase tracking-widest">Auto-centering piece for consistent display</div>
           <Button onClick={performCrop} className="w-full h-16 bg-white text-black hover:bg-white/90 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3">
             <Crop size={18} /> Apply Crop
           </Button>
        </div>
      </div>
    );
  }

  // ─── Render Confirm Step ──────────────────────────────────────────────────
  if (step === 'review') {
    return (
      <AdminWrapper>
        <div className="max-w-xl mx-auto py-8 px-5 animate-in fade-in duration-300">
          <div className="mb-8">
            <h1 className="font-heading text-2xl text-brand-dark italic">Final Confirmation</h1>
            <p className="text-[10px] text-brand-rose-gold font-bold tracking-[0.2em] uppercase">Check details before publish</p>
          </div>
          
          <div className="bg-white border border-teal-light rounded-[32px] overflow-hidden shadow-luxury mb-8">
             <img src={croppedPreview!} alt="Final" className="w-full aspect-square object-cover" />
             <div className="p-8 space-y-4">
                <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-heading text-2xl text-brand-dark italic leading-tight">{formData.name}</h3>
                     <p className="text-[10px] text-brand-teal font-bold uppercase tracking-widest">{formData.category}</p>
                   </div>
                   <div className="text-xl font-bold text-brand-dark">₹{formData.price}</div>
                </div>
                <p className="text-xs text-brand-dark/60 leading-relaxed italic">{formData.description || 'No description provided'}</p>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <Button variant="outline" onClick={() => setStep('form')} className="h-16 rounded-2xl border-teal-light text-brand-teal font-bold uppercase tracking-widest text-[10px]">
                <X size={16} className="mr-2" /> Cancel
             </Button>
             <Button onClick={handleSubmit} disabled={loading} className="h-16 rounded-2xl bg-brand-rose-gold text-white font-bold uppercase tracking-widest text-[10px]">
                {loading ? 'Publishing...' : <><Check size={16} className="mr-2" /> Confirm</>}
             </Button>
          </div>
        </div>
      </AdminWrapper>
    );
  }

  // ─── Main Form Step ───
  return (
    <AdminWrapper>
      <div className="max-w-xl mx-auto py-8 px-5">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.push('/admin/products')} className="p-3 bg-white border border-teal-light rounded-xl text-brand-teal"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="font-heading text-2xl text-brand-dark italic">New Product</h1>
            <p className="text-[10px] text-brand-rose-gold font-bold tracking-[0.2em] uppercase">Sashti Catalogue</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); if(!croppedPreview) { toast.error('Capture photo first'); return; } setStep('review'); }} className="space-y-6">
          {/* Image Capture Container */}
          <div className="bg-white border border-teal-light rounded-[32px] overflow-hidden shadow-luxury p-1">
            <div className={`relative aspect-square w-full rounded-[28px] overflow-hidden flex flex-col items-center justify-center transition-all ${!croppedPreview ? 'bg-teal-light/5 border-2 border-dashed border-teal-light/40' : ''}`}>
              {croppedPreview ? (
                <>
                  <img src={croppedPreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                  <button type="button" onClick={() => { setCroppedPreview(null); setRawImage(null); }} className="absolute top-4 right-4 p-2 bg-black/50 backdrop-blur-md rounded-full text-white"><X size={18} /></button>
                </>
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-4"><Camera className="text-brand-teal" size={32} /></div>
                  <h3 className="text-sm font-bold text-brand-dark mb-1">Upload Product Photo</h3>
                  <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest font-bold">Camera or Gallery</p>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileSelect} />
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
               <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 py-4 bg-teal-light/10 text-brand-teal rounded-[20px] text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-teal-light/20"><Camera size={16} /> Use Camera</button>
               <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 py-4 bg-teal-light/10 text-brand-teal rounded-[20px] text-[10px] font-bold uppercase tracking-widest transition-all hover:bg-teal-light/20"><ImageIcon size={16} /> Gallery</button>
            </div>
          </div>

          <div className="bg-white border border-teal-light rounded-[32px] p-8 shadow-luxury space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold text-brand-dark/40 tracking-[0.2em] uppercase ml-1">Product Details</label>
              <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-5 bg-teal-light/10 border border-teal-light/20 rounded-2xl text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all" placeholder="e.g. Gold Plated Ring" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-brand-dark/40 tracking-[0.2em] uppercase ml-1">Price (₹)</label>
                <input name="price" type="number" required value={formData.price} onChange={handleInputChange} className="w-full p-5 bg-teal-light/10 border border-teal-light/20 rounded-2xl text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all" placeholder="999" />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-brand-dark/40 tracking-[0.2em] uppercase ml-1">Category</label>
                <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full p-5 bg-teal-light/10 border border-teal-light/20 rounded-2xl text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all">
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
               <label className="block text-[10px] font-bold text-brand-dark/40 tracking-[0.2em] uppercase ml-1">Description</label>
               <textarea name="description" rows={3} value={formData.description} onChange={handleInputChange} className="w-full p-5 bg-teal-light/10 border border-teal-light/20 rounded-2xl text-sm outline-none focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 transition-all" placeholder="Simple description..." />
            </div>
          </div>

          <button type="submit" className="w-full bg-brand-rose-gold text-white py-6 rounded-2xl font-bold tracking-[0.3em] uppercase text-xs shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
             Continue to Review <ArrowLeft className="rotate-180" size={18} />
          </button>
        </form>
      </div>
    </AdminWrapper>
  );
}
