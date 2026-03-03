import toast from 'react-hot-toast';
import BookingConfirmationToast from '../components/ui/BookingConfirmationToast';

// Helper function to determine brand color based on current path
const getBrandColor = () => {
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname.includes('/bridal-jewels')) return '#C9922A'; // brand-gold
    if (pathname.includes('/sasthik')) return '#0D9488'; // brand-teal
    if (pathname.includes('/tamilsmakeover')) return '#9D174D'; // brand-plum
    return '#C0436A'; // brand-rose (default for boutique)
  }
  return '#C0436A'; // default to boutique
};

export const showSuccess = (message: string, icon?: string) => {
  toast.success(message, {
    icon: icon || '✓',
    style: {
      borderLeft: `4px solid ${getBrandColor()}`,
      background: '#FFFFFF',
      color: '#000000',
    },
    duration: 3000,
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    style: {
      borderLeft: '4px solid #EF4444',
      background: '#FFFFFF',
      color: '#000000',
    },
    duration: 5000,
  });
};

export const showBookingConfirmed = (bookingId: string) => {
  toast.success(`Booking confirmed! ID: ${bookingId}`, {
    icon: '✅',
    style: {
      borderLeft: '4px solid #10B981',
      background: '#FFFFFF',
      color: '#000000',
    },
    duration: 8000,
  });
};

export const showAddedToWishlist = (itemName: string) => {
  toast.success(`${itemName} added to wishlist`, {
    icon: '❤️',
    style: {
      borderLeft: `4px solid ${getBrandColor()}`,
      background: '#FFFFFF',
      color: '#000000',
    },
    duration: 3000,
  });
};

export const showAddedToCart = (itemName: string) => {
  toast.success(`${itemName} added to cart`, {
    icon: '🛒',
    style: {
      borderLeft: `4px solid ${getBrandColor()}`,
      background: '#FFFFFF',
      color: '#000000',
    },
    duration: 3000,
  });
};

export const showPaymentSuccess = (amount: number) => {
  toast.success(`Payment of ₹${amount} successful`, {
    icon: '💳',
    style: {
      borderLeft: `4px solid ${getBrandColor()}`,
      background: '#FFFFFF',
      color: '#000000',
    },
    duration: 3000,
  });
};

export const showCopied = (text?: string) => {
  const message = text ? `${text} copied to clipboard` : 'Copied to clipboard';
  toast.success(message, {
    icon: '📋',
    style: {
      borderLeft: `4px solid ${getBrandColor()}`,
      background: '#FFFFFF',
      color: '#000000',
    },
    duration: 3000,
  });
};

export default {
  showSuccess,
  showError,
  showBookingConfirmed,
  showAddedToWishlist,
  showAddedToCart,
  showPaymentSuccess,
  showCopied,
};