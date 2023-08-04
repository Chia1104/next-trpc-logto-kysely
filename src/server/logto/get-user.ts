import "server-only";
import { logtoClient } from "@/server/logto/logto-client";
import { type NextRequest } from "next/server";

export async function getUser(request: NextRequest) {
  return await logtoClient.getLogtoContext(request);
}
