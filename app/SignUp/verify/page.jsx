"use client"

import { useRouter } from "next/navigation"
import { useOtpVerification } from "@/hooks/auth/useOtpVerification"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { Loader2, Mail, Clock } from "lucide-react"

const VerifyPage = () => {
  const router = useRouter()
  const { otp, setOtp, loading, remainingTime, startCountdown, verifyOtp, handleResendOTP } = useOtpVerification({
    onVerified: () => {
      localStorage.clear()
      router.push("/SignIn")
    },
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 px-4 sm:px-6 py-6 sm:py-10">

      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 text-center">

        {loading && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-3xl z-50">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
            <span className="text-gray-700 font-semibold text-lg">Processing...</span>
            <span className="text-gray-500 text-sm mt-1">Please wait while we verify your code</span>
          </div>
        )}

        {/* Header Icon */}
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-3">Verify Your Email</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          A 6-digit verification code has been sent to your LIU email address.
        </p>

        {/* Countdown Timer */}
        <div className="mb-8">
          {remainingTime > 0 ? (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">
                Expires in{" "}
                <span className="font-bold">
                  {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, "0")}
                </span>
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">Code expired</span>
            </div>
          )}
        </div>

        {/* OTP Input */}
        <div className="mb-8 flex justify-center overflow-x-hidden">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup className="gap-2 flex-nowrap justify-center max-w-full">
              {[...Array(6)].map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 min-w-0 flex-shrink text-xl font-bold border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl transition-all duration-200 hover:border-gray-300"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>


        {/* Verify Button */}
        <Button
          onClick={verifyOtp}
          disabled={otp.length !== 6 || loading || remainingTime === 0}
          className="w-full h-12 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Verifying...
            </div>
          ) : (
            "Verify & Create Account"
          )}
        </Button>

        {/* Resend OTP Button */}
        {remainingTime === 0 && (
          <Button
            onClick={handleResendOTP}
            variant="ghost"
            className="w-full mt-4 h-12 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold rounded-xl transition-all duration-200"
          >
            Resend Verification Code
          </Button>
        )}

        {/* Help Text */}
        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
          {"Didn't receive the code? Check your spam folder or contact support."}
        </p>
      </div>
    </div>
  )
}

export default VerifyPage
