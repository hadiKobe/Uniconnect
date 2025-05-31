"use client"
import Link from "next/link"
import MobileMenu from "./mobile-menu"
import SearchBar from "./SearchBar"
import { useSession } from "next-auth/react";
import { AddPost } from "../Posts/AddPost"
import { useState } from "react"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, GraduationCap, MessageSquare, Bell } from "lucide-react"
import { useUnreadNotifications } from "@/hooks/notifications/UseCountUnRead";
import { useMessageStore } from "@/lib/store/messageStore";
import { Badge } from "@/components/ui/badge";
import { useGetUserInfo } from "@/hooks/Settings/getUserInfo";
import { useUserStore } from "@/lib/store/userStore";
import { useEffect } from "react";

export default function Navbar() {
  const [showAddPost, setShowAddPost] = useState(false)

  const { data: session } = useSession();

  const { count: notfcount } = useUnreadNotifications(10000, !!session?.user?.id);
  const unreadCounts = useMessageStore((state) => state.unreadCounts);
  const totalUnread = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
  const userInfo = useUserStore((state) => state.userInfo);
  const setUserInfo = useUserStore((state) => state.setUserInfo);
  const { userInfo: info, loading } = useGetUserInfo();
  const notifications = [
    { name: "Messages", icon: <MessageSquare className="h-4 w-4" />, href: "/Messages", badge: totalUnread > 0 ? totalUnread : null },
    { name: "Notifications", icon: <Bell className="h-4 w-4" />, href: "/notifications", badge: notfcount > 0 ? notfcount : null },
  ];
useEffect(() => {
  if (!loading && info) {
    setUserInfo(info); // if your `setUserInfo` already merges as we fixed earlier
  }
}, [info, loading]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">

        {/* Mobile menu (hamburger icon) */}
        <div className="md:hidden">
          <MobileMenu />
        </div>

        {/* Logo */}
        <div
          className="hidden md:flex items-center gap-2 font-semibold"
        >
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-xl font-bold text-gray-900">UniConnect</span>
        </div>


        {/* Search bar */}
        <SearchBar />

        {/* ADDPOST in mobile phones */}
        <div className="flex sm:hidden items-center gap-1 ml-1">
          {notifications.map((feed, index) => (
            <Link
              key={index}
              href={feed.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-2 py-2 text-sm rounded-md transition-colors"
            >
              {feed.icon}
              {feed.badge && (
                <Badge className="ml-auto shrink-0 bg-primary text-xs">
                  {feed.badge}
                </Badge>
              )}
            </Link>
          ))}
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

          <DialogContent className="w-full max-w-4xl px-0 py-4">


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
