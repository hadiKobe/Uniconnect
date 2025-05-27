import AccountInfoClient from '@/components/Settings/AccountInfoClient'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// user can change his name, major, joined_in, bio, profile_picture, address, phone_number, expected_graduation_date, graduation process, and gpa
const AccountInfo = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }
  return (
    <AccountInfoClient />
  )
}

export default AccountInfo