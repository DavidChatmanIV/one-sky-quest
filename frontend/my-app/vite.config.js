import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

/* ----------------------------------------
   Path helpers (ESM safe)
----------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ----------------------------------------
   Vite Config
----------------------------------------- */
export default defineConfig({
  plugins: [react()],

  /* ----------------------------------------
     Aliases
  ----------------------------------------- */
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },

  /* ----------------------------------------
     Dev Server (LOCAL ONLY)
  ----------------------------------------- */
  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,

    hmr: {
      overlay: false,
    },

    proxy: {
      "/api": {
        // ✅ Use your backend port here (pick the one your backend is actually running on)
        // If your backend is on 5000, keep 5000.
        // If your backend is on 5050, change it to 5050.
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  /* ----------------------------------------
     Production Build (Vercel)
  ----------------------------------------- */
  build: {
    outDir: "dist", // ✅ REQUIRED for Vercel
    emptyOutDir: true,
    sourcemap: false,
  },
});