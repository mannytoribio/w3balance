import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import inject from "@rollup/plugin-inject"
import { nodePolyfills } from "vite-plugin-node-polyfills"

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      "@": "/src",
      stream: "rollup-plugin-node-polyfills/polyfills/stream",
      events: "rollup-plugin-node-polyfills/polyfills/events",
      assert: "assert",
      crypto: "crypto-browserify",
      util: "util",
      "near-api-js": "near-api-js/dist/near-api-js.js",
    },
  },
  define: {
    "process.env": process.env ?? {},
    global: {},
  },
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    outDir: "build",
    rollupOptions: {
      plugins: [
        // nodePolyfills({ crypto: true }),
        inject({ Buffer: ["buffer", "Buffer"] }),
      ],
    },
  },
  // optimizeDeps: {
  //   esbuildOptions: {
  //     define: {
  //       global: 'globalThis',
  //     },
  //     plugins: [
  //       NodeGlobalsPolyfillPlugin({
  //         buffer: true,
  //       }),
  //     ],
  //   },
  // },
})
