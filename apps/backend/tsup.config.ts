import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "../../packages/shared/index.ts"],
  format: ["esm"], // Ensure ESM format
  outDir: "dist",
  target: "node20",
  sourcemap: false,
  splitting: false,
  clean: true, // Clears old builds
  bundle: true,
  minify: true,
  external: [],
  noExternal: ["shared"],
});
