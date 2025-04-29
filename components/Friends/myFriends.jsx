"use client"

import { useState } from "react";
import { MessageSquare, UserX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FriendItem } from "@/components/Friends/friendItem";
import { useUnFriend } from "@/hooks/Friends/useUnFriend";
import { Badge } from "@/components/ui/badge";

export function MyFriendsSection({ friends }) {
  const { removeFriend, loading, error } = useUnFriend();
  const [loadingId, setLoadingId] = useState(null);
  const [statuses, setStatuses] = useState({});

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onRemove = async (id) => {
    try {
      setLoadingId(id);
      await removeFriend(id);
      await sleep(1000); // wait 1 second
      setStatuses((prev) => ({
        ...prev,
        [id]: "removed", 
      }));
    } catch (err) {
      alert(err.message || "Failed to remove friend.");
    } finally {
      setLoadingId(null);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Friends</CardTitle>
        <CardDescription>People you are connected with</CardDescription>
      </CardHeader>
      <CardContent>
        {friends.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {friends.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={friend}
                actions={
                  statuses[friend.id] === "removed" ? (
                    <Badge variant="default" className="bg-gray-500 hover:bg-gray-600 flex items-center gap-1">
                      <UserX className="h-4 w-4" />
                      Removed
                    </Badge>
                  ) : (
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost">
                        <MessageSquare className="h-4 w-4" />
                        <span className="sr-only">Message</span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={loadingId === friend.id}
                        onClick={() => onRemove(friend.id)}
                      >
                        {loadingId === friend.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-black" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                        <span className="sr-only">Remove friend</span>
                      </Button>
                    </div>
                  )
                }
                
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground">You don't have any friends yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
