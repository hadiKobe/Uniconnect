"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function GeneralBody({ bodyInfo, maxLength = 280 }) {
   const { content } = bodyInfo;
  const [expanded, setExpanded] = useState(false)
  
  // Check if content is longer than maxLength
  const isLongContent = content.length > maxLength
  
  // If content is long and not expanded, truncate it
  const displayContent = isLongContent && !expanded 
    ? `${content.substring(0, maxLength)}...` 
    : content
  
  // Function to format text with hashtags highlighted
  const formatContent = (text) => {
    // Split the text by spaces to find hashtags
    const words = text.split(' ')
    
    return words.map((word, index) => {
      // Check if the word is a hashtag
      if (word.startsWith('#')) {
        return (
          <span key={index}>
            <span className="text-blue-500 hover:underline cursor-pointer">
              {word}
            </span>
            {' '}
          </span>
        )
      }
      // Regular word
      return <span key={index}>{word} </span>
    })
  }

  return (
    <div className="space-y-2 my-3">
      <div className="whitespace-pre-line">
        {formatContent(displayContent)}
      </div>
      
      {isLongContent && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  )
}
