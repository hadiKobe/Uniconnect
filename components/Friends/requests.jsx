"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FriendItem } from "@/components/Friends/friendItem";
import { useUpdateFriendRequest } from "@/hooks/Friends/request/useUpdate";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";

export function FriendRequestsSection({ requests, loading }) {
  const { updateFriendRequest, loading: updateLoading, error } = useUpdateFriendRequest();


  const [statuses, setStatuses] = useState({});         // For tracking accept/decline statuses
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null); // "accept" or "decline"
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const initialStatuses = {};
    requests.forEach((friend) => {
      initialStatuses[friend.request_id] = "pending";
    });
    setStatuses(initialStatuses);
  }, [requests]);

  const handleAccept = async (requestId) => {
    try {
      setLoadingId(requestId);
      setLoadingAction("accept");
      await updateFriendRequest(requestId, "accepted");
      await sleep(1000);
      setStatuses((prev) => ({
        ...prev,
        [requestId]: "accepted",
      }));
    } catch (err) {
      alert(err.message || "Failed to accept friend request.");
    } finally {

      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  const handleDecline = async (requestId) => {
    try {
      setLoadingId(requestId);
      setLoadingAction("decline");
      await updateFriendRequest(requestId, "declined");
      await sleep(1000);
      setStatuses((prev) => ({
        ...prev,
        [requestId]: "declined",
      }));
    } catch (err) {
      alert(err.message || "Failed to decline friend request.");
    } finally {

      setLoadingId(null);
      setLoadingAction(null);
    }
  };


  return (
    <Card>
      <CardHeader className="relative">
        <div className="flex items-center gap-2">
          <CardTitle>Friend Requests</CardTitle>
          {requests.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </div>
        <CardDescription>People who want to connect with you</CardDescription>
      </CardHeader>

      <CardContent className="max-h-[300px] overflow-y-auto">{loading ? (
        <div className="flex justify-center py-6">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) :
        requests.length > 0 ? (
          <div className="grid gap-4">
            {requests.map((friend) => {
              const status = statuses[friend.request_id];

              return (
                <FriendItem
                  key={friend.request_id}
                  friend={friend}
                  actions={
                    status === "accepted" ? (
                      <Badge
                        variant="default"
                        className="bg-green-500 hover:bg-green-600 flex items-center gap-1"
                      >
                        <Check className="h-4 w-4" />
                        Accepted
                      </Badge>
                    ) : status === "declined" ? (
                      <Badge
                        variant="default"
                        className="bg-red-500 hover:bg-red-600 flex items-center gap-1"
                      >
                        <X className="h-4 w-4" />
                        Declined
                      </Badge>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingId === friend.request_id && loadingAction === "decline"}
                          onClick={() => handleDecline(friend.request_id)}
                        >
                          {loadingId === friend.request_id && loadingAction === "decline" ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-black" />//loading spinner
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-1" />
                              Decline
                            </>
                          )}
                        </Button>

                        <Button
                          size="sm"
                          disabled={loadingId === friend.request_id && loadingAction === "accept"}
                          onClick={() => handleAccept(friend.request_id)}
                        >
                          {loadingId === friend.request_id && loadingAction === "accept" ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white" />//loading spinner
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Accept
                            </>
                          )}
                        </Button>
                      </div>
                    )
                  }

                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground">You have no pending friend requests</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
