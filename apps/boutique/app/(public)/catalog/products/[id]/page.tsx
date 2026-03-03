import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Product from '../../../../../models/Product';
import connectToDatabase from '../../../../../lib/mongodb';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  try {
    await connectToDatabase();
    const product = await Product.findById(params.id);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.'
      };
    }
    
    return {
      title: `${product.name} — Nirali Sai Boutique`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
        images: [
          {
            url: product.image,
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  let product: any = null;
  
  try {
    await connectToDatabase();
    product = await Product.findById(params.id);
    
    if (!product) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-96 object-contain md:h-full"
              onError={(e) => {
                console.error('Image load error for product:', product.name, e);
                // Set fallback image
                e.currentTarget.src = '/placeholder-product.jpg';
              }}
            />
          </div>
          <div className="md:w-1/2 p-8">
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-4">
              <p className="text-3xl font-bold text-brand-rose">₹{product.price.toLocaleString()}</p>
              <p className="text-gray-600 mt-2">Category: {product.category}</p>
              <p className="text-gray-600">Status: {product.status}</p>
              <p className="text-gray-600">Stock: {product.stock}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
            <div className="mt-8">
              <button className="w-full bg-brand-rose text-white py-3 px-4 rounded-lg hover:bg-brand-rose/90 transition-colors">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}