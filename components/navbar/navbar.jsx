"use client"
import Link from "next/link"
import { Home, Menu, MessageSquare, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import SearchBar from "./SearchBar"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        {/* Mobile menu (hamburger icon) */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 pt-4">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <Users className="h-5 w-5" />
                <span>SocialApp</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                <span>Friends</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm">
                <MessageSquare className="h-4 w-4" />
                <span>Messages</span>
              </Link>
              <Link href="#" className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="#" className="flex items-center gap-2 font-semibold">

          <span className="hidden md:inline-block">LIU UNITY</span>
        </Link>


        {/* Search bar */}
        <SearchBar />
      </div>
    </header>
  )
}
