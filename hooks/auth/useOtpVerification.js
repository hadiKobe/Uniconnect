// hooks/auth/useOtpVerification.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useOtpVerification({ onVerified }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  const startCountdown = (expiresAt) => {
    setRemainingTime(Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)));
    const interval = setInterval(() => {
      const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemainingTime(timeLeft);
      if (timeLeft === 0) clearInterval(interval);
    }, 1000);
  };

  useEffect(() => {
    const expiresAt = parseInt(localStorage.getItem("otpExpiresAt"), 10);
    if (!expiresAt || isNaN(expiresAt)) {
      toast.error("Session expired. Please try again.");
      router.push("/SignUp");
      return;
    }
    startCountdown(expiresAt);
  }, []);

  const verifyOtp = async () => {
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
        setLoading(false);
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
          onVerified?.();
        }, 1500);
      } else {
        toast.error(signupResult.error || "Account creation failed.");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Verification failed.");
      setLoading(false);
    }
  };

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

        const newExpiresAt = Date.now() + 3 * 60 * 1000;
        localStorage.setItem("otpExpiresAt", newExpiresAt.toString());

        startCountdown(newExpiresAt);
      } else {
        toast.error(result.error || "Failed to resend OTP.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while resending OTP.");
    } finally {
      setLoading(false);
    }
  };

  return {
    otp,
    setOtp,
    loading,
    remainingTime,
    startCountdown,
    verifyOtp,
    handleResendOTP,
  };
}
