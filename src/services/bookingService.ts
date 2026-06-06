import axios from 'axios';
import { Booking, CreateBookingData } from '@/src/types/booking';

/**
 * Axios instance for booking API requests
 * Configured with base URL and credentials for cookie-based auth
 */
const bookingApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

/**
 * Booking Service - Handles all booking-related API operations
 * Provides methods for fetching, creating, and deleting bookings
 */
export const bookingService = {
  /**
   * Fetch all bookings from the API
   * @returns Promise<Booking[]> - Array of all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    try {
      const response = await bookingApiClient.get<any>('/api/user/getAllBookings');
      // Handle different response structures (might be wrapped in Allbooking property)
      const data = response.data;
      const bookings = data?.Allbooking || data;
      return Array.isArray(bookings) ? bookings : [];
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  },

  /**
   * Fetch current user's bookings from the API
   * @returns Promise<Booking[]> - Array of user's bookings
   */
  async getOwnBookings(): Promise<Booking[]> {
    try {
      const response = await bookingApiClient.get<any>('/api/user/getOwnBooking');
      // Handle different response structures
      const data = response.data;
      console.log('getOwnBooking raw response:', data);
      // Backend returns { success: true, data: [...] }
      const bookings = data?.data || data?.bookings || data?.Allbooking || data?.ownBookings || data;
      console.log('Extracted bookings:', bookings);
      return Array.isArray(bookings) ? bookings : [];
    } catch (error) {
      console.error('Error fetching own bookings:', error);
      throw error;
    }
  },

  /**
   * Create a new booking
   * @param bookingData - Booking details to create
   * @returns Promise<Booking> - Created booking data
   */
  async createBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      const response = await bookingApiClient.post<Booking>('/api/user/createBooking', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Delete a booking by ID
   * @param id - Booking ID to delete
   * @returns Promise<void>
   */
  async deleteBooking(id: string): Promise<void> {
    try {
      await bookingApiClient.delete(`/api/user/deleteBooking/${id}`);
    } catch (error) {
      console.error('Error deleting booking:', error);
      throw error;
    }
  },

  /**
   * Fetch all bookings from the API (Owner)
   * @returns Promise<Booking[]> - Array of all bookings
   */
  async ownerGetAllBookings(): Promise<Booking[]> {
    try {
      const response = await bookingApiClient.get<any>('/api/owner/getAllBookings');
      const data = response.data;
      const bookings = data?.Allbooking || data;
      return Array.isArray(bookings) ? bookings : [];
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  },

  /**
   * Fetch current owner's bookings from the API
   * @returns Promise<Booking[]> - Array of owner's bookings
   */
  async ownerGetOwnBookings(): Promise<Booking[]> {
    try {
      const response = await bookingApiClient.get<any>('/api/owner/getOwnBooking');
      const data = response.data;
      const bookings = data?.data || data?.bookings || data?.Allbooking || data;
      return Array.isArray(bookings) ? bookings : [];
    } catch (error) {
      console.error('Error fetching own bookings:', error);
      throw error;
    }
  },

  /**
   * Create a new booking (Owner)
   * @param bookingData - Booking details to create
   * @returns Promise<Booking> - Created booking data
   */
  async ownerCreateBooking(bookingData: CreateBookingData): Promise<Booking> {
    try {
      const response = await bookingApiClient.post<Booking>('/api/owner/createBooking', bookingData);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Fetch owner summary from the API
   * @returns Promise<any> - Owner summary data
   */
  async ownerGetSummary(): Promise<any> {
    try {
      const response = await bookingApiClient.get<any>('/api/owner/summary');
      return response.data;
    } catch (error) {
      console.error('Error fetching owner summary:', error);
      throw error;
    }
  },
};
