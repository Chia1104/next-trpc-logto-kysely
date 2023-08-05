import "server-only";
import { logtoClientEdge } from "@/server/logto/logto-client";
import { type NextRequest } from "next/server";

export async function getUser(request: NextRequest) {
  return await logtoClientEdge.getLogtoContext(request);
}
