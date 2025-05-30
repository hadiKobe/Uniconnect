"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { GraduationCap, BookOpen, Briefcase, Home, LogOut, Menu, Settings, ShoppingBag, Users, MessageSquare } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { useMessageStore } from "@/lib/store/messageStore";
import { useFriendRequestsCount } from "@/hooks/Friends/request/countRequests";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function MobileMenu() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userName = session?.user?.name || `${session?.user?.first_name ?? "User"}`;
  const userImage = session?.user?.profile_picture || null;

  const { count: requestCount } = useFriendRequestsCount(15000, !!session?.user?.id);
  const unreadCounts = useMessageStore((state) => state.unreadCounts);
  const totalUnread = Object.values(unreadCounts).reduce((acc, count) => acc + count, 0);

  const feeds = [
    { name: "Home", icon: <Home className="h-4 w-4" />, href: "/Feed" },
    { name: "Tutor Section", icon: <BookOpen className="h-4 w-4" />, href: "/Feed/Tutoring" },
    { name: "Job Section", icon: <Briefcase className="h-4 w-4" />, href: "/Feed/JobOffers" },
    { name: "Market", icon: <ShoppingBag className="h-4 w-4" />, href: "/Feed/MarketPlace" },
  ];

  const others = [
    { name: "Friends", icon: <Users className="h-4 w-4" />, href: "/Friends", badge: requestCount > 0 ? requestCount : null },
    { name: "Messages", icon: <MessageSquare className="h-4 w-4" />, href: "/Messages", badge: totalUnread > 0 ? totalUnread : null },
  ];

  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
        <SheetHeader className="px-6 py-3 border-b">
          <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="h-5 w-5 text-blue-600" />
            <span>UniConnect</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Navigation menu for UniConnect</SheetDescription>
        </SheetHeader>

        <nav className="flex flex-col px-1">
          <Link
            href={`/Profile/${userId}`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Avatar className="relative h-5 w-5 rounded-full overflow-hidden">
              <AvatarImage src={userImage} alt="Profile" />
              <AvatarFallback>{userName?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="truncate font-bold">Profile</span>
          </Link>

          <div className="space-y-1">
            {feeds.map((feed, index) => (
              <Link
                key={index}
                href={feed.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {feed.icon}
                <span>{feed.name}</span>
              </Link>
            ))}

            <Separator className="my-4" />

            {others.map((feed, index) => (
              <Link
                key={index}
                href={feed.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {feed.icon}
                <span>{feed.name}</span>
                {feed.badge && (
                  <Badge className="ml-auto shrink-0 bg-primary text-xs">
                    {feed.badge}
                  </Badge>
                )}
              </Link>
            ))}

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
  );
}
