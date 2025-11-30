import { defineConfig } from "vite";

// https://vitejs.dev/config
export default defineConfig({
  build: {
    target: "node18",
    ssr: true,
    lib: {
      entry: "src/main.ts",
      formats: ["es"], // only output ES module format
    },
    rollupOptions: {
      external: ["node-llama-cpp", /^@node-llama-cpp\//],
    },
  },
});
