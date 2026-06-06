"use client";

import { useState, useEffect } from 'react';
import { Booking } from '@/src/types/booking';
import { bookingService } from '@/src/services/bookingService';
import BookingTable from './components/BookingTable';
import CreateBookingModal from './components/CreateBookingModal';
import LogoutButton from './components/LogoutButton';

/**
 * Owner Page Component
 * Manages booking display, creation, and deletion for owner users
 * Implements proper state management, error handling, and data refresh logic
 */
export default function OwnerPage() {
  // State management for bookings data
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [ownBookings, setOwnBookings] = useState<Booking[]>([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Calculate summary data from bookings
   */
  const summary = {
    totalBookings: allBookings.length,
    totalHours: allBookings.reduce((acc, booking) => {
      const start = new Date(booking.startTime).getTime();
      const end = new Date(booking.endTime).getTime();
      const diffInHours = (end - start) / (1000 * 60 * 60);
      return acc + diffInHours;
    }, 0).toFixed(1),
    activeUsers: new Set(allBookings.map((b: any) => b.userId)).size
  };

  /**
   * Fetch bookings and summary from API on component mount
   */
  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Fetch bookings from the API
   * Updates state with fetched data or error message
   */
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all bookings and own bookings in parallel
      const [allData, ownData] = await Promise.all([
        bookingService.ownerGetAllBookings(),
        bookingService.ownerGetOwnBookings()
      ]);

      console.log('Owner all bookings response:', allData);
      console.log('Owner own bookings response:', ownData);

      setAllBookings(allData);
      setOwnBookings(ownData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle booking deletion
   * Shows confirmation dialog and calls delete API
   * Refreshes data after successful deletion
   */
  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) {
      return;
    }

    try {
      await bookingService.deleteBooking(id);
      alert('Booking deleted successfully!');
      
      // Refresh data after successful deletion
      await fetchData();
    } catch (err: any) {
      console.error('Delete failed:', err.response?.data || err.message);
      alert(`Failed to delete booking: ${err.response?.data?.message || 'Internal Server Error'}`);
    }
  };

  /**
   * Render error state
   */
  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
          {error}
          <button 
            onClick={fetchData}
            className="ml-4 underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      {/* Header with title and action buttons */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Owner Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage your meeting room reservations</p>
          </div>
          <div className="flex gap-4">
            <CreateBookingModal onSuccess={fetchData} />
            <LogoutButton />
          </div>
        </div>

        {/* Summary Section */}
        {summary && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-green-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Total Bookings</p>
                <p className="text-3xl font-bold text-green-600">{summary.totalBookings || 0}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Total Hours</p>
                <p className="text-3xl font-bold text-blue-600">{summary.totalHours || 0}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Active Users</p>
                <p className="text-3xl font-bold text-gray-700">{summary.activeUsers || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error message (if any) */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6 shadow-sm">
            <div className="flex items-center">
              <span className="mr-3">⚠️</span>
              <span>{error}</span>
              <button 
                onClick={fetchData}
                className="ml-4 underline hover:text-red-900 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Bookings display */}
        <div className="space-y-10">
          {/* All Bookings Table */}
          <BookingTable 
            bookings={allBookings} 
            title="All Bookings" 
            isLoading={isLoading}
          />
          
          {/* My Bookings Table with delete actions */}
          <BookingTable 
            bookings={ownBookings} 
            title="My Bookings" 
            showActions={true}
            onDelete={handleDeleteBooking}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
