import "server-only";
import { type LogtoContext } from "@logto/next";
import { cookies } from "next/headers";
import { getBaseUrl } from "@/utils/get-base-url";

export async function getUser() {
  const response = await fetch(
    `${getBaseUrl({
      isServer: true,
    })}/api/logto/user`,
    {
      cache: "no-store",
      headers: {
        cookie: cookies().toString(),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }

  const user = (await response.json()) as LogtoContext;

  return user;
}
