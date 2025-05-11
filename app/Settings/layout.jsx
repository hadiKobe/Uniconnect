import SettingsPanel from "@/components/Left/SettingsPanel";


export default function SettingsLayout({ children }) {
   return (
      <div className="flex flex-col md:flex-row min-h-screen">
         {/* Fixed Sidebar (Desktop) */}
         <div className="hidden md:block fixed left-0 top-0 h-full w-64 border-r bg-background z-40">
            <SettingsPanel goBack={true} />
         </div>

         {/* Main Content Area */}
         <main className="flex-grow p-4 flex justify-center items-start">
            {children}
         </main>
      </div>

   );
}