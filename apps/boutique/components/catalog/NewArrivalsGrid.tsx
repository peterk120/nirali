'use client';

import { useState, useEffect } from 'react';
import { playfairDisplay, dmSans } from '@/lib/fonts';
import { getNewArrivals } from '@/lib/api';
import type { Product } from '@nirali-sai/types';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Calendar } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';

export default function NewArrivalsGrid() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        console.log('Fetching products...');
        // Fetch products, max 4 items
        const response = await getNewArrivals(4);
        console.log('API Response:', response);
        if (response.success && response.data) {
          console.log('Products data:', response.data);
          // The response data actually contains an array inside it based on the api.ts return type if we inspect carefully
          // getNewArrivals returns { success: boolean, data: Product[], count: number } wrapped in ApiResponse
          // Wait, the getNewArrivals returns ApiResponse<{ success: boolean, data: Product[], count: number }>
          // Which means response.data is an object { success, data, count }. So we need response.data.data.slice()

          const productList = Array.isArray(response.data)
            ? response.data
            : (response.data as any).data || [];

          // Deduplicate based on product ID
          const uniqueProducts: any[] = [];
          const seenIds = new Set();

          for (const product of productList) {
            const id = product.id || product._id;
            if (id && !seenIds.has(id)) {
              seenIds.add(id);
              uniqueProducts.push(product);
            }
          }

          setProducts(uniqueProducts.slice(0, 4));
        } else {
          console.error('Failed to fetch new arrivals:', response.error?.message);
          // Fallback to sample products with real images
          const sampleProducts: any[] = [
            {
              id: '1',
              name: 'Elegant Silk Saree',
              category: 'Sarees',
              price: 8500,
              image: '/dress/saree-1.jpg',
              tags: ['new', 'featured'],
              createdAt: new Date().toISOString(),
              brand: 'Traditional Collection',
              images: ['/dress/saree-1.jpg'],
              description: 'Beautiful silk saree with traditional embroidery',
              basePrice: 8500,
              discountPercentage: 0,
              finalPrice: 8500,
              sizes: [{ size: 'M', isAvailable: true }],
              colors: [{ name: 'Maroon', hexCode: '#800000' }],
              material: 'Silk',
              careInstructions: 'Dry clean only',
              stockQuantity: 5,
              isActive: true,
              isCustomizable: false,
              rentalOptions: [],
              seoMeta: { title: 'Elegant Silk Saree', description: 'Traditional silk saree', keywords: ['saree', 'silk'] },
              updatedAt: new Date().toISOString(),
              availableSizes: ['S', 'M', 'L'],
              isAvailable: true,
              rating: 4.5,
              reviewCount: 12,
              slug: 'elegant-silk-saree'
            },
            {
              id: '2',
              name: 'Designer Lehenga',
              category: 'Lehengas',
              price: 12500,
              image: '/dress/blue dress-1.jpg',
              tags: ['new'],
              createdAt: new Date().toISOString(),
              brand: 'Premium Collection',
              images: ['/dress/blue dress-1.jpg'],
              description: 'Designer lehenga with intricate work',
              basePrice: 12500,
              discountPercentage: 0,
              finalPrice: 12500,
              sizes: [{ size: 'M', isAvailable: true }],
              colors: [{ name: 'Blue', hexCode: '#0000FF' }],
              material: 'Georgette',
              careInstructions: 'Dry clean only',
              stockQuantity: 3,
              isActive: true,
              isCustomizable: true,
              rentalOptions: [],
              seoMeta: { title: 'Designer Lehenga', description: 'Premium designer lehenga', keywords: ['lehenga', 'designer'] },
              updatedAt: new Date().toISOString(),
              availableSizes: ['S', 'M', 'L', 'XL'],
              isAvailable: true,
              rating: 4.8,
              reviewCount: 18,
              slug: 'designer-lehenga'
            },
            {
              id: '3',
              name: 'Chanderi Kurti Set',
              category: 'Kurtis',
              price: 6200,
              image: '/dress/violet dress-1.jpg',
              tags: ['featured'],
              createdAt: new Date().toISOString(),
              brand: 'Casual Wear',
              images: ['/dress/violet dress-1.jpg'],
              description: 'Comfortable chanderi kurti set',
              basePrice: 6200,
              discountPercentage: 0,
              finalPrice: 6200,
              sizes: [{ size: 'M', isAvailable: true }],
              colors: [{ name: 'Violet', hexCode: '#8A2BE2' }],
              material: 'Chanderi',
              careInstructions: 'Machine wash cold',
              stockQuantity: 8,
              isActive: true,
              isCustomizable: false,
              rentalOptions: [],
              seoMeta: { title: 'Chanderi Kurti Set', description: 'Casual chanderi kurti set', keywords: ['kurti', 'chanderi'] },
              updatedAt: new Date().toISOString(),
              availableSizes: ['S', 'M', 'L'],
              isAvailable: true,
              rating: 4.3,
              reviewCount: 9,
              slug: 'chanderi-kurti-set'
            },
            {
              id: '4',
              name: 'Anarkali Suit',
              category: 'Suits',
              price: 7800,
              image: '/dress/saree-1.jpg',
              tags: ['new'],
              createdAt: new Date().toISOString(),
              brand: 'Festive Collection',
              images: ['/dress/saree-1.jpg'],
              description: 'Festive anarkali suit with embroidery',
              basePrice: 7800,
              discountPercentage: 0,
              finalPrice: 7800,
              sizes: [{ size: 'M', isAvailable: true }],
              colors: [{ name: 'Green', hexCode: '#008000' }],
              material: 'Cotton',
              careInstructions: 'Dry clean recommended',
              stockQuantity: 6,
              isActive: true,
              isCustomizable: true,
              rentalOptions: [],
              seoMeta: { title: 'Anarkali Suit', description: 'Festive anarkali suit', keywords: ['anarkali', 'suit'] },
              updatedAt: new Date().toISOString(),
              availableSizes: ['S', 'M', 'L', 'XL'],
              isAvailable: true,
              rating: 4.6,
              reviewCount: 15,
              slug: 'anarkali-suit'
            }
          ];
          setProducts(sampleProducts);
        }
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        // Fallback to sample products with real images
        const sampleProducts: any[] = [
          {
            id: '1',
            name: 'Elegant Silk Saree',
            category: 'Sarees',
            price: 8500,
            image: '/dress/saree-1.jpg',
            tags: ['new', 'featured'],
            createdAt: new Date().toISOString(),
            brand: 'Traditional Collection',
            images: ['/dress/saree-1.jpg'],
            description: 'Beautiful silk saree with traditional embroidery',
            basePrice: 8500,
            discountPercentage: 0,
            finalPrice: 8500,
            sizes: [{ size: 'M', isAvailable: true }],
            colors: [{ name: 'Maroon', hexCode: '#800000' }],
            material: 'Silk',
            careInstructions: 'Dry clean only',
            stockQuantity: 5,
            isActive: true,
            isCustomizable: false,
            rentalOptions: [],
            seoMeta: { title: 'Elegant Silk Saree', description: 'Traditional silk saree', keywords: ['saree', 'silk'] },
            updatedAt: new Date().toISOString(),
            availableSizes: ['S', 'M', 'L'],
            isAvailable: true,
            rating: 4.5,
            reviewCount: 12,
            slug: 'elegant-silk-saree'
          },
          {
            id: '2',
            name: 'Designer Lehenga',
            category: 'Lehengas',
            price: 12500,
            image: '/dress/blue dress-1.jpg',
            tags: ['new'],
            createdAt: new Date().toISOString(),
            brand: 'Premium Collection',
            images: ['/dress/blue dress-1.jpg'],
            description: 'Designer lehenga with intricate work',
            basePrice: 12500,
            discountPercentage: 0,
            finalPrice: 12500,
            sizes: [{ size: 'M', isAvailable: true }],
            colors: [{ name: 'Blue', hexCode: '#0000FF' }],
            material: 'Georgette',
            careInstructions: 'Dry clean only',
            stockQuantity: 3,
            isActive: true,
            isCustomizable: true,
            rentalOptions: [],
            seoMeta: { title: 'Designer Lehenga', description: 'Premium designer lehenga', keywords: ['lehenga', 'designer'] },
            updatedAt: new Date().toISOString(),
            availableSizes: ['S', 'M', 'L', 'XL'],
            isAvailable: true,
            rating: 4.8,
            reviewCount: 18,
            slug: 'designer-lehenga'
          },
          {
            id: '3',
            name: 'Chanderi Kurti Set',
            category: 'Kurtis',
            price: 6200,
            image: '/dress/violet dress-1.jpg',
            tags: ['featured'],
            createdAt: new Date().toISOString(),
            brand: 'Casual Wear',
            images: ['/dress/violet dress-1.jpg'],
            description: 'Comfortable chanderi kurti set',
            basePrice: 6200,
            discountPercentage: 0,
            finalPrice: 6200,
            sizes: [{ size: 'M', isAvailable: true }],
            colors: [{ name: 'Violet', hexCode: '#8A2BE2' }],
            material: 'Chanderi',
            careInstructions: 'Machine wash cold',
            stockQuantity: 8,
            isActive: true,
            isCustomizable: false,
            rentalOptions: [],
            seoMeta: { title: 'Chanderi Kurti Set', description: 'Casual chanderi kurti set', keywords: ['kurti', 'chanderi'] },
            updatedAt: new Date().toISOString(),
            availableSizes: ['S', 'M', 'L'],
            isAvailable: true,
            rating: 4.3,
            reviewCount: 9,
            slug: 'chanderi-kurti-set'
          },
          {
            id: '4',
            name: 'Anarkali Suit',
            category: 'Suits',
            price: 7800,
            image: '/dress/saree-1.jpg',
            tags: ['new'],
            createdAt: new Date().toISOString(),
            brand: 'Festive Collection',
            images: ['/dress/saree-1.jpg'],
            description: 'Festive anarkali suit with embroidery',
            basePrice: 7800,
            discountPercentage: 0,
            finalPrice: 7800,
            sizes: [{ size: 'M', isAvailable: true }],
            colors: [{ name: 'Green', hexCode: '#008000' }],
            material: 'Cotton',
            careInstructions: 'Dry clean recommended',
            stockQuantity: 6,
            isActive: true,
            isCustomizable: true,
            rentalOptions: [],
            seoMeta: { title: 'Anarkali Suit', description: 'Festive anarkali suit', keywords: ['anarkali', 'suit'] },
            updatedAt: new Date().toISOString(),
            availableSizes: ['S', 'M', 'L', 'XL'],
            isAvailable: true,
            rating: 4.6,
            reviewCount: 15,
            slug: 'anarkali-suit'
          }
        ];
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  // Show all products as "New In" for now
  const getBadge = (createdAt: string) => {
    return 'New In';
  };

  // Generate random gradient for each card
  const getRandomGradient = (index: number) => {
    const gradients = [
      'linear-gradient(135deg, #FFF8F0 0%, #FFF1E6 100%)',
      'linear-gradient(135deg, #F8F4FF 0%, #EDE6FF 100%)',
      'linear-gradient(135deg, #F0F8FF 0%, #E6F2FF 100%)',
      'linear-gradient(135deg, #FFF5F5 0%, #FFE6E6 100%)'
    ];
    return gradients[index % gradients.length];
  };

  return (
    <section
      className="py-24 px-12 bg-brand-ivory"
      style={{ padding: '60px 20px', background: '#FAF7F0' }}
    >
      <div className="flex justify-between items-end mb-16" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div className="relative mb-4">
            <div
              className="absolute -left-8 top-1/2 transform -translate-y-1/2 w-8 h-px bg-brand-gold hidden sm:block"
              style={{
                position: 'absolute',
                left: '-32px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '32px',
                height: '1px',
                background: '#C9922A'
              }}
            ></div>
            <span
              className={`${dmSans.className} text-xs font-medium tracking-[0.3em] uppercase`}
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(0.55rem, 2vw, 0.65rem)',
                fontWeight: 500,
                letterSpacing: '0.3em',
                color: '#C9922A'
              }}
            >
              Editor's Pick
            </span>
          </div>
          <h2
            className={`${playfairDisplay.className} text-4xl`}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(1.75rem, 4vw, 2.2rem)',
              fontWeight: 400,
              color: '#1A1A2E',
              lineHeight: 1.2
            }}
          >
            New <em
              className={`${playfairDisplay.className} italic`}
              style={{
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                color: '#C0436A',
                fontWeight: 400
              }}
            >
              Arrivals
            </em>
          </h2>
        </div>
        <a
          href="/catalog/new-arrivals"
          className={`${dmSans.className} text-sm font-normal tracking-[0.15em] uppercase pb-0.5 border-b`}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.65rem, 2vw, 0.7rem)',
            fontWeight: 400,
            letterSpacing: '0.15em',
            color: '#C9922A',
            borderBottom: '1px solid #C9922A',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#A83860';
            e.currentTarget.style.borderColor = '#A83860';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#C9922A';
            e.currentTarget.style.borderColor = '#C9922A';
          }}
        >
          See All New Arrivals →
        </a>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className={`${dmSans.className} text-gray-500`} style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
            Loading new arrivals...
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className={`${dmSans.className} text-gray-500`} style={{ fontSize: 'clamp(0.85rem, 2vw, 1rem)' }}>
            No new arrivals available at the moment.
          </p>
        </div>
      ) : (
        <div
          className="grid grid-cols-4 gap-6"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 'clamp(16px, 3vw, 24px)'
          }}
        >
          {products.map((product, index) => (
            <div
              key={product.id || index}
              className="cursor-pointer transition-all duration-400"
              style={{
                boxShadow: '0 0 0 rgba(192,67,106,0.12)',
                transition: 'box-shadow 0.4s ease',
                maxWidth: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(192,67,106,0.12)';
                // Show wishlist button on hover
                const wishlistBtn = e.currentTarget.querySelector('.feat-wishlist');
                if (wishlistBtn) {
                  (wishlistBtn as HTMLElement).style.opacity = '1';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 rgba(192,67,106,0.12)';
                // Hide wishlist button on leave
                const wishlistBtn = e.currentTarget.querySelector('.feat-wishlist');
                if (wishlistBtn) {
                  (wishlistBtn as HTMLElement).style.opacity = '0';
                }
              }}
            >
              {/* Image Container */}
              <div
                className="relative mb-5 overflow-hidden"
                style={{
                  aspectRatio: '3/4',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: 'clamp(12px, 2vw, 20px)',
                  background: '#F5F0E4',
                  border: '1px solid #FBF1D5'
                }}
              >
                {/* Background gradient */}
                <div
                  className="absolute inset-0 feat-img-bg"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: getRandomGradient(index),
                    transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                  }}
                ></div>

                {/* Actual Product Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover feat-product-img"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'opacity 0.4s ease',
                    opacity: 1  // Ensure image is visible by default
                  }}
                  onError={(e) => {
                    // Fallback to gradient if image fails to load
                    (e.target as HTMLImageElement).style.opacity = '0';
                    // Also show fallback gradient
                    const targetElement = e.target as HTMLElement;
                    const parentElement = targetElement.parentElement;
                    if (parentElement) {
                      const overlay = parentElement.querySelector('.feat-overlay') as HTMLElement;
                      if (overlay) {
                        overlay.style.background = 'linear-gradient(to top, rgba(26,26,46,0.8) 0%, rgba(26,26,46,0.4) 60%, transparent 100%)';
                        overlay.style.opacity = '1';
                      }
                    }
                  }}
                  onLoad={(e) => {
                    // Ensure image is visible when loaded
                    (e.target as HTMLImageElement).style.opacity = '1';
                  }}
                />

                {/* Badge */}
                {getBadge(product.createdAt) && (
                  <div
                    className={`${dmSans.className} absolute top-4 left-4 feat-badge`}
                    style={{
                      position: 'absolute',
                      top: '16px',
                      left: '16px',
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.65rem',
                      fontWeight: 500,
                      letterSpacing: '0.2em',
                      color: '#C0436A',
                      background: 'rgba(250,247,240,0.9)',
                      padding: '6px 12px',
                      borderRadius: '2px',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(192,67,106,0.2)'
                    }}
                  >
                    {getBadge(product.createdAt)}
                  </div>
                )}

                {/* Wishlist button */}
                <div
                  className="absolute top-4 right-4 feat-wishlist cursor-pointer"
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    width: '32px',
                    height: '32px',
                    border: '1px solid rgba(192,67,106,0.3)',
                    background: 'rgba(250,247,240,0.7)',
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    // Add to wishlist functionality
                    console.log(`Added ${product.name} to wishlist`);
                    alert(`Added ${product.name} to your wishlist!`);
                  }}
                >
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#C0436A',
                      lineHeight: 1
                    }}
                  >
                    ♡
                  </span>
                </div>

                {/* Gradient overlay */}
                <div
                  className="absolute inset-0 feat-overlay"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(26,26,46,0.5) 0%, transparent 60%)',
                    opacity: 0,
                    transition: 'opacity 0.4s ease',
                    pointerEvents: 'none'
                  }}
                ></div>

                {/* Content Overlay that slides up on hover (Removed buttons to text area) */}
                <div
                  className="absolute bottom-0 left-0 right-0 feat-quick"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '16px',
                    transform: 'translateY(100%)',
                    transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    background: 'rgba(26,26,46,0.3)',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                </div>
              </div>

              {/* Text Info */}
              <div className="feat-text-info">
                <h3
                  className={`${playfairDisplay.className} mb-1.5 feat-name`}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    fontWeight: 400,
                    color: '#1A1A2E',
                    marginBottom: 'clamp(4px, 1vw, 6px)',
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '2.6em', // Approx 2 lines
                  }}
                >
                  {product.name}
                </h3>

                <p
                  className={`${dmSans.className} mb-3 feat-designer`}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(0.65rem, 2vw, 0.72rem)',
                    fontWeight: 300,
                    color: '#C9922A',
                    marginBottom: 'clamp(8px, 1.5vw, 12px)',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '1.2em'
                  }}
                >
                  {(product as any).designer || product.category || 'Designer'}
                </p>

                <div className="flex items-baseline gap-3 feat-price-row mb-4" style={{ flexWrap: 'wrap', gap: 'clamp(8px, 2vw, 12px)' }}>
                  <span
                    className={`${playfairDisplay.className} feat-price-amount`}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      fontWeight: 500,
                      color: '#C0436A'
                    }}
                  >
                    Rate: ₹{product.price?.toLocaleString()}
                  </span>

                  <span
                    className={`${dmSans.className} feat-price-note`}
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: 'clamp(0.55rem, 2vw, 0.65rem)',
                      fontWeight: 300,
                      color: '#B07E22'
                    }}
                  >
                    /4 days
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    className={`${dmSans.className} flex-1 flex items-center justify-center`}
                    style={{
                      background: 'rgba(192,67,106,1)',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      color: '#FAF7F0',
                      padding: '8px 12px',
                      textTransform: 'uppercase',
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = '#A83860';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(192,67,106,1)';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLoggedIn) {
                        router.push('/login');
                        return;
                      }
                      router.push(`/book/dress?dressId=${product.id || product._id}`);
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reserve
                  </button>
                  <button
                    className={`${dmSans.className} flex-1 flex items-center justify-center`}
                    style={{
                      background: 'transparent',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                      color: '#C0436A',
                      padding: '8px 12px',
                      textTransform: 'uppercase',
                      border: '1px solid #C0436A',
                      outline: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.background = 'rgba(192,67,106,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.background = 'transparent';
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Simple alert placeholder for Add to Cart
                      alert(`Added ${product.name} to cart!`);
                    }}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}