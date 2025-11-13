import React, { createContext, useContext, useEffect, useState } from 'react'

const AssetContext = createContext(null)

export function AssetProvider({ children }){
  const [manifest, setManifest] = useState(null)
  useEffect(()=>{
    let mounted = true
    fetch('/assets/asset-manifest.json').then(r=>{
      if(!r.ok) throw new Error('no manifest')
      return r.json()
    }).then(json=>{ if(mounted) setManifest(json) }).catch(()=>{})
    return ()=> { mounted = false }
  }, [])

  const get = (category, name) => {
    if(!manifest) return null
    if(!category) return manifest[name] || null
    const cat = manifest[category]
    if(!cat) return null
    return cat[name] || null
  }

  return (
    <AssetContext.Provider value={{ manifest, get }}>
      {children}
    </AssetContext.Provider>
  )
}

export function useAssets(){
  const ctx = useContext(AssetContext)
  if(!ctx) throw new Error('useAssets must be used inside AssetProvider')
  return ctx
}

export default AssetContext
