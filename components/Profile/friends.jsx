"use client";

import { Users, UserPlus, MessageSquare, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AllFriendsDialog } from "./allFriends";
import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export function FriendsCard({
  friends,
  statuses,
  currentLoadingFriendId,
  handleSendRequest,
  handleCancelRequest,
}) {
  const { data: session } = useSession();
  const slicedFriends = friends.slice(0, 4);
  const [openDialog, setOpenDialog] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Friends</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => setOpenDialog(true)}>
          <Users className="h-4 w-4" />
          {friends.length}
          <span className="hidden sm:inline">View All</span>
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {slicedFriends.map((friend) => {
            const friendStatus = statuses[friend.id] || { isFriend: false, pendingRequest: false };
            const isFriend = friendStatus.isFriend;
            const isRequested = friendStatus.pendingRequest;
            const isCurrentUser = session?.user?.id == friend.id;

            return (
              <div
                key={friend.id}
                className="flex items-center justify-between gap-3 w-full flex-wrap sm:flex-nowrap"
              >
                {/* Avatar + Name */}
                <div className="flex items-center gap-3 min-w-0 ">
                  <Avatar className="h-8 w-8 shrink-0 rounded-full overflow-hidden">
                    <AvatarImage src={friend.profile_picture || "/placeholder.svg"} alt={friend.first_name} />
                    <AvatarFallback>{friend.first_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link
                    href={`/Profile/${friend.id}`}
                    prefetch={false}
                    className="text-sm font-medium truncate "
                  >
                    <p className="truncate font-bold hover:underline">
                      {friend.first_name} {friend.last_name}
                    </p>
                    {friend.mutual_friends > 0 && (
                      <span className="text-sm text-gray-500">
                        {friend.mutual_friends} mutual friend{friend.mutual_friends > 1 ? "s" : ""}
                      </span>
                    )}
                  </Link>
                </div>

                {/* Button (conditionally shown) */}
                {!isCurrentUser && (
                  <div className="shrink-0">
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
                  </div>
                )}
              </div>
            );
          })}

        </div>

        <AllFriendsDialog
          open={openDialog}
          onOpenChange={setOpenDialog}
          friends={friends}
          statuses={statuses}
          currentLoadingFriendId={currentLoadingFriendId}
          handleSendRequest={handleSendRequest}
          handleCancelRequest={handleCancelRequest}
        />
      </CardContent>

    </Card>
  );
}
