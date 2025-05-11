"use client";

import { useState } from "react";
import LeftSide from "@/components/Left/left";
import SettingsPanel from "@/components/Settings/SettingsPanel";

export default function LeftBarShell() {
   const [isSettingsOpen, setIsSettingsOpen] = useState(false);

   return (
      <div className="flex">
         {/* Left Sidebar (static) */}
         <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
            <LeftSide onSettingsClick={() => setIsSettingsOpen(true)} />
         </div>

         {/* Animated Settings Panel */}
         <div
            className={`hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 bg-white border-r shadow-lg z-50 transition-transform duration-300 ease-in-out ${isSettingsOpen ? "translate-x-0" : "-translate-x-full"}`}
         >
            <SettingsPanel onClose={() => setIsSettingsOpen(false)} />
         </div>
      </div>
   );
}
