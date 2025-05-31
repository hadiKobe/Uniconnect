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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import AccountInfo from "../Settings/AccountInfoClient";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
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
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isCurrentUser = Number(userID) === Number(student.id);
  const friendStatus = statuses?.[student.id] || { isFriend: false, pendingRequest: false };
  const isFriend = friendStatus.isFriend;
  const isRequested = friendStatus.pendingRequest;
  const hasShownToast = useRef(false);
  const handleMessageClick = (id) => {
    router.push(`/Messages?userA=${userID}&userB=${id}`);
  };
  useEffect(() => {
    if (isCurrentUser && !hasShownToast.current) {
      const missingFields = [];

      if (!student.bio) missingFields.push("bio");
      if (!student.major) missingFields.push("major");
      if (!student.graduation_progress) missingFields.push("graduation progress");
      if (!student.gpa) missingFields.push("GPA");
      if (!student.joined_in) missingFields.push("expected graduation date");
      if (!student.address) missingFields.push("address");

      if (missingFields.length >= 2) {
        toast.info("Complete your profile for a better experience ✨");
        hasShownToast.current = true; // ✅ only update *after* toast shown
      }
    }
  }, [student, isCurrentUser]);


  return (

    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Avatar */}
          <div className="flex-shrink-0 mx-auto">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden">
              <AvatarImage
                src={student.profile_picture || null}
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
              <div className="w-full flex items-center justify-between gap-7">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold">
                    {student.first_name} {student.last_name}
                  </h1>
                  <p className="text-muted-foreground">{student.major || "Student"}</p>
                </div>

                {/* Right Side Buttons */}
                {isCurrentUser ? (
                  <div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button className="whitespace-nowrap">Edit Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-[95vw] sm:max-w-[1100px] px-7 max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <AccountInfo />
                      </DialogContent>
                    </Dialog>
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleMessageClick(student.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>

                    {Number(currentLoadingFriendId) === Number(student.id) ? (
                      <Button variant="outline" size="sm" disabled className="gap-1">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-black" />
                      </Button>
                    ) : isFriend ? (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleFriendRemove(student.id)}
                      >
                        <UserMinus className="h-4 w-4" />
                        Unfriend
                      </Button>
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
                )}
              </div>
            </div>

            {/* Bio */}
            <p>{student.bio || "I am a student at LIU."}</p>

            {/* Info fields */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                <span>
                  {student.major || "Undeclared"} • {" "}
                  {student.graduation_progress ?? "N/A"}% • GPA:{" "}
                  {student.gpa !== null && student.gpa !== undefined
                    ? student.gpa
                    : "I prefer not to share my GPA"}
                </span>
              </div>

              {student.joined_in &&
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{student.joined_in.split('T')[0]}</span>
                </div>}

              {student.address &&
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{student.address}</span>
                </div>}
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