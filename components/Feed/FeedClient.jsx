"use client";
import { useEffect, useState } from "react";
import Post from "@/components/Posts/Post";
import { useGetPosts } from "@/hooks/Posts/getPosts";
import LoadingPage from "@/components/Loading/LoadingPage";

import { Button } from "../ui/button";
import { List, GraduationCap, User, Plus, Briefcase, Clock, BookOpen } from "lucide-react";
import { AddPost } from "../Posts/AddPost";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function DropDownMenu({ name, filters, onChange }) {

  const isArray = Array.isArray(filters);

  return (
    <Select onValueChange={onChange}>
      <SelectTrigger
        className="w-[220px] border border-gray-300 rounded-lg px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
      >
        <SelectValue placeholder={`Choose ${name} Type`} />
      </SelectTrigger>

      <SelectContent
        className="border border-gray-200 shadow-lg rounded-md bg-white"
      >
        <SelectItem
          value=" "
          className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 transition rounded"
        >
          All
        </SelectItem>

        {isArray &&
          filters.map((value, index) => (
            <SelectItem
              key={index}
              value={value}
              className="cursor-pointer px-3 py-2 text-sm hover:bg-blue-50 transition rounded"
            >
              {value}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>

  )
}

export default function FeedClient({ section }) {

  const [filter, setFilter] = useState('');
  const [location, setLocation] = useState('');
  const [specific, setSpecific] = useState('');
  const [showAddPost, setShowAddPost] = useState(false);

  const { posts, onDeletePost, loading, error } = useGetPosts(filter, section, specific, location);

  const handlePostAdded = () => {
    // Changing filter state will auto-trigger refetch via hook
    setFilter((prev) => prev + ' '); // trigger small change to re-run hook
    setShowAddPost(false);
  };

  const handlePostDeleted = (post_id) => {
    onDeletePost(post_id);
  };

  const filters = {
    job: ['Full-Time', 'Part-Time', 'Internship'],
    location: ['Beirut', 'Bekaa', 'Rayak', 'Tripoli', 'Nabatyeh', 'Campus A'],
    tutor: ['Computer Science', "Maths", 'Physics'],
    market: ['Book','Course','Lab Coat']
  };

  return (
    <div className="w-full max-w-4xl p-4 flex flex-wrap justify-center gap-4 md:gap-2 mb-4">
      <div >
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

          <Button variant="ghost" size="sm" className="cursor-pointer rounded-full text-sm font-medium" onClick={() => setFilter('friends')}  >
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
              : posts.map((post) => (<Post key={post.id} post={post} onDelete={handlePostDeleted} section={section} />))
        }
      </div>

      {section !== "home" &&
        <div>
          <DropDownMenu name={section.charAt(0).toUpperCase() + section.slice(1)} filters={filters[section]} onChange={(value) => setSpecific(value.trim())} />
          <DropDownMenu name="Location" filters={filters.location} onChange={(value) => setLocation(value.trim())} />
        </div>
      }
    </div>

  );
};