import { z } from "zod";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.string().default("3000"),
    VERCEL_URL: z.string().optional(),
    ZEABUR_URL: z.string().optional(),
    LOGTO_ENDPOINT: z.string().min(1),
    LOGTO_APP_ID: z.string().min(1),
    LOGTO_APP_SECRET: z.string().min(1),
    LOGTO_COOKIE_SECRET: z.string().min(1),
    LOGTO_COOKIE_SCURE: z
      .boolean()
      .optional()
      .default(process.env.NODE_ENV === "production"),
    POSTGRES_HOST: z.string().optional().default("localhost"),
    POSTGRES_PORT: z.string().optional().default("5432"),
    POSTGRES_USERNAME: z.string().optional().default("postgres"),
    POSTGRES_PASSWORD: z.string().optional().default("postgres"),
    POSTGRES_DATABASE: z.string().optional().default("postgres"),
    DATABASE_URL: z
      .string()
      .optional()
      .default(
        `postgres://${process.env.POSTGRES_USERNAME}:${
          process.env.POSTGRES_PASSWORD
        }@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${
          process.env.POSTGRES_DATABASE || "postgres"
        }`
      ),
  },

  client: {},
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    VERCEL_URL: process.env.VERCEL_URL,
    ZEABUR_URL: process.env.ZEABUR_URL,
    LOGTO_ENDPOINT: process.env.LOGTO_ENDPOINT,
    LOGTO_APP_ID: process.env.LOGTO_APP_ID,
    LOGTO_APP_SECRET: process.env.LOGTO_APP_SECRET,
    LOGTO_COOKIE_SECRET: process.env.LOGTO_COOKIE_SECRET,
    LOGTO_COOKIE_SCURE: process.env.LOGTO_COOKIE_SCURE,
    POSTGRES_HOST: process.env.POSTGRES_HOST,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_USERNAME: process.env.POSTGRES_USERNAME,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
    DATABASE_URL: process.env.DATABASE_URL,
  },
});
