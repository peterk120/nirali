import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import { Button } from './button';

interface Dress {
  id: string;
  name: string;
  price: number;
  category: string;
  color: string;
  size: string;
  image: string;
  isFavorite: boolean;
}

interface DressCardProps {
  dress: Dress;
  viewMode?: 'grid' | 'list';
}

export const DressCard: React.FC<DressCardProps> = ({ dress, viewMode = 'grid' }) => {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState(dress.isFavorite);
  
  const handleRentNow = () => {
    router.push(`/book/dress?dressId=${dress.id}`);
  };
  
  const handleDetails = () => {
    router.push(`/catalog/dresses/${dress.id}`);
  };
  
  const handleWishlist = async () => {
    try {
      setIsWishlisted(!isWishlisted);
      // In a real app, this would call an API to update the wishlist
      console.log(`${isWishlisted ? 'Removed from' : 'Added to'} wishlist: ${dress.name}`);
    } catch (error) {
      console.error('Error updating wishlist:', error);
      setIsWishlisted(isWishlisted); // Revert state on error
    }
  };
  // Debug: Log dress data
  console.log('DressCard - Dress data:', dress);
  
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${viewMode === 'grid' ? 'flex flex-col h-full' : 'flex'}`}>
      <div className={`${viewMode === 'grid' ? 'relative' : 'relative w-32 flex-shrink-0'}`}>
        {dress.image ? (
          <img 
            src={dress.image} 
            alt={dress.name} 
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              console.error('Image load error for product:', dress.name, dress.image, e);
              // Set fallback image
              e.currentTarget.src = 'https://res.cloudinary.com/dxkqm1ifi/image/upload/v1707123456/nirali-sai-boutique/default-product.jpg';
            }}
          />
        ) : (
          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center">
            <span className="text-gray-500">No Image</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full"
          aria-label={isWishlisted ? "Remove from favorites" : "Add to favorites"}
          onClick={handleWishlist}
        >
          <Heart 
            className={`w-5 h-5 ${isWishlisted ? 'fill-current text-red-500' : 'text-gray-500'}`} 
          />
        </Button>
      </div>
      
      <div className={`p-4 ${viewMode === 'grid' ? 'flex-1 flex flex-col' : 'flex-1 ml-4'}`}>
        <h3 className="font-semibold text-gray-900">{dress.name}</h3>
        <p className="text-brand-rose font-bold mt-1">₹{dress.price.toLocaleString()}</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {dress.category}
          </span>
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            Size: {dress.size}
          </span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-brand-rose hover:bg-brand-rose/90"
            onClick={handleRentNow}
          >
            Rent Now
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="border-brand-rose text-brand-rose hover:bg-brand-rose/10"
            onClick={handleDetails}
          >
            Details
          </Button>
        </div>
      </div>
    </div>
  );
};