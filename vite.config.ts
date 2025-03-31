import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "automation-create-vue-route-plugin",
      fileName: (format) => `index.${format}.js`,
    },
  },
});