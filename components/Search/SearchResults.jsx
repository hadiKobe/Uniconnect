'use client';

import UserCard from './UserCard';
import Post from '../Posts/Post'; // Your existing Post component

const SearchResults = ({ users, posts, setActiveTab, isAllTab = false }) => {
   return (
      <div className="space-y-10 w-full">
         {users.length > 0 && (
            <div className="w-full">
               <div className="flex items-center justify-between mb-4 w-full">
                  <h2 className="text-xl font-semibold">People</h2>
                  {isAllTab && users.length > 3 && (
                     <button
                        onClick={() => setActiveTab('accounts')}
                        className="text-sm text-blue-600 hover:underline"
                     >
                        See all
                     </button>
                  )}
               </div>

               <div className="flex flex-col gap-4 w-full">
                  {(isAllTab ? users.slice(0, 3) : users).map(user => (
                     <div key={user.id} className="w-full">
                        <UserCard user={user} />
                     </div>
                  ))}
               </div>
            </div>
         )}

         {isAllTab && <div className="w-full border-t border-gray-300 my-6" />}

         {posts.length > 0 && (
            <div className="w-full ">
               <div className="flex items-center justify-between mb-4 w-full">
                  <h2 className="text-xl font-semibold">Posts</h2>
                  {isAllTab && posts.length > 3 && (
                     <button
                        onClick={() => setActiveTab('posts')}
                        className="text-sm text-blue-600 hover:underline"
                     >
                        See all
                     </button>
                  )}
               </div>

               <div className="flex flex-col gap-4 w-full">
                  {(isAllTab ? posts.slice(0, 3) : posts).map((post, index) => (
                     <div key={post.id || index} className="w-full">
                        <Post post={post} />
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
};

export default SearchResults;