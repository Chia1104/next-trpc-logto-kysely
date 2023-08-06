import { env } from "@/env.mjs";

interface Options {
  isServer?: boolean;
}

export const getBaseUrl = (opts?: Options): string => {
  opts ??= {};
  const { isServer } = opts;
  if (typeof window !== "undefined" && !isServer) {
    return "";
  }
  if (env.ZEABUR_URL) {
    return `https://${env.ZEABUR_URL}`;
  }

  if (env.RAILWAY_URL) {
    return `https://${env.RAILWAY_URL}`;
  }

  if (env.VERCEL_URL) {
    return `https://${env.VERCEL_URL}`;
  }

  return (env.BASE_URL as string) ?? `http://localhost:${env.PORT}`;
};
