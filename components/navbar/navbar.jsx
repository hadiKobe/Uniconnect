"use client"
import Link from "next/link"
import MobileMenu from "./mobile-menu"
import SearchBar from "./SearchBar"
import { useSession } from "next-auth/react"
import { AddPost } from "../Posts/AddPost"
import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, GraduationCap, MessageSquare, Bell } from "lucide-react"
import { useUnreadNotifications } from "@/hooks/notifications/UseCountUnRead"
import { useMessageStore } from "@/lib/store/messageStore"
import { Badge } from "@/components/ui/badge"
import { useGetUserInfo } from "@/hooks/Settings/getUserInfo"
import { useUserStore } from "@/lib/store/userStore"
import { useEffect } from "react"

export default function Navbar() {
  const [showAddPost, setShowAddPost] = useState(false)

  const { data: session } = useSession()

  const { count: notfcount } = useUnreadNotifications(10000, !!session?.user?.id)
  const unreadCounts = useMessageStore((state) => state.unreadCounts)
  const totalUnread = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0)
  const userInfo = useUserStore((state) => state.userInfo)
  const setUserInfo = useUserStore((state) => state.setUserInfo)
  const { userInfo: info, loading } = useGetUserInfo()

  const notifications = [
    {
      name: "Messages",
      icon: <MessageSquare className="h-4 w-4" />,
      href: "/Messages",
      badge: totalUnread > 0 ? totalUnread : null,
    },
    {
      name: "Notifications",
      icon: <Bell className="h-4 w-4" />,
      href: "/notifications",
      badge: notfcount > 0 ? notfcount : null,
    },
  ]

  useEffect(() => {
    if (!loading && info) {
      setUserInfo(info)
    }
  }, [info, loading, setUserInfo])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left section: Mobile menu + Logo */}
        <div className="flex items-center gap-2">
          {/* Mobile menu (hamburger icon) */}
          <div className="md:hidden">
            <MobileMenu />
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <span className="text-lg sm:text-xl font-bold text-gray-900">
              <span className="hidden sm:inline">UniConnect</span>
             
            </span>
          </div>
        </div>

        {/* Center section: Search bar */}
        <div className="flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Right section: Notifications + Add Post */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notifications - visible on all screen sizes */}
          {notifications.map((feed, index) => (
            <Link
              key={index}
              href={feed.href}
              className="relative flex items-center justify-center p-2 rounded-md hover:bg-accent transition-colors"
            >
              {feed.icon}
              {feed.badge && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[20px]"
                >
                  {feed.badge > 99 ? "99+" : feed.badge}
                </Badge>
              )}
              <span className="sr-only">{feed.name}</span>
            </Link>
          ))}

          {/* Add Post Dialog */}
          <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="sm"
                className="rounded-md text-sm font-medium flex items-center gap-2 ml-1"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Post</span>
              </Button>
            </DialogTrigger>

            <DialogContent className="w-full max-w-4xl px-0 py-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader className="px-6">
                <DialogTitle>Create a New Post</DialogTitle>
              </DialogHeader>
              <div className="px-6">
                <AddPost
                  onPostAdded={() => {
                    setShowAddPost(false)
                  }}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  )
}
