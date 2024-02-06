import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
const c = defineConfig({
  plugins: [svelte()],
  base: "/rvmm-config-gen/",
  build: {
    outDir: 'docs'
  }
});

export default c
