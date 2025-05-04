"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, User, Lock, LogOut, ChevronLeft } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils"; // If not already imported
import { useState, useEffect } from "react";
import { set } from "date-fns";

const settingsSections = [
   { id: "AccountInfo", label: "Account Info", icon: User },
   { id: "Security", label: "Security", icon: Lock },
];

export default function SettingsPanel({ onClose, goBack }) {
   const router = useRouter();
   const [prevPath, setPrevPath] = useState("/Feed");
   useEffect(() => {
      const prev = sessionStorage.getItem("previousPath");
      console.log("previousPath", prev);
      setPrevPath(prev || "/Feed");
   }, [prevPath]);

   return (
      <Card className="h-full w-full flex flex-col p-4 rounded-none border-none">
         {/* Header */}

         {goBack &&
            <div className="flex items-center gap-4 px-2 pt-2">
               <Button className="hover:bg-muted" variant="ghost" size="icon" onClick={() => router.push(prevPath)}>
                  <ChevronLeft className="w-5 h-5" />
               </Button>
               <h2 className="text-xl font-semibold ">Settings</h2>
            </div>}


         {onClose &&
            <div className="flex justify-between items-center ">
               <h2 className="text-xl font-semibold ml-2 mt-2">Settings</h2>
               <Button variant="ghost" className="mt-2" size="icon" onClick={onClose}>
                  <X className="w-5 h-5 " />
               </Button>
            </div>}

         {/* Divider */}
         <div className="w-full h-px bg-border " />

         {/* Settings List */}
         <div className="flex flex-col gap-1">
            {settingsSections.map(({ id, label, icon: Icon }) => (
               <Link
                  key={id}
                  href={`/Settings/${id}`}
                  className={cn(
                     "flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors text-sm font-medium w-full"
                  )}
               >
                  <Icon className="w-5 h-5" />
                  {label}
               </Link>
            ))}
         </div>

         {/* Logout Button */}
         <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2 mt-4"
            onClick={() => signOut()}
         >
            <LogOut className="h-4 w-4" /> Log Out
         </Button>
      </Card>
   );
}
