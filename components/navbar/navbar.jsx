"use client"

import { useState } from "react"
import Link from "next/link"
import { Bell, Home, Menu, MessageSquare, Search, User, Users } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery)
      // Navigate or filter logic here
    }
  }

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
        <div className="ml-auto flex flex-1 items-center justify-end gap-4">
          <div className="flex justify-center flex-1">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>


          {/* Messages button (desktop only) */}
         

       
          {/* Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
