import { Effect } from "effect";
import type { IMonster } from "../monster/types.js";
import type { IHero } from "../hero/types/index.js";

export const Fight = (hero: IHero, monster: IMonster) =>
  Effect.gen(function* () {
    const { name } = hero;
    yield* Effect.log(`Fighting ${monster.name}...`);
  });
