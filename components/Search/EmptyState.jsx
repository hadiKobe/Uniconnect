'use client';

import { Search, Users, FileText } from 'lucide-react';

const EmptyState = ({ type, searchTerm }) => {
   switch (type) {
      case 'all':
         return (
            <div className="text-center py-12">
               <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
               <h3 className="text-lg font-medium mb-2">No results found</h3>
               <p className="text-muted-foreground">
                  We couldn't find anything for "{searchTerm}"
               </p>
            </div>
         );
      case 'accounts':
         return (
            <div className="text-center py-12">
               <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
               <h3 className="text-lg font-medium mb-2">No accounts found</h3>
               <p className="text-muted-foreground">
                  We couldn't find any accounts matching "{searchTerm}"
               </p>
            </div>
         );
      case 'posts':
         return (
            <div className="text-center py-12">
               <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
               <h3 className="text-lg font-medium mb-2">No posts found</h3>
               <p className="text-muted-foreground">
                  We couldn't find any posts matching "{searchTerm}"
               </p>
            </div>
         );
      case 'initial':
      default:
         return (
            <div className="text-center py-12">
               <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
               <h3 className="text-lg font-medium mb-2">Search for something</h3>
               <p className="text-muted-foreground">
                  Enter a search term to find people or posts
               </p>
            </div>
         );
   }
};

export default EmptyState;