"use client";


import { useState } from "react"
import Link from "next/link"
import SignUp from "@/components/Login/SignUp"
import { useRouter } from "next/navigation"
import { Loader2, GraduationCap, ArrowLeft, Shield, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const SignupPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="w-full p-4 lg:p-6 relative z-20">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Link href="/" className="flex items-center">
            <GraduationCap className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">Uni Connect</span>
          </Link>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-4 pb-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">
                Join the Future of
                <span className="text-blue-600"> University Connection</span>
              </h1>
              <p className="text-xl text-gray-600">
                Connect with peers, share resources, and build your academic network in a secure, university-verified
                environment.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure & Verified</h3>
                  <p className="text-gray-600">University email verification ensures a safe academic community.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Connection</h3>
                  <p className="text-gray-600">Real-time messaging and notifications keep you connected.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Quick Setup</h3>
                  <p className="text-gray-600">Get started in minutes with our streamlined registration process.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Side - Form */}
          <div className="relative">
            <SignUp setLoading={loading} />
          </div>
        </div>
      </main>

      {/* Enhanced Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-full max-w-sm mx-4 shadow-2xl border-0">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="relative">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                  <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-blue-200 rounded-full animate-pulse"></div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">{loadingStep || "Processing Registration"}</h3>
                <p className="text-sm text-gray-600">
                  {loadingStep === "Sending OTP..."
                    ? "We're sending a verification code to your university email"
                    : loadingStep === "Verifying Email..."
                      ? "Checking your university email domain"
                      : loadingStep === "Creating Account..."
                        ? "Setting up your UniConnect profile"
                        : "Please wait while we process your information"}
                </p>
              </div>

              <div className="mt-6">
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full p-4 lg:p-6 relative z-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Need help with registration?{" "}
            <Link href="/support" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
              Contact Support
            </Link>
          </p>
          <div className="mt-2 flex items-center justify-center space-x-4 text-xs text-gray-400">
            <Link href="/terms" className="hover:text-gray-600 transition-colors">
              Terms of Service
            </Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/help" className="hover:text-gray-600 transition-colors">
              Help Center
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SignupPage
