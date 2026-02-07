export default function (): { gameToken: string; hero: string[]; url: string } {
  const gameToken = process.env.GAME_TOKEN;

  if (!gameToken) {
    throw new Error("GAME_TOKEN is not set");
  }

  return {
    gameToken,
    hero: ["ban"],
    url: "https://api.artifactsmmo.com",
  };
}
