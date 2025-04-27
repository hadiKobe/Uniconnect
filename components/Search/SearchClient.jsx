'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '../navbar/SearchBar'; // Your existing SearchBar component
import SearchTabs from './SearchTabs';
import LeftSide from '../Left/left'; // Your existing LeftSide component
import Navbar from '../navbar/navbar'; // Your existing Navbar component

const SearchClient = () => {
   const searchParams = useSearchParams();
   const searchTerm = searchParams.get('term') || '';
   const [activeTab, setActiveTab] = useState('all');
   const [allResults, setAllResults] = useState({ users: [], posts: [] });
   const [isLoading, setIsLoading] = useState(false);

   // API path - replace this with your actual endpoint
   const API_PATH = '/api/search/full'; // Single API endpoint that returns both users and posts

   // Fetch data only when search term changes
   useEffect(() => {
      if (!searchTerm) {
         setAllResults({ users: [], posts: [] });
         return;
      }

      const fetchResults = async () => {
         setIsLoading(true);
         try {
            const response = await fetch(`${API_PATH}?term=${encodeURIComponent(searchTerm)}`);
            const data = await response.json();

            // Store the complete results
            setAllResults({
               users: data.users || [],
               posts: data.posts || []
            });
         } catch (error) {
            console.error('Error fetching search results:', error);
         } finally {
            setIsLoading(false);
         }
      };

      fetchResults();
   }, [searchTerm]);

   // Filter results based on active tab
   const filteredResults = useMemo(() => {
      if (activeTab === 'all') {
         return allResults;
      } else if (activeTab === 'accounts') {
         return { users: allResults.users, posts: [] };
      } else if (activeTab === 'posts') {
         return { users: [], posts: allResults.posts };
      }
      return allResults;
   }, [activeTab, allResults]);

   return (
      <div>
         {/* Sticky Top Navbar */}
         <div className="sticky top-0 z-500 w-full bg-white">
            <Navbar />
         </div>

         {/* Fixed Sidebar (hidden on mobile) */}
         <div className="hidden md:block fixed top-[64px] left-0 h-[calc(100vh-64px)] w-64 border-r bg-background z-40">
            <LeftSide />
         </div>

         <div className="max-w-2xl mx-auto flex mt-8 flex-col gap-6 justify-content-around">
            {/* Search Tabs */}
            <SearchTabs
               activeTab={activeTab}
               setActiveTab={setActiveTab}
               filteredResults={filteredResults}
               isLoading={isLoading}
               searchTerm={searchTerm}
            />
         </div>
      </div>
   );
};

export default SearchClient;