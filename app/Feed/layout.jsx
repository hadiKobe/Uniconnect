import Navbar from "@/components/navbar/navbar";
import LeftBarShell from "@/components/Left/LeftBarShell";

export default function FeedLayout({ children }) {
  return (
    <div>
      {/* Sticky Top Navbar */}
      <div className="sticky top-0 z-500 w-full bg-white">
        <Navbar />
      </div>

      {/* Fixed Sidebar */}
      <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
        <LeftBarShell />
      </div>

      {/* Main Content Area */}
      <main>{children}</main>
    </div>
  );
}
