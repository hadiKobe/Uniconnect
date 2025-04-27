'use client';

import Link from 'next/link';
import { User } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserCard = ({ user }) => {
   return (
      <Link href={`/profile/${user.id}`}>
         <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="px-2 flex items-center gap-4">
               <Avatar className="h-12 w-12">
                  <AvatarImage src={user.profile_picture || "/placeholder.svg?height=48&width=48"} alt={user.name} />
                  <AvatarFallback>
                     <User className="h-6 w-6" />
                  </AvatarFallback>
               </Avatar>
               <div className="flex-1">
                  <h3 className="font-medium">{user.name}</h3>
                  {user.mutualFriendsCount !== undefined && (
                     <p className="text-sm text-muted-foreground">
                        {user.mutualFriendsCount} mutual friend{user.mutualFriendsCount !== 1 ? 's' : ''}
                     </p>
                  )}
               </div>
            </CardContent>
         </Card>
      </Link>
   );
};

export default UserCard;