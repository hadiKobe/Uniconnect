export default function TestSticky() {
   return (
      <div className="min-h-screen">
         {/* Sticky Navbar */}
         <div className="sticky top-0 z-50 bg-white border-b p-4">
            <p className="text-lg font-bold">Sticky Navbar</p>
         </div>

         {/* Simulated Sidebar */}
         <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-gray-200 border-r z-40">
            Sidebar
         </div>

         {/* Scrollable Content */}
         <main className="pt-4 md:pl-64 space-y-4 p-4">
            {Array.from({ length: 50 }).map((_, i) => (
               <div key={i} className="p-4 bg-gray-100 rounded">
                  Content Block {i + 1}
               </div>
            ))}
         </main>
      </div>
   );
}
