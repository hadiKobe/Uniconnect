"use client"
import Post from "../Posts/Post"
import { Loader2 } from "lucide-react"

const PAGE_SIZE = 8
const PRELOAD_TRIGGER_INDEX = 4

const Posts = ({ posts, triggerRef, page, loading }) => {
  if (!posts) return <p>Loading posts...</p>
  if (posts.length === 0) return <p className="text-muted-foreground">No posts found.</p>

  const triggerIndex = PRELOAD_TRIGGER_INDEX + (page - 1) * PAGE_SIZE

  return (
  <>
    {posts.map((post, idx) => (
      <div
        key={`profile-${post.id}`}
        ref={idx === triggerIndex ? triggerRef : null}
        className="my-4" // 👈 Adds spacing above and below each post
      >
        <Post post={post} />
      </div>
    ))}

    {loading && (
      <div className="flex justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
      </div>
    )}
  </>
);
  
}

export default Posts
