'use client';

import Link from 'next/link';
import { User, CornerDownRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner"

const UserCard = ({ user }) => {
   return (
      <Link href={`/Profile/${user.id}`}>
         <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardContent className="px-2 flex items-center gap-4">
               <Avatar className="h-12 w-12 rounded-full overflow-hidden">
                  <AvatarImage src={user.profile_picture} alt={user.name} />
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
                  {/* <Button
                     variant="ghost"
                     size="sm"
                     className="flex items-center gap-1 px-2 ml-auto"
                     onClick={() => toast("This feature is coming soon!")}
                  >
                     <CornerDownRight className="h-4 w-4" />
                     <span className="text-sm text-gray-500">Reply privately</span>
                  </Button> */}
               </div>
            </CardContent>
         </Card>
      </Link>
   );
};

export default UserCard;