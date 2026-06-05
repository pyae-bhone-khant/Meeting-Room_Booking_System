"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { KeyRound, Mail, Eye, EyeOff } from "lucide-react";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { authClient } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { sessionMiddleware } from "better-auth/api";

// 📝 Zod Validation Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      console.log("Submitting values directly to Better-Auth:", data); // 👈 ဘာတွေပါသွားလဲဆိုတာ console မှာ စစ်လို့ရအောင် ထည့်ထားပေးပါတယ်

      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: (ctx) => {
            // 💡 စာလုံးအကြီးဖြင့် ပြောင်းလဲရယူပါ (ဘာလို့လဲဆိုတော့ အောက်က "ADMIN", "USER" တို့က စာလုံးအကြီးဖြစ်လို့ပါ)
            const userRole = ctx.data.user.role?.toUpperCase();
            console.log("Login successful! Role:", userRole);

            if (userRole === "ADMIN") {
              router.push("/admin");
            } else if (userRole === "OWNER") {
              router.push("/owner");
            } else if (userRole === "USER") {
              router.push("/user");
            } else {
              router.push("/login");
            }
          },
          onError: (ctx) => {
            console.error("Better-Auth Login failed:", ctx.error);
            alert(ctx.error.message || "Invalid email or password");
          },
        },
      );
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // ✨ စောစောက Bug ကို အမြစ်ပြတ်အောင် ပြင်ဆင်ထားသည့် နေရာဖြစ်ပါသည်
  const handleFillDemo = (email: string, pass: string) => {
    form.setValue("email", email, { shouldValidate: true, shouldDirty: true });
    form.setValue("password", pass, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl mx-auto items-start justify-center p-4">
      {/* 🔐 Main Login Card (ဘယ်ဘက်ခြမ်း) */}
      <Card className="bg-white border border-gray-200 shadow-xl w-full md:max-w-[460px] shrink-0">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex justify-center mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <KeyRound className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-center text-gray-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                        <Input
                          placeholder="name@example.com"
                          className="pl-12 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 transition-all h-11 rounded-lg"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-900 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-12 pr-12 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-indigo-500 transition-all h-11 rounded-lg"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ?
                            <EyeOff className="h-5 w-5" />
                          : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full font-semibold mt-4 h-11 bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl rounded-lg transition-all"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-gray-200 p-6 mt-4">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="/register"
              className="text-indigo-600 font-medium hover:underline transition-colors"
            >
              Register
            </a>
          </p>
        </CardFooter>
      </Card>

      {/* 💡 Demo Credentials Section (ညာဘက်ခြမ်း) */}
      <Card className="bg-gray-50 border-dashed border-gray-300 w-full shadow-sm rounded-xl">
        <CardHeader className="p-5 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>💡 Quick Demo Accounts (Click to Autofill)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 pt-0 grid grid-cols-1 gap-3 text-xs">
          {/* Admin Account Button */}
          <button
            type="button"
            onClick={() => handleFillDemo("admin@gmail.com", "password123")}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-left transition-all group gap-2 shadow-sm"
          >
            <div>
              <span className="font-bold text-red-600 mr-2 group-hover:text-red-700 transition-colors">
                [ADMIN]
              </span>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                admin@gmail.com
              </span>
            </div>
            <code className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600 group-hover:text-gray-700 transition-colors self-end sm:self-auto">
              password123
            </code>
          </button>

          {/* Owner Account Button */}
          <button
            type="button"
            onClick={() => handleFillDemo("owner@gmail.com", "password123")}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-left transition-all group gap-2 shadow-sm"
          >
            <div>
              <span className="font-bold text-blue-600 mr-2 group-hover:text-blue-700 transition-colors">
                [OWNER]
              </span>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                owner@gmail.com
              </span>
            </div>
            <code className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600 group-hover:text-gray-700 transition-colors self-end sm:self-auto">
              password123
            </code>
          </button>

          {/* User Account Button */}
          <button
            type="button"
            onClick={() => handleFillDemo("user@gmail.com", "password123")}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 hover:border-gray-300 text-left transition-all group gap-2 shadow-sm"
          >
            <div>
              <span className="font-bold text-green-600 mr-2 group-hover:text-green-700 transition-colors">
                [USER]
              </span>
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                user@gmail.com
              </span>
            </div>
            <code className="bg-gray-100 px-2 py-1 rounded text-[10px] text-gray-600 group-hover:text-gray-700 transition-colors self-end sm:self-auto">
              password123
            </code>
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
