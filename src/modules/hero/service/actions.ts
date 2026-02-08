import { Context, Effect, Layer } from "effect";
import { NodeConsoleService, NodeConsoleLive, NodeConsoleMainLive } from "../../console/index.js";
import { AccountInfo, AccountMainLive } from "../../account/index.js";
import type { PlatformError } from "@effect/platform/Error";
import type { QuitException } from "@effect/platform/Terminal";
import type { HttpClientError } from "@effect/platform/HttpClientError";
import type { ConfigError } from "effect/ConfigError";
import { HeroMainLive, HeroService } from "./hero.js";
class ActionsService extends Context.Tag("ActionsService")<
  ActionsService,
  {
    readonly get: () => Effect.Effect<string, PlatformError | QuitException, never>;
    readonly active: (
      action: string,
    ) => Effect.Effect<void, PlatformError | HttpClientError | ConfigError>;
  }
>() {}

export const ActionsLive = Layer.effect(
  ActionsService,
  Effect.gen(function* () {
    const console = yield* NodeConsoleService;
    const accountInfo = yield* AccountInfo;
    const hero = yield* HeroService;

    return {
      get: () =>
        Effect.gen(function* () {
          return yield* console.ask("\n Введите действие: ");
        }),
      active: (action) =>
        Effect.gen(function* () {
          yield* console.log("\n" + action);

          // переписать
          const heroInfo = yield* hero.getInfo();
          yield* console.log(JSON.stringify(heroInfo, null, 2));

          const eqHero = heroInfo?.[0];
          if (!heroInfo?.length || !eqHero) {
            yield* console.log("Персонажи для данного аккаунта не созданы");
            return;
          }

          yield* hero.fight(eqHero);
          // const response = yield* client.execute(result);
          // yield* console.log(JSON.stringify(response));
        }),
    };
  }),
);

const merge = Layer.merge(AccountMainLive, NodeConsoleMainLive);
export const ActionRegistryLive = ActionsLive.pipe(
  Layer.provideMerge(merge),
  Layer.provide(HeroMainLive),
);

export const ActionsProgram = Effect.gen(function* () {
  const actions = yield* ActionsService;

  const action = yield* actions.get();
  yield* actions.active(action);
});
