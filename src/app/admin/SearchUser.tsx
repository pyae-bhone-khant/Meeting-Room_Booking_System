"use client";
import { CustomButton } from "@/src/component/customButton";
import { userService } from "@/src/lib/axios";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import CreateUserModal from "./createUser";
import ChangeRoleModal from "./changeRole";

export default function SearchUser() {
  const [allUsers, setAllUsers] = useState<any[]>([]); // API မှရလာသော data အစစ်
  const [searchTerm, setSearchTerm] = useState("");   // Search input အတွက်
  const [deleteId, setDeleteId] = useState<string | null>(null); // State for modal visibility and the user to delete

  const refreshUsers = () => {
    userService
      .getAllUsersData()
      .then((res) => {
        setAllUsers(res.data);
      })
      .catch(console.error);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await userService.deleteUser(deleteId);
      setDeleteId(null); // Close modal
      refreshUsers();   // Refresh list
    } catch (error: any) {
      console.error("Delete failed details:", error.response?.data || error.message);
      alert(`Failed to delete user: ${error.response?.data?.message || "Internal Server Error"}`);
    }
  };

  useEffect(() => {
    refreshUsers();
  }, []);

  // userName ဖြင့် ရှာဖွေခြင်း
  const filteredUsers = allUsers.filter((user) =>
    user.userName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* --- CONFIRMATION MODAL --- */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl w-96">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
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

      {/* Search Header */}
      <div className="bg-white border border-blue-200 flex mt-8 rounded-2xl px-6 items-center justify-between w-full h-20 shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>

        <div className="flex gap-4">
          <CreateUserModal />
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-64 text-gray-900 placeholder-gray-400"
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Result Table */}
      <div className="mt-6 w-full overflow-hidden rounded-2xl shadow-sm border border-blue-200 bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-blue-50 text-gray-700">
              <th className="p-4 font-semibold">No.</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Booking Count</th>
              <th className="p-4 font-semibold">Total Hour</th>
              <th className="p-4 font-semibold text-center">Actions</th>
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
                <tr key={user.userId} className="border-t border-gray-200 hover:bg-blue-50 transition-colors">
                  <td className="p-4 text-gray-700">{index + 1}.</td>
                  <td className="p-4 text-gray-900 font-medium">{user.userName}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                      user.role === 'OWNER' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-gray-700">{user.totalBookings}</td>
                  <td className="p-4 text-gray-700">{totalHours.toFixed(1)} hrs</td>
                  <td className="p-4 flex justify-center gap-4">
                    <ChangeRoleModal 
                      userId={user.userId} 
                      currentRole={user.role} 
                      userName={user.userName}
                      onSuccess={refreshUsers}
                    />
                    <button 
                      className="text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                      onClick={() => setDeleteId(user.userId)}
                    >
                      🗑️
                    </button>
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