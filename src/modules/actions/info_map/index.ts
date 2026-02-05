import { Effect } from "effect";

export const GetInfoMap = Effect.async((resume) => {
  resume(
    Effect.succeed({
      x: 100,
      y: 100,
      map_id: 1,
    }),
  );
});
