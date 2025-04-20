import Header from "./common/post-header"
import GeneralBody from "./common/post-general-body"
import TutorBody from "./body/tutor-body"
import MarketBody from "./body/market-body"
import JobBody from "./body/job-body"
import Footer from "./common/post-footer"
import CommentSection from "./common/comments-section/comment-section"

const Post = ({ post }) => {
  const header = {
    post_id: post.id,
    user_id: post.user_id,
    first_name: post.user_first_name,
    last_name: post.user_last_name,
    major: post.major,
    post_type: post.category,
    created_at: post.created_at,
  };
  const body = {
    content: post.content,
  };
  const bottom = {
    postId: post.id,
    likeCount: post.likes.length,
    dislikeCount: post.dislikesCount,
    userReaction: post.currentUserReaction,
    commentCount: post.comments.length,
  };
  const commentSection = {
    post_id: post.id,
    user_id: post.user_id,
    comments: post.comments,
  }

  let categoryDetails = {};
  switch (post.category) {
    case "tutor":
      categoryDetails = {
        subject: post.subject,
        rate: post.rate,
        location: post.location
      };
      break;

    case "market":
      categoryDetails = {
        price: post.price,
        location: post.location,
      };
      break;

    case "job":
      categoryDetails = {
        job_type: post.job_type,
        salary: post.salary,
        location: post.location,
      };
      break;

    default:
      categoryDetails = {};
  }
  let SpecificBody;
  switch (post.category) {
    case "tutor":
      SpecificBody = <TutorBody tutorInfo={categoryDetails} />;
      break;
    case "market":
      SpecificBody = <MarketBody marketInfo={categoryDetails} />;
      break;
    case "job":
      SpecificBody = <JobBody jobInfo={categoryDetails} />;
      break;
    default:
      SpecificBody = "";
  }

  return (
    <div className="bg-white text-black shadow-lg rounded-xl p-4 max-w-lg mx-auto my-4">
      <Header headerInfo={header} />
      <GeneralBody bodyInfo={body} />
      {SpecificBody}
      <Footer bottomInfo={bottom} />
      <CommentSection commentsInfo={commentSection} />
    </div>
  );
};

export default Post;
