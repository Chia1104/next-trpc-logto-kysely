import "server-only";
import { type LogtoContext } from "@logto/next";
import { cookies } from "next/headers";
import { getBaseUrl } from "@/utils/get-base-url";

export async function fetchUser() {
  const response = await fetch(`${getBaseUrl()}/api/logto/user`, {
    cache: "no-store",
    headers: {
      cookie: cookies().toString(),
    },
  });

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  return (await response.json()) as LogtoContext;
}
