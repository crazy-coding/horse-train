import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config with React plugin for fast refresh
export default defineConfig({
	plugins: [react()],
})
