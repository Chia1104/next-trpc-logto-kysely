import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter, createTRPCContext } from "@/server/trpc";

const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    // @ts-ignore
    createContext: createTRPCContext,
    router: appRouter,
  });
};

export { handler as GET, handler as POST };
