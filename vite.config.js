import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "public",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
    emptyOutDir: true,
  },
});
