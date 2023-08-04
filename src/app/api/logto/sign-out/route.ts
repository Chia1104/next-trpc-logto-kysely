import { type NextRequest } from "next/server";

import { logtoClient } from "@/server/logto/logto-client";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  // @ts-expect-error logto??
  return await logtoClient.handleSignInCallback()(request);
}
