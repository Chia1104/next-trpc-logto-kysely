import { type NextRequest } from "next/server";

import { logtoClientEdge } from "@/server/logto/logto-client";

// export const runtime = "edge";

export async function GET(request: NextRequest) {
  return await logtoClientEdge.handleSignOut()(request);
}
