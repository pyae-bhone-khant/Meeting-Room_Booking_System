"use client";
import { useState, useEffect, useRef } from "react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { CustomButton } from "@/src/component/customButton";
import { userService } from "@/src/lib/axios";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER"
  });

  useEffect(() => {
    if (open) {
      nameInputRef.current?.focus();
    }
  }, [open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      console.log("Submitting user data:", formData);
      await userService.createUser(formData);
      
      toast.success("User created successfully!");
      setOpen(false);
      setFormData({ name: "", email: "", password: "", role: "USER" });
      setErrors({});
      // Optional: Refresh the user list
      window.location.reload();
    } catch (error: any) {
      console.error("User creation failed details:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsLoading(false);
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
          <div>
            <input 
              ref={nameInputRef}
              placeholder="Name" 
              className={`border-2 p-4 text-lg rounded-xl w-full transition-colors ${
                errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              value={formData.name}
              onChange={(e) => {
                setFormData({...formData, name: e.target.value});
                if (errors.name) setErrors({...errors, name: ''});
              }}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <input 
              placeholder="Email" 
              type="email"
              className={`border-2 p-4 text-lg rounded-xl w-full transition-colors ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if (errors.email) setErrors({...errors, email: ''});
              }}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <div className="relative">
              <input 
                placeholder="Password" 
                type={showPassword ? "text" : "password"}
                className={`border-2 p-4 text-lg rounded-xl w-full pr-12 transition-colors ${
                  errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                value={formData.password}
                onChange={(e) => {
                  setFormData({...formData, password: e.target.value});
                  if (errors.password) setErrors({...errors, password: ''});
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          <select className="border-2 p-4 text-lg rounded-xl w-full" onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
          </select>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={handleSubmit} 
              disabled={isLoading}
              className="flex-1 bg-green-600 text-white text-lg font-bold py-4 rounded-xl hover:bg-green-700 active:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : "Create User"}
            </button>
            <button 
              onClick={() => {
                setOpen(false);
                setFormData({ name: "", email: "", password: "", role: "USER" });
                setErrors({});
              }}
              disabled={isLoading}
              className="flex-1 bg-gray-200 text-lg font-bold py-4 rounded-xl hover:bg-gray-300 active:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
