import React, { useEffect, useState } from 'react'
import { useSound } from './context/SoundContext'
import Horse from './components/Horse'
import House from './components/House'
import Shop from './components/Shop'
import CarrotAnimation from './components/CarrotAnimation'

export default function App(){
  const [horse, setHorse] = useState({
    id: 'h1',
    typeId: 1,
    age: 'adult',
    stats: {hunger:40, sleepy:10, dizzy:0, bored:20, hurt:0},
    animation: 'idle',
  })

  const [carrotAnimating, setCarrotAnimating] = useState(false)

  const [coins, setCoins] = useState(100)
  const [gems, setGems] = useState(50)
  const [upgrades, setUpgrades] = useState({
    foodTroughLevel: 1,
    waterTroughLevel: 1
  })
  const [foodInventory, setFoodInventory] = useState({
    corn: 5,
    carrot: 2
  })
  const [ownedHouses, setOwnedHouses] = useState({
    1: true,
    2: false,
    3: false,
    4: false
  })

  const [house, setHouse] = useState({styleId:1, mode:'single', foodLevel:0.6, waterLevel:0.4, cornCount: 0, carrotCount: 0})

  // House prices (uses gems)
  const housePrices = {
    1: 0,
    2: 30,
    3: 60,
    4: 100
  }

  // Helper to get house price with a sensible fallback for additional assets
  const getHousePrice = (styleId) => {
    if(housePrices[styleId] !== undefined) return housePrices[styleId]
    // Fallback: scale price by style id (tunable)
    return Math.floor(20 * styleId)
  }

  // Food types with different currencies
  const foodTypes = {
    corn: {
      name: 'Corn',
      icon: '🌾',
      hungerReduction: 20,
      price: 0,  // FREE
      currency: 'coins',
      color: 'bg-yellow-100 text-yellow-800'
    },
    carrot: {
      name: 'Carrot',
      icon: '🥕',
      hungerReduction: 40,  // 2x better than corn
      price: 15,
      currency: 'coins',   // NOW bought with coins
      color: 'bg-orange-100 text-orange-800'
    }
  }

  // Gem exchange rate
  const exchangeRate = 500  // 1 gem = 500 coins

  const getUpgradeCost = (type, level) => {
    const baseCosts = { foodTrough: 40, waterTrough: 40 }
    return baseCosts[type] * Math.pow(1.5, level - 1)
  }

  const maxTroughLevel = 4

  // Get trough capacity based on upgrade level
  const getTroughCapacity = (level) => {
    const capacities = [5, 10, 20, 35]
    return capacities[level - 1] || 5
  }

  const foodTroughCapacity = getTroughCapacity(upgrades.foodTroughLevel)
  const totalFoodInTrough = house.cornCount + house.carrotCount

  const canBuyHouse = (styleId) => {
    const price = getHousePrice(styleId)
    return !ownedHouses[styleId] && gems >= price
  }

  const buyHouse = (styleId) => {
    const price = getHousePrice(styleId)
    if(ownedHouses[styleId] || gems < price) return
    setGems(g => g - price)
    setOwnedHouses(h => ({...h, [styleId]: true}))
  }

  const switchHouse = (styleId) => {
    if(ownedHouses[styleId]){
      setHouse(h => ({...h, styleId}))
    }
  }

  const canUpgradeTrough = (type) => {
    const levelKey = type === 'foodTrough' ? 'foodTroughLevel' : 'waterTroughLevel'
    const currentLevel = upgrades[levelKey]
    if(currentLevel >= maxTroughLevel) return false
    const cost = getUpgradeCost(type, currentLevel + 1)
    return coins >= cost
  }

  const performTroughUpgrade = (type) => {
    const levelKey = type === 'foodTrough' ? 'foodTroughLevel' : 'waterTroughLevel'
    const currentLevel = upgrades[levelKey]
    if(currentLevel >= maxTroughLevel) return
    
    const cost = getUpgradeCost(type, currentLevel + 1)
    if(coins < cost) return

    setCoins(c => c - cost)
    setUpgrades(u => ({...u, [levelKey]: currentLevel + 1}))
  }

  useEffect(()=>{
    const iv = setInterval(()=>{
      setHorse(h => ({
        ...h,
        stats: {
          ...h.stats,
          hunger: Math.min(100, h.stats.hunger + 1),
          sleepy: Math.min(100, h.stats.sleepy + 0.4),
          bored: Math.min(100, h.stats.bored + 0.5)
        }
      }))
    }, 60000)
    return ()=> clearInterval(iv)
  },[])

  // Auto-eating from trough (eat 5 items per day, every 30 seconds)
  useEffect(()=>{
    const eatInterval = setInterval(()=>{
      setHouse(hs => {
        // Check if there's any food in trough
        const totalFood = hs.cornCount + hs.carrotCount
        if(totalFood === 0) return hs
        
        // Eat carrots first, then corn
        let newCarrotCount = hs.carrotCount
        let newCornCount = hs.cornCount
        let hungerReduction = 0
        
        // Eat 1 carrot first if available
        if(newCarrotCount > 0){
          newCarrotCount--
          hungerReduction = foodTypes.carrot.hungerReduction // 40
        } else if(newCornCount > 0){
          // Otherwise eat corn
          newCornCount--
          hungerReduction = foodTypes.corn.hungerReduction // 20
        }
        
        setHorse(h => ({
          ...h,
          stats: {
            ...h.stats,
            hunger: Math.max(0, h.stats.hunger - hungerReduction)
          },
          animation: 'eat'
        }))
        
        setTimeout(()=> setHorse(h => ({...h, animation:'idle'})), 1200)
        playNamedSound('eating')
        
        return {
          ...hs,
          cornCount: newCornCount,
          carrotCount: newCarrotCount
        }
      })
    }, 30000) // Eat every 30 seconds
    
    return ()=> clearInterval(eatInterval)
  },[])

  const { playNamedSound } = useSound()

  // Fill trough with carrot (adds one carrot per click; if full and corn exists, replace one corn)
  function fillTroughWithCarrot(){
    if(foodInventory.carrot <= 0) return

    const capacity = getTroughCapacity(upgrades.foodTroughLevel)
    const totalFood = house.cornCount + house.carrotCount

    // Trigger carrot animation
    setCarrotAnimating(true)

    // If there's space, add a single carrot
    if(totalFood < capacity){
      setFoodInventory(f => ({...f, carrot: f.carrot - 1}))
      setHouse(hs => ({...hs, carrotCount: hs.carrotCount + 1}))
      playNamedSound('feed')
      return
    }

    // If trough is full and there's corn, replace one corn with one carrot
    if(house.cornCount > 0){
      setFoodInventory(f => ({...f, carrot: f.carrot - 1}))
      setHouse(hs => ({...hs, cornCount: hs.cornCount - 1, carrotCount: hs.carrotCount + 1}))
      playNamedSound('feed')
    }
  }

  // Fill trough with corn (fills remaining capacity up to trough limit)
  function fillTroughWithCorn(){
    const capacity = getTroughCapacity(upgrades.foodTroughLevel)
    const totalFood = house.cornCount + house.carrotCount
    const availableSpace = capacity - totalFood
    
    if(availableSpace <= 0) return
    
    // Add as much corn as possible
    const cornToAdd = availableSpace
    setHouse(hs => ({...hs, cornCount: hs.cornCount + cornToAdd}))
    playNamedSound('feed')
  }

  // Toggle trough: add corn until full, or swap carrot for corn when at capacity
  function toggleTroughFoodType(){
    const capacity = getTroughCapacity(upgrades.foodTroughLevel)
    const totalFood = house.cornCount + house.carrotCount
    
    if(totalFood < capacity){
      // Not at capacity: add corn until full
      const cornToAdd = capacity - totalFood
      setHouse(hs => ({...hs, cornCount: hs.cornCount + cornToAdd}))
    } else if(house.carrotCount > 0){
      // At capacity and carrots exist: swap 1 carrot for 1 corn and return carrot to inventory
      setHouse(hs => ({...hs, carrotCount: hs.carrotCount - 1, cornCount: hs.cornCount + 1}))
      setFoodInventory(f => ({...f, carrot: f.carrot + 1}))
    }
    // If at capacity and no carrots, nothing happens
  }

  function buyFood(foodType, quantity = 1){
    const cost = foodTypes[foodType].price * quantity
    const currency = foodTypes[foodType].currency
    
    if(currency === 'coins' && coins < cost) return
    if(currency === 'gems' && gems < cost) return
    
    if(currency === 'coins'){
      setCoins(c => c - cost)
    } else {
      setGems(g => g - cost)
    }
    setFoodInventory(f => ({...f, [foodType]: f[foodType] + quantity}))
  }

  function buyCoinsWithGems(gemAmount){
    const coinAmount = gemAmount * exchangeRate
    if(gems < gemAmount) return
    setGems(g => g - gemAmount)
    setCoins(c => c + coinAmount)
  }

  // Fake purchase: pay real money to receive gems (1$ = 100 gems)
  function buyGemsWithMoney(dollars = 1){
    const gemsToAdd = Math.floor(100 * dollars)
    // In a real app you'd call a payment API here. For the demo we just add gems.
    setGems(g => g + gemsToAdd)
    playNamedSound('aegyo')
  }

  function makeAegyo(){
    setHorse(h => ({...h, animation:'aegyo'}))
    playNamedSound('aegyo')
    setTimeout(()=> setHorse(h => ({...h, animation:'idle'})), 1000)
  }

  // Animation helper function
  const triggerAnimation = (animationType, duration = 1000, soundName = null) => {
    setHorse(h => ({...h, animation: animationType}))
    if (soundName) {
      try {
        playNamedSound(soundName)
      } catch (e) {
        // Silent fail if sound not available
      }
    }
    setTimeout(() => setHorse(h => ({...h, animation: 'idle'})), duration)
  }

  // Animation trigger functions
  const makeEat = () => triggerAnimation('eat', 800, 'eating')
  const makeBlink = () => triggerAnimation('blink', 400)
  const makeHeadTilt = () => triggerAnimation('headTilt', 1000)
  const makeCloseEyes = () => triggerAnimation('closeEyes', 1200)
  const makeHungry = () => {
    setHorse(h => ({...h, animation: 'hungry'}))
    setTimeout(() => setHorse(h => ({...h, animation: 'idle'})), 3000)
  }
  const makeHurt = () => triggerAnimation('hurt', 600)
  const makeCute = () => triggerAnimation('cute', 1000, 'aegyo')
  const makeBrushed = () => triggerAnimation('brushed', 900, 'feed')

  const { muted, toggleMute } = useSound()

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen rounded-xl">
      <CarrotAnimation 
        isAnimating={carrotAnimating}
        onAnimationComplete={() => setCarrotAnimating(false)}
      />
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Cute Horse Game — Demo</h1>
          <p className="text-sm text-gray-600">Simple prototype based on the README design.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-yellow-100 rounded-lg border-2 border-yellow-400">
            <span className="text-lg font-bold text-yellow-800">💰 {Math.floor(coins)}</span>
          </div>
          <div className="px-4 py-2 bg-purple-100 rounded-lg border-2 border-purple-400">
            <span className="text-lg font-bold text-purple-800">💎 {gems}</span>
          </div>
          <button onClick={toggleMute} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">
            {muted ? 'Unmute' : 'Mute'}
          </button>
        </div>
      </header>

      <main className="space-y-4">
        <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
          <House
            styleId={house.styleId}
            mode={house.mode}
            foodLevel={house.foodLevel}
            waterLevel={house.waterLevel}
            foodTroughLevel={upgrades.foodTroughLevel}
            waterTroughLevel={upgrades.waterTroughLevel}
            cornCount={house.cornCount}
            carrotCount={house.carrotCount}
            onToggleFoodType={toggleTroughFoodType}
            onFillFeed={() => {
              const fillAmount = 0.3 * upgrades.foodTroughLevel
              const newLevel = Math.min(1, house.foodLevel + fillAmount)
              setHouse(hs => ({...hs, foodLevel: newLevel}))
              playNamedSound('feed')
            }}
            onFillWater={() => {
              const fillAmount = 0.3 * upgrades.waterTroughLevel
              const newLevel = Math.min(1, house.waterLevel + fillAmount)
              setHouse(hs => ({...hs, waterLevel: newLevel}))
              playNamedSound('water-fill')
            }}
          />
          {/* Horse positioned in front of house */}
          <div className="absolute left-8 bottom-0 z-20">
            <Horse horse={horse} />
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button 
            onClick={() => fillTroughWithCorn()}
            disabled={totalFoodInTrough >= foodTroughCapacity}
            className="px-4 py-2 bg-yellow-500 text-white rounded font-medium hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🌾 Fill with Corn (Free)
          </button>
          <button 
            onClick={() => fillTroughWithCarrot()}
            disabled={totalFoodInTrough >= foodTroughCapacity || foodInventory.carrot === 0}
            className="px-4 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🥕 Add Carrot ({house.carrotCount}/{foodTroughCapacity}) - Inventory: {foodInventory.carrot}
          </button>
          <button className="px-4 py-2 bg-pink-500 text-white rounded font-medium hover:bg-pink-600 transition" onClick={makeAegyo}>Aegyo</button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-3 text-sm">🎬 Horse Animations</h3>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={makeEat}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition font-medium"
            >
              🍽️ Eat
            </button>
            <button
              onClick={makeBlink}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition font-medium"
            >
              👁️ Blink
            </button>
            <button
              onClick={makeHeadTilt}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition font-medium"
            >
              🤔 Head Tilt
            </button>
            <button
              onClick={makeCloseEyes}
              className="px-3 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition font-medium"
            >
              😴 Close Eyes
            </button>
            <button
              onClick={makeHungry}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition font-medium"
            >
              😫 Hungry
            </button>
            <button
              onClick={makeHurt}
              className="px-3 py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition font-medium"
            >
              😢 Hurt
            </button>
            <button
              onClick={makeCute}
              className="px-3 py-2 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 transition font-medium"
            >
              ✨ Cute
            </button>
            <button
              onClick={makeBrushed}
              className="px-3 py-2 bg-indigo-500 text-white text-sm rounded hover:bg-indigo-600 transition font-medium"
            >
              💇 Brushed
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => buyFood('corn', 5)}
              disabled={coins < foodTypes.corn.price * 5}
              className={`p-3 rounded border-2 transition ${
                coins >= foodTypes.corn.price * 5
                  ? 'border-yellow-400 bg-yellow-50 hover:bg-yellow-100 cursor-pointer'
                  : 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl">🌾</div>
              <div className="text-sm font-semibold">Corn x5</div>
              <div className="text-xs text-gray-600">FREE</div>
            </button>
            <button
              onClick={() => buyFood('carrot', 2)}
              disabled={coins < foodTypes.carrot.price * 2}
              className={`p-3 rounded border-2 transition ${
                coins >= foodTypes.carrot.price * 2
                  ? 'border-orange-400 bg-orange-50 hover:bg-orange-100 cursor-pointer'
                  : 'border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed'
              }`}
            >
              <div className="text-2xl">🥕</div>
              <div className="text-sm font-semibold">Carrot x2</div>
              <div className="text-xs text-gray-600">💰 {foodTypes.carrot.price * 2}</div>
            </button>
          </div>
          
          <div className="mt-3 p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded border-2 border-purple-300">
            <div className="text-xs font-semibold mb-2">💱 Exchange Gems to Coins</div>
            <div className="text-xs mb-2 text-gray-700">1 💎 = 500 💰</div>
            <button
              onClick={() => buyCoinsWithGems(1)}
              disabled={gems < 1}
              className={`w-full p-2 rounded font-medium text-sm transition ${
                gems >= 1
                  ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-white hover:from-purple-500 hover:to-blue-500'
                  : 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
              }`}
            >
              Trade 1 💎 for 500 💰
            </button>
          </div>

          <div className="mt-3 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded border-2 border-green-300">
            <div className="text-xs font-semibold mb-2">💳 Buy Gems with Money</div>
            <div className="text-xs mb-2 text-gray-700">$1 = 100 💎</div>
            <button
              onClick={() => buyGemsWithMoney(1)}
              className="w-full p-2 rounded font-medium text-sm transition bg-gradient-to-r from-green-400 to-emerald-400 text-white hover:from-green-500 hover:to-emerald-500"
            >
              Pay $1 for 100 💎
            </button>
          </div>
        </div>

        <Shop 
          coins={coins}
          upgrades={upgrades}
          ownedHouses={ownedHouses}
          currentHouseStyle={house.styleId}
          housePrices={housePrices}
          canBuyHouse={canBuyHouse}
          buyHouse={buyHouse}
          switchHouse={switchHouse}
          canUpgradeTrough={canUpgradeTrough}
          performTroughUpgrade={performTroughUpgrade}
          getUpgradeCost={getUpgradeCost}
          getHousePrice={getHousePrice}
          maxTroughLevel={maxTroughLevel}
        />
      </main>

      <footer className="mt-6 text-xs text-gray-500">Built: lightweight demo with assets & upgrade system</footer>

      <section className="mt-6 p-4 bg-white rounded shadow">
        <h2 className="text-sm font-semibold mb-2">Horse statistics</h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>Hunger: <span className="font-medium">{horse.stats.hunger}</span></div>
          <div>Sleepy: <span className="font-medium">{horse.stats.sleepy.toFixed(1)}</span></div>
          <div>Dizzy: <span className="font-medium">{horse.stats.dizzy}</span></div>
          <div>Bored: <span className="font-medium">{horse.stats.bored}</span></div>
          <div>Hurt: <span className="font-medium">{horse.stats.hurt}</span></div>
          <div>Animation: <span className="font-medium">{horse.animation}</span></div>
        </div>
      </section>
    </div>
  )
}
