/**
 * Canvas animation is inherently imperative: the render loop mutates the spark pattern, canvas
 * dimensions, mouse position, and the RAF handle in place. Disable the functional-programming lint
 * rules for this file, mirroring the other canvas utilities (see `DotPattern`).
 */
/* eslint-disable @silverhand/fp/no-let */
/* eslint-disable @silverhand/fp/no-mutation */
/* eslint-disable @silverhand/fp/no-mutating-methods */
import { useEffect, useRef } from 'react';

import styles from './index.module.scss';
import { AiCoResearcherLogoSVGBase64 } from './logo';

/** Spark grid geometry */
const CELL = 12;
const SIZES = [3.2, 2, 1.3];
/** Cursor radius (px) within which sparks light up. */
const RADIUS = 48;
const SPARK_COLOR = '#fbfbff';

type Spark = {
  x: number;
  y: number;
  size: number;
  /** Rotation so alternating sparks form + and × orientations. */
  rot: number;
};

/**
 * Scale the canvas backing store to the device pixel ratio (capped at 2) so the sparks stay crisp
 * on high-DPI displays, then configure the context to draw in CSS-pixel coordinates.
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
  return { ctx, width: cssWidth, height: cssHeight };
};

/** Build a staggered honeycomb grid of spark positions covering the given area. */
const buildPattern = (width: number, height: number): Spark[] => {
  const points: Spark[] = [];
  let index = 0;

  for (let row = 0; row * CELL * 0.88 < height + CELL; row++) {
    for (let col = 0; col * CELL < width + CELL; col++) {
      const ox = row % 2 === 0 ? 0 : CELL * 0.5;
      points.push({
        x: col * CELL + ox + 2,
        y: row * CELL * 0.88 + 2,
        size: SIZES[index % 3] ?? 1.3,
        rot: index % 2 === 0 ? 0 : Math.PI / 4,
      });
      index += 1;
    }
  }

  return points;
};

/**
 * The "AI Co-researcher" logo with a decorative sparkle effect: hovering over the logo lights up the
 * four-pointed sparks nearest the cursor, fading out with distance.
 */
export const AICoResearcherLogo = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!wrapper || !canvas || !ctx) {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let pattern: Spark[] = [];
    let width = 0;
    let height = 0;
    let mouseX = -999;
    let mouseY = -999;
    let rafId = 0;

    const resize = () => {
      const surface = setupCanvas(canvas, wrapper.offsetWidth, wrapper.offsetHeight);
      width = surface.width;
      height = surface.height;
      pattern = buildPattern(width, height);
    };

    const drawSpark = (spark: Spark, alpha: number) => {
      ctx.save();
      ctx.translate(spark.x, spark.y);
      ctx.rotate(spark.rot);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = SPARK_COLOR;
      ctx.beginPath();
      const r1 = spark.size;
      const r2 = spark.size * 0.2;

      for (let j = 0; j < 8; j++) {
        const angle = (j * Math.PI) / 4;
        const rad = j % 2 === 0 ? r1 : r2;
        if (j === 0) {
          ctx.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
        } else {
          ctx.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
        }
      }

      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      if (mouseX > -999) {
        for (const spark of pattern) {
          const distribution = Math.hypot(spark.x - mouseX, spark.y - mouseY);
          if (distribution < RADIUS) {
            drawSpark(spark, (1 - distribution / RADIUS) ** 1.5 * 0.7);
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -999;
      mouseY = -999;
    };

    resize();
    draw();

    window.addEventListener('resize', resize);
    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={wrapperRef} className={styles.aICoResearcherLogoWrapper}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <img className={styles.logo} src={AiCoResearcherLogoSVGBase64} alt="AICoResearcherLogo" />
    </div>
  );
};
/* eslint-enable @silverhand/fp/no-mutating-methods */
/* eslint-enable @silverhand/fp/no-mutation */
/* eslint-enable @silverhand/fp/no-let */
