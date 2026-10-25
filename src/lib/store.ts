import { useSyncExternalStore } from "react";
import type { Lang, Key } from "./i18n";
import { translate } from "./i18n";
import { GAME_BY_ID } from "./games";

export type HistoryItem = { id: string; at: number };
export type State = {
  lang: Lang;
  favs: string[];
  history: HistoryItem[];
  plays: Record<string, number>;
  xp: number;
  ach: Record<string, number>;
};

const KEY = "sigma-portal-v1";
const initial: State = { lang: "tr", favs: [], history: [], plays: {}, xp: 0, ach: {} };
let state: State = initial;
let loaded = false;
const subs = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const s = localStorage.getItem(KEY);
    if (s) state = { ...initial, ...JSON.parse(s) };
  } catch {
    /* ignore */
  }
}

function set(fn: (s: State) => State) {
  load();
  state = fn(state);
  localStorage.setItem(KEY, JSON.stringify(state));
  subs.forEach((f) => f());
}

export function useStore(): State {
  return useSyncExternalStore(
    (f) => {
      load();
      subs.add(f);
      queueMicrotask(f);
      return () => subs.delete(f);
    },
    () => (loaded ? state : initial),
    () => initial,
  );
}

export function useT() {
  const { lang } = useStore();
  return (k: Key) => translate(lang, k);
}

export const levelOf = (xp: number) => Math.floor(Math.sqrt(xp / 50)) + 1;

export const ACHIEVEMENTS = [
  { id: "first", icon: "🎮", tr: "İlk oyun", en: "First game", desc: { tr: "Bir oyun oyna", en: "Play a game" } },
  { id: "ten", icon: "🔥", tr: "Isınıyorum", en: "Warming up", desc: { tr: "10 oyun oyna", en: "Play 10 games" } },
  { id: "fifty", icon: "🏆", tr: "Sigma Oyuncu", en: "Sigma Gamer", desc: { tr: "50 oyun oyna", en: "Play 50 games" } },
  { id: "fav5", icon: "⭐", tr: "Koleksiyoncu", en: "Collector", desc: { tr: "5 favori ekle", en: "Add 5 favorites" } },
  { id: "explorer", icon: "🧭", tr: "Kaşif", en: "Explorer", desc: { tr: "5 farklı kategori dene", en: "Try 5 categories" } },
  { id: "random", icon: "🎲", tr: "Şansını dene", en: "Feeling lucky", desc: { tr: "Rastgele oyun aç", en: "Open a random game" } },
  { id: "randomseries", icon: "🏀", tr: "Random Ustası", en: "Random Master", desc: { tr: "Random serisinden oyna", en: "Play a Random series game" } },
  { id: "fnaf", icon: "🐻", tr: "Gece Bekçisi", en: "Night Guard", desc: { tr: "Bir FNAF oyunu oyna", en: "Play a FNAF game" } },
  { id: "night", icon: "🦉", tr: "Gece Kuşu", en: "Night Owl", desc: { tr: "Gece 00-05 arası oyna", en: "Play between 0-5 AM" } },
  { id: "konami", icon: "🕹️", tr: "Gizli Sigma", en: "Secret Sigma", desc: { tr: "Gizli kodu bul", en: "Find the secret code" } },
] as const;

type Listener = (id: string) => void;
const achSubs = new Set<Listener>();
export const onAchievement = (f: Listener) => {
  achSubs.add(f);
  return () => {
    achSubs.delete(f);
  };
};

export function unlock(id: string) {
  load();
  if (state.ach[id]) return;
  set((s) => ({ ...s, ach: { ...s.ach, [id]: Date.now() }, xp: s.xp + 100 }));
  achSubs.forEach((f) => f(id));
}

export const actions = {
  setLang: (lang: Lang) => set((s) => ({ ...s, lang })),
  toggleFav: (id: string) => {
    set((s) => ({ ...s, favs: s.favs.includes(id) ? s.favs.filter((x) => x !== id) : [id, ...s.favs] }));
    if (state.favs.length >= 5) unlock("fav5");
  },
  play: (id: string) => {
    set((s) => ({
      ...s,
      xp: s.xp + 10,
      plays: { ...s.plays, [id]: (s.plays[id] || 0) + 1 },
      history: [{ id, at: Date.now() }, ...s.history.filter((h) => h.id !== id)].slice(0, 60),
    }));
    const total = Object.values(state.plays).reduce((a, b) => a + b, 0);
    unlock("first");
    if (total >= 10) unlock("ten");
    if (total >= 50) unlock("fifty");
    const cats = new Set(Object.keys(state.plays).map((k) => GAME_BY_ID.get(k)?.c));
    if (cats.size >= 5) unlock("explorer");
    const c = GAME_BY_ID.get(id)?.c;
    if (c === "Random Serisi") unlock("randomseries");
    if (c === "FNAF") unlock("fnaf");
    if (new Date().getHours() < 5) unlock("night");
  },
};
