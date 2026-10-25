import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { COVERS } from "@/lib/covers";
import type { Game } from "@/lib/games";
import { actions, useStore } from "@/lib/store";

export function GameCard({ g }: { g: Game }) {
  const { favs } = useStore();
  const [broken, setBroken] = useState(false);
  const fav = favs.includes(g.id);
  const src = COVERS[g.id] ?? g.i;
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => { const el = img.current; if (el && el.complete && el.naturalWidth === 0) setBroken(true); }, [src]);
  return (
    <Link
      to="/oyun/$id"
      params={{ id: g.id }}
      className="group relative block aspect-[4/3] overflow-hidden rounded-xl border bg-card transition duration-200 hover:-translate-y-1 hover:border-primary hover:glow"
    >
      {src && !broken ? (
        <img ref={img} src={src} alt={g.t} loading="lazy" onError={() => setBroken(true)} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-hero bg-secondary p-3">
          <span className="font-display text-4xl font-bold text-primary text-glow">{g.t.slice(0, 2).toUpperCase()}</span>
        </div>
      )}
      <div className="absolute inset-0 bg-card-fade" />
      <span className="absolute inset-x-0 bottom-0 truncate p-2 text-sm font-semibold">{g.t}</span>
      {g.o && <span className="absolute left-2 top-2 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">SIGMA</span>}
      <button
        aria-label="favorite"
        onClick={(e) => { e.preventDefault(); actions.toggleFav(g.id); }}
        className="absolute right-2 top-2 rounded-full bg-background/70 p-1.5 opacity-0 transition group-hover:opacity-100 data-[on=true]:opacity-100"
        data-on={fav}
      >
        <Heart className={fav ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4"} />
      </button>
    </Link>
  );
}

export function GameRow({ title, games }: { title: string; games: Game[] }) {
  if (!games.length) return null;
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {games.map((g) => <GameCard key={g.id} g={g} />)}
      </div>
    </section>
  );
}
