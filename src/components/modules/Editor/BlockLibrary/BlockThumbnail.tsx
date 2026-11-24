import type { ReactNode } from "react";
import type { BlockType } from "@/types/document.types";

/** Схематичные превью блоков: серые формы и один акцентный элемент. Статичный SVG, без iframe */
const THUMBS: Record<BlockType, ReactNode> = {
  navbar: (
    <>
      <rect x="8" y="14" width="14" height="6" rx="3" className="fill-[var(--color-text)]" />
      <rect x="44" y="15" width="12" height="4" rx="2" />
      <rect x="62" y="15" width="12" height="4" rx="2" />
      <rect x="92" y="13" width="20" height="8" rx="4" className="fill-[var(--color-primary)]" />
    </>
  ),
  hero: (
    <>
      <rect x="30" y="10" width="60" height="7" rx="3" className="fill-[var(--color-text)]" />
      <rect x="40" y="22" width="40" height="4" rx="2" />
      <rect x="44" y="34" width="32" height="9" rx="4.5" className="fill-[var(--color-primary)]" />
    </>
  ),
  logos: (
    <>
      {[10, 34, 58, 82].map((x) => (
        <rect key={x} x={x} y="18" width="20" height="8" rx="4" />
      ))}
    </>
  ),
  features: (
    <>
      {[10, 46, 82].map((x) => (
        <g key={x}>
          <rect x={x} y="12" width="8" height="8" rx="2" className="fill-[var(--color-primary)]" />
          <rect x={x} y="25" width="28" height="4" rx="2" className="fill-[var(--color-text)]" />
          <rect x={x} y="33" width="24" height="3" rx="1.5" />
        </g>
      ))}
    </>
  ),
  testimonials: (
    <>
      <rect x="14" y="12" width="44" height="28" rx="5" />
      <rect x="64" y="12" width="44" height="28" rx="5" />
      <circle cx="24" cy="32" r="3.5" className="fill-[var(--color-primary)]" />
      <circle cx="74" cy="32" r="3.5" className="fill-[var(--color-primary)]" />
    </>
  ),
  pricing: (
    <>
      <rect x="10" y="10" width="32" height="34" rx="5" />
      <rect
        x="44"
        y="8"
        width="32"
        height="38"
        rx="5"
        className="fill-none stroke-[var(--color-primary)]"
        strokeWidth="1.5"
      />
      <rect x="78" y="10" width="32" height="34" rx="5" />
    </>
  ),
  faq: (
    <>
      {[10, 22, 34].map((y) => (
        <rect key={y} x="14" y={y} width="92" height="8" rx="4" />
      ))}
    </>
  ),
  cta: (
    <>
      <rect x="10" y="8" width="100" height="38" rx="6" className="fill-[var(--color-primary)]" />
      <rect x="34" y="18" width="52" height="5" rx="2.5" className="fill-[var(--color-bg)]" />
      <rect x="46" y="30" width="28" height="8" rx="4" className="fill-[var(--color-bg)]" />
    </>
  ),
  footer: (
    <>
      <rect x="10" y="28" width="100" height="1" className="fill-[var(--color-border)]" />
      <rect x="10" y="36" width="20" height="4" rx="2" />
      <rect x="82" y="36" width="12" height="4" rx="2" />
      <rect x="98" y="36" width="12" height="4" rx="2" />
    </>
  ),
};

const BlockThumbnail = ({ type }: { type: BlockType }) => {
  return (
    <svg
      viewBox="0 0 120 54"
      aria-hidden
      className="h-auto w-full rounded-lg bg-[var(--color-surface)] fill-[var(--color-border)]"
    >
      {THUMBS[type]}
    </svg>
  );
};

export default BlockThumbnail;
