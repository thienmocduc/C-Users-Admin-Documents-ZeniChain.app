"use client";

import { useEffect, useRef } from "react";

export function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctxRaw = canvas.getContext("2d");
    if (!ctxRaw) return;
    const ctx = ctxRaw;

    let animId: number;
    let w = 0;
    let h = 0;

    // Chakra energy orbs — focused on C6 (Third Eye) & C7 (Crown)
    const orbs = [
      // C6 Third Eye — deep indigo, main energy
      { x: 0.3, y: 0.3, r: 400, color: [107, 33, 240], speed: 0.006, orbitX: 0.2, orbitY: 0.15, phase: 0, pulse: 0.003 },
      // C7 Crown — bright violet
      { x: 0.7, y: 0.6, r: 380, color: [168, 85, 247], speed: 0.005, orbitX: 0.18, orbitY: 0.2, phase: 2.0, pulse: 0.004 },
      // C7b Crown light — soft lavender
      { x: 0.5, y: 0.2, r: 350, color: [192, 132, 252], speed: 0.007, orbitX: 0.22, orbitY: 0.12, phase: 4.0, pulse: 0.0035 },
      // C6b Third Eye secondary — deeper
      { x: 0.2, y: 0.75, r: 320, color: [139, 69, 255], speed: 0.0055, orbitX: 0.15, orbitY: 0.18, phase: 1.0, pulse: 0.003 },
      // Touch of C5 Throat blue for contrast
      { x: 0.85, y: 0.35, r: 280, color: [74, 141, 255], speed: 0.004, orbitX: 0.12, orbitY: 0.14, phase: 3.0, pulse: 0.002 },
      // Touch of C4 Heart teal for depth
      { x: 0.6, y: 0.85, r: 260, color: [0, 212, 170], speed: 0.0045, orbitX: 0.14, orbitY: 0.1, phase: 5.0, pulse: 0.0025 },
    ];

    // Shooting stars
    interface Star {
      x: number; y: number; len: number; speed: number;
      angle: number; life: number; maxLife: number; brightness: number;
    }
    const stars: Star[] = [];

    function spawnStar() {
      const angle = Math.PI * 0.12 + Math.random() * Math.PI * 0.25;
      stars.push({
        x: Math.random() * w * 0.9,
        y: -10,
        len: 80 + Math.random() * 140,
        speed: 4 + Math.random() * 5,
        angle,
        life: 0,
        maxLife: 50 + Math.random() * 50,
        brightness: 0.6 + Math.random() * 0.4,
      });
    }

    function resize() {
      const c = canvasRef.current;
      if (!c) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      c.style.width = w + "px";
      c.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    let t = 0;
    let starTimer = 0;

    function draw() {
      t++;
      starTimer++;

      // Clear
      ctx.clearRect(0, 0, w, h);

      // Dark cosmic base
      ctx.fillStyle = "#050710";
      ctx.fillRect(0, 0, w, h);

      // Draw chakra energy orbs with visible movement
      for (const orb of orbs) {
        const ox = orb.x * w + Math.sin(t * orb.speed + orb.phase) * w * orb.orbitX;
        const oy = orb.y * h + Math.cos(t * orb.speed * 0.8 + orb.phase + 1) * h * orb.orbitY;
        const [r, g, b] = orb.color;

        // Pulsing radius
        const pulseR = orb.r + Math.sin(t * orb.pulse) * 40;

        // Large outer energy field
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, pulseR);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.22)`);
        grad.addColorStop(0.2, `rgba(${r},${g},${b},0.14)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${b},0.06)`);
        grad.addColorStop(0.8, `rgba(${r},${g},${b},0.02)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Bright inner core — the chakra center
        const coreR = pulseR * 0.25;
        const grad2 = ctx.createRadialGradient(ox, oy, 0, ox, oy, coreR);
        grad2.addColorStop(0, `rgba(${Math.min(r + 60, 255)},${Math.min(g + 60, 255)},${Math.min(b + 60, 255)},0.3)`);
        grad2.addColorStop(0.5, `rgba(${r},${g},${b},0.15)`);
        grad2.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, w, h);
      }

      // Flowing energy stream between C6 and C7 orbs
      const o1x = orbs[0].x * w + Math.sin(t * orbs[0].speed + orbs[0].phase) * w * orbs[0].orbitX;
      const o1y = orbs[0].y * h + Math.cos(t * orbs[0].speed * 0.8 + orbs[0].phase + 1) * h * orbs[0].orbitY;
      const o2x = orbs[1].x * w + Math.sin(t * orbs[1].speed + orbs[1].phase) * w * orbs[1].orbitX;
      const o2y = orbs[1].y * h + Math.cos(t * orbs[1].speed * 0.8 + orbs[1].phase + 1) * h * orbs[1].orbitY;
      const midX = (o1x + o2x) / 2 + Math.sin(t * 0.008) * 60;
      const midY = (o1y + o2y) / 2 + Math.cos(t * 0.006) * 40;

      const stream = ctx.createRadialGradient(midX, midY, 0, midX, midY, 250);
      stream.addColorStop(0, "rgba(139, 69, 255, 0.08)");
      stream.addColorStop(0.5, "rgba(168, 85, 247, 0.04)");
      stream.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = stream;
      ctx.fillRect(0, 0, w, h);

      // Spawn shooting stars
      if (starTimer > 60 + Math.random() * 140) {
        spawnStar();
        starTimer = 0;
      }

      // Draw shooting stars
      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.x += Math.cos(s.angle) * s.speed;
        s.y += Math.sin(s.angle) * s.speed;
        s.life++;

        const progress = s.life / s.maxLife;
        const alpha = progress < 0.1
          ? progress * 10 * s.brightness
          : (1 - progress) * s.brightness;

        if (alpha <= 0 || s.life >= s.maxLife) {
          stars.splice(i, 1);
          continue;
        }

        // Star trail
        const tailX = s.x - Math.cos(s.angle) * s.len;
        const tailY = s.y - Math.sin(s.angle) * s.len;

        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, "rgba(255, 255, 255, 0)");
        grad.addColorStop(0.6, `rgba(192, 132, 252, ${alpha * 0.4})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.9})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Star head glow
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 8);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
        headGlow.addColorStop(0.4, `rgba(192, 132, 252, ${alpha * 0.5})`);
        headGlow.addColorStop(1, "rgba(107, 33, 240, 0)");
        ctx.fillStyle = headGlow;
        ctx.fillRect(s.x - 8, s.y - 8, 16, 16);
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
