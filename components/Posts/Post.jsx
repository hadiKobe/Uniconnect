import Header from "./structure/Header"
import Body from "./structure/Body"
import Bottom from "./structure/Bottom"

const Post = ({ postId, name, major, content, likeCount, dislikeCount, commentCount }) => {
  return (
    <div className="bg-white text-black shadow-lg rounded-xl p-4 max-w-lg mx-auto my-4">
      <Header name={name} major={major} />
      <Body content={content} />
      <Bottom postId={postId} likeCount={likeCount} dislikeCount={dislikeCount} commentCount={commentCount} />
    </div>
  );
};

export default Post;
