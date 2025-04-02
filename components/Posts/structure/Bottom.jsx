import React from 'react'

const Bottom = () => {
   return (
      <div className="flex justify-start space-x-8 border-t pt-3 border-gray-200">
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500">
            <span >👍</span>
            <span>Likes</span>
         </button>
         <button className="cursor-pointer flex items-center space-x-2 hover:text-blue-500">
            <span>💬</span>
            <span>Comments</span>
         </button>
      </div>
   )
}

export default Bottom