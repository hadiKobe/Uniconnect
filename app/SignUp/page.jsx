"use client";

import { useState } from "react";
import SignUp from "@/components/Login/SignUp";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // ⬅️ control loading globally

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-gray-50">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="text-gray-800 text-lg font-semibold animate-pulse">
            Processing...
          </div>
        </div>
      )}

      <div className={`p-8 flex flex-col justify-center bg-white w-full max-w-md shadow-lg rounded-xl transition-opacity ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
        <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
          Join Us Today!
        </h2>
        <p className="text-center text-gray-600 mb-4">
          Create an account to access exclusive university resources.
        </p>
        
        {/* Pass setLoading to SignUp */}
        <SignUp setLoading={setLoading} />
        
        <button
          className="mt-4 w-full text-blue-600 hover:underline disabled:opacity-50"
          onClick={() => router.push("/SignIn")}
          disabled={loading}
        >
          Already have an account? Log In
        </button>
      </div>
    </div>
  );
};

export default SignupPage;
