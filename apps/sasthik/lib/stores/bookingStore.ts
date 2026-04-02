import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Dress {
  id: string;
  name: string;
  category: string;
  images: string[];
  rentalPricePerDay: number;
  depositAmount: number;
  sizes: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  slug: string;
  tags: string[];
  description?: string;
  fabric?: string;
  weight?: string;
  embroidery?: string;
  colors?: string[];
}

interface BookingState {
  step: number;
  selectedDress: Dress | null;
  selectedDate: Date | null;
  returnDate: Date | null;
  rentalDuration: number; // in days
  selectedSize: string | null;
  productSizeSelections: Record<string, string>; // productId -> size mapping for multi-item bookings
  customMeasurements: string;
  specialInstructions: string;
  selectedJewellery: string[];
  userProfile: {
    name: string;
    email: string;
    phone: string;
    address: string;
  } | null;
  advancePaid: number;
  depositPaid: number;
  termsAccepted: boolean;
  bookingId: string | null;
  bookingItems: any[]; // Support for multiple items from cart

  // Actions
  setStep: (step: number) => void;
  setSelectedDress: (dress: Dress) => void;
  setBookingItems: (items: any[]) => void;
  setSelectedDate: (date: Date) => void;
  setReturnDate: (date: Date) => void;
  setRentalDuration: (duration: number) => void;
  setSelectedSize: (size: string) => void;
  setSelectedSizeForProduct: (productId: string, size: string) => void;
  setCustomMeasurements: (measurements: string) => void;
  setSpecialInstructions: (instructions: string) => void;
  setSelectedJewellery: (jewellery: string[]) => void;
  setUserProfile: (profile: any) => void;
  setAdvancePaid: (amount: number) => void;
  setDepositPaid: (amount: number) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setBookingId: (id: string) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      step: 1,
      selectedDress: null,
      selectedDate: null,
      returnDate: null,
      rentalDuration: 1,
      selectedSize: null,
      productSizeSelections: {}, // Initialize empty object for product size mappings
      customMeasurements: '',
      specialInstructions: '',
      selectedJewellery: [],
      userProfile: null,
      advancePaid: 0,
      depositPaid: 0,
      termsAccepted: false,
      bookingId: null,
      bookingItems: [],

      setStep: (step) => set({ step }),
      setSelectedDress: (dress) => set({ selectedDress: dress }),
      setSelectedDate: (date) => set({ selectedDate: date }),
      setReturnDate: (date) => set({ returnDate: date }),
      setRentalDuration: (duration) => set({ rentalDuration: duration }),
      setSelectedSize: (size) => set({ selectedSize: size }),
      setSelectedSizeForProduct: (productId, size) => 
        set((state) => ({ 
          productSizeSelections: { ...state.productSizeSelections, [productId]: size } 
        })),
      setCustomMeasurements: (measurements) => set({ customMeasurements: measurements }),
      setSpecialInstructions: (instructions) => set({ specialInstructions: instructions }),
      setSelectedJewellery: (jewellery) => set({ selectedJewellery: jewellery }),
      setUserProfile: (profile) => set({ userProfile: profile }),
      setAdvancePaid: (amount) => set({ advancePaid: amount }),
      setDepositPaid: (amount) => set({ depositPaid: amount }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
      setBookingId: (id) => set({ bookingId: id }),
      setBookingItems: (items) => set({ bookingItems: items }),
      resetBooking: () => set({
        step: 1,
        selectedDress: null,
        selectedDate: null,
        returnDate: null,
        rentalDuration: 1,
        selectedSize: null,
        productSizeSelections: {}, // Reset product sizes too
        customMeasurements: '',
        specialInstructions: '',
        selectedJewellery: [],
        userProfile: null,
        advancePaid: 0,
        depositPaid: 0,
        termsAccepted: false,
        bookingId: null,
        bookingItems: [],
      })
    }),
    {
      name: 'booking-storage', // unique name
      partialize: (state) => ({
        step: state.step,
        selectedDress: state.selectedDress,
        selectedDate: state.selectedDate,
        returnDate: state.returnDate,
        rentalDuration: state.rentalDuration,
        selectedSize: state.selectedSize,
        productSizeSelections: state.productSizeSelections, // Persist individual product sizes
        customMeasurements: state.customMeasurements,
        specialInstructions: state.specialInstructions,
        selectedJewellery: state.selectedJewellery,
        userProfile: state.userProfile,
        advancePaid: state.advancePaid,
        depositPaid: state.depositPaid,
        termsAccepted: state.termsAccepted,
        bookingId: state.bookingId,
        bookingItems: state.bookingItems
      }), // only persist booking state
      onRehydrateStorage: () => (state) => {
        // Convert string dates back to Date objects after rehydration
        if (state) {
          if (typeof state.selectedDate === 'string') {
            state.selectedDate = new Date(state.selectedDate);
          }
          if (typeof state.returnDate === 'string') {
            state.returnDate = new Date(state.returnDate);
          }
        }
      }
    }
  )
);