"use client";

import { Users, UserPlus, MessageSquare , X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSendFriendRequest } from "@/hooks/Friends/addFriend";
import { useBulkFriendCheck } from "@/hooks/Friends/bulkCheckFriends";
import { useSession } from "next-auth/react";
import { useCancelFriendRequest } from "@/hooks/Friends/request/cancel";
import {  useState } from "react";
import Link from "next/link";

export function FriendsCard({ friends }) {
  const { sendFriendRequest, loading: sending } = useSendFriendRequest();
  const { cancelFriendRequest, loading: cancelling } = useCancelFriendRequest();
  const { data: session } = useSession();

  const slicedFriends= friends.slice(0, 4);
  const friendIds= slicedFriends.map(friend => friend.id);
  const [currentLoadingFriendId, setCurrentLoadingFriendId] = useState(null);

  const { statuses, setStatuses, loading } = useBulkFriendCheck(friendIds);


  const handleSendRequest = async (friendId) => {
    setCurrentLoadingFriendId(friendId); // set loading friend
    const result = await sendFriendRequest(friendId);
    if (result.success) {
      setStatuses(prev => ({
        ...prev,
        [friendId]: { ...prev[friendId], pendingRequest: true }
      }));
    }
    setCurrentLoadingFriendId(null); // reset loading
  };
  
  const handleCancelRequest = async (friendId) => {
    setCurrentLoadingFriendId(friendId); 
    const result = await cancelFriendRequest({ friendId });
    if (result.success) {
      setStatuses(prev => ({
        ...prev,
        [friendId]: { ...prev[friendId], pendingRequest: false }
      }));
    }
    setCurrentLoadingFriendId(null);
  };
  
  
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Friends</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1">
          <Users className="h-4 w-4" />
          {friends.length}
          <span>View All</span>
        </Button>
      </CardHeader>

      <CardContent>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {slicedFriends.map((friend) => {
            const friendStatus = statuses[friend.id] || { isFriend: false, pendingRequest: false };
            const isFriend = friendStatus.isFriend;
            const isRequested = friendStatus.pendingRequest;
            const isCurrentUser = session?.user?.id == friend.id;

            return (
              <div key={friend.id} className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={friend.profile_picture || "/placeholder.svg"} alt={friend.first_name} />
                    <AvatarFallback>{friend.first_name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Link href={`/Profile/${friend.id}`} prefetch={false} className="text-sm font-medium truncate hover:underline">
                  <div className="text-sm font-medium truncate">
                    {friend.first_name} {friend.last_name}
                  </div>
                  </Link>
                </div>  

                {!isCurrentUser && (
                  <>
                    {currentLoadingFriendId === friend.id ? (

                      <Button variant="outline" size="sm" disabled className="w-full gap-1">
                        Loading...
                      </Button>
                    ) : isFriend ? (
                      <Button variant="outline" size="sm" className="w-full gap-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>Message</span>
                      </Button>
                    ) : isRequested ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        onClick={() => handleCancelRequest(friend.id)}
                      >
                        <X className="h-4 w-4" />
                        <span>Cancel Request</span>
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-1"
                        onClick={() => handleSendRequest(friend.id)}
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Add Friend</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </CardContent>

    </Card>
  );
}
