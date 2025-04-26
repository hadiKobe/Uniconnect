import { Users, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function FriendsCard({ userId, friends }) {
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
            {friends.slice(0, 6).map((friend) => (
              <div key={friend.id} className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={friend.profile_picture || "/placeholder.svg"} alt={friend.first_name} />
                  <AvatarFallback>{friend.first_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium truncate">
                  {friend.first_name} {friend.last_name}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" className="w-full gap-1">
            <UserPlus className="h-4 w-4" />
            <span>Add Friend</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
