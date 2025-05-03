"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, User, Lock, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils"; // If not already imported

const settingsSections = [
   { id: "AccountInfo", label: "Account Info", icon: User },
   { id: "Security", label: "Security", icon: Lock },
];

export default function SettingsPanel({ onClose }) {
   return (
      <Card className="h-full w-full flex flex-col p-4 rounded-none border-none">
         {/* Header */}
         <div className="flex justify-between items-center ">
            <h2 className="text-xl font-semibold">Settings</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
               <X className="w-5 h-5" />
            </Button>
         </div>

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
