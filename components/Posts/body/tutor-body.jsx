"use client"
import { MapPin, BookOpen, DollarSign } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function TutorBody({ tutorData }) {
  // Default values if not provided
  const { location = "Online", subject = "Mathematics", rate = "$25/hour" } = tutorData || {}

  return (
    <div className="bg-secondary/20 rounded-lg p-4 border border-secondary/30">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Tutoring Details</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Subject */}
        <div className="group flex flex-col space-y-1.5 rounded-md border p-3 shadow-sm transition-all hover:bg-secondary/30">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase text-muted-foreground">Subject</span>
          </div>
          <span className="font-medium">{subject}</span>
        </div>

        {/* Location */}
        <div className="group flex flex-col space-y-1.5 rounded-md border p-3 shadow-sm transition-all hover:bg-secondary/30">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase text-muted-foreground">Location</span>
          </div>
          <span className="font-medium">{location}</span>
        </div>

        {/* Rate */}
        <div className="group flex flex-col space-y-1.5 rounded-md border p-3 shadow-sm transition-all hover:bg-secondary/30">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium uppercase text-muted-foreground">Rate</span>
          </div>
          <div className="flex items-center">
            <Badge variant="secondary" className="font-medium text-foreground">
              {rate}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
