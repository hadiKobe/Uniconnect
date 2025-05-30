"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MediaGallery({ media }) {
   const [currentIndex, setCurrentIndex] = useState(0)
   const [isTransitioning, setIsTransitioning] = useState(false)

   // Early return for empty media
   if (!media || media.length === 0) return null

   const handlePrevious = () => {
      if (currentIndex > 0 && !isTransitioning) {
         setIsTransitioning(true)
         setCurrentIndex(currentIndex - 1)
         setTimeout(() => setIsTransitioning(false), 300) // Match transition duration
      }
   }

   const handleNext = () => {
      if (currentIndex < media.length - 1 && !isTransitioning) {
         setIsTransitioning(true)
         setCurrentIndex(currentIndex + 1)
         setTimeout(() => setIsTransitioning(false), 300) // Match transition duration
      }
   }

   const isFirstImage = currentIndex === 0
   const isLastImage = currentIndex === media.length - 1

   return (
      <div className="relative w-full mt-2 mb-4">
         <div className="w-full aspect-video bg-white rounded-md ">
            <div
               className="relative w-full h-full"
               style={{
                  position: "relative",
                  height: "100%",
               }}
            >
               {media.map((item, index) => (
                  <div
                     key={index}
                     className="absolute top-0 left-0 w-full h-full transition-all duration-300 ease-in-out"
                     style={{
                        opacity: index === currentIndex ? 1 : 0,
                        zIndex: index === currentIndex ? 1 : 0,
                        transform: `translateX(${(index - currentIndex) * 100}%)`,
                     }}
                  >
                     {item.type === "video" ? (
                        <video src={item.url} className="w-full h-full object-contain" controls poster={item.thumbnail} />
                     ) : (
                        <img
                           src={item.url || "/placeholder.svg"}
                           alt={`Media ${index + 1}`}
                           className="w-full h-full object-contain"
                        />
                     )}
                  </div>
               ))}
            </div>
         </div>

         {media.length > 1 && (
            <>
               {/* Media counter */}
               <div className="absolute z-1000 top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs">
                  {currentIndex + 1} / {media.length}
               </div>

               {/* Navigation buttons */}
               {!isFirstImage && (
                  <Button
                     variant="outline"
                     size="icon"
                     className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 z-10"
                     onClick={handlePrevious}
                     disabled={isTransitioning}
                  >
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
               )}

               {!isLastImage && (
                  <Button
                     variant="outline"
                     size="icon"
                     className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full h-8 w-8 z-10"
                     onClick={handleNext}
                     disabled={isTransitioning}
                  >
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               )}

               {/* Indicators */}
               <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                  {media.map((_, index) => (
                     <div
                        key={index}
                        className={`h-1.5 rounded-full cursor-pointer ${index === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                           }`}
                        onClick={() => {
                           if (!isTransitioning) {
                              setIsTransitioning(true)
                              setCurrentIndex(index)
                              setTimeout(() => setIsTransitioning(false), 300)
                           }
                        }}
                     />
                  ))}
               </div>
            </>
         )}
      </div>
   )
}
