import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use '/' for Vercel/CodeSandbox, '/CREDIFLOW/' only for GitHub Pages
  base: process.env.GITHUB_PAGES ? '/CREDIFLOW/' : '/',
})
