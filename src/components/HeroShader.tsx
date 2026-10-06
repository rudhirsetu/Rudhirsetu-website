"use client";

import { useEffect, useRef, useState } from "react";

/*
 * Hero background: slow-flowing crimson silk with a soft heartbeat.
 *
 * Plain WebGL 1 (no library) so it runs everywhere (Safari/iOS, Firefox, Android)
 * and adds almost nothing to the bundle. The surface is a smooth trig-warped
 * height field lit like fabric, so it can be rendered at a fraction of the CSS
 * resolution and stretched without visible loss.
 */

const VERTEX = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;   // 0..1, y up
uniform float uIntro;  // 0..1 fade-in exposure
uniform float uBeat;   // 0..1 heartbeat envelope (computed on the CPU)

varying vec2 vUv;

// Height of the silk at p: three layers of sine domain-warping, then folds.
float silk(vec2 p, float t) {
  p += 0.55 * vec2(sin(p.y * 1.25 + t * 0.21), cos(p.x * 1.05 - t * 0.17));
  p += 0.32 * vec2(sin(p.y * 2.10 - t * 0.13 + 1.7), cos(p.x * 1.90 + t * 0.19 + 0.6));
  p += 0.16 * vec2(sin(p.y * 3.70 + t * 0.11 + 2.3), cos(p.x * 3.30 - t * 0.15 + 4.1));
  float folds = sin(p.x * 1.55 + p.y * 0.85 + t * 0.06) * 0.62
              + sin(p.y * 2.35 - p.x * 0.65 - t * 0.09 + 1.3) * 0.38;
  return folds * 0.5 + 0.5;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vUv;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 2.6;
  float t = uTime;

  // A gentle swell of the fabric on each heartbeat.
  p *= 1.0 - 0.012 * uBeat;

  float e = 0.012;
  float h  = silk(p, t);
  float hx = silk(p + vec2(e, 0.0), t);
  float hy = silk(p + vec2(0.0, e), t);
  vec3 n = normalize(vec3((h - hx) / e, (h - hy) / e, 2.4));

  // Key light from the upper left, nudged toward the pointer.
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0);
  vec3 l = normalize(vec3(-0.55 + m.x * 0.8, 0.65 + m.y * 0.6, 0.9));
  float diff = clamp(dot(n, l), 0.0, 1.0);
  vec3 hv = normalize(l + vec3(0.0, 0.0, 1.0));
  float spec = pow(clamp(dot(n, hv), 0.0, 1.0), 42.0);

  // Brand ramp: near-black maroon -> maroon -> crimson.
  vec3 deep    = vec3(0.13, 0.010, 0.020);
  vec3 maroon  = vec3(0.38, 0.035, 0.045);
  vec3 crimson = vec3(0.70, 0.085, 0.095);
  vec3 col = mix(deep, maroon, smoothstep(0.05, 0.7, h));
  col = mix(col, crimson, smoothstep(0.6, 1.0, h) * 0.5);
  col *= 0.42 + 0.85 * diff;
  col += spec * vec3(1.0, 0.42, 0.40) * 0.38;

  // Soft sheen that follows the pointer.
  vec2 dm = (uv - uMouse) * vec2(aspect, 1.0);
  col += vec3(0.55, 0.07, 0.08) * 0.22 * exp(-dot(dm, dm) * 3.5);

  // Heartbeat: a faint warm wash from the right side.
  float r = length((uv - vec2(0.85, 0.55)) * vec2(aspect, 1.0));
  col += vec3(0.50, 0.05, 0.06) * uBeat * 0.10 * exp(-r * 1.6);

  // Vignette (heavier at the bottom where the stats sit) and intro exposure.
  float vig = smoothstep(1.35, 0.25, length((uv - vec2(0.5, 0.6)) * vec2(1.0, 1.15)));
  col *= mix(0.55, 1.0, vig);
  col *= mix(0.35, 1.0, uIntro);

  // Dither to kill banding in the dark reds.
  col += (hash(gl_FragCoord.xy + fract(t) * 17.0) - 0.5) / 255.0 * 1.5;

  gl_FragColor = vec4(col, 1.0);
}
`;

// Fraction of CSS pixels actually shaded. The image is low-frequency, so ~0.5x
// is indistinguishable once stretched; adaptive quality lowers it further on
// slow GPUs.
const BASE_SCALE = 0.55;
const LOW_END_SCALE = 0.4;
const MIN_SCALE = 0.28;
const MAX_PIXELS = 900_000;
const INTRO_SECONDS = 1.6;
const BEAT_PERIOD = 3.2; // seconds between heartbeats
const STATIC_TIME = 6.0; // frame shown when motion is reduced

const isLowEndDevice = () => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) ||
    (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4)
  );
};

/** "Lub-dub": two quick bumps, then rest. Returns 0..1. */
const heartbeat = (time: number) => {
  const phase = (time % BEAT_PERIOD) / BEAT_PERIOD;
  const bump = (center: number, width: number) => Math.exp(-(((phase - center) / width) ** 2));
  return Math.min(1, bump(0.04, 0.035) + 0.65 * bump(0.13, 0.04));
};

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader failed");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || "shader compile failed");
  }
  return shader;
}

interface HeroShaderProps {
  className?: string;
}

export default function HeroShader({ className = "" }: HeroShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    let rafId = 0;
    let disposed = false;
    let inView = true;
    let pageVisible = document.visibilityState !== "hidden";
    let contextLost = false;
    let lowEnd = false;
    let scale = BASE_SCALE;
    let frameInterval = 1000 / 60;
    let lastFrame = 0;
    let elapsed = 0;
    let introStart = -1;
    let slowFrames = 0;
    const mouse = { x: 0.62, y: 0.6, tx: 0.62, ty: 0.6 };

    const reducedMotionQuery =
      typeof window.matchMedia === "function" ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
    let reducedMotion = !!reducedMotionQuery?.matches;

    const resize = () => {
      if (!gl) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const s = Math.min(scale, Math.sqrt(MAX_PIXELS / (w * h)));
      const bw = Math.max(1, Math.round(w * s));
      const bh = Math.max(1, Math.round(h * s));
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
        gl.viewport(0, 0, bw, bh);
      }
      gl.uniform2f(uniforms.uRes, bw, bh);
    };

    const draw = (time: number, intro: number, beat: number) => {
      if (!gl || contextLost) return;
      gl.uniform1f(uniforms.uTime, time);
      gl.uniform1f(uniforms.uIntro, intro);
      gl.uniform1f(uniforms.uBeat, beat);
      gl.uniform2f(uniforms.uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const drawStill = () => draw(reducedMotion ? STATIC_TIME : elapsed, 1, 0);

    const loop = (now: number) => {
      rafId = requestAnimationFrame(loop);
      const delta = now - lastFrame;
      if (delta < frameInterval - 1) return;
      lastFrame = now;

      // Adaptive quality: if frames keep arriving late, shade fewer pixels,
      // and as a last resort drop to 30fps.
      if (delta > frameInterval * 1.6 && delta < 250) {
        if (++slowFrames > 45) {
          slowFrames = 0;
          if (scale > MIN_SCALE) {
            scale = Math.max(MIN_SCALE, scale * 0.8);
            resize();
          } else if (frameInterval < 30) {
            frameInterval = 1000 / 30;
          }
        }
      } else if (slowFrames > 0) {
        slowFrames--;
      }

      elapsed += Math.min(delta, 100) / 1000;
      if (introStart < 0) introStart = elapsed;
      const introT = Math.min(1, (elapsed - introStart) / INTRO_SECONDS);
      const intro = 1 - (1 - introT) ** 3;

      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      draw(elapsed, intro, heartbeat(elapsed));
    };

    const sync = () => {
      const run = !!gl && inView && pageVisible && !contextLost && !reducedMotion;
      if (run && !rafId) {
        lastFrame = performance.now();
        rafId = requestAnimationFrame(loop);
      } else if (!run && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const init = () => {
      if (disposed) return;
      try {
        gl = canvas.getContext("webgl", {
          alpha: false,
          antialias: false,
          depth: false,
          stencil: false,
          premultipliedAlpha: false,
          preserveDrawingBuffer: false,
          powerPreference: "low-power",
        });
        if (!gl) throw new Error("WebGL unavailable");

        const program = gl.createProgram();
        if (!program) throw new Error("createProgram failed");
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          throw new Error(gl.getProgramInfoLog(program) || "link failed");
        }
        gl.useProgram(program);

        // One oversized triangle covers the whole viewport.
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, "aPos");
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        uniforms = Object.fromEntries(
          ["uRes", "uTime", "uMouse", "uIntro", "uBeat"].map((name) => [name, gl!.getUniformLocation(program, name)]),
        );

        lowEnd = isLowEndDevice();
        scale = lowEnd ? LOW_END_SCALE : BASE_SCALE;
        frameInterval = lowEnd ? 1000 / 30 : 1000 / 60;
        resize();
        if (reducedMotion) drawStill();
        else draw(0, 0, 0);
        setReady(true);
        sync();
      } catch (error) {
        console.warn("Hero shader unavailable, using static background:", error);
        gl = null;
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault(); // lets the browser restore it (iOS drops contexts in the background)
      contextLost = true;
      sync();
    };
    const onContextRestored = () => {
      contextLost = false;
      init();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    // Start once the browser is idle so first paint and hydration come first.
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if ("requestIdleCallback" in window) idleId = window.requestIdleCallback(init, { timeout: 700 });
    else timeoutId = setTimeout(init, 120);

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            sync();
          })
        : null;
    io?.observe(container);

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => { resize(); if (!rafId) drawStill(); }) : null;
    ro?.observe(container);

    const onVisibility = () => {
      pageVisible = document.visibilityState !== "hidden";
      sync();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onReducedMotion = () => {
      reducedMotion = !!reducedMotionQuery?.matches;
      drawStill();
      sync();
    };
    if (reducedMotionQuery?.addEventListener) reducedMotionQuery.addEventListener("change", onReducedMotion);
    else reducedMotionQuery?.addListener?.(onReducedMotion);

    // Pointer sheen only on devices with a real hover pointer.
    const finePointer = typeof window.matchMedia === "function" && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const onPointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.tx = (event.clientX - rect.left) / rect.width;
      mouse.ty = 1 - (event.clientY - rect.top) / rect.height;
    };
    const target = container.parentElement ?? container;
    if (finePointer) target.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      disposed = true;
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
      if (rafId) cancelAnimationFrame(rafId);
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (reducedMotionQuery?.removeEventListener) reducedMotionQuery.removeEventListener("change", onReducedMotion);
      else reducedMotionQuery?.removeListener?.(onReducedMotion);
      target.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      gl = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`absolute inset-0 overflow-hidden bg-[radial-gradient(ellipse_80%_70%_at_30%_25%,#7f1d1d_0%,#450a0a_55%,#2a0508_100%)] ${className}`}
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-1000 ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
