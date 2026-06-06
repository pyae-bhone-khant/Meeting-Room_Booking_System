"use client";

import { Booking } from '@/src/types/booking';

/**
 * Props interface for BookingTable component
 */
interface BookingTableProps {
  /** Array of bookings to display */
  bookings: Booking[];
  /** Table title/header text */
  title: string;
  /** Whether to show delete action button */
  showActions?: boolean;
  /** Callback function when delete button is clicked */
  onDelete?: (id: string) => void;
  /** Loading state indicator */
  isLoading?: boolean;
}

/**
 * BookingTable Component
 * Displays bookings in a clean table format with optional delete actions
 * Handles empty states and loading states gracefully
 */
export default function BookingTable({ 
  bookings, 
  title, 
  showActions = false, 
  onDelete,
  isLoading = false 
}: BookingTableProps) {
  // Display loading state
  if (isLoading) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-bounce delay-200"></div>
            <span className="ml-3 text-gray-600">Loading bookings...</span>
          </div>
        </div>
      </div>
    );
  }

  // Display empty state
  if (!bookings || bookings.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
        <div className="bg-white rounded-2xl shadow-lg p-12 border border-gray-100 text-center">
          <div className="text-6xl mb-4">📅</div>
          <p className="text-gray-600 text-lg">No bookings found</p>
          <p className="text-gray-400 text-sm mt-2">Create a new booking to get started</p>
        </div>
      </div>
    );
  }

  // Display bookings table
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="space-y-4">
        {Array.isArray(bookings) && bookings.map((item: any, index: number) => (
          <div 
            key={item.id} 
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex items-center justify-between border border-gray-100 hover:border-green-200 group"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {item.roomNo?.charAt(0) || 'R'}
                </div> */}
                <div>
                  <h3 className="font-bold text-xl text-gray-800">{item.roomNo}</h3>
                  <p className="text-gray-500 text-sm">{item.location}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Date</p>
                <p className="text-gray-700 font-medium">{new Date(item.startDate).toLocaleDateString()}</p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Time</p>
                <p className="text-gray-700 font-medium">
                  {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                  {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold">Type</p>
                <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                  {item.roomType}
                </span>
              </div>
            </div>
            
            {/* Delete Button */}
            {showActions && (
              <button 
                onClick={() => onDelete?.(item.id)} 
                className="ml-6 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
