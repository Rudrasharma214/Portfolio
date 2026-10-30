import { useEffect, useMemo, useRef } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';
import {
  DEFAULT_HEX,
  HOLD_MS,
  SNIPPET,
  TOKEN_HEX,
  TOTAL_CHARS,
  TYPE_MS,
} from '@/components/hero/codeSnippet';

const WIDTH = 1024;
const HEIGHT = 640;
const PADDING = 46;
const LINE_HEIGHT = 34;
const CODE_FONT = '26px "SFMono-Regular", ui-monospace, Consolas, monospace';
const LABEL_FONT = '22px "SFMono-Regular", ui-monospace, Consolas, monospace';

function draw(ctx: CanvasRenderingContext2D, revealed: number) {
  ctx.fillStyle = '#1b1816';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = '#ff6b1a';
  ctx.beginPath();
  ctx.arc(44, 40, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffb627';
  ctx.beginPath();
  ctx.arc(74, 40, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#46403a';
  ctx.beginPath();
  ctx.arc(104, 40, 9, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#76706a';
  ctx.font = LABEL_FONT;
  ctx.textBaseline = 'middle';
  ctx.fillText('ABOUTME.TS', 136, 41);

  ctx.font = CODE_FONT;
  ctx.textBaseline = 'alphabetic';

  let left = revealed;
  let y = 110;
  for (let li = 0; li < SNIPPET.length; li++) {
    const line = SNIPPET[li];
    const visible = left > 0 || li === 0;
    if (!visible) break;

    let x = PADDING;
    for (const tok of line) {
      const take = Math.max(0, Math.min(tok.text.length, left));
      const str = tok.text.slice(0, take);
      left -= take;
      if (str) {
        ctx.fillStyle = tok.cls ? TOKEN_HEX[tok.cls] : DEFAULT_HEX;
        ctx.fillText(str, x, y);
        x += ctx.measureText(str).width;
      }
      if (take < tok.text.length) break;
    }
    left -= 1;
    y += LINE_HEIGHT;
  }
}

/**
 * Draws the same typing animation as `CodeMacBook` onto a canvas, as a
 * `CanvasTexture` for the 3D laptop's screen. Runs off refs, not React
 * state — this redraws every ~26ms and a screen isn't worth a re-render.
 */
export function useCodeScreenTexture(paused: boolean) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  if (!canvasRef.current) {
    const canvas = document.createElement('canvas');
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    canvasRef.current = canvas;
  }

  const texture = useMemo(() => {
    const t = new CanvasTexture(canvasRef.current!);
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);

  useEffect(() => () => texture.dispose(), [texture]);

  useEffect(() => {
    const ctx = canvasRef.current!.getContext('2d');
    if (!ctx) return;

    const redraw = (revealed: number) => {
      draw(ctx, revealed);
      texture.needsUpdate = true;
    };

    if (paused) {
      redraw(TOTAL_CHARS);
      return;
    }

    let revealed = 0;
    let holding = false;
    redraw(revealed);

    const id = setInterval(() => {
      if (holding) return;
      if (revealed >= TOTAL_CHARS) {
        holding = true;
        setTimeout(() => {
          holding = false;
          revealed = 0;
          redraw(revealed);
        }, HOLD_MS);
        return;
      }
      revealed += 1;
      redraw(revealed);
    }, TYPE_MS);

    return () => clearInterval(id);
  }, [paused, texture]);

  return texture;
}
