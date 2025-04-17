import Header from "./general/Header"
import Body from "./general/Body"
import Bottom from "./general/Bottom"

const Post = ({ postId, name, major, content, likeCount, dislikeCount, userReaction, commentCount }) => {
  return (
    <div className="bg-white text-black shadow-lg rounded-xl p-4 max-w-lg mx-auto my-4">
      <Header name={name} major={major} />
      <Body content={content} />
      <Bottom postId={postId} likeCount={likeCount} dislikeCount={dislikeCount} commentCount={commentCount} userReaction={userReaction} />
    </div>
  );
};

export default Post;
