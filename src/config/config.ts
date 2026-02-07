import "dotenv/config";
import { Config, ConfigProvider } from "effect";

// export default function (): { gameToken: string; hero: string[]; url: string } {
//   const gameToken = process.env.GAME_TOKEN;
//   if (!gameToken) {
//     throw new Error("GAME_TOKEN is not set");
//   }

//   return {
//     gameToken,
//     hero: ["ban"],
//     url: "https://api.artifactsmmo.com",
//   };
// }

export const provider = ConfigProvider.fromEnv();

export const GameConfig = Config.all({
  gameToken: Config.string("GAME_TOKEN"),
  url: Config.string("API_URL").pipe(Config.withDefault("https://api.artifactsmmo.com")),
  hero: Config.array(Config.string("HEROES")).pipe(Config.withDefault(["ban"])),
});
