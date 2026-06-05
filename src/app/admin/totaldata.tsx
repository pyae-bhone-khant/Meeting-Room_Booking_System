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
    <div className="flex gap-4 mt-8">
      {/* Top Users */}
      <div className="bg-blue-800 text-white p-4 rounded-lg w-1/3">
        <div className="text-3xl flex items-center justify-center mt-3 gap-2">
          <Users /> <span>Top Users</span>
        </div>
        <div className="text-2xl justify-center text-center mt-5 flex items-center gap-2">
          {users.slice(0, 3).map((user, index) => (
            <div key={user.id} className="flex mt-2 gap-2">
              <span className="font-bold">{index + 1}.</span>
              <span>{user.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Total Bookings */}
      <div className="bg-blue-800 text-white p-4 rounded-lg w-1/3 flex flex-col items-center">
        <div className="text-3xl flex items-center mt-3 gap-2">
          <SaveAll /> <span>Total Booking</span>
        </div>
        <div className="text-5xl font-bold mt-8">{bookings?.length ?? 0}</div>
      </div>

      {/* Total Hours */}
      <div className="bg-blue-800 text-white p-4 rounded-lg w-1/3 flex flex-col items-center">
        <div className="text-3xl flex items-center mt-3 gap-2">
          <Hourglass /> <span>Total Hours</span>
        </div>
        <div className="text-5xl font-bold mt-8">
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
