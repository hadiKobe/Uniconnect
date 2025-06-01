"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  MessageCircle,
  Calendar,
  Play,
  GraduationCap,
  Star,
  Zap,
  Hash,
  Heart,
  Shield,
  Menu,
  X,
} from "lucide-react"

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          <span className="ml-2 text-lg sm:text-xl font-bold text-gray-900">Uni Connect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden md:flex gap-4 sm:gap-6 items-center">
          <Link href="#about" className="text-sm font-medium hover:text-blue-600 transition-colors">
            About
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#video" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Demo
          </Link>
          <Link href="/SignIn">
            <Button variant="outline" size="sm">
              Sign In
            </Button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="ml-auto md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b shadow-lg md:hidden">
            <nav className="flex flex-col p-4 space-y-4">
              <Link
                href="#about"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="#video"
                className="text-sm font-medium hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Demo
              </Link>
              <Link href="/SignIn" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="space-y-2">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tighter">
                    Connect. Learn. Grow.
                    <span className="text-blue-600"> Together.</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 text-base sm:text-lg md:text-xl mx-auto lg:mx-0">
                    A real-time social platform designed for university students to connect, collaborate, and exchange
                    services. Share opportunities, get help, and engage with peers across campuses.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 justify-center lg:justify-start">
                  <Link href="/SignUp">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex items-center justify-center order-first lg:order-last">
                <div className="relative w-full max-w-md lg:max-w-none">
                  <Image
                    src="/friendsCollbrating.png?height=400&width=600"
                    width="600"
                    height="400"
                    alt="Students collaborating"
                    className="w-full h-auto aspect-video  rounded-xl object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="w-full py-8 sm:py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  About UniConnect
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Real-Time Campus Connection
                </h2>
                <p className="max-w-[900px] text-gray-500 text-base sm:text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed px-4">
                  UniConnect is a university-centered social platform built to foster collaboration, communication, and
                  student-driven services in real time. Designed for Lebanese International University students, it
                  supports account verification via university email and offers a categorized posting system, private
                  messaging, and a secure friend system. Whether you're offering tutoring, selling used books, seeking
                  jobs, or just connecting with peers, UniConnect keeps you engaged and informed—instantly and securely.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-8 sm:py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4 order-2 lg:order-1">
                <div className="grid gap-4 sm:gap-6">
                  <div className="flex items-start space-x-4">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Real-Time Messaging</h3>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Instant private messages with read receipts, unread counters, and real-time notifications
                        powered by Socket.IO.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Hash className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Multi-Type Posts</h3>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Create posts in 4 categories: General, Tutor, Job, and Marketplace. Like, comment, and report
                        content.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold">Social Network</h3>
                      <p className="text-gray-500 text-sm sm:text-base">
                        Add friends, accept requests, and filter feeds by "My Feed", "My Major", or "All Posts".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <Image
                  src="/interface.png?height=400&width=600"
                  width="600"
                  height="400"
                  alt="Students using UniConnect platform"
                  className="w-full h-auto aspect-video  rounded-xl object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Features</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  Everything You Need to Succeed
                </h2>
                <p className="max-w-[900px] text-gray-500 text-base sm:text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed px-4">
                  Discover the powerful tools and features designed to enhance your university experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-stretch gap-4 sm:gap-6 py-8 sm:py-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="h-full">
                <CardHeader className="h-full">
                  <MessageCircle className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <CardTitle className="text-lg sm:text-xl">Real-Time Messaging</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Send private messages instantly with read receipts, unread counters, and real-time notifications
                    using Socket.IO.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="h-full">
                <CardHeader className="h-full">
                  <Hash className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <CardTitle className="text-lg sm:text-xl">Category-Based Posts</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Create posts in General, Tutor, Job, and Marketplace categories with structured forms and engagement
                    features.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="h-full md:col-span-2 lg:col-span-1">
                <CardHeader className="h-full">
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <CardTitle className="text-lg sm:text-xl">Friend System</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Add friends, accept requests, and enjoy personalized feeds filtered by connections and academic
                    interests.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="h-full">
                <CardHeader className="h-full">
                  <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <CardTitle className="text-lg sm:text-xl">Secure Environment</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    University-verified accounts with role-based access and content moderation for a safe academic
                    community.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="h-full">
                <CardHeader className="h-full">
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <CardTitle className="text-lg sm:text-xl">Event Planning</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Organize and discover campus events, study sessions, and social gatherings with your network.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="h-full md:col-span-2 lg:col-span-1">
                <CardHeader className="h-full">
                  <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
                  <CardTitle className="text-lg sm:text-xl">Resource Sharing</CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Share and access study materials, textbooks, and academic resources within your major and friend
                    network.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Video Section */}
        {/* <section id="video" className="w-full py-8 sm:py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Demo</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  See UniConnect in Action
                </h2>
                <p className="max-w-[900px] text-gray-500 text-base sm:text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed px-4">
                  Watch how UniConnect is transforming the way students connect, collaborate, and share resources on
                  campus.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-8 sm:py-12">
              <div className="relative aspect-video rounded-xl  bg-gray-100 shadow-lg">
                {!isVideoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-blue-600"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Play className="h-4 w-4 sm:h-6 sm:w-6 mr-2" />
                      <span className="text-sm sm:text-base">Play Demo Video</span>
                    </Button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-white text-center p-4">
                      <div className="animate-pulse">
                        <Play className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4" />
                        <p className="text-sm sm:text-base">Demo video would play here</p>
                        <Button variant="outline" className="mt-4" onClick={() => setIsVideoPlaying(false)}>
                          Close Video
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                <Image
                  src="/placeholder.svg?height=400&width=800"
                  width="800"
                  height="400"
                  alt="Video thumbnail"
                  className={`w-full h-full object-cover ${isVideoPlaying ? "opacity-0" : "opacity-100"}`}
                />
              </div>
            </div>
          </div>
        </section> */}

        {/* Testimonials */}
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Testimonials</div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter">
                  What Students Say
                </h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-stretch gap-4 sm:gap-6 py-8 sm:py-12 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              <Card className="h-full">
                <CardHeader className="h-full">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-sm sm:text-base">
                    "The real-time messaging is incredible! I can instantly connect with classmates and get help with
                    assignments. The notification system keeps me updated on everything important."
                  </CardDescription>
                  <CardTitle className="text-xs sm:text-sm">- Sarah M., Computer Science</CardTitle>
                </CardHeader>
              </Card>
              <Card className="h-full">
                <CardHeader className="h-full">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-sm sm:text-base">
                    "I love the different post categories! Found a great tutor through the Tutor posts and sold my old
                    textbooks in the Marketplace. It's like having everything I need in one place."
                  </CardDescription>
                  <CardTitle className="text-xs sm:text-sm">- Mike R., Business Administration</CardTitle>
                </CardHeader>
              </Card>
              <Card className="h-full md:col-span-2 lg:col-span-1">
                <CardHeader className="h-full">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription className="text-sm sm:text-base">
                    "The friend system and feed filters are perfect! I can see posts from my major, connect with people
                    in my classes, and stay updated on opportunities that matter to me."
                  </CardDescription>
                  <CardTitle className="text-xs sm:text-sm">- Emma L., Psychology</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-8 sm:py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-white">
                  Ready to Connect?
                </h2>
                <p className="max-w-[600px] text-blue-100 text-base sm:text-lg md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed px-4">
                  Join thousands of students who are already making the most of their university experience with
                  UniConnect's real-time platform.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2 px-4">
                <Link href="/SignUp" className="block">
                  <Button size="lg" variant="secondary" className="w-full">
                    Join UniConnect Today
                  </Button>
                </Link>
                <p className="text-xs text-blue-100">Free to join. Connect with your university email.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <div className="flex items-center space-x-2 justify-center sm:justify-start">
          <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © 2024 UniConnect. Connecting students, building communities.
          </p>
        </div>
        <nav className="sm:ml-auto flex flex-wrap gap-4 sm:gap-6 justify-center">
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            Privacy Policy
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            Contact Us
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4 text-gray-500">
            Help Center
          </Link>
        </nav>
      </footer>
    </div>
  )
}
