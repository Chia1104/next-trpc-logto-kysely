import * as z from "zod";
import { Status } from "@/server/db/enums";

const createTodoSchema = z.object({
  userId: z.string().optional(),
  title: z.string().min(1).max(100),
  description: z.string().max(1000).optional(),
});

type CreateTodo = z.infer<typeof createTodoSchema>;

const updateTodoSchema = z.object({
  userId: z.string().optional(),
  id: z.string(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  status: z.enum([Status.COMPLETED, Status.UNCOMPLETED]).optional(),
});

type UpdateTodo = z.infer<typeof updateTodoSchema>;

export { createTodoSchema, updateTodoSchema, type CreateTodo, type UpdateTodo };
