"use client"
import {
   differenceInDays,
   differenceInHours,
   differenceInMinutes,
   differenceInSeconds,
} from "date-fns";
import { toast } from "sonner";
import { MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Report from "@/components/Posts/Report"
import useDeletePost from "@/hooks/Posts/deletePost";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"


// Function to get badge variant based on post type
const getPostTypeBadgeVariant = (type) => {
   switch (type?.toLowerCase()) {
      case 'tutor':
         return 'blue'
      case 'job':
         return 'green'
      case 'market':
         return 'amber'
      default:
         return 'secondary'
   }
}

// Function to get badge styles based on variant
const getBadgeStyles = (variant) => {
   switch (variant) {
      case 'blue':
         return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'green':
         return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'amber':
         return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
      default:
         return 'bg-secondary text-secondary-foreground hover:bg-secondary'
   }
}

const postTypeEmoji = {
   tutor: "📚",
   job: "💼",
   market: "🛒",
   general: ''
}
function getShortTimeAgo(date) {
   const now = new Date();

   const days = differenceInDays(now, date);
   if (days > 0) return `${days}d`;

   const hours = differenceInHours(now, date);
   if (hours > 0) return `${hours}h`;

   const minutes = differenceInMinutes(now, date);
   if (minutes > 0) return `${minutes}m`;

   const seconds = differenceInSeconds(now, date);
   return `${seconds}s`;
}
export default function Header({ headerInfo }) {

   const { post_id, user_id, first_name, last_name, major, created_at, post_type = "general", onDelete, profile_picture } = headerInfo;
   const publishedAt = new Date(created_at); // ✅ must be here first
   const timeAgo = getShortTimeAgo(publishedAt); // ✅ now this works


   const { data: session } = useSession()
   const currentUserId = parseInt(session?.user?.id)
   const isAuthor = currentUserId === user_id

   const badgeVariant = getPostTypeBadgeVariant(post_type)
   const badgeStyles = getBadgeStyles(badgeVariant)

   const [isReportOpen, setIsReportOpen] = useState(false);

   const { loading, error, success, fetchDeletePost } = useDeletePost()

   const handleDeletePost = async () => {
      fetchDeletePost(post_id);
   }

   useEffect(() => {
      if (success) {
         onDelete(post_id); // Call the onDelete function passed as a prop
         toast.success("Post Deleted successfully");
      }
      else if (error) {
         toast.error(error || "Post was not deleted.");
      }
   }, [success, error]);

   return (
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Avatar className="relative h-10 w-10 rounded-full overflow-hidden">
               <AvatarImage
                  src={profile_picture || null}
                  alt={first_name}
               />
               <AvatarFallback className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-600 font-medium text-base">
                  {first_name?.charAt(0)}
               </AvatarFallback>
            </Avatar>

            <div>
               <div className="flex items-center gap-2">
                  <Link href={`/Profile/${user_id}`} prefetch={false} className="text-sm font-medium truncate hover:underline">
                     <h3 className="font-medium">{`${first_name} ${last_name}`}</h3>
                  </Link>
                  <Badge className={`text-xs font-medium ${badgeStyles} transition-all duration-200 hover:px-3 cursor-pointer`} variant="outline">
                     {post_type?.charAt(0).toUpperCase() + post_type?.slice(1).toLowerCase() + postTypeEmoji[post_type] || "General"}
                  </Badge>
               </div>

               <div className="flex items-center text-sm text-muted-foreground">
                  <span>{major}</span>
                  <span className="mx-1">•</span>
                  <time dateTime={publishedAt.toISOString()}>{timeAgo}</time>
               </div>
            </div>
         </div>

         {(onDelete || !isAuthor) && (
            <div className="flex items-center gap-2">
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">

                     {!isAuthor && (
                        <>
                           <DropdownMenuItem
                              onClick={() => {
                                 document.activeElement?.blur();        // ✅ close dropdown safely
                                 setTimeout(() => setIsReportOpen(true), 50); // ✅ slight delay = Radix-safe
                              }}
                           >
                              Report
                           </DropdownMenuItem>
                        </>
                     )}

                     {isAuthor && (
                        <>
                           <DropdownMenuItem
                              onClick={handleDeletePost}
                              className="text-destructive focus:text-destructive"
                           >
                              Delete post
                           </DropdownMenuItem>
                        </>
                     )}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>)}

         <Report
            postId={post_id}
            isOpen={isReportOpen}
            onClose={(val) => setIsReportOpen(val)}
         />
      </div>
   )
}
