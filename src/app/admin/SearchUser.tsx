"use client";
import { CustomButton } from "@/src/component/customButton";
import { userService } from "@/src/lib/axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function SearchUser() {
  const [allUsers, setAllUsers] = useState<any[]>([]); // API မှရလာသော data အစစ်
  const [searchTerm, setSearchTerm] = useState("");   // Search input အတွက်

  useEffect(() => {
    userService
      .getAllUsersData()
      .then((res) => {
        // Postman အရ data က array ဖြစ်သောကြောင့် res.data ကိုယူပါ
        setAllUsers(res.data);
      })
      .catch(console.error);
  }, []);

  // userName ဖြင့် ရှာဖွေခြင်း
  const filteredUsers = allUsers.filter((user) =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="bg-gray-100 flex mt-8 rounded-2xl px-6 items-center justify-between w-full h-20 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-semibold text-gray-800">Booking group</h1>

        <div className="flex gap-4">
          <CustomButton label="Create Users" />
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64"
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Result Table */}
      <div className="mt-4 w-full overflow-hidden rounded-lg shadow-sm border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-4 font-semibold">No.</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Booking Count</th>
              <th className="p-4 font-semibold">Total Hour</th>
              <th className="p-4 font-semibold text-center">Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => {
              // Total Hours တွက်ချက်ခြင်း (Start/End Time ကိုအခြေခံပြီး တွက်သည်)
              const totalHours = (user.bookings || []).reduce(
                (acc: number, b: any) => {
                  const start = new Date(b.startTime).getTime();
                  const end = new Date(b.endTime).getTime();
                  const hours = (end - start) / (1000 * 60 * 60);
                  return acc + (isNaN(hours) ? 0 : hours);
                },
                0
              );

              return (
                <tr key={user.userId} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-4">{index + 1}.</td>
                  <td className="p-4">{user.userName}</td>
                  <td className="p-4">User</td>
                  <td className="p-4">{user.totalBookings}</td>
                  <td className="p-4">{totalHours.toFixed(1)} hrs</td>
                  <td className="p-4 flex justify-center gap-4">
                    <button className="text-gray-600 cursor-pointer hover:text-black">✏️</button>
                    <button className="text-gray-600 cursor-pointer hover:text-red-600">🗑️</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}