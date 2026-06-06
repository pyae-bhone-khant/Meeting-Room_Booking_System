/**
 * TypeScript interface for Booking data structure
 * Matches the API response format for booking operations
 */
export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  roomNo: string;
  location: string;
  roomType: string;
}

/**
 * Interface for creating a new booking
 */
export interface CreateBookingData {
  startTime: string;
  endTime: string;
  startDate: string;
  endDate: string;
  roomNo: string;
  location: string;
  roomType: string;
}
