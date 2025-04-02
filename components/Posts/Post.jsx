import Header from "./structure/Header"
import Body from "./structure/Body"
import Bottom from "./structure/Bottom"

const Post = ({ name, major, content }) => {
  return (
    <div className="bg-white text-black shadow-lg rounded-xl p-4 max-w-lg mx-auto ">
      <Header name={name} major={major}/>
      <Body content={content}/>
      <Bottom />
    </div>
  );
};

export default Post;
