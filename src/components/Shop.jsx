import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Shop({ 
  coins, 
  upgrades, 
  ownedHouses, 
  currentHouseStyle,
  housePrices,
  canBuyHouse,
  buyHouse,
  switchHouse,
  canUpgradeTrough,
  performTroughUpgrade,
  getUpgradeCost,
  maxTroughLevel
}){
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState('houses')

  const houseStyles = [
    { id: 1, name: 'Cozy Cottage', icon: '🏠' },
    { id: 2, name: 'Modern Home', icon: '🏡' },
    { id: 3, name: 'Grand Manor', icon: '🏰' },
    { id: 4, name: 'Luxury Estate', icon: '👑' }
  ]

  const troughUpgrades = [
    {
      id: 'foodTrough',
      name: 'Food Trough Upgrade',
      description: 'Larger troughs hold more food',
      icon: '🌾',
      color: 'bg-orange-100 text-orange-800',
      borderColor: 'border-orange-400'
    },
    {
      id: 'waterTrough',
      name: 'Water Trough Upgrade',
      description: 'Larger troughs hold more water',
      icon: '💧',
      color: 'bg-blue-100 text-blue-800',
      borderColor: 'border-blue-400'
    }
  ]

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
      animate={{ height: expanded ? 'auto' : '70px' }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛍️</span>
          <div className="text-left">
            <h2 className="font-bold text-lg">Shop</h2>
            <p className="text-sm text-gray-600">Buy houses & upgrade equipment</p>
          </div>
        </div>
        <span className="text-xl transform transition-transform" style={{ rotate: expanded ? '180deg' : '0deg' }}>
          ▼
        </span>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-200">
          {/* Tab buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('houses')}
              className={`flex-1 py-2 px-3 rounded font-semibold transition ${
                activeTab === 'houses'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🏠 Houses
            </button>
            <button
              onClick={() => setActiveTab('troughs')}
              className={`flex-1 py-2 px-3 rounded font-semibold transition ${
                activeTab === 'troughs'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📦 Upgrades
            </button>
          </div>

          {/* HOUSES TAB */}
          {activeTab === 'houses' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Purchase and switch between different house styles</p>
              {houseStyles.map((house) => {
                const owned = ownedHouses[house.id]
                const isActive = currentHouseStyle === house.id
                const cost = housePrices[house.id]
                const canBuy = canBuyHouse(house.id)

                return (
                  <motion.div
                    key={house.id}
                    className={`p-3 rounded-lg border-2 transition ${
                      owned
                        ? isActive
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-300 bg-gray-50'
                        : 'border-gray-300 bg-gray-50'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-3xl">{house.icon}</span>
                        <div>
                          <div className="font-semibold">{house.name}</div>
                          <div className="text-sm text-gray-600">
                            {owned ? (
                              isActive ? (
                                <span className="text-green-600 font-semibold">✓ Current House</span>
                              ) : (
                                <span className="text-green-600">✓ Owned</span>
                              )
                            ) : (
                              <span>💰 {cost} coins</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!owned && (
                          <button
                            onClick={() => buyHouse(house.id)}
                            disabled={!canBuy}
                            className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap ${
                              canBuy
                                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                          >
                            Buy
                          </button>
                        )}
                        {owned && !isActive && (
                          <button
                            onClick={() => switchHouse(house.id)}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded font-semibold transition"
                          >
                            Switch
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {/* UPGRADES TAB */}
          {activeTab === 'troughs' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600 mb-3">Upgrade your farm equipment to increase capacity</p>
              {troughUpgrades.map((item) => {
                const levelKey = item.id === 'foodTrough' ? 'foodTroughLevel' : 'waterTroughLevel'
                const currentLevel = upgrades[levelKey]
                const isMaxed = currentLevel >= maxTroughLevel
                const canBuy = canUpgradeTrough(item.id)
                const cost = !isMaxed ? Math.floor(getUpgradeCost(item.id, currentLevel + 1)) : 0

                return (
                  <motion.div
                    key={item.id}
                    className={`p-3 rounded-lg border-2 ${item.borderColor} ${item.color} transition`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm opacity-75">{item.description}</div>
                          <div className="text-xs mt-1 font-semibold">
                            Level: <span>{currentLevel}/{maxTroughLevel}</span>
                            {currentLevel > 1 && (
                              <span> • +{(currentLevel - 1) * 30}% capacity</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        {!isMaxed && (
                          <button
                            onClick={() => performTroughUpgrade(item.id)}
                            disabled={!canBuy}
                            className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap ${
                              canBuy
                                ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                            }`}
                          >
                            {canBuy ? `Upgrade • 💰 ${cost}` : '💰 Not enough'}
                          </button>
                        )}
                        {isMaxed && (
                          <div className="px-4 py-2 bg-purple-500 text-white rounded font-semibold text-sm whitespace-nowrap">
                            ✨ MAXED
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
