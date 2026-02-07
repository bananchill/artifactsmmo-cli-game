import { Context, Effect, Layer } from "effect";
import type { IBankItems } from "./types.js";
import { HttpClient, HttpClientRequest } from "@effect/platform";
import { NodeHttpClient } from "@effect/platform-node";
import type { HttpClientError } from "@effect/platform/HttpClientError";
import { GameConfig } from "../../config/config.js";
import { requestGet } from "../../common/http/index.js";
import type { ConfigError } from "effect/ConfigError";

export class AccountInfo extends Context.Tag("AccountInfo")<
  AccountInfo,
  {
    getBankDetails: () => Effect.Effect<any, HttpClientError | ConfigError>;
    getBankItems: () => Effect.Effect<IBankItems, HttpClientError | ConfigError>;
  }
>() {}

export const AccountInfoLive = Layer.effect(
  AccountInfo,
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;

    return {
      getBankDetails: () =>
        Effect.gen(function* () {
          const request = yield* requestGet("/my/bank");

          const response = yield* client.execute(request);

          return yield* response.json;
        }),
      getBankItems: () =>
        Effect.gen(function* () {
          const request = yield* requestGet("/my/bank/items");
          const response = yield* client.execute(request);
          return (yield* response.json) as IBankItems;
        }),
    };
  }),
);

export const AccountMainLive = AccountInfoLive.pipe(Layer.provide(NodeHttpClient.layer));
