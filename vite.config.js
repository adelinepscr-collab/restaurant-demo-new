import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves this app under /restaurant-demo/, so only use that
  // base path in the GitHub Actions build. Other hosts (Vercel, local dev)
  // serve it at the domain root.
  base: process.env.GITHUB_ACTIONS ? '/restaurant-demo/' : '/',
})
