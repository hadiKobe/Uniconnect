"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MediaGallery({ media }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!media || media.length === 0) return null

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
  }

  const currentMedia = media[currentIndex]
  const isVideo = currentMedia.type === "video"

  return (
    <div className="relative w-full mt-2 mb-4">
      <div className="w-full aspect-video bg-gray-100 rounded-md overflow-hidden relative">
        {isVideo ? (
          <div className="relative w-full h-full">
            <video
              src={currentMedia.url}
              className="w-full h-full object-cover"
              controls
              poster={currentMedia.thumbnail}
            />
          </div>
        ) : (
          <img src={currentMedia.url || "/placeholder.svg"} alt="Post media" className="w-full h-full object-cover" />
        )}
      </div>

      {media.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8"
            onClick={handleNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {media.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full ${index === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
