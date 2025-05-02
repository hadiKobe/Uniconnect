"use client"
import { MapPin, Briefcase, DollarSign } from 'lucide-react'

export default function JobBody({ jobInfo }) {
  // Default values if not provided
  const { location = "No Where", job_type = "No Type", salary = "$0" } = jobInfo || {}
  // bg-green-100 text-green-800
  return (
    <div className="border-green-500 mt-2 py-2 mb-3">
      <div className="flex flex-wrap gap-2">
        {/* Job Type */}
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <Briefcase className="h-4 w-4" />
          <span className="font-medium text-sm">{job_type}</span>
        </div>

        {/* Salary */}
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium text-sm">{salary}</span>
        </div>

        {/* Location */}
        <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <MapPin className="h-4 w-4" />
          <span className="font-medium text-sm">{location}</span>
        </div>
      </div>
    </div>
  )
}