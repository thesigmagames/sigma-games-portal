import { Link, useNavigate } from "@tanstack/react-router";
import { Dices, Trophy, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Particles, confetti } from "./Particles";
import { ACHIEVEMENTS, actions, levelOf, onAchievement, unlock, useStore, useT } from "@/lib/store";
import { randomGame } from "@/lib/games";

const KONAMI = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "s", "i", "g", "m", "a"];

export function Shell({ children }: { children: ReactNode }) {
  const s = useStore();
  const t = useT();
  const nav = useNavigate();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => onAchievement((id) => {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a) return;
    setToast(`${a.icon} ${a[s.lang]}`);
    confetti(120);
    setTimeout(() => setToast(null), 3500);
  }), [s.lang]);

  useEffect(() => {
    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      pos = k === KONAMI[pos] ? pos + 1 : k === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) { pos = 0; document.documentElement.classList.toggle("hue-rotate-90"); confetti(220); unlock("konami"); }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const lvl = levelOf(s.xp);
  return (
    <div className="relative min-h-screen">
      <Particles />
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
          <Link to="/" className="font-display text-xl font-bold tracking-widest text-primary text-glow">THE SIGMA GAMES</Link>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => { unlock("random"); nav({ to: "/oyun/$id", params: { id: randomGame()!.id } }); }}
              className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:border-primary hover:text-primary"
            >
              <Dices className="h-4 w-4" /><span className="hidden sm:inline">{t("random")}</span>
            </button>
            <button onClick={() => actions.setLang(s.lang === "tr" ? "en" : "tr")} className="rounded-lg border px-2.5 py-1.5 text-sm font-semibold hover:border-primary">
              {s.lang === "tr" ? "EN" : "TR"}
            </button>
            <Link to="/profil" className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:glow">
              <User className="h-4 w-4" /> {t("level")} {lvl}
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 pb-16">{children}</main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>{t("secret")}</p>
        <p className="mt-2">© 2026 The Sigma Games</p>
      </footer>
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-xl border border-gold bg-card px-5 py-3 animate-pop glow">
          <Trophy className="h-5 w-5 text-gold" />
          <div><p className="text-xs text-gold">{t("unlocked")}</p><p className="font-semibold">{toast}</p></div>
        </div>
      )}
    </div>
  );
}
