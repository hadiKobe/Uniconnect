import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import GeneralClient from "@/components/Feed/General";
import Navbar from "@/components/navbar/navbar";
import { LeftSide } from "@/components/Left/left";

const GeneralFeed = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }

  return (
    <div className="h-screen">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white">
        <Navbar />
      </div>

      
        <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
          <LeftSide />
        </div>

        {/* Scrollable Feed shifted right by sidebar width */}
        <div className="ml-0 md:ml-64 flex-1 overflow-y-auto p-4">
          <GeneralClient />
        </div>
      </div>
  
  );
};

export default GeneralFeed;
