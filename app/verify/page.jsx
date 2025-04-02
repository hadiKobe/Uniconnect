"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

const VerifyPage = () => {
  const router = useRouter();
  const [otp, setOtp] = useState(""); // Holds the user's OTP input
  const [loading, setLoading] = useState(false); // Handles UI loading state
  const [remainingTime, setRemainingTime] = useState(0); // Countdown timer (in seconds)

  // ✅ Reusable timer function
  const startCountdown = (expiresAt) => {
    setRemainingTime(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));

    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemainingTime(timeLeft);
      if (timeLeft === 0) clearInterval(interval);
    }, 1000);
  };

  // ✅ On mount, validate session and start timer
  useEffect(() => {
    const signupData = localStorage.getItem("pendingSignup");
    const token = localStorage.getItem("otpToken");
    const expiresAt = parseInt(localStorage.getItem("otpExpiresAt"));

    if (!signupData || !token || !expiresAt) {
      toast.error("Session expired. Please sign up again.");
      router.push("/SignUp");
      return;
    }

    startCountdown(expiresAt);
  }, []);

  const handleVerifyOTP = async () => {
    const token = localStorage.getItem("otpToken");
    const signupData = localStorage.getItem("pendingSignup");
  
    if (!token || !signupData) {
      toast.error("Session expired. Please try again.");
      router.push("/SignUp");
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
        setLoading(false); // ❗ Only stop loading on failure
        return;
      }
  
      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: signupData,
      });
  
      const signupResult = await signupRes.json();
  
      if (signupRes.ok) {
        toast.success("Account created successfully!");
        setTimeout(() => {
            localStorage.removeItem("otpToken");
            localStorage.removeItem("pendingSignup");
            localStorage.removeItem("otpExpiresAt");
          
            window.location.href = "/SignIn"; // hard redirect ensures clean transition
          }, 1500);
          
      } else {
        toast.error(signupResult.error || "Account creation failed.");
        setLoading(false); // ❗ Only stop loading on failure
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
      setLoading(false); // ❗ Only stop loading on failure
    }
  };
  
  // ✅ Resend OTP and reset expiration timer
  const handleResendOTP = async () => {
    const signupRaw = localStorage.getItem("pendingSignup");
    if (!signupRaw) {
      toast.error("Session expired. Please sign up again.");
      router.push("/SignUp");
      return;
    }

    let signupData;
    try {
      signupData = JSON.parse(signupRaw);
    } catch (e) {
      toast.error("Corrupted session. Please sign up again.");
      router.push("/SignUp");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData.email }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("OTP resent!");
        localStorage.setItem("otpToken", result.token);

        const newExpiresAt = Date.now() + 2 * 60 * 1000;
        localStorage.setItem("otpExpiresAt", newExpiresAt.toString());

        startCountdown(newExpiresAt);
      } else {
        toast.error(result.error || "Failed to resend OTP.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-md text-center">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-10">
            <span className="text-gray-700 font-medium animate-pulse">
              Processing...
            </span>
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

        {/* Submit Button */}
        <Button
          onClick={handleVerifyOTP}
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
