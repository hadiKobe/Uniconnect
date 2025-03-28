"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MajorSelector from "./MajorSelector";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import * as z from "zod";

// Validation schema for the form
const formSchema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^\d+@students\.liu\.edu\.lb$/, "Must be a valid LIU student email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    major: z.string().min(1, "Please select a major"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  // Form setup with zod validation
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      major: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handles initial form submission to request OTP
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("OTP sent to your email.");
        localStorage.setItem("pendingSignup", JSON.stringify(data));
        localStorage.setItem("otpToken", result.token);
        setShowOTP(true);
      } else {
        toast.error(result.error || "Failed to send OTP.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handles OTP verification and account creation
  const handleVerifyOTP = async () => {
    const token = localStorage.getItem("otpToken");
    const signupData = localStorage.getItem("pendingSignup");

    if (!token || !signupData) {
      toast.error("Session expired. Please try again.");
      setShowOTP(false);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp, token }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Invalid OTP");
        return;
      }

      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: signupData,
      });

      const signupResult = await signupRes.json();

      if (signupRes.ok) {
        toast.success("Account created successfully.");
        localStorage.removeItem("otpToken");
        localStorage.removeItem("pendingSignup");
        setTimeout(() => {
          router.push("/login");
          window.location.reload();
        }, 1500);
      } else {
        toast.error(signupResult.error || "Account creation failed.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg w-full mx-auto p-6 max-h-[85vh] h-auto flex flex-col justify-center">
      <div className="overflow-y-auto">
        {!showOTP ? (
          // Signup form
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="First name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" placeholder="Last name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="LIU student email" />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Confirm password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="major"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Major</FormLabel>
                    <FormControl>
                      <MajorSelector
                        selectedMajor={field.value}
                        onSelectMajor={(major) => field.onChange(major)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full h-10 text-base font-semibold"
                disabled={loading || !form.formState.isValid}
              >
                {loading ? "Sending OTP..." : "Continue to Verify"}
              </Button>
            </form>
          </Form>
        ) : (
          // OTP verification step
          <div className="flex flex-col items-center justify-center min-h-[300px] gap-6 text-center border rounded-xl p-6 shadow-sm bg-white">
            <div>
              <h2 className="text-2xl font-semibold">Verify Your Email</h2>
              <p className="text-muted-foreground text-sm mt-1">
                A 6-digit code has been sent to your email.
              </p>
            </div>

            <InputOTP maxLength={6} value={otp} onChange={setOtp}>
              <InputOTPGroup>
                {[...Array(6)].map((_, i) => (
                  <InputOTPSlot key={i} index={i} />
                ))}
              </InputOTPGroup>
            </InputOTP>

            <Button
              onClick={handleVerifyOTP}
              disabled={otp.length !== 6 || loading}
              className="w-full"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
