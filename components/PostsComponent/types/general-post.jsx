import { PostBase } from "../structure/post-base"
import { CardDescription } from "@/components/ui/card"

export function GeneralPost({ post }) {
  return (
    <PostBase post={post} typeColor="bg-gray-100 text-gray-800 hover:bg-gray-200" typeIcon="📝">
      {post.location && (
        <CardDescription>
          <span>📍 {post.location}</span>
        </CardDescription>
      )}
    </PostBase>
  )
}
