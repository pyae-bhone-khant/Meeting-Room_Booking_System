

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
    <div className="flex flex-col mt-8 lg:px-30 px-4">
    <h1 className="text-3xl">Meeting Room Booking System</h1>
     <div className="flex justify-between items-center">

        <div className="mt-4 gap-4 flex">
  <CreateBookingModal />
       <CustomButton 
        label="View All Bookings" 
        onClick={() => console.log("View all bookings clicked")} 
      />
      
        </div>  

         <CustomButton 
        label={`Logout`} 
        icon={<LogOut className="w-5 h-5" />}
        variant="secondary"
        onClick={() => handleLogout()} 
      />

     </div>
    
     <TotalData />
     <SearchUser />
     <AllBooking />

    </div>
  );
}