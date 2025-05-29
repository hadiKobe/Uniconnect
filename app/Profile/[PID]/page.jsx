import LeftBarShell from "@/components/Left/LeftBarShell"
import Navbar from "@/components/navbar/navbar"
import Profile from "@/components/Profile/profile"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }
  // const userID = await params.PID;
  const { PID: userID } = await params;

  return (
    <>
      {/* Sticky Top Navbar */}
      <div className="sticky top-0 z-50 bg-white">
        <Navbar />
      </div>

      {/* Fixed Sidebar (desktop only) */}
      <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
        <LeftBarShell />
      </div>

      {/* Main Content */}
      <main className="pt-6 px-4 md:pl-72 max-w-[1600px] w-full mx-auto">
        <Profile userID={userID} /> {/* ✅ correct prop usage */}
      </main>
    </>
  );
}
