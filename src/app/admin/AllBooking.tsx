"use client";
import { useEffect, useState } from "react";
import { userService } from "@/src/lib/axios";

export default function AllBooking() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    userService
      .getAllBookings()
      .then((res) => {
        if (res && res.Allbooking) {
          setBookings(res.Allbooking);
        }
      })
      .catch((err) => console.error("Error fetching bookings:", err));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Booking</h1>
      </div>

      <div className="space-y-4">
        {bookings.map((item: any) => (
          <div 
            key={item.id} 
            className="bg-gray-200 rounded-xl p-4 flex items-center justify-between border border-gray-300"
          >
            {/* Room Info */}
            <div className="w-1/4">
              <h3 className="font-bold text-lg">{item.roomNo}</h3>
              <p className="text-gray-600">{item.location}</p>
            </div>

            {/* Date */}
            <div className="w-1/4 text-center">
              <p className="font-semibold text-gray-700">
                {new Date(item.startDate).toLocaleDateString()}
              </p>
            </div>

            {/* Time */}
            <div className="w-1/4 text-center">
              <p className="text-gray-700">
                {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Room Type */}
            <div className="w-1/6 text-center text-gray-700 font-medium">
              {item.roomType}
            </div>

            {/* Delete Button */}
            <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 
