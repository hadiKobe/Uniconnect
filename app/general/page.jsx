import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import GeneralClient from "@/components/Feed/General";
import Navbar from "@/components/navbar/navbar"; // fixed typo

const GeneralFeed = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }

  return (
    <>
      <Navbar/>
      <GeneralClient session={session} />
    </>
  );
};

export default GeneralFeed;
