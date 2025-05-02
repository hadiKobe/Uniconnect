"use client"
import { useState } from "react"
import { MediaGallery } from "./media-gallery"

export default function GeneralBody({ bodyInfo, maxLength = 280 }) {
  const { content, media_urls } = bodyInfo
  const [expanded, setExpanded] = useState(false)

  // Check if content is longer than maxLength
  const isLongContent = content.length > maxLength

  // If content is long and not expanded, truncate it
  const displayContent = isLongContent && !expanded ? `${content.substring(0, maxLength)}...` : content

  // Function to format text with hashtags highlighted
  const formatContent = (text) => {
    // Split the text by spaces to find hashtags
    const words = text.split(" ")

    return words.map((word, index) => {
      // Check if the word is a hashtag
      if (word.startsWith("#")) {
        return (
          <span key={index}>
            <span className="text-blue-500 hover:underline cursor-pointer">{word}</span>{" "}
          </span>
        )
      }
      // Regular word
      return <span key={index}>{word} </span>
    })
  }

  // Function to determine if media is an image or video
  const isImage = (url) => {
    const extension = url.split(".").pop().toLowerCase()
    return ["jpg", "jpeg", "png", "gif", "webp"].includes(extension)
  }

  const isVideo = (url) => {
    const extension = url.split(".").pop().toLowerCase()
    return ["mp4", "webm", "ogg", "mov"].includes(extension)
  }

  // Format media_urls for MediaGallery component
  const formattedMedia =
    media_urls?.map((url) => ({
      url: url,
      type: isVideo(url) ? "video" : "image",
      thumbnail: isVideo(url) ? "/placeholder.svg" : url, // Use a placeholder for video thumbnails
    })) || []

  return (
    <div className="space-y-3 my-3 w-full">
      {/* Content text */}
      <div className="whitespace-pre-line">{formatContent(displayContent)}</div>

      {isLongContent && (
        <button onClick={() => setExpanded(!expanded)} className="text-sm text-muted-foreground hover:text-foreground">
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {/* Media Gallery - using the new component */}
      {media_urls && media_urls.length > 0 && <MediaGallery media={formattedMedia} />}
    </div>
  )
}
