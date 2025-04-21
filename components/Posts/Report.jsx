"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

// Report reasons - you can customize these as needed
const REPORT_REASONS = ["Inappropriate content", "Spam", "Harassment", "Misinformation", "Copyright violation", "Other"]

export default function Report({ isOpen = false, onClose, postId }) {
   const [reason, setReason] = useState("")
   const [details, setDetails] = useState("")
   const [isSubmitting, setIsSubmitting] = useState(false)

   useEffect(() => {
      console.log("Report modal open state:", isOpen)
      if (!isOpen) {
         setReason("")
         setDetails("")
         setIsSubmitting(false)
      }
   }, [isOpen])

   const handleSubmit = async (e) => {
      e.preventDefault()

      if (!reason) {
         toast.error("Please select a reason for your report", {
            description: "Error",
         })
         return
      }

      setIsSubmitting(true)
      try {
         // Send report to your database
         const response = await fetch("/api/posts/report/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId, reason, details }),
         })

         if (!response.ok) {
            console.log("Report submission failed:", response.statusText)
            throw new Error("Failed to submit report")
         }

         toast("Thanks for your report!", {
            description: "We will review this post shortly.",
         })

         // Reset form and close modal
         setReason("")
         setDetails("")
         onClose(false) // Explicitly pass false to close the modal
      } catch (error) {
         toast.error("Failed to submit report. Please try again.", {
            description: "Error",
         })
         console.error("Report submission error:", error)
      } finally {
         setIsSubmitting(false)
      }
   }

   const handleClose = () => {
      onClose(false) // Explicitly pass false to close the modal
   }

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
               <DialogTitle>Report Content</DialogTitle>
               <DialogDescription>Please tell us why you're reporting this post.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
               <div className="space-y-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Select value={reason} onValueChange={setReason}>
                     <SelectTrigger id="reason">
                        <SelectValue placeholder="Select a reason" />
                     </SelectTrigger>
                     <SelectContent>
                        {REPORT_REASONS.map((reportReason) => (
                           <SelectItem key={reportReason} value={reportReason}>
                              {reportReason}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>

               <div className="space-y-2">
                  <Label htmlFor="details">Additional details</Label>
                  <Textarea
                     id="details"
                     placeholder="Please provide any additional information about this report"
                     value={details}
                     onChange={(e) => setDetails(e.target.value)}
                     rows={4}
                  />
               </div>

               <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose}>
                     Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                     {isSubmitting ? "Submitting..." : "Submit Report"}
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
   )
}
