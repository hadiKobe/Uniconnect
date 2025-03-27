"use client";

import { useState } from "react";

import SignUp from "@/components/Login/SignUp";
import SignIn from "@/components/Login/SignIn";

const Page = () => {
  // ✅ Set Login as the default view
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 h-screen">
      <div className="relative h-screen w-full overflow-hidden">
        {isLogin ? (
          <div className="p-8 flex flex-col justify-center bg-white w-full h-full">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
              Welcome Back!
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Log in to access your account.
            </p>
            <SignIn />
            <button
              className="mt-4 w-full text-blue-600 hover:underline"
              onClick={() => setIsLogin(false)}
            >
              Don't have an account? Sign Up
            </button>
          </div>
        ) : (
          <div className="p-8 flex flex-col justify-center bg-white w-full h-full">
            <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
              Join Us Today!
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Create an account to access exclusive university resources.
            </p>
            <SignUp />
            <button
              className="mt-4 w-full text-blue-600 hover:underline"
              onClick={() => setIsLogin(true)}
            >
              Already have an account? Log In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
