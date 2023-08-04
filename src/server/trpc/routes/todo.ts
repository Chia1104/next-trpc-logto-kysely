import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

/**
 * @TODO
 */
export const todoRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      })
    )
    .query(() => {
      return "hello Kysely";
    }),
});
