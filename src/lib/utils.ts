import { clsx, type ClassValue } from "clsx";

/**
 * Conditional class composition.
 *
 * This was `twMerge(clsx(inputs))`, the shadcn/ui default. `tailwind-merge` was
 * removed on 2026-08-18 after being measured, and the measurement is worth
 * keeping because the result was the opposite of what the dependency is for:
 *
 *   - it was **29.6% of the entry chunk** — 8.32 kB gzip, more than every
 *     component in `src/components` combined
 *   - across all seven prerendered documents it changed exactly **one** class
 *     attribute, and that change was a **defect**
 *
 * It treats `text-lead` — our custom font-size token — as conflicting with
 * `text-ink-muted`, a colour, because both begin `text-`. It cannot know
 * otherwise: the token is ours, not Tailwind's. So it silently deleted
 * `text-lead` from every section subhead on the site, which rendered at 16px
 * instead of the authored 20px. Measured both ways to be sure.
 *
 * `tailwind-merge` can be taught custom groups via `extendTailwindMerge`, which
 * would fix the defect and keep the 8.32 kB. It is not worth it: the same diff
 * showed **zero** genuine conflicts anywhere on the site, so the dependency
 * would be resolving nothing.
 *
 * The tradeoff this accepts: conflicting utilities passed through `className`
 * are no longer resolved at runtime, and the later class in source order wins.
 * Avoid conflicts by authoring rather than by resolving them — which is also
 * what keeps these class strings readable. `Button` already does this, guarding
 * `SIZES[size]` behind `variant !== "tertiary"` rather than letting the two
 * fight.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
