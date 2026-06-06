

"use client";

import { CustomButton } from "@/src/component/customButton";
import { LogOut } from "lucide-react";
import { handleLogout } from "@/src/component/function";
import { useEffect, useState } from "react";
import { userService } from "@/src/lib/axios";
import TotalData from "./totaldata";
import SearchUser from "./SearchUser";
import AllBooking from "./AllBooking";
import CreateBookingModal from "./CreateBooking";

export default function AdminPage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your meeting room booking system with ease</p>
        </div>

        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex gap-4">
            <CreateBookingModal />
            <CustomButton 
              label="View All Bookings" 
              onClick={() => console.log("View all bookings clicked")} 
            />
          </div>

          <CustomButton 
            label="Logout" 
            icon={<LogOut className="w-5 h-5" />}
            variant="secondary"
            onClick={() => handleLogout()} 
          />
        </div>

        {/* Dashboard Components */}
        <div className="space-y-8">
          <TotalData />
          <SearchUser />
          <AllBooking />
        </div>
      </div>
    </div>
  );
}