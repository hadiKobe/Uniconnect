import React from 'react'
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SearchClient from "@/components/Search/SearchClient";

const Search = async () => {
   const session = await getServerSession(authOptions);
   if (!session) {
      redirect("/SignIn");
   }

   return (
      <div className="h-screen">
         <SearchClient />
      </div>
   )
}

export default Search