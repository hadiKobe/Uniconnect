import LeftBarShell from "@/components/Left/LeftBarShell";
import Navbar from "@/components/navbar/navbar";
import Profile from "@/components/Profile/profile";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }

  const { PID: userID } = params;

  return (
    <div className="min-h-screen w-full ">
      {/* Sticky Top Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex">
        {/* Sidebar (Hidden on mobile) */}
        <aside className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
          <LeftBarShell />
        </aside>

        {/* Main Content */}
        <main className="w-full md:pl-64 mt-4 px-4 max-w-full mx-auto">
          <Profile userID={userID} />
        </main>
      </div>
    </div>
  );
}
