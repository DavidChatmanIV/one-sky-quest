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
      "@": path.resolve(__dirname, "src"), // Use @ for clean imports
    },
  },
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,
    historyApiFallback: true, //  React Router SPA support

    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
      overlay: false, // Optional: disable full-screen overlay on HMR errors
    },

    proxy: {
      "/api": {
        target: "http://localhost:5000", // ✅ Point to your actual backend port
        changeOrigin: true,
      },
    },
  },
});
