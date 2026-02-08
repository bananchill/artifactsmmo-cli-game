import { HttpClient, HttpClientRequest } from "@effect/platform";
import { GameConfig } from "../../config/config.js";
import { Context, Effect, Layer } from "effect";
import type { ConfigError } from "effect/ConfigError";
import { NodeHttpClient } from "@effect/platform-node";
import type { HttpClientError } from "@effect/platform/HttpClientError";

interface IHttpResponse<T> {
  data: T;
}

export class HttpApiClient extends Context.Tag("HttpApiClient")<
  HttpApiClient,
  {
    readonly get: <ReturnType>(
      prefixUrl: string,
    ) => Effect.Effect<ReturnType, HttpClientError | ConfigError>;
    readonly post: <ReturnType>(
      prefixUrl: string,
      params?: any,
    ) => Effect.Effect<ReturnType, HttpClientError | ConfigError>;
  }
>() {}

const HttpApiClientLive = Layer.effect(
  HttpApiClient,
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;

    return {
      get: <ReturnType>(prefixUrl: string) =>
        Effect.gen(function* () {
          const gameConfig = yield* GameConfig;
          const request = HttpClientRequest.get(`${gameConfig.url}${prefixUrl}`, {
            headers: {
              authorization: `Bearer ${gameConfig.gameToken}`,
            },
          });
          const response = yield* client.execute(request);
          const json = (yield* response.json) as IHttpResponse<ReturnType>;

          return json.data;
        }),
      post: <ReturnType>(prefixUrl: string, params: any = {}) =>
        Effect.gen(function* () {
          const gameConfig = yield* GameConfig;
          const request = HttpClientRequest.post(`${gameConfig.url}${prefixUrl}`, {
            headers: {
              accept: "application/json",
              authorization: `Bearer ${gameConfig.gameToken}`,
              "content-type": "application/json",
            },
          });

          const response = yield* client.execute(request);
          const json = (yield* response.json) as IHttpResponse<ReturnType>;
          return json.data;
          // .pipe(
          //   HttpClientRequest.setHeaders({
          //     "Content-Type": "application/json",
          //     Accept: "application/json",
          //     Authorization: `Bearer ${gameConfig.gameToken}`,
          //   }),
          // );
        }),
    };
  }),
);

export const HttpApiClientMainLive = HttpApiClientLive.pipe(Layer.provide(NodeHttpClient.layer));
