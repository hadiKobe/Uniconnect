"use client"
import { DollarSign, MapPin, Tag } from 'lucide-react'

export default function MarketBody({ marketInfo }) {
  // Default values if not provided
  const { price = "$0", location = "No Where" } = marketInfo || {}
// bg-amber-100 text-amber-800
  return (
    <div className="border-green-500 mt-2 py-2 mb-3">
      <div className="flex flex-wrap gap-2">
        {/* Price */}
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <DollarSign className="h-4 w-4" />
          <span className="font-medium text-sm">{price}</span>
        </div>

        {/* Location */}
        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
          <MapPin className="h-4 w-4" />
          <span className="font-medium text-sm">{location}</span>
        </div>
      </div>
    </div>
  )
}