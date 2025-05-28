"use client";



import SignIn from "@/components/Login/SignIn"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
const SignInPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <header className="w-full p-4 lg:p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
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
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full p-4 lg:p-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            Need help?{" "}
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

export default SignInPage;
