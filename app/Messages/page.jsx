import LeftBarShell from "@/components/Left/LeftBarShell";
import { MessagesPage } from "@/components/messages/message-page";
import Navbar from "@/components/navbar/navbar";
import { Suspense } from "react";

const Page = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/SignIn");
  }
  return (
    <>
      {/* Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      {/* Sidebar (Visible on md and above) */}
      <aside className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r z-40 bg-background">
        <LeftBarShell />
      </aside>

      {/* Main Content Area */}
      <main className="pt-1 px-0 md:pl-64 w-full h-[calc(100vh-64px)] overflow-hidden">
        <Suspense fallback={<div className="p-4">Loading messages...</div>}>
          <MessagesPage />
        </Suspense>
      </main>
    </>
  );
};

export default Page;
