"use client"
import Link from "next/link"
import MobileMenu from "./mobile-menu"
import SearchBar from "./SearchBar"
import { AddPost } from "../Posts/AddPost"
import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus,GraduationCap } from "lucide-react"


export default function Navbar() {
  const [showAddPost, setShowAddPost] = useState(false)
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">

        {/* Mobile menu (hamburger icon) */}
        <div className="md:hidden">
          <MobileMenu />
        </div>

        {/* Logo */}
        <Link href="#" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">Uni Connect</span>
        </Link>

        {/* Search bar */}
        <SearchBar />

        {/* ADDPOST in mobile phones */}
        <div className="block sm:hidden ml-2">
          <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="rounded-md text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>

            <DialogContent className="max-w-2xl w-full">
              <DialogHeader>
                <DialogTitle>Create a New Post</DialogTitle>
              </DialogHeader>
              <AddPost onPostAdded={() => { setShowAddPost(false) }} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
