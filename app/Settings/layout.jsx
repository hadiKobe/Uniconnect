import SettingsPanel from "@/components/Settings/SettingsPanel";
import SettingsMobileHeader from "@/components/Settings/MobileSettingsPanel";

export default function SettingsLayout({ children }) {
   return (
      <div className="flex flex-col md:flex-row min-h-screen">
         
         {/* Mobile Header */}
         <div className="block md:hidden fixed top-0 left-0 right-0 z-50 border-b bg-background">
            <SettingsMobileHeader goBack={true} />
         </div>

         {/* Desktop Sidebar */}
         <div className="hidden md:block fixed left-0 top-0 h-full w-64 border-r bg-background z-40">
            <SettingsPanel goBack={true}/>
         </div>

         {/* Main Content */}
         <main className="flex-grow p-4 w-full md:ml-64 pt-14 md:pt-4 flex justify-center items-start">
            {children}
         </main>
      </div>
   );
}
