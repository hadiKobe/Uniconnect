import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FeedClient from "@/components/Feed/FeedClient";


const JobOffersFeed = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }

  return (
    <div className="">
      <div className="ml-0 md:ml-64 flex-1  p-4">
        <FeedClient section="job" />
      </div>
    </div>

  );
};

export default JobOffersFeed;