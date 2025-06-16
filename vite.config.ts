import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api/chat': {
        target: 'https://api.novita.ai/v3/openai/chat/completions',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/chat/, ''),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
