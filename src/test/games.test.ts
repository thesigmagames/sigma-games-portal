import { describe, expect, it } from "vitest";
import { GAMES } from "@/lib/games";

describe("game catalog", () => {
  it("has more than 1300 games", () => {
    expect(GAMES.length).toBeGreaterThan(1300);
  });
  it("never embeds CrazyGames (blocked outside their site)", () => {
    expect(GAMES.filter((g) => g.u.includes("crazygames"))).toEqual([]);
  });
  it("every GameDistribution embed carries a referrer so it isn't blocked", () => {
    const bad = GAMES.filter((g) => g.u.includes("gamedistribution.com") && !g.u.includes("gd_sdk_referrer_url="));
    expect(bad).toEqual([]);
  });
  it("includes the Random series and FNAF", () => {
    for (const t of ["Basket Random", "Soccer Random", "Volley Random", "Boxing Random"]) {
      expect(GAMES.some((g) => g.t === t)).toBe(true);
    }
    expect(GAMES.some((g) => g.c === "FNAF")).toBe(true);
  });
});
