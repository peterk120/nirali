import { useState } from 'react';
import { Button } from '../../components/ui/button';
import Image from 'next/image';
import { DepositStatusBadge } from '../booking/DepositStatusBadge';

interface Booking {
  id: string;
  dress: {
    id: string;
    name: string;
    category: string;
    image: string;
  };
  startDate: Date;
  endDate: Date;
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  amountPaid: number;
  depositStatus: 'held' | 'refunded' | 'refund_initiated';
  refundAmount?: number;
}

interface BookingCardProps {
  booking: Booking;
  onCancelBooking: (id: string) => void;
  onRescheduleBooking: (id: string) => void;
  onMarkReturned: (id: string) => void;
  onReportDamage: (id: string) => void;
  onLeaveReview: (id: string) => void;
  onBookAgain: (id: string) => void;
  onViewRefundStatus: (id: string) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancelBooking,
  onRescheduleBooking,
  onMarkReturned,
  onReportDamage,
  onLeaveReview,
  onBookAgain,
  onViewRefundStatus
}) => {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  const handleConfirmCancel = () => {
    if (cancellationReason.trim()) {
      onCancelBooking(booking.id);
      setIsCancelModalOpen(false);
      setCancellationReason('');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = () => {
    switch (booking.status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'active':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderActionButtons = () => {
    switch (booking.status) {
      case 'upcoming':
        return (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsCancelModalOpen(true)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Cancel
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onRescheduleBooking(booking.id)}
            >
              Reschedule
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              WhatsApp
            </Button>
          </div>
        );
      case 'active':
        return (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onMarkReturned(booking.id)}
              className="bg-brand-rose hover:bg-brand-rose/90 text-white"
            >
              Mark as Returned
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReportDamage(booking.id)}
            >
              Report Damage
            </Button>
          </div>
        );
      case 'completed':
        return (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onLeaveReview(booking.id)}
            >
              Leave Review
            </Button>
            <Button 
              size="sm"
              onClick={() => onBookAgain(booking.id)}
              className="bg-brand-rose hover:bg-brand-rose/90 text-white"
            >
              Book Again
            </Button>
          </div>
        );
      case 'cancelled':
        return (
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewRefundStatus(booking.id)}
            >
              View Refund Status
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Dress Thumbnail */}
          <div className="flex-shrink-0">
            <div className="w-24 h-32 rounded-lg overflow-hidden">
              <Image
                src={booking.dress.image || '/placeholder-dress.jpg'}
                alt={booking.dress.name}
                width={96}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Booking Details */}
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h3 className="font-bold text-lg text-gray-900">{booking.dress.name}</h3>
                <p className="text-gray-600">{booking.dress.category}</p>
                
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-gray-900 font-medium">
                    {formatDate(booking.startDate)}
                  </span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(booking.endDate)}
                  </span>
                </div>
                
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-gray-600 text-sm">Booking ID: </span>
                    <span className="font-medium">{booking.id}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 text-sm">Amount Paid: </span>
                    <span className="font-medium">₹{booking.amountPaid.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <span className="text-gray-600 text-sm">Deposit: </span>
                    <DepositStatusBadge status={booking.depositStatus} />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-6">
              {renderActionButtons()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Cancel Booking Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Cancel Booking</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to cancel this booking? Please note our cancellation policy applies.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Cancellation *
              </label>
              <select
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-rose focus:border-brand-rose"
              >
                <option value="">Select a reason</option>
                <option value="change_of_plans">Change of Plans</option>
                <option value="found_alternative">Found Alternative</option>
                <option value="budget_constraints">Budget Constraints</option>
                <option value="event_cancelled">Event Cancelled</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Refund Policy:</span> Cancellations made more than 7 days before booking date are eligible for a 90% refund. Cancellations made 3-7 days before are eligible for a 50% refund. Cancellations made less than 3 days before are non-refundable.
              </p>
            </div>
            
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Close
              </Button>
              <Button
                onClick={handleConfirmCancel}
                disabled={!cancellationReason.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm Cancellation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};