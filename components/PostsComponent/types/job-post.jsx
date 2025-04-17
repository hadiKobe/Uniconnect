import { PostBase } from "../structure/post-base"
import { CardDescription } from "@/components/ui/card"

export function JobPost({ post }) {
  return (
    <PostBase post={post} typeColor="bg-purple-100 text-purple-800 hover:bg-purple-200" typeIcon="💼">
      <CardDescription>
        {post.type && <span className="font-medium">{post.type}</span>}
        {post.salary && <span className="text-purple-600 font-semibold"> · ${post.salary}</span>}
        {post.location && <span> · {post.location}</span>}
      </CardDescription>
    </PostBase>
  )
}
