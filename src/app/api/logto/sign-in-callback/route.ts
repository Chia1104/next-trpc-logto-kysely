import { type NextRequest } from "next/server";

import { logtoClientOverride } from "@/server/logto/logto-client";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  return await logtoClientOverride.handleSignInCallback()(request);
}
