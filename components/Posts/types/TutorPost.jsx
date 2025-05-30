"use client"

import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { MapPin, CornerDownRight, Clock, GraduationCap, BookOpen, DollarSign, ExternalLink, MoreHorizontal } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"

export default function TutorPost({ post, onDelete }) {
   const { data: session } = useSession();
   const currentUserId = session?.user?.id;
   const isAuthor = parseInt(currentUserId) === post.user_id
   const router = useRouter();
   const badgeStyle = "inline-flex items-center gap-1.5 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer";
   const handleMessageClick = () => {
      router.push(`/Messages?userA=${currentUserId}&userB=${post.user_id}`);
   };
   // Format the date to be more readable
   const formattedDate = post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true }) : "Recently"

   // Handle click to navigate to single post page
   const handleClick = () => { router.push(`/post/${post.id}`) }

   // Handle profile click
   const handleProfileClick = (e) => {
      e.stopPropagation()
      router.push(`/Profile/${post.user_id}`)
   }

   return (
      <Card className={`hover:shadow-md transition-shadow `}      >
         <CardContent className="p-4">
            {/* Header with user info and actions */}
            <div className="flex items-center justify-between mb-3">
               <div className="flex items-center" onClick={handleProfileClick}>
                  <Avatar className="h-12 w-12 mr-3 cursor-pointer rounded-full overflow-hidden">
                     <AvatarImage
                        src={post.profile_picture}
                        alt={`${post.user_first_name} ${post.user_last_name}`}
                     />
                     <AvatarFallback className="bg-purple-100 text-purple-600">
                        {post.user_first_name?.charAt(0)}{post.user_last_name?.charAt(0)}
                     </AvatarFallback>
                  </Avatar>
                  <div>
                     <div className="font-medium text-gray-900 hover:underline cursor-pointer">
                        {post.user_first_name} {post.user_last_name}
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                        <div className="flex items-center">
                           <GraduationCap className="h-3 w-3 mr-1" />
                           {post.major}
                        </div>
                        {post.subject && (
                           <div className="flex items-center">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {post.subject}
                           </div>
                        )}
                     </div>
                  </div>
               </div>

               {onDelete && (
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                           <MoreHorizontal className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                           e.stopPropagation()
                           onDelete(post.id)
                        }}>
                           Delete
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                           Report
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               )}
            </div>

            {/* Tutor content */}
            <p className="text-gray-800 mb-4 line-clamp-3">{post.content}</p>

            {/* Tutor details */}
            <div className="flex flex-wrap gap-2 mb-3">
               {post.rate && (
                  <Badge variant="outline" className={`${badgeStyle} bg-green-50 text-green-700 border-green-200`}>
                     <DollarSign className="h-3.5 w-3.5" />
                     ${post.rate}/hr
                  </Badge>
               )}
               {post.location && (
                  <Badge variant="outline" className={`${badgeStyle} bg-red-50 text-red-700 border-red-200`} >
                     <MapPin className="h-3.5 w-3.5" />
                     {post.location}
                  </Badge>
               )}
               {post.subject && (
                  <Badge variant="outline" className={`${badgeStyle} bg-purple-50 text-purple-700 border-purple-200`} >
                     <BookOpen className="h-3.5 w-3.5" />
                     {post.subject}
                  </Badge>
               )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
               <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {formattedDate}
               </div>

               <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 p-0 h-auto"
                  onClick={(e) => {
                     e.stopPropagation()
                     handleClick()
                  }}
               >
                  See More <ExternalLink className="h-3.5 w-3.5 ml-1" />
               </Button>

               {!isAuthor && <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1 px-2 ml-auto"
                  onClick={handleMessageClick}
               >
                  <CornerDownRight className="h-4 w-4" />
                  <span className="text-sm text-gray-500">Reply privately</span>
               </Button>}

            </div>
         </CardContent>
      </Card>
   )
}
