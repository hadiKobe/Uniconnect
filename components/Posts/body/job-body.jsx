"use client"

import { MapPin, Briefcase, DollarSign } from "lucide-react"

export default function JobBody({ jobInfo }) {
  const { location, job_type, salary, position } = jobInfo || {}

  // Don't render anything if all are missing
  if (!location && !job_type && !salary && !position) return null

  return (
    <div className="mt-2 mb-3 py-2">
      {/* Badges first */}
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {job_type && (
          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
            <Briefcase className="h-4 w-4" />
            <span className="font-medium text-sm">{job_type}</span>
          </div>
        )}

        {salary && (
          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium text-sm">{salary}</span>
          </div>
        )}

        {location && (
          <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
            <MapPin className="h-4 w-4" />
            <span className="font-medium text-sm">{location}</span>
          </div>
        )}
      </div>

      {/* Position Title Below */}
      {position && (
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {position}
        </h2>
      )}
    </div>
  )
}
