"use client";

import { useForm } from "react-hook-form";
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
import { useState } from "react";
import MajorSelector from "./MajorSelector";


const SignUp = () => {
  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      major: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [submittedData, setSubmittedData] = useState(null);

  const onSubmit = (data) => {
    console.log("Submitted:", data);
    setSubmittedData(data);
  };

  return (
    <div className="max-w-lg w-full mx-auto p-6 max-h-[80vh] h-auto flex flex-col justify-center">
      <div className="overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name and Last Name Side by Side */}
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="firstName"
                rules={{ required: "First name is required" }}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="First name" className="h-10 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                rules={{ required: "Last name is required" }}
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="Last name" className="h-10 text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: { value: /^\d+@students\.liu\.edu\.lb$/, message: "Enter a valid LIU student email (number@students.liu.edu.lb)" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter your LIU student email" className="h-10 text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              rules={{ required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter your password" className="h-10 text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) => value === form.getValues("password") || "Passwords do not match",
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Confirm your password" className="h-10 text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Major Selector Field */}
            <FormField
              control={form.control}
              name="major"
              rules={{ required: "Please select a major" }}
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

            {/* Sign Up Button */}
            <Button type="submit" className="w-full h-10 text-base font-semibold">
              Sign Up
            </Button>
          </form>
        </Form>
      </div>

      {/* Show submitted data */}
      {submittedData && (
        <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg">
          ✅ <strong>Successfully Registered!</strong> <br />
          <strong>First Name:</strong> {submittedData.firstName} <br />
          <strong>Last Name:</strong> {submittedData.lastName} <br />
          <strong>Email:</strong> {submittedData.email} <br />
          <strong>Major:</strong> {submittedData.major} <br />
        </div>
      )}
    </div>
  );
};

export default SignUp;
