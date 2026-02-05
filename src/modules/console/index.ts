import { Effect, Layer, Context } from "effect";
import readline from "node:readline";

export class ConsoleService extends Context.Tag("ConsoleService")<
  ConsoleService,
  {
    readonly ask: (question: string) => Effect.Effect<string>;
    readonly log: (message: string) => Effect.Effect<void>;
  }
>() {}

export const NodeConsoleLayer = Layer.scoped(
  ConsoleService,
  Effect.gen(function* () {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    yield* Effect.addFinalizer(() => Effect.sync(() => rl.close()));

    return {
      ask: (question: string) =>
        Effect.async<string>((resume) => {
          rl.question(question, (answer) => {
            resume(Effect.succeed(answer));
          });
        }),

      log: (message: string) =>
        Effect.sync(() => {
          console.log(message);
        }),
    };
  }),
);

export const ConsoleProgram = Effect.gen(function* () {
  const console = yield* ConsoleService;

  const name = yield* console.ask("Введите имя: ");

  yield* console.log(`Привет, ${name}!`);
}).pipe(Effect.provide(NodeConsoleLayer));
