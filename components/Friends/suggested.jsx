"use client"

import { useState } from "react";
import { UserPlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FriendItem } from "@/components/Friends/friendItem";
import { useSendFriendRequest } from "@/hooks/Friends/addFriend";
import { Badge } from "@/components/ui/badge";

export function SuggestedFriendsSection({ suggestions }) {
  const { sendFriendRequest } = useSendFriendRequest();
  const [statuses, setStatuses] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onAdd = async (id) => {
    try {
      setLoadingId(id);
      await sendFriendRequest(id);
      await sleep(1000);
      setStatuses((prev) => ({
        ...prev,
        [id]: "sent",
      }));
    } catch (err) {
      alert(err.message || "Failed to send friend request.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Suggested Friends</CardTitle>
        <CardDescription>People you might know</CardDescription>
      </CardHeader>

      <CardContent>
        {suggestions.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {suggestions.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={friend}
                actions={
                  statuses[friend.id] === "sent" ? (
                    <Badge
                    variant="secondary"
                    className="h-9 px-3 py-2 text-sm font-medium rounded-md flex items-center gap-1 text-blue-600"
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Sent
                  </Badge>

                  ) : (
                   <Button
  size="sm"
  variant="outline"
  disabled={loadingId === friend.id}
  onClick={() => onAdd(friend.id)}
  className="relative"
>
  {loadingId === friend.id && (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-black" />
    </div>
  )}
  <span className={loadingId === friend.id ? "invisible" : "flex items-center"}>
    <UserPlus className="h-4 w-4 mr-1" />
    Add
  </span>
</Button>

                  )
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground">No suggestions available at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
