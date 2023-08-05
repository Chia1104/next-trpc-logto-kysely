import { type NextRequest } from "next/server";

import { logtoClientEdge } from "@/server/logto/logto-client";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  console.log(
    "sign-in-callback/route.ts: GET - ",
    "url: ",
    request.url.toString(),
    "nextUrl: ",
    request.nextUrl.toString(),
    "headers['host']: ",
    request.headers.get("host")
  );
  return await logtoClientEdge.handleSignInCallback()(request);
}
