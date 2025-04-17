"use client";

import { SessionProvider } from "next-auth/react";
import { UserProvider } from "@/components/PostsComponent/context/user-context";

export default function Providers({ children }) {
  return <SessionProvider>
    <UserProvider>
      {children}
    </UserProvider>
  </SessionProvider>;
}
