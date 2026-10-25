import { useEffect, useRef } from "react";

/** Mouse-reactive green & gold particle field, ported from the original site. */
export function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const x = cv.getContext("2d");
    if (!x || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const css = getComputedStyle(document.documentElement);
    const green = css.getPropertyValue("--primary").trim();
    const gold = css.getPropertyValue("--gold").trim();
    type P = { x: number; y: number; bx: number; by: number; vx: number; vy: number; r: number; g: boolean; a: number };
    let w = 0, h = 0, raf = 0;
    const pts: P[] = [];
    const m = { x: -999, y: -999 };
    const mk = (): P => {
      const bx = (Math.random() - 0.5) * 0.35, by = (Math.random() - 0.5) * 0.35;
      return { x: Math.random() * w, y: Math.random() * h, bx, by, vx: bx, vy: by, r: Math.random() * 1.8 + 0.6, g: Math.random() >= 0.7, a: Math.random() * 0.5 + 0.3 };
    };
    const size = () => {
      const r = Math.min(devicePixelRatio || 1, 1.5);
      w = innerWidth; h = innerHeight;
      cv.width = w * r; cv.height = h * r;
      x.setTransform(r, 0, 0, r, 0, 0);
      const n = Math.min(90, Math.floor((w * h) / 11000));
      while (pts.length < n) pts.push(mk());
      pts.length = n;
    };
    const move = (e: PointerEvent) => { m.x = e.clientX; m.y = e.clientY; };
    const loop = () => {
      x.clearRect(0, 0, w, h);
      for (const p of pts) {
        const dx = p.x - m.x, dy = p.y - m.y, d = Math.hypot(dx, dy);
        if (d < 130) { const f = (1 - d / 130) * 0.5; p.vx += (dx / (d || 1)) * f; p.vy += (dy / (d || 1)) * f; }
        p.vx += (p.bx - p.vx) * 0.03; p.vy += (p.by - p.vy) * 0.03;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
        x.globalAlpha = p.a;
        x.fillStyle = x.shadowColor = p.g ? gold : green;
        x.shadowBlur = 8;
        x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.283); x.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    size(); loop();
    addEventListener("resize", size);
    addEventListener("pointermove", move, { passive: true });
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); removeEventListener("pointermove", move); };
  }, []);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}

/** Fullscreen confetti burst used for achievements & the secret code. */
export function confetti(n = 160) {
  const cv = document.createElement("canvas");
  cv.className = "pointer-events-none fixed inset-0 z-[100]";
  cv.width = innerWidth; cv.height = innerHeight;
  document.body.appendChild(cv);
  const x = cv.getContext("2d")!;
  const css = getComputedStyle(document.documentElement);
  const cols = [css.getPropertyValue("--primary"), css.getPropertyValue("--gold"), css.getPropertyValue("--foreground")];
  const ps = Array.from({ length: n }, () => ({ x: innerWidth / 2, y: innerHeight / 2, vx: (Math.random() - 0.5) * 16, vy: Math.random() * -16 - 4, c: cols[Math.floor(Math.random() * 3)] ?? "#0f9", s: Math.random() * 6 + 3, r: Math.random() * 6 }));
  let t = 0;
  const loop = () => {
    x.clearRect(0, 0, cv.width, cv.height);
    for (const p of ps) { p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.r += 0.2; x.fillStyle = p.c; x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); x.restore(); }
    if (++t < 160) requestAnimationFrame(loop); else cv.remove();
  };
  loop();
}
