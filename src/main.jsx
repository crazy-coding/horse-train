import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './tailwind.css'
import './index.css'
import { SoundProvider } from './context/SoundContext'
import { AssetProvider } from './context/AssetContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SoundProvider>
      <AssetProvider>
        <App />
      </AssetProvider>
    </SoundProvider>
  </React.StrictMode>
)
