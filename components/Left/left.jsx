"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
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
} from "lucide-react";

export function LeftSide() {
  const { data: session, status } = useSession();

  const userName =
    session?.user?.name || `${session?.user?.first_name ?? "User"}`;
  const userMajor = session?.user?.major || "Unknown Major";

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
              <h3 className="font-medium">{userName}</h3>
              <p className="text-xs text-muted-foreground">{userMajor}</p>
              <Badge variant="outline" className="mt-1 text-xs">Student</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Navigation with scroll if needed */}
      <nav className="flex-1 overflow-y-auto p-1">
        <ul className="space-y-1">
          <li>
            <Link href="/home" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <Home className="h-4 w-4" /> Home
            </Link>
          </li>
          <li>
            <Link href="/tutors" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <GraduationCap className="h-4 w-4" /> Tutor Section
            </Link>
          </li>
          <li>
            <Link href="/jobs" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <FileText className="h-4 w-4" /> Job Section
            </Link>
          </li>
          <li>
            <Link href="/market" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <Users className="h-4 w-4" /> Friends Market
            </Link>
          </li>
          <li>
            <Link href="/messages" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <MessageSquare className="h-4 w-4" /> Messages
              <Badge className="ml-auto bg-primary text-xs">5</Badge>
            </Link>
          </li>
          <li>
            <Link href="/notifications" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted">
              <Bell className="h-4 w-4" /> Notifications
              <Badge className="ml-auto bg-primary text-xs">12</Badge>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t p-4">
        <Button variant="outline" size="sm" className="w-full justify-start gap-2">
          <Settings className="h-4 w-4" /> Settings
        </Button>
      </div>
    </div>
  );
}
