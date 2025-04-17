import { PostBase } from "../structure/post-base"
import { CardDescription } from "@/components/ui/card"

export function MarketPost({ post }) {
  return (
    <PostBase post={post} typeColor="bg-emerald-100 text-emerald-800 hover:bg-emerald-200" typeIcon="💰">
      <CardDescription className="text-emerald-600 font-semibold">
        ${post.price} {post.location && `· ${post.location}`}
      </CardDescription>
    </PostBase>
  )
}
