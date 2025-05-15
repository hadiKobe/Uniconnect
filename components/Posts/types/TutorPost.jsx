'use client'

import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, GraduationCap, BookOpen } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function TutorPoster({ post }) {
   const router = useRouter()

   // Format the date to be more readable
   const formattedDate = post.created_at
      ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
      : 'Recently'

   // Handle click to navigate to single post page
   const handleClick = () => {
      router.push(`/post/${post.id}`)
   }

   return (
      <Card className="w-full overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer p-4 max-w-xl mx-auto my-4 mb-4"      >
         <CardContent className="p-0">
            <div className="flex items-start p-4 border-b">
               <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src={post.profile_picture || "/placeholder.svg"} alt={`${post.user_first_name} ${post.user_last_name}`} />
                  <AvatarFallback>{post.user_first_name.charAt(0)}{post.user_last_name.charAt(0)}</AvatarFallback>
               </Avatar>
               <div className="flex-1">
                  <h3 className="font-semibold text-lg">{post.user_first_name} {post.user_last_name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                     <div className="flex items-center text-sm text-muted-foreground">
                        <GraduationCap className="h-4 w-4 mr-1" />
                        {post.major}
                     </div>
                     {post.subject && (
                        <div className="flex items-center text-sm text-muted-foreground">
                           <BookOpen className="h-4 w-4 mr-1" />
                           {post.subject}
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="p-4">
               <p className="text-sm mb-4 line-clamp-3">{post.content}</p>

               <div className="flex flex-wrap gap-2 mb-3">
                  {post.rate && (
                     <Badge variant="secondary" className="font-medium">
                        ${post.rate}/hr
                     </Badge>
                  )}
                  {post.location && (
                     <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {post.location}
                     </Badge>
                  )}
               </div>

               <div className="flex items-center justify-between pt-3 border-t border-gray-100">

                  <div className="flex items-center text-xs text-muted-foreground mt-2">
                     <Clock className="h-3 w-3 mr-1" />
                     {formattedDate}
                  </div>

                  <div
                     onClick={handleClick}
                     className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                  >
                     See More →
                  </div>
               </div>
            </div>
         </CardContent>
      </Card>
   )
}
