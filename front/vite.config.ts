import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.GITHUB_PAGES ? "/" : "/"; // baseの設定

console.log(`Using base: ${base}`); // baseの値をログに出力

export default defineConfig({
  plugins: [react()],
  base: base,
  build: {
    outDir: "dist", // ビルド出力先
  },
});
