"use client";
import { useEffect, useState } from "react";
import { userService } from "@/src/lib/axios";

export default function AllBooking() {
  const [bookings, setBookings] = useState<any[]>([]);
  // State for modal visibility and the item to delete
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await userService.getAllBookings();
      if (res && res.Allbooking) setBookings(res.Allbooking);
    } catch (err) { console.error("Error fetching bookings:", err); }
  };

  useEffect(() => { fetchBookings(); }, []);

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await userService.deleteBooking(deleteId);
      setDeleteId(null); // Close modal
      fetchBookings();   // Refresh list
    } catch (error) {
      alert("Failed to delete booking.");
    }
  };

  return (
    <div className="p-8">
      {/* --- CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-96">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to delete this Booking?</h3>
            <div className="flex gap-4">
              <button 
                onClick={confirmDelete} 
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
              >Delete</button>
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- BOOKING LIST --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Booking</h1>
      </div>

      <div className="space-y-4">
        {bookings.map((item: any) => (
          <div key={item.id} className="bg-gray-200 rounded-xl p-4 flex items-center justify-between border border-gray-300">
            <div className="w-1/4">
              <h3 className="font-bold text-lg">{item.roomNo}</h3>
              <p className="text-gray-600">{item.location}</p>
            </div>
            <div className="w-1/4 text-center">{new Date(item.startDate).toLocaleDateString()}</div>
            <div className="w-1/4 text-center">
              {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
              {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="w-1/6 text-center font-medium">{item.roomType}</div>
            
            {/* Trigger Modal */}
            <button 
              onClick={() => setDeleteId(item.id)} 
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}