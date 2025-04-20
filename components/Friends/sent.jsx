"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FriendItem } from "@/components/Friends/friendItem"

export function SentRequestsSection({ requests, onDelete }) {

  return (
    <Card>
        <CardHeader className="relative">
        <div className="flex items-center gap-2">
            <CardTitle>Sent Requests</CardTitle>
            
        </div>


        <CardDescription>Friend Requests sent by you</CardDescription>
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
                    <Button size="sm" variant="outline" onClick={() => onDelete(friend.request_id)}>
                      <X className="h-4 w-4 mr-1" />
                      
                    </Button>
                    
                  </div>
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
  )
}
