"use server";

import { createAction, protectedProcedure } from "@/server/trpc/trpc";
import { updateTodoSchema } from "@/utils/validators";

export const updateStatusAction = createAction(
  protectedProcedure.input(updateTodoSchema).mutation(async (opts) => {
    // delay 5 s (test useOptimistic)
    // await new Promise((resolve) => setTimeout(resolve, 5000));

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
  })
);
