import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// 📍 Enable __dirname with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // 🔗 Use @ to import from /src
    },
  },
  server: {
    hmr: {
      overlay: false, // 🔧 Optional: disable full-screen error overlay
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000", // 🔌 Backend API proxy
        changeOrigin: true,
      },
    },
    historyApiFallback: true, 
  },
});
