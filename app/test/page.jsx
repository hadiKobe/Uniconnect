
import { FriendsPage } from "@/components/Friends/friends";
import { LeftSide } from "@/components/Left/left";
import Navbar from "@/components/navbar/navbar";

export default function Home() {
  return (
    <>
      {/* Sticky Top Navbar */}
      <div className="sticky top-0 z-50 bg-white">
        <Navbar />
      </div>

      {/* Fixed Sidebar (desktop only) */}
      <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
        <LeftSide />
      </div>

      {/* Main Content */}
      <main className="pt-6 px-4 md:pl-72 max-w-[1600px] w-full mx-auto">
      <FriendsPage />
    </main>

    </>
  );
}

