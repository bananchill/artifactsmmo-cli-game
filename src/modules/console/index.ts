import { Effect, Layer, Context } from "effect";
import { Terminal } from "@effect/platform";
import type { PlatformError } from "@effect/platform/Error";
import { NodeTerminal } from "@effect/platform-node";

export class NodeConsoleService extends Context.Tag("NodeConsoleService")<
  NodeConsoleService,
  {
    readonly ask: (
      question: string,
    ) => Effect.Effect<string, PlatformError | Terminal.QuitException>;
    readonly log: (message: string) => Effect.Effect<void, PlatformError>;
  }
>() {}

export const NodeConsoleLive = Layer.effect(
  NodeConsoleService,
  Effect.gen(function* () {
    const terminal = yield* Terminal.Terminal;

    return {
      ask: (question: string) =>
        Effect.gen(function* () {
          yield* terminal.display(question);

          return yield* terminal.readLine;
        }),
      log: (message: string) =>
        Effect.gen(function* () {
          yield* terminal.display(message);
        }),
    };
  }),
).pipe(
  Layer.catchAll((configError) =>
    Layer.effect(
      NodeConsoleService,
      Effect.gen(function* () {
        console.log(configError, 3333);

        return {} as any;
      }),
    ),
  ),
);

export const NodeConsoleMainLive = NodeConsoleLive.pipe(Layer.provide(NodeTerminal.layer));
