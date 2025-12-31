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

    // 🔒 Rare port to avoid conflicts permanently
    port: 5273,
    strictPort: true,

    // Clean dev UX
    hmr: {
      overlay: false,
    },

    // API proxy → backend
    proxy: {
      "/api": {
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
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
});