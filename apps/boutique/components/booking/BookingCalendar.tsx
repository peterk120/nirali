import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCalendarProps {
  bookedDates: string[];
  limitedDates: string[];
  onDateSelect: (date: Date) => void;
  minDate?: Date;
  dressId?: string;
  onAvailabilityChange?: (availableDresses: number, date: Date) => void;
}

const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookedDates = [],
  limitedDates = [],
  onDateSelect,
  minDate,
  dressId,
  onAvailabilityChange
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [availableDresses, setAvailableDresses] = useState<number | null>(null);

  // Convert date strings to Date objects for easier comparison
  const bookedDatesObj = bookedDates.map(dateStr => new Date(dateStr));
  const limitedDatesObj = limitedDates.map(dateStr => new Date(dateStr));

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Format date as YYYY-MM-DD string
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if date is in booked dates
  const isBooked = (date: Date): boolean => {
    return bookedDatesObj.some(bookedDate => 
      formatDate(bookedDate) === formatDate(date)
    );
  };

  // Check if date is in limited dates
  const isLimited = (date: Date): boolean => {
    return limitedDatesObj.some(limitedDate => 
      formatDate(limitedDate) === formatDate(date)
    );
  };

  // Check if date is in the past
  const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Check if date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return formatDate(today) === formatDate(date);
  };

  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isBooked(date) || isPast(date)) return;
    
    setSelectedDate(date);
    onDateSelect(date);
    
    // Simulate fetching available dresses for the selected date
    if (dressId) {
      // In a real app, this would call an API
      const mockAvailableDresses = Math.floor(Math.random() * 5) + 1; // Random 1-5 dresses
      setAvailableDresses(mockAvailableDresses);
      if (onAvailabilityChange) {
        onAvailabilityChange(mockAvailableDresses, date);
      }
    }
  };

  // Navigate to previous month
  const prevMonth = () => {
    setLoading(true);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setTimeout(() => setLoading(false), 300); // Simulate loading
  };

  // Navigate to next month
  const nextMonth = () => {
    setLoading(true);
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setTimeout(() => setLoading(false), 300); // Simulate loading
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      days.push(date);
    }
    
    return days;
  };

  // Format month and year for display
  const formatMonthYear = (date: Date): string => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Days of the week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const calendarDays = generateCalendarDays();

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          disabled={loading}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5 text-gray-700" />
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentDate.getMonth()}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="text-lg font-semibold text-gray-900"
          >
            {formatMonthYear(currentDate)}
          </motion.div>
        </AnimatePresence>
        
        <button
          onClick={nextMonth}
          disabled={loading}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-7 gap-1 mb-2">
          {Array.from({ length: 42 }).map((_, index) => (
            <div 
              key={index} 
              className="aspect-square flex items-center justify-center rounded-full bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Calendar Grid */}
      {!loading && (
        <>
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map(day => (
              <div 
                key={day} 
                className="text-center text-xs font-medium text-gray-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isBookedDate = isBooked(date);
              const isLimitedDate = isLimited(date);
              const isPastDate = isPast(date);
              const isSelected = selectedDate && formatDate(selectedDate) === formatDate(date);
              const isTodayDate = isToday(date);

              let cellClass = "flex items-center justify-center text-sm font-medium rounded-full aspect-square ";
              
              if (isPastDate) {
                cellClass += "text-gray-400 cursor-not-allowed ";
              } else if (isSelected) {
                cellClass += "bg-brand-rose text-white ";
              } else if (isBookedDate) {
                cellClass += "bg-red-50 text-gray-400 line-through cursor-not-allowed ";
              } else if (isLimitedDate) {
                cellClass += "bg-amber-50 text-amber-800 font-medium ";
              } else {
                cellClass += "text-gray-900 hover:bg-brand-rose/10 ";
              }

              if (isTodayDate && !isSelected) {
                cellClass += "border-2 border-brand-gold ";
              }

              return (
                <motion.button
                  key={index}
                  whileHover={!isBookedDate && !isPastDate ? { scale: 1.1 } : {}}
                  whileTap={!isBookedDate && !isPastDate ? { scale: 0.95 } : {}}
                  className={`${cellClass} ${!isBookedDate && !isPastDate ? 'cursor-pointer' : ''}`}
                  onClick={() => handleDateClick(date)}
                  disabled={isBookedDate || isPastDate}
                  aria-label={`Select ${date.toDateString()}`}
                >
                  {isLimitedDate && !isBookedDate ? (
                    <span className="relative">
                      {date.getDate()}
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[0.6rem] text-white">
                        !
                      </span>
                    </span>
                  ) : (
                    date.getDate()
                  )}
                </motion.button>
              );
            })}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4 mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-white border border-gray-300 mr-2"></div>
          <span className="text-xs text-gray-600">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <span className="text-xs text-gray-600">Limited</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-100 mr-2"></div>
          <span className="text-xs text-gray-600">Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-brand-gold mr-2"></div>
          <span className="text-xs text-gray-600">Today</span>
        </div>
      </div>

      {/* Availability Info */}
      {selectedDate && availableDresses !== null && (
        <div className="mt-4 p-3 bg-brand-rose/10 rounded-lg text-center">
          <p className="text-sm text-gray-700">
            <span className="font-medium">{availableDresses}</span> dresses available on{' '}
            <span className="font-medium">
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </p>
          <button className="mt-2 text-sm text-brand-rose hover:underline">
            View available dresses
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCalendar;