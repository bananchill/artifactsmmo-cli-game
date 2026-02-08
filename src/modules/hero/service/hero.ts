import type { HttpClientError } from "@effect/platform/HttpClientError";
import { Context, Effect, Layer, pipe } from "effect";
import type { ConfigError } from "effect/ConfigError";

import type { IHero } from "../types/index.js";
import { HttpApiClient, HttpApiClientMainLive } from "../../../common/http/index.js";

export class HeroService extends Context.Tag("HeroService")<
  HeroService,
  {
    readonly move: () => Effect.Effect<number>;
    readonly fight: (hero: IHero) => Effect.Effect<any, HttpClientError | ConfigError>;
    readonly getInfo: () => Effect.Effect<IHero[], HttpClientError | ConfigError>;
    readonly craft: () => Effect.Effect<number>;
  }
>() {}

export const HeroLive = Layer.effect(
  HeroService,
  Effect.gen(function* () {
    const client = yield* HttpApiClient;
    // Вынести в слой

    return {
      move: () => {
        return Effect.succeed(1);
      },
      fight: (hero: IHero) =>
        Effect.gen(function* () {
          const result = yield* client.post(`/my/${hero.name}/action/fight`);
          console.log(JSON.stringify(result, null, 2));
        }),
      // pipe(
      // Fight(hero.name)
      //   Effect.flatMap((request) => {}
      //     Effect.tap(client.execute(request), (res) =>
      //       Effect.sync(() => console.log(JSON.stringify(res, null, 2))),
      //     ),
      //   ),
      // ),
      getInfo: () =>
        Effect.gen(function* () {
          return yield* client.get<IHero[]>(`/my/characters`);
        }),
      craft: () => {
        return Effect.succeed(1);
      },
    };
  }),
);

export const HeroMainLive = HeroLive.pipe(Layer.provide(HttpApiClientMainLive));
