import LogtoClient, { type LogtoContext } from "@logto/next";
import { env } from "@/env.mjs";
import { getBaseUrl } from "@/utils/get-base-url";

export const logtoClient = new LogtoClient({
  appId: env.LOGTO_APP_ID,
  appSecret: env.LOGTO_APP_SECRET,
  endpoint: env.LOGTO_ENDPOINT,
  baseUrl: getBaseUrl({
    isServer: true,
  }),
  cookieSecret: env.LOGTO_COOKIE_SECRET,
  cookieSecure: env.LOGTO_COOKIE_SCURE,
});

export { LogtoContext };
