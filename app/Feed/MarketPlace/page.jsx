import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import FeedClient from "@/components/Feed/FeedClient";


const MarketPlaceFeed = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }

  return (
    <div className="">
      <div className="ml-0 md:ml-64 flex-1  p-4">
        <FeedClient section="market" />
      </div>
    </div>

  );
};

export default MarketPlaceFeed;