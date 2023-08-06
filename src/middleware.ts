import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/env.mjs";
import { getBaseUrl } from "@/utils/get-base-url";

export const config = {
  matcher: ["/api/logto/sign-in-callback"],
};

export default function middleware(req: NextRequest) {
  if (
    (env.RAILWAY_URL || env.ZEABUR_URL) &&
    req.url.toString().includes(`http://localhost:${env.PORT}`)
  ) {
    return NextResponse.rewrite(
      new URL(req.nextUrl.pathname, getBaseUrl({ isServer: true }))
    );
  }
}
