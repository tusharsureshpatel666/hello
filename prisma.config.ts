import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

// Load variables from .env
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: process.env.DATABASE_URL!, // <-- dotenv works here
  },
});
