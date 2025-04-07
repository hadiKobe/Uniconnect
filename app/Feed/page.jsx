
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import General from "../../components/Feed/General";

const GeneralFeed = async () => {
   const session = await getServerSession(authOptions);

   if (!session) {
      redirect("/login");
   }

   return <General />;
   
};

export default GeneralFeed;