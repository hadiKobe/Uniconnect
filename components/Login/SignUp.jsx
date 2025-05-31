"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from "@/components/ui/form";
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MajorSelector from "./MajorSelector";
import { GraduationCap, User, Lock, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";


const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().regex(/^\d+@students\.liu\.edu\.lb$/, "Must be a valid LIU student email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  major: z.string().min(1, "Please select a major")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

const SignUp = ({ setLoading }) => {
  const router = useRouter();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);



  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      major: "",
      password: "",
      confirmPassword: ""
    }
  });
  const calculatePasswordStrength = (password) => {
    if (!password) return 0

    let strength = 0
    // Length check
    if (password.length >= 8) strength += 25
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25
    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25
    // Contains number or special char
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25

    return strength
  }

  const onPasswordChange = (value) => {
    setPasswordStrength(calculatePasswordStrength(value))
  }



  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500"
    if (passwordStrength <= 50) return "bg-orange-500"
    if (passwordStrength <= 75) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 25) return "Weak"
    if (passwordStrength <= 50) return "Fair"
    if (passwordStrength <= 75) return "Good"
    return "Strong"
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email })
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("OTP sent to your email.");
        localStorage.setItem("pendingSignup", JSON.stringify(data));
        localStorage.setItem("otpToken", result.token);
        localStorage.setItem("otpExpiresAt", (Date.now() + 3 * 60 * 1000).toString());
        router.push("/SignUp/verify");

      } else {
        toast.error(result.error || "Failed to send OTP.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min- flex items-center ">
      <Card className="w-full max-w-md shadow-lg border-slate-200 h-[720px]">

        <CardHeader className="space-y-1 text-center">

          <CardTitle className="text-2xl font-bold text-slate-800">Join Us Today!</CardTitle>
          <CardDescription className="text-slate-600">
            Create an account to access exclusive university resources.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">First Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            placeholder="First name"
                            className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-medium" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-medium">Last Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            placeholder="Last name"
                            className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm font-medium" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="12214@students.liu.edu.lb"
                          className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Create a strong password"
                          className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                          onChange={(e) => {
                            field.onChange(e)
                            onPasswordChange(e.target.value)
                          }}
                        />
                      </div>
                    </FormControl>
                    {field.value && (
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Password strength:</span>
                          <span
                            className={`font-medium ${passwordStrength <= 25
                              ? "text-red-500"
                              : passwordStrength <= 50
                                ? "text-orange-500"
                                : passwordStrength <= 75
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                          >
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                          <div className="relative w-full overflow-hidden rounded">
                        <Progress
                          value={passwordStrength}
                          className="h-1"
                        >
                          
                          <div
                            className={`h-1 ${getPasswordStrengthColor()} transition-all duration-300`}
                            data-slot="indicator"
                            style={{ width: `${passwordStrength}%` }}
                          />
                        </Progress>
                        </div>

                      </div>
                    )}
                    <FormMessage className="text-sm font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm your password"
                          className="pl-10 h-11 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
                        />
                        {field.value && field.value === form.watch("password") && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                        )}
                        {field.value && field.value !== form.watch("password") && (
                          <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-medium" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-700 font-medium">Major</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MajorSelector selectedMajor={field.value} onSelectMajor={(major) => field.onChange(major)} />
                      </div>
                    </FormControl>
                    <FormMessage className="text-sm font-medium" />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-2 pb-6">
              <Button
                type="submit"
                className="w-full h-11 bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all duration-200"
                disabled={!form.formState.isValid || form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Continue to Verify"
                )}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link prefetch={false} href="/SignIn" className="text-slate-700 font-medium hover:underline">
                  Log In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default SignUp