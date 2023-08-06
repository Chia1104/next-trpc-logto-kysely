import LogtoClient, { type LogtoContext } from "@logto/next/edge";
import { env } from "@/env.mjs";
import { getBaseUrl } from "@/utils/get-base-url";
import LogtoClientOverride from "./libs/edge";

export const logtoClientEdge = new LogtoClient({
  appId: env.LOGTO_APP_ID,
  appSecret: env.LOGTO_APP_SECRET,
  endpoint: env.LOGTO_ENDPOINT,
  baseUrl: getBaseUrl(),
  cookieSecret: env.LOGTO_COOKIE_SECRET,
  cookieSecure: env.LOGTO_COOKIE_SCURE,
});

export const logtoClientOverride = new LogtoClientOverride({
  appId: env.LOGTO_APP_ID,
  appSecret: env.LOGTO_APP_SECRET,
  endpoint: env.LOGTO_ENDPOINT,
  baseUrl: getBaseUrl(),
  cookieSecret: env.LOGTO_COOKIE_SECRET,
  cookieSecure: env.LOGTO_COOKIE_SCURE,
});

export { LogtoContext };
