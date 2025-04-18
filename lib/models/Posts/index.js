import Post from "./Post";
import TutorPost from "./TutorPost";
import MarketPost from "./MarketPost";
import JobPost from "./JobPost";

// export { Post, TutorPost, MarketPost, JobPost };

export function createPostInstance(data) {
  switch (data.category) {
    case "tutor":
      return new TutorPost(data);
    case "market":
      return new MarketPost(data);
    case "job":
      return new JobPost(data);
    default:
      return new Post(data);
   }
}
