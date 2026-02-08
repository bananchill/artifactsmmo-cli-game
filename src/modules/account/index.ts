import { Context, Effect, Layer } from "effect";
import type { IBankItems } from "./types.js";
import type { HttpClientError } from "@effect/platform/HttpClientError";

import type { ConfigError } from "effect/ConfigError";
import { HttpApiClient, HttpApiClientMainLive } from "../../common/http/index.js";

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
    // Вынести в слой
    const client = yield* HttpApiClient;

    return {
      getBankDetails: () =>
        Effect.gen(function* () {
          const result = yield* client.get<any>("/my/bank");
          return result;
        }),
      getBankItems: () =>
        Effect.gen(function* () {
          const result = yield* client.get<IBankItems>("/my/bank/items");
          return result;
        }),
    };
  }),
);

export const AccountMainLive = AccountInfoLive.pipe(Layer.provide(HttpApiClientMainLive));
