"use client";

import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <Card className="bg-white border border-gray-200 shadow-xl rounded-xl max-w-md w-full">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-linear-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">Something went wrong</CardTitle>
          <CardDescription className="text-center text-gray-600">
            An error occurred while processing your request
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800 font-medium">
              {error.message || "An unexpected error occurred"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 p-6 pt-2">
          <Button
            onClick={reset}
            className="w-full font-semibold h-11 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg hover:shadow-xl rounded-lg transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full font-semibold h-11 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
