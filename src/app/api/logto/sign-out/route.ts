import { type NextRequest } from "next/server";

import { logtoClient } from "@/server/logto/logto-client";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return await logtoClient.handleSignOut()(request);
}
