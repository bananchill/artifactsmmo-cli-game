import { Context, Effect, Fiber, Layer } from "effect";
import { NodeConsoleService, NodeConsoleLive, NodeConsoleMainLive } from "../console/index.js";
import { AccountInfo, AccountMainLive } from "../account/index.js";
import type { PlatformError } from "@effect/platform/Error";
import type { QuitException } from "@effect/platform/Terminal";
import type { HttpClientError } from "@effect/platform/HttpClientError";
class ActionsService extends Context.Tag("ActionsService")<
  ActionsService,
  {
    readonly get: () => Effect.Effect<string, PlatformError | QuitException, never>;
    readonly active: (action: string) => Effect.Effect<void, PlatformError | HttpClientError>;
  }
>() {}

export const ActionsLive = Layer.effect(
  ActionsService,
  Effect.gen(function* () {
    const console = yield* NodeConsoleService;
    const accountInfo = yield* AccountInfo;

    return {
      get: () =>
        Effect.gen(function* () {
          return yield* console.ask("\n Введите действие: ");
        }),
      active: (action) =>
        Effect.gen(function* () {
          yield* console.log("\n" + action);

          const result = yield* accountInfo.getBankDetails();

          yield* console.log(JSON.stringify(result));
        }),
    };
  }),
);

const merge = Layer.merge(AccountMainLive, NodeConsoleMainLive);
export const ActionRegistryLive = ActionsLive.pipe(Layer.provideMerge(merge));

export const ActionsProgram = Effect.gen(function* () {
  const actions = yield* ActionsService;

  const action = yield* actions.get();
  yield* actions.active(action);
});
