"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageSquare, UserPlus, X } from "lucide-react";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
  } from "@/components/ui/tooltip";
  
import Link from "next/link";
import { useSession } from "next-auth/react";

export function AllFriendsDialog({
  open,
  onOpenChange,
  friends,
  statuses,
  currentLoadingFriendId,
  handleSendRequest,
  handleCancelRequest,
}) {
  const { data: session } = useSession();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>All Friends</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {friends.map((friend) => {
            const friendStatus = statuses[friend.id] || { isFriend: false, pendingRequest: false };
            const isFriend = friendStatus.isFriend;
            const isRequested = friendStatus.pendingRequest;
            const isCurrentUser = session?.user?.id == friend.id;

            return (
              <div key={friend.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={friend.profile_picture || "/placeholder.svg"} alt={friend.first_name} />
                    <AvatarFallback>{friend.first_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/Profile/${friend.id}`}
                    prefetch={false}
                    className="text-sm font-medium hover:underline"
                  >
                    {friend.first_name} {friend.last_name}
                  </Link>
                </div>

                {!isCurrentUser && (
                  <>
                    {currentLoadingFriendId === friend.id ? (
                      <Button variant="outline" size="sm" disabled className="gap-1">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-black" />
                      </Button>
                    ) : isFriend ? (
                      <Button variant="outline" size="sm" className="gap-1">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    ) : isRequested ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleCancelRequest(friend.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => handleSendRequest(friend.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
