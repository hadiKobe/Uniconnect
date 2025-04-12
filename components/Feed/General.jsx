"use client";
import { useEffect, useRef, useState } from "react";
import Post from "@/components/Posts/Post";
import AddPost from "@/components/Posts/AddPost";
import { Button } from "../ui/button";
import { List, GraduationCap, User, Plus } from "lucide-react";

const GeneralClient = () => {
  const [posts, setPosts] = useState([]);
  const [showAddPost, setShowAddPost] = useState(false); // 👈 toggle state
  const addPostRef = useRef(null);
  const path = "/api/posts/getPost";

  const fetchPosts = async () => {
    fetch(path)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleNewPostClick = () => {
    setShowAddPost(true); // 👈 Show the AddPost component
    setTimeout(() => {
      addPostRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100); // Slight delay ensures rendering before scroll
  };

  return (
    <div className="w-full p-4">
      {/* Filters + New Post */}
      <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2 mb-4">
        <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium" disabled>
          <List className="w-4 h-4 mr-1" />
          All
        </Button>

        <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium" disabled>
          <GraduationCap className="w-4 h-4 mr-1" />
          MyMajor
        </Button>

        <Button variant="ghost" size="sm" className="rounded-full text-sm font-medium" disabled>
          <User className="w-4 h-4 mr-1" />
          MyFeed
        </Button>

        <Button onClick={handleNewPostClick} variant="default" size="sm" className="rounded-full text-sm font-medium">
          <Plus className="w-4 h-4 mr-1" />
          New Post
        </Button>
      </div>

      {/* Conditionally Render Add Post */}
      {showAddPost && (
        <div ref={addPostRef} className="mb-6">
          <AddPost />
        </div>
      )}

      {/* Posts */}
      {posts.map((post) => (
        <Post
          key={post.id}
          postId={post.id}
          name={`${post.first_name} ${post.last_name}`}
          major={post.major}
          content={post.content}
          likeCount={post.likesCount}
          commentCount={post.commentsCount}
          createdAt={post.created_at}
        />
      ))}
    </div>
  );
};

export default GeneralClient;
