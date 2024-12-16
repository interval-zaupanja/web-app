import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

console.log("vite.config.js process.env.NODE_ENV:", process.env.NODE_ENV)

// https://vitejs.dev/config/
const path = require("path");
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production'
    ? '/web-app/'  // Base URL for production
    : '/',         // Base URL for development
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'], // added so imports of single file components do not need to end with .vue
    // "While this works, it should be avoided if at all possible. Why? Because according to the Vite docs: "Note it is NOT recommended to omit extensions for custom import types (e.g. .vue) since it can interfere with IDE and type support.""
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});