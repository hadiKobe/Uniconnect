"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  FileText,
  Home,
  MessageSquare,
  Settings,
  Users,
  GraduationCap,
  ShoppingBag,
} from "lucide-react";
import { useState, useEffect } from "react"
import { useUnreadNotifications } from "@/hooks/notifications/UseCountUnRead";
import { useMessageStore } from "@/lib/store/messageStore";
import { useFriendRequestsCount } from "@/hooks/Friends/request/countRequests";

export default function LeftSide({ onSettingsClick }) {
  const { data: session, status } = useSession();
 
  const pathname = usePathname()
  const isActive = (href) => pathname === href;
  const { count } = useUnreadNotifications(); // Fetch unread notifications count

  const userId = session?.user?.id;

  const unreadCounts = useMessageStore((state) => state.unreadCounts);
  const totalUnread = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);
  const userName =session?.user?.name || `${session?.user?.first_name ?? "User"}`;
  const userMajor = session?.user?.major || "Unknown Major";
 
  const { count: requestCount } = useFriendRequestsCount(15000, !!session?.user?.id);
  const { count: notfcount } = useUnreadNotifications(10000, !!session?.user?.id);// Fetch unread notifications count


  const linkStyle = {
    selected: "bg-black text-white hover:bg-amber-950",
    notSelected: "text-gray-800 hover:bg-gray-100"
  };

  const list = [
    {
      href: "/Feed",
      icon: Home,
      label: "Home"
    },
    {
      href: "/Feed/Tutoring",
      icon: GraduationCap,
      label: "Tutor Section"
    },
    {
      href: "/Feed/JobOffers",
      icon: FileText,
      label: "Job Section"
    },
    {
      href: "/Feed/MarketPlace",
      icon: ShoppingBag,
      label: "Market"
    },
    {
      href: "/Friends",
      icon: Users,
      label: "Friends",
      badge: requestCount > 0 ? requestCount : null
    },
    {
      href: "/Messages",
      icon: MessageSquare,
      label: "Messages",
      badge: totalUnread > 0 ? totalUnread : null
    },
    {
      href: "/notifications",
      icon: Bell,
      label: "Notifications",
      badge: count > 0 ? count : null
    }
  ];


  if (status === "loading") return null; // or a loader, skeleton, etc.
  return (
    <div className="w-64 border-r bg-background flex flex-col h-full">
      {/* Profile Section */}
      <div className="p-4">
        <Card className="p-4 bg-muted/50">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg?height=64&width=64" alt="Profile" />
              <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="text-center">
              <Link href={`/Profile/${userId}`} prefetch={false} className="text-sm font-medium truncate hover:underline">
                <h3 className="font-medium">{userName}</h3>
              </Link>
              <p className="text-xs text-muted-foreground">{userMajor}</p>
              <Badge variant="outline" className="mt-1 text-xs">Student</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation with scroll if needed */}
      <nav className="flex-1 overflow-y-auto p-1">
        <ul className="space-y-1">
          {/* <li>
            <Link href="/Feed" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <Home className="h-4 w-4" /> Home
            </Link>
          </li>
          <li>
            <Link href="/Feed/Tutoring" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <GraduationCap className="h-4 w-4" /> Tutor Section
            </Link>
          </li>
          <li>
            <Link href="/Feed/JobOffers" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <FileText className="h-4 w-4" /> Job Section
            </Link>
          </li>
          <li>
            <Link href="/Feed/MarketPlace" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <ShoppingBag className="h-4 w-4" /> Market
            </Link>
          </li>

          <li>
            <Link href="/Friends" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <Users className="h-4 w-4" /> friends
              {requestCount > 0 && (
                <Badge className="ml-auto  shrink-0 bg-primary text-xs">{requestCount}</Badge>
              )}

            </Link>
          </li>
          <li>
            <Link href="/Messages" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <MessageSquare className="h-4 w-4" /> Messages
              {totalUnread > 0 && (
                <Badge className="ml-auto bg-primary text-xs">{totalUnread}</Badge>
              )}
            </Link>
          </li>
         <li>
            <Link href="/notifications" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <Bell className="h-4 w-4" /> Notifications
              {notfcount > 0 && (
                <Badge className="ml-auto  shrink-0 bg-primary text-xs">{notfcount}</Badge>
              )}
            </Link>
          </li> */}
          {list.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ",
                  isActive(item.href) ? linkStyle.selected : linkStyle.notSelected
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.badge && (
                  <Badge className="ml-auto shrink-0 bg-primary text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2" onClick={onSettingsClick}>
          <Settings className="h-4 w-4" /> Settings
        </Button>
      </div>
    </div>
  );
}
