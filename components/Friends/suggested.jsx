"use client"

import { UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FriendItem } from "@/components/Friends/friendItem"

export function SuggestedFriendsSection({ suggestions, onAdd }) {
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
                  <Button size="sm" variant="outline" onClick={() => onAdd(friend.id)}>
                    <UserPlus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
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
  )
}
