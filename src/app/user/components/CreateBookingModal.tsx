"use client";

import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { CustomButton } from "@/src/component/customButton";
import { bookingService } from '@/src/services/bookingService';
import { CreateBookingData } from '@/src/types/booking';

/**
 * Props interface for CreateBookingModal component
 */
interface CreateBookingModalProps {
  /** Callback function called after successful booking creation */
  onSuccess: () => void;
}

/**
 * CreateBookingModal Component
 * Modal form for creating new bookings with validation
 * Handles form state, API submission, and error handling
 */
export default function CreateBookingModal({ onSuccess }: CreateBookingModalProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBookingData>({
    roomNo: "",
    location: "",
    roomType: "Meeting Room",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: ""
  });

  /**
   * Handle form submission
   * Validates required fields and submits booking data to API
   */
  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.roomNo || !formData.startDate || !formData.startTime) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Format dates to ISO strings as required by API
      const payload: CreateBookingData = {
        ...formData,
        startDate: new Date(`${formData.startDate}T00:00:00Z`).toISOString(),
        endDate: new Date(`${formData.endDate}T00:00:00Z`).toISOString(),
        startTime: new Date(`${formData.startDate}T${formData.startTime}:00Z`).toISOString(),
        endTime: new Date(`${formData.endDate}T${formData.endTime}:00Z`).toISOString(),
      };

      // Submit booking to API
      await bookingService.createBooking(payload);
      
      alert("Booking created successfully!");
      setOpen(false);
      
      // Reset form
      setFormData({
        roomNo: "",
        location: "",
        roomType: "Meeting Room",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: ""
      });
      
      // Refresh bookings list
      onSuccess();
    } catch (error: any) {
      console.error("Booking failed:", error.response?.data || error.message);
      alert(`Failed to create booking: ${error.response?.data?.message || "Internal Server Error"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<CustomButton label="Create Booking" />} />
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 pb-12">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-white mb-2">Create Booking</DialogTitle>
            <p className="text-blue-100 text-sm">Fill in the details to reserve your meeting room</p>
          </DialogHeader>
        </div>
        
        <div className="p-8 bg-white">
          <div className="grid gap-6">
            {/* Room Number Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
              <input 
                placeholder="e.g., Room-101" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.roomNo}
                onChange={(e) => setFormData({...formData, roomNo: e.target.value})} 
              />
            </div>
            
            {/* Location Input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
              <input 
                placeholder="e.g., Main Building, 3rd Floor" 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
              />
            </div>
            
            {/* Date and Time Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <input 
                  type="date" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                <input 
                  type="time" 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})} 
                />
              </div>
            </div>

            {/* Room Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
              <select 
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                value={formData.roomType}
                onChange={(e) => setFormData({...formData, roomType: e.target.value})}
              >
                <option value="Single Room">Single Room</option>
                <option value="Meeting Room">Meeting Room</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-4">
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3.5 rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isLoading ? "Creating..." : "Confirm Booking"}
              </button>
              <button 
                onClick={() => setOpen(false)} 
                disabled={isLoading}
                className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3.5 rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
