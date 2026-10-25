import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Heart, Maximize } from "lucide-react";
import { useEffect, useRef } from "react";
import { Shell } from "@/components/Shell";
import { GameRow } from "@/components/GameCard";
import { GAMES, GAME_BY_ID } from "@/lib/games";
import { actions, useStore, useT } from "@/lib/store";

export const Route = createFileRoute("/oyun/$id")({
  loader: ({ params }) => {
    const game = GAME_BY_ID.get(params.id);
    if (!game) throw notFound();
    return { game };
  },
  head: ({ loaderData }) => {
    const g = loaderData?.game;
    const title = g ? `${g.t} – Ücretsiz Oyna | The Sigma Games` : "The Sigma Games";
    const desc = g ? `${g.t} oyununu The Sigma Games'te ücretsiz ve tam ekran oyna.` : "";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(g?.i?.startsWith("https://") ? [{ property: "og:image", content: g.i }, { name: "twitter:image", content: g.i }] : []),
      ],
    };
  },
  notFoundComponent: () => <Shell><p className="py-20 text-center">404</p></Shell>,
  component: GamePage,
});

function GamePage() {
  const { game } = Route.useLoaderData();
  const t = useT();
  const { favs } = useStore();
  const frame = useRef<HTMLIFrameElement>(null);
  const fav = favs.includes(game.id);
  useEffect(() => { actions.play(game.id); }, [game.id]);
  const similar = GAMES.filter((g) => g.c === game.c && g.id !== game.id).slice(0, 12);

  return (
    <Shell>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link to="/" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />{t("back")}</Link>
        <h1 className="text-2xl font-bold">{game.t}</h1>
        <span className="rounded-full bg-secondary px-3 py-0.5 text-xs">{game.c}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => actions.toggleFav(game.id)} className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:border-gold">
            <Heart className={fav ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4"} />{fav ? t("unfav") : t("fav")}
          </button>
          <button onClick={() => frame.current?.requestFullscreen()} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
            <Maximize className="h-4 w-4" />{t("fullscreen")}
          </button>
        </div>
      </div>
      <div className="mt-4 aspect-video w-full overflow-hidden rounded-2xl border bg-card glow">
        <iframe ref={frame} key={game.id} src={game.u} title={game.t} className="h-full w-full" allow="autoplay; fullscreen; gamepad; gyroscope; accelerometer" allowFullScreen />
      </div>
      <GameRow title={t("similar")} games={similar} />
    </Shell>
  );
}
