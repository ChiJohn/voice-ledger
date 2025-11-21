import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const base = process.env.VITE_BASE || '/voice-ledger/'

export default defineConfig({
  plugins: [vue()],
  base
})