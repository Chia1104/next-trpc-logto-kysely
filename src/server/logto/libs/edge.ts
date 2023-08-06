/* eslint-disable */

import { type GetContextParameters, type InteractionMode } from "@logto/node";
// @ts-ignore
import NodeClient from "@logto/node/edge";
import { getIronSession } from "iron-session/edge";
import { type NextRequest } from "next/server";

import BaseClient from "./client";
import type { LogtoNextConfig } from "./types";

export type { LogtoContext, InteractionMode } from "@logto/node";

import { env } from "@/env.mjs";
import { getBaseUrl } from "@/utils/get-base-url";

export default class LogtoClient extends BaseClient {
  constructor(config: LogtoNextConfig) {
    super(config, {
      NodeClient,
    });
  }

  handleSignIn =
    (
      redirectUri = `${this.config.baseUrl}/api/logto/sign-in-callback`,
      interactionMode?: InteractionMode
    ) =>
    async (request: NextRequest) => {
      const response = new Response(null, {
        status: 307,
      });
      const session = await getIronSession(
        request,
        response,
        this.ironSessionConfigs
      );

      const nodeClient = this.createNodeClient(session);
      await nodeClient.signIn(redirectUri, interactionMode);
      await this.storage?.save();

      if (this.navigateUrl) {
        response.headers.append("Location", this.navigateUrl);
      }

      return response;
    };

  handleSignOut =
    (redirectUri = this.config.baseUrl) =>
    async (request: NextRequest) => {
      const response = new Response(null, {
        status: 307,
      });
      const session = await getIronSession(
        request,
        response,
        this.ironSessionConfigs
      );

      const nodeClient = this.createNodeClient(session);
      await nodeClient.signOut(redirectUri);
      session.destroy();
      await this.storage?.save();

      if (this.navigateUrl) {
        response.headers.append("Location", this.navigateUrl);
      }

      return response;
    };

  handleSignInCallback =
    (redirectTo = this.config.baseUrl) =>
    async (request: NextRequest) => {
      const response = new Response(null, {
        status: 307,
        headers: {
          Location: redirectTo,
        },
      });
      const session = await getIronSession(
        request,
        response,
        this.ironSessionConfigs
      );

      const nodeClient = this.createNodeClient(session);

      /**
       * we don't trust the hostname from the request header,
       * so we replace it if it's(nextUrl, url) from localhost in production
       */
      if (
        request.nextUrl.href &&
        request.nextUrl.href.includes(`http://localhost:${env.PORT}`) &&
        (env.RAILWAY_URL || env.ZEABUR_URL)
      ) {
        const url = new URL(
          request.nextUrl.href.replace(
            /http:\/\/(localhost|railway):(\d+)/,
            getBaseUrl({ isServer: true })
          )
        );
        console.log("replace url", url.toString());
        await nodeClient.handleSignInCallback(url.toString());
        await this.storage?.save();
      } else if (request.url) {
        console.log("request.url", request.url);
        await nodeClient.handleSignInCallback(request.url);
        await this.storage?.save();
      }

      return response;
    };

  handleUser =
    (configs?: GetContextParameters) => async (request: NextRequest) => {
      const context = await this.getLogtoContext(request, configs);
      return new Response(JSON.stringify(context), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    };

  getLogtoContext = async (
    request: NextRequest,
    config: GetContextParameters = {}
  ) => {
    const session = await getIronSession(
      request,
      new Response(),
      this.ironSessionConfigs
    );
    const context = await this.getLogtoUserFromRequest(session, config);

    return context;
  };
}
