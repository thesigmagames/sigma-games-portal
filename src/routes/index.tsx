import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { GameCard, GameRow } from "@/components/GameCard";
import { CATEGORIES, GAMES, GAME_BY_ID, searchGames } from "@/lib/games";
import { useStore, useT } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Sigma Games – 1500+ Ücretsiz Online Oyun" },
      { name: "description", content: "Basket Random, FNAF, Sigma oyunları ve 1500+ ücretsiz tarayıcı oyunu. Favorile, başarım kazan, seviye atla." },
      { property: "og:title", content: "The Sigma Games – 1500+ Ücretsiz Oyun" },
      { property: "og:description", content: "Basket Random, FNAF ve 1500+ ücretsiz tarayıcı oyunu tek yerde." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PAGE = 48;

function Index() {
  const t = useT();
  const s = useStore();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [limit, setLimit] = useState(PAGE);
  const list = useMemo(() => searchGames(q, cat), [q, cat]);
  const featured = useMemo(() => GAMES.filter((g) => g.f), []);
  const favs = s.favs.map((id) => GAME_BY_ID.get(id)).filter(Boolean).slice(0, 12) as typeof GAMES;
  const recent = s.history.map((h) => GAME_BY_ID.get(h.id)).filter(Boolean).slice(0, 12) as typeof GAMES;
  const browsing = q || cat;

  return (
    <Shell>
      <section className="bg-hero py-14 text-center">
        <h1 className="font-display text-4xl font-bold tracking-wider text-primary text-glow sm:text-6xl">THE SIGMA GAMES</h1>
        <p className="mt-3 text-muted-foreground">{t("tagline")}</p>
        <div className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-xl border bg-card px-4 focus-within:border-primary focus-within:glow">
          <Search className="h-5 w-5 text-muted-foreground" />
          <input value={q} onChange={(e) => { setQ(e.target.value); setLimit(PAGE); }} placeholder={t("search")} className="w-full bg-transparent py-3 outline-none" />
        </div>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {[null, ...CATEGORIES].map((c) => (
          <button key={c ?? "all"} onClick={() => { setCat(c); setLimit(PAGE); }}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${cat === c ? "border-primary bg-primary font-semibold text-primary-foreground" : "hover:border-primary"}`}>
            {c ?? t("all")}
          </button>
        ))}
      </div>

      {!browsing && (
        <>
          <GameRow title={`🔥 ${t("featured")}`} games={featured} />
          <GameRow title={`⭐ ${t("favorites")}`} games={favs} />
          <GameRow title={`🕹️ ${t("recent")}`} games={recent} />
        </>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">{cat ?? t("all")} <span className="text-sm font-normal text-muted-foreground">· {list.length} {t("games")}</span></h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {list.slice(0, limit).map((g) => <GameCard key={g.id} g={g} />)}
        </div>
        {limit < list.length && (
          <div className="mt-6 text-center">
            <button onClick={() => setLimit((l) => l + PAGE)} className="rounded-xl border border-primary px-6 py-2.5 font-semibold text-primary hover:bg-primary hover:text-primary-foreground">{t("more")}</button>
          </div>
        )}
      </section>

      {recent.length > 0 && (
        <section className="mt-14 rounded-2xl border bg-card/60 p-5">
          <h2 className="mb-3 font-bold">👾 {t("nowPlaying")}</h2>
          <div className="flex flex-wrap gap-2">
            {recent.map((g) => <span key={g.id} className="rounded-full bg-secondary px-3 py-1 text-sm">{g.t}</span>)}
          </div>
        </section>
      )}
    </Shell>
  );
}
