import { Context, Effect } from "effect";

class HeroService extends Context.Tag("HeroService")<
  HeroService,
  {
    readonly move: () => Effect.Effect<void>;
    readonly fight: () => Effect.Effect<void>;
    readonly getInfo: () => Effect.Effect<void>;
    readonly craft: () => Effect.Effect<void>;
  }
>() {}
