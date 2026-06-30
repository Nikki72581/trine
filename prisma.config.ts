import { configDotenv } from "dotenv";

// Load .env.local first (Next.js convention), then fall back to .env
configDotenv({ path: ".env.local" });
configDotenv({ path: ".env" });

import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("PRISMA_DATABASE_URL"),
  },
});
