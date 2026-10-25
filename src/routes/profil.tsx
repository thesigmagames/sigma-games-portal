import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { GameRow } from "@/components/GameCard";
import { GAME_BY_ID, type Game } from "@/lib/games";
import { ACHIEVEMENTS, levelOf, useStore, useT } from "@/lib/store";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Oyuncu Profilim | The Sigma Games" },
      { name: "description", content: "Seviyen, puanların, favorilerin, başarımların ve oyun geçmişin." },
      { property: "og:title", content: "Oyuncu Profilim | The Sigma Games" },
      { property: "og:description", content: "Seviye, favoriler, başarımlar ve oyun geçmişi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

function Profile() {
  const s = useStore();
  const t = useT();
  const lvl = levelOf(s.xp);
  const next = lvl * lvl * 50;
  const prev = (lvl - 1) * (lvl - 1) * 50;
  const total = Object.values(s.plays).reduce((a, b) => a + b, 0);
  const favs = s.favs.map((id) => GAME_BY_ID.get(id)).filter(Boolean) as Game[];
  const fmt = new Intl.DateTimeFormat(s.lang, { dateStyle: "medium", timeStyle: "short" });

  return (
    <Shell>
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-5 sm:col-span-2">
          <p className="text-sm text-muted-foreground">{t("profile")}</p>
          <p className="font-display text-4xl font-bold text-primary text-glow">{t("level")} {lvl}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary" style={{ width: `${((s.xp - prev) / (next - prev)) * 100}%` }} />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{s.xp} / {next} XP</p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <p className="text-sm text-muted-foreground">{t("plays")}</p>
          <p className="font-display text-4xl font-bold">{total}</p>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">🏆 {t("achievements")} ({Object.keys(s.ach).length}/{ACHIEVEMENTS.length})</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ACHIEVEMENTS.map((a) => {
            const on = !!s.ach[a.id];
            return (
              <div key={a.id} className={`rounded-xl border p-4 text-center ${on ? "border-gold bg-card" : "opacity-40"}`}>
                <div className="text-3xl">{on || a.id !== "konami" ? a.icon : "❓"}</div>
                <p className="mt-1 font-semibold">{a[s.lang]}</p>
                <p className="text-xs text-muted-foreground">{a.desc[s.lang]}</p>
              </div>
            );
          })}
        </div>
      </section>

      <GameRow title={`⭐ ${t("favorites")}`} games={favs} />

      <section className="mt-10">
        <h2 className="mb-3 text-xl font-bold">🕹️ {t("history")}</h2>
        {s.history.length === 0 ? <p className="text-muted-foreground">{t("empty")}</p> : (
          <ul className="divide-y rounded-xl border bg-card">
            {s.history.map((h) => {
              const g = GAME_BY_ID.get(h.id);
              if (!g) return null;
              return (
                <li key={h.id} className="flex items-center justify-between px-4 py-2.5">
                  <Link to="/oyun/$id" params={{ id: g.id }} className="font-medium hover:text-primary">{g.t}</Link>
                  <span className="text-xs text-muted-foreground">{s.plays[g.id]}× · {fmt.format(h.at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </Shell>
  );
}
