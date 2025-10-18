import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "src/lib/api/openapi.json",
  output: "src/lib/api",
  plugins: [{ name: "zod", strictOptionals: true }],
});
