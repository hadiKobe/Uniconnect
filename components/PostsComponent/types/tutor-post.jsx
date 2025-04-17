import { PostBase } from "../structure/post-base"
import { CardDescription } from "@/components/ui/card"

export function TutorPost({ post }) {
  return (
    <PostBase post={post} typeColor="bg-blue-100 text-blue-800 hover:bg-blue-200" typeIcon="📚">
      <CardDescription>
        {post.subject && <span className="font-medium">{post.subject}</span>}
        {post.rate && <span className="text-blue-600 font-semibold"> · ${post.rate}/hr</span>}
        {post.location && <span> · {post.location}</span>}
      </CardDescription>
    </PostBase>
  )
}