"use server";

import { api as serverApi } from "@/server/trpc/server";

export const revalidate = async () => {
  void (await serverApi.todo.read.revalidate());
};
