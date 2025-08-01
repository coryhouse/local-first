import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteTsConfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"

const config = defineConfig({
  plugins: [
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: [`./tsconfig.json`],
    }),
    tailwindcss(),
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
  ],
})

export default config
