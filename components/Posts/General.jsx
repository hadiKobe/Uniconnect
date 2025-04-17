import Header from "./common/header"
import Body from "./body/general-body"
import Bottom from "./common/bottom"

const GeneralPost = ({ post }) => {
  const header = {
    first_name: post.first_name,
    last_name: post.last_name,
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

  return (
    <div className="bg-white text-black shadow-lg rounded-xl p-4 max-w-lg mx-auto my-4">
      <Header headerInfo={header} />
      <Body bodyInfo={body} />
      <Bottom bottomInfo={bottom} />
    </div>
  );
};

export default GeneralPost;
