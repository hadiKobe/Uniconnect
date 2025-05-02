"use client";

import {
  Mail,
  MapPin,
  Calendar,
  GraduationCap,
  UserPlus,
  X,
  MessageSquare,
  UserMinus,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";

export function ProfileHeader({
  student,
  statuses,
  currentLoadingFriendId,
  handleSendRequest,
  handleCancelRequest,
  handleFriendRemove, 
}) {
  const { data: session } = useSession();
  const userID = session?.user?.id;

  const isCurrentUser = Number(userID) === Number(student.id);
  const friendStatus = statuses?.[student.id] || { isFriend: false, pendingRequest: false };
  const isFriend = friendStatus.isFriend;
  const isRequested = friendStatus.pendingRequest;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage
                src={student.profile_picture || "/placeholder.svg"}
                alt={student.first_name}
              />
              <AvatarFallback className="text-2xl">
                {student.first_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {student.first_name} {student.last_name}
                  </h1>
                  <p className="text-muted-foreground">{student.major || "Student"}</p>
                </div>

                {/* Right Side Buttons */}
                {isCurrentUser ? (
                  <Button>Edit Profile</Button>
                ) : Number(currentLoadingFriendId) === Number(student.id) ? (
                  <Button variant="outline" size="sm" disabled className="gap-1">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-black" />
                  </Button>
                ) : isFriend ? (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleFriendRemove(student.id)}
                    >
                      <UserMinus className="h-4 w-4" />
                      Unfriend
                    </Button>
                  </div>
                ) : isRequested ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleCancelRequest(student.id)}
                  >
                    <X className="h-4 w-4" />
                    Cancel Request
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleSendRequest(student.id)}
                  >
                    <UserPlus className="h-4 w-4" />
                    Add Friend
                  </Button>
                )}
              </div>
            </div>

            <p>{student.bio || "I am a student at LIU."}</p>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>
                  {student.major || "Undeclared"} •{" "}
                  {student.graduation_progress ?? "N/A"} • GPA:{" "}
                  {student.gpa !== null && student.gpa !== undefined
                    ? student.gpa
                    : "I prefer not to share my GPA"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{student.expected_graduation_date || "Graduation date not set"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{student.address || "No address provided"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${student.email}`}
                  className="text-primary hover:underline"
                >
                  {student.email || "No email"}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                Joined {student.joined_at?.split("T")[0] || "Unknown"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
