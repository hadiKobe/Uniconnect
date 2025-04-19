"use client"
import { formatDistanceToNow } from "date-fns"
import { MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const onReport = () => {
   alert("Reported");
}

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

export default function Header({ headerInfo }) {
   const { post_id, user_id, first_name, last_name, major, created_at, post_type = "general" } = headerInfo;
   const publishedAt = new Date(created_at);

   const { data: session } = useSession()
   const currentUserId = parseInt(session?.user?.id)
   const isAuthor = currentUserId === user_id
   const timeAgo = formatDistanceToNow(publishedAt, { addSuffix: true })
   
   const badgeVariant = getPostTypeBadgeVariant(post_type)
   const badgeStyles = getBadgeStyles(badgeVariant)

   const onDelete = () => {
      const path = `/api/posts/delete/${post_id}`;
      const res = fetch(path, {
         method: "DELETE",
         headers: { "Content-Type": "application/json" }
      });

      if (res.ok)
         console.log(`Post deleted successfully`);
   }

   return (
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Avatar>
               <AvatarImage src={null || "/placeholder.svg"} alt={first_name} />
               <AvatarFallback>{first_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
               <div className="flex items-center gap-2">
                  <h3 className="font-medium">{`${first_name} ${last_name}`}</h3>
                  <Badge className={`text-xs font-medium ${badgeStyles}`} variant="outline">
                     {post_type?.charAt(0).toUpperCase() + post_type?.slice(1).toLowerCase() + postTypeEmoji[post_type] || "General" }
                  </Badge>
               </div>
               <div className="flex items-center text-sm text-muted-foreground">
                  <span>{major}</span>
                  <span className="mx-1">•</span>
                  <time dateTime={publishedAt.toISOString()}>{timeAgo}</time>
               </div>
            </div>
         </div>

         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
               </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
               <DropdownMenuItem onClick={onReport}>Report</DropdownMenuItem>

               {isAuthor && (
                  <>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={onDelete} className="text-destructive focus:text-destructive">
                        Delete post
                     </DropdownMenuItem>
                  </>
               )}
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   )
}
