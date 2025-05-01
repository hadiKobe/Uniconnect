"use client";
import { useState } from "react";
import Post from "@/components/Posts/Post";
import { useGetPosts } from "@/hooks/Posts/getPosts";
import LoadingPage from "@/components/Loading/LoadingPage";

import { Button } from "../ui/button";
import { List, GraduationCap, User, Plus } from "lucide-react";
import { AddPost } from "../Posts/AddPost";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

const FeedClient = ({ section }) => {
  const [filter, setFilter] = useState('');
  const [showAddPost, setShowAddPost] = useState(false);

  const { posts, onDeletePost, loading, error } = useGetPosts(filter, section);

  const handlePostAdded = () => {
    // Changing filter state will auto-trigger refetch via hook
    setFilter((prev) => prev + ' '); // trigger small change to re-run hook
    setShowAddPost(false);
  };
  const handlePostDeleted = async (post_id) => {
    onDeletePost(post_id);
  };

  return (
    <div className="w-full max-w-4xl p-4">

      {/* Filters + New Post */}
      <div className="flex flex-wrap justify-center items-center gap-1 md:gap-2 mb-4 sticky top-0 z-49">
        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('')}  >
          <List className="cursor-pointer w-4 h-4 mr-1" />
          All
        </Button>

        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('major')}  >
          <GraduationCap className="cursor-pointer w-4 h-4 mr-1" />
          MyMajor
        </Button>

        <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => { setFilter('friends') }} >
          <User className="cursor-pointer w-4 h-4 mr-1" />
          MyFeed
        </Button>

        <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              size="sm"
              className="rounded-full text-sm font-medium flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              New Post
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl w-full">
            <DialogHeader>
              <DialogTitle>Create a New Post</DialogTitle>
            </DialogHeader>
            <AddPost onPostAdded={handlePostAdded} />
          </DialogContent>
        </Dialog>
      </div>


      {loading ? <LoadingPage /> :
        error ? <p className="text-red-500">Error: {error}</p>
          : posts.length === 0 ? <p className="text-muted-foreground">No posts found. Be The First To Post</p>
            : posts.map((post) => (<Post key={post.id} post={post} onDelete={handlePostDeleted} />))
      }
    </div>
  );
};

export default FeedClient;
