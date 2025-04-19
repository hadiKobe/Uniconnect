import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FeedClient  from "@/components/Feed/FeedClient";


const TutoringFeed = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }

  return (
    <div className="h-screen">
      <div className="ml-0 md:ml-64 flex-1 overflow-y-auto p-4">
        <FeedClient section="tutor"/>
      </div>
    </div>

  );
};

export default TutoringFeed;