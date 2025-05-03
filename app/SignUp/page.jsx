"use client";

import { useState } from "react";
import SignUp from "@/components/Login/SignUp";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // ⬅️ spinner icon

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="flex items-center gap-2 text-gray-800 text-lg font-semibold">
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending OTP...
          </div>
        </div>
      )}

      {/* SignUp Form */}
      
        <SignUp setLoading={setLoading} />
    
    </div>
  );
};

export default SignupPage;
