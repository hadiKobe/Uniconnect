'use client';
import SinglePost from "@/components/Posts/SinglePost";
import Navbar from "@/components/navbar/navbar";
import LeftBarShell from "@/components/Left/LeftBarShell";
import { use } from "react";

const Page = ({ params }) => {
  const resolvedParams = use(params); // Unwrap the Promise
  const postId = resolvedParams.postId;

  return (
    <div>
      <div className="sticky top-0 z-50">
              <Navbar />
            </div>
      
            {/* Fixed Sidebar (desktop only) */}
            <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r  z-40">
              <LeftBarShell />
            </div>
      
            {/* Main Content */}
          <main className="pt-6 px-4 md:pl-72 w-full max-w-7xl mx-auto">

                <SinglePost postID={postId} />
                </main>
    </div>
  );
};

export default Page;
