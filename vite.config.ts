import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 3000,
    proxy: {
      // Proxy all /api requests to the backend server
      "/api": {
        target: "http://localhost:5175",
        changeOrigin: true,
      },
    },
  },
});
