"use client";
import { useState } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { CustomButton } from "@/src/component/customButton";
import { userService } from "@/src/lib/axios";

export default function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      console.log("Submitting user data:", formData);
      await userService.createUser(formData);
      
      alert("User created successfully!");
      setOpen(false);
      // Optional: Refresh the user list
      window.location.reload();
    } catch (error: any) {
      console.error("User creation failed details:", error.response?.data || error.message);
      alert(`Failed to create user: ${error.response?.data?.message || "Internal Server Error"}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<CustomButton label="Create Users" />} />
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold mb-4">Create User</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-6">
          <input 
            placeholder="Name" 
            className="border-2 p-4 text-lg rounded-xl w-full" 
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <input 
            placeholder="Email" 
            type="email"
            className="border-2 p-4 text-lg rounded-xl w-full" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
          />
          <input 
            placeholder="Password" 
            type="password"
            className="border-2 p-4 text-lg rounded-xl w-full" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
          />
          
          <select className="border-2 p-4 text-lg rounded-xl w-full" onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
          </select>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleSubmit} 
              className="flex-1 bg-green-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-green-700 transition-colors"
            >
              Create User
            </button>
            <button 
              onClick={() => setOpen(false)} 
              className="flex-1 bg-gray-200 text-lg font-bold py-4 rounded-xl hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
