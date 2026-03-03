import { toast } from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showInfo = (message: string) => {
  toast(message);
};

export const showAddedToWishlist = (itemName: string) => {
  toast.success(`${itemName} added to wishlist!`);
};

export const showAddedToCart = (itemName: string) => {
  toast.success(`${itemName} added to cart!`);
};

export const showBookingConfirmed = (bookingId: string) => {
  toast.success(`Booking ${bookingId} confirmed!`);
};

export const showReviewSubmitted = () => {
  toast.success('Review submitted successfully!');
};