"use client";

import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { LogOut } from "lucide-react";

export default function UserPage() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.push("/login");
                    },
                },
            });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">User Page</h1>
                    <Button
                        onClick={handleLogout}
                        className="font-semibold h-11 bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl rounded-lg transition-all"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
                <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-8">
                    <p className="text-gray-600">Welcome to your user dashboard!</p>
                </div>
            </div>
        </div>
    );
}