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
    <div className="p-0">
      {/* --- CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl w-96">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Booking</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                onClick={confirmDelete} 
                className="flex-1 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 font-semibold transition-colors"
              >Delete</button>
              <button 
                onClick={() => setDeleteId(null)} 
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* --- BOOKING LIST --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">All Bookings</h2>
      </div>

      <div className="space-y-4">
        {bookings.map((item: any, index: number) => (
          <div 
            key={item.id} 
            className="bg-white border border-blue-200 rounded-2xl p-6 flex items-center justify-between hover:border-blue-300 transition-all duration-300 shadow-sm"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-4">
                {/* <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {item.roomNo?.charAt(0) || 'R'}
                </div> */}
                <div>
                  <h3 className="font-bold text-xl text-gray-900">{item.roomNo}</h3>
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
                <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  {item.roomType}
                </span>
              </div>
            </div>
            
            {/* Trigger Modal */}
            <button 
              onClick={() => setDeleteId(item.id)} 
              className="ml-6 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-md"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}