import { Context, Effect } from "effect";

class HeroService extends Context.Tag("HeroService")<
  HeroService,
  {
    readonly move: () => Effect.Effect<void>;
  }
>() {}
