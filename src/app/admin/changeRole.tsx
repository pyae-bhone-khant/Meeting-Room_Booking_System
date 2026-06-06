"use client";
import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { userService } from "@/src/lib/axios";

interface ChangeRoleModalProps {
  userId: string;
  currentRole: string;
  userName: string;
  onSuccess: () => void;
}

export default function ChangeRoleModal({ userId, currentRole, userName, onSuccess }: ChangeRoleModalProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(currentRole);

  const handleSubmit = async () => {
    try {
      console.log("Changing user role:", { userId, role });
      await userService.changeUserRole(userId, role);
      
      alert(`User role changed to ${role} successfully!`);
      setOpen(false);
      onSuccess();
    } catch (error: any) {
      console.error("Role change failed details:", error.response?.data || error.message);
      alert(`Failed to change role: ${error.response?.data?.message || "Internal Server Error"}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<button className="text-gray-600 cursor-pointer hover:text-black">✏️</button>} />
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold mb-4">Change User Role</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <p className="text-gray-700">
            Change role for <span className="font-semibold">{userName}</span>
          </p>
          
          <select 
            className="border-2 p-4 text-lg rounded-xl w-full" 
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
          </select>

          <div className="flex gap-2 mt-4">
            <button 
              onClick={handleSubmit} 
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
            >
              Change Role
            </button>
            <button 
              onClick={() => setOpen(false)} 
              className="flex-1 bg-gray-200 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
