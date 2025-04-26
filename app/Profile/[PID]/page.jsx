import Profile from "@/components/Profile/profile"


export default async function Page({ params }) {
  const userID = params.PID

  return <Profile userID={userID} />
}

