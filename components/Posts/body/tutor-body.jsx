"use client"
import { MapPin, BookOpen, DollarSign } from 'lucide-react'

export default function TutorBody({ tutorInfo }) {
  // Default values if not provided
  const { location = "No Where", subject = "Anything", rate = "0" } = tutorInfo || {}
  // bg-blue-100 text-blue-800
  return (
    <div className="border-green-500 mt-2 py-2 mb-3">
      <div className="flex flex-wrap gap-2">
        {/* Job Type */}
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <span className="font-medium text-sm">{subject}</span>
          <BookOpen className="h-3.5 w-3.5 text-muted-foreground ml-2" />
        </div>

        {/* Salary */}
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <span className="font-medium text-sm">{location}</span>
          <MapPin className="h-3.5 w-3.5 text-muted-foreground ml-2" />
        </div>

        {/* Location */}
        <div className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <span className="font-medium text-sm">${rate}/hr</span>
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground ml-2" />
        </div>
      </div>
    </div>
  )
}