'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@nirali-sai/ui';
import { toast } from 'react-hot-toast';

export default function NewProductPage() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      fetch('/api/upload-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'image_selected', details: { fileName: file.name, fileSize: file.size, fileType: file.type } })
      });
      setSelectedImage(file);
      const previewUrl = URL.createObjectURL(file);
      console.log('Preview URL created:', previewUrl);
      setImagePreview(previewUrl);
    } else {
      setSelectedImage(null);
      setImagePreview(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const productName = formData.get('name') as string;
      const category = formData.get('category') as string;
      const price = Number(formData.get('price'));
      const stock = Number(formData.get('stock'));
      const description = formData.get('description') as string;
      const brand = formData.get('brand') as string || 'boutique';
      const storeType = formData.get('storeType') as string || 'boutique';

      if (!productName || !category || !price || !description) {
        toast.error('Please fill in all required fields');
        return;
      }

      await fetch('/api/upload-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'upload_start', details: { productName, hasImage: !!selectedImage } })
      });

      console.log('Selected image:', selectedImage);
      console.log('Has image:', !!selectedImage);

      const productFormData = new FormData();
      const productData = { name: productName, category, price, stock, description, brand, storeType };
      productFormData.append('product', JSON.stringify(productData));
      if (selectedImage) {
        productFormData.append('image', selectedImage);
        console.log('FormData contains image file');
      } else {
        console.log('No image file in FormData');
      }

      const response = await fetch('/api/products', { method: 'POST', body: productFormData });
      const result = await response.json();

      if (response.ok && result.success) {
        await fetch('/api/upload-monitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'upload_success', details: { productId: result.data.id, cloudinaryUrl: result.data.image, publicId: result.data.cloudinary_public_id } })
        });
        toast.success('Product created successfully!');
        router.push('/admin/products');
      } else {
        await fetch('/api/upload-monitor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'upload_failed', details: { error: result.error || 'Unknown error' } })
        });
        toast.error(result.error || 'Failed to create product');
      }
    } catch (error: any) {
      await fetch('/api/upload-monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'upload_error', details: { error: error.message || 'Unknown error' } })
      });
      toast.error('Failed to create product');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        * { box-sizing: border-box; }

        .np-root {
          min-height: 100vh;
          background: #faf8f6;
          font-family: 'DM Sans', sans-serif;
          padding: 48px 24px 80px;
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

        .np-inner {
          position: relative; z-index: 1;
          max-width: 760px;
          margin: 0 auto;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #9a7a7a;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 32px;
          transition: color 0.2s;
        }
        .back-btn:hover { color: #C0436A; }

        .np-eyebrow {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #C0436A;
          font-weight: 400;
          margin-bottom: 8px;
          display: flex; align-items: center; gap: 8px;
        }
        .np-eyebrow::before { content: ''; display: inline-block; width: 18px; height: 1px; background: #C0436A; opacity: 0.5; }

        .np-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 46px);
          font-weight: 300;
          color: #1a1018;
          margin: 0 0 6px;
          line-height: 1.05;
          letter-spacing: -0.01em;
        }
        .np-title em { font-style: italic; color: #C0436A; }

        .np-sub {
          font-size: 13px;
          color: #9a7a7a;
          font-weight: 300;
          margin: 0 0 36px;
          display: flex; align-items: center; gap: 8px;
        }
        .np-sub::before { content: ''; display: inline-block; width: 22px; height: 1px; background: rgba(192,67,106,0.4); }

        /* Form card */
        .form-card {
          background: #fff;
          border: 1px solid rgba(192,67,106,0.08);
          border-radius: 2px;
          padding: 36px;
        }

        .field-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        @media (max-width: 560px) { .field-grid { grid-template-columns: 1fr; } }

        .field { display: flex; flex-direction: column; gap: 7px; }
        .field.full { grid-column: 1 / -1; }

        .field-label {
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9a7a7a;
          font-weight: 400;
        }

        .field-label span { color: #C0436A; margin-left: 2px; }

        .field-input {
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
          width: 100%;
        }

        .field-input::placeholder { color: #c4adad; }
        .field-input:focus { border-color: rgba(192,67,106,0.4); background: #fff; }

        textarea.field-input { resize: vertical; min-height: 110px; line-height: 1.6; }

        /* Upload zone */
        .upload-zone {
          background: #faf8f6;
          border: 1px dashed rgba(192,67,106,0.25);
          border-radius: 2px;
          padding: 32px 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
        }

        .upload-zone:hover { border-color: rgba(192,67,106,0.45); background: #fdf7f5; }

        .upload-icon {
          width: 44px; height: 44px;
          border: 1px solid rgba(192,67,106,0.18);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 14px;
          color: #C0436A;
          background: #fff;
        }

        .upload-text { font-size: 13px; color: #9a7a7a; font-weight: 300; }
        .upload-link { color: #C0436A; font-weight: 400; }
        .upload-hint { font-size: 11px; color: #b09898; margin-top: 6px; }

        .preview-img {
          width: 100px; height: 130px;
          object-fit: cover;
          border-radius: 2px;
          margin: 0 auto 10px;
          display: block;
          border: 1px solid rgba(192,67,106,0.15);
        }

        .preview-name { font-size: 12px; color: #9a7a7a; margin-top: 6px; }

        .form-divider { height: 1px; background: rgba(192,67,106,0.07); margin: 28px 0; }

        /* Footer */
        .form-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 28px;
        }

        .btn-cancel {
          display: inline-flex; align-items: center;
          background: none;
          border: 1px solid #ecddd5;
          color: #9a7a7a;
          padding: 11px 22px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .btn-cancel:hover { border-color: rgba(192,67,106,0.3); color: #3d2830; }

        .btn-submit {
          display: inline-flex; align-items: center; gap: 8px;
          background: #C0436A;
          color: #fff;
          border: none;
          padding: 11px 28px;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-submit:hover:not(:disabled) { background: #a83860; transform: translateY(-1px); }
        .btn-submit:disabled { opacity: 0.55; cursor: not-allowed; }

        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .fu { animation: fadeUp 0.42s ease both; }
        .d1 { animation-delay: 0.08s; }
      `}</style>

      <div className="np-root">
        <div className="bg-blob" />
        <div className="np-inner">

          <button className="back-btn" onClick={() => router.back()}>
            <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:12,height:12}}>
              <path d="M9 2L5 7l4 5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </button>

          <div className="fu">
            <p className="np-eyebrow">Admin — Products</p>
            <h1 className="np-title">Create new <em>product</em></h1>
            <p className="np-sub">Fill in the details to add an item to the catalogue</p>
          </div>

          <div className="form-card fu d1">
            <form onSubmit={onSubmit}>
              <div className="field-grid">
                <div className="field">
                  <label className="field-label" htmlFor="name">Product Name <span>*</span></label>
                  <input type="text" id="name" name="name" required className="field-input" placeholder="e.g. Silk Anarkali Gown" />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="category">Category <span>*</span></label>
                  <input type="text" id="category" name="category" required className="field-input" placeholder="e.g. Lehenga, Saree" />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="price">Rental Price / Day <span>*</span></label>
                  <input type="number" id="price" name="price" required min="0" step="0.01" className="field-input" placeholder="0.00" />
                </div>

                <div className="field">
                  <label className="field-label" htmlFor="stock">Stock Quantity</label>
                  <input type="number" id="stock" name="stock" min="0" className="field-input" placeholder="0" />
                </div>

                {/* Hidden fields for brand and storeType - defaults to 'boutique' */}
                <input type="hidden" id="brand" name="brand" value="boutique" />
                <input type="hidden" id="storeType" name="storeType" value="boutique" />

                <div className="field full">
                  <label className="field-label" htmlFor="description">Description <span>*</span></label>
                  <textarea id="description" name="description" required className="field-input" placeholder="Describe the garment, fabric, occasion..." />
                </div>
              </div>

              <div className="form-divider" />

              <p className="field-label" style={{marginBottom:10}}>Product Image</p>
              <div className="upload-zone" onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="preview-img"
                      onError={(e) => { console.error('Image load error:', e); console.log('Image preview URL:', imagePreview); }}
                      onLoad={() => console.log('Image loaded successfully')}
                    />
                    <p className="preview-name">{selectedImage?.name}</p>
                  </>
                ) : (
                  <>
                    <div className="upload-icon">
                      <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4" style={{width:16,height:16}}>
                        <path d="M9 2v10M5 6l4-4 4 4" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 14h14" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <p className="upload-text">
                      <span className="upload-link">Choose a file</span> or drag and drop
                    </p>
                    <p className="upload-hint">PNG, JPG, GIF, WEBP up to 10MB</p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  id="image" name="image" type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="form-footer">
                <button type="button" className="btn-cancel" onClick={() => router.back()}>Cancel</button>
                <button type="submit" className="btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" style={{width:12,height:12,animation:'spin 0.7s linear infinite'}}>
                        <circle cx="8" cy="8" r="6" strokeDasharray="25" strokeDashoffset="10"/>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" style={{width:12,height:12}}>
                        <path d="M2 7h10M7 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Create Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </>
  );
}