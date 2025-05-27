import SecurityClient from "@/components/Settings/SecurityClient"

const Security = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }
  return (
    <SecurityClient />
  )
}

export default Security