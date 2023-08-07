import type { NextRequest } from "next/server";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";
import { db, type Kysely, type DB } from "@/server/db";
import { type LogtoContext } from "../logto/logto-client";
import { getUser } from "../logto/get-user";
import { fetchUser } from "@/server/logto/fetch-user";
import { experimental_createServerActionHandler } from "@trpc/next/app-dir/server";
import { headers } from "next/headers";

interface CreateContextOptions {
  auth: LogtoContext | null;
  db: Kysely<DB>;
  headers?: Headers;
}

export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const auth = await getUser(opts?.req);

  return {
    auth,
    db,
    headers: opts?.req?.headers,
  } satisfies CreateContextOptions;
};

export const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.isAuthenticated) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      auth: {
        ...ctx.auth,
        userId: ctx.auth.claims?.sub,
      },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const createAction = experimental_createServerActionHandler(t, {
  createContext: async () => {
    const auth = await fetchUser();

    return {
      auth,
      db,
      headers: headers(),
    } satisfies CreateContextOptions;
  },
});
