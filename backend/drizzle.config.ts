import { defineConfig } from "drizzle-kit";
import { ENV } from "./src/config/env";

export default defineConfig({
  schema: "./src/db/schema.ts", // where your schema files are, in relation to this file
  out: "./src/db/migrations", // where migration files are generated. 
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL!
  }
}); 