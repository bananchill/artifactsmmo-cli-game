import { Context, Effect, Layer } from "effect";
import { ConsoleService, NodeConsoleLayer } from "../console/index.js";
import { GetInfoMap } from "./info_map/index.js";

class ActionsService extends Context.Tag("ActionsService")<
  ActionsService,
  {
    readonly get: () => Effect.Effect<string>;
    readonly active: (action: string) => Effect.Effect<void>;
  }
>() {}

const ActionsLayer = Layer.scoped(
  ActionsService,
  Effect.gen(function* () {
    const console = yield* ConsoleService;

    return {
      get: () =>
        Effect.gen(function* () {
          const action = yield* console.ask("Введите действие: ");

          return action;
        }),
      active: (action) =>
        Effect.gen(function* () {
          const result = yield* GetInfoMap;

          yield* console.log(JSON.stringify(result));
        }),
    };
  }),
);

const ActionsWithConsoleLayer = ActionsLayer.pipe(Layer.provide(NodeConsoleLayer));

export const ActionsProgram = Effect.gen(function* () {
  const actions = yield* ActionsService;

  const action = yield* actions.get();
  yield* actions.active(action);
}).pipe(Effect.provide(ActionsWithConsoleLayer));
