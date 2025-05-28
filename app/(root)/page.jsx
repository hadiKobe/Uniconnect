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
} from "lucide-react"

export default function HomePage() {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Uni Connect</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
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
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect. Learn. Grow.
                    <span className="text-blue-600"> Together.</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-500 md:text-xl">
                    A real-time social platform designed for university students to connect, collaborate, and exchange
                    services. Share opportunities, get help, and engage with peers across campuses.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/SignUp">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Get Started
                    </Button>
                  </Link>

                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    width="600"
                    height="400"
                    alt="Students collaborating"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">
                  About UniConnect
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Real-Time Campus Connection</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
UniConnect is a university-centered social platform built to foster collaboration, communication, and student-driven services in real time. Designed for Lebanese International University students, it supports account verification via university email and offers a categorized posting system, private messaging, and a secure friend system. Whether you're offering tutoring, selling used books, seeking jobs, or just connecting with peers, UniConnect keeps you engaged and informed—instantly and securely.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-6">
                  <div className="flex items-start space-x-4">
                    <Zap className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold">Real-Time Messaging</h3>
                      <p className="text-gray-500">
                        Instant private messages with read receipts, unread counters, and real-time notifications
                        powered by Socket.IO.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Hash className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold">Multi-Type Posts</h3>
                      <p className="text-gray-500">
                        Create posts in 4 categories: General, Tutor, Job, and Marketplace. Like, comment, and report
                        content.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Heart className="h-6 w-6 text-blue-600 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold">Social Network</h3>
                      <p className="text-gray-500">
                        Add friends, accept requests, and filter feeds by "My Feed", "My Major", or "All Posts".
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Image
                src="/placeholder.svg?height=400&width=600"
                width="600"
                height="400"
                alt="Students using UniConnect platform"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Discover the powerful tools and features designed to enhance your university experience.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <MessageCircle className="h-8 w-8 text-blue-600" />
                  <CardTitle>Real-Time Messaging</CardTitle>
                  <CardDescription>
                    Send private messages instantly with read receipts, unread counters, and real-time notifications
                    using Socket.IO.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Hash className="h-8 w-8 text-blue-600" />
                  <CardTitle>Category-Based Posts</CardTitle>
                  <CardDescription>
                    Create posts in General, Tutor, Job, and Marketplace categories with structured forms and engagement
                    features.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-600" />
                  <CardTitle>Friend System</CardTitle>
                  <CardDescription>
                    Add friends, accept requests, and enjoy personalized feeds filtered by connections and academic
                    interests.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-blue-600" />
                  <CardTitle>Secure Environment</CardTitle>
                  <CardDescription>
                    University-verified accounts with role-based access and content moderation for a safe academic
                    community.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <Calendar className="h-8 w-8 text-blue-600" />
                  <CardTitle>Event Planning</CardTitle>
                  <CardDescription>
                    Organize and discover campus events, study sessions, and social gatherings with your network.
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <CardTitle>Resource Sharing</CardTitle>
                  <CardDescription>
                    Share and access study materials, textbooks, and academic resources within your major and friend
                    network.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section id="video" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Demo</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">See UniConnect in Action</h2>
                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Watch how UniConnect is transforming the way students connect, collaborate, and share resources on
                  campus.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl py-12">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                {!isVideoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="bg-white/90 hover:bg-white text-blue-600"
                      onClick={() => setIsVideoPlaying(true)}
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Play Demo Video
                    </Button>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <div className="text-white text-center">
                      <div className="animate-pulse">
                        <Play className="h-16 w-16 mx-auto mb-4" />
                        <p>Demo video would play here</p>
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
        </section>

        {/* Testimonials */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-600">Testimonials</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">What Students Say</h2>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription>
                    "The real-time messaging is incredible! I can instantly connect with classmates and get help with
                    assignments. The notification system keeps me updated on everything important."
                  </CardDescription>
                  <CardTitle className="text-sm">- Sarah M., Computer Science</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription>
                    "I love the different post categories! Found a great tutor through the Tutor posts and sold my old
                    textbooks in the Marketplace. It's like having everything I need in one place."
                  </CardDescription>
                  <CardTitle className="text-sm">- Mike R., Business Administration</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardDescription>
                    "The friend system and feed filters are perfect! I can see posts from my major, connect with people
                    in my classes, and stay updated on opportunities that matter to me."
                  </CardDescription>
                  <CardTitle className="text-sm">- Emma L., Psychology</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-blue-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">Ready to Connect?</h2>
                <p className="max-w-[600px] text-blue-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of students who are already making the most of their university experience with
                  UniConnect's real-time platform.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
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
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-blue-600" />
          <p className="text-xs text-gray-500">© 2024 UniConnect. Connecting students, building communities.</p>
        </div>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
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
