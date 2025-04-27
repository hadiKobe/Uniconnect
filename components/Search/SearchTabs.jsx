'use client';

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, Users, FileText } from 'lucide-react';
import SearchResults from './SearchResults';
import EmptyState from './EmptyState';

const SearchTabs = ({ activeTab, setActiveTab, filteredResults, isLoading, searchTerm }) => {
   return (
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
         <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="all" className="flex items-center gap-2">
               <Search className="h-4 w-4" />
               <span>All</span>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="flex items-center gap-2">
               <Users className="h-4 w-4" />
               <span>Accounts</span>
            </TabsTrigger>
            <TabsTrigger value="posts" className="flex items-center gap-2">
               <FileText className="h-4 w-4" />
               <span>Posts</span>
            </TabsTrigger>
         </TabsList>

         {/* Results */}
         <div className="mt-6">
            {isLoading ? (
               <LoadingSkeletons />
            ) : searchTerm ? (
               <>
                  <TabsContent value="all" className="mt-0">
                     {filteredResults.users.length > 0 || filteredResults.posts.length > 0 ? (
                        <SearchResults
                           users={filteredResults.users}
                           posts={filteredResults.posts}
                           setActiveTab={setActiveTab}
                           isAllTab={true}
                        />
                     ) : (
                        <EmptyState
                           type="all"
                           searchTerm={searchTerm}
                        />
                     )}
                  </TabsContent>

                  <TabsContent value="accounts" className="mt-0">
                     {filteredResults.users.length > 0 ? (
                        <SearchResults
                           users={filteredResults.users}
                           posts={[]}
                           setActiveTab={setActiveTab}
                        />
                     ) : (
                        <EmptyState
                           type="accounts"
                           searchTerm={searchTerm}
                        />
                     )}
                  </TabsContent>

                  <TabsContent value="posts" className="mt-0">
                     {filteredResults.posts.length > 0 ? (
                        <SearchResults
                           users={[]}
                           posts={filteredResults.posts}
                           setActiveTab={setActiveTab}
                        />
                     ) : (
                        <EmptyState
                           type="posts"
                           searchTerm={searchTerm}
                        />
                     )}
                  </TabsContent>
               </>
            ) : (
               <EmptyState type="initial" />
            )}
         </div>
      </Tabs>
   );
};

// Loading skeletons component
const LoadingSkeletons = () => {
   return (
      <div className="space-y-4">
         {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse p-4 border rounded-md flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-muted"></div>
               <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
               </div>
            </div>
         ))}
      </div>
   );
};

export default SearchTabs;