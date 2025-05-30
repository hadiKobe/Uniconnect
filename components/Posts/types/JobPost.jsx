"use client"

import { formatDistanceToNow } from "date-fns"
import { useRouter } from "next/navigation"
import { Briefcase, DollarSign, MapPin, GraduationCap, Clock, MoreHorizontal, Building, ExternalLink } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"

const JobPost = ({ post, onDelete }) => {
   const { data: session } = useSession();
   const currentUserId = session?.user?.id;
   const isAuthor = parseInt(currentUserId) === post.user_id
   const router = useRouter();
   const badgeStyle = "inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer";
   const handleMessageClick = () => {
      router.push(`/Messages?userA=${currentUserId}&userB=${post.user_id}`);
   };
   // Format the date to show how long ago the post was created
   const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

   // Handle click to navigate to single post page
   const handleClick = () => {
      router.push(`/post/${post.id}`)
   }

   // Handle profile click
   const handleProfileClick = (e) => {
      e.stopPropagation()
      router.push(`/Profile/${post.user_id}`)
   }

   return (
      <Card className="hover:shadow-md transition-shadow border-gray-200 overflow-hidden" >
         <CardContent className="p-0">
            {/* LinkedIn-style header with company logo on left */}
            <div className="flex p-4">
               <div className="mr-4">
                  <Avatar className="h-16 w-16 rounded-md cursor-pointer border border-gray-200" onClick={handleProfileClick}>
                     <AvatarImage
                        src={post.profile_picture || "/placeholder.svg"}
                        alt={`${post.user_first_name} ${post.user_last_name}`}
                     />
                     <AvatarFallback className="bg-blue-100 text-blue-600 rounded-md">
                        <Building className="h-8 w-8" />
                     </AvatarFallback>
                  </Avatar>
               </div>

               <div className="flex-1">
                  {/* Job title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 hover:underline cursor-pointer">
                     {post.position}
                  </h3>

                  {/* Company name and basic info */}
                  <div className="flex items-center mb-1">
                     <span className="font-medium text-gray-700 hover:underline cursor-pointer" onClick={handleProfileClick}>
                        {post.user_first_name} {post.user_last_name}
                     </span>
                  </div>

                  {/* Location and posting time */}
                  <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-2">
                     {post.location && (
                        <div className={badgeStyle}>
                           <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
                           {post.location}
                        </div>
                     )}
                     <div className='flex items-center'>
                        <Clock className="h-3.5 w-3.5 mr-1 text-gray-400" />
                        {timeAgo}
                     </div>
                  </div>
               </div>

               {/* Actions menu */}
               {onDelete && (
                  <div>
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                           <DropdownMenuItem
                              onClick={(e) => {
                                 e.stopPropagation()
                                 onDelete(post.id)
                              }}
                           >
                              Delete
                           </DropdownMenuItem>
                           <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Report</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </div>
               )}
            </div>

            {/* Job details section */}
            <div className="px-4 pb-3">
               <div className="flex flex-wrap gap-2 mb-2">
                  {post.job_type && (
                     <Badge
                        variant="outline"
                        className={badgeStyle}
                     >
                        <Briefcase className="h-3.5 w-3.5" />
                        {post.job_type}
                     </Badge>
                  )}

                  {post.salary && (
                     <Badge
                        variant="outline"
                        className={badgeStyle}
                     >
                        <DollarSign className="h-3.5 w-3.5" />
                        {post.salary}
                     </Badge>
                  )}

                  <Badge
                     variant="outline"
                     className={badgeStyle}
                  >
                     <GraduationCap className="h-3.5 w-3.5" />
                     {post.major}
                  </Badge>
               </div>
            </div>

            {/* Footer with action buttons */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
               {/* <div className="text-xs text-gray-500">Job ID: {post.id?.substring(0, 8)}</div> */}

               <div className="flex gap-2">
                  {!isAuthor && <Button
                     variant="default"
                     size="sm"
                     className="text-sm font-medium bg-black hover:bg-amber-950"
                     onClick={handleMessageClick}
                  >
                     Apply Now
                  </Button>}

                  <button
                     onClick={handleClick}
                     className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
                  >
                     See More <ExternalLink className="h-3.5 w-3.5" />
                  </button>

               </div>
            </div>
         </CardContent>
      </Card>
   )
}

export default JobPost
