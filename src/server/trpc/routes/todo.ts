import * as z from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { createTodoSchema, updateTodoSchema } from "@/utils/validators";
import { genId } from "@/server/db/nanoid";
import type { DB } from "@/server/db";
import type { ValueExpression } from "kysely";

export const todoRouter = createTRPCRouter({
  create: protectedProcedure.input(createTodoSchema).mutation(async (opts) => {
    const userId = opts.ctx.auth.userId ?? opts.input.userId;
    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      });
    }
    void (await opts.ctx.db
      .insertInto("Todo")
      .values({
        id: ("todo_" + genId()) as ValueExpression<DB, "Todo", string>,
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
    .input(
      z
        .object({ userId: z.string().optional(), id: z.string().optional() })
        .optional()
    )
    .query(async (opts) => {
      const userId = opts.ctx.auth.userId ?? opts.input?.userId;
      const id = opts.input?.id as ValueExpression<DB, "Todo", string>;
      if (!userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Unauthorized",
        });
      }
      const baseQuery = opts.ctx.db
        .selectFrom("Todo")
        .select(["id", "title", "description", "status"]);
      const query = id
        ? baseQuery.where(({ eb, and }) =>
            and([eb("userId", "=", userId), eb("id", "=", id)])
          )
        : baseQuery.where(({ eb, and }) => and([eb("userId", "=", userId)]));
      const todos = await query.execute();
      return {
        status: "success",
        data: todos,
      };
    }),
  update: protectedProcedure.input(updateTodoSchema).mutation(async (opts) => {
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
