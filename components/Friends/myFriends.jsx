"use client"

import { MessageSquare, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FriendItem } from "@/components/Friends/friendItem"

export function MyFriendsSection({ friends, onRemove }) {
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
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <MessageSquare className="h-4 w-4" />
                      <span className="sr-only">Message</span>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => onRemove(friend.id)}>
                      <UserX className="h-4 w-4" />
                      <span className="sr-only">Remove friend</span>
                    </Button>
                  </div>
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
  )
}
