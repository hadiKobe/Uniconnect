"use client"
import { MapPin, Briefcase, DollarSign } from 'lucide-react'

export default function JobBody({ jobInfo }) {
  // Default values if not provided
  const { location = "No Where", job_type = "No Type", salary = "$0" } = jobInfo || {}

  return (
    <div className="border-l-4 border-green-500 pl-4 py-2 mb-3">
      <div className="grid grid-cols-1 gap-3">
        {/* Job Type */}
        <div className="flex items-center gap-3">
          <Briefcase className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Job Type</p>
            <p className="font-medium">{job_type}</p>
          </div>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-3">
          <DollarSign className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Salary</p>
            <p className="font-medium">{salary}</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3">
          <MapPin className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">{location}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
