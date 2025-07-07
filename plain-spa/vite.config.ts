import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    hmr: false, // Disabled because with this true, the app hard reloads after each HTTP call. Only happens when Tailwind is used. Can comment out index.css to resolve.
  },
});
