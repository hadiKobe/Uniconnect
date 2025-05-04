"use client";

import { useRouter } from "next/navigation";
import { useOtpVerification } from "@/hooks/auth/useOtpVerification";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const VerifyPage = () => {
  const router = useRouter();
  const {
    otp,
    setOtp,
    loading,
    remainingTime,
    startCountdown,
    verifyOtp,
    handleResendOTP,
  } = useOtpVerification({
    onVerified: () => {
      localStorage.clear();
      router.push("/SignIn");
    },
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-md text-center">
    

        {loading && (
          <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-2xl z-50">
            <Loader2 className="w-6 h-6 animate-spin text-gray-600 mb-2" />
            <span className="text-gray-700 font-medium">Processing...</span>
          </div>
        )}


        <h2 className="text-2xl font-bold text-gray-800">Verify Your Email</h2>
        <p className="text-sm text-gray-500 mt-2">
          A 6-digit code has been sent to your LIU email.
        </p>

        {/* Countdown Timer */}
        <div className="mt-3 mb-1">
          {remainingTime > 0 ? (
            <p className="text-sm text-blue-600">
              Expires in:{" "}
              <span className="font-semibold">
                {Math.floor(remainingTime / 60)}:
                {String(remainingTime % 60).padStart(2, "0")}
              </span>
            </p>
          ) : (
            <p className="text-sm text-red-500">Code expired</p>
          )}
        </div>

        {/* OTP Input */}
        <div className="mt-4 mb-6 flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-14 h-14 text-2xl border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-md"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

     
        <Button
          onClick={verifyOtp}
          disabled={otp.length !== 6 || loading || remainingTime === 0}
          className="w-full"
        >
          Verify & Create Account
        </Button>

        {/* Resend OTP Button */}
        {remainingTime === 0 && (
          <Button
            onClick={handleResendOTP}
            variant="ghost"
            className="w-full mt-3 text-blue-600 hover:underline"
          >
            Resend Code
          </Button>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;
  