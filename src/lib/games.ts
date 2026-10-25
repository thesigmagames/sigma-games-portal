import raw from "@/data/games.json";

export type Game = { id: string; t: string; u: string; i: string; c: string; o?: 1; f?: 1 };

export const GAMES = raw as Game[];
export const GAME_BY_ID = new Map(GAMES.map((g) => [g.id, g]));

const ORDER = ["Sigma Özel", "Random Serisi", "FNAF", "Aksiyon", "Spor", "Yarış", "Bulmaca", "Arcade", "Macera", "Platform", ".io", "Strateji", "Eğlence"];
export const CATEGORIES = Array.from(new Set(GAMES.map((g) => g.c))).sort(
  (a, b) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(b) + 1 || 99),
);

export function searchGames(q: string, cat: string | null) {
  const s = q.trim().toLocaleLowerCase("tr");
  return GAMES.filter((g) => (!cat || g.c === cat) && (!s || g.t.toLocaleLowerCase("tr").includes(s)));
}

export function randomGame() {
  return GAMES[Math.floor(Math.random() * GAMES.length)];
}
