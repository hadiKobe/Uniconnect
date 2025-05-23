"use client"
import Link from "next/link"
import MobileMenu from "./mobile-menu"
import SearchBar from "./SearchBar"

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        {/* Mobile menu (hamburger icon) */}
        <div className="md:hidden">
          <MobileMenu />
        </div>

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
