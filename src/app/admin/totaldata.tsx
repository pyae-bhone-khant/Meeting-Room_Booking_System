"use client";
import { userService } from "@/src/lib/axios";
import { Hourglass, SaveAll, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function TotalData() {
  const [users, setUsers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    userService
      .getAllUsers()
      .then((res) => setUsers(res.data))
      .catch(console.error);
    userService
      .getAllBookings()
      .then((res) => {
        setBookings(res.Allbooking);
        console.log(res.data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Top Users */}
      <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Active Users</h3>
        </div>
        <div className="space-y-3">
          {users.slice(0, 3).map((user, index) => (
            <div key={user.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
              <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </span>
              <span className="text-gray-800">{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Bookings */}
      <div className="bg-white border border-green-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <SaveAll className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Total Bookings</h3>
        </div>
        <div className="text-5xl font-bold text-green-600">{bookings?.length ?? 0}</div>
      </div>

      {/* Total Hours */}
      <div className="bg-white border border-blue-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Hourglass className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Total Hours</h3>
        </div>
        <div className="text-5xl font-bold text-blue-600">
          {bookings
            ?.reduce((acc, booking) => {
              const start = new Date(booking.startTime).getTime();
              const end = new Date(booking.endTime).getTime();
              const diffInHours = (end - start) / (1000 * 60 * 60);
              return acc + diffInHours;
            }, 0)
            .toFixed(1)}
        </div>
      </div>
    </div>
  );
}
