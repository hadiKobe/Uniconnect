"use client";
import { useState, useCallback } from "react";
import Header from "./common/post-header";
import GeneralBody from "./common/post-general-body";
import TutorBody from "./body/tutor-body";
import MarketBody from "./body/market-body";
import JobBody from "./body/job-body";
import Footer from "./common/post-footer";
import useGetPostById from "@/hooks/Posts/getPostByID";
import useDeletePost from "@/hooks/Posts/deletePost";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/Loading/LoadingPage";

const SinglePost = ({ postID }) => {
  const router = useRouter(); // 👈 for navigation
  const { post, loading, error } = useGetPostById(postID);
  const { fetchDeletePost } = useDeletePost();
  const [isDeleting, setIsDeleting] = useState(false);
   const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


 const onDelete = useCallback(async () => {
  try {
    setIsDeleting(true);
  
    await fetchDeletePost(postID);
    await sleep(2000); // wait 1 second
    router.push("/Feed");
  } catch (err) {
    console.error("Failed to delete post:", err);
  } finally {
    setIsDeleting(false);
  }
}, [fetchDeletePost, postID, router]);


  if (loading) return <LoadingPage /> ;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!post) return <div>No post found</div>;

const header = {
    post_id: post.id,
    user_id: post.user_id,
    first_name: post.user_first_name,
    last_name: post.user_last_name,
    major: post.major,
    post_type: post.category,
    created_at: post.created_at,
    onDelete,
     isDeleting, 
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
      };
      break;

    case "job":
      categoryDetails = {
        job_type: post.job_type,
        salary: post.salary,
        location: post.location,
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

  return (
  <div className="w-full p-4 mx-auto my-4">
    <Header headerInfo={header} />
    {SpecificBody}
    <GeneralBody bodyInfo={body} />
    <Footer bottomInfo={bottom} singlePost />

  {isDeleting && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <LoadingPage/>
    <span className="text-lg font-semibold text-white">Deleting Post...</span>
  </div>
)}
  
    </div>
    );
  }





export default SinglePost;
