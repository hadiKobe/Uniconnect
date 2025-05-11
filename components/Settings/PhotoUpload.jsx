"use client"

import { uploadMedia } from "@/lib/supaBase/storage"
import { useState, useRef, useCallback, useEffect } from "react"
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon, Maximize2 } from "lucide-react"
import Cropper from "react-easy-crop"
import { Slider } from "@/components/ui/slider"

export function PhotoUploadDialog({ open, onOpenChange, onImageUploaded, initialImageUrl = null }) {
   const [selectedFile, setSelectedFile] = useState(null)
   const [preview, setPreview] = useState(null)
   const [isUploading, setIsUploading] = useState(false)
   const [isResizing, setIsResizing] = useState(false)
   const [hasChanges, setHasChanges] = useState(false)
   const fileInputRef = useRef(null)

   // Crop/resize state
   const [crop, setCrop] = useState({ x: 0, y: 0 })
   const [zoom, setZoom] = useState(1)
   const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

   // Load initial image if provided
   useEffect(() => {
      if (initialImageUrl) {
         setPreview(initialImageUrl)
      } else {
         setPreview(null)
      }
      setHasChanges(false)
   }, [initialImageUrl, open])

   const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
         const file = e.target.files[0]
         setSelectedFile(file)

         // Create preview
         const reader = new FileReader()
         reader.onload = () => {
            setPreview(reader.result)
            setHasChanges(true)
         }
         reader.readAsDataURL(file)
      }
   }

   const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels)
   }, [])

   const createImage = (url) =>
      new Promise((resolve, reject) => {
         const image = new Image()
         image.addEventListener("load", () => resolve(image))
         image.addEventListener("error", (error) => reject(error))
         image.crossOrigin = "anonymous"
         image.src = url
      })

   const getCroppedImg = async (imageSrc, pixelCrop) => {
      const image = await createImage(imageSrc)
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
         return imageSrc
      }

      // Set canvas size to the cropped size
      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      // Draw the cropped image
      ctx.drawImage(
         image,
         pixelCrop.x,
         pixelCrop.y,
         pixelCrop.width,
         pixelCrop.height,
         0,
         0,
         pixelCrop.width,
         pixelCrop.height,
      )

      // Convert canvas to base64 string
      return canvas.toDataURL("image/jpeg")
   }

   const handleResize = async () => {
      if (!preview || !croppedAreaPixels) return

      try {
         const croppedImage = await getCroppedImg(preview, croppedAreaPixels)
         setPreview(croppedImage)
         setIsResizing(false)
         setHasChanges(true)
      } catch (e) {
         console.error(e)
      }
   }

   const handleUpload = async () => {
      setIsUploading(true)

      try {
         // If there's no preview, it means the user wants to remove their profile picture
         if (!preview) {
            onImageUploaded(null)
            onOpenChange(false)
            setHasChanges(false)
            setIsUploading(false)
            return
         }

         // If there's no selectedFile but there is a preview, it might be the initial image
         // In this case, we should just return the preview URL
         if (!selectedFile) {
            onImageUploaded(preview)
            onOpenChange(false)
            setHasChanges(false)
            setIsUploading(false)
            return
         }

         // Upload to Supabase in the 'profile' folder
         const { publicUrl } = await uploadMedia(selectedFile, "profile")

         if (!publicUrl) throw new Error("Failed to retrieve image URL.")

         // Return the Supabase public URL instead of base64 preview
         onImageUploaded(publicUrl)
         onOpenChange(false)
         setHasChanges(false)
      } catch (error) {
         console.error("Upload failed:", error)
      } finally {
         setIsUploading(false)
      }
   }

   const resetForm = () => {
      setSelectedFile(null)
      setPreview(null)
      setIsResizing(false)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setHasChanges(true)
      if (fileInputRef.current) {
         fileInputRef.current.value = ""
      }
   }

   const handleCancel = () => {
      onOpenChange(false)
      setHasChanges(false)
   }

   const handleRemove = () => {
      resetForm()
      // Don't close the dialog, just clear the preview
      // The user can now either select a new image or save with no image
   }

   // Check if the current state is different from the initial state
   const isChanged = () => {
      if (initialImageUrl === null && preview === null) return false
      if (initialImageUrl === null && preview !== null) return true
      if (initialImageUrl !== null && preview === null) return true
      return hasChanges
   }

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-md">
            <DialogHeader>
               <DialogTitle>Profile Picture</DialogTitle>
               <DialogDescription>
                  {preview ? "Edit your profile picture or remove it" : "Upload a profile picture or continue without one"}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
               {!preview ? (
                  <div
                     className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12"
                     onClick={() => fileInputRef.current?.click()}
                  >
                     <ImageIcon className="mb-4 h-12 w-12 text-gray-400" />
                     <div className="space-y-1 text-center">
                        <p className="text-sm text-gray-500">
                           <span className="font-semibold text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                     </div>
                     <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
               ) : isResizing ? (
                  <div className="space-y-4">
                     <div className="relative h-[300px] w-full">
                        <Cropper
                           image={preview}
                           crop={crop}
                           zoom={zoom}
                           aspect={1}
                           onCropChange={setCrop}
                           onCropComplete={onCropComplete}
                           onZoomChange={setZoom}
                           cropShape="round"
                        />
                     </div>
                     <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <span className="text-sm font-medium">Zoom</span>
                           <span className="text-sm text-gray-500">{zoom.toFixed(1)}x</span>
                        </div>
                        <Slider value={[zoom]} min={1} max={3} step={0.1} onValueChange={(value) => setZoom(value[0])} />
                     </div>
                     <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setIsResizing(false)} className="flex-1">
                           Cancel
                        </Button>
                        <Button onClick={handleResize} className="flex-1">
                           Apply
                        </Button>
                     </div>
                  </div>
               ) : (
                  <div className="relative">
                     <div className="overflow-hidden rounded-full aspect-square mx-auto w-48 h-48">
                        <img src={preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                     </div>
                     <div className="absolute right-1/4 top-2 flex space-x-2">
                        <Button
                           variant="secondary"
                           size="icon"
                           className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                           onClick={() => setIsResizing(true)}
                        >
                           <Maximize2 className="h-4 w-4" />
                           <span className="sr-only">Resize image</span>
                        </Button>
                        <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={handleRemove}>
                           <X className="h-4 w-4" />
                           <span className="sr-only">Remove image</span>
                        </Button>
                     </div>
                  </div>
               )}
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
               <div className="flex w-full sm:w-auto gap-2">
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                     Cancel
                  </Button>
                  <Button
                     onClick={handleUpload}
                     disabled={isUploading || isResizing || !isChanged()}
                     className="gap-2 flex-1"
                  >
                     {isUploading ? (
                        <>
                           <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                           Uploading...
                        </>
                     ) : (
                        <>
                           <Upload className="h-4 w-4" />
                           Save
                        </>
                     )}
                  </Button>
               </div>
            </DialogFooter>
         </DialogContent>
      </Dialog>
   )
}
