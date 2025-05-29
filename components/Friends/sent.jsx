"use client";

import { useState } from "react";
import { X , XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FriendItem } from "@/components/Friends/friendItem";
import { useCancelFriendRequest } from "@/hooks/Friends/request/cancel";
import { Loader2 } from "lucide-react";
export function SentRequestsSection({ requests ,loading }) {
  const { cancelFriendRequest } = useCancelFriendRequest();
  const [statuses, setStatuses] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const onDelete = async (id) => {
    try {
      setLoadingId(id);
      await cancelFriendRequest({ requestId: id }); // 👈 pass object not just id
      await sleep(1000);
      setStatuses((prev) => ({
        ...prev,
        [id]: "cancelled",
      }));
    } catch (err) {
      alert(err.message || "Failed to cancel friend request.");
    } finally {
      setLoadingId(null);
    }
  };
  

  return (
    <Card>
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <CardTitle>Sent Requests</CardTitle>
        </div>
        <CardDescription>Friend Requests sent by you</CardDescription>
      </CardHeader>

      <CardContent className="max-h-[200px] overflow-y-auto pr-1">
          {loading ? (
    <div className="flex justify-center py-6">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  ) :
        requests.length > 0 ? (
          <div className="grid gap-4">
            {requests.map((friend) => (
              <FriendItem
                key={friend.request_id}
                friend={friend}
                actions={
                
                  statuses[friend.request_id] === "cancelled" ? (
                    <div className="h-8 w-8 flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-500" />
                  </div>
                  
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={loadingId === friend.request_id}
                      onClick={() => onDelete(friend.request_id)}
                      className="relative"
                    >
                      {loadingId === friend.request_id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-black" />
                        </div>
                      )}
                      <span className={loadingId === friend.request_id ? "invisible" : "flex items-center"}>
                        <X className="h-4 w-4 mr-1" />
                      </span>
                    </Button>
                  )
                  
                  
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground">You sent no requests recently</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
