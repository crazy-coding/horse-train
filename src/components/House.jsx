import React from 'react'
import Trough from './Trough'
import { useAssets } from '../context/AssetContext'

export default function House({styleId, mode, foodLevel, waterLevel, onFillFeed, onFillWater}){
  const { get } = useAssets()
  const houseImg = get('houses', `house (${styleId})`)

  return (
    <div className="w-full rounded-lg overflow-hidden">
      <div className="relative w-full h-60 flex items-end justify-between p-4">
        {/* House Background */}
        {houseImg ? (
          <img 
            src={houseImg} 
            alt={`house-${styleId}`} 
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-white to-sky-50" />
        )}
        
        {/* Content overlay */}
        <div className="relative z-10 w-full flex items-end justify-between">
          <div className="text-sm font-semibold text-white drop-shadow">
            House #{String(styleId).padStart(2,'0')} <span className="text-xs text-gray-200">({mode})</span>
          </div>
          <div className="flex gap-3">
            <Trough label="Food" type="food" level={foodLevel} onFill={onFillFeed} />
            <Trough label="Water" type="water" level={waterLevel} onFill={onFillWater} />
          </div>
        </div>
      </div>
    </div>
  )
}
