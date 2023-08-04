import { loggerLink, httpBatchLink } from "@trpc/client";
import { experimental_createTRPCNextAppDirClient } from "@trpc/next/app-dir/client";
import superjson from "superjson";
import type { AppRouter } from "./root";
import { getBaseUrl } from "@/utils/get-base-url";

export const api = experimental_createTRPCNextAppDirClient<AppRouter>({
  config() {
    return {
      abortOnUnmount: true,
      transformer: superjson,
      links: [
        loggerLink({
          enabled: (opts) =>
            process.env.NODE_ENV === "development" ||
            (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
          url: getBaseUrl() + "/api/trpc",
          headers() {
            return {
              "x-trpc-source": "client",
            };
          },
        }),
      ],
    };
  },
});

export { type RouterInputs, type RouterOutputs } from "./";
