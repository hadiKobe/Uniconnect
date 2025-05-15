"use client"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link";
import { useRouter } from 'next/navigation';

// Icons as simple SVG components for standard JSX compatibility
const MapPinIcon = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-red-600"
   >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3"></circle>
   </svg>
)

const BriefcaseIcon = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-blue-600"
   >
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
   </svg>
)

const DollarSignIcon = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-green-600"
   >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
   </svg>
)

const GraduationCapIcon = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-purple-600"
   >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
   </svg>
)

const ClockIcon = () => (
   <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
   >
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
   </svg>
)

const JobPost = ({ post }) => {

   const router = useRouter();

   // Format the date to show how long ago the post was created
   const timeAgo = formatDistanceToNow(new Date(post.created_at), { addSuffix: true })

   // Get initials for fallback avatar
   const getInitials = () => {
      return `${post.user_first_name.charAt(0)}${post.user_last_name.charAt(0)}`
   }

   // Handle click to navigate to single post page
   const handleClick = () => {
      router.push(`/post/${post.id}`)
   }

   return (
      <div className="bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow p-4 max-w-xl mx-auto my-4 mb-4">
         <div className="flex items-center mb-3 hover:underline cursor-pointer">
            {post.profile_picture ? (
               <img
                  src={post.profile_picture || "/placeholder.svg"}
                  alt={`${post.user_first_name} ${post.user_last_name}`}
                  className="w-10 h-10 rounded-full mr-3 object-cover"
               />
            ) : (
               <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 text-blue-600 font-medium">
                  {getInitials()}
               </div>
            )}
            <Link href={`/Profile/${post.user_id}`} className="text-base font-medium text-gray-700">
               {post.user_first_name} {post.user_last_name}
            </Link>
         </div>

         <div className="flex justify-between items-start mb-3">
            <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">{post.content}</h3>
            <span className="text-xs text-gray-500 whitespace-nowrap flex items-center">
               <ClockIcon />
               <span className="ml-1">{timeAgo}</span>
            </span>
         </div>


         <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
            {post.job_type && (
               <div className="flex items-center text-sm text-gray-600">
                  <BriefcaseIcon />
                  <span className="ml-2">{post.job_type}</span>
               </div>
            )}

            {post.salary && (
               <div className="flex items-center text-sm text-gray-600">
                  <DollarSignIcon />
                  <span className="ml-2">{post.salary}</span>
               </div>
            )}

            {post.location && (
               <div className="flex items-center text-sm text-gray-600">
                  <MapPinIcon />
                  <span className="ml-2">{post.location}</span>
               </div>
            )}
         </div>

         <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center">
               <GraduationCapIcon />
               <span className="text-sm text-gray-600 ml-2">Major: {post.major}</span>
            </div>

            <div
               onClick={handleClick}
               className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
            >
               See More →
            </div>
         </div>
      </div>
   )
}

export default JobPost
