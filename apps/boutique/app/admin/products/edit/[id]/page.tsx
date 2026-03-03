'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { verifyToken } from '../../../../../lib/auth';
import AdminWrapper from '../../../AdminWrapper';
import { Button } from '../../../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@nirali-sai/ui';
import { toast } from 'react-hot-toast';

const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0, 'Price must be greater than 0'),
  stock: z.number().min(0, 'Stock must be at least 0'),
  description: z.string().min(1, 'Description is required'),
});

// Define type for form values
interface ProductFormValues {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  image?: FileList;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [initialImageUrl, setInitialImageUrl] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: 'Classic Lehenga', // Will be populated from API
      category: 'Lehenga',
      price: 5000,
      stock: 5,
      description: 'Elegant classic lehenga with intricate embroidery',
    },
  });

  const imageFile = watch('image');

  // Handle image preview
  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const file = imageFile[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Cleanup the preview URL when component unmounts or image changes
      return () => URL.revokeObjectURL(previewUrl);
    } else {
      setImagePreview(null);
    }
  }, [imageFile]);

  // In a real app, you would fetch product data based on productId
  useEffect(() => {
    // Mock API call to fetch product data
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const product = await response.json();
          
          // Set form values with fetched data
          reset({
            name: product.name,
            category: product.category,
            price: product.price,
            stock: product.stock,
            description: product.description,
          });
          
          // Store the initial image URL
          if (product.imageUrl) {
            setInitialImageUrl(product.imageUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product data');
      }
    };
    
    if (productId) {
      fetchProduct();
    }
  }, [productId, reset]);

  const onSubmit = async (formData: ProductFormValues) => {
    try {
      // Extract the image file separately
      const { image, ...productData } = formData;
      
      // Create FormData to send to the API
      const productFormData = new FormData();
      productFormData.append('product', JSON.stringify(productData));
      
      // Add the image file if provided
      if (image && image.length > 0) {
        productFormData.append('image', image[0]);
      }
      
      // Send to API for update
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        body: productFormData, // Send as form data to handle file upload
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        toast.success('Product updated successfully!');
        router.push('/admin/products');
      } else {
        toast.error(result.error || 'Failed to update product');
      }
    } catch (error) {
      toast.error('Failed to update product');
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const checkAuth = async () => {
      try {
        const payload = await verifyToken(token);
        if (payload.role !== 'admin') {
          router.push('/'); // Redirect non-admins to home
        }
      } catch (error) {
        // If token is invalid, redirect to login
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <AdminWrapper>
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Product</h2>
              <p className="mt-1 text-sm text-gray-600">Update the product information</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Product Name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="name"
                        {...register('name', { valueAsNumber: false })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-rose focus:border-brand-rose ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <div className="mt-1">
                      <select
                        id="category"
                        {...register('category')}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-rose focus:border-brand-rose ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select Category</option>
                        <option value="Lehenga">Lehenga</option>
                        <option value="Saree">Saree</option>
                        <option value="Gown">Gown</option>
                        <option value="Anarkali">Anarkali</option>
                        <option value="Kurta">Kurta</option>
                        <option value="Jewellery">Jewellery</option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (per day)
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="price"
                        {...register('price', { valueAsNumber: true })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-rose focus:border-brand-rose ${
                          errors.price ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-3">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                      Stock Quantity
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        id="stock"
                        {...register('stock', { valueAsNumber: true })}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-rose focus:border-brand-rose ${
                          errors.stock ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.stock && (
                        <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        rows={4}
                        {...register('description')}
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-brand-rose focus:border-brand-rose ${
                          errors.description ? 'border-red-500' : 'border-gray-300'
                        }`}
                      ></textarea>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="sm:col-span-6">
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Product Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        {/* Image preview - show either the new uploaded image or the existing one */}
                        {(imagePreview || initialImageUrl) ? (
                          <div className="mb-4">
                            <img 
                              src={imagePreview || initialImageUrl || ''} 
                              alt="Product Preview" 
                              className="mx-auto h-40 w-auto object-contain rounded-md"
                            />
                          </div>
                        ) : (
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="image" className="relative cursor-pointer bg-white rounded-md font-medium text-brand-rose hover:text-brand-rose/90">
                            <span>Upload a file</span>
                            <input 
                              id="image" 
                              name="image" 
                              type="file" 
                              className="sr-only" 
                              accept="image/*" 
                              {...register('image')} 
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/products')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-brand-rose hover:bg-brand-rose/90"
                  >
                    Update Product
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </AdminWrapper>
  );
}