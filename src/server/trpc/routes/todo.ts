import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { Status } from "@/server/db/enums";
import { TRPCError } from "@trpc/server";

/**
 * @TODO
 */
export const todoRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        title: z.string().min(1).max(100),
        description: z.string().max(1000),
      })
    )
    .mutation(async (opts) => {
      const userId = opts.ctx.auth.userId ?? opts.input.userId;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      void (await opts.ctx.db
        .insertInto("Todo")
        .values({
          userId,
          title: opts.input.title,
          description: opts.input.description,
        })
        .execute());
      return {
        status: "success",
      };
    }),
  read: protectedProcedure
    .input(z.object({ userId: z.string().optional() }).optional())
    .query(async (opts) => {
      const userId = opts.ctx.auth.userId ?? opts.input?.userId;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const query = opts.ctx.db
        .selectFrom("Todo")
        .select(["id", "title", "description", "status"])
        .where(({ cmpr, and }) => and([cmpr("userId", "=", userId)]));
      const todos = await query.execute();
      // if (!todos.length) {
      //   throw new TRPCError({
      //     code: "NOT_FOUND",
      //     message: "Todos not found",
      //   });
      // }
      return {
        status: "success",
        data: todos,
      };
    }),
  update: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        id: z.string(),
        title: z.string().min(1).max(100),
        description: z.string().max(1000),
        status: z.enum([Status.COMPLETED, Status.UNCOMPLETED]),
      })
    )
    .mutation(async (opts) => {
      void (await opts.ctx.db
        .updateTable("Todo")
        .set({
          title: opts.input.title,
          description: opts.input.description,
          status: opts.input.status,
        })
        .where("id", "=", opts.input.id)
        .execute());
      return {
        status: "success",
      };
    }),
  delete: protectedProcedure
    .input(z.object({ userId: z.string(), id: z.string() }))
    .mutation(async (opts) => {
      void (await opts.ctx.db
        .deleteFrom("Todo")
        .where("id", "=", opts.input.id)
        .execute());
      return {
        status: "success",
      };
    }),
});
