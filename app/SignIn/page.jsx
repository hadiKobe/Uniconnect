"use client";

import SignIn from "@/components/Login/SignIn";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50">
      <div className="p-8 flex flex-col justify-center bg-white w-full max-w-md shadow-lg rounded-xl">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Log in to access your account.
        </p>
        <SignIn />
        <button
          className="mt-4 w-full text-blue-600 hover:underline"
          onClick={() => router.push("/SignUp")}
        >
          Don't have an account? Sign Up
        </button>
      </div>
    </div>
  );
};

export default SignInPage;
