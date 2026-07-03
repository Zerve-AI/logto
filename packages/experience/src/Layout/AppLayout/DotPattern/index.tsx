/**
 * Canvas animation is inherently imperative: the render loop mutates dot state, canvas dimensions,
 * and the RAF handle in place. Disable the functional-programming lint rules for this file, mirroring
 * the other canvas utilities (see `utils/image-crop.ts`).
 */
/* eslint-disable @silverhand/fp/no-let */
/* eslint-disable @silverhand/fp/no-mutation */
/* eslint-disable @silverhand/fp/no-mutating-methods */
/* eslint-disable id-length */
import { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';

import styles from './index.module.scss';

/* Honeycomb grid geometry (Figma node 79:567). */
const COL_SPACING = isMobile ? 55 : 62;
const ROW_SPACING = isMobile ? 17 : 35;
const ROW_OFFSET = COL_SPACING * 0.5;
const DOT_RADIUS = isMobile ? 1 : 1.6;
const INFLUENCE = 130;
const MAX_LIFT = 20;
const DOT_COLOR = '#fbfbff';

/**
 * Vertical offset (px) applied to every dot's resting position, i.e. the whole honeycomb grid.
 * Positive shifts the dots down, negative shifts them up. The generated row range grows with this so
 * shifting never leaves an uncovered gap.
 */
const GRID_OFFSET_Y = 20;

type Dot = {
  /** Resting position. */
  ox: number;
  oy: number;
  /** Lift along the z axis and its velocity. */
  z: number;
  vz: number;
  /** Base opacity derived from the radial fade. */
  baseAlpha: number;
};

/** Center and radius of the radial fade that dims dots away from the top-center glow. */
type Fade = {
  cx: number;
  cy: number;
  radius: number;
};

/**
 * Scale the canvas backing store to the device pixel ratio (capped at 2) so the dots stay crisp on
 * high-DPI displays, then configure the context to draw in CSS-pixel coordinates. Mirrors the
 * reference `CanvasDpr.setup` helper.
 */
const setupCanvas = (canvas: HTMLCanvasElement, cssWidth: number, cssHeight: number) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }
  return { ctx, dpr, width: cssWidth, height: cssHeight };
};

/** Radial fade: a dot dims with its distance from the top-center glow. */
const computeBaseAlpha = (ox: number, oy: number, fade: Fade) => {
  const dx = ox - fade.cx;
  const dy = oy - fade.cy;
  const distribution = Math.hypot(dx, dy);
  return Math.max(0, 1 - distribution / fade.radius) * 0.5;
};

/**
 * A honeycomb dot pattern rendered on a canvas that reacts to the mouse: dots near the cursor
 * lift up and brighten. Fills its positioned parent and ignores pointer events so it stays purely
 * decorative.
 */
const DotPattern = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!container || !canvas || !ctx) {
      return;
    }

    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = 0;

    const buildDots = (cssWidth: number, cssHeight: number, fade: Fade) => {
      const nextDots: Dot[] = [];
      const cols = Math.ceil(cssWidth / COL_SPACING) + 2;
      // Cover the viewport regardless of GRID_OFFSET_Y so the offset never exposes an empty band.
      const startRow = Math.floor((-ROW_SPACING - GRID_OFFSET_Y) / ROW_SPACING);
      const endRow = Math.ceil((cssHeight + ROW_SPACING - GRID_OFFSET_Y) / ROW_SPACING);

      for (let r = startRow; r <= endRow; r++) {
        for (let c = 0; c < cols; c++) {
          const ox = c * COL_SPACING + (r % 2 === 0 ? 0 : ROW_OFFSET);
          const oy = GRID_OFFSET_Y + r * ROW_SPACING;
          nextDots.push({ ox, oy, z: 0, vz: 0, baseAlpha: computeBaseAlpha(ox, oy, fade) });
        }
      }

      return nextDots;
    };

    const resize = () => {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      const surface = setupCanvas(canvas, w, h);
      width = surface.width;
      height = surface.height;

      // Anchor the fade to the top-center glow: dots are brightest there and fade downward/outward.
      const fade: Fade = {
        cx: width / 2,
        cy: 0,
        radius: Math.min(width, height) * 0.55,
      };
      dots = buildDots(width, height, fade);
    };

    const drawHexagon = (x: number, y: number, radius: number, alpha: number) => {
      if (alpha < 0.015) {
        return;
      }

      ctx.save();
      ctx.globalAlpha = Math.min(alpha, 0.85);
      ctx.fillStyle = DOT_COLOR;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = x + radius * Math.cos(angle);
        const py = y + radius * Math.sin(angle);
        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (const dot of dots) {
        if (dot.baseAlpha < 0.015) {
          continue;
        }

        const dx = dot.ox - mouseX;
        const dy = dot.oy - mouseY;
        const distribution = Math.hypot(dx, dy);
        let targetZ = 0;

        if (distribution < INFLUENCE && mouseX > -999) {
          targetZ = (1 - distribution / INFLUENCE) ** 2 * MAX_LIFT;
        }

        dot.vz += (targetZ - dot.z) * 0.08;
        dot.vz *= 0.78;
        dot.z += dot.vz;

        const scale = 1 + dot.z / 100;
        const radius = DOT_RADIUS * scale;
        const alpha = dot.baseAlpha + (dot.z / MAX_LIFT) * 0.35;

        drawHexagon(dot.ox, dot.oy - dot.z, radius, alpha);
      }

      rafId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (isMobile) {
        return;
      }
      const rect = container.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      if (isMobile) {
        return;
      }
      mouseX = -9999;
      mouseY = -9999;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} aria-hidden className={styles.dotPattern}>
      <div className={styles.glow} />
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
};

export default DotPattern;
/* eslint-enable id-length */
/* eslint-enable @silverhand/fp/no-mutating-methods */
/* eslint-enable @silverhand/fp/no-mutation */
/* eslint-enable @silverhand/fp/no-let */
