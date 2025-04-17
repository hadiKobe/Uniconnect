import { MarketPost } from "../types/market-post"
import { TutorPost } from "../types/tutor-post"
import { JobPost } from "../types/job-post"
import { GeneralPost } from "../types/general-post"

export function PostCard({ post }) {
  switch (post.type) {
    case "market":
      return <MarketPost post={post} />
    case "tutor":
      return <TutorPost post={post} />
    case "job":
      return <JobPost post={post} />
    case "general":
    default:
      return <GeneralPost post={post} />
  }
}
