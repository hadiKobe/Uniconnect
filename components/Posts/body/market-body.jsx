"use client"
import { DollarSign, MapPin } from 'lucide-react'

export default function MarketBody({ marketInfo }) {
  // Default values if not provided
  const { price = "$50", location = "On Campus" } = marketInfo || {}

  return (
    <div className="flex flex-col space-y-2 my-3">
      {/* Price */}
      <div className="flex items-center">
        <div className="bg-amber-100 text-amber-800 rounded-l-md p-2 flex items-center justify-center">
          <DollarSign className="h-5 w-5" />
        </div>
        <div className="bg-amber-50 rounded-r-md py-2 px-3 flex-1">
          <p className="font-semibold text-lg">{price}</p>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-center">
        <div className="bg-blue-100 text-blue-800 rounded-l-md p-2 flex items-center justify-center">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="bg-blue-50 rounded-r-md py-2 px-3 flex-1">
          <p className="font-medium">{location}</p>
        </div>
      </div>
    </div>
  )
}
