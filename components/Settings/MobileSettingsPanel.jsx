"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, X, User, Lock, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function SettingsMobileHeader({ goBack, onClose }) {
   const router = useRouter();
   const [menuOpen, setMenuOpen] = useState(false);

   const handleBack = () => {
      if (window.history.length > 1) router.back();
      else router.push("/Feed"); // Fallback route
   };

   return (
      <div className="fixed top-0 left-0 right-0 bg-background z-50 border-b">
         <div className="flex items-center justify-between h-14 px-4">
            {/* Left - Back/Close */}
            <div>
               {goBack ? (
                  <Button variant="ghost" size="icon" className="mr-2" onClick={handleBack}>
                     <ChevronLeft className="w-5 h-5" />
                  </Button>
               ) : (
                  <Button variant="ghost" size="icon" className="mr-2" onClick={onClose}>
                     <X className="w-5 h-5" />
                  </Button>
               )}
            </div>

            {/* Center - Title */}
            <h1 className="text-lg font-semibold">Settings</h1>

            {/* Right - Menu */}
            <div className="relative">
               <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setMenuOpen(!menuOpen)}
               >
                  Menu
               </Button>

               {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-background border border-border">
                     <div className="py-1">
                        <Link href="/Settings/AccountInfo" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                           onClick={() => setMenuOpen(false)}
                        >
                           <User className="w-4 h-4" /> Account Info
                        </Link>
                        <Link href="/Settings/Security" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted"
                           onClick={() => setMenuOpen(false)}
                        >
                           <Lock className="w-4 h-4" /> Security
                        </Link>
                        <div className="w-full h-px bg-border my-1" />
                        <button
                           className="flex items-center gap-2 px-4 py-2 text-sm w-full text-left hover:bg-muted"
                           onClick={() => {
                              signOut();
                              setMenuOpen(false);
                           }}
                        >
                           <LogOut className="w-4 h-4" /> Log Out
                        </button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}
