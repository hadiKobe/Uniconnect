import LeftBarShell from "@/components/Left/LeftBarShell"
import { MessagesPage } from "@/components/messages/message-page"
import Navbar from "@/components/navbar/navbar"
const Page = () => {
  return (
    <>
     <div className="sticky top-0 z-50">
                  <Navbar/>
                </div>
          
                {/* Fixed Sidebar (desktop only) */}
                <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r  z-40">
                  <LeftBarShell/>
                </div>
          
                {/* Main Content */}
             <main className="pt-6 px-4 md:pl-72 max-w-[1600px] w-full mx-auto">
    
                       <MessagesPage/>
                    </main>
                    </>
 
  )
}

export default Page