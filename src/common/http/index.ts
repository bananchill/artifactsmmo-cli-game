import { HttpClientRequest } from "@effect/platform";
import { GameConfig } from "../../config/config.js";
import { Effect } from "effect";

export const requestGet = (prefixUrl: string) =>
  Effect.gen(function* () {
    const gameConfig = yield* GameConfig;
    return HttpClientRequest.get(`${gameConfig.url}${prefixUrl}`, {
      headers: {
        authorization: `Bearer ${gameConfig.gameToken}`,
      },
    });
  });

export const requestPost = (prefixUrl: string, params: any = {}) =>
  Effect.gen(function* () {
    const gameConfig = yield* GameConfig;
    return HttpClientRequest.post(`${gameConfig.url}${prefixUrl}`, {
      ...params,
      headers: {
        authorization: `Bearer ${gameConfig.gameToken}`,
      },
    });
  });
