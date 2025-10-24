import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // e.g. import x from "@/components/x"
    },
  },

  server: {
    host: "localhost",
    port: 5173,
    strictPort: true,

    // Vite already does SPA fallback by default; no need for historyApiFallback.
    hmr: {
      protocol: "ws",
      host: "localhost",
      port: 5173,
      overlay: false, // optional
    },

    proxy: {
      "/api": {
        target: "http://localhost:5000", // your backend
        changeOrigin: true,
      },
    },
    open: true,
  },

  build: {
    // Put the production build one level up (frontend/dist)
    outDir: path.resolve(__dirname, "../dist"),
    emptyOutDir: true,
  },
});
