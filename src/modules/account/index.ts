import { Context, Effect, Layer } from "effect";
import type { IBankItems } from "./types.js";
import { HttpClient, HttpClientRequest } from "@effect/platform";
import { NodeHttpClient } from "@effect/platform-node";
import type { HttpClientError } from "@effect/platform/HttpClientError";

export class AccountInfo extends Context.Tag("AccountInfo")<
  AccountInfo,
  {
    getBankDetails: () => Effect.Effect<any, HttpClientError>;
    getBankItems: () => Effect.Effect<IBankItems>;
  }
>() {}

export const AccountInfoLive = Layer.effect(
  AccountInfo,
  Effect.gen(function* () {
    const client = yield* HttpClient.HttpClient;

    return {
      getBankDetails: () =>
        Effect.gen(function* () {
          const request = HttpClientRequest.get("https://jsonplaceholder.typicode.com/users/1");

          const response = yield* client.execute(request);

          return yield* response.json;
        }),
      getBankItems: () => {
        return {} as any;
      },
    };
  }),
);

export const AccountMainLive = AccountInfoLive.pipe(Layer.provide(NodeHttpClient.layer));
