"use client";

import { useState, useEffect, useRef } from "react";
import { ProfileHeader } from "@/components/Profile/header";
import Posts from "./posts";
import { FriendsCard } from "./friends";
import { GraduationProgressCard } from "./progress";
import {
  fetchStudent,
  fetchPosts,
  fetchFriends,
} from "@/lib/apis/profile";
import { Button } from "@/components/ui/button";
import { useSendFriendRequest } from "@/hooks/Friends/addFriend";
import { useCancelFriendRequest } from "@/hooks/Friends/request/cancel";
import { useBulkFriendCheck } from "@/hooks/Friends/bulkCheckFriends";
import { useUnFriend } from "@/hooks/Friends/useUnFriend";
import { AddPost } from "../Posts/AddPost";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import LoadingPage from "../Loading/LoadingPage";



const Profile = ({ userID }) => {
  const [page, setPage] = useState(1)
  const triggerRef = useRef()

  const [student, setStudent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [currentLoadingFriendId, setCurrentLoadingFriendId] = useState(null);
  const [showAddPost, setShowAddPost] = useState(false);
  const { sendFriendRequest } = useSendFriendRequest();
  const { cancelFriendRequest } = useCancelFriendRequest();
  const { removeFriend } = useUnFriend();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (triggerRef.current) observer.observe(triggerRef.current)
    return () => observer.disconnect()
  }, [loading, posts])

  const allRelevantIds = student
    ? [...new Set([student.id, ...friends.map((friend) => friend.id)])]
    : [];
  const { statuses, setStatuses } = useBulkFriendCheck(allRelevantIds);
  const { data: session } = useSession();

  const isCurrentUser = Number(userID) === Number(session?.user?.id);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [studentData, postData, friendsData] = await Promise.all([
          fetchStudent(userID),
          fetchPosts(userID, 1),
          fetchFriends(userID),
        ]);
        setStudent(studentData);
        setPosts(postData);
        setFriends(friendsData);
        await sleep(1000);
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };
    if (userID) fetchAllData();
  }, [userID]);

  useEffect(() => {
    const fetchMorePosts = async () => {
      if (loading) return; // Prevent fetching if already loading
      try {
        setLoadingPosts(true);
        const newPosts = await fetchPosts(userID, page);
        setPosts((prev) => [...prev, ...newPosts]);
      } catch (error) {
        console.error("Error fetching more posts:", error);
      }finally {
        setLoadingPosts(false);
      }
    };
    if (userID && page > 1) fetchMorePosts();
  }, [page]);

  const handleSendRequest = async (friendId) => {
    setCurrentLoadingFriendId(friendId);
    const result = await sendFriendRequest(friendId);
    if (result.success) {
      setStatuses((prev) => ({
        ...prev,
        [friendId]: { ...prev[friendId], pendingRequest: true },
      }));
      await sleep(1000);
    }
    setCurrentLoadingFriendId(null);
  };

  const handleCancelRequest = async (friendId) => {
    setCurrentLoadingFriendId(friendId);
    const result = await cancelFriendRequest({ friendId });
    if (result.success) {
      setStatuses((prev) => ({
        ...prev,
        [friendId]: { ...prev[friendId], pendingRequest: false },
      }));
      await sleep(1000);
    }
    setCurrentLoadingFriendId(null);
  };

  const handleFriendRemove = async (friendId) => {
    try {
      setCurrentLoadingFriendId(friendId);
      await removeFriend(friendId);
      await sleep(1000);
      setStatuses((prev) => ({
        ...prev,
        [friendId]: { isFriend: false, pendingRequest: false },
      }));

    } catch (err) {
      alert(err.message || "Failed to remove friend.");
    } finally {
      setCurrentLoadingFriendId(null);
    }
  };
  const handlePostAdded = async () => {
    const newPosts = await fetchPosts(userID);
    setPosts(newPosts);
    setShowAddPost(false);
  };



  if (loading) return <LoadingPage />;
  if (!student) return <p>No student data found.</p>;

  return (
    <div className="w-full max-w-7xl mx-auto py-6  md:px-6">

      <div className="grid gap-6">
        <ProfileHeader
          student={student}
          statuses={statuses}
          currentLoadingFriendId={currentLoadingFriendId}
          handleSendRequest={handleSendRequest}
          handleCancelRequest={handleCancelRequest}
          handleFriendRemove={handleFriendRemove}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GraduationProgressCard
            progress={student.graduation_progress}
            graduationYear={student.expected_graduation_date}
          />
          <FriendsCard
            friends={friends}
            statuses={statuses}
            currentLoadingFriendId={currentLoadingFriendId}
            handleSendRequest={handleSendRequest}
            handleCancelRequest={handleCancelRequest}
          />
        </div>
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-extrabold">Posts</CardTitle>
            <Dialog open={showAddPost} onOpenChange={setShowAddPost}>
              {isCurrentUser && (
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
              )}

              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create a New Post</DialogTitle>
                </DialogHeader>
                <AddPost onPostAdded={handlePostAdded} />
              </DialogContent>
            </Dialog>
          </CardHeader>

          <CardContent className="w-full min-h-[400px]">
            <Posts posts={posts} triggerRef={triggerRef} page={page} loading={loadingPosts} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
