'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import DropdownMenu from './dropdown-suggestion';


const SearchBar = () => {
   const [searchQuery, setSearchQuery] = useState("");
   // suggestion = {id, name, profile_picture, mutualFriendsCount}
   const [suggestions, setSuggestions] = useState([]);
   const [loading, setLoading] = useState(false);
   const router = useRouter();

   // Handle search form submission
   const handleSearch = (e) => {
      e.preventDefault()
      if (searchQuery.trim()) {
         // Navigate or filter logic here
         router.push(`/Search?term=${searchQuery}`);
      }
   };

   useEffect(() => {
      const fetchSuggestions = async () => {
         if (searchQuery.trim() === "")
            return setSuggestions([]);

         setLoading(true);
         const path = `/api/search/user/suggestion?term=${searchQuery}`;
         try {

            await fetch(path)
               .then(res => res.json())
               .then(data => setSuggestions(data.users))
               .catch(err => console.error(err));

         } catch (error) {
            console.error('Failed to Fetch suggestions:', error);
         }
         setLoading(false);
      };

      const debounce = setTimeout(() => {
         fetchSuggestions();
      }, 1000);

      return () => clearTimeout(debounce);
   }, [searchQuery]);

   return (
      <div className="ml-auto flex flex-1 items-center justify-end gap-4">
         <div className="flex justify-center flex-1">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
               <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
               <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
               />
               {searchQuery && (
                  <DropdownMenu
                     suggestions={suggestions}
                     loading={loading}
                     onClose={() => setSearchQuery("")}
                     searchQuery={searchQuery}
                  />
               )}
            </form>
         </div>
      </div>
   )
}

export default SearchBar