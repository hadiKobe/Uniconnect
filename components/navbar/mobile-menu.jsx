"use client"

import { useState } from "react"
import { signOut } from "next-auth/react";
import Link from "next/link"
import { Bell, BookOpen, Briefcase, Home, LogOut, Menu, Settings, ShoppingBag, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export default function MobileMenu() {
   const feeds = [
      { name: "Home", icon: <Home className="h-4 w-4" />, href: "/Feed" },
      { name: "Tutor Section", icon: <BookOpen className="h-4 w-4" />, href: "/Feed/Tutoring" },
      { name: "Job Section", icon: <Briefcase className="h-4 w-4" />, href: "/Feed/JobOffers" },
      { name: "Market", icon: <ShoppingBag className="h-4 w-4" />, href: "/Feed/MarketPlace" },
   ]

   const others = [
      { name: "Friends", icon: <Users className="h-4 w-4" />, href: "/Friends" },
      { name: "Notifications", icon: <Bell className="h-4 w-4" />, href: "/notifications" },
   ]

   const [open, setOpen] = useState(false);

   return (
      <Sheet open={open} onOpenChange={setOpen}>
         <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((prev) => !prev)}>
               <Menu className="h-5 w-5" />
               <span className="sr-only">Toggle menu</span>
            </Button>
         </SheetTrigger>
         <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
            <SheetHeader className="px-6 py-4 border-b">
               <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5" />
                  <span>SocialApp</span>
               </SheetTitle>
               <SheetDescription className="sr-only">Navigation menu for SocialApp</SheetDescription>
            </SheetHeader>

            <nav className="flex flex-col px-1">
               <div className="space-y-1">
                  {feeds.map((feed, index) => {
                     return (
                        <Link
                           key={index}
                           href={feed.href}
                           onClick={() => setOpen(false)}
                           className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                           {feed.icon}
                           <span>{feed.name}</span>
                        </Link>
                     );
                  })}

                  <Separator className="my-4" />

                  {others.map((feed, index) => {
                     return (
                        <Link
                           key={index}
                           href={feed.href}
                           onClick={() => setOpen(false)}
                           className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                           {feed.icon}
                           <span>{feed.name}</span>
                        </Link>
                     );
                  })}

                  <Separator className="my-4" />

                  <Link
                     href="/Settings/AccountInfo"
                     className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                     <Settings className="h-4 w-4" />
                     <span>Settings</span>
                  </Link>
               </div>


               <Button
                  variant="ghost"
                  className="justify-start px-3 py-2 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                  onClick={() => signOut()}
               >
                  <LogOut className="mr-3 h-4 w-4" />
                  Logout
               </Button>
            </nav>
         </SheetContent>
      </Sheet>
   )
}
