"use client"
import { DollarSign, MapPin, Tag } from 'lucide-react'

export default function MarketBody({ marketInfo }) {
  const { price, location, product_name } = marketInfo || {}

  if (!price && !location && !product_name) return null; 
  
  return (
    <div className="mt-2 mb-3 py-2">
      <div className="flex flex-wrap items-center gap-3">
        {product_name && (
          <h2 className="text-xl font-semibold text-gray-800">
            {product_name}
          </h2>
        )}

        {price && (
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
            <DollarSign className="h-4 w-4" />
            <span className="font-medium text-sm">{price}</span>
          </div>
        )}

        {location && (
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 px-3 py-1 rounded-md transition-all duration-200 hover:px-4 cursor-pointer">
            <MapPin className="h-4 w-4" />
            <span className="font-medium text-sm">{location}</span>
          </div>
        )}
      </div>
    </div>
  )
}