import SettingsPanel from "@/components/Left/SettingsPanel";


export default function SettingsLayout({ children }) {
   return (
      <div className="flex flex-col md:flex-row">
         <div className="flex flex-col md:flex-row pl-0 md:pl-64 min-h-screen">
            {/* Fixed Sidebar */}
            <div className="hidden md:block fixed left-0  h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
               <SettingsPanel goBack={true}/>
            </div>

            {/* Shared Main Area Styling */}
            <main className="flex-grow p-6">{children}</main>
         </div>
      </div>
   );
}