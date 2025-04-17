import Header from "./common/header"
import GeneralBody from "./body/general-body"
import TutorBody from "./body/tutor-body"
import MarketBody from "./body/market-body"
import JobBody from "./body/job-body"
import Bottom from "./common/bottom"

const Post = ({ post }) => {
  const header = {
    first_name: post.user_first_name,
    last_name: post.user_last_name,
    major: post.major,
  };
  const body = {
    content: post.content,
  };
  const bottom = {
    postId: post.id,
    likeCount: post.likesCount,
    dislikeCount: post.dislikesCount,
    userReaction: post.currentUserReaction,
    commentCount: post.commentsCount,
  };

  const tutor = {
    subject: post.subject,
    rate: post.rate,
    location: post.location
  };
  const market = {
    price: post.price,
    location: post.location,
  };
  const job = {
    job_type: post.job_type,
    salary: post.salary,
    location: post.location,
  };

  let Body;
  switch (post.category) {
    case "tutor":
      Body = <TutorBody tutorInfo={tutor} />;
      break;
    case "market":
      Body = <MarketBody marketInfo={market} />;
      break;
    case "job":
      Body = <JobBody jobInfo={job} />;
      break;
    default:
      Body = "";
  }

  return (
    <div className="bg-white text-black shadow-lg rounded-xl p-4 max-w-lg mx-auto my-4">
      <Header headerInfo={header} />
      {Body}
      <GeneralBody bodyInfo={body} />
      <Bottom bottomInfo={bottom} />
    </div>
  );
};

export default Post;
