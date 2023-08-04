import { createTRPCRouter } from "./trpc";
import { todoRouter } from "./routes/todo";
import { exampleRouter } from "./routes/example";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  todo: todoRouter,
  example: exampleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
