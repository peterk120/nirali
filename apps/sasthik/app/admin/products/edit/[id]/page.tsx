'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import AdminWrapper from '../../../AdminWrapper';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

const styles = `
  .field-label { @apply block text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-2; }
  .field-input { @apply w-full p-4 bg-teal-light/20 border border-teal-light rounded-xl font-body text-sm outline-none focus:border-brand-teal transition-all; }
  .card { @apply bg-white border border-teal-light rounded-[32px] p-8 md:p-12 shadow-luxury; }
`;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);
  
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${baseUrl}/products/${productId}`);
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
          setImagePreview(result.data.image);
        } else {
          toast.error('Failed to load product');
        }
      } catch (err) {
        toast.error('Error connecting to backend');
      } finally {
        setFetching(false);
      }
    };

    if (productId) fetchProduct();
  }, [productId, baseUrl]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const productData = {
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      description: formData.get('description'),
      status: formData.get('status') || 'Active'
    };

    const payload = new FormData();
    payload.append('product', JSON.stringify(productData));
    
    const imageFile = formData.get('image') as File;
    if (imageFile && imageFile.size > 0) {
      payload.append('image', imageFile);
    }

    try {
      const response = await fetch(`${baseUrl}/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: payload
      });

      const result = await response.json();
      if (response.ok && result.success) {
        toast.success('Collection item updated! ✨');
        router.push('/admin/products');
      } else {
        toast.error(result.error || 'Update failed');
      }
    } catch (err) {
      toast.error('Connection error with backend');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  if (fetching) return <AdminWrapper><div className="p-20 text-center">Loading piece details...</div></AdminWrapper>;
  if (!product) return <AdminWrapper><div className="p-20 text-center text-red-500">Piece not found</div></AdminWrapper>;

  return (
    <AdminWrapper>
       <style>{styles}</style>
       <div className="max-w-4xl mx-auto py-12 px-6">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="font-heading text-4xl text-brand-dark mb-2 italic">Edit Piece</h1>
              <p className="text-[10px] text-brand-rose-gold font-bold tracking-widest uppercase">Refine Sashti jewellery details</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => router.push('/admin/products')}>Back to Inventory</Button>
          </div>

          <form onSubmit={handleSubmit} className="card space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                  <label className="field-label">Product Title</label>
                  <input name="name" defaultValue={product.name} required className="field-input" />
               </div>
               <div>
                  <label className="field-label">Category</label>
                  <select name="category" defaultValue={product.category} required className="field-input">
                     <option value="Necklace">Necklace</option>
                     <option value="Earrings">Earrings</option>
                     <option value="Bangles">Bangles</option>
                     <option value="Bridal Set">Bridal Set</option>
                     <option value="Maang Tikka">Maang Tikka</option>
                  </select>
               </div>
               <div>
                  <label className="field-label">Price (₹)</label>
                  <input name="price" type="number" defaultValue={product.price} required className="field-input" />
               </div>
               <div>
                  <label className="field-label">Stock Status</label>
                  <input name="stock" type="number" defaultValue={product.stock} required className="field-input" />
               </div>
            </div>

            <div>
               <label className="field-label">Piece Description</label>
               <textarea name="description" rows={4} defaultValue={product.description} className="field-input" />
            </div>

            <div>
               <label className="field-label">Status</label>
               <select name="status" defaultValue={product.status || 'Active'} className="field-input">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Out of Stock">Out of Stock</option>
               </select>
            </div>

            <div className="border-2 border-dashed border-teal-light rounded-2xl p-8 text-center bg-teal-light/5">
                {imagePreview ? (
                   <img src={imagePreview} className="h-48 mx-auto rounded-lg mb-4 object-contain shadow-md" />
                ) : (
                   <div className="mb-4 text-brand-teal">📸 No image provided</div>
                )}
                <input name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="img-upload" />
                <label htmlFor="img-upload" className="cursor-pointer px-6 py-2 bg-brand-teal text-white text-[10px] uppercase font-bold tracking-widest rounded-lg hover:bg-brand-dark transition-all">Change Image</label>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-teal-light">
               <Button type="button" variant="outline" onClick={() => router.push('/admin/products')}>Cancel</Button>
               <Button type="submit" disabled={loading} className="bg-brand-rose-gold hover:bg-brand-dark">
                  {loading ? 'Saving Changes...' : 'Update Piece'}
               </Button>
            </div>
          </form>
       </div>
    </AdminWrapper>
  );
}
