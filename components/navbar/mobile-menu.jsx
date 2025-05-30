"use client"

import { useState } from "react"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Home,
  LogOut,
  Menu,
  Settings,
  ShoppingBag,
  Users,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { useMessageStore } from "@/lib/store/messageStore"
import { useFriendRequestsCount } from "@/hooks/Friends/request/countRequests"

export default function MobileMenu() {
  const { data: session } = useSession()
  const userId = session?.user?.id
  const userName = session?.user?.name || `${session?.user?.first_name ?? "User"}`
  const userImage = session?.user?.profile_picture || null

  const { count: requestCount } = useFriendRequestsCount(15000, !!session?.user?.id)
  const unreadCounts = useMessageStore((state) => state.unreadCounts)
  const totalUnread = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0)

  const feeds = [
    { name: "Home", icon: <Home className="h-4 w-4" />, href: "/Feed" },
    { name: "Tutor Section", icon: <BookOpen className="h-4 w-4" />, href: "/Feed/Tutoring" },
    { name: "Job Section", icon: <Briefcase className="h-4 w-4" />, href: "/Feed/JobOffers" },
    { name: "Market", icon: <ShoppingBag className="h-4 w-4" />, href: "/Feed/MarketPlace" },
  ]

  const others = [
    {
      name: "Friends",
      icon: <Users className="h-4 w-4" />,
      href: "/Friends",
      badge: requestCount > 0 ? requestCount : null,
    },
    {
      name: "Messages",
      icon: <MessageSquare className="h-4 w-4" />,
      href: "/Messages",
      badge: totalUnread > 0 ? totalUnread : null,
    },
  ]

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-3 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <SheetTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              UniConnect
            </span>
          </SheetTitle>
          <SheetDescription className="sr-only">Navigation menu for UniConnect</SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col">
          {/* Profile Section */}
          <div className="p-4 border-b bg-muted/30">
            <Link
              href={`/Profile/${userId}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <Avatar className="h-10 w-10 ring-2 ring-blue-100">
                <AvatarImage src={userImage || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="bg-blue-600 text-white font-semibold">{userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{userName}</p>
                <p className="text-xs text-muted-foreground">View Profile</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {/* Main Feeds */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Feeds</h3>
              {feeds.map((feed, index) => (
                <Link
                  key={index}
                  href={feed.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
                >
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors">{feed.icon}</div>
                  <span className="font-medium">{feed.name}</span>
                </Link>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Social Features */}
            <div className="space-y-1">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Social</h3>
              {others.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
                >
                  <div className="text-muted-foreground group-hover:text-foreground transition-colors">{item.icon}</div>
                  <span className="font-medium flex-1">{item.name}</span>
                  {item.badge && (
                    <Badge
                      variant="default"
                      className="ml-auto h-5 min-w-[20px] text-xs px-1.5 bg-red-500 hover:bg-red-600"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>

            <Separator className="my-4" />

            {/* Settings */}
            <div className="space-y-1">
              <Link
                href="/Settings/AccountInfo"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors group"
              >
                <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                  <Settings className="h-4 w-4" />
                </div>
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start px-3 py-2.5 text-sm text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => {
                signOut()
                setOpen(false)
              }}
            >
              <LogOut className="mr-3 h-4 w-4" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
