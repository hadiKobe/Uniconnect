"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FriendItem } from "@/components/Friends/friendItem"

export function FriendRequestsSection({ requests, onAccept, onReject }) {
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
      <CardContent>
        {requests.length > 0 ? (
          <div className="grid gap-4">
            {requests.map((friend) => (
              <FriendItem
                key={friend.request_id}
                friend={friend}
                actions={
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onReject(friend.request_id)}>
                      <X className="h-4 w-4 mr-1" />
                      Decline
                    </Button>
                    <Button size="sm" onClick={() => onAccept(friend.request_id)}>
                      <Check className="h-4 w-4 mr-1" />
                      Accept
                    </Button>
                  </div>
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-2">
            <p className="text-muted-foreground">You have no pending friend requests</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
