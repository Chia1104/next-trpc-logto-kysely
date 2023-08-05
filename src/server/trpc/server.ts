"use server";

import { loggerLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirServer } from "@trpc/next/app-dir/server";
import { experimental_nextHttpLink } from "@trpc/next/app-dir/links/nextHttp";
import superjson from "superjson";
import type { AppRouter } from "./root";
import { getBaseUrl } from "@/utils/get-base-url";
import { cookies } from "next/headers";

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
        experimental_nextHttpLink({
          batch: true,
          url: getBaseUrl({ isServer: true }) + "/api/trpc",
          headers() {
            return {
              cookie: cookies().toString(),
              "x-trpc-source": "rsc-http",
            };
          },
        }),
      ],
    };
  },
});

export { type RouterInputs, type RouterOutputs } from "./";
