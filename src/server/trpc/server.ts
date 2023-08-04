"use server";

import { loggerLink, httpBatchLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import superjson from "superjson";
import type { AppRouter } from "./root";
import { getBaseUrl } from "@/utils/get-base-url";
import { headers } from "next/headers";

export const api = experimental_createTRPCNextAppDirServer<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: getBaseUrl({ isServer: true }) + "/api/trpc",
          headers() {
            return {
              ...Object.fromEntries(headers()),
              "x-trpc-source": "rsc",
            };
          },
        }),
      ],
    };
  },
});

export { type RouterInputs, type RouterOutputs } from "./";
