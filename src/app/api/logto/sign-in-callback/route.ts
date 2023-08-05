import { type NextRequest } from "next/server";
import { env } from "@/env.mjs";
import { getBaseUrl } from "@/utils/get-base-url";
import { redirect } from "next/navigation";
import { logtoClientEdge } from "@/server/logto/logto-client";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  // rewrite the url to replace localhost:3000 with foo.zeabur.app
  // this is needed because the callback url is set to localhost:3000 in docker
  // and we need to redirect to foo.zeabur.app
  if (
    env.NODE_ENV === "production" &&
    request.url.toString().includes(`http://localhost:${env.PORT}`)
  ) {
    redirect(
      request.url
        .toString()
        .replace(`http://localhost:${env.PORT}`, getBaseUrl({ isServer: true }))
    );
  }
  return await logtoClientEdge.handleSignInCallback()(request);
}
