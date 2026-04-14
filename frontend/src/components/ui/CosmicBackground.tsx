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

    // Chakra orbs — 4,5,6,7
    const orbs = [
      { x: 0.15, y: 0.25, r: 350, color: [0, 212, 170], speed: 0.0004, phase: 0 },       // C4 Heart — teal
      { x: 0.8, y: 0.55, r: 320, color: [74, 141, 255], speed: 0.00035, phase: 1.5 },     // C5 Throat — blue
      { x: 0.5, y: 0.15, r: 380, color: [107, 33, 240], speed: 0.00045, phase: 3.0 },     // C6 Third Eye — indigo
      { x: 0.25, y: 0.8, r: 300, color: [168, 85, 247], speed: 0.0003, phase: 4.5 },      // C7 Crown — violet
      { x: 0.9, y: 0.1, r: 260, color: [192, 132, 252], speed: 0.00038, phase: 2.0 },     // C7b Crown light
      { x: 0.6, y: 0.7, r: 280, color: [24, 217, 162], speed: 0.00032, phase: 5.5 },      // C4b Heart glow
    ];

    // Shooting stars
    interface Star {
      x: number; y: number; len: number; speed: number;
      angle: number; life: number; maxLife: number; brightness: number;
    }
    const stars: Star[] = [];

    function spawnStar() {
      const angle = Math.PI * 0.15 + Math.random() * Math.PI * 0.2; // ~30-60 degrees
      stars.push({
        x: Math.random() * w * 0.8,
        y: -10,
        len: 60 + Math.random() * 100,
        speed: 3 + Math.random() * 4,
        angle,
        life: 0,
        maxLife: 60 + Math.random() * 40,
        brightness: 0.5 + Math.random() * 0.5,
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

      // Dark base
      ctx.fillStyle = "#07090F";
      ctx.fillRect(0, 0, w, h);

      // Draw chakra orbs
      for (const orb of orbs) {
        const ox = orb.x * w + Math.sin(t * orb.speed + orb.phase) * w * 0.12;
        const oy = orb.y * h + Math.cos(t * orb.speed * 0.7 + orb.phase) * h * 0.1;
        const [r, g, b] = orb.color;

        // Outer glow
        const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r);
        grad.addColorStop(0, `rgba(${r},${g},${b},0.18)`);
        grad.addColorStop(0.3, `rgba(${r},${g},${b},0.10)`);
        grad.addColorStop(0.6, `rgba(${r},${g},${b},0.04)`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Inner bright core
        const grad2 = ctx.createRadialGradient(ox, oy, 0, ox, oy, orb.r * 0.3);
        grad2.addColorStop(0, `rgba(${r},${g},${b},0.25)`);
        grad2.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad2;
        ctx.fillRect(0, 0, w, h);
      }

      // Subtle nebula overlay — connecting energy
      const nebulaX = w * 0.5 + Math.sin(t * 0.0002) * w * 0.1;
      const nebulaY = h * 0.5 + Math.cos(t * 0.00015) * h * 0.1;
      const nebula = ctx.createRadialGradient(nebulaX, nebulaY, 0, nebulaX, nebulaY, w * 0.5);
      nebula.addColorStop(0, "rgba(139, 69, 255, 0.06)");
      nebula.addColorStop(0.5, "rgba(74, 141, 255, 0.03)");
      nebula.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, w, h);

      // Spawn shooting stars — random interval
      if (starTimer > 80 + Math.random() * 200) {
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
        grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.7, `rgba(200, 210, 255, ${alpha * 0.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${alpha * 0.8})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Star head glow
        const headGlow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 6);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
        headGlow.addColorStop(0.5, `rgba(192, 132, 252, ${alpha * 0.3})`);
        headGlow.addColorStop(1, `rgba(107, 33, 240, 0)`);
        ctx.fillStyle = headGlow;
        ctx.fillRect(s.x - 6, s.y - 6, 12, 12);
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
