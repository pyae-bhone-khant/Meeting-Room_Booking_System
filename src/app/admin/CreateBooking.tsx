"use client";
import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { CustomButton } from "@/src/component/customButton";
import { apiClient } from "@/src/lib/axios";

export default function CreateBookingModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    roomNo: "",
    location: "",
    roomType: "Single Room",
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: ""
  });

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.roomNo || !formData.startDate || !formData.startTime) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Format data into ISO strings
      const payload = {
        ...formData,
        startDate: new Date(`${formData.startDate}T00:00:00Z`).toISOString(),
        endDate: new Date(`${formData.endDate}T00:00:00Z`).toISOString(),
        startTime: new Date(`${formData.startDate}T${formData.startTime}:00Z`).toISOString(),
        endTime: new Date(`${formData.endDate}T${formData.endTime}:00Z`).toISOString(),
      };

      console.log("Submitting payload:", payload);

      await apiClient.post("/api/admin/createBooking", payload);
      
      alert("Booking created successfully!");
      setOpen(false);
      // Optional: window.location.reload(); 
    } catch (error: any) {
      console.error("Booking failed details:", error.response?.data || error.message);
      alert(`Failed to create booking: ${error.response?.data?.message || "Internal Server Error"}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<CustomButton label="Create Booking" />} />
      
      <DialogContent className="sm:max-w-[800px] min-h-[600px] p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-4">Create Booking</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          <input 
            placeholder="Room No." 
            className="border-2 p-4 text-lg rounded-xl w-full" 
            value={formData.roomNo}
            onChange={(e) => setFormData({...formData, roomNo: e.target.value})} 
          />
          <input 
            placeholder="Location" 
            className="border-2 p-4 text-lg rounded-xl w-full" 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})} 
          />
          
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Start Date</label>
              <input type="date" className="border-2 p-4 text-lg rounded-xl" onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">End Date</label>
              <input type="date" className="border-2 p-4 text-lg rounded-xl" onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Time Start</label>
              <input type="time" className="border-2 p-4 text-lg rounded-xl" onChange={(e) => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-gray-700">Time End</label>
              <input type="time" className="border-2 p-4 text-lg rounded-xl" onChange={(e) => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>

          <select className="border-2 p-4 text-lg rounded-xl" onChange={(e) => setFormData({...formData, roomType: e.target.value})}>
            <option>Single Room</option>
            <option>Meeting Room</option>
          </select>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleSubmit} 
              className="flex-1 bg-green-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-green-700 transition-colors"
            >
              Confirm Booking
            </button>
            <button 
              onClick={() => setOpen(false)} 
              className="flex-1 bg-gray-200 text-lg font-bold py-4 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}