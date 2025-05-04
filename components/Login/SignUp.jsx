"use client";

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
import { GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import * as z from "zod";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-slate-700" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Join Us Today!</CardTitle>
          <CardDescription>
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
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="First name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Last name" />
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
                      <Input {...field} type="email" placeholder="12214@students.liu.edu.lb" />
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
                      <Input {...field} type="password" />
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
                      <Input {...field} type="password" />
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
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid}
              >
                Continue to Verify
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
  );
};

export default SignUp;
