import Header from "./common/post-header"
import GeneralBody from "./common/post-general-body"
import { Card, CardContent } from "@/components/ui/card"
import TutorBody from "./body/tutor-body"
import MarketBody from "./body/market-body"
import JobBody from "./body/job-body"
import Footer from "./common/post-footer"
import JobPost from "./types/JobPost"
import TutorPost from "./types/TutorPost"
import MarketPost from "./types/MarketPost"

const Post = ({ post, onDelete, section }) => {

  const header = {
    post_id: post.id,
    user_id: post.user_id,
    profile_picture: post.profile_picture,
    first_name: post.user_first_name,
    last_name: post.user_last_name,
    major: post.major,
    post_type: post.category,
    created_at: post.created_at,
    onDelete,
  };
  const body = {
    content: post.content,
    media_urls: post.media_urls,
  };
  const bottom = {
    post_id: post.id,
    user_id: post.user_id,
    likesCount: post.likesCount,
    dislikesCount: post.dislikesCount,
    userReaction: post.currentUserReaction,
    commentsCount: post.commentsCount,
  };

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
        type: post.type,
        product_name: post.product_name,
      };
      break;

    case "job":
      categoryDetails = {
        job_type: post.job_type,
        salary: post.salary,
        location: post.location,
        position: post.position,
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

  switch (section) {
    case 'job': return <JobPost post={post} />
    case 'tutor': return <TutorPost post={post} />
    case 'market': return <MarketPost post={post} />

    default:
      return (
        <Card className={`overflow-hidden`}>
          <div className="px-4">
            <Header headerInfo={header} />
            {SpecificBody}
            <GeneralBody bodyInfo={body} />
            <Footer bottomInfo={bottom} />
          </div>
        </Card>
      );

  }


};

export default Post;
