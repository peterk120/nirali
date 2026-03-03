import { Toast } from 'react-hot-toast';

interface BookingConfirmationToastProps {
  t: Toast;
  bookingId: string;
}

const BookingConfirmationToast = ({ t, bookingId }: BookingConfirmationToastProps) => {
  return (
    <div
      className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
        max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto 
        flex ring-1 ring-black ring-opacity-5 border-l-4`}
      style={{ borderLeftColor: '#C9922A' }} // brand-gold
    >
      <div className="flex-1 p-4">
        <div className="flex items-start">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Booking Confirmed!</p>
            <p className="mt-1 text-sm text-gray-500">
              Your booking ID: <strong>{bookingId}</strong>
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        <button
          onClick={() => navigator.clipboard.writeText(bookingId)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none"
        >
          Copy
        </button>
        <button
          onClick={() => {
            const whatsappUrl = `https://wa.me/?text=My%20booking%20ID:%20${encodeURIComponent(bookingId)}`;
            window.open(whatsappUrl, '_blank');
          }}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-green-600 hover:text-green-500 focus:outline-none"
        >
          WhatsApp
        </button>
      </div>
    </div>
  );
};

export default BookingConfirmationToast;