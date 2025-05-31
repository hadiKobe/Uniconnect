"use client"

import { useRouter } from "next/navigation"
import { MapPin, Clock, DollarSign, ExternalLink } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

import {
   differenceInDays,
   differenceInHours,
   differenceInMinutes,
   differenceInSeconds,
} from "date-fns";


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
export default function MarketPost({ post }) {
   const router = useRouter()

   // Handle click to navigate to post detail page
   const handleClick = () => { router.push(`/post/${post.id}`) }

   // Format the date to show how long ago the post was created
   const publishedAt = new Date(post.created_at); // ✅ must be here first
   const timeAgo = getShortTimeAgo(publishedAt); // ✅ now this works

   const price = post?.price
   const location = post?.location
   const type = post?.type

   return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300  border border-gray-100">
         <div className="p-5">
            {/* User info section */}
            <div className="flex items-center mb-4">
               <Avatar className="h-10 w-10 mr-3 rounded-full overflow-hidden">
                  <AvatarImage
                     src={post.profile_picture}
                     alt={`${post.user_first_name} ${post.user_last_name}`}
                  />
                  <AvatarFallback className="bg-gray-200 text-gray-500">
                     {post.user_first_name?.charAt(0)}
                     {post.user_last_name?.charAt(0)}
                  </AvatarFallback>
               </Avatar>
               <div>
                  <h3 className="font-semibold text-gray-800">
                     {post.user_first_name} {post.user_last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{post.major}</p>
               </div>
               <div className="ml-auto flex items-center text-sm text-gray-500">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  {timeAgo}
               </div>
            </div>

            {/* Content */}
            <div className="mb-4">
               <p className="text-gray-700 line-clamp-3">{post.product_name}</p>
            </div>

            {/* Details section */}
            <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100">
               <div className="flex items-center gap-4">
                  {price !== undefined && (
                     <div className="flex items-center text-green-600 font-semibold">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {typeof price === "number" ? price.toFixed(2) : price}
                     </div>
                  )}

                  {location && (
                     <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        {location}
                     </div>
                  )}
               </div>

               <button
                  onClick={handleClick}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
               >
                  See More <ExternalLink className="h-3.5 w-3.5" />
               </button>
            </div>
         </div>
      </div>
   )
}
